import React, { useState, useEffect } from 'react'
import { createContainer, getAvailableOrders } from '../services/containerApi'

const CreateContainerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    containerNumber: '',
    shippingType: 'Sea',
    origin: '',
    destination: '',
    etd: '',
    eta: '',
    vesselName: '',
    voyageNumber: '',
    goods: []
  })
  const [availableOrders, setAvailableOrders] = useState([])
  const [selectedOrders, setSelectedOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchAvailableOrders()
    }
  }, [isOpen, searchTerm])

  const fetchAvailableOrders = async () => {
    try {
      const result = await getAvailableOrders(searchTerm)
      if (result.success) {
        setAvailableOrders(result.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleOrderToggle = (order, item) => {
    const existingIndex = selectedOrders.findIndex(
      (selected) => selected.orderId === order._id && selected.productId === item.productId._id
    )

    if (existingIndex >= 0) {
      setSelectedOrders(selectedOrders.filter((_, i) => i !== existingIndex))
    } else {
      setSelectedOrders([
        ...selectedOrders,
        {
          orderId: order._id,
          userId: order.userId._id,
          productId: item.productId._id,
          quantity: item.quantity
        }
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (selectedOrders.length === 0) {
      setError('Please select at least one order to add to the container')
      return
    }

    try {
      setLoading(true)
      const result = await createContainer({
        ...formData,
        goods: selectedOrders
      })

      if (result.success) {
        onSuccess()
        resetForm()
      } else {
        setError(result.message || 'Failed to create container')
      }
    } catch (error) {
      setError('Error creating container')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      containerNumber: '',
      shippingType: 'Sea',
      origin: '',
      destination: '',
      etd: '',
      eta: '',
      vesselName: '',
      voyageNumber: '',
      goods: []
    })
    setSelectedOrders([])
    setSearchTerm('')
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F41703] to-[#F97316] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Container</h2>
              <p className="text-red-100 text-sm mt-1 opacity-90">Add a new shipment container</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Container Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Container Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Container Number *
                  </label>
                  <input
                    type="text"
                    name="containerNumber"
                    required
                    value={formData.containerNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="MSCU1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shipping Type *
                  </label>
                  <select
                    name="shippingType"
                    required
                    value={formData.shippingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  >
                    <option value="Sea">Sea</option>
                    <option value="Air">Air</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Origin *
                  </label>
                  <input
                    type="text"
                    name="origin"
                    required
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Shenzhen, China"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Mundra, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ETD
                  </label>
                  <input
                    type="date"
                    name="etd"
                    value={formData.etd}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ETA
                  </label>
                  <input
                    type="date"
                    name="eta"
                    value={formData.eta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vessel Name
                  </label>
                  <input
                    type="text"
                    name="vesselName"
                    value={formData.vesselName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="MSC Oscar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voyage Number
                  </label>
                  <input
                    type="text"
                    name="voyageNumber"
                    value={formData.voyageNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="MSC12345"
                  />
                </div>
              </div>
            </div>

            {/* Add Goods */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Goods</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search customer / order / product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
                {availableOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No available orders found</p>
                ) : (
                  availableOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedOrders.some(
                                (selected) =>
                                  selected.orderId === order._id && selected.productId === item.productId._id
                              )}
                              onChange={() => handleOrderToggle(order, item)}
                              className="w-4 h-4 text-[#F41703] rounded focus:ring-[#F41703]"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{item.productId?.productName}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedOrders.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    {selectedOrders.length} item(s) selected
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F41703] to-[#F97316] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#d10f02] hover:to-[#ea580c] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Container'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateContainerModal
