import React, { useEffect, useState } from 'react'
import { getIssues, updateIssueStatus } from '../services/issueApi'

const ISSUE_TYPES = {
  wrong_item: 'Wrong item received',
  missing_items: 'Missing items',
  damaged: 'Damaged goods',
  quantity: 'Quantity mismatch',
  quality: 'Quality not as expected',
  other: 'Something else'
}

const STATUS_COLORS = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed: 'bg-slate-50 text-slate-700 border-slate-200'
}

const STATUS_BADGE = {
  Pending: 'bg-amber-500',
  'In Review': 'bg-blue-500',
  Resolved: 'bg-emerald-500',
  Closed: 'bg-slate-400'
}

const AdminIssues = () => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      setLoading(true)
      const result = await getIssues()
      if (result.success) {
        setIssues(result.issues || [])
        setError('')
      } else {
        setError(result.message || 'Failed to fetch issues')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }

  const handleViewIssue = (issue) => {
    setSelectedIssue(issue)
    setShowModal(true)
  }

  const handleUpdateStatus = async (status, adminNotes) => {
    if (!selectedIssue) return

    try {
      setUpdating(true)
      const result = await updateIssueStatus(selectedIssue._id, status, adminNotes)
      if (result.success) {
        setIssues(issues.map(i => i._id === selectedIssue._id ? { ...i, status, adminNotes } : i))
        setSelectedIssue({ ...selectedIssue, status, adminNotes })
        setShowModal(false)
      } else {
        alert(result.message || 'Failed to update status')
      }
    } catch (err) {
      alert(err.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStats = () => {
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'Pending').length,
      inReview: issues.filter(i => i.status === 'In Review').length,
      resolved: issues.filter(i => i.status === 'Resolved').length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F41703]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Issues</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage reported order issues</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Issues</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">In Review</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inReview}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Resolved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.resolved}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Issues Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Issues</h2>
            <button
              onClick={fetchIssues}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          {issues.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">No issues reported</p>
              <p className="text-gray-500 text-sm mt-1">Customer issues will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 font-medium">Ticket</th>
                    <th className="px-6 py-3 font-medium">Order</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {issues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{issue.ticketNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{issue.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {issue.userId?.firstName || ''} {issue.userId?.lastName || ''}
                          </p>
                          <p className="text-xs text-gray-500">{issue.userId?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{ISSUE_TYPES[issue.type] || issue.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[issue.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_BADGE[issue.status]}`} />
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(issue.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewIssue(issue)}
                          className="text-sm font-medium text-[#F41703] hover:text-[#d01503] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedIssue.ticketNumber}</h3>
                <p className="text-sm text-gray-500">{selectedIssue.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium">
                      {selectedIssue.userId?.firstName || ''} {selectedIssue.userId?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{selectedIssue.userId?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Issue Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900 font-medium">{ISSUE_TYPES[selectedIssue.type] || selectedIssue.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resolution Requested</span>
                    <span className="text-gray-900 font-medium">{selectedIssue.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selectedIssue.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_BADGE[selectedIssue.status]}`} />
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reported On</span>
                    <span className="text-gray-900 font-medium">{formatDate(selectedIssue.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4">{selectedIssue.description}</p>
              </div>

              {/* Affected Items */}
              {selectedIssue.itemIds && selectedIssue.itemIds.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Affected Items</h4>
                  <div className="space-y-2">
                    {selectedIssue.itemIds.map((itemId, index) => (
                      <div key={index} className="text-sm text-gray-900 bg-gray-50 rounded-lg px-4 py-2">
                        Item ID: {itemId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Photos */}
              {selectedIssue.files && selectedIssue.files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Attached Photos</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedIssue.files.map((file, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={`http://localhost:5000${file.path}`}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25)" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedIssue.adminNotes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Admin Notes</h4>
                  <p className="text-sm text-gray-900 bg-blue-50 rounded-lg p-4">{selectedIssue.adminNotes}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Update Status</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">New Status</label>
                    <select
                      id="status-select"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                      defaultValue={selectedIssue.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Admin Notes</label>
                    <textarea
                      id="admin-notes"
                      rows={3}
                      placeholder="Add notes about this issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent resize-none"
                      defaultValue={selectedIssue.adminNotes || ''}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const status = document.getElementById('status-select').value
                      const adminNotes = document.getElementById('admin-notes').value
                      handleUpdateStatus(status, adminNotes)
                    }}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-[#F41703] text-white rounded-lg font-medium hover:bg-[#d01503] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminIssues
