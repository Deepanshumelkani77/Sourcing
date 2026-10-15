const FollowUp = require("../models/FollowUp");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

// @desc    Create a new follow-up
// @route   POST /api/crm/followups
// @access  Private/Admin
exports.createFollowUp = async (req, res) => {
  try {
    const followUpData = {
      ...req.body,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || req.user._id, // Default to current user if not provided
    };

    const followUp = await FollowUp.create(followUpData);

    // Update lead or customer with follow-up info
    if (followUp.leadId) {
      await Lead.findByIdAndUpdate(followUp.leadId, {
        followUpDate: followUp.scheduledDate,
      });
    }

    if (followUp.customerId) {
      await Customer.findByIdAndUpdate(followUp.customerId, {
        lastContactDate: followUp.scheduledDate,
      });
    }

    res.status(201).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all follow-ups
// @route   GET /api/crm/followups
// @access  Private/Admin
exports.getFollowUps = async (req, res) => {
  try {
    const { status, type, assignedTo, dateFrom, dateTo } = req.query;

    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (dateFrom || dateTo) {
      query.scheduledDate = {};
      if (dateFrom) query.scheduledDate.$gte = new Date(dateFrom);
      if (dateTo) query.scheduledDate.$lte = new Date(dateTo);
    }

    const followUps = await FollowUp.find(query)
      .populate("leadId", "customerName companyName")
      .populate("customerId", "customerName companyName")
      .populate("assignedTo", "name email")
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: followUps.length,
      data: followUps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get today's follow-ups
// @route   GET /api/crm/followups/today
// @access  Private/Admin
exports.getTodayFollowUps = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const followUps = await FollowUp.find({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: "Scheduled",
    })
      .populate("leadId", "customerName companyName")
      .populate("customerId", "customerName companyName")
      .populate("assignedTo", "name email")
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: followUps.length,
      data: followUps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get overdue follow-ups
// @route   GET /api/crm/followups/overdue
// @access  Private/Admin
exports.getOverdueFollowUps = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const followUps = await FollowUp.find({
      scheduledDate: { $lt: today },
      status: "Scheduled",
    })
      .populate("leadId", "customerName companyName")
      .populate("customerId", "customerName companyName")
      .populate("assignedTo", "name email")
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: followUps.length,
      data: followUps,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single follow-up
// @route   GET /api/crm/followups/:id
// @access  Private/Admin
exports.getFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate("leadId", "customerName companyName")
      .populate("customerId", "customerName companyName")
      .populate("assignedTo", "name email");

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    res.status(200).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update follow-up
// @route   PUT /api/crm/followups/:id
// @access  Private/Admin
exports.updateFollowUp = async (req, res) => {
  try {
    let followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete follow-up
// @route   PUT /api/crm/followups/:id/complete
// @access  Private/Admin
exports.completeFollowUp = async (req, res) => {
  try {
    let followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    followUp.status = "Completed";
    followUp.completedDate = new Date();
    followUp.outcome = req.body.outcome;
    followUp.notes = req.body.notes || followUp.notes;

    // Schedule next follow-up if provided
    if (req.body.nextFollowUpDate) {
      const nextFollowUp = await FollowUp.create({
        leadId: followUp.leadId,
        customerId: followUp.customerId,
        type: followUp.type,
        scheduledDate: req.body.nextFollowUpDate,
        assignedTo: followUp.assignedTo,
        createdBy: req.user._id,
      });
      followUp.nextFollowUpDate = nextFollowUp._id;
    }

    await followUp.save();

    res.status(200).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete follow-up
// @route   DELETE /api/crm/followups/:id
// @access  Private/Admin
exports.deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    await followUp.deleteOne();

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

// @desc    Get follow-up statistics
// @route   GET /api/crm/followups/stats
// @access  Private/Admin
exports.getFollowUpStats = async (req, res) => {
  try {
    const totalFollowUps = await FollowUp.countDocuments();
    const scheduled = await FollowUp.countDocuments({ status: "Scheduled" });
    const completed = await FollowUp.countDocuments({ status: "Completed" });
    const missed = await FollowUp.countDocuments({ status: "Missed" });
    const cancelled = await FollowUp.countDocuments({ status: "Cancelled" });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayFollowUps = await FollowUp.countDocuments({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const overdue = await FollowUp.countDocuments({
      scheduledDate: { $lt: startOfDay },
      status: "Scheduled",
    });

    // Follow-ups by type
    const byType = await FollowUp.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFollowUps,
        scheduled,
        completed,
        missed,
        cancelled,
        todayFollowUps,
        overdue,
        byType,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
