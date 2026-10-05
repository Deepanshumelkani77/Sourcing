const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    // User information (if logged in)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // User details (always stored for reference)
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    middleName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    // Product information
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productSlug: {
      type: String,
      required: true,
      trim: true,
    },

    // Quotation details
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    // Admin notes
    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // Quoted price (when admin provides quote)
    quotedPrice: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation;
