const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    available: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const sourcingSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      default: "China",
      trim: true,
    },
    destination: {
      type: String,
      default: "India",
      trim: true,
    },
    moq: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const landingPageSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "",
      trim: true,
    },

    heroSubtitle: {
      type: String,
      default: "",
      trim: true,
    },

    keyBenefits: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const enquirySchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },

    buttonText: {
      type: String,
      default: "Request a Quote",
      trim: true,
    },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC PRODUCT INFORMATION
    // =========================

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // PRODUCT IMAGES
    // =========================

    images: {
      type: [String],
      default: [],
    },

    // =========================
    // PRODUCT FEATURES
    // =========================

    features: {
      type: [String],
      default: [],
    },

    // =========================
    // TECHNICAL SPECIFICATIONS
    // =========================

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    // =========================
    // APPLICATIONS
    // =========================

    applications: {
      type: [String],
      default: [],
    },

    // =========================
    // PACKAGE CONTENTS
    // =========================

    packageContents: {
      type: [String],
      default: [],
    },

    // =========================
    // CUSTOMIZATION
    // =========================

    customization: {
      type: customizationSchema,
      default: () => ({
        available: false,
        details: "",
      }),
    },

    // =========================
    // SOURCING
    // =========================

    sourcing: {
      type: sourcingSchema,
      default: () => ({
        country: "China",
        destination: "India",
        moq: "",
      }),
    },

    // =========================
    // LANDING PAGE
    // =========================

    landingPage: {
      type: landingPageSchema,
      default: () => ({
        heroTitle: "",
        heroSubtitle: "",
        keyBenefits: [],
      }),
    },

    // =========================
    // ENQUIRY / QUOTE
    // =========================

    enquiry: {
      type: enquirySchema,
      default: () => ({
        enabled: true,
        buttonText: "Request a Quote",
      }),
    },

    // =========================
    // SEO
    // =========================

    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      }),
    },

    // =========================
    // PRODUCT STATUS
    // =========================

    status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "draft",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);