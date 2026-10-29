import React, { useState, useEffect } from 'react'

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    phaseId: '',
    phaseNumber: '',
    phaseName: '',
    phaseTagline: '',
    serviceId: '',
    serviceNumber: '',
    serviceTitle: '',
    serviceDescription: '',
    serviceDetails: '',
    included: [''],
    deliverable: '',
    order: 0,
    status: 'active',
    translations: []
  })

  const [zhTranslation, setZhTranslation] = useState({
    phaseName: '',
    phaseTagline: '',
    serviceTitle: '',
    serviceDescription: '',
    serviceDetails: '',
    included: [''],
    deliverable: ''
  })

  useEffect(() => {
    if (service) {
      setFormData({
        phaseId: service.phaseId || '',
        phaseNumber: service.phaseNumber || '',
        phaseName: service.phaseName || '',
        phaseTagline: service.phaseTagline || '',
        serviceId: service.serviceId || '',
        serviceNumber: service.serviceNumber || '',
        serviceTitle: service.title || service.serviceTitle || '',
        serviceDescription: service.description || service.serviceDescription || '',
        serviceDetails: service.details || service.serviceDetails || '',
        included: service.included || [''],
        deliverable: service.deliverable || '',
        order: service.order || 0,
        status: service.status || 'active',
        translations: service.translations || []
      })

      // Find Chinese translation if exists
      const zhTrans = service.translations?.find(t => t.language === 'zh')
      if (zhTrans) {
        setZhTranslation({
          phaseName: zhTrans.phaseName || '',
          phaseTagline: zhTrans.phaseTagline || '',
          serviceTitle: zhTrans.serviceTitle || '',
          serviceDescription: zhTrans.serviceDescription || '',
          serviceDetails: zhTrans.serviceDetails || '',
          included: zhTrans.included || [''],
          deliverable: zhTrans.deliverable || ''
        })
      }
    }
  }, [service])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIncludedChange = (index, value) => {
    const newIncluded = [...formData.included]
    newIncluded[index] = value
    setFormData(prev => ({ ...prev, included: newIncluded }))
  }

  const addIncludedItem = () => {
    setFormData(prev => ({ ...prev, included: [...prev.included, ''] }))
  }

  const removeIncludedItem = (index) => {
    if (formData.included.length > 1) {
      const newIncluded = formData.included.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, included: newIncluded }))
    }
  }

  const handleZhChange = (e) => {
    const { name, value } = e.target
    setZhTranslation(prev => ({ ...prev, [name]: value }))
  }

  const handleZhIncludedChange = (index, value) => {
    const newIncluded = [...zhTranslation.included]
    newIncluded[index] = value
    setZhTranslation(prev => ({ ...prev, included: newIncluded }))
  }

  const addZhIncludedItem = () => {
    setZhTranslation(prev => ({ ...prev, included: [...prev.included, ''] }))
  }

  const removeZhIncludedItem = (index) => {
    if (zhTranslation.included.length > 1) {
      const newIncluded = zhTranslation.included.filter((_, i) => i !== index)
      setZhTranslation(prev => ({ ...prev, included: newIncluded }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Prepare translations
    const translations = []
    if (zhTranslation.phaseName || zhTranslation.serviceTitle) {
      translations.push({
        language: 'zh',
        phaseName: zhTranslation.phaseName,
        phaseTagline: zhTranslation.phaseTagline,
        serviceTitle: zhTranslation.serviceTitle,
        serviceDescription: zhTranslation.serviceDescription,
        serviceDetails: zhTranslation.serviceDetails,
        included: zhTranslation.included.filter(item => item.trim() !== ''),
        deliverable: zhTranslation.deliverable
      })
    }

    const submitData = {
      ...formData,
      included: formData.included.filter(item => item.trim() !== ''),
      translations
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phase Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Phase Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase ID</label>
            <input
              type="text"
              name="phaseId"
              value={formData.phaseId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., source, sample, order, quality"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase Number</label>
            <input
              type="text"
              name="phaseNumber"
              value={formData.phaseNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., 01, 02, 03, 04"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase Name</label>
            <input
              type="text"
              name="phaseName"
              value={formData.phaseName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., Source, Sample, Order & Production"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase Tagline</label>
            <input
              type="text"
              name="phaseTagline"
              value={formData.phaseTagline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., Find and vet the right manufacturers"
            />
          </div>
        </div>
      </div>

      {/* Service Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Service Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service ID</label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., supplier-identification"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Number</label>
            <input
              type="text"
              name="serviceNumber"
              value={formData.serviceNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., 01, 02, 03"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
            <input
              type="text"
              name="serviceTitle"
              value={formData.serviceTitle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="e.g., Supplier Identification"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
            <textarea
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="Brief description of the service"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Details</label>
            <textarea
              name="serviceDetails"
              value={formData.serviceDetails}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="Detailed explanation of the service"
            />
          </div>
        </div>
      </div>

      {/* Included Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Included Items</h3>
        <div className="space-y-2">
          {formData.included.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleIncludedChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                placeholder="e.g., Factory audits"
              />
              {formData.included.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIncludedItem(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIncludedItem}
            className="px-4 py-2 text-sm font-medium text-[#F41703] hover:bg-[#F41703]/5 rounded-lg transition-colors"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Deliverable */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Deliverable</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What the client receives</label>
          <textarea
            name="deliverable"
            value={formData.deliverable}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            placeholder="e.g., Detailed supplier evaluation report with verification results"
          />
        </div>
      </div>

      {/* Order and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            placeholder="Order within phase"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Chinese Translation */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Chinese Translation (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase Name (中文)</label>
            <input
              type="text"
              name="phaseName"
              value={zhTranslation.phaseName}
              onChange={handleZhChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="阶段名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase Tagline (中文)</label>
            <input
              type="text"
              name="phaseTagline"
              value={zhTranslation.phaseTagline}
              onChange={handleZhChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="阶段标语"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Title (中文)</label>
            <input
              type="text"
              name="serviceTitle"
              value={zhTranslation.serviceTitle}
              onChange={handleZhChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="服务标题"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Description (中文)</label>
            <textarea
              name="serviceDescription"
              value={zhTranslation.serviceDescription}
              onChange={handleZhChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="服务描述"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Details (中文)</label>
            <textarea
              name="serviceDetails"
              value={zhTranslation.serviceDetails}
              onChange={handleZhChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
              placeholder="服务详情"
            />
          </div>
        </div>

        {/* Chinese Included Items */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Included Items (中文)</label>
          {zhTranslation.included.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleZhIncludedChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
                placeholder="包含项目"
              />
              {zhTranslation.included.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeZhIncludedItem(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addZhIncludedItem}
            className="px-4 py-2 text-sm font-medium text-[#F41703] hover:bg-[#F41703]/5 rounded-lg transition-colors"
          >
            + Add Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deliverable (中文)</label>
          <textarea
            name="deliverable"
            value={zhTranslation.deliverable}
            onChange={handleZhChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
            placeholder="交付物"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          {service ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  )
}

export default ServiceForm
