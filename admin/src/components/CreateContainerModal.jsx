import React, { useState, useEffect } from 'react'
import { createContainer, getAvailableOrders } from '../services/containerApi'

const CreateContainerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    // Container Information
    blNo: '',
    vesselName: '',
    voyageNo: '',
    pol: '',
    etd: '',
    pod: '',
    eta: '',
    containerNo: '',
    sealNo: '',
    transitRoute: '',
    noOfShippers: 0,
    // Shipper/Exporter Information
    shippers: [{
      name: '',
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      country: '',
      pinCode: '',
      contactPerson: '',
      contactNo: '',
      packingList: '',
      invoiceNo: '',
      dateOfInvoice: '',
      hsnCode: '',
      descriptionOfGoods: '',
      quantity: '',
      weight: '',
      dimension: '',
      packageType: '',
      identifiersOnPackage: '',
      cooNo: '',
      agreementNo: '',
      dateOfAgreement: ''
    }],
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
      blNo: '',
      vesselName: '',
      voyageNo: '',
      pol: '',
      etd: '',
      pod: '',
      eta: '',
      containerNo: '',
      sealNo: '',
      transitRoute: '',
      noOfShippers: 0,
      shippers: [{
        name: '',
        address: '',
        subDistrict: '',
        district: '',
        province: '',
        country: '',
        pinCode: '',
        contactPerson: '',
        contactNo: '',
        packingList: '',
        invoiceNo: '',
        dateOfInvoice: '',
        hsnCode: '',
        descriptionOfGoods: '',
        quantity: '',
        weight: '',
        dimension: '',
        packageType: '',
        identifiersOnPackage: '',
        cooNo: '',
        agreementNo: '',
        dateOfAgreement: ''
      }],
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    BL No. (Bill of Lading No.)
                  </label>
                  <input
                    type="text"
                    name="blNo"
                    value={formData.blNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="BL123456"
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
                    Voyage No.
                  </label>
                  <input
                    type="text"
                    name="voyageNo"
                    value={formData.voyageNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="MSC12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    POL (Port of Loading)
                  </label>
                  <input
                    type="text"
                    name="pol"
                    value={formData.pol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Shenzhen, China"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ETD (Estimated Time of Departure)
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
                    POD (Port of Discharge)
                  </label>
                  <input
                    type="text"
                    name="pod"
                    value={formData.pod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Mundra, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ETA (Estimated Time of Arrival)
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
                    Container No.
                  </label>
                  <input
                    type="text"
                    name="containerNo"
                    value={formData.containerNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="MSCU1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seal No.
                  </label>
                  <input
                    type="text"
                    name="sealNo"
                    value={formData.sealNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="SEAL123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transit Route
                  </label>
                  <input
                    type="text"
                    name="transitRoute"
                    value={formData.transitRoute}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Shenzhen -> Singapore -> Mundra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No. of Shipper/Exporter
                  </label>
                  <input
                    type="number"
                    name="noOfShippers"
                    value={formData.noOfShippers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>

            {/* Shipper/Exporter Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Shipper/Exporter Information</h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      shippers: [...formData.shippers, {
                        name: '',
                        address: '',
                        subDistrict: '',
                        district: '',
                        province: '',
                        country: '',
                        pinCode: '',
                        contactPerson: '',
                        contactNo: '',
                        packingList: '',
                        invoiceNo: '',
                        dateOfInvoice: '',
                        hsnCode: '',
                        descriptionOfGoods: '',
                        quantity: '',
                        weight: '',
                        dimension: '',
                        packageType: '',
                        identifiersOnPackage: '',
                        cooNo: '',
                        agreementNo: '',
                        dateOfAgreement: ''
                      }]
                    })
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  + Add Shipper
                </button>
              </div>
              {formData.shippers.map((shipper, shipperIndex) => (
                <div key={shipperIndex} className="bg-gray-50 rounded-xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Shipper {shipperIndex + 1}</h4>
                    {formData.shippers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newShippers = formData.shippers.filter((_, i) => i !== shipperIndex)
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={shipper.name}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].name = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={shipper.address}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].address = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Full Address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sub District</label>
                      <input
                        type="text"
                        value={shipper.subDistrict}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].subDistrict = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Sub District"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <input
                        type="text"
                        value={shipper.district}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].district = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="District"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                      <input
                        type="text"
                        value={shipper.province}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].province = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Province"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={shipper.country}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].country = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                      <input
                        type="text"
                        value={shipper.pinCode}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].pinCode = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="PIN Code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input
                        type="text"
                        value={shipper.contactPerson}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].contactPerson = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Contact Person"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
                      <input
                        type="text"
                        value={shipper.contactNo}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].contactNo = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Contact Number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Packing List</label>
                      <input
                        type="text"
                        value={shipper.packingList}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].packingList = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Packing List Reference"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice No.</label>
                      <input
                        type="text"
                        value={shipper.invoiceNo}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].invoiceNo = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Invoice Number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Invoice</label>
                      <input
                        type="date"
                        value={shipper.dateOfInvoice}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].dateOfInvoice = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code</label>
                      <input
                        type="text"
                        value={shipper.hsnCode}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].hsnCode = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="HSN Code"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description of Goods</label>
                      <textarea
                        value={shipper.descriptionOfGoods}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].descriptionOfGoods = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Goods Description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input
                        type="text"
                        value={shipper.quantity}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].quantity = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Quantity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                      <input
                        type="text"
                        value={shipper.weight}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].weight = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Weight"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dimension</label>
                      <input
                        type="text"
                        value={shipper.dimension}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].dimension = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="L x W x H"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                      <input
                        type="text"
                        value={shipper.packageType}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].packageType = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Package Type"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Identifiers on Package</label>
                      <input
                        type="text"
                        value={shipper.identifiersOnPackage}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].identifiersOnPackage = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Package Identifiers"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">COO No.</label>
                      <input
                        type="text"
                        value={shipper.cooNo}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].cooNo = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Certificate of Origin No."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agreement No.</label>
                      <input
                        type="text"
                        value={shipper.agreementNo}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].agreementNo = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                        placeholder="Agreement Number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Agreement</label>
                      <input
                        type="date"
                        value={shipper.dateOfAgreement}
                        onChange={(e) => {
                          const newShippers = [...formData.shippers]
                          newShippers[shipperIndex].dateOfAgreement = e.target.value
                          setFormData({ ...formData, shippers: newShippers })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
