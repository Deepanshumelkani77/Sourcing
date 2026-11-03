const FormFieldConfiguration = require('../models/FormFieldConfiguration');

// Get all field configurations for a form type
const getFieldConfigurations = async (req, res) => {
  try {
    const { formType } = req.params;

    const fields = await FormFieldConfiguration.find({ formType })
      .sort({ section: 1, order: 1 });

    return res.status(200).json({
      success: true,
      fields
    });
  } catch (error) {
    console.error('getFieldConfigurations:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch field configurations'
    });
  }
};

// Create a new field configuration (main_admin only)
const createFieldConfiguration = async (req, res) => {
  try {
    const fieldData = req.body;

    const field = await FormFieldConfiguration.create(fieldData);

    return res.status(201).json({
      success: true,
      field,
      message: 'Field configuration created successfully'
    });
  } catch (error) {
    console.error('createFieldConfiguration:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create field configuration'
    });
  }
};

// Update a field configuration (main_admin only)
const updateFieldConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldData = req.body;

    const field = await FormFieldConfiguration.findByIdAndUpdate(
      id,
      fieldData,
      { new: true, runValidators: true }
    );

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field configuration not found'
      });
    }

    return res.status(200).json({
      success: true,
      field,
      message: 'Field configuration updated successfully'
    });
  } catch (error) {
    console.error('updateFieldConfiguration:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update field configuration'
    });
  }
};

// Delete a field configuration (main_admin only)
const deleteFieldConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await FormFieldConfiguration.findByIdAndDelete(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field configuration not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Field configuration deleted successfully'
    });
  } catch (error) {
    console.error('deleteFieldConfiguration:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete field configuration'
    });
  }
};

// Initialize default field configurations for a form type
const initializeDefaultFields = async (req, res) => {
  try {
    const { formType } = req.params;

    // Define default fields based on form type
    const defaultFields = [];

    if (formType === 'order') {
      defaultFields.push(
        // Basic fields
        { formType, fieldName: 'userId', label: 'Customer', fieldType: 'select', section: 'basic', order: 1, required: true },
        { formType, fieldName: 'items', label: 'Order Items', fieldType: 'textarea', section: 'basic', order: 2, required: true },
        { formType, fieldName: 'shippingAddress', label: 'Shipping Address', fieldType: 'textarea', section: 'basic', order: 3, required: false },
        { formType, fieldName: 'billingAddress', label: 'Billing Address', fieldType: 'textarea', section: 'basic', order: 4, required: false },
        { formType, fieldName: 'notes', label: 'Notes', fieldType: 'textarea', section: 'basic', order: 5, required: false },
        // Shipper Info
        { formType, fieldName: 'shipperInfo.name', label: 'Name', fieldType: 'text', section: 'shipperInfo', order: 1, required: false, placeholder: 'Enter company name (Chinese)' },
        { formType, fieldName: 'shipperInfo.address', label: 'Address', fieldType: 'text', section: 'shipperInfo', order: 2, required: false, placeholder: 'Enter full address (Chinese)' },
        { formType, fieldName: 'shipperInfo.subDistrict', label: 'Sub District', fieldType: 'text', section: 'shipperInfo', order: 3, required: false, placeholder: 'Enter sub district (Chinese)' },
        { formType, fieldName: 'shipperInfo.district', label: 'District', fieldType: 'text', section: 'shipperInfo', order: 4, required: false, placeholder: 'Enter district (Chinese)' },
        { formType, fieldName: 'shipperInfo.province', label: 'Province', fieldType: 'text', section: 'shipperInfo', order: 5, required: false, placeholder: 'Enter province (Chinese)' },
        { formType, fieldName: 'shipperInfo.country', label: 'Country', fieldType: 'text', section: 'shipperInfo', order: 6, required: false, placeholder: 'Enter country (Chinese)' },
        { formType, fieldName: 'shipperInfo.pinCode', label: 'PIN Code', fieldType: 'text', section: 'shipperInfo', order: 7, required: false, placeholder: 'Enter PIN code' },
        { formType, fieldName: 'shipperInfo.contactPerson', label: 'Contact Person', fieldType: 'text', section: 'shipperInfo', order: 8, required: false, placeholder: 'Enter contact person name (Chinese)' },
        { formType, fieldName: 'shipperInfo.contactNo', label: 'Contact No.', fieldType: 'text', section: 'shipperInfo', order: 9, required: false, placeholder: 'Enter contact number' }
      );
    }

    // Only create if they don't exist
    const existingFields = await FormFieldConfiguration.find({ formType });
    if (existingFields.length === 0) {
      await FormFieldConfiguration.insertMany(defaultFields);
    }

    const fields = await FormFieldConfiguration.find({ formType }).sort({ section: 1, order: 1 });

    return res.status(200).json({
      success: true,
      fields,
      message: 'Default field configurations initialized'
    });
  } catch (error) {
    console.error('initializeDefaultFields:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to initialize default fields'
    });
  }
};

module.exports = {
  getFieldConfigurations,
  createFieldConfiguration,
  updateFieldConfiguration,
  deleteFieldConfiguration,
  initializeDefaultFields
};
