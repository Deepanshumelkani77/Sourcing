const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    orderNumber: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['wrong_item', 'missing_items', 'damaged', 'quantity', 'quality', 'other']
    },
    itemIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    description: {
      type: String,
      required: true,
      minlength: 10
    },
    resolution: {
      type: String,
      required: true,
      enum: ['Replacement', 'Refund', 'Call me back', 'Not sure yet']
    },
    files: [{
      filename: String,
      path: String,
      mimetype: String,
      size: Number
    }],
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved', 'Closed'],
      default: 'Pending'
    },
    ticketNumber: {
      type: String,
      unique: true
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Generate ticket number before saving
issueSchema.pre('save', async function() {
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Issue').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.ticketNumber = `ISS-${year}-${String(count + 1).padStart(4, '0')}`;
  }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
