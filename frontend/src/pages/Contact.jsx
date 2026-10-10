import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../context/AppContext'

const BRAND_COLOR = '#F41703'
const SECONDARY_COLOR = '#F97316'

const CONTACT_CARDS = [
  {
    icon: '📞',
    titleKey: 'contact.cards.call.title',
    noteKey: 'contact.cards.call.note',
    lines: ['+91 9355544553'],
  },
  {
    icon: '✉️',
    titleKey: 'contact.cards.email.title',
    noteKey: 'contact.cards.email.note',
    lines: ['info@indochinabridge.com'],
  },
  {
    icon: '📍',
    titleKey: 'contact.cards.visit.title',
    noteKey: 'contact.cards.visit.note',
    lines: ['FF 05, Rise Retailia 1, Plot No. SC 01, Sector 1, Greater Noida West, Gautam Buddha Nagar, Uttar Pradesh - 201306'],
  },
  {
    icon: '🕐',
    titleKey: 'contact.cards.hours.title',
    noteKey: 'contact.cards.hours.note',
    linesKey: 'contact.cards.hours.lines',
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
  const { t } = useTranslation()
  const { user, openSignup } = useContext(AppContext)
  const [formData, setFormData] = useState({ firstName: '', middleName: '', lastName: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user) {
      openSignup()
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/submit`, formData)
      if (response.data.success) {
        setSubmitted(true)
        setFormData({ firstName: '', middleName: '', lastName: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Failed to submit form. Please try again.')
    }
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
            <span>{t('contact.hero.breadcrumb')}</span>
            <ChevronDivider />
            <span className="text-white font-medium">{t('contact.hero.title')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            {t('contact.hero.title')}
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </div>

      {/* ---- Contact info cards — overlaps hero edge ---- */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -translate-y-10">
          {CONTACT_CARDS.map(({ icon, titleKey, noteKey, lines, linesKey }) => (
            <div key={titleKey} className="bg-white flex rounded-2xl shadow-xl border border-gray-100 p-6">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-2xl" style={{ backgroundColor: 'rgba(244,23,3,0.1)' }}>
                {icon}
              </span>

              <div className="ml-5">
                <h3 className="font-bold text-sm mb-2" style={{ color: BRAND_COLOR }}>{t(titleKey)}</h3>
                {linesKey ? t(linesKey, { returnObjects: true }).map((line, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-snug">{line}</p>
                )) : lines.map((line, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-snug">{line}</p>
                ))}
                <p className="text-gray-400 text-xs mt-2">{t(noteKey)}</p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ---- Form + map ---- */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
          {/* Left: Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 pt-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.form.title')}</h2>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">{t('contact.form.success')}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.firstName')} *</label>
                  <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange('firstName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder={t('contact.form.firstName')} />
                </div>
                <div>
                  <label htmlFor="middleName" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.middleName')}</label>
                  <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleChange('middleName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder={t('contact.form.middleName')} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.lastName')} *</label>
                  <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange('lastName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder={t('contact.form.lastName')} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.email')} *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange('email')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base" placeholder={t('contact.form.email')} />
              </div>



              <div>
                <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.subject')} *</label>
                <select id="subject" name="subject" required value={formData.subject} onChange={handleChange('subject')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition text-base">
                  <option value="">{t('contact.form.selectSubject')}</option>
                  <option value="Sourcing Quote">{t('contact.form.subjects.sourcingQuote')}</option>
                  <option value="Machinery Sourcing">{t('contact.form.subjects.machinerySourcing')}</option>
                  <option value="Product Sourcing">{t('contact.form.subjects.productSourcing')}</option>
                  <option value="Quality Inspection">{t('contact.form.subjects.qualityInspection')}</option>
                  <option value="Logistics Inquiry">{t('contact.form.subjects.logisticsInquiry')}</option>
                  <option value="Partnership">{t('contact.form.subjects.partnership')}</option>
                  <option value="General Inquiry">{t('contact.form.subjects.generalInquiry')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">{t('contact.form.message')} *</label>
                <textarea id="message" name="message" required rows={2} value={formData.message} onChange={handleChange('message')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6A9E] focus:border-transparent outline-none transition resize-none text-base" placeholder={t('contact.form.message')}></textarea>
              </div>

              <button type="submit" className="w-full bg-[#F41703] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#F41703] transition-colors duration-300 shadow-md hover:shadow-lg text-base">{t('contact.form.submit')}</button>
            </form>
          </div>

          {/* Right: Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-white flex justify-between items-center">
              <h3 className="text-xl font-semibold text-black">{t('contact.map.title')}</h3>
              <a
                href="https://www.google.com/maps?q=28.5807941,77.4282933&z=17"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#F41703] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t('contact.map.openInMaps')}
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