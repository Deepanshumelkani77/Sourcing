const API_URL = 'https://sourcing-x379.onrender.com';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Get all users
export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/users${queryString ? `?${queryString}` : ''}`;

    const headers = getAuthHeader();
    console.log('getAllUsers - Headers:', headers);
    console.log('getAllUsers - Token in localStorage:', !!localStorage.getItem('admin_token'));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
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

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
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
