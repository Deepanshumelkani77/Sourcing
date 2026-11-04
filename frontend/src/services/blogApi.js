const API_URL = import.meta.env.VITE_API_URL;

// Get published blogs (public)
export const getPublishedBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/api/blogs/published${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get blog by slug (public)
export const getBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/api/blogs/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
