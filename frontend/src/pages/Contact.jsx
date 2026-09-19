import React, { useState } from 'react'

const BRAND_COLOR = '#F41703'
const SECONDARY_COLOR = '#F97316'

const CONTACT_CARDS = [
  {
    icon: '📞',
    title: 'Call Us',
    lines: ['+91 9999-122-522'],
    note: 'Mon–Sat, 9 AM – 8 PM IST',
  },
  {
    icon: '✉️',
    title: 'Email Us',
    lines: ['info@indochinabridge.com'],
    note: 'We reply within 24 hours',
  },
  {
    icon: '📍',
    title: 'Visit Us',
    lines: ['FF 05, Rise Retailia 1, Plot No. SC 01, Sector 1, Greater Noida West, Gautam Buddha Nagar, Uttar Pradesh - 201306'],
    note: '',
  },
  {
    icon: '🕐',
    title: 'Working Hours',
    lines: ['Monday – Saturday', '9:00 AM – 8:00 PM'],
    note: 'Sunday: By appointment',
  },
]

const REASONS = ['Sourcing Quote', 'Machinery Sourcing', 'Product Sourcing', 'Quality Inspection', 'Logistics Inquiry', 'Partnership', 'General Inquiry']

const FAQS = [
  { q: 'How quickly will someone get back to me?', a: 'Our sourcing team responds to all enquiries within 24 hours on business days, and most calls are answered live during working hours.' },
  { q: 'Do you charge for sourcing quotes?', a: 'No — initial sourcing quotes and consultations are completely free. We only charge when you decide to proceed with an order.' },
  { q: 'What types of products can you source?', a: 'We specialize in sourcing machinery, industrial equipment, consumer goods, electronics, and manufacturing components from China and other Asian markets.' },
  { q: 'Can I schedule a factory visit?', a: 'Absolutely — mention your preferred location and time in the contact form and our team can arrange factory visits and supplier meetings.' },
]

const ChevronDivider = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const FaqItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
    >
      <span className="font-semibold text-sm" style={{ color: BRAND_COLOR }}>{q}</span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-400 flex-shrink-0 transition-transform duration-200"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
        {a}
      </div>
    )}
  </div>
)

const Contact = () => {
  const [formData, setFormData] = useState({ firstName: '', middleName: '', lastName: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="w-full bg-white ">
      {/* ---- Hero ---- */}
      <div className="relative w-full h-[300px] sm:h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&h=700&fit=crop"
          alt="IndoChinaBridge office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, rgba(244,23,3,0.22), rgba(244,23,3,0.25))` }} />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>Home</span>
            <ChevronDivider />
            <span className="text-white font-medium">Contact Us</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            Get in Touch
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            Questions about sourcing machinery, products, or manufacturing solutions from China? Our team is here to help — reach out any way that's convenient.
          </p>
        </div>
      </div>

      {/* ---- Contact info cards — overlaps hero edge ---- */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -translate-y-10">
          {CONTACT_CARDS.map(({ icon, title, lines, note }) => (
            <div key={title} className="bg-white flex rounded-2xl shadow-xl border border-gray-100 p-6">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-2xl" style={{ backgroundColor: 'rgba(244,23,3,0.1)' }}>
                {icon}
              </span>
              
              <div className="ml-5"> 
                <h3 className="font-bold text-sm mb-2" style={{ color: BRAND_COLOR }}>{title}</h3>
                {lines.map((line) => (
                  <p key={line} className="text-gray-600 text-sm leading-snug">{line}</p>
                ))}
                <p className="text-gray-400 text-xs mt-2">{note}</p>
              </div>
            
            </div>
          ))}
        </div>
      </div>

      {/* ---- Form + map ---- */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
          {/* Left: Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 pt-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder="First name" />
                </div>
                <div>
                  <label htmlFor="middleName" className="block text-base font-medium text-gray-700 mb-2">Middle Name</label>
                  <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder="Middle name" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder="Last name" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder="Enter your email address" />
              </div>

            

              <div>
                <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">Subject *</label>
                <select id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base">
                  <option value="">Select a subject</option>
                  <option value="Sourcing Quote">Sourcing Quote</option>
                  <option value="Machinery Sourcing">Machinery Sourcing</option>
                  <option value="Product Sourcing">Product Sourcing</option>
                  <option value="Quality Inspection">Quality Inspection</option>
                  <option value="Logistics Inquiry">Logistics Inquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">Message *</label>
                <textarea id="message" name="message" required rows={2} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition resize-none text-base" placeholder="Write your message here..."></textarea>
              </div>

              <button type="submit" className="w-full bg-[#F41703] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#F41703] transition-colors duration-300 shadow-md hover:shadow-lg text-base">Send Message</button>
            </form>
          </div>

          {/* Right: Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-white flex justify-between items-center">
              <h3 className="text-xl font-semibold text-black">Our Location</h3>
              <a 
                href="https://www.google.com/maps?q=28.5807941,77.4282933&z=17" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#F41703] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Maps
              </a>
            </div>
            <div className="h-120">
              <iframe src="https://www.google.com/maps?q=28.5807941,77.4282933&z=17&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Mayank Varshney & Co. Location"></iframe>
            </div>
          </div>
        </div>

    
    </div>
  )
}

export default Contact