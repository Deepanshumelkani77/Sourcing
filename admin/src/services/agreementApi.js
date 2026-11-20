const API_URL = "https://sourcing-x379.onrender.com";

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export const getAllAgreements = async ({ status, search } = {}) => {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params}` : '';
    const response = await fetch(`${API_URL}/api/agreements${query}`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAgreementStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/stats`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAgreementById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createAgreement = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateAgreement = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateAgreementStatus = async (id, status, note = '') => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify({ status, note })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const sendAgreement = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}/send`, {
      method: 'POST',
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const signAgreement = async (id, signerName, signedDocument = null) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      body: JSON.stringify({ signerName, signedDocument })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteAgreement = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const downloadAgreementPdf = async (agreement) => {
  try {
    const response = await fetch(`${API_URL}/api/agreements/${agreement._id}/pdf`, {
      headers: getAuthHeader(),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to generate PDF');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${agreement.agreementNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
