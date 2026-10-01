const Issue = require('../models/Issue');
const Order = require('../models/Order');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Helper to save uploaded files from multer
const saveFiles = async (files) => {
  const savedFiles = [];
  const uploadDir = path.join(__dirname, '../uploads/issues');
  
  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const file of files) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    // Save file buffer
    fs.writeFileSync(filePath, file.buffer);
    
    savedFiles.push({
      filename: file.originalname,
      path: `/uploads/issues/${uniqueName}`,
      mimetype: file.mimetype,
      size: file.size
    });
  }

  return savedFiles;
};

const createIssue = async (req, res) => {
  try {
    const { orderId, orderNumber, type, description, resolution, itemIds } = req.body;

    // Validate required fields
    if (!orderId || !orderNumber || !type || !description || !resolution) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to the user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only report issues for your own orders'
      });
    }

    // Parse itemIds if provided
    let parsedItemIds = [];
    if (itemIds) {
      try {
        parsedItemIds = JSON.parse(itemIds);
      } catch (e) {
        parsedItemIds = [itemIds];
      }
    }

    // Handle file uploads
    let savedFiles = [];
    if (req.files && req.files.length > 0) {
      savedFiles = await saveFiles(req.files);
    }

    // Create issue
    const issue = await Issue.create({
      orderId,
      orderNumber,
      userId: req.user.id,
      type,
      itemIds: parsedItemIds,
      description,
      resolution,
      files: savedFiles
    });

    // Mark order as having an issue reported
    order.issueReported = true;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      issue: {
        _id: issue._id,
        ticketNumber: issue.ticketNumber,
        status: issue.status
      }
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue',
      error: error.message
    });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('orderId', 'orderNumber')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues'
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('orderId', 'orderNumber items')
      .populate('userId', 'firstName lastName email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      issue
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue'
    });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue'
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus
};
