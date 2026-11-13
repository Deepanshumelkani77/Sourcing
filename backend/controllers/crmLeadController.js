const Lead = require("../models/Lead");
const LeadActivity = require("../models/LeadActivity");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");
const { calculateLeadScore } = require("../utils/leadScore");

// @desc    Get employees for lead assignment
// @route   GET /api/crm/employees
// @access  Private/Admin
exports.getEmployeesForAssignment = async (req, res) => {
  try {
    const employees = await Admin.find({
      role: { $in: ['employee', 'admin', 'main_admin'] },
      isActive: true
    })
      .select('firstName lastName email department role')
      .sort({ firstName: 1, lastName: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new lead
// @route   POST /api/crm/leads
// @access  Private/Admin
exports.createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user._id,
    };

    // Auto-generate display name from first/last name when not provided
    if (!leadData.customerName && (leadData.firstName || leadData.lastName)) {
      leadData.customerName = `${leadData.firstName || ""} ${leadData.lastName || ""}`.trim();
    }

    // Auto-calculate score, grade and rating
    Object.assign(leadData, calculateLeadScore(leadData));

    const lead = await Lead.create(leadData);

    // Activity timeline: record lead creation
    await LeadActivity.create({
      leadId: lead._id,
      type: "System",
      subject: "Lead Created",
      description: `Lead ${lead.leadNumber || ""} received from ${lead.source || "manual entry"}.`,
      activityDate: lead.createdAt,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all leads
// @route   GET /api/crm/leads
// @access  Private/Admin
exports.getLeads = async (req, res) => {
  try {
    const { status, priority, source, assignedTo, leadRating, qualificationStatus, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;
    if (leadRating) query.leadRating = leadRating;
    if (qualificationStatus) query.qualificationStatus = qualificationStatus;

    if (search) {
      query.$or = [
        { leadNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { productRequirement: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "firstName lastName email department")
      .populate("nextActionOwner", "firstName lastName email")
      .populate("customerId", "customerName companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single lead
// @route   GET /api/crm/leads/:id
// @access  Private/Admin
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "firstName lastName email department")
      .populate("nextActionOwner", "firstName lastName email")
      .populate("customerId", "customerName companyName");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lead
// @route   PUT /api/crm/leads/:id
// @access  Private/Admin
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Merge updates and recalculate score/grade/rating
    Object.assign(lead, req.body);
    Object.assign(lead, calculateLeadScore(lead.toObject()));
    lead = await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/crm/leads/:id
// @access  Private/Admin
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Convert lead to customer
// @route   POST /api/crm/leads/:id/convert
// @access  Private/Admin
exports.convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Create customer from lead
    const customerData = {
      customerName: lead.customerName,
      companyName: lead.companyName || lead.customerName,
      phone: lead.phone,
      whatsapp: lead.whatsapp || lead.phone,
      email: lead.email,
      source: lead.source,
      assignedTo: lead.assignedTo,
      leadId: lead._id,
      createdBy: req.user._id,
    };

    const customer = await Customer.create(customerData);

    // Update lead - mark as converted
    lead.convertedToCustomer = true;
    lead.customerId = customer._id;
    lead.status = "Qualified";
    lead.conversionStatus = "Converted to Customer";
    lead.conversionDate = new Date();
    lead.convertedBy = req.user._id;
    lead.revenueBooked = lead.dealValue || 0;
    lead.leadStage = "Converted";
    await lead.save();

    res.status(200).json({
      success: true,
      data: { lead, customer },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get lead statistics
// @route   GET /api/crm/leads/stats
// @access  Private/Admin
exports.getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const contacted = await Lead.countDocuments({ status: "Contacted" });
    const qualified = await Lead.countDocuments({ status: "Qualified" });
    const lost = await Lead.countDocuments({ status: "Lost" });

    const highPriority = await Lead.countDocuments({ priority: "High" });
    const urgent = await Lead.countDocuments({ priority: "Urgent" });

    const totalDealValue = await Lead.aggregate([
      { $match: { status: { $ne: "Lost" } } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contacted,
        qualified,
        lost,
        highPriority,
        urgent,
        totalDealValue: totalDealValue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lead status (qualification workflow)
// @route   PUT /api/crm/leads/:id/status
// @access  Private/Admin
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "New",
      "Contacted",
      "Follow-Up",
      "Interested",
      "Site Visit",
      "Quotation Sent",
      "Negotiation",
      "Qualified",
      "Won",
      "Lost",
      "Junk",
      "Duplicate",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`,
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.status = status;
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get activity timeline for a lead
// @route   GET /api/crm/leads/:id/activities
// @access  Private/Admin
exports.getLeadActivities = async (req, res) => {
  try {
    const activities = await LeadActivity.find({ leadId: req.params.id })
      .populate("createdBy", "firstName lastName email")
      .sort({ activityDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add an activity to a lead timeline
// @route   POST /api/crm/leads/:id/activities
// @access  Private/Admin
exports.createLeadActivity = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const activity = await LeadActivity.create({
      ...req.body,
      leadId: lead._id,
      createdBy: req.user._id,
    });

    // Keep follow-up counters in sync when contact-type activities are logged
    if (["Call Log", "WhatsApp Log", "Email Log", "Meeting Log", "Site-Visit Log"].includes(activity.type)) {
      lead.numberOfFollowUps = (lead.numberOfFollowUps || 0) + 1;
      lead.lastContactDate = activity.activityDate || new Date();
      lead.lastContactMethod = {
        "Call Log": "Call",
        "WhatsApp Log": "WhatsApp",
        "Email Log": "Email",
        "Meeting Log": "Meeting",
        "Site-Visit Log": "Site Visit",
      }[activity.type] || "";
      Object.assign(lead, calculateLeadScore(lead.toObject()));
      await lead.save();
    }

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an activity from a lead timeline
// @route   DELETE /api/crm/leads/:id/activities/:activityId
// @access  Private/Admin
exports.deleteLeadActivity = async (req, res) => {
  try {
    const activity = await LeadActivity.findOneAndDelete({
      _id: req.params.activityId,
      leadId: req.params.id,
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
