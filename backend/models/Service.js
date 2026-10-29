const mongoose = require("mongoose");

const serviceTranslationSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      enum: ["en", "zh"],
      default: "en",
    },
    phaseName: {
      type: String,
      trim: true,
    },
    phaseTagline: {
      type: String,
      trim: true,
    },
    serviceTitle: {
      type: String,
      trim: true,
    },
    serviceDescription: {
      type: String,
      trim: true,
    },
    serviceDetails: {
      type: String,
      trim: true,
    },
    included: {
      type: [String],
      default: [],
    },
    deliverable: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    // Phase information
    phaseId: {
      type: String,
      required: true,
      trim: true,
    },
    phaseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    phaseName: {
      type: String,
      required: true,
      trim: true,
    },
    phaseTagline: {
      type: String,
      required: true,
      trim: true,
    },

    // Service information
    serviceId: {
      type: String,
      required: true,
      trim: true,
    },
    serviceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    serviceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    serviceDescription: {
      type: String,
      required: true,
      trim: true,
    },
    serviceDetails: {
      type: String,
      required: true,
      trim: true,
    },
    included: {
      type: [String],
      required: true,
    },
    deliverable: {
      type: String,
      required: true,
      trim: true,
    },

    // Translations
    translations: {
      type: [serviceTranslationSchema],
      default: [],
    },

    // Display order within phase
    order: {
      type: Number,
      default: 0,
    },

    // Service status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Method to get service data in a specific language
serviceSchema.methods.getLocalizedData = function (language = "en") {
  const translation = this.translations?.find((t) => t.language === language);
  
  if (translation) {
    return {
      ...this.toObject(),
      phaseName: translation.phaseName || this.phaseName,
      phaseTagline: translation.phaseTagline || this.phaseTagline,
      serviceTitle: translation.serviceTitle || this.serviceTitle,
      serviceDescription: translation.serviceDescription || this.serviceDescription,
      serviceDetails: translation.serviceDetails || this.serviceDetails,
      included: translation.included.length > 0 ? translation.included : this.included,
      deliverable: translation.deliverable || this.deliverable,
    };
  }
  
  // Return original data if no translation found
  return this.toObject();
};

// Index for faster queries
serviceSchema.index({ phaseNumber: 1, order: 1 });
serviceSchema.index({ phaseId: 1, order: 1 });
serviceSchema.index({ serviceId: 1 });
serviceSchema.index({ status: 1 });

module.exports = mongoose.model("Service", serviceSchema);
