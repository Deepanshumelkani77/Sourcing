const mongoose = require("mongoose");

const productTranslationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["en", "zh"],
      default: "en",
    },

    // Translatable fields
    productName: {
      type: String,
      required: true,
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

    category: {
      type: String,
      required: true,
      trim: true,
    },

    mainCategory: {
      type: String,
      default: "",
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    specifications: {
      type: [
        new mongoose.Schema(
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
        ),
      ],
      default: [],
    },

    applications: {
      type: [String],
      default: [],
    },

    packageContents: {
      type: [String],
      default: [],
    },

    customization: {
      details: {
        type: String,
        default: "",
        trim: true,
      },
    },

    sourcing: {
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

    landingPage: {
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

    enquiry: {
      buttonText: {
        type: String,
        default: "Request a Quote",
        trim: true,
      },
    },

    seo: {
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
  },
  {
    timestamps: true,
  }
);

// Create compound index for product + language to ensure uniqueness
productTranslationSchema.index({ product: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("ProductTranslation", productTranslationSchema);
