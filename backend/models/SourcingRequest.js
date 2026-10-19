const mongoose = require("mongoose");

const sourcingRequestSchema = new mongoose.Schema(
  {
    selectedServices: {
      type: [String],
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
      trim: true,
    },
    productSpecifications: {
      type: String,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    targetPrice: {
      type: String,
      trim: true,
    },
    destinationCountry: {
      type: String,
      required: true,
      trim: true,
    },
    requiredDeliveryDate: {
      type: Date,
    },
    companyName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      default: "Website - Services Page",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "In Progress", "Completed", "Lost"],
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
  },
  {
    timestamps: true,
  }
);

const SourcingRequest = mongoose.model("SourcingRequest", sourcingRequestSchema);

module.exports = SourcingRequest;
