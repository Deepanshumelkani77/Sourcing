import React, { useState, useEffect, useId, useLayoutEffect, useMemo, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthProvider'
import { submitQuotation } from '../services/quotationApi'

/* ------------------------------------------------------------------ */
/* Country data: [iso, name, dial code without "+"]                    */
/* ------------------------------------------------------------------ */
const RAW_COUNTRIES = [
  ['af', 'Afghanistan', '93'], ['al', 'Albania', '355'], ['dz', 'Algeria', '213'], ['as', 'American Samoa', '1'],
  ['ad', 'Andorra', '376'], ['ao', 'Angola', '244'], ['ai', 'Anguilla', '1'], ['ag', 'Antigua and Barbuda', '1'],
  ['ar', 'Argentina', '54'], ['am', 'Armenia', '374'], ['aw', 'Aruba', '297'], ['au', 'Australia', '61'],
  ['at', 'Austria', '43'], ['az', 'Azerbaijan', '994'], ['bs', 'Bahamas', '1'], ['bh', 'Bahrain', '973'],
  ['bd', 'Bangladesh', '880'], ['bb', 'Barbados', '1'], ['by', 'Belarus', '375'], ['be', 'Belgium', '32'],
  ['bz', 'Belize', '501'], ['bj', 'Benin', '229'], ['bm', 'Bermuda', '1'], ['bt', 'Bhutan', '975'],
  ['bo', 'Bolivia', '591'], ['ba', 'Bosnia and Herzegovina', '387'], ['bw', 'Botswana', '267'], ['br', 'Brazil', '55'],
  ['vg', 'British Virgin Islands', '1'], ['bn', 'Brunei', '673'], ['bg', 'Bulgaria', '359'], ['bf', 'Burkina Faso', '226'],
  ['bi', 'Burundi', '257'], ['kh', 'Cambodia', '855'], ['cm', 'Cameroon', '237'], ['ca', 'Canada', '1'],
  ['cv', 'Cape Verde', '238'], ['ky', 'Cayman Islands', '1'], ['cf', 'Central African Republic', '236'], ['td', 'Chad', '235'],
  ['cl', 'Chile', '56'], ['cn', 'China', '86'], ['co', 'Colombia', '57'], ['km', 'Comoros', '269'],
  ['cg', 'Congo', '242'], ['cd', 'DR Congo', '243'], ['ck', 'Cook Islands', '682'], ['cr', 'Costa Rica', '506'],
  ['ci', "Côte d'Ivoire", '225'], ['hr', 'Croatia', '385'], ['cu', 'Cuba', '53'], ['cw', 'Curaçao', '599'],
  ['cy', 'Cyprus', '357'], ['cz', 'Czech Republic', '420'], ['dk', 'Denmark', '45'], ['dj', 'Djibouti', '253'],
  ['dm', 'Dominica', '1'], ['do', 'Dominican Republic', '1'], ['ec', 'Ecuador', '593'], ['eg', 'Egypt', '20'],
  ['sv', 'El Salvador', '503'], ['gq', 'Equatorial Guinea', '240'], ['er', 'Eritrea', '291'], ['ee', 'Estonia', '372'],
  ['sz', 'Eswatini', '268'], ['et', 'Ethiopia', '251'], ['fk', 'Falkland Islands', '500'], ['fo', 'Faroe Islands', '298'],
  ['fj', 'Fiji', '679'], ['fi', 'Finland', '358'], ['fr', 'France', '33'], ['gf', 'French Guiana', '594'],
  ['pf', 'French Polynesia', '689'], ['ga', 'Gabon', '241'], ['gm', 'Gambia', '220'], ['ge', 'Georgia', '995'],
  ['de', 'Germany', '49'], ['gh', 'Ghana', '233'], ['gi', 'Gibraltar', '350'], ['gr', 'Greece', '30'],
  ['gl', 'Greenland', '299'], ['gd', 'Grenada', '1'], ['gp', 'Guadeloupe', '590'], ['gu', 'Guam', '1'],
  ['gt', 'Guatemala', '502'], ['gg', 'Guernsey', '44'], ['gn', 'Guinea', '224'], ['gw', 'Guinea-Bissau', '245'],
  ['gy', 'Guyana', '592'], ['ht', 'Haiti', '509'], ['hn', 'Honduras', '504'], ['hk', 'Hong Kong', '852'],
  ['hu', 'Hungary', '36'], ['is', 'Iceland', '354'], ['in', 'India', '91'], ['id', 'Indonesia', '62'],
  ['ir', 'Iran', '98'], ['iq', 'Iraq', '964'], ['ie', 'Ireland', '353'], ['im', 'Isle of Man', '44'],
  ['il', 'Israel', '972'], ['it', 'Italy', '39'], ['jm', 'Jamaica', '1'], ['jp', 'Japan', '81'],
  ['je', 'Jersey', '44'], ['jo', 'Jordan', '962'], ['kz', 'Kazakhstan', '7'], ['ke', 'Kenya', '254'],
  ['ki', 'Kiribati', '686'], ['xk', 'Kosovo', '383'], ['kw', 'Kuwait', '965'], ['kg', 'Kyrgyzstan', '996'],
  ['la', 'Laos', '856'], ['lv', 'Latvia', '371'], ['lb', 'Lebanon', '961'], ['ls', 'Lesotho', '266'],
  ['lr', 'Liberia', '231'], ['ly', 'Libya', '218'], ['li', 'Liechtenstein', '423'], ['lt', 'Lithuania', '370'],
  ['lu', 'Luxembourg', '352'], ['mo', 'Macau', '853'], ['mk', 'North Macedonia', '389'], ['mg', 'Madagascar', '261'],
  ['mw', 'Malawi', '265'], ['my', 'Malaysia', '60'], ['mv', 'Maldives', '960'], ['ml', 'Mali', '223'],
  ['mt', 'Malta', '356'], ['mh', 'Marshall Islands', '692'], ['mq', 'Martinique', '596'], ['mr', 'Mauritania', '222'],
  ['mu', 'Mauritius', '230'], ['yt', 'Mayotte', '262'], ['mx', 'Mexico', '52'], ['fm', 'Micronesia', '691'],
  ['md', 'Moldova', '373'], ['mc', 'Monaco', '377'], ['mn', 'Mongolia', '976'], ['me', 'Montenegro', '382'],
  ['ms', 'Montserrat', '1'], ['ma', 'Morocco', '212'], ['mz', 'Mozambique', '258'], ['mm', 'Myanmar', '95'],
  ['na', 'Namibia', '264'], ['nr', 'Nauru', '674'], ['np', 'Nepal', '977'], ['nl', 'Netherlands', '31'],
  ['nc', 'New Caledonia', '687'], ['nz', 'New Zealand', '64'], ['ni', 'Nicaragua', '505'], ['ne', 'Niger', '227'],
  ['ng', 'Nigeria', '234'], ['nu', 'Niue', '683'], ['kp', 'North Korea', '850'], ['mp', 'Northern Mariana Islands', '1'],
  ['no', 'Norway', '47'], ['om', 'Oman', '968'], ['pk', 'Pakistan', '92'], ['pw', 'Palau', '680'],
  ['ps', 'Palestine', '970'], ['pa', 'Panama', '507'], ['pg', 'Papua New Guinea', '675'], ['py', 'Paraguay', '595'],
  ['pe', 'Peru', '51'], ['ph', 'Philippines', '63'], ['pl', 'Poland', '48'], ['pt', 'Portugal', '351'],
  ['pr', 'Puerto Rico', '1'], ['qa', 'Qatar', '974'], ['re', 'Réunion', '262'], ['ro', 'Romania', '40'],
  ['ru', 'Russia', '7'], ['rw', 'Rwanda', '250'], ['bl', 'Saint Barthélemy', '590'], ['sh', 'Saint Helena', '290'],
  ['kn', 'Saint Kitts and Nevis', '1'], ['lc', 'Saint Lucia', '1'], ['mf', 'Saint Martin', '590'],
  ['pm', 'Saint Pierre and Miquelon', '508'], ['vc', 'Saint Vincent and the Grenadines', '1'], ['ws', 'Samoa', '685'],
  ['sm', 'San Marino', '378'], ['st', 'Sao Tome and Principe', '239'], ['sa', 'Saudi Arabia', '966'], ['sn', 'Senegal', '221'],
  ['rs', 'Serbia', '381'], ['sc', 'Seychelles', '248'], ['sl', 'Sierra Leone', '232'], ['sg', 'Singapore', '65'],
  ['sx', 'Sint Maarten', '1'], ['sk', 'Slovakia', '421'], ['si', 'Slovenia', '386'], ['sb', 'Solomon Islands', '677'],
  ['so', 'Somalia', '252'], ['za', 'South Africa', '27'], ['gs', 'South Georgia and the South Sandwich Islands', '500'],
  ['kr', 'South Korea', '82'], ['ss', 'South Sudan', '211'], ['es', 'Spain', '34'], ['lk', 'Sri Lanka', '94'],
  ['sd', 'Sudan', '249'], ['sr', 'Suriname', '597'], ['sj', 'Svalbard and Jan Mayen', '47'], ['se', 'Sweden', '46'],
  ['ch', 'Switzerland', '41'], ['sy', 'Syria', '963'], ['tw', 'Taiwan', '886'], ['tj', 'Tajikistan', '992'],
  ['tz', 'Tanzania', '255'], ['th', 'Thailand', '66'], ['tl', 'Timor-Leste', '670'], ['tg', 'Togo', '228'],
  ['tk', 'Tokelau', '690'], ['to', 'Tonga', '676'], ['tt', 'Trinidad and Tobago', '1'], ['tn', 'Tunisia', '216'],
  ['tr', 'Turkey', '90'], ['tm', 'Turkmenistan', '993'], ['tc', 'Turks and Caicos Islands', '1'], ['tv', 'Tuvalu', '688'],
  ['ae', 'United Arab Emirates', '971'], ['gb', 'United Kingdom', '44'], ['us', 'United States', '1'], ['ua', 'Ukraine', '380'],
  ['uy', 'Uruguay', '598'], ['uz', 'Uzbekistan', '998'], ['vu', 'Vanuatu', '678'], ['va', 'Vatican City', '379'],
  ['ve', 'Venezuela', '58'], ['vn', 'Vietnam', '84'], ['vi', 'US Virgin Islands', '1'], ['wf', 'Wallis and Futuna', '681'],
  ['ye', 'Yemen', '967'], ['zm', 'Zambia', '260'], ['zw', 'Zimbabwe', '263']
]

/* Extra search words, so "uae", "usa" or "uk" find the right country */
const ALIASES = {
  ae: 'uae emirates', us: 'usa america', gb: 'uk britain england', kr: 'korea', cz: 'czechia',
  ci: 'ivory coast', mm: 'burma', sz: 'swaziland', cv: 'cabo verde', mk: 'macedonia', tl: 'east timor', cd: 'congo kinshasa'
}

const COUNTRIES = RAW_COUNTRIES.map(([iso, name, dial]) => ({
  iso,
  name,
  dial,
  code: `+${dial}`,
  search: `${name} ${ALIASES[iso] || ''}`.toLowerCase()
})).sort((a, b) => a.name.localeCompare(b.name, 'en'))

const COUNTRY_BY_ISO = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]))
const POPULAR = ['in', 'ae', 'cn', 'sa', 'us', 'gb', 'sg'].map((iso) => COUNTRY_BY_ISO[iso])
const DEFAULT_ISO = 'in'

