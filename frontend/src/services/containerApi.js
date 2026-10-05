const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

// Get auth token from cookies
const getAuthHeader = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Create container
export const createContainer = async (containerData) => {
  try {
    const response = await fetch(`${API_URL}/api/containers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify(containerData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get all containers (admin)
export const getAllContainers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/containers${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get container by ID
export const getContainerById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/containers/${id}`, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update container status
export const updateContainerStatus = async (id, statusData) => {
  try {
    const response = await fetch(`${API_URL}/api/containers/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify(statusData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update container details
export const updateContainer = async (id, containerData) => {
  try {
    const response = await fetch(`${API_URL}/api/containers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify(containerData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete container
export const deleteContainer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/containers/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get user containers (customer dashboard)
export const getUserContainers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/containers/my-containers`, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get available orders for adding to container
export const getAvailableOrders = async (search = '') => {
  try {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`${API_URL}/api/containers/available-orders${queryString}`, {
      method: 'GET',
      headers: {
        ...getAuthHeader()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
