const Deal = require("../models/Deal");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const CRMQuotation = require("../models/CRMQuotation");
const Admin = require("../models/Admin");

// Generate deal number
const generateDealNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `DL${year}${month}${random}`;
};

// @desc    Create a new deal
// @route   POST /api/crm/deals
// @access  Private/Admin
exports.createDeal = async (req, res) => {
  try {
    // Remove empty string values for ObjectId fields
    const dealData = { ...req.body };
    if (!dealData.customerId || dealData.customerId === '') {
      delete dealData.customerId;
    }
    if (!dealData.quotationId || dealData.quotationId === '') {
      delete dealData.quotationId;
    }
    if (!dealData.leadId || dealData.leadId === '') {
      delete dealData.leadId;
    }

    dealData.dealNumber = generateDealNumber();
    dealData.createdBy = req.user._id;
    dealData.assignedTo = dealData.assignedTo || req.user._id; // Default to current user if not provided

    const deal = await Deal.create(dealData);

    // Update customer with deal count
    if (deal.customerId) {
      await Customer.findByIdAndUpdate(deal.customerId, {
        $inc: { totalOrders: 1 },
      });
    }

    res.status(201).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all deals
// @route   GET /api/crm/deals
// @access  Private/Admin
exports.getDeals = async (req, res) => {
  try {
    const { stage, assignedTo, dateFrom, dateTo } = req.query;

    let query = {};

    if (stage) query.stage = stage;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const deals = await Deal.find(query)
      .populate("customerId", "customerName companyName")
      .populate("leadId", "customerName productRequirement")
      .populate("quotationId", "quotationNumber totalAmount")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get deals by stage (for pipeline view)
// @route   GET /api/crm/deals/pipeline
// @access  Private/Admin
exports.getDealsByStage = async (req, res) => {
  try {
    const stages = ["Qualified", "Sourcing/Proposal", "Negotiation", "Won", "Lost"];
    const pipeline = {};

    for (const stage of stages) {
      pipeline[stage] = await Deal.find({ stage })
        .populate("customerId", "customerName companyName")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: pipeline,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single deal
// @route   GET /api/crm/deals/:id
// @access  Private/Admin
exports.getDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("customerId", "customerName companyName email phone")
      .populate("leadId", "customerName productRequirement")
      .populate("quotationId", "quotationNumber totalAmount items")
      .populate("assignedTo", "name email")
      .populate("products.productId", "productName");

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update deal
// @route   PUT /api/crm/deals/:id
// @access  Private/Admin
exports.updateDeal = async (req, res) => {
  try {
    let deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Remove empty string values for ObjectId fields
    const updateData = { ...req.body };
    if (!updateData.customerId || updateData.customerId === '') {
      delete updateData.customerId;
    }
    if (!updateData.quotationId || updateData.quotationId === '') {
      delete updateData.quotationId;
    }
    if (!updateData.leadId || updateData.leadId === '') {
      delete updateData.leadId;
    }

    // If stage changed to Won, update customer revenue
    if (updateData.stage === "Won" && deal.stage !== "Won") {
      await Customer.findByIdAndUpdate(deal.customerId, {
        $inc: { totalRevenue: deal.dealValue },
        lastOrderDate: new Date(),
      });
    }

    deal = await Deal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update deal stage
// @route   PUT /api/crm/deals/:id/stage
// @access  Private/Admin
exports.updateDealStage = async (req, res) => {
  try {
    let deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    const { stage, probability } = req.body;

    deal.stage = stage;
    if (probability) deal.probability = probability;

    // Auto-set probability based on stage if not provided
    if (!probability) {
      const stageProbabilities = {
        "Qualified": 30,
        "Sourcing/Proposal": 50,
        "Negotiation": 70,
        "Won": 100,
        "Lost": 0,
      };
      deal.probability = stageProbabilities[stage] || 0;
    }

    // If won, create customer if not exists and update revenue
    if (stage === "Won" && deal.stage !== "Won") {
      deal.actualClosingDate = new Date();

      // If customer exists, update revenue
      if (deal.customerId) {
        await Customer.findByIdAndUpdate(deal.customerId, {
          $inc: { totalRevenue: deal.dealValue, totalOrders: 1 },
          lastOrderDate: new Date(),
        });
      } else if (deal.leadId) {
        // If no customer but has lead, create customer from lead
        const lead = await Lead.findById(deal.leadId);
        if (lead) {
          const customerData = {
            customerName: lead.customerName,
            companyName: lead.companyName || lead.customerName,
            phone: lead.phone,
            whatsapp: lead.whatsapp || lead.phone,
            email: lead.email,
            source: lead.source,
            assignedTo: deal.assignedTo,
            leadId: lead._id,
            createdBy: req.user._id,
            totalOrders: 1,
            totalRevenue: deal.dealValue,
            lastOrderDate: new Date(),
          };

          const customer = await Customer.create(customerData);

          // Update deal with customer ID
          deal.customerId = customer._id;

          // Update lead
          lead.customerId = customer._id;
          await lead.save();
        }
      }
    }

    // If lost, save reason
    if (stage === "Lost") {
      deal.lostReason = req.body.lostReason || "";
    }

    await deal.save();

    res.status(200).json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete deal
// @route   DELETE /api/crm/deals/:id
// @access  Private/Admin
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    await deal.deleteOne();

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

// @desc    Get deal statistics
// @route   GET /api/crm/deals/stats
// @access  Private/Admin
exports.getDealStats = async (req, res) => {
  try {
    const totalDeals = await Deal.countDocuments();
    const wonDeals = await Deal.countDocuments({ stage: "Won" });
    const lostDeals = await Deal.countDocuments({ stage: "Lost" });
    const activeDeals = await Deal.countDocuments({
      stage: { $in: ["Qualified", "Sourcing/Proposal", "Negotiation"] },
    });

    const totalValue = await Deal.aggregate([
      { $match: { stage: { $ne: "Lost" } } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    const wonValue = await Deal.aggregate([
      { $match: { stage: "Won" } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    const avgDealValue = await Deal.aggregate([
      { $match: { stage: "Won" } },
      { $group: { _id: null, avg: { $avg: "$dealValue" } } },
    ]);

    // Deals by stage
    const byStage = await Deal.aggregate([
      { $group: { _id: "$stage", count: { $sum: 1 }, value: { $sum: "$dealValue" } } },
    ]);

    // Recent deals
    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "customerName companyName")
      .select("dealNumber title dealValue stage createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalDeals,
        wonDeals,
        lostDeals,
        activeDeals,
        totalValue: totalValue[0]?.total || 0,
        wonValue: wonValue[0]?.total || 0,
        avgDealValue: avgDealValue[0]?.avg || 0,
        byStage,
        recentDeals,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
