import React, { useState, useEffect } from 'react'
import { uploadImage } from '../services/uploadApi'

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    productName: '',
    slug: '',
    category: '',
    mainCategory: '',
    subCategory: '',
    shortDescription: '',
    description: '',
    images: [],
    features: [],
    specifications: [],
    applications: [],
    packageContents: [],
    customization: {
      available: false,
      details: ''
    },
    sourcing: {
      country: 'China',
      destination: 'India',
      moq: ''
    },
    landingPage: {
      heroTitle: '',
      heroSubtitle: '',
      keyBenefits: []
    },
    enquiry: {
      enabled: true,
      buttonText: 'Request a Quote'
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    },
    status: 'draft'
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [zhTranslation, setZhTranslation] = useState({
    productName: '',
    shortDescription: '',
    description: '',
    category: '',
    mainCategory: '',
    subCategory: '',
    features: [''],
    specifications: [],
    applications: [''],
    packageContents: [''],
    customization: {
      details: ''
    },
    sourcing: {
      country: '',
      destination: '',
      moq: ''
    },
    landingPage: {
      heroTitle: '',
      heroSubtitle: '',
      keyBenefits: []
    },
    enquiry: {
      buttonText: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  })

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        slug: product.slug || '',
        category: product.category || '',
        mainCategory: product.mainCategory || '',
        subCategory: product.subCategory || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        images: product.images || [],
        features: product.features || [],
        specifications: product.specifications || [],
        applications: product.applications || [],
        packageContents: product.packageContents || [],
        customization: product.customization || { available: false, details: '' },
        sourcing: product.sourcing || { country: 'China', destination: 'India', moq: '' },
        landingPage: product.landingPage || { heroTitle: '', heroSubtitle: '', keyBenefits: [] },
        enquiry: product.enquiry || { enabled: true, buttonText: 'Request a Quote' },
        seo: product.seo || { metaTitle: '', metaDescription: '', keywords: [] },
        status: product.status || 'draft'
      })

      // Load Chinese translation if exists
      if (product.translations && product.translations.length > 0) {
        const zhTrans = product.translations.find(t => t.language === 'zh')
        if (zhTrans) {
          setZhTranslation({
            productName: zhTrans.productName || '',
            shortDescription: zhTrans.shortDescription || '',
            description: zhTrans.description || '',
            category: zhTrans.category || '',
            mainCategory: zhTrans.mainCategory || '',
            subCategory: zhTrans.subCategory || '',
            features: zhTrans.features || [''],
            specifications: zhTrans.specifications || [],
            applications: zhTrans.applications || [''],
            packageContents: zhTrans.packageContents || [''],
            customization: {
              details: zhTrans.customization?.details || ''
            },
            sourcing: {
              country: zhTrans.sourcing?.country || '',
              destination: zhTrans.sourcing?.destination || '',
              moq: zhTrans.sourcing?.moq || ''
            },
            landingPage: {
              heroTitle: zhTrans.landingPage?.heroTitle || '',
              heroSubtitle: zhTrans.landingPage?.heroSubtitle || '',
              keyBenefits: zhTrans.landingPage?.keyBenefits || []
            },
            enquiry: {
              buttonText: zhTrans.enquiry?.buttonText || ''
            },
            seo: {
              metaTitle: zhTrans.seo?.metaTitle || '',
              metaDescription: zhTrans.seo?.metaDescription || '',
              keywords: zhTrans.seo?.keywords || []
            }
          })
        }
      }
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSpecChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }))
  }

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }))
  }

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }))
  }

  const generateSlug = () => {
    const slug = formData.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Prepare data with Chinese translation if filled
    const submitData = { ...formData }
    
    // Check if Chinese translation has any content
    const hasZhContent = zhTranslation.productName || 
                         zhTranslation.description || 
                         zhTranslation.features.some(f => f.trim()) ||
                         zhTranslation.specifications.some(s => s.label.trim() || s.value.trim())
    
    if (hasZhContent) {
      submitData.translations = [{
        language: 'zh',
        productName: zhTranslation.productName,
        shortDescription: zhTranslation.shortDescription,
        description: zhTranslation.description,
        category: zhTranslation.category,
        mainCategory: zhTranslation.mainCategory,
        subCategory: zhTranslation.subCategory,
        features: zhTranslation.features.filter(f => f.trim()),
        specifications: zhTranslation.specifications.filter(s => s.label.trim() || s.value.trim()),
        applications: zhTranslation.applications.filter(a => a.trim()),
        packageContents: zhTranslation.packageContents.filter(p => p.trim()),
        customization: {
          details: zhTranslation.customization.details
        },
        sourcing: {
          country: zhTranslation.sourcing.country,
          destination: zhTranslation.sourcing.destination,
          moq: zhTranslation.sourcing.moq
        },
        landingPage: {
          heroTitle: zhTranslation.landingPage.heroTitle,
          heroSubtitle: zhTranslation.landingPage.heroSubtitle,
          keyBenefits: zhTranslation.landingPage.keyBenefits.filter(b => b.trim())
        },
        enquiry: {
          buttonText: zhTranslation.enquiry.buttonText
        },
        seo: {
          metaTitle: zhTranslation.seo.metaTitle,
          metaDescription: zhTranslation.seo.metaDescription,
          keywords: zhTranslation.seo.keywords.filter(k => k.trim())
        }
      }]
    }
    
    onSubmit(submitData)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadImage(file)
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.imageUrl]
        }))
        setUploadProgress(100)
      } else {
        alert('Failed to upload image: ' + result.message)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: 'Images' },
    { id: 'features', label: 'Features' },
    { id: 'specs', label: 'Specifications' },
    { id: 'details', label: 'Details' },
    { id: 'landing', label: 'Landing Page' },
    { id: 'seo', label: 'SEO' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#F41703] text-[#F41703]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category
                </label>
                <input
                  type="text"
                  name="mainCategory"
                  value={formData.mainCategory}
                  onChange={handleChange}
                  placeholder="e.g., Conference Device"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Chinese Translation - Basic Info */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Product Name (产品名称)</label>
                  <input
                    type="text"
                    value={zhTranslation.productName}
                    onChange={(e) => setZhTranslation(prev => ({ ...prev, productName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category (类别)</label>
                  <input
                    type="text"
                    value={zhTranslation.category}
                    onChange={(e) => setZhTranslation(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Main Category (主类别)</label>
                  <input
                    type="text"
                    value={zhTranslation.mainCategory}
                    onChange={(e) => setZhTranslation(prev => ({ ...prev, mainCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sub Category (子类别)</label>
                  <input
                    type="text"
                    value={zhTranslation.subCategory}
                    onChange={(e) => setZhTranslation(prev => ({ ...prev, subCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Short Description (简短描述)</label>
                <textarea
                  value={zhTranslation.shortDescription}
                  onChange={(e) => setZhTranslation(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description (描述)</label>
                <textarea
                  value={zhTranslation.description}
                  onChange={(e) => setZhTranslation(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex flex-col items-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              </div>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#F41703] to-[#F97316] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({formData.images.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback: URL Input */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or add image URL directly
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.images[formData.images.length - 1] || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, e.target.value]
                      }))
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const lastInput = document.querySelector('input[type="text"][placeholder*="example.com"]')
                    if (lastInput && lastInput.value) {
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, lastInput.value]
                      }))
                      lastInput.value = ''
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    placeholder="4K ultra-high-definition video"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Feature
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Total features: {formData.features.length}
            </div>

            {/* Chinese Translation - Features */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - Features</h3>
              {zhTranslation.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...zhTranslation.features]
                      newFeatures[index] = e.target.value
                      setZhTranslation(prev => ({ ...prev, features: newFeatures }))
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = zhTranslation.features.filter((_, i) => i !== index)
                      setZhTranslation(prev => ({ ...prev, features: newFeatures.length > 0 ? newFeatures : [''] }))
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setZhTranslation(prev => ({ ...prev, features: [...prev.features, ''] }))}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Feature
              </button>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Specification
              </button>
            </div>

            {/* Chinese Translation - Specifications */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - Specifications</h3>
              {zhTranslation.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => {
                      const newSpecs = [...zhTranslation.specifications]
                      newSpecs[index] = { ...newSpecs[index], label: e.target.value }
                      setZhTranslation(prev => ({ ...prev, specifications: newSpecs }))
                    }}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...zhTranslation.specifications]
                      newSpecs[index] = { ...newSpecs[index], value: e.target.value }
                      setZhTranslation(prev => ({ ...prev, specifications: newSpecs }))
                    }}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSpecs = zhTranslation.specifications.filter((_, i) => i !== index)
                      setZhTranslation(prev => ({ ...prev, specifications: newSpecs }))
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setZhTranslation(prev => ({ ...prev, specifications: [...prev.specifications, { label: '', value: '' }] }))}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Specification
              </button>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applications
              </label>
              {formData.applications.map((application, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={application}
                    onChange={(e) => handleArrayChange('applications', index, e.target.value)}
                    placeholder="Conference rooms"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('applications', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('applications')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Application
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Contents
              </label>
              {formData.packageContents.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('packageContents', index, e.target.value)}
                    placeholder="Camera unit"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('packageContents', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('packageContents')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Item
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Customization</h3>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={formData.customization.available}
                  onChange={(e) => handleNestedChange('customization', 'available', e.target.checked)}
                  className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
                />
                <label className="text-sm text-gray-700">Available for customization</label>
              </div>
              <input
                type="text"
                value={formData.customization.details}
                onChange={(e) => handleNestedChange('customization', 'details', e.target.value)}
                placeholder="Customization details"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sourcing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.sourcing.country}
                    onChange={(e) => handleNestedChange('sourcing', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Destination</label>
                  <input
                    type="text"
                    value={formData.sourcing.destination}
                    onChange={(e) => handleNestedChange('sourcing', 'destination', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">MOQ</label>
                  <input
                    type="text"
                    value={formData.sourcing.moq}
                    onChange={(e) => handleNestedChange('sourcing', 'moq', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Enquiry</h3>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={formData.enquiry.enabled}
                  onChange={(e) => handleNestedChange('enquiry', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-[#F41703] border-gray-300 rounded focus:ring-[#F41703]"
                />
                <label className="text-sm text-gray-700">Enable enquiry button</label>
              </div>
              <input
                type="text"
                value={formData.enquiry.buttonText}
                onChange={(e) => handleNestedChange('enquiry', 'buttonText', e.target.value)}
                placeholder="Button text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            {/* Chinese Translation - Details */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - Details</h3>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Applications (应用)</h4>
                {zhTranslation.applications.map((app, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={app}
                      onChange={(e) => {
                        const newApps = [...zhTranslation.applications]
                        newApps[index] = e.target.value
                        setZhTranslation(prev => ({ ...prev, applications: newApps }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newApps = zhTranslation.applications.filter((_, i) => i !== index)
                        setZhTranslation(prev => ({ ...prev, applications: newApps.length > 0 ? newApps : [''] }))
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setZhTranslation(prev => ({ ...prev, applications: [...prev.applications, ''] }))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add Application
                </button>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Package Contents (包装内容)</h4>
                {zhTranslation.packageContents.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...zhTranslation.packageContents]
                        newItems[index] = e.target.value
                        setZhTranslation(prev => ({ ...prev, packageContents: newItems }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = zhTranslation.packageContents.filter((_, i) => i !== index)
                        setZhTranslation(prev => ({ ...prev, packageContents: newItems.length > 0 ? newItems : [''] }))
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setZhTranslation(prev => ({ ...prev, packageContents: [...prev.packageContents, ''] }))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add Item
                </button>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Customization (定制)</h4>
                <input
                  type="text"
                  value={zhTranslation.customization.details}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    customization: { ...prev.customization, details: e.target.value }
                  }))}
                  placeholder="Customization details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sourcing (采购)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Country (国家)</label>
                    <input
                      type="text"
                      value={zhTranslation.sourcing.country}
                      onChange={(e) => setZhTranslation(prev => ({
                        ...prev,
                        sourcing: { ...prev.sourcing, country: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Destination (目的地)</label>
                    <input
                      type="text"
                      value={zhTranslation.sourcing.destination}
                      onChange={(e) => setZhTranslation(prev => ({
                        ...prev,
                        sourcing: { ...prev.sourcing, destination: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">MOQ</label>
                    <input
                      type="text"
                      value={zhTranslation.sourcing.moq}
                      onChange={(e) => setZhTranslation(prev => ({
                        ...prev,
                        sourcing: { ...prev.sourcing, moq: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Enquiry (询价)</h4>
                <input
                  type="text"
                  value={zhTranslation.enquiry.buttonText}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    enquiry: { ...prev.enquiry, buttonText: e.target.value }
                  }))}
                  placeholder="Button text (按钮文本)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'landing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                value={formData.landingPage.heroTitle}
                onChange={(e) => handleNestedChange('landingPage', 'heroTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea
                value={formData.landingPage.heroSubtitle}
                onChange={(e) => handleNestedChange('landingPage', 'heroSubtitle', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Benefits
              </label>
              {formData.landingPage.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...formData.landingPage.keyBenefits];
                      newBenefits[index] = e.target.value;
                      handleNestedChange('landingPage', 'keyBenefits', newBenefits);
                    }}
                    placeholder="4K video quality"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newBenefits = formData.landingPage.keyBenefits.filter((_, i) => i !== index);
                      handleNestedChange('landingPage', 'keyBenefits', newBenefits);
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleNestedChange('landingPage', 'keyBenefits', [...formData.landingPage.keyBenefits, ''])}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Benefit
              </button>
            </div>

            {/* Chinese Translation - Landing Page */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - Landing Page</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hero Title (主标题)</label>
                <input
                  type="text"
                  value={zhTranslation.landingPage.heroTitle}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    landingPage: { ...prev.landingPage, heroTitle: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hero Subtitle (副标题)</label>
                <input
                  type="text"
                  value={zhTranslation.landingPage.heroSubtitle}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    landingPage: { ...prev.landingPage, heroSubtitle: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Key Benefits (主要优势)</label>
                {zhTranslation.landingPage.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...zhTranslation.landingPage.keyBenefits]
                        newBenefits[index] = e.target.value
                        setZhTranslation(prev => ({
                          ...prev,
                          landingPage: { ...prev.landingPage, keyBenefits: newBenefits }
                        }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newBenefits = zhTranslation.landingPage.keyBenefits.filter((_, i) => i !== index)
                        setZhTranslation(prev => ({
                          ...prev,
                          landingPage: { ...prev.landingPage, keyBenefits: newBenefits }
                        }))
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setZhTranslation(prev => ({
                    ...prev,
                    landingPage: { ...prev.landingPage, keyBenefits: [...prev.landingPage.keyBenefits, ''] }
                  }))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add Benefit
                </button>
              </div>
            </div>

            {/* Chinese Translation - SEO */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Chinese Translation (中文) - SEO</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Meta Title (元标题)</label>
                <input
                  type="text"
                  value={zhTranslation.seo.metaTitle}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaTitle: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Meta Description (元描述)</label>
                <textarea
                  value={zhTranslation.seo.metaDescription}
                  onChange={(e) => setZhTranslation(prev => ({
                    ...prev,
                    seo: { ...prev.seo, metaDescription: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Keywords (关键词)</label>
                {zhTranslation.seo.keywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...zhTranslation.seo.keywords]
                        newKeywords[index] = e.target.value
                        setZhTranslation(prev => ({
                          ...prev,
                          seo: { ...prev.seo, keywords: newKeywords }
                        }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newKeywords = zhTranslation.seo.keywords.filter((_, i) => i !== index)
                        setZhTranslation(prev => ({
                          ...prev,
                          seo: { ...prev.seo, keywords: newKeywords.length > 0 ? newKeywords : [''] }
                        }))
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setZhTranslation(prev => ({
                    ...prev,
                    seo: { ...prev.seo, keywords: [...prev.seo.keywords, ''] }
                  }))}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add Keyword
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.seo.metaTitle}
                onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData.seo.metaDescription}
                onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              {formData.seo.keywords.map((keyword, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      const newKeywords = [...formData.seo.keywords]
                      newKeywords[index] = e.target.value
                      handleNestedChange('seo', 'keywords', newKeywords)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F41703] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newKeywords = formData.seo.keywords.filter((_, i) => i !== index)
                      handleNestedChange('seo', 'keywords', newKeywords)
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleNestedChange('seo', 'keywords', [...formData.seo.keywords, ''])}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add Keyword
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProductForm
