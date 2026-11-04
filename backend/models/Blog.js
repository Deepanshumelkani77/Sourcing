const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    // Basic information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      maxlength: 350,
    },

    // Store sanitized rich-text HTML from your editor
    content: {
      type: String,
      required: true,
    },

    // Blog classification
    category: {
      type: String,
      required: true,
      enum: [
        "Machinery Sourcing",
        "Manufacturing",
        "Logistics",
        "Quality Control",
        "Industry Insights",
        "Case Studies",
        "Global Sourcing",
      ],
    },

    tags: [{
      type: String,
      trim: true,
    }],

    // Images
    coverImage: {
      type: String,
      required: true,
    },

    coverImageAlt: {
      type: String,
      default: "",
    },

    thumbnailImage: {
      type: String,
      default: "",
    },

    // Author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // Publishing controls
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // SEO fields
    seoTitle: {
      type: String,
      maxlength: 70,
      default: "",
    },

    seoDescription: {
      type: String,
      maxlength: 170,
      default: "",
    },

    focusKeyword: {
      type: String,
      default: "",
    },

    canonicalUrl: {
      type: String,
      default: "",
    },

    ogImage: {
      type: String,
      default: "",
    },

    // Blog statistics
    readingTime: {
      type: Number,
      default: 1,
    },

    // Soft deletion
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Useful database indexes
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ isFeatured: 1, status: 1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
