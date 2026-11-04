const API_URL = "https://sourcing-x379.onrender.com";

// Upload single image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/upload/single`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/api/upload/multiple`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const response = await fetch(`${API_URL}/api/upload/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ publicId })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Upload document (BL, Invoice, Packing List)
export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_URL}/api/upload/document`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
