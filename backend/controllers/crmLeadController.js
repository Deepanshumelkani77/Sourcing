const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

// Generate lead number
const generateLeadNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `LD${year}${month}${random}`;
};

// @desc    Create a new lead
// @route   POST /api/crm/leads
// @access  Private/Admin
exports.createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      leadNumber: generateLeadNumber(),
      createdBy: req.user._id,
    };

    const lead = await Lead.create(leadData);

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
    const { status, priority, source, assignedTo } = req.query;

    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
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
      .populate("assignedTo", "name email")
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

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

    // Update lead - mark as qualified (workflow: qualified leads move to deals)
    lead.convertedToCustomer = true;
    lead.customerId = customer._id;
    lead.status = "Qualified";
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

    const validStatuses = ["New", "Contacted", "Qualified", "Lost"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Valid statuses are: New, Contacted, Qualified, Lost",
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
