import React, { useEffect, useState } from 'react'
import axios from 'axios'

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([])
  const [todayFollowUps, setTodayFollowUps] = useState([])
  const [overdueFollowUps, setOverdueFollowUps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFollowUp, setEditingFollowUp] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    leadId: '',
    customerId: '',
    type: 'Call',
    scheduledDate: '',
    completedDate: '',
    status: 'Scheduled',
    outcome: '',
    notes: '',
    nextFollowUpDate: '',
    assignedTo: '',
  })

  useEffect(() => {
    fetchFollowUps()
  }, [])

  const fetchFollowUps = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      const [allRes, todayRes, overdueRes] = await Promise.all([
        axios.get('/api/crm/followups', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/crm/followups/today', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/crm/followups/overdue', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setFollowUps(allRes.data?.data || [])
      setTodayFollowUps(todayRes.data?.data || [])
      setOverdueFollowUps(overdueRes.data?.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch follow-ups:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      if (editingFollowUp) {
        await axios.put(`/api/crm/followups/${editingFollowUp._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post('/api/crm/followups', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setShowModal(false)
      setEditingFollowUp(null)
      resetForm()
      fetchFollowUps()
    } catch (err) {
      console.error('Failed to save follow-up:', err)
    }
  }

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.put(`/api/crm/followups/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchFollowUps()
    } catch (err) {
      console.error('Failed to complete follow-up:', err)
    }
  }

  const handleEdit = (followUp) => {
    setEditingFollowUp(followUp)
    setFormData({
      leadId: followUp.leadId || '',
      customerId: followUp.customerId || '',
      type: followUp.type || 'Call',
      scheduledDate: followUp.scheduledDate ? followUp.scheduledDate.split('T')[0] : '',
      completedDate: followUp.completedDate ? followUp.completedDate.split('T')[0] : '',
      status: followUp.status || 'Scheduled',
      outcome: followUp.outcome || '',
      notes: followUp.notes || '',
      nextFollowUpDate: followUp.nextFollowUpDate ? followUp.nextFollowUpDate.split('T')[0] : '',
      assignedTo: followUp.assignedTo || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this follow-up?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.delete(`/api/crm/followups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchFollowUps()
    } catch (err) {
      console.error('Failed to delete follow-up:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      leadId: '',
      customerId: '',
      type: 'Call',
      scheduledDate: '',
      completedDate: '',
      status: 'Scheduled',
      outcome: '',
      notes: '',
      nextFollowUpDate: '',
      assignedTo: '',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      Scheduled: 'bg-blue-100 text-blue-700',
      Completed: 'bg-green-100 text-green-700',
      Missed: 'bg-red-100 text-red-700',
      Cancelled: 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getTypeIcon = (type) => {
    const icons = {
      Call: '📞',
      Email: '📧',
      WhatsApp: '💬',
      Meeting: '👥',
      Visit: '📍',
      Other: '📝',
    }
    return icons[type] || '📝'
  }

  const getDisplayData = () => {
    switch (activeTab) {
      case 'today':
        return todayFollowUps
      case 'overdue':
        return overdueFollowUps
      default:
        return followUps
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const displayData = getDisplayData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Follow-up Management</h2>
        <button
          onClick={() => {
            resetForm()
            setEditingFollowUp(null)
            setShowModal(true)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Schedule Follow-up
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Follow-ups</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{todayFollowUps.length}</p>
            </div>
            <span className="text-4xl">📅</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{overdueFollowUps.length}</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Follow-ups</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{followUps.length}</p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({followUps.length})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'today'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Today ({todayFollowUps.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overdue'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overdue ({overdueFollowUps.length})
            </button>
          </nav>
        </div>

        {/* Follow-ups List */}
        <div className="divide-y divide-gray-200">
          {displayData.map((followUp) => (
            <div key={followUp._id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(followUp.type)}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{followUp.type}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(followUp.status)}`}>
                        {followUp.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {followUp.leadId?.customerName || followUp.customerId?.customerName || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Scheduled: {new Date(followUp.scheduledDate).toLocaleDateString()}</span>
                      {followUp.completedDate && (
                        <span>Completed: {new Date(followUp.completedDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    {followUp.notes && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                        {followUp.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {followUp.status === 'Scheduled' && (
                    <button
                      onClick={() => handleComplete(followUp._id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(followUp)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(followUp._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {displayData.length === 0 && (
            <div className="text-center py-12 text-gray-500">No follow-ups found</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFollowUp ? 'Edit Follow-up' : 'Schedule Follow-up'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Visit">Visit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Missed">Missed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                  <input
                    type="text"
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter lead ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <input
                    type="text"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter customer ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
                  <input
                    type="date"
                    value={formData.completedDate}
                    onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                <input
                  type="text"
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Interested, Not interested, Follow-up required"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                <input
                  type="date"
                  value={formData.nextFollowUpDate}
                  onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingFollowUp(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingFollowUp ? 'Update Follow-up' : 'Schedule Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FollowUps
