import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Quotations = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState(null)
  const [formData, setFormData] = useState({
    customerId: '',
    leadId: '',
    dealId: '',
    title: '',
    validityPeriod: '',
    status: 'Draft',
    totalAmount: '',
    currency: 'USD',
    items: [],
    terms: '',
    paymentTerms: '',
    deliveryTerms: '',
  })

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      const response = await axios.get('/api/crm/quotations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setQuotations(response.data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch quotations:', err)
      setQuotations([])
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      if (editingQuotation) {
        await axios.put(`/api/crm/quotations/${editingQuotation._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post('/api/crm/quotations', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setShowModal(false)
      setEditingQuotation(null)
      resetForm()
      fetchQuotations()
    } catch (err) {
      console.error('Failed to save quotation:', err)
    }
  }

  const handleSend = async (id) => {
    if (!window.confirm('Send this quotation to the customer?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.put(`/api/crm/quotations/${id}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchQuotations()
    } catch (err) {
      console.error('Failed to send quotation:', err)
    }
  }

  const handleAccept = async (id) => {
    if (!window.confirm('Mark this quotation as accepted?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.put(`/api/crm/quotations/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchQuotations()
    } catch (err) {
      console.error('Failed to accept quotation:', err)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Mark this quotation as rejected?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.put(`/api/crm/quotations/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchQuotations()
    } catch (err) {
      console.error('Failed to reject quotation:', err)
    }
  }

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation)
    setFormData({
      customerId: quotation.customerId || '',
      leadId: quotation.leadId || '',
      dealId: quotation.dealId || '',
      title: quotation.title || '',
      validityPeriod: quotation.validityPeriod ? quotation.validityPeriod.split('T')[0] : '',
      status: quotation.status || 'Draft',
      totalAmount: quotation.totalAmount || '',
      currency: quotation.currency || 'USD',
      items: quotation.items || [],
      terms: quotation.terms || '',
      paymentTerms: quotation.paymentTerms || '',
      deliveryTerms: quotation.deliveryTerms || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await axios.delete(`/api/crm/quotations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchQuotations()
    } catch (err) {
      console.error('Failed to delete quotation:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      leadId: '',
      dealId: '',
      title: '',
      validityPeriod: '',
      status: 'Draft',
      totalAmount: '',
      currency: 'USD',
      items: [],
      terms: '',
      paymentTerms: '',
      deliveryTerms: '',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Sent: 'bg-blue-100 text-blue-700',
      Accepted: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
      Expired: 'bg-yellow-100 text-yellow-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
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
        <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
        <button
          onClick={() => {
            resetForm()
            setEditingQuotation(null)
            setShowModal(true)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Create Quotation
        </button>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotations.map((quotation) => (
                <tr key={quotation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quotation.quotationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.customerId?.customerName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.currency} {quotation.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.validityPeriod
                      ? new Date(quotation.validityPeriod).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(quotation)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    {quotation.status === 'Draft' && (
                      <button
                        onClick={() => handleSend(quotation._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Send
                      </button>
                    )}
                    {quotation.status === 'Sent' && (
                      <>
                        <button
                          onClick={() => handleAccept(quotation._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(quotation._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(quotation._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {quotations.length === 0 && (
          <div className="text-center py-12 text-gray-500">No quotations found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingQuotation ? 'Edit Quotation' : 'Create Quotation'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <input
                    type="text"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                  <input
                    type="text"
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal ID</label>
                  <input
                    type="text"
                    value={formData.dealId}
                    onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount *</label>
                  <input
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity Period</label>
                <input
                  type="date"
                  value={formData.validityPeriod}
                  onChange={(e) => setFormData({ ...formData, validityPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Terms</label>
                  <input
                    type="text"
                    value={formData.deliveryTerms}
                    onChange={(e) => setFormData({ ...formData, deliveryTerms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingQuotation(null)
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
                  {editingQuotation ? 'Update Quotation' : 'Create Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quotations
