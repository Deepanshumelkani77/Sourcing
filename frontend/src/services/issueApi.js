const API_BASE = 'http://localhost:5000/api'

const submitOrderIssue = async (issueData) => {
  try {
    const formData = new FormData()
    
    // Add all fields to FormData
    formData.append('orderId', issueData.orderId)
    formData.append('orderNumber', issueData.orderNumber)
    formData.append('type', issueData.type)
    formData.append('description', issueData.description)
    formData.append('resolution', issueData.resolution)
    
    // Add item IDs as JSON string
    if (issueData.itemIds && issueData.itemIds.length > 0) {
      formData.append('itemIds', JSON.stringify(issueData.itemIds))
    }
    
    // Add files
    if (issueData.files && issueData.files.length > 0) {
      issueData.files.forEach((file) => {
        formData.append('files', file)
      })
    }

    const response = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type header when using FormData - browser sets it automatically with boundary
      },
      credentials: 'include',
      body: formData,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error submitting issue:', error)
    return { success: false, message: error.message }
  }
}

export { submitOrderIssue }
