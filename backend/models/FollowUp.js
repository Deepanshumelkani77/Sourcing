const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    type: {
      type: String,
      enum: ["Call", "Email", "WhatsApp", "Meeting", "Visit", "Other"],
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Missed", "Cancelled"],
      default: "Scheduled",
    },
    outcome: {
      type: String,
      enum: ["Interested", "Not Interested", "Follow-up Later", "Quote Sent", "Deal Closed", "No Response"],
    },
    notes: {
      type: String,
      trim: true,
    },
    nextFollowUpDate: {
      type: Date,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

const FollowUp = mongoose.model("FollowUp", followUpSchema);

module.exports = FollowUp;
