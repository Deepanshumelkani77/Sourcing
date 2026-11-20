const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  agreementNumber: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

  // Basic Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  orderNumber: {
    type: String,
    trim: true,
    default: ''
  },
  agreementDate: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },

  // Customer snapshot (so agreement stays intact if customer record changes)
  customerName: { type: String, trim: true, default: '' },
  customerCompany: { type: String, trim: true, default: '' },
  customerAddress: { type: String, trim: true, default: '' },
  customerEmail: { type: String, trim: true, default: '' },

  // Product & Order Details
  products: [{
    productName: { type: String, trim: true },
    description: { type: String, trim: true },
    quantity: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
  }],
  currency: {
    type: String,
    enum: ['USD', 'CNY', 'INR'],
    default: 'USD'
  },
  totalAmount: {
    type: Number,
    default: 0
  },

  // Sourcing & Service Terms
  sourcingServiceCharges: { type: Number, default: 0 },
  supplierDetails: { type: String, trim: true, default: '' },
  qualityInspectionTerms: { type: String, trim: true, default: '' },
  sampleApprovalTerms: { type: String, trim: true, default: '' },
  packagingRequirements: { type: String, trim: true, default: '' },
  deliveryTimeline: { type: String, trim: true, default: '' },
  shippingTerms: { type: String, trim: true, default: '' },
  customsDutyResponsibility: { type: String, trim: true, default: '' },

  // Payment Terms
  advancePayment: { type: Number, default: 0 },
  remainingPayment: { type: Number, default: 0 },
  paymentMilestones: { type: String, trim: true, default: '' },
  paymentMethod: { type: String, trim: true, default: '' },
  refundPolicy: { type: String, trim: true, default: '' },

  // Agreement Conditions
  icbResponsibilities: { type: String, trim: true, default: '' },
  customerResponsibilities: { type: String, trim: true, default: '' },
  deliveryDelayConditions: { type: String, trim: true, default: '' },
  disputeResolution: { type: String, trim: true, default: '' },
  confidentiality: { type: String, trim: true, default: '' },
  terminationConditions: { type: String, trim: true, default: '' },

  // Workflow
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'sent', 'viewed', 'signed', 'rejected', 'expired', 'cancelled'],
    default: 'draft'
  },
  agreementPdf: {
    type: String,
    trim: true,
    default: ''
  },
  signedDocument: {
    name: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  signerName: { type: String, trim: true, default: '' },
  signedAt: { type: Date },
  sentAt: { type: Date },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },

  history: [{
    status: { type: String },
    note: { type: String, trim: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

agreementSchema.index({ agreementNumber: 1 });
agreementSchema.index({ status: 1 });
agreementSchema.index({ customer: 1 });

module.exports = mongoose.model('Agreement', agreementSchema);
