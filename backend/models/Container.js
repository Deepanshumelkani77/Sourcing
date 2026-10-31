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

const shipperSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    subDistrict: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      trim: true,
      default: ''
    },
    province: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: ''
    },
    pinCode: {
      type: String,
      trim: true,
      default: ''
    },
    contactPerson: {
      type: String,
      trim: true,
      default: ''
    },
    contactNo: {
      type: String,
      trim: true,
      default: ''
    },
    packingList: {
      type: String,
      trim: true,
      default: ''
    },
    invoiceNo: {
      type: String,
      trim: true,
      default: ''
    },
    dateOfInvoice: {
      type: Date,
      default: null
    },
    hsnCode: {
      type: String,
      trim: true,
      default: ''
    },
    descriptionOfGoods: {
      type: String,
      trim: true,
      default: ''
    },
    quantity: {
      type: String,
      trim: true,
      default: ''
    },
    weight: {
      type: String,
      trim: true,
      default: ''
    },
    dimension: {
      type: String,
      trim: true,
      default: ''
    },
    packageType: {
      type: String,
      trim: true,
      default: ''
    },
    identifiersOnPackage: {
      type: String,
      trim: true,
      default: ''
    },
    cooNo: {
      type: String,
      trim: true,
      default: ''
    },
    agreementNo: {
      type: String,
      trim: true,
      default: ''
    },
    dateOfAgreement: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const containerSchema = new mongoose.Schema(
  {
    // Container Information
    blNo: {
      type: String,
      trim: true,
      default: ''
    },
    vesselName: {
      type: String,
      trim: true,
      default: ''
    },
    voyageNo: {
      type: String,
      trim: true,
      default: ''
    },
    pol: {
      type: String,
      trim: true,
      default: ''
    },
    etd: {
      type: Date,
      required: false
    },
    pod: {
      type: String,
      trim: true,
      default: ''
    },
    eta: {
      type: Date,
      required: false
    },
    containerNo: {
      type: String,
      trim: true,
      default: ''
    },
    sealNo: {
      type: String,
      trim: true,
      default: ''
    },
    transitRoute: {
      type: String,
      trim: true,
      default: ''
    },
    noOfShippers: {
      type: Number,
      default: 0
    },
    // Shipper/Exporter Information
    shippers: [shipperSchema],
    // Legacy fields (for backward compatibility)
    containerNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    shippingType: {
      type: String,
      enum: ['Sea', 'Air'],
      default: 'Sea'
    },
    origin: {
      type: String,
      trim: true,
      default: ''
    },
    destination: {
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
containerSchema.index({ pod: 1 });
containerSchema.index({ containerNo: 1 });
containerSchema.index({ blNo: 1 });
containerSchema.index({ 'goods.userId': 1 });
containerSchema.index({ 'goods.orderId': 1 });

const Container = mongoose.model('Container', containerSchema);

module.exports = Container;
