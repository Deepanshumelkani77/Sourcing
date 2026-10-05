const API_URL = "https://sourcing-x379.onrender.com";

// Submit quotation request
export const submitQuotation = async (quotationData) => {
  try {
    const response = await fetch(`${API_URL}/api/quotations/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(quotationData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
