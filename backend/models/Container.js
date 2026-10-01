const mongoose = require('mongoose');

const containerStatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        'Goods Under Stuffing',
        'Container Loaded',
        'Under Shipment',
        'Arrival Port Added',
        'Custom Clearance',
        'Under Transportation',
        'Completed'
      ]
    },
    notes: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const containerGoodsSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

const containerSchema = new mongoose.Schema(
  {
    containerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    shippingType: {
      type: String,
      required: true,
      enum: ['Sea', 'Air']
    },
    origin: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    etd: {
      type: Date,
      required: false
    },
    eta: {
      type: Date,
      required: false
    },
    vesselName: {
      type: String,
      trim: true,
      default: ''
    },
    voyageNumber: {
      type: String,
      trim: true,
      default: ''
    },
    currentStatus: {
      type: String,
      required: true,
      enum: [
        'Goods Under Stuffing',
        'Container Loaded',
        'Under Shipment',
        'Arrival Port Added',
        'Custom Clearance',
        'Under Transportation',
        'Completed'
      ],
      default: 'Goods Under Stuffing'
    },
    goods: [containerGoodsSchema],
    statusHistory: [containerStatusHistorySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
containerSchema.index({ currentStatus: 1 });
containerSchema.index({ destination: 1 });
containerSchema.index({ 'goods.userId': 1 });
containerSchema.index({ 'goods.orderId': 1 });

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;