/* ------------------------------------------------------------------ */
/* Flag component                                                      */
/* ------------------------------------------------------------------ */
const Flag = ({ iso }) => (
  <span className="relative inline-flex h-[18px] w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-gray-100 text-[8px] font-bold leading-none text-gray-400 ring-1 ring-black/10">
    {iso.toUpperCase()}
    <span
      className={`fi fi-${iso}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover' }}
    />
  </span>
)

/* ------------------------------------------------------------------ */
/* Country code dropdown: flags, search, keyboard support              */
/* ------------------------------------------------------------------ */
const CountryCodeSelect = ({ value, onChange }) => {
  const uid = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(null)

  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const searchRef = useRef(null)

  const selected = COUNTRY_BY_ISO[value] || COUNTRY_BY_ISO[DEFAULT_ISO]
  const q = query.trim().toLowerCase().replace(/^\+/, '')

  const groups = useMemo(() => {
    if (!q) {
      return [
        { label: 'Popular', items: POPULAR },
        { label: 'All countries', items: COUNTRIES }
      ]
    }
    const items = COUNTRIES.filter((c) => c.search.includes(q) || c.dial.startsWith(q) || c.iso === q).sort(
      (a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q))
    )
    return [{ label: null, items }]
  }, [q])

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  /* Place the panel next to the trigger. It is position:fixed, so the modal's overflow never clips it. */
  const place = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(340, vw - 24)
    const left = Math.min(Math.max(12, r.left), vw - width - 12)
    const spaceBelow = vh - r.bottom - 16
    const spaceAbove = r.top - 16
    const openUp = spaceBelow < 300 && spaceAbove > spaceBelow
    setPos({
      left,
      width,
      top: openUp ? undefined : r.bottom + 6,
      bottom: openUp ? vh - r.top + 6 : undefined,
      maxHeight: Math.max(220, Math.min(380, openUp ? spaceAbove : spaceBelow)),
      openUp
    })
  }, [])

  useLayoutEffect(() => {
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    const t = setTimeout(() => searchRef.current?.focus(), 0)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      clearTimeout(t)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, uid, groups])

  const openPanel = () => {
    setQuery('')
    const inPopular = POPULAR.findIndex((c) => c.iso === selected.iso)
    setActive(inPopular >= 0 ? inPopular : POPULAR.length + COUNTRIES.findIndex((c) => c.iso === selected.iso))
    setOpen(true)
  }

  const choose = (c) => {
    onChange(c.iso)
    setOpen(false)
    btnRef.current?.focus()
  }

  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(Math.max(flat.length - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) choose(flat[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      btnRef.current?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openPanel()
    }
  }

  let optionIndex = -1

  return (
    <>
      <style>{`@keyframes ccs-in { from { opacity: 0; transform: translateY(-6px) scale(.98) } to { opacity: 1; transform: none } }
      @media (prefers-reduced-motion: reduce) { .ccs-panel { animation: none !important } }`}</style>

      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} ${selected.code}`}
        className={`flex min-w-[104px] flex-shrink-0 items-center gap-2 self-stretch rounded-md border bg-white px-2.5 text-xs transition sm:text-sm ${
          open ? 'border-[#F41703] ring-2 ring-[#F41703]/20' : 'border-gray-200 hover:border-gray-300'
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703]`}
      >
        <Flag iso={selected.iso} />
        <span className="font-medium tabular-nums text-gray-800">{selected.code}</span>
        <svg className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          className="ccs-panel fixed z-[1100] flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/20"
          style={{
            left: pos.left,
            width: pos.width,
            top: pos.top,
            bottom: pos.bottom,
            maxHeight: pos.maxHeight,
            transformOrigin: pos.openUp ? 'bottom left' : 'top left',
            animation: 'ccs-in .15s ease-out'
          }}
        >
          {/* Search */}
          <div className="border-b border-gray-100 p-2.5">
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search country or code"
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-list`}
                aria-activedescendant={flat.length ? `${uid}-opt-${active}` : undefined}
                aria-label="Search countries"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#F41703] focus:bg-white focus:ring-2 focus:ring-[#F41703]/15"
              />
            </div>
          </div>

          {/* List */}
          <ul id={`${uid}-list`} role="listbox" aria-label="Country codes" className="min-h-0 flex-1 overflow-y-auto py-1 [scrollbar-width:thin]">
            {flat.length === 0 && (
              <li role="presentation" className="px-4 py-8 text-center text-sm text-gray-500">
                No countries found for "{query}"
              </li>
            )}

            {groups.map((g, gi) => (
              <React.Fragment key={gi}>
                {g.label && (
                  <li role="presentation" className="sticky top-0 z-10 bg-white/95 px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 backdrop-blur">
                    {g.label}
                  </li>
                )}
                {g.items.map((c) => {
                  optionIndex += 1
                  const i = optionIndex
                  const isSelected = c.iso === selected.iso
                  return (
                    <li
                      key={`${gi}-${c.iso}`}
                      id={`${uid}-opt-${i}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(c)}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${i === active ? 'bg-orange-50' : ''} ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                    >
                      <Flag iso={c.iso} />
                      <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      <span className="flex-shrink-0 tabular-nums text-gray-500">{c.code}</span>
                      {isSelected && (
                        <svg className="h-4 w-4 flex-shrink-0 text-[#F41703]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  )
                })}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

const QuoteModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth()
  const [countryIso, setCountryIso] = useState('in')
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
      const selectedCountry = COUNTRY_BY_ISO[countryIso] || COUNTRY_BY_ISO[DEFAULT_ISO]
      const quotationData = {
        ...formData,
        phone: `${selectedCountry.code}${formData.phone}`,
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
                  <CountryCodeSelect value={countryIso} onChange={setCountryIso} />
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
                  rows={1}
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
