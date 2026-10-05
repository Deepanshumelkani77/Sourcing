const API_URL = "https://sourcing-x379.onrender.com";

// Get auth token from cookies
const getAuthHeader = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('admin_token='));
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Get all contact submissions
export const getContacts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/contact${queryString ? `?${queryString}` : ''}`;
    
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

// Update contact status
export const updateContactStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/api/contact/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
