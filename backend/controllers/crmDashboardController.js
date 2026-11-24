const Lead = require("../models/Lead");
const User = require("../models/User");
const FollowUp = require("../models/FollowUp");

// @desc    Get complete CRM dashboard statistics
// @route   GET /api/crm/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Lead Statistics
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const leadsThisMonth = await Lead.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const leadsToday = await Lead.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const wonLeads = await Lead.countDocuments({ status: "Won" });

    // Customer Statistics (customers are User documents)
    const totalCustomers = await User.countDocuments();
    const activeCustomers = await User.countDocuments({ customerStatus: "Active" });
    const customersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Follow-up Statistics
    const todayFollowUps = await FollowUp.countDocuments({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: "Scheduled",
    });

    const overdueFollowUps = await FollowUp.countDocuments({
      scheduledDate: { $lt: startOfDay },
      status: "Scheduled",
    });

    // Conversion Rate
    const conversionRate = totalLeads > 0
      ? ((wonLeads / totalLeads) * 100).toFixed(2)
      : 0;

    // Recent Activity
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName companyName status priority createdAt");

    const upcomingFollowUps = await FollowUp.find({
      scheduledDate: { $gte: startOfDay },
      status: "Scheduled",
    })
      .sort({ scheduledDate: 1 })
      .limit(5)
      .populate("leadId", "customerName")
      .populate("customerId", "customerName")
      .populate("assignedTo", "name");

    // Lead Status Distribution
    const leadStatusDistribution = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Source Distribution
    const leadSourceDistribution = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          thisMonth: leadsThisMonth,
          today: leadsToday,
          won: wonLeads,
          distribution: leadStatusDistribution,
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          thisMonth: customersThisMonth,
        },
        followUps: {
          today: todayFollowUps,
          overdue: overdueFollowUps,
          upcoming: upcomingFollowUps,
        },
        metrics: {
          conversionRate: parseFloat(conversionRate),
        },
        recent: {
          leads: recentLeads,
        },
        sources: leadSourceDistribution,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get lead source report
// @route   GET /api/crm/reports/sources
// @access  Private/Admin
exports.getSourceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const sourceStats = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
          qualified: {
            $sum: { $cond: [{ $eq: ["$status", "Qualified"] }, 1, 0] },
          },
          won: {
            $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: sourceStats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
