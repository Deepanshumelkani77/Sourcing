const API_BASE = "https://sourcing-x379.onrender.com";

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
