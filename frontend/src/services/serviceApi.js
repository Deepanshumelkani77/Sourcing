const API_URL = import.meta.env.VITE_API_URL || 'https://sourcing-x379.onrender.com';

// Get all services grouped by phase
export const getAllServices = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/services${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, message: error.message };
  }
};

// Get service by ID
export const getServiceById = async (id, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/services/${id}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, message: error.message };
  }
};

// Get services by phase
export const getServicesByPhase = async (phaseId, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/services/phase/${phaseId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services by phase:', error);
    return { success: false, message: error.message };
  }
};
