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

// Get user's orders
export const getUserOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orders/my-orders`, {
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

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${id}`, {
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
