import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthProvider'
import { createPortal } from 'react-dom'
import { getAllProducts } from '../services/productApi'
import { useTranslation } from 'react-i18next'

/* Inline SVG flags — crisper and more consistent across OS/browsers than emoji flags */
const FlagUK = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} rounded-full`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice">
    <circle cx="12" cy="12" r="12" fill="#00247D" />
    <g clipPath="url(#uk-circle)">
      <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="4.5" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#CF142B" strokeWidth="1.6" />
      <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
      <path d="M12 0V24M0 12H24" stroke="#CF142B" strokeWidth="2.6" />
    </g>
    <defs>
      <clipPath id="uk-circle">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
    </defs>
  </svg>
)

const FlagCN = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} rounded-full`} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid slice">
    <circle cx="12" cy="12" r="12" fill="#DE2910" />
    <g fill="#FFDE00">
      <path d="M6.2 4.4l.55 1.7h1.79l-1.45 1.05.55 1.7-1.44-1.05-1.45 1.05.55-1.7L3.86 6.1h1.8z" />
      <path d="M11 3.3l.2.63h.66l-.53.39.2.62-.53-.38-.53.38.2-.62-.53-.39h.66z" />
      <path d="M13 5.8l.2.63h.66l-.53.38.2.63-.53-.39-.53.39.2-.63-.53-.38h.66z" />
      <path d="M13 8.9l.2.62h.66l-.53.39.2.62-.53-.38-.53.38.2-.62-.53-.39h.66z" />
      <path d="M11 11.1l.2.63h.66l-.53.38.2.63-.53-.39-.53.39.2-.63-.53-.38h.66z" />
    </g>
  </svg>
)

const languageOptions = [
  { code: 'EN', label: 'English', Flag: FlagUK },
  { code: 'ZH', label: '中文', Flag: FlagCN },
]

const Navbar = () => {
  const { openSignup } = useContext(AppContext)
  const { user, logout } = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showMobileLanguageDropdown, setShowMobileLanguageDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileProductsDropdown, setShowMobileProductsDropdown] = useState(false)
  const [mobileSelectedMainCategory, setMobileSelectedMainCategory] = useState(null)
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedMainCategory, setExpandedMainCategory] = useState(null)
  const languageTriggerRef = useRef(null)
  const languageDropdownRef = useRef(null)
  const mobileLanguageTriggerRef = useRef(null)
  const mobileLanguageDropdownRef = useRef(null)
  const userTriggerRef = useRef(null)
  const userDropdownRef = useRef(null)
  const mobileUserTriggerRef = useRef(null)
  const mobileUserDropdownRef = useRef(null)
  const productsTriggerRef = useRef(null)
  const productsDropdownRef = useRef(null)
  const productsTimeoutRef = useRef(null)
  const [languageDropdownPosition, setLanguageDropdownPosition] = useState({ top: 0, left: 0 })
  const [mobileLanguageDropdownPosition, setMobileLanguageDropdownPosition] = useState({ top: 0, left: 0 })
  const [userDropdownPosition, setUserDropdownPosition] = useState({ top: 0, left: 0 })
  const [mobileUserDropdownPosition, setMobileUserDropdownPosition] = useState({ top: 0, left: 0 })
  const [productsDropdownPosition, setProductsDropdownPosition] = useState({ top: 0, left: 0 })

  const current = languageOptions.find((l) => l.code === (i18n.language === 'zh' ? 'ZH' : 'EN')) ?? languageOptions[0]

  useEffect(() => {
    const onClickOutside = (e) => {
      // Desktop language dropdown
      if (
        languageTriggerRef.current &&
        !languageTriggerRef.current.contains(e.target) &&
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(e.target)
      ) {
        setShowLanguageDropdown(false)
      }
      // Mobile language dropdown
      if (
        mobileLanguageTriggerRef.current &&
        !mobileLanguageTriggerRef.current.contains(e.target) &&
        mobileLanguageDropdownRef.current &&
        !mobileLanguageDropdownRef.current.contains(e.target)
      ) {
        setShowMobileLanguageDropdown(false)
      }
      // Desktop user dropdown
      if (
        userTriggerRef.current &&
        !userTriggerRef.current.contains(e.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false)
      }
      // Mobile user dropdown
      if (
        mobileUserTriggerRef.current &&
        !mobileUserTriggerRef.current.contains(e.target) &&
        mobileUserDropdownRef.current &&
        !mobileUserDropdownRef.current.contains(e.target)
      ) {
        setShowMobileUserDropdown(false)
      }
      if (
        productsTriggerRef.current &&
        !productsTriggerRef.current.contains(e.target) &&
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(e.target)
      ) {
        setShowProductsDropdown(false)
      }
      // Mobile products dropdown close is handled by the menu button
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setShowLanguageDropdown(false)
        setShowMobileLanguageDropdown(false)
        setShowUserDropdown(false)
        setShowMobileUserDropdown(false)
        setShowProductsDropdown(false)
        setShowMobileMenu(false)
        setShowMobileProductsDropdown(false)
        setMobileSelectedMainCategory(null)
        setMobileSelectedCategory(null)
        setExpandedMainCategory(null)
        setSelectedCategory(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  useEffect(() => {
    if (showLanguageDropdown && languageTriggerRef.current) {
      const rect = languageTriggerRef.current.getBoundingClientRect()
      setLanguageDropdownPosition({ top: rect.bottom + 8, left: rect.right - 176 })
    }
  }, [showLanguageDropdown])

  useEffect(() => {
    if (showMobileLanguageDropdown && mobileLanguageTriggerRef.current) {
      const rect = mobileLanguageTriggerRef.current.getBoundingClientRect()
      setMobileLanguageDropdownPosition({ top: rect.bottom + 8, left: rect.right - 176 })
    }
  }, [showMobileLanguageDropdown])

  useEffect(() => {
    if (showUserDropdown && userTriggerRef.current) {
      const rect = userTriggerRef.current.getBoundingClientRect()
      setUserDropdownPosition({ top: rect.bottom + 8, left: rect.right - 160 })
    }
  }, [showUserDropdown])

  useEffect(() => {
    if (showMobileUserDropdown && mobileUserTriggerRef.current) {
      const rect = mobileUserTriggerRef.current.getBoundingClientRect()
      setMobileUserDropdownPosition({ top: rect.bottom + 8, left: rect.right - 160 })
    }
  }, [showMobileUserDropdown])

  useEffect(() => {
    if (showProductsDropdown && productsTriggerRef.current) {
      const rect = productsTriggerRef.current.getBoundingClientRect()
      const dropdownWidth = 1000
      const viewportWidth = window.innerWidth
      const left = (viewportWidth - dropdownWidth) / 2
      setProductsDropdownPosition({ top: rect.bottom + 8, left: Math.max(20, left) })
    }
  }, [showProductsDropdown])

  useEffect(() => {
    if (showProductsDropdown && products.length > 0 && !expandedMainCategory) {
      // Auto-expand first main category when dropdown opens
      const groupedByMain = products.reduce((acc, product) => {
        const mainCategory = product.mainCategory || 'Uncategorized'
        if (!acc[mainCategory]) {
          acc[mainCategory] = {}
        }
        const category = product.category || 'Uncategorized'
        if (!acc[mainCategory][category]) {
          acc[mainCategory][category] = []
        }
        acc[mainCategory][category].push(product)
        return acc
      }, {})
      const mainCategories = Object.keys(groupedByMain)
      if (mainCategories.length > 0) {
        setExpandedMainCategory(mainCategories[0])
        // Auto-select first category under that main category
        const categories = Object.keys(groupedByMain[mainCategories[0]])
        if (categories.length > 0) {
          setSelectedCategory(categories[0])
        }
      }
    }
    // Reset selections when dropdown closes
    if (!showProductsDropdown) {
      setExpandedMainCategory(null)
      setSelectedCategory(null)
    }
  }, [showProductsDropdown, products, expandedMainCategory, selectedCategory])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const lang = i18n.language === 'zh' ? 'zh' : 'en'
        const result = await getAllProducts(lang)
        if (result.success) {
          setProducts(result.products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()

    return () => {
      if (productsTimeoutRef.current) {
        clearTimeout(productsTimeoutRef.current)
      }
    }
  }, [i18n.language])

  return (
    <>
      <style>{`
        @keyframes loc-in {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-loc-in { animation: loc-in 0.18s ease both; }
      `}</style>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img src="/assets/final_logo.png" alt="IndoChinaBridge Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation Links - Center (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors  duration-200 text-lg font-medium ${location.pathname === '/' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/about"
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/about' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/services"
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/services' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.services')}
            </Link>
            <div
              className="relative"
              ref={productsTriggerRef}
              onMouseEnter={() => {
                if (productsTimeoutRef.current) {
                  clearTimeout(productsTimeoutRef.current)
                }
                setShowProductsDropdown(true)
              }}
              onMouseLeave={() => {
                productsTimeoutRef.current = setTimeout(() => {
                  setShowProductsDropdown(false)
                }, 200)
              }}
            >
              <button
                className={`transition-colors duration-200 text-lg font-medium flex items-center gap-1 ${location.pathname.startsWith('/product') ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
              >
                {t('nav.products')}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showProductsDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProductsDropdown &&
                createPortal(
                  <div
                    ref={productsDropdownRef}
                    className="fixed w-[1000px] bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-left animate-loc-in z-40 max-h-[500px] overflow-y-auto"
                    style={{ top: `${productsDropdownPosition.top}px`, left: `${productsDropdownPosition.left}px` }}
                    onMouseEnter={() => {
                      if (productsTimeoutRef.current) {
                        clearTimeout(productsTimeoutRef.current)
                      }
                      setShowProductsDropdown(true)
                    }}
                    onMouseLeave={() => {
                      productsTimeoutRef.current = setTimeout(() => {
                        setShowProductsDropdown(false)
                      }, 200)
                    }}
                  >
                    <div className="py-1.5">
                      {products.length > 0 ? (
                        (() => {
                          // Group products by main category and category
                          const groupedByMain = products.reduce((acc, product) => {
                            const mainCategory = product.mainCategory || 'Uncategorized'
                            if (!acc[mainCategory]) {
                              acc[mainCategory] = {}
                            }
                            const category = product.category || 'Uncategorized'
                            if (!acc[mainCategory][category]) {
                              acc[mainCategory][category] = []
                            }
                            acc[mainCategory][category].push(product)
                            return acc
                          }, {})

                          const mainCategories = Object.keys(groupedByMain)
                          const categories = expandedMainCategory ? Object.keys(groupedByMain[expandedMainCategory]) : []
                          const selectedProducts = selectedCategory ? groupedByMain[expandedMainCategory]?.[selectedCategory] || [] : []

                          return (
                            <div className="grid grid-cols-3 gap-0 h-full">
                              {/* Column 1: Main Categories with inline expansion */}
                              <div className="border-r border-gray-100 w-80 bg-gray-50">
                                <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 font-semibold text-sm text-gray-800 uppercase tracking-wide border-b border-gray-200">
                                  Main Categories
                                </div>
                                <div className="py-2">
                                  {mainCategories.map((mainCat) => (
                                    <div key={mainCat}>
                                      <button
                                        onClick={() => {
                                          if (expandedMainCategory === mainCat) {
                                            setExpandedMainCategory(null)
                                            setSelectedCategory(null)
                                          } else {
                                            setExpandedMainCategory(mainCat)
                                            // Auto-select first category under this main category
                                            const cats = Object.keys(groupedByMain[mainCat])
                                            if (cats.length > 0) {
                                              setSelectedCategory(cats[0])
                                            }
                                          }
                                        }}
                                        className={`w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 flex items-center justify-between ${
                                          expandedMainCategory === mainCat
                                            ? 'bg-[#F41703] text-white font-medium'
                                            : 'text-gray-700 hover:bg-red-50 hover:text-[#F41703]'
                                        }`}
                                      >
                                        <span>{mainCat}</span>
                                        <svg
                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedMainCategory === mainCat ? 'rotate-180' : ''}`}
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                      
                                      {/* Expanded categories shown inline */}
                                      {expandedMainCategory === mainCat && (
                                        <div className="ml-4 mt-1 space-y-1">
                                          {categories.map((category) => (
                                            <button
                                              key={category}
                                              onClick={() => setSelectedCategory(category)}
                                              className={`w-full px-4 py-2 text-sm text-left transition-colors duration-150 block ${
                                                selectedCategory === category
                                                  ? 'bg-red-100 text-[#F41703] font-medium'
                                                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#F41703]'
                                              }`}
                                            >
                                              {category}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Column 2: Products for selected category */}
                              <div className="border-r border-gray-100 flex-1">
                                <div className="px-4 py-3 bg-gradient-to-r from-white to-gray-50 font-semibold text-sm text-gray-800 uppercase tracking-wide border-b border-gray-100">
                                  {selectedCategory || 'Select a Category'}
                                </div>
                                <div className="py-2 max-h-[400px] overflow-y-auto">
                                  {selectedProducts.length > 0 ? (
                                    selectedProducts.map((product) => (
                                      <Link
                                        key={product._id}
                                        to={`/product/${product.slug}`}
                                        onClick={() => {
                                          setShowProductsDropdown(false)
                                          setExpandedMainCategory(null)
                                          setSelectedCategory(null)
                                        }}
                                        className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#F41703] transition-colors duration-150 block"
                                      >
                                        {product.productName}
                                      </Link>
                                    ))
                                  ) : (
                                    <div className="px-4 py-8 text-sm text-gray-500 text-center">
                                      {selectedCategory ? 'No products in this category' : 'Select a category to view products'}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Column 3: Ad space - empty for now */}
                              <div className="w-72">
                                <div className="p-4 h-full min-h-[200px]">
                                  {/* Add your ad content here */}
                                </div>
                              </div>
                            </div>
                          )
                        })()
                      ) : (
                        <div className="px-4 py-2.5 text-sm text-gray-500">
                          No products available
                        </div>
                      )}
                    </div>
                  </div>,
                  document.body
                )}
            </div>
            <Link
              to="/blog"
              className={`transition-colors duration-200  text-lg font-medium ${location.pathname === '/blog' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.blog')}
            </Link>
            <Link
              to="/contact"
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/contact' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/career"
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/career' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.career')}
            </Link>
            <Link
              to="/reviews"
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/reviews' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              {t('nav.reviews')}
            </Link>
          </div>

          {/* Right Side - Language Dropdown and Sign In (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative" ref={languageTriggerRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border transition-colors duration-200 ${
                  showLanguageDropdown
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                }`}
                aria-haspopup="listbox"
                aria-expanded={showLanguageDropdown}
              >
                <current.Flag className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{current.code}</span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLanguageDropdown &&
                createPortal(
                  <div
                    ref={languageDropdownRef}
                    role="listbox"
                    className="fixed w-44 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-left animate-loc-in z-40"
                    style={{ top: `${languageDropdownPosition.top}px`, left: `${languageDropdownPosition.left}px` }}
                  >
                    <div className="px-4 pt-3 pb-2 text-[11px] font-semibold tracking-wide text-gray-400">
                      Select language
                    </div>
                    <div className="pb-1.5">
                      {languageOptions.map(({ code, label, Flag }) => {
                        const active = i18n.language === (code === 'ZH' ? 'zh' : 'en')
                        return (
                          <button
                            key={code}
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              i18n.changeLanguage(code === 'ZH' ? 'zh' : 'en')
                              setShowLanguageDropdown(false)
                            }}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors duration-150 ${
                              active ? 'bg-red-50 text-[#F41703] font-medium' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Flag className="w-5 h-5 flex-shrink-0" />
                            <span className="flex-1 text-left">{label}</span>
                            {active && (
                              <svg className="w-4 h-4 text-[#F41703]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* Sign In Button / User Icon */}
            {user ? (
              <div className="relative" ref={userTriggerRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border transition-colors duration-200 ${
                    showUserDropdown
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={showUserDropdown}
                >
                  <div className="w-8 h-8 rounded-full bg-[#F41703] flex items-center justify-center text-white font-medium">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserDropdown &&
                  createPortal(
                    <div
                      ref={userDropdownRef}
                      role="listbox"
                      className="fixed w-40 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-left animate-loc-in z-40"
                      style={{ top: `${userDropdownPosition.top}px`, left: `${userDropdownPosition.left}px` }}
                    >
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={async () => {
                            await logout()
                            setShowUserDropdown(false)
                            window.location.reload()
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            ) : (
              <button onClick={openSignup} className="bg-[#F41703] text-white px-4 py-2 rounded-lg hover:bg-[#d10f02] transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Language Dropdown (Mobile) */}
            <div className="relative" ref={mobileLanguageTriggerRef}>
              <button
                onClick={() => setShowMobileLanguageDropdown(!showMobileLanguageDropdown)}
                className="p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <current.Flag className="w-5 h-5 flex-shrink-0" />
              </button>

              {showMobileLanguageDropdown &&
                createPortal(
                  <div
                    ref={mobileLanguageDropdownRef}
                    role="listbox"
                    className="fixed w-44 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-left animate-loc-in z-40"
                    style={{ top: `${mobileLanguageDropdownPosition.top}px`, left: `${mobileLanguageDropdownPosition.left}px` }}
                  >
                    <div className="px-4 pt-3 pb-2 text-[11px] font-semibold tracking-wide text-gray-400">
                      Select language
                    </div>
                    <div className="pb-1.5">
                      {languageOptions.map(({ code, label, Flag }) => {
                        const active = i18n.language === (code === 'ZH' ? 'zh' : 'en')
                        return (
                          <button
                            key={code}
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              i18n.changeLanguage(code === 'ZH' ? 'zh' : 'en')
                              setShowMobileLanguageDropdown(false)
                            }}
                            className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors duration-150 ${
                              active ? 'bg-red-50 text-[#F41703] font-medium' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Flag className="w-5 h-5 flex-shrink-0" />
                            <span className="flex-1 text-left">{label}</span>
                            {active && (
                              <svg className="w-4 h-4 text-[#F41703]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* User Icon (Mobile - if logged in) */}
            {user && (
              <div className="relative" ref={mobileUserTriggerRef}>
                <button
                  onClick={() => setShowMobileUserDropdown(!showMobileUserDropdown)}
                  className="w-8 h-8 rounded-full bg-[#F41703] flex items-center justify-center text-white font-medium"
                >
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </button>

                {showMobileUserDropdown &&
                  createPortal(
                    <div
                      ref={mobileUserDropdownRef}
                      role="listbox"
                      className="fixed w-40 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden text-left animate-loc-in z-40"
                      style={{ top: `${mobileUserDropdownPosition.top}px`, left: `${mobileUserDropdownPosition.left}px` }}
                    >
                      <div className="py-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            setShowMobileUserDropdown(false)
                            setShowMobileMenu(false)
                            setShowMobileProductsDropdown(false)
                            setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={async () => {
                            await logout()
                            setShowMobileUserDropdown(false)
                            setShowMobileMenu(false)
                            setShowMobileProductsDropdown(false)
                            setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
                            window.location.reload()
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/about"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/about' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/services"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/services' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.services')}
            </Link>

            {/* Products Dropdown for Mobile */}
            <div>
              <button
                onClick={() => setShowMobileProductsDropdown(!showMobileProductsDropdown)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-lg font-medium ${location.pathname.startsWith('/product') ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {t('nav.products')}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showMobileProductsDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showMobileProductsDropdown && (
                <div className="mt-3 ml-2 space-y-1">
                  {products.length > 0 ? (
                    (() => {
                      const groupedByMain = products.reduce((acc, product) => {
                        const mainCategory = product.mainCategory || 'Uncategorized'
                        if (!acc[mainCategory]) {
                          acc[mainCategory] = {}
                        }
                        const category = product.category || 'Uncategorized'
                        if (!acc[mainCategory][category]) {
                          acc[mainCategory][category] = []
                        }
                        acc[mainCategory][category].push(product)
                        return acc
                      }, {})
                      
                      const mainCategories = Object.keys(groupedByMain)
                      
                      return (
                        <>
                          {mainCategories.map((mainCat) => (
                            <div key={mainCat} className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => {
                                  if (mobileSelectedMainCategory === mainCat) {
                                    setMobileSelectedMainCategory(null)
                                    setMobileSelectedCategory(null)
                                  } else {
                                    setMobileSelectedMainCategory(mainCat)
                                    setMobileSelectedCategory(null)
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                  mobileSelectedMainCategory === mainCat
                                    ? 'bg-[#F41703] text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                  </svg>
                                  {mainCat}
                                </span>
                                <svg
                                  className={`w-4 h-4 transition-transform duration-200 ${mobileSelectedMainCategory === mainCat ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {mobileSelectedMainCategory === mainCat && (
                                <div className="bg-gray-50 border-t border-gray-200">
                                  {Object.keys(groupedByMain[mainCat]).map((category) => (
                                    <div key={category} className="border-b border-gray-200 last:border-b-0">
                                      <button
                                        onClick={() => {
                                          if (mobileSelectedCategory === category) {
                                            setMobileSelectedCategory(null)
                                          } else {
                                            setMobileSelectedCategory(category)
                                          }
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-all duration-200 ${
                                          mobileSelectedCategory === category
                                            ? 'bg-red-50 text-[#F41703]'
                                            : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                        }`}
                                      >
                                        <span className="flex items-center gap-2">
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                          </svg>
                                          {category}
                                        </span>
                                        <svg
                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileSelectedCategory === category ? 'rotate-180' : ''}`}
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                      
                                      {mobileSelectedCategory === category && (
                                        <div className="bg-white border-t border-gray-200">
                                          {groupedByMain[mainCat][category].map((product) => (
                                            <Link
                                              key={product._id}
                                              to={`/product/${product.slug}`}
                                              onClick={() => {
                                                setShowMobileMenu(false)
                                                setShowMobileProductsDropdown(false)
                                                setMobileSelectedMainCategory(null)
                                                setMobileSelectedCategory(null)
                                              }}
                                              className="block px-6 py-3 text-sm text-gray-700 hover:text-[#F41703] hover:bg-red-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                                            >
                                              {product.productName}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )
                    })()
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                      No products available
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Link
              to="/blog"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/blog' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.blog')}
            </Link>
            <Link
              to="/contact"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/contact' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.contact')}
            </Link>
            <Link
              to="/career"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/career' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.career')}
            </Link>
            <Link
              to="/reviews"
              onClick={() => {
                setShowMobileMenu(false)
                setShowMobileProductsDropdown(false)
                setMobileSelectedMainCategory(null)
                setMobileSelectedCategory(null)
              }}
              className={`block px-4 py-2 rounded-lg text-lg font-medium ${location.pathname === '/reviews' ? 'text-[#F41703] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {t('nav.reviews')}
            </Link>
            {!user && (
              <button
                onClick={() => {
                  openSignup()
                  setShowMobileMenu(false)
                  setShowMobileProductsDropdown(false)
                  setMobileSelectedCategory(null)
                }}
                className="w-full bg-[#F41703] text-white px-4 py-2 rounded-lg hover:bg-[#d10f02] transition-colors duration-200 font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar