import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { submitQuotation } from '../services/quotationApi'

const countryCodes = [
  { code: '+93', country: 'Afghanistan', countryCode: 'af' },
  { code: '+355', country: 'Albania', countryCode: 'al' },
  { code: '+213', country: 'Algeria', countryCode: 'dz' },
  { code: '+1', country: 'American Samoa', countryCode: 'as' },
  { code: '+376', country: 'Andorra', countryCode: 'ad' },
  { code: '+244', country: 'Angola', countryCode: 'ao' },
  { code: '+1', country: 'Anguilla', countryCode: 'ai' },
  { code: '+1', country: 'Antigua and Barbuda', countryCode: 'ag' },
  { code: '+54', country: 'Argentina', countryCode: 'ar' },
  { code: '+374', country: 'Armenia', countryCode: 'am' },
  { code: '+297', country: 'Aruba', countryCode: 'aw' },
  { code: '+61', country: 'Australia', countryCode: 'au' },
  { code: '+43', country: 'Austria', countryCode: 'at' },
  { code: '+994', country: 'Azerbaijan', countryCode: 'az' },
  { code: '+1', country: 'Bahamas', countryCode: 'bs' },
  { code: '+973', country: 'Bahrain', countryCode: 'bh' },
  { code: '+880', country: 'Bangladesh', countryCode: 'bd' },
  { code: '+1', country: 'Barbados', countryCode: 'bb' },
  { code: '+375', country: 'Belarus', countryCode: 'by' },
  { code: '+32', country: 'Belgium', countryCode: 'be' },
  { code: '+501', country: 'Belize', countryCode: 'bz' },
  { code: '+229', country: 'Benin', countryCode: 'bj' },
  { code: '+1', country: 'Bermuda', countryCode: 'bm' },
  { code: '+975', country: 'Bhutan', countryCode: 'bt' },
  { code: '+591', country: 'Bolivia', countryCode: 'bo' },
  { code: '+387', country: 'Bosnia and Herzegovina', countryCode: 'ba' },
  { code: '+267', country: 'Botswana', countryCode: 'bw' },
  { code: '+55', country: 'Brazil', countryCode: 'br' },
  { code: '+1', country: 'British Virgin Islands', countryCode: 'vg' },
  { code: '+673', country: 'Brunei', countryCode: 'bn' },
  { code: '+359', country: 'Bulgaria', countryCode: 'bg' },
  { code: '+226', country: 'Burkina Faso', countryCode: 'bf' },
  { code: '+257', country: 'Burundi', countryCode: 'bi' },
  { code: '+855', country: 'Cambodia', countryCode: 'kh' },
  { code: '+237', country: 'Cameroon', countryCode: 'cm' },
  { code: '+1', country: 'Canada', countryCode: 'ca' },
  { code: '+238', country: 'Cape Verde', countryCode: 'cv' },
  { code: '+1', country: 'Cayman Islands', countryCode: 'ky' },
  { code: '+236', country: 'Central African Republic', countryCode: 'cf' },
  { code: '+235', country: 'Chad', countryCode: 'td' },
  { code: '+56', country: 'Chile', countryCode: 'cl' },
  { code: '+86', country: 'China', countryCode: 'cn' },
  { code: '+57', country: 'Colombia', countryCode: 'co' },
  { code: '+269', country: 'Comoros', countryCode: 'km' },
  { code: '+242', country: 'Congo', countryCode: 'cg' },
  { code: '+243', country: 'Congo DR', countryCode: 'cd' },
  { code: '+682', country: 'Cook Islands', countryCode: 'ck' },
  { code: '+506', country: 'Costa Rica', countryCode: 'cr' },
  { code: '+385', country: 'Croatia', countryCode: 'hr' },
  { code: '+53', country: 'Cuba', countryCode: 'cu' },
  { code: '+599', country: 'Curaçao', countryCode: 'cw' },
  { code: '+357', country: 'Cyprus', countryCode: 'cy' },
  { code: '+420', country: 'Czech Republic', countryCode: 'cz' },
  { code: '+45', country: 'Denmark', countryCode: 'dk' },
  { code: '+253', country: 'Djibouti', countryCode: 'dj' },
  { code: '+1', country: 'Dominica', countryCode: 'dm' },
  { code: '+1', country: 'Dominican Republic', countryCode: 'do' },
  { code: '+593', country: 'Ecuador', countryCode: 'ec' },
  { code: '+20', country: 'Egypt', countryCode: 'eg' },
  { code: '+503', country: 'El Salvador', countryCode: 'sv' },
  { code: '+240', country: 'Equatorial Guinea', countryCode: 'gq' },
  { code: '+291', country: 'Eritrea', countryCode: 'er' },
  { code: '+372', country: 'Estonia', countryCode: 'ee' },
  { code: '+251', country: 'Ethiopia', countryCode: 'et' },
  { code: '+500', country: 'Falkland Islands', countryCode: 'fk' },
  { code: '+298', country: 'Faroe Islands', countryCode: 'fo' },
  { code: '+679', country: 'Fiji', countryCode: 'fj' },
  { code: '+358', country: 'Finland', countryCode: 'fi' },
  { code: '+33', country: 'France', countryCode: 'fr' },
  { code: '+594', country: 'French Guiana', countryCode: 'gf' },
  { code: '+689', country: 'French Polynesia', countryCode: 'pf' },
  { code: '+241', country: 'Gabon', countryCode: 'ga' },
  { code: '+220', country: 'Gambia', countryCode: 'gm' },
  { code: '+995', country: 'Georgia', countryCode: 'ge' },
  { code: '+49', country: 'Germany', countryCode: 'de' },
  { code: '+233', country: 'Ghana', countryCode: 'gh' },
  { code: '+350', country: 'Gibraltar', countryCode: 'gi' },
  { code: '+30', country: 'Greece', countryCode: 'gr' },
  { code: '+299', country: 'Greenland', countryCode: 'gl' },
  { code: '+1', country: 'Grenada', countryCode: 'gd' },
  { code: '+1', country: 'Guadeloupe', countryCode: 'gp' },
  { code: '+1', country: 'Guam', countryCode: 'gu' },
  { code: '+502', country: 'Guatemala', countryCode: 'gt' },
  { code: '+44', country: 'Guernsey', countryCode: 'gg' },
  { code: '+224', country: 'Guinea', countryCode: 'gn' },
  { code: '+245', country: 'Guinea-Bissau', countryCode: 'gw' },
  { code: '+592', country: 'Guyana', countryCode: 'gy' },
  { code: '+509', country: 'Haiti', countryCode: 'ht' },
  { code: '+504', country: 'Honduras', countryCode: 'hn' },
  { code: '+852', country: 'Hong Kong', countryCode: 'hk' },
  { code: '+36', country: 'Hungary', countryCode: 'hu' },
  { code: '+354', country: 'Iceland', countryCode: 'is' },
  { code: '+91', country: 'India', countryCode: 'in' },
  { code: '+62', country: 'Indonesia', countryCode: 'id' },
  { code: '+98', country: 'Iran', countryCode: 'ir' },
  { code: '+964', country: 'Iraq', countryCode: 'iq' },
  { code: '+353', country: 'Ireland', countryCode: 'ie' },
  { code: '+44', country: 'Isle of Man', countryCode: 'im' },
  { code: '+972', country: 'Israel', countryCode: 'il' },
  { code: '+39', country: 'Italy', countryCode: 'it' },
  { code: '+1', country: 'Jamaica', countryCode: 'jm' },
  { code: '+81', country: 'Japan', countryCode: 'jp' },
  { code: '+44', country: 'Jersey', countryCode: 'je' },
  { code: '+962', country: 'Jordan', countryCode: 'jo' },
  { code: '+7', country: 'Kazakhstan', countryCode: 'kz' },
  { code: '+254', country: 'Kenya', countryCode: 'ke' },
  { code: '+686', country: 'Kiribati', countryCode: 'ki' },
  { code: '+965', country: 'Kuwait', countryCode: 'kw' },
  { code: '+996', country: 'Kyrgyzstan', countryCode: 'kg' },
  { code: '+856', country: 'Laos', countryCode: 'la' },
  { code: '+371', country: 'Latvia', countryCode: 'lv' },
  { code: '+961', country: 'Lebanon', countryCode: 'lb' },
  { code: '+266', country: 'Lesotho', countryCode: 'ls' },
  { code: '+231', country: 'Liberia', countryCode: 'lr' },
  { code: '+218', country: 'Libya', countryCode: 'ly' },
  { code: '+423', country: 'Liechtenstein', countryCode: 'li' },
  { code: '+370', country: 'Lithuania', countryCode: 'lt' },
  { code: '+352', country: 'Luxembourg', countryCode: 'lu' },
  { code: '+853', country: 'Macau', countryCode: 'mo' },
  { code: '+389', country: 'North Macedonia', countryCode: 'mk' },
  { code: '+261', country: 'Madagascar', countryCode: 'mg' },
  { code: '+265', country: 'Malawi', countryCode: 'mw' },
  { code: '+60', country: 'Malaysia', countryCode: 'my' },
  { code: '+960', country: 'Maldives', countryCode: 'mv' },
  { code: '+223', country: 'Mali', countryCode: 'ml' },
  { code: '+356', country: 'Malta', countryCode: 'mt' },
  { code: '+692', country: 'Marshall Islands', countryCode: 'mh' },
  { code: '+596', country: 'Martinique', countryCode: 'mq' },
  { code: '+222', country: 'Mauritania', countryCode: 'mr' },
  { code: '+230', country: 'Mauritius', countryCode: 'mu' },
  { code: '+262', country: 'Mayotte', countryCode: 'yt' },
  { code: '+52', country: 'Mexico', countryCode: 'mx' },
  { code: '+691', country: 'Micronesia', countryCode: 'fm' },
  { code: '+373', country: 'Moldova', countryCode: 'md' },
  { code: '+377', country: 'Monaco', countryCode: 'mc' },
  { code: '+976', country: 'Mongolia', countryCode: 'mn' },
  { code: '+382', country: 'Montenegro', countryCode: 'me' },
  { code: '+1', country: 'Montserrat', countryCode: 'ms' },
  { code: '+212', country: 'Morocco', countryCode: 'ma' },
  { code: '+258', country: 'Mozambique', countryCode: 'mz' },
  { code: '+95', country: 'Myanmar', countryCode: 'mm' },
  { code: '+264', country: 'Namibia', countryCode: 'na' },
  { code: '+674', country: 'Nauru', countryCode: 'nr' },
  { code: '+977', country: 'Nepal', countryCode: 'np' },
  { code: '+31', country: 'Netherlands', countryCode: 'nl' },
  { code: '+599', country: 'Netherlands Antilles', countryCode: 'an' },
  { code: '+687', country: 'New Caledonia', countryCode: 'nc' },
  { code: '+64', country: 'New Zealand', countryCode: 'nz' },
  { code: '+505', country: 'Nicaragua', countryCode: 'ni' },
  { code: '+227', country: 'Niger', countryCode: 'ne' },
  { code: '+234', country: 'Nigeria', countryCode: 'ng' },
  { code: '+683', country: 'Niue', countryCode: 'nu' },
  { code: '+1', country: 'Northern Mariana Islands', countryCode: 'mp' },
  { code: '+47', country: 'Norway', countryCode: 'no' },
  { code: '+968', country: 'Oman', countryCode: 'om' },
  { code: '+92', country: 'Pakistan', countryCode: 'pk' },
  { code: '+680', country: 'Palau', countryCode: 'pw' },
  { code: '+970', country: 'Palestine', countryCode: 'ps' },
  { code: '+507', country: 'Panama', countryCode: 'pa' },
  { code: '+675', country: 'Papua New Guinea', countryCode: 'pg' },
  { code: '+595', country: 'Paraguay', countryCode: 'py' },
  { code: '+51', country: 'Peru', countryCode: 'pe' },
  { code: '+63', country: 'Philippines', countryCode: 'ph' },
  { code: '+48', country: 'Poland', countryCode: 'pl' },
  { code: '+351', country: 'Portugal', countryCode: 'pt' },
  { code: '+1', country: 'Puerto Rico', countryCode: 'pr' },
  { code: '+974', country: 'Qatar', countryCode: 'qa' },
  { code: '+40', country: 'Romania', countryCode: 'ro' },
  { code: '+7', country: 'Russia', countryCode: 'ru' },
  { code: '+250', country: 'Rwanda', countryCode: 'rw' },
  { code: '+590', country: 'Saint Barthélemy', countryCode: 'bl' },
  { code: '+1', country: 'Saint Kitts and Nevis', countryCode: 'kn' },
  { code: '+1', country: 'Saint Lucia', countryCode: 'lc' },
  { code: '+590', country: 'Saint Martin', countryCode: 'mf' },
  { code: '+508', country: 'Saint Pierre and Miquelon', countryCode: 'pm' },
  { code: '+1', country: 'Saint Vincent and the Grenadines', countryCode: 'vc' },
  { code: '+685', country: 'Samoa', countryCode: 'ws' },
  { code: '+378', country: 'San Marino', countryCode: 'sm' },
  { code: '+239', country: 'Sao Tome and Principe', countryCode: 'st' },
  { code: '+966', country: 'Saudi Arabia', countryCode: 'sa' },
  { code: '+221', country: 'Senegal', countryCode: 'sn' },
  { code: '+381', country: 'Serbia', countryCode: 'rs' },
  { code: '+248', country: 'Seychelles', countryCode: 'sc' },
  { code: '+232', country: 'Sierra Leone', countryCode: 'sl' },
  { code: '+65', country: 'Singapore', countryCode: 'sg' },
  { code: '+1', country: 'Sint Maarten', countryCode: 'sx' },
  { code: '+421', country: 'Slovakia', countryCode: 'sk' },
  { code: '+386', country: 'Slovenia', countryCode: 'si' },
  { code: '+677', country: 'Solomon Islands', countryCode: 'sb' },
  { code: '+252', country: 'Somalia', countryCode: 'so' },
  { code: '+27', country: 'South Africa', countryCode: 'za' },
  { code: '+500', country: 'South Georgia and the South Sandwich Islands', countryCode: 'gs' },
  { code: '+82', country: 'South Korea', countryCode: 'kr' },
  { code: '+211', country: 'South Sudan', countryCode: 'ss' },
  { code: '+34', country: 'Spain', countryCode: 'es' },
  { code: '+94', country: 'Sri Lanka', countryCode: 'lk' },
  { code: '+249', country: 'Sudan', countryCode: 'sd' },
  { code: '+597', country: 'Suriname', countryCode: 'sr' },
  { code: '+47', country: 'Svalbard and Jan Mayen', countryCode: 'sj' },
  { code: '+46', country: 'Sweden', countryCode: 'se' },
  { code: '+41', country: 'Switzerland', countryCode: 'ch' },
  { code: '+963', country: 'Syria', countryCode: 'sy' },
  { code: '+886', country: 'Taiwan', countryCode: 'tw' },
  { code: '+992', country: 'Tajikistan', countryCode: 'tj' },
  { code: '+255', country: 'Tanzania', countryCode: 'tz' },
  { code: '+66', country: 'Thailand', countryCode: 'th' },
  { code: '+670', country: 'Timor-Leste', countryCode: 'tl' },
  { code: '+228', country: 'Togo', countryCode: 'tg' },
  { code: '+690', country: 'Tokelau', countryCode: 'tk' },
  { code: '+676', country: 'Tonga', countryCode: 'to' },
  { code: '+1', country: 'Trinidad and Tobago', countryCode: 'tt' },
  { code: '+216', country: 'Tunisia', countryCode: 'tn' },
  { code: '+90', country: 'Turkey', countryCode: 'tr' },
  { code: '+993', country: 'Turkmenistan', countryCode: 'tm' },
  { code: '+1', country: 'Turks and Caicos Islands', countryCode: 'tc' },
  { code: '+688', country: 'Tuvalu', countryCode: 'tv' },
  { code: '+971', country: 'UAE', countryCode: 'ae' },
  { code: '+44', country: 'UK', countryCode: 'gb' },
  { code: '+1', country: 'USA', countryCode: 'us' },
  { code: '+380', country: 'Ukraine', countryCode: 'ua' },
  { code: '+598', country: 'Uruguay', countryCode: 'uy' },
  { code: '+998', country: 'Uzbekistan', countryCode: 'uz' },
  { code: '+678', country: 'Vanuatu', countryCode: 'vu' },
  { code: '+58', country: 'Venezuela', countryCode: 've' },
  { code: '+84', country: 'Vietnam', countryCode: 'vn' },
  { code: '+1', country: 'Virgin Islands (British)', countryCode: 'vg' },
  { code: '+1', country: 'Virgin Islands (US)', countryCode: 'vi' },
  { code: '+681', country: 'Wallis and Futuna', countryCode: 'wf' },
  { code: '+967', country: 'Yemen', countryCode: 'ye' },
  { code: '+260', country: 'Zambia', countryCode: 'zm' },
  { code: '+263', country: 'Zimbabwe', countryCode: 'zw' },
]

const QuoteModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth()
  const [countryCode, setCountryCode] = useState('+91')
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: '',
    quantity: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css'
      document.head.appendChild(link)
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const quotationData = {
        ...formData,
        phone: `${countryCode}${formData.phone}`,
        productId: product._id,
        productName: product.productName,
        productSlug: product.slug,
        quantity: parseInt(formData.quantity) || 1,
      }

      const response = await submitQuotation(quotationData)
      if (response.success) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          onClose()
        }, 2000)
      } else {
        alert(response.message || 'Failed to submit quotation')
      }
    } catch (error) {
      console.error('Error submitting quotation:', error)
      alert('Failed to submit quotation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F41703] via-[#F41703] to-[#F97316] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Request a Quote</h2>
              <p className="text-red-100 text-sm mt-1 opacity-90">{product.productName}</p>
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
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quote Request Submitted!</h3>
              <p className="text-gray-600">We'll get back to you soon with the quotation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={handleChange('middleName')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="A."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange('email')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2 items-stretch">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none bg-gray-50 focus:bg-white text-sm w-[100px] flex-shrink-0"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="Your Company Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity Required *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange('quantity')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange('message')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#F41703] to-[#F97316] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#d10f02] hover:to-[#ea580c] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuoteModal
