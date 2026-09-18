import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { createPortal } from 'react-dom'

const Navbar = () => {
  const { openSignup } = useContext(AppContext)
  const location = useLocation()
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const languageTriggerRef = useRef(null)
  const languageDropdownRef = useRef(null)
  const [languageDropdownPosition, setLanguageDropdownPosition] = useState({ top: 0, left: 0 })

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
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setShowLanguageDropdown(false)
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
      setLanguageDropdownPosition({ top: rect.bottom + 8, left: rect.right - 144 })
    }
  }, [showLanguageDropdown])

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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`transition-colors duration-200 font-medium ${location.pathname === '/' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 font-medium ${location.pathname === '/about' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors duration-200 font-medium ${location.pathname === '/blog' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-200 font-medium ${location.pathname === '/contact' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
            >
              Contact
            </Link>
            <Link 
              to="/career" 
              className={`transition-colors duration-200 font-medium ${location.pathname === '/career' ? 'text-[#F41703] border-b-2 border-[#F41703]' : 'text-gray-700 hover:text-[#F41703]'}`}
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
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{selectedLanguage}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showLanguageDropdown &&
                createPortal(
                  <div
                    ref={languageDropdownRef}
                    className="fixed w-36 bg-white rounded-xl shadow-2xl overflow-hidden text-left animate-loc-in z-40"
                    style={{ top: `${languageDropdownPosition.top}px`, left: `${languageDropdownPosition.left}px` }}
                  >
                    <div className="py-2">
                      <button 
                        onClick={() => { setSelectedLanguage('EN'); setShowLanguageDropdown(false) }}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span className="text-lg">🇬🇧</span>
                        <span>English</span>
                      </button>
                      <button 
                        onClick={() => { setSelectedLanguage('ZH'); setShowLanguageDropdown(false) }}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span className="text-lg">🇨🇳</span>
                        <span>中文</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>

            {/* Sign In Button */}
            <button onClick={openSignup} className="bg-[#F41703] text-white px-4 py-2 rounded-lg hover:bg-[#d10f02] transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
              Sign In
            </button>
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
