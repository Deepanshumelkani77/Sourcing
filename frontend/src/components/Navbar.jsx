import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthProvider'
import { createPortal } from 'react-dom'

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
  const location = useLocation()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const languageTriggerRef = useRef(null)
  const languageDropdownRef = useRef(null)
  const userTriggerRef = useRef(null)
  const userDropdownRef = useRef(null)
  const [languageDropdownPosition, setLanguageDropdownPosition] = useState({ top: 0, left: 0 })
  const [userDropdownPosition, setUserDropdownPosition] = useState({ top: 0, left: 0 })

  const current = languageOptions.find((l) => l.code === selectedLanguage) ?? languageOptions[0]

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        languageTriggerRef.current &&
        !languageTriggerRef.current.contains(e.target) &&
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(e.target)
      ) {
        setShowLanguageDropdown(false)
      }
      if (
        userTriggerRef.current &&
        !userTriggerRef.current.contains(e.target) &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false)
      }
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setShowLanguageDropdown(false)
        setShowUserDropdown(false)
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
    if (showUserDropdown && userTriggerRef.current) {
      const rect = userTriggerRef.current.getBoundingClientRect()
      setUserDropdownPosition({ top: rect.bottom + 8, left: rect.right - 160 })
    }
  }, [showUserDropdown])

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

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors  duration-200 text-lg font-medium ${location.pathname === '/' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/about' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors duration-200  text-lg font-medium ${location.pathname === '/blog' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/contact' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Contact
            </Link>
            <Link 
              to="/career" 
              className={`transition-colors duration-200 text-lg font-medium ${location.pathname === '/career' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Career
            </Link>
          </div>

          {/* Right Side - Language Dropdown and Sign In */}
          <div className="flex items-center space-x-4">
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
                        const active = selectedLanguage === code
                        return (
                          <button
                            key={code}
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setSelectedLanguage(code)
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
        </div>
      </div>

      {/* Mobile Menu Button (Hidden on Desktop) */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <Link to="/">
          <img src="/assets/final_logo.png" alt="IndoChinaBridge Logo" className="h-10 w-auto" />
        </Link>
        <button className="p-2 rounded-md hover:bg-gray-100">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
    </>
  )
}

export default Navbar