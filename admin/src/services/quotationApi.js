const API_URL = 'https://sourcing-x379.onrender.com';

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

// Get all quotations
export const getQuotations = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/quotations${queryString ? `?${queryString}` : ''}`;
    
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

// Get quotation by ID
export const getQuotationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/quotations/${id}`, {
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

// Update quotation status
export const updateQuotationStatus = async (id, status, adminNotes, quotedPrice) => {
  try {
    const response = await fetch(`${API_URL}/api/quotations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify({ status, adminNotes, quotedPrice }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
