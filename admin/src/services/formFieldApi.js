const API_URL = "https://sourcing-x379.onrender.com";

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Get field configurations for a form type
export const getFieldConfigurations = async (formType) => {
  try {
    const response = await fetch(`${API_URL}/api/form-fields/${formType}`, {
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

// Initialize default field configurations
export const initializeDefaultFields = async (formType) => {
  try {
    const response = await fetch(`${API_URL}/api/form-fields/${formType}/initialize`, {
      method: 'POST',
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

// Create a new field configuration
export const createFieldConfiguration = async (fieldData) => {
  try {
    const response = await fetch(`${API_URL}/api/form-fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify(fieldData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Update a field configuration
export const updateFieldConfiguration = async (id, fieldData) => {
  try {
    const response = await fetch(`${API_URL}/api/form-fields/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify(fieldData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete a field configuration
export const deleteFieldConfiguration = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/form-fields/${id}`, {
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
