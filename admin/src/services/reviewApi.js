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

// Get all reviews
export const getReviews = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/reviews${queryString ? `?${queryString}` : ''}`;
    
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

// Get review by ID
export const getReviewById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
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

// Update review status
export const updateReviewStatus = async (id, status, adminResponse) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify({ status, adminResponse }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete review
export const deleteReview = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${id}`, {
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
