const Service = require('../models/Service');

// Get all services grouped by phase
const getAllServices = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const status = req.query.status || 'active';

    const services = await Service.find({ status }).sort({ phaseNumber: 1, order: 1 });

    // Group services by phase
    const groupedServices = {};
    services.forEach(service => {
      const localizedData = service.getLocalizedData(language);
      
      if (!groupedServices[localizedData.phaseId]) {
        groupedServices[localizedData.phaseId] = {
          id: localizedData.phaseId,
          number: localizedData.phaseNumber,
          name: localizedData.phaseName,
          tagline: localizedData.phaseTagline,
          services: []
        };
      }
      
      groupedServices[localizedData.phaseId].services.push({
        id: localizedData.serviceId,
        number: localizedData.serviceNumber,
        title: localizedData.serviceTitle,
        description: localizedData.serviceDescription,
        details: localizedData.serviceDetails,
        included: localizedData.included,
        deliverable: localizedData.deliverable,
        phaseId: localizedData.phaseId,
        phaseName: localizedData.phaseName,
        phaseNumber: localizedData.phaseNumber
      });
    });

    // Convert to array and sort by phaseNumber
    const phasesArray = Object.values(groupedServices).sort((a, b) => {
      return parseInt(a.number) - parseInt(b.number);
    });

    res.json({
      success: true,
      phases: phasesArray,
      totalServices: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get service by ID
const getServiceById = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const localizedData = service.getLocalizedData(language);

    res.json({
      success: true,
      service: localizedData
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const serviceData = req.body;

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// Update service status (active/inactive)
const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service status updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status',
      error: error.message
    });
  }
};

// Get services by phase
const getServicesByPhase = async (req, res) => {
  try {
    const { phaseId } = req.params;
    const language = req.query.language || 'en';

    const services = await Service.find({ phaseId, status: 'active' }).sort({ order: 1 });

    const localizedServices = services.map(service => service.getLocalizedData(language));

    res.json({
      success: true,
      services: localizedServices
    });
  } catch (error) {
    console.error('Error fetching services by phase:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  getServicesByPhase
};
