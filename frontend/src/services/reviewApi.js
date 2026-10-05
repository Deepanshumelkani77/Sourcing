const API_URL = import.meta.env.API_URL;

// Submit review
export const submitReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get approved reviews
export const getApprovedReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/approved`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
