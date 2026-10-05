const Quotation = require('../models/Quotation');
const Product = require('../models/Product');

// Submit quotation request
const submitQuotation = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      companyName,
      productId,
      productName,
      productSlug,
      quantity,
      message,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !productId || !productName || !productSlug || !quantity || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create quotation
    const quotation = await Quotation.create({
      userId: req.user?._id || null,
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      phone,
      companyName: companyName || '',
      productId,
      productName,
      productSlug,
      quantity,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully',
      quotation
    });
  } catch (error) {
    console.error('submitQuotation:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit quotation request'
    });
  }
};

// Get all quotations (admin only)
const getQuotations = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const quotations = await Quotation.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('productId', 'productName slug')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      quotations
    });
  } catch (error) {
    console.error('getQuotations:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch quotations'
    });
  }
};

// Get quotation by ID (admin only)
const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('productId', 'productName slug');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    return res.status(200).json({
      success: true,
      quotation
    });
  } catch (error) {
    console.error('getQuotationById:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch quotation'
    });
  }
};

// Update quotation status (admin only)
const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, quotedPrice } = req.body;

    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice;

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      quotation
    });
  } catch (error) {
    console.error('updateQuotationStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update quotation'
    });
  }
};

module.exports = {
  submitQuotation,
  getQuotations,
  getQuotationById,
  updateQuotationStatus
};
