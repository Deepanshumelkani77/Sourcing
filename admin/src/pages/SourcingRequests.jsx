import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/axios'

const SourcingRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [filterStatus])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      const params = filterStatus !== 'all' ? { status: filterStatus } : {}
      const response = await api.get('/api/sourcing-requests', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(response.data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch sourcing requests:', err)
      setRequests([])
      setLoading(false)
    }
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await api.put(`/api/sourcing-requests/${requestId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchRequests()
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status')
    }
  }

  const handleAssign = async (requestId) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await api.put(`/api/sourcing-requests/${requestId}`, {
        assignedTo: JSON.parse(localStorage.getItem('user'))._id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchRequests()
      alert('Request assigned to you successfully')
    } catch (err) {
      console.error('Failed to assign request:', err)
      alert('Failed to assign request')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700',
      'Contacted': 'bg-yellow-100 text-yellow-700',
      'Qualified': 'bg-green-100 text-green-700',
      'In Progress': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Lost': 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getServiceName = (serviceId) => {
    const serviceNames = {
      'supplier-identification': 'Supplier Identification',
      'supplier-evaluation': 'Supplier Evaluation & Verification',
      'sample-inspection': 'Sample Inspection',
      'buyer-sample-approval': 'Buyer Sample Approval',
      'order-placement': 'Order Placement',
      'contract-documentation': 'Contract & Documentation',
      'production-monitoring': 'Production Monitoring',
      'quality-inspection': 'Quality Inspection',
      'quantity-verification': 'Quantity Verification',
      'dispatch-coordination': 'Dispatch Coordination',
      'local-transportation': 'Local Transportation',
      'receiving-delivery': 'Receiving & Delivery',
    }
    return serviceNames[serviceId] || serviceId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sourcing Requests</h2>
          <p className="text-gray-600 mt-1">Manage service requests from the website</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-gray-900">{requests.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">New</div>
          <div className="text-3xl font-bold text-blue-600">
            {requests.filter(r => r.status === 'New').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-purple-600">
            {requests.filter(r => r.status === 'In Progress').length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-bold text-green-600">
            {requests.filter(r => r.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                    {request.companyName && (
                      <div className="text-xs text-gray-400">{request.companyName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.productCategory}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {request.selectedServices.slice(0, 3).map((serviceId, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-red-50 text-red-700 rounded"
                        >
                          {getServiceName(serviceId).split(' ')[0]}
                        </span>
                      ))}
                      {request.selectedServices.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{request.selectedServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.destinationCountry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAssign(request._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {requests.length === 0 && (
          <div className="text-center py-12 text-gray-500">No sourcing requests found</div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Request Details</h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedRequest(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.companyName || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Service Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Service Requirements</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Product Category:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.productCategory}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Target Price:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.targetPrice || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Destination:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedRequest.destinationCountry}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery Date:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {selectedRequest.requiredDeliveryDate 
                        ? new Date(selectedRequest.requiredDeliveryDate).toLocaleDateString()
                        : 'Not specified'}
                    </span>
                  </div>
                </div>
                {selectedRequest.productSpecifications && (
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Specifications:</span>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.productSpecifications}</p>
                  </div>
                )}
              </div>

              {/* Selected Services */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Selected Services ({selectedRequest.selectedServices.length})</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRequest.selectedServices.map((serviceId) => (
                    <div
                      key={serviceId}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200 text-sm"
                    >
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {getServiceName(serviceId)}
                    </div>
                  ))}
                </div>
              </div>

              {/* CRM Lead Link */}
              {selectedRequest.leadId && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">CRM Lead Created</h4>
                  <div className="text-sm text-gray-600">
                    This request has been converted to a CRM Lead.
                    <Link
                      to={`/crm/leads`}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Lead →
                    </Link>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['New', 'Contacted', 'Qualified', 'In Progress', 'Completed', 'Lost'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedRequest._id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedRequest.status === status
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SourcingRequests
