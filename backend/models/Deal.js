const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    dealNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dealValue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    stage: {
      type: String,
      enum: [
        "Lead",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Won",
        "Lost",
        "On Hold",
      ],
      default: "Lead",
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    expectedClosingDate: {
      type: Date,
    },
    actualClosingDate: {
      type: Date,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    paymentTerms: {
      type: String,
      trim: true,
    },
    deliveryTerms: {
      type: String,
      trim: true,
    },
    sourceCountry: {
      type: String,
      default: "China",
    },
    destinationCountry: {
      type: String,
      default: "India",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    notes: {
      type: String,
      trim: true,
    },
    lostReason: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;
