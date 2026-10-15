const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const FollowUp = require("../models/FollowUp");
const Deal = require("../models/Deal");
const CRMQuotation = require("../models/CRMQuotation");
const Admin = require("../models/Admin");

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

    // Customer Statistics
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: "Active" });
    const customersThisMonth = await Customer.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Deal Statistics
    const totalDeals = await Deal.countDocuments();
    const activeDeals = await Deal.countDocuments({
      stage: { $in: ["Qualified", "Sourcing/Proposal", "Negotiation"] },
    });
    const wonDeals = await Deal.countDocuments({ stage: "Won" });
    const lostDeals = await Deal.countDocuments({ stage: "Lost" });
    const dealsThisMonth = await Deal.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Revenue
    const totalRevenue = await Deal.aggregate([
      { $match: { stage: "Won" } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    const revenueThisMonth = await Deal.aggregate([
      {
        $match: {
          stage: "Won",
          actualClosingDate: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    // Quotation Statistics
    const totalQuotations = await CRMQuotation.countDocuments();
    const pendingQuotations = await CRMQuotation.countDocuments({
      status: { $in: ["Draft", "Sent"] },
    });
    const acceptedQuotations = await CRMQuotation.countDocuments({ status: "Accepted" });

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
      ? ((wonDeals / totalLeads) * 100).toFixed(2) 
      : 0;

    // Recent Activity
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName companyName status priority createdAt");

    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "customerName companyName")
      .select("dealNumber title dealValue stage createdAt");

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

    // Deal Stage Distribution
    const dealStageDistribution = await Deal.aggregate([
      { $group: { _id: "$stage", count: { $sum: 1 }, value: { $sum: "$dealValue" } } },
    ]);

    // Source Distribution
    const leadSourceDistribution = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    // Monthly Revenue Trend (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthRevenue = await Deal.aggregate([
        {
          $match: {
            stage: "Won",
            actualClosingDate: { $gte: monthStart, $lte: monthEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$dealValue" } } },
      ]);

      monthlyRevenue.push({
        month: monthStart.toLocaleString("default", { month: "short", year: "2-digit" }),
        revenue: monthRevenue[0]?.total || 0,
      });
    }

    // Top Sales Performers
    const topPerformers = await Deal.aggregate([
      { $match: { stage: "Won" } },
      {
        $group: {
          _id: "$assignedTo",
          totalDeals: { $sum: 1 },
          totalRevenue: { $sum: "$dealValue" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    // Populate performers
    const performers = await Admin.find({
      _id: { $in: topPerformers.map((p) => p._id) },
    }).select("firstName lastName email");

    const performersWithStats = topPerformers.map((perf) => {
      const admin = performers.find((a) => a._id.toString() === perf._id.toString());
      return {
        name: admin ? `${admin.firstName} ${admin.lastName}` : "Unknown",
        email: admin?.email || "",
        totalDeals: perf.totalDeals,
        totalRevenue: perf.totalRevenue,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          thisMonth: leadsThisMonth,
          today: leadsToday,
          distribution: leadStatusDistribution,
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          thisMonth: customersThisMonth,
        },
        deals: {
          total: totalDeals,
          active: activeDeals,
          won: wonDeals,
          lost: lostDeals,
          thisMonth: dealsThisMonth,
          distribution: dealStageDistribution,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: revenueThisMonth[0]?.total || 0,
          monthlyTrend: monthlyRevenue,
        },
        quotations: {
          total: totalQuotations,
          pending: pendingQuotations,
          accepted: acceptedQuotations,
        },
        followUps: {
          today: todayFollowUps,
          overdue: overdueFollowUps,
          upcoming: upcomingFollowUps,
        },
        metrics: {
          conversionRate: parseFloat(conversionRate),
          avgDealValue: wonDeals > 0 
            ? (totalRevenue[0]?.total / wonDeals).toFixed(2) 
            : 0,
        },
        recent: {
          leads: recentLeads,
          deals: recentDeals,
        },
        sources: leadSourceDistribution,
        topPerformers: performersWithStats,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get sales performance report
// @route   GET /api/crm/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, assignedTo } = req.query;

    let matchQuery = { stage: "Won" };

    if (startDate || endDate) {
      matchQuery.actualClosingDate = {};
      if (startDate) matchQuery.actualClosingDate.$gte = new Date(startDate);
      if (endDate) matchQuery.actualClosingDate.$lte = new Date(endDate);
    }

    if (assignedTo) {
      matchQuery.assignedTo = assignedTo;
    }

    const deals = await Deal.find(matchQuery)
      .populate("customerId", "customerName companyName")
      .populate("assignedTo", "name email")
      .sort({ actualClosingDate: -1 });

    const totalRevenue = deals.reduce((sum, deal) => sum + deal.dealValue, 0);
    const avgDealValue = deals.length > 0 ? totalRevenue / deals.length : 0;

    // Revenue by assigned user
    const revenueByUser = await Deal.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$assignedTo",
          totalRevenue: { $sum: "$dealValue" },
          dealCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        deals,
        summary: {
          totalDeals: deals.length,
          totalRevenue,
          avgDealValue,
        },
        byUser: revenueByUser,
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
          totalValue: { $sum: "$dealValue" },
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
