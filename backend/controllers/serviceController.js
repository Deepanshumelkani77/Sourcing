const mongoose = require('mongoose');
const Service = require('../models/Service');

// Resolve a service by Mongo _id or by its serviceId slug
const resolveService = async (id) => {
  let service = null;
  if (mongoose.isValidObjectId(id)) {
    service = await Service.findById(id);
  }
  if (!service) {
    service = await Service.findOne({ serviceId: id });
  }
  return service;
};

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
        _id: service._id,
        id: localizedData.serviceId,
        number: localizedData.serviceNumber,
        title: localizedData.serviceTitle,
        description: localizedData.serviceDescription,
        details: localizedData.serviceDetails,
        included: localizedData.included,
        deliverable: localizedData.deliverable,
        order: service.order,
        status: service.status,
        createdAt: service.createdAt,
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
    const service = await resolveService(req.params.id);

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
    const { serviceNumber, ...serviceData } = req.body;

    // Auto-assign the next service number within the phase (01, 02, 03, ...)
    const siblings = await Service.find({ phaseId: serviceData.phaseId }).select('serviceNumber').lean();
    const maxNumber = siblings.reduce((max, s) => Math.max(max, parseInt(s.serviceNumber, 10) || 0), 0);
    serviceData.serviceNumber = String(maxNumber + 1).padStart(2, '0');

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
    const service = await resolveService(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    Object.assign(service, req.body);
    await service.save();

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
    const service = await resolveService(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.deleteOne();

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

    const service = await resolveService(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.status = status;
    await service.save();

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
