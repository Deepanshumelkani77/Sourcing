const mongoose = require('mongoose');

const formFieldConfigurationSchema = new mongoose.Schema(
  {
    // Form type (e.g., 'order', 'container', 'customer')
    formType: {
      type: String,
      required: true,
      enum: ['order', 'container', 'customer'],
      index: true
    },

    // Field name (e.g., 'firstName', 'email', 'shipperInfo.name')
    fieldName: {
      type: String,
      required: true
    },

    // Display label (e.g., 'First Name', 'Email')
    label: {
      type: String,
      required: true
    },

    // Field type (text, email, number, select, textarea, checkbox, date)
    fieldType: {
      type: String,
      required: true,
      enum: ['text', 'email', 'number', 'select', 'textarea', 'checkbox', 'date']
    },

    // Placeholder text
    placeholder: {
      type: String,
      default: ''
    },

    // Is field required
    required: {
      type: Boolean,
      default: false
    },

    // Field order in the form
    order: {
      type: Number,
      default: 0
    },

    // Section (e.g., 'basic', 'shipperInfo', 'shipping')
    section: {
      type: String,
      default: 'basic'
    },

    // For select fields - available options
    options: {
      type: [String],
      default: []
    },

    // Is field visible
    visible: {
      type: Boolean,
      default: true
    },

    // Is field editable (can be modified by main_admin)
    editable: {
      type: Boolean,
      default: true
    },

    // Custom validation rules
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String,
      min: Number,
      max: Number
    },

    // Field description/help text
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
formFieldConfigurationSchema.index({ formType: 1, section: 1, order: 1 });

module.exports = mongoose.model('FormFieldConfiguration', formFieldConfigurationSchema);
