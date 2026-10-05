import React, { useEffect, useState } from 'react'
import { getReviews, updateReviewStatus, deleteReview } from '../services/reviewApi'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReview, setSelectedReview] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ status: '', adminResponse: '' })

  useEffect(() => {
    fetchReviews()
  }, [statusFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = {}
      if (statusFilter) params.status = statusFilter
      
      const result = await getReviews(params)
      if (result.success) {
        setReviews(result.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (review) => {
    setSelectedReview(review)
    setEditData({
      status: review.status,
      adminResponse: review.adminResponse || ''
    })
    setEditMode(false)
  }

  const handleStatusUpdate = async () => {
    try {
      const result = await updateReviewStatus(
        selectedReview._id,
        editData.status,
        editData.adminResponse
      )
      if (result.success) {
        fetchReviews()
        setSelectedReview(null)
        setEditMode(false)
      } else {
        alert(result.message || 'Failed to update review')
      }
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to update review')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const result = await deleteReview(selectedReview._id)
      if (result.success) {
        fetchReviews()
        setSelectedReview(null)
      } else {
        alert(result.message || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#F41703]' : 'text-gray-300'}`}
        fill={i < rating ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No reviews found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F41703] to-[#F97316] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{review.userName}</p>
                          <p className="text-xs text-gray-500">{review.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{review.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium max-w-xs truncate">{review.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(review.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(review)}
                        className="text-[#F41703] hover:text-[#d10f02] text-sm font-medium"
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

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Review Details</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-gray-800">{selectedReview.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-800">{selectedReview.userId?.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Order</label>
                    <p className="text-gray-800">{selectedReview.orderNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Rating</label>
                    <div className="flex gap-0.5">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2 text-gray-800">{selectedReview.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                <p className="text-gray-800 font-semibold text-lg">{selectedReview.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Comment</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedReview.comment}</p>
              </div>

              {/* Admin Actions */}
              {editMode ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Update Review</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Response</label>
                      <textarea
                        value={editData.adminResponse}
                        onChange={(e) => setEditData({ ...editData, adminResponse: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none resize-none"
                        placeholder="Add a response to this review..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleStatusUpdate}
                        className="flex-1 bg-[#F41703] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#d10f02] transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-[#F41703] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#d10f02] transition-colors"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Current Status Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                  </span>
                </div>
                {selectedReview.adminResponse && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Admin Response:</span>
                    <p className="text-gray-800 text-sm bg-gray-50 p-2 rounded mt-1">{selectedReview.adminResponse}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Submitted:</span>
                  <span className="text-gray-800">{formatDate(selectedReview.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Helpful Votes:</span>
                  <span className="text-gray-800">{selectedReview.helpful}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReviews
