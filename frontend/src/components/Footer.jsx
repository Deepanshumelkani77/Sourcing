import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

/* ---------------- Icons (same stroke style used across the site) ---------------- */
const IconMail = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)
const IconPhone = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 012-2h2.2a1 1 0 01.97.76l.9 3.6a1 1 0 01-.5 1.1l-1.6.9a13 13 0 006.1 6.1l.9-1.6a1 1 0 011.1-.5l3.6.9a1 1 0 01.76.97V19a2 2 0 01-2 2A16 16 0 013 5z" />
  </svg>
)
const IconPin = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
)
const IconLinkedIn = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7.5 10.5v6M7.5 7.8v.01" />
    <path d="M11.5 16.5v-3.7a2.2 2.2 0 014.4 0v3.7M11.5 10.5v6" />
  </svg>
)
const IconWhatsApp = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20l1.3-3.9A7.9 7.9 0 1112 20a7.9 7.9 0 01-4-1.1z" />
    <path d="M9 9.6c0 3 2.4 5.4 5.4 5.4.5 0 .9-.4.9-.9v-.7a.6.6 0 00-.5-.6l-1.3-.3a.6.6 0 00-.6.2l-.3.4a4.4 4.4 0 01-2.3-2.3l.4-.3a.6.6 0 00.2-.6l-.3-1.3a.6.6 0 00-.6-.5H9.9a.9.9 0 00-.9.9z" />
  </svg>
)
const IconFacebook = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 8.5h2V5.2c-.35-.05-1.5-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.9V12H6.8v3.6h2.7V21h3.6v-5.4h2.7l.4-3.6h-3.1V10c0-1 .3-1.5 1.8-1.5z" />
  </svg>
)
const IconArrowUpRight = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
)

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/career', label: 'Career' },
]

const services = [
 
  'Product Sourcing',
  'Supplier Identification',
  'Quality Inspection',
  'Logistics & Shipping',
  'End-to-End Sourcing',
]

const socials = [
  { 
    label: 'Instagram', 
    href: 'https://instagram.com',
    hoverColor: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  { 
    label: 'Facebook', 
    href: 'https://facebook.com',
    hoverColor: 'hover:bg-blue-600',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  { 
    label: 'YouTube', 
    href: 'https://youtube.com',
    hoverColor: 'hover:bg-red-600',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  { 
    label: 'WeChat', 
    href: '#',
    hoverColor: 'hover:bg-green-500',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.5,13.5A1.5,1.5,0,1,0,7,12,1.5,1.5,0,0,0,8.5,13.5Zm7.5-1.5a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,12Zm3.5,5.5a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,19.5,17.5ZM12,2C6.48,2,2,6.48,2,12a9.9,9.9,0,0,0,3,7.13V22l3.6-1.8A10,10,0,0,0,12,22c5.52,0,10-4.48,10-10S17.52,2,12,2Zm6,11.5a1.5,1.5,0,1,1-1.5-1.5A1.5,1.5,0,0,1,18,13.5Zm-5,0a1.5,1.5,0,1,1-1.5-1.5A1.5,1.5,0,0,1,13,13.5Zm-4.5,0A1.5,1.5,0,1,1,7,12,1.5,1.5,0,0,1,8.5,13.5Z"/>
      </svg>
    )
  },
  { 
    label: 'WhatsApp', 
    href: 'https://wa.me/919999122522',
    hoverColor: 'hover:bg-green-500',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  },
  { 
    label: 'LinkedIn', 
    href: 'https://linkedin.com',
    hoverColor: 'hover:bg-blue-700',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  { 
    label: 'Twitter/X', 
    href: 'https://twitter.com',
    hoverColor: 'hover:bg-black',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
]

const Footer = () => {
  const { openSignup } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const year = new Date().getFullYear()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    // TODO: wire this up to your newsletter provider / API
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
   
      {/* ---------------- Main columns ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block bg-white rounded-lg px-3 py-2 mb-5">
              <img src="/assets/final_logo.png" alt="IndoChinaBridge" className="h-9 w-auto" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Your trusted partner in sourcing machinery, products, and manufacturing
              solutions from verified Chinese suppliers to global markets.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, hoverColor, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 border border-white/15 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoverColor}`}></span>
                  <span className="relative z-10">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-5">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-5">Get in Touch</h4>
            <ul className="space-y-3 mb-7">
              <li className="flex items-start gap-3">
                <IconPin className="w-5 h-5 text-[#F41703] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">FF 05, Rise Retailia 1, Plot No. SC 01, Sector 1, Greater Noida West, Gautam Buddha Nagar, Uttar Pradesh - 201306 India</span>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="w-5 h-5 text-[#F41703] flex-shrink-0" />
                <a href="mailto:info@indochinabridge.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                  info@indochinabridge.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconPhone className="w-5 h-5 text-[#F41703] flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors duration-200">
                  +91  9999-122-522
                </a>
              </li>
            </ul>

           
          </div>
        </div>
      </div>

      {/* ---------------- Bottom bar ---------------- */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {year} IndoChinaBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer