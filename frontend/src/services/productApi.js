import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllProducts = async (lang = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/api/products`, {
      params: { lang }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Unable to fetch products' };
  }
};

export const getProductBySlug = async (slug, lang = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${slug}`, {
      params: { lang }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Unable to fetch product' };
  }
};
