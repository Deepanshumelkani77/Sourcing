const Review = require('../models/Review');
const Order = require('../models/Order');

// Submit a review (user only)
const submitReview = async (req, res) => {
  try {
    const { orderId, rating, title, comment } = req.body;

    // Validate required fields
    if (!orderId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order is delivered
    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only review delivered orders'
      });
    }

    // Check if user already reviewed this order
    const existingReview = await Review.findOne({ orderId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this order'
      });
    }

    // Create review
    const review = await Review.create({
      userId: req.user._id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      orderId,
      orderNumber: order.orderNumber,
      rating,
      title,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be visible after approval.',
      review
    });
  } catch (error) {
    console.error('submitReview:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit review'
    });
  }
};

// Get all reviews (admin only)
const getReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('orderId', 'orderNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('getReviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch reviews'
    });
  }
};

// Get approved reviews for public display
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('getApprovedReviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch reviews'
    });
  }
};

// Get review by ID (admin only)
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('orderId', 'orderNumber');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('getReviewById:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch review'
    });
  }
};

// Update review status (admin only)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (adminResponse !== undefined) updateData.adminResponse = adminResponse;

    const review = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('updateReviewStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update review'
    });
  }
};

// Delete review (admin only)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('deleteReview:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete review'
    });
  }
};

module.exports = {
  submitReview,
  getReviews,
  getApprovedReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview
};
