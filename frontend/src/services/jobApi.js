const API_BASE = import.meta.env.API_URL || 'http://localhost:5000';

const getActiveJobs = async () => {
  try {
    const response = await fetch(`${API_BASE}/jobs/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return { success: false, message: error.message }
  }
}

export { getActiveJobs }
