const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    tag: {
      type: String,
      enum: ["New", "Update", "CRM", "Action", "Tip", "Alert", "General"],
      default: "General",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

announcementSchema.index({ isActive: 1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
