const API_URL = import.meta.env.VITE_API_URL;

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
