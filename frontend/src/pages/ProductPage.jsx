import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductBySlug } from '../services/productApi'
import QuoteModal from '../components/QuoteModal'
import { useAuth } from '../context/AuthProvider'

const ProductPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const result = await getProductBySlug(slug)
        if (result.success) {
          setProduct(result.product)
        } else {
          setError(result.message || 'Product not found')
        }
      } catch (err) {
        setError(err.message || 'Unable to fetch product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Product not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-15">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#F41703] to-[#F97316] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.landingPage?.heroTitle || product.productName}</h1>
          <p className="text-xl text-red-100 max-w-3xl">{product.landingPage?.heroSubtitle || product.shortDescription}</p>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto py-4 gap-3 scrollbar-hide">
            <button
              onClick={() => scrollToSection('overview')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeSection === 'overview'
                  ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                  : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
              }`}
            >
              Overview
            </button>
            {product.features && product.features.length > 0 && (
              <button
                onClick={() => scrollToSection('features')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'features'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Features
              </button>
            )}
            {product.specifications && product.specifications.length > 0 && (
              <button
                onClick={() => scrollToSection('specifications')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'specifications'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Specifications
              </button>
            )}
            {product.applications && product.applications.length > 0 && (
              <button
                onClick={() => scrollToSection('applications')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'applications'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Applications
              </button>
            )}
            {product.packageContents && product.packageContents.length > 0 && (
              <button
                onClick={() => scrollToSection('package')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'package'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Package
              </button>
            )}
            {product.sourcing && (
              <button
                onClick={() => scrollToSection('sourcing')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'sourcing'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Sourcing
              </button>
            )}
            {product.customization?.available && (
              <button
                onClick={() => scrollToSection('customization')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeSection === 'customization'
                    ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30'
                    : 'text-gray-600 hover:text-[#F41703] hover:bg-[#F41703]/5'
                }`}
              >
                Customization
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Overview */}
        <div id="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100">
                  <img
                    src={product.images[selectedImage]}
                    alt={`${product.productName} - Image ${selectedImage + 1}`}
                    className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? 'border-[#F41703] ring-2 ring-[#F41703]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.productName} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Overview</h2>
            <p className="text-gray-600 mb-6 text-justify">{product.description}</p>
            
            {/* Key Benefits */}
            {product.landingPage?.keyBenefits && product.landingPage.keyBenefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {product.landingPage.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-[#F41703] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enquiry Button */}
            {product.enquiry?.enabled && (
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login')
                  } else {
                    setShowQuoteModal(true)
                  }
                }}
                className="bg-[#F41703] text-white px-6 py-3 rounded-lg hover:bg-[#d10f02] transition-colors font-semibold"
              >
                {product.enquiry.buttonText || 'Request a Quote'}
              </button>
            )}
          </div>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.features.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#F41703] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div id="specifications" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Technical Specifications</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-800 w-1/3">{spec.label}</td>
                      <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* Applications */}
        {product.applications && product.applications.length > 0 && (
          <div id="applications" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Applications</h2>
            <div className="flex flex-wrap gap-3">
              {product.applications.map((application, index) => (
                <span key={index} className="bg-[#F41703]/10 text-[#F41703] px-4 py-2 rounded-full text-sm font-medium">
                  {application}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Package Contents */}
        {product.packageContents && product.packageContents.length > 0 && (
          <div id="package" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Package Contents</h2>
            <ul className="space-y-2">
              {product.packageContents.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-[#F41703] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sourcing Information */}
        {product.sourcing && (
          <div id="sourcing" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Sourcing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Source Country</h3>
                <p className="text-gray-600">{product.sourcing.country}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Destination</h3>
                <p className="text-gray-600">{product.sourcing.destination}</p>
              </div>
              {product.sourcing.moq && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">MOQ</h3>
                  <p className="text-gray-600">{product.sourcing.moq}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customization */}
        {product.customization?.available && (
          <div id="customization" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Customization</h2>
            <div className="bg-[#F41703]/10 border border-[#F41703]/20 p-6 rounded-xl">
              <p className="text-gray-700">{product.customization.details}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        product={product}
      />
    </div>
  )
}

export default ProductPage
