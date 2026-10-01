const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: [
        'Pending',
        'Order Placed',
        'Under Manufacturing',
        'Under Inspection',
        'Under Packing',
        'Transportation to Shipping Port/Airport',
        'Under Delivery',
        'Delivered'
      ],
      default: 'Pending'
    },
    shippingAddress: {
      type: String,
      trim: true
    },
    billingAddress: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    issueReported: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
