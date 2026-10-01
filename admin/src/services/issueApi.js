const API_BASE = 'http://localhost:5000/api'

const getIssues = async () => {
  try {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching issues:', error)
    return { success: false, message: error.message }
  }
}

const getIssueById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/issues/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching issue:', error)
    return { success: false, message: error.message }
  }
}

const updateIssueStatus = async (id, status, adminNotes) => {
  try {
    const response = await fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status, adminNotes }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating issue status:', error)
    return { success: false, message: error.message }
  }
}

export { getIssues, getIssueById, updateIssueStatus }
