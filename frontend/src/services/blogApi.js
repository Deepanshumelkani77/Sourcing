const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('=== BLOG API CONFIG ===');
console.log('API_URL:', API_URL);
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);

// Get published blogs (public)
export const getPublishedBlogs = async (params = {}) => {
  try {
    // Remove undefined/null params from the query string
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${API_URL}/api/blogs/published${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching from URL:', url);
    console.log('Clean params:', cleanParams);
    console.log('Query string:', queryString);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, message: error.message };
  }
};

// Get blog by slug (public)
export const getBlogBySlug = async (slug) => {
  try {
    const url = `${API_URL}/api/blogs/slug/${slug}`;
    console.log('Fetching blog by slug from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, message: error.message };
  }
};
