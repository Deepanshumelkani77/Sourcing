const API_BASE = 'http://localhost:5000/api'

const getAllJobs = async () => {
  try {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return { success: false, message: error.message }
  }
}

const getJobById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching job:', error)
    return { success: false, message: error.message }
  }
}

const createJob = async (jobData) => {
  try {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(jobData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating job:', error)
    return { success: false, message: error.message }
  }
}

const updateJob = async (id, jobData) => {
  try {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(jobData),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating job:', error)
    return { success: false, message: error.message }
  }
}

const deleteJob = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting job:', error)
    return { success: false, message: error.message }
  }
}

export { getAllJobs, getJobById, createJob, updateJob, deleteJob }
