import axios from 'axios';

const API_URL = "https://sourcing-x379.onrender.com";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Unable to fetch products' };
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Unable to fetch product' };
  }
};
