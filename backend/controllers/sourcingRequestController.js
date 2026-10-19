const SourcingRequest = require("../models/SourcingRequest");
const Lead = require("../models/Lead");

// @desc    Create a new sourcing request
// @route   POST /api/sourcing-requests
// @access  Public
exports.createSourcingRequest = async (req, res) => {
  try {
    const {
      selectedServices,
      productCategory,
      productSpecifications,
      quantity,
      targetPrice,
      destinationCountry,
      requiredDeliveryDate,
      companyName,
      name,
      email,
      phone,
      source
    } = req.body;

    // Create sourcing request
    const sourcingRequest = await SourcingRequest.create({
      selectedServices,
      productCategory,
      productSpecifications,
      quantity,
      targetPrice,
      destinationCountry,
      requiredDeliveryDate: requiredDeliveryDate ? new Date(requiredDeliveryDate) : null,
      companyName,
      name,
      email,
      phone,
      source,
    });

    // Create a CRM Lead from the sourcing request
    const leadData = {
      customerName: name,
      companyName: companyName || name,
      phone,
      whatsapp: phone,
      email,
      productRequirement: `${productCategory} - ${quantity}`,
      quantity,
      source: source || "Website - Services Page",
      priority: "Medium",
      status: "New",
      notes: `Services requested: ${selectedServices.join(", ")}\nTarget Price: ${targetPrice || "Not specified"}\nDestination: ${destinationCountry}\nSpecifications: ${productSpecifications || "Not provided"}`,
      dealValue: targetPrice ? parseFloat(targetPrice.replace(/[^0-9.]/g, "")) : 0,
    };

    const lead = await Lead.create(leadData);

    // Link sourcing request to lead
    sourcingRequest.leadId = lead._id;
    await sourcingRequest.save();

    res.status(201).json({
      success: true,
      message: "Sourcing request submitted successfully",
      data: {
        sourcingRequest,
        lead
      },
    });
  } catch (error) {
    console.error("Error creating sourcing request:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all sourcing requests
// @route   GET /api/sourcing-requests
// @access  Private/Admin
exports.getSourcingRequests = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;

    let query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const requests = await SourcingRequest.find(query)
      .populate("leadId", "customerName status")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single sourcing request
// @route   GET /api/sourcing-requests/:id
// @access  Private/Admin
exports.getSourcingRequest = async (req, res) => {
  try {
    const request = await SourcingRequest.findById(req.params.id)
      .populate("leadId")
      .populate("assignedTo", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sourcing request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update sourcing request
// @route   PUT /api/sourcing-requests/:id
// @access  Private/Admin
exports.updateSourcingRequest = async (req, res) => {
  try {
    let request = await SourcingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sourcing request not found",
      });
    }

    request = await SourcingRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete sourcing request
// @route   DELETE /api/sourcing-requests/:id
// @access  Private/Admin
exports.deleteSourcingRequest = async (req, res) => {
  try {
    const request = await SourcingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sourcing request not found",
      });
    }

    await request.deleteOne();

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

// @desc    Get sourcing request statistics
// @route   GET /api/sourcing-requests/stats
// @access  Private/Admin
exports.getSourcingRequestStats = async (req, res) => {
  try {
    const totalRequests = await SourcingRequest.countDocuments();
    const newRequests = await SourcingRequest.countDocuments({ status: "New" });
    const inProgress = await SourcingRequest.countDocuments({ status: "In Progress" });
    const completed = await SourcingRequest.countDocuments({ status: "Completed" });

    // Most requested services
    const serviceCounts = await SourcingRequest.aggregate([
      { $unwind: "$selectedServices" },
      { $group: { _id: "$selectedServices", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent requests
    const recentRequests = await SourcingRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name companyName productCategory selectedServices status createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        newRequests,
        inProgress,
        completed,
        serviceCounts,
        recentRequests,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
