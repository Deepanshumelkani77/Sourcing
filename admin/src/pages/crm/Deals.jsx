import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/axios'

const Deals = () => {
  const [pipeline, setPipeline] = useState({})
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [viewMode, setViewMode] = useState('pipeline')

  const stages = ['Qualified', 'Sourcing/Proposal', 'Negotiation', 'Won', 'Lost']

  const [formData, setFormData] = useState({
    customerId: '',
    leadId: '',
    quotationId: '',
    title: '',
    description: '',
    dealValue: '',
    stage: 'Qualified',
    probability: 30,
    expectedClosingDate: '',
    actualClosingDate: '',
    sourceCountry: '',
    destinationCountry: '',
    paymentTerms: '',
    deliveryTerms: '',
    products: [],
    lostReason: '',
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      const response = await api.get('/api/crm/deals', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDeals(response.data.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch deals:', err)
      setDeals([])
      setLoading(false)
    }
  }

  const fetchPipeline = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      const response = await api.get('/api/crm/deals/pipeline', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPipeline(response.data.data || {})
    } catch (err) {
      console.error('Failed to fetch pipeline:', err)
      setPipeline({})
    }
  }

  useEffect(() => {
    if (viewMode === 'pipeline') {
      fetchPipeline()
    }
  }, [viewMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      if (editingDeal) {
        await api.put(`/api/crm/deals/${editingDeal._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await api.post('/api/crm/deals', formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setShowModal(false)
      setEditingDeal(null)
      resetForm()
      fetchDeals()
      if (viewMode === 'pipeline') fetchPipeline()
    } catch (err) {
      console.error('Failed to save deal:', err)
      console.error('Error response:', err.response?.data)
      console.error('Form data being sent:', formData)
      alert(`Failed to save deal: ${err.response?.data?.message || err.message}`)
    }
  }

  const handleStageUpdate = async (dealId, newStage) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await api.put(
        `/api/crm/deals/${dealId}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchPipeline()
      fetchDeals()
    } catch (err) {
      console.error('Failed to update deal stage:', err)
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setFormData({
      customerId: deal.customerId || '',
      leadId: deal.leadId || '',
      quotationId: deal.quotationId || '',
      title: deal.title || '',
      description: deal.description || '',
      dealValue: deal.dealValue || '',
      stage: deal.stage || 'Lead',
      probability: deal.probability || 10,
      expectedClosingDate: deal.expectedClosingDate ? deal.expectedClosingDate.split('T')[0] : '',
      actualClosingDate: deal.actualClosingDate ? deal.actualClosingDate.split('T')[0] : '',
      sourceCountry: deal.sourceCountry || '',
      destinationCountry: deal.destinationCountry || '',
      paymentTerms: deal.paymentTerms || '',
      deliveryTerms: deal.deliveryTerms || '',
      products: deal.products || [],
      lostReason: deal.lostReason || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token')
      await api.delete(`/api/crm/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchDeals()
      if (viewMode === 'pipeline') fetchPipeline()
    } catch (err) {
      console.error('Failed to delete deal:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      leadId: '',
      quotationId: '',
      title: '',
      description: '',
      dealValue: '',
      stage: 'Qualified',
      probability: 30,
      expectedClosingDate: '',
      actualClosingDate: '',
      sourceCountry: '',
      destinationCountry: '',
      paymentTerms: '',
      deliveryTerms: '',
      products: [],
      lostReason: '',
    })
  }

  const getStageColor = (stage) => {
    const colors = {
      Qualified: 'bg-blue-50 border-blue-300',
      'Sourcing/Proposal': 'bg-yellow-50 border-yellow-300',
      Negotiation: 'bg-orange-50 border-orange-300',
      Won: 'bg-green-50 border-green-300',
      Lost: 'bg-red-50 border-red-300',
    }
    return colors[stage] || 'bg-gray-50 border-gray-200'
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
      {/* CRM Sub-navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Link to="/crm" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Dashboard
          </Link>
          <Link to="/crm/leads" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Leads
          </Link>
          <Link to="/crm/customers" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Customers
          </Link>
          <Link to="/crm/followups" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Follow-ups
          </Link>
          <Link to="/crm/deals" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Deals
          </Link>
          <Link to="/crm/quotations" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Quotations
          </Link>
        </div>
      </div>

      {/* Pipeline Workflow Visualization */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline Workflow</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">Qualified</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-700">Sourcing/Proposal</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium text-gray-700">Negotiation</span>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">Won</span>
          </div>
          <div className="text-gray-400">or</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-700">Lost</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Deal Management</h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'pipeline' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => {
              resetForm()
              setEditingDeal(null)
              setShowModal(true)
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Add Deal
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-lg p-3 mb-3">
                <h3 className="font-semibold text-gray-900">{stage}</h3>
                <p className="text-sm text-gray-600">
                  {pipeline[stage]?.length || 0} deals
                </p>
              </div>
              <div className="space-y-3">
                {pipeline[stage]?.map((deal) => (
                  <div
                    key={deal._id}
                    className={`p-4 rounded-lg border-2 ${getStageColor(deal.stage)} cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{deal.title}</h4>
                      <span className="text-sm font-semibold text-gray-600">
                        ${deal.dealValue?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {deal.customerId?.customerName || deal.customerId?.companyName || 'No customer'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{deal.dealNumber}</span>
                      <span>{deal.probability}%</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageUpdate(deal._id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                      >
                        {stages.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEdit(deal)}
                        className="text-xs text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(deal._id)}
                        className="text-xs text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {(!pipeline[stage] || pipeline[stage].length === 0) && (
                  <div className="p-4 text-center text-sm text-gray-400 bg-gray-50 rounded-lg">
                    No deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deals.map((deal) => (
                  <tr key={deal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {deal.dealNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.customerId?.customerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${deal.dealValue?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.probability}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(deal)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(deal._id)}
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
          {deals.length === 0 && (
            <div className="text-center py-12 text-gray-500">No deals found</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation ID</label>
                  <input
                    type="text"
                    value={formData.quotationId}
                    onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.dealValue}
                    onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closing Date</label>
                  <input
                    type="date"
                    value={formData.expectedClosingDate}
                    onChange={(e) => setFormData({ ...formData, expectedClosingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Country</label>
                  <input
                    type="text"
                    value={formData.sourceCountry}
                    onChange={(e) => setFormData({ ...formData, sourceCountry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={formData.destinationCountry}
                    onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
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

              {formData.stage === 'Lost' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lost Reason</label>
                  <input
                    type="text"
                    value={formData.lostReason}
                    onChange={(e) => setFormData({ ...formData, lostReason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingDeal(null)
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
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deals
