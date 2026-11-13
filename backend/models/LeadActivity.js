const mongoose = require("mongoose");

const leadActivitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "Call Log",
        "WhatsApp Log",
        "Email Log",
        "Meeting Log",
        "Site-Visit Log",
        "Quotation Log",
        "Document",
        "Activity Outcome",
        "Note",
        "System",
      ],
      default: "Note",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    outcome: {
      type: String,
      trim: true,
      default: "",
    },
    activityDate: {
      type: Date,
      default: Date.now,
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

leadActivitySchema.index({ leadId: 1, activityDate: -1 });

const LeadActivity = mongoose.model("LeadActivity", leadActivitySchema);

module.exports = LeadActivity;
