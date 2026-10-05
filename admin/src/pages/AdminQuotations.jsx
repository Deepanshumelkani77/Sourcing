import React, { useEffect, useState } from 'react'
import { getQuotations, updateQuotationStatus } from '../services/quotationApi'

const AdminQuotations = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ status: '', adminNotes: '', quotedPrice: '' })

  useEffect(() => {
    fetchQuotations()
  }, [searchTerm, statusFilter])

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter
      
      const result = await getQuotations(params)
      if (result.success) {
        setQuotations(result.quotations)
      }
    } catch (error) {
      console.error('Error fetching quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation)
    setEditData({
      status: quotation.status,
      adminNotes: quotation.adminNotes || '',
      quotedPrice: quotation.quotedPrice || ''
    })
    setEditMode(false)
  }

  const handleStatusUpdate = async () => {
    try {
      const result = await updateQuotationStatus(
        selectedQuotation._id,
        editData.status,
        editData.adminNotes,
        editData.quotedPrice ? parseFloat(editData.quotedPrice) : null
      )
      if (result.success) {
        fetchQuotations()
        setSelectedQuotation(null)
        setEditMode(false)
      } else {
        alert(result.message || 'Failed to update quotation')
      }
    } catch (error) {
      console.error('Error updating quotation:', error)
      alert('Failed to update quotation')
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quotation Requests</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
 >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : quotations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No quotation requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map((quotation) => (
                  <tr key={quotation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F41703] to-[#F97316] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {quotation.firstName[0]}{quotation.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {quotation.firstName} {quotation.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{quotation.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{quotation.productName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quotation.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quotation.companyName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                        {quotation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(quotation.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(quotation)}
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

      {/* Quotation Detail Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Quotation Details</h3>
              <button
                onClick={() => setSelectedQuotation(null)}
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
                    <p className="text-gray-800">{selectedQuotation.firstName} {selectedQuotation.middleName} {selectedQuotation.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-800">{selectedQuotation.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-800">{selectedQuotation.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                    <p className="text-gray-800">{selectedQuotation.companyName || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Product Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Product</label>
                    <p className="text-gray-800 font-medium">{selectedQuotation.productName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                    <p className="text-gray-800">{selectedQuotation.quantity}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedQuotation.message}</p>
              </div>

              {/* Admin Actions */}
              {editMode ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Update Quotation</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quoted Price (USD)</label>
                      <input
                        type="number"
                        value={editData.quotedPrice}
                        onChange={(e) => setEditData({ ...editData, quotedPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                      <textarea
                        value={editData.adminNotes}
                        onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none resize-none"
                        placeholder="Add notes..."
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
                </div>
              )}

              {/* Current Status Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                    {selectedQuotation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                {selectedQuotation.quotedPrice && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Quoted Price:</span>
                    <span className="text-gray-800 font-medium">${selectedQuotation.quotedPrice}</span>
                  </div>
                )}
                {selectedQuotation.adminNotes && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">Admin Notes:</span>
                    <p className="text-gray-800 text-sm bg-gray-50 p-2 rounded mt-1">{selectedQuotation.adminNotes}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Submitted:</span>
                  <span className="text-gray-800">{formatDate(selectedQuotation.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminQuotations
