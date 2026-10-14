const CRMQuotation = require("../models/CRMQuotation");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");

// Generate quotation number
const generateQuotationNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `QT${year}${month}${random}`;
};

// @desc    Create a new quotation
// @route   POST /api/crm/quotations
// @access  Private/Admin
exports.createQuotation = async (req, res) => {
  try {
    const quotationData = {
      ...req.body,
      quotationNumber: generateQuotationNumber(),
      createdBy: req.user._id,
    };

    // Calculate total amount from items
    if (quotationData.items && quotationData.items.length > 0) {
      quotationData.totalAmount = quotationData.items.reduce(
        (sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice),
        0
      );
    }

    const quotation = await CRMQuotation.create(quotationData);

    res.status(201).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all quotations
// @route   GET /api/crm/quotations
// @access  Private/Admin
exports.getQuotations = async (req, res) => {
  try {
    const { status, assignedTo, customerId } = req.query;

    let query = {};

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (customerId) query.customerId = customerId;

    const quotations = await CRMQuotation.find(query)
      .populate("customerId", "customerName companyName")
      .populate("leadId", "customerName productRequirement")
      .populate("dealId", "dealNumber title")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single quotation
// @route   GET /api/crm/quotations/:id
// @access  Private/Admin
exports.getQuotation = async (req, res) => {
  try {
    const quotation = await CRMQuotation.findById(req.params.id)
      .populate("customerId", "customerName companyName email phone address")
      .populate("leadId", "customerName productRequirement")
      .populate("dealId", "dealNumber title")
      .populate("assignedTo", "name email")
      .populate("items.productId", "productName");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update quotation
// @route   PUT /api/crm/quotations/:id
// @access  Private/Admin
exports.updateQuotation = async (req, res) => {
  try {
    let quotation = await CRMQuotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    // Recalculate total if items updated
    if (req.body.items) {
      req.body.totalAmount = req.body.items.reduce(
        (sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice),
        0
      );
    }

    quotation = await CRMQuotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send quotation
// @route   PUT /api/crm/quotations/:id/send
// @access  Private/Admin
exports.sendQuotation = async (req, res) => {
  try {
    let quotation = await CRMQuotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    quotation.status = "Sent";
    quotation.sentDate = new Date();

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (quotation.validity || 30));
    quotation.expiryDate = expiryDate;

    await quotation.save();

    // Create or update deal if not exists
    if (!quotation.dealId && quotation.customerId) {
      const dealData = {
        dealNumber: generateQuotationNumber().replace("QT", "DL"),
        customerId: quotation.customerId,
        leadId: quotation.leadId,
        quotationId: quotation._id,
        title: quotation.title,
        dealValue: quotation.totalAmount,
        stage: "Proposal Sent",
        probability: 50,
        assignedTo: quotation.assignedTo,
        createdBy: req.admin.id,
      };

      const deal = await Deal.create(dealData);
      quotation.dealId = deal._id;
      await quotation.save();
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Accept quotation
// @route   PUT /api/crm/quotations/:id/accept
// @access  Private/Admin
exports.acceptQuotation = async (req, res) => {
  try {
    let quotation = await CRMQuotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    quotation.status = "Accepted";
    quotation.acceptedDate = new Date();

    await quotation.save();

    // Update deal stage to Negotiation
    if (quotation.dealId) {
      await Deal.findByIdAndUpdate(quotation.dealId, {
        stage: "Negotiation",
        probability: 70,
      });
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject quotation
// @route   PUT /api/crm/quotations/:id/reject
// @access  Private/Admin
exports.rejectQuotation = async (req, res) => {
  try {
    let quotation = await CRMQuotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    quotation.status = "Rejected";

    await quotation.save();

    // Update deal stage
    if (quotation.dealId) {
      await Deal.findByIdAndUpdate(quotation.dealId, {
        stage: "Lost",
        probability: 0,
        lostReason: "Quotation rejected",
      });
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete quotation
// @route   DELETE /api/crm/quotations/:id
// @access  Private/Admin
exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await CRMQuotation.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    await quotation.deleteOne();

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

// @desc    Get quotation statistics
// @route   GET /api/crm/quotations/stats
// @access  Private/Admin
exports.getQuotationStats = async (req, res) => {
  try {
    const totalQuotations = await CRMQuotation.countDocuments();
    const draft = await CRMQuotation.countDocuments({ status: "Draft" });
    const sent = await CRMQuotation.countDocuments({ status: "Sent" });
    const accepted = await CRMQuotation.countDocuments({ status: "Accepted" });
    const rejected = await CRMQuotation.countDocuments({ status: "Rejected" });
    const expired = await CRMQuotation.countDocuments({ status: "Expired" });

    const totalValue = await CRMQuotation.aggregate([
      { $match: { status: { $ne: "Rejected" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const acceptedValue = await CRMQuotation.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Expired quotations check
    const today = new Date();
    const expiredQuotations = await CRMQuotation.find({
      status: "Sent",
      expiryDate: { $lt: today },
    });

    // Update expired status
    for (const quote of expiredQuotations) {
      quote.status = "Expired";
      await quote.save();
    }

    const recentQuotations = await CRMQuotation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "customerName companyName")
      .select("quotationNumber title totalAmount status createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalQuotations,
        draft,
        sent,
        accepted,
        rejected,
        expired: expiredQuotations.length,
        totalValue: totalValue[0]?.total || 0,
        acceptedValue: acceptedValue[0]?.total || 0,
        recentQuotations,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
