import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* Change these if your routes are different */
const CONTACT_PATH = '/contact?country=india'
const SERVICES_PATH = '/services'

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
const Svg = ({ children, className = 'w-6 h-6', sw = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)

const I = {
  arrow: (c) => (
    <Svg className={c} sw={2.2}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  check: (c) => (
    <Svg className={c} sw={3}>
      <path d="m5 13 4 4L19 7" />
    </Svg>
  ),
  plus: (c) => (
    <Svg className={c} sw={2.4}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  search: (c) => (
    <Svg className={c}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  ),
  shield: (c) => (
    <Svg className={c}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  file: (c) => (
    <Svg className={c}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
    </Svg>
  ),
  ship: (c) => (
    <Svg className={c}>
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3" />
    </Svg>
  ),
  factory: (c) => (
    <Svg className={c}>
      <path d="M2 20h20" />
      <path d="M5 20V10l7-7 7 7v10" />
      <path d="M9 20v-6h6v6" />
    </Svg>
  ),
  box: (c) => (
    <Svg className={c}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </Svg>
  ),
  flask: (c) => (
    <Svg className={c}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7M7 16h10" />
    </Svg>
  ),
  truck: (c) => (
    <Svg className={c}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */
const TICKER = [
  'Machinery & equipment',
  'Electronics & components',
  'LED & electrical',
  'Auto & spare parts',
  'Hardware & tools',
  'Packaging materials',
  'Textiles & apparel',
  'Home & consumer goods',
  'Solar & energy'
]

const PHASES = [
  {
    number: '01',
    name: 'Source',
    tagline: 'Find and vet the right manufacturers',
    text: 'You tell us the product, quantity and target price. We search for manufacturers that fit, compare MOQs and pricing, and then check who is genuinely capable.',
    services: ['Supplier Identification', 'Supplier Evaluation & Verification'],
    receive: 'A supplier shortlist and a detailed verification report.',
    icon: 'search',
    photo: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=70'
  },
  {
    number: '02',
    name: 'Sample',
    tagline: 'Test and approve before you commit',
    text: 'Nothing goes into mass production on a promise. Samples are inspected against your specifications and sent to you with evidence for your approval.',
    services: ['Sample Inspection', 'Buyer Sample Approval'],
    receive: 'An inspection report with photographs, plus approval documentation.',
    icon: 'flask',
    photo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=70'
  },
  {
    number: '03',
    name: 'Order & Production',
    tagline: 'Lock in terms and track every milestone',
    text: 'We coordinate the purchase order, contract and specifications, then follow production at key milestones so you always know where your order stands.',
    services: ['Order Placement', 'Contract & Documentation', 'Production Monitoring'],
    receive: 'A confirmed purchase order, your documentation package and regular status reports.',
    icon: 'file',
    photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=70'
  },
  {
    number: '04',
    name: 'Quality & Delivery',
    tagline: 'Verify, ship and receive with confidence',
    text: 'Finished goods are checked for quality and quantity before dispatch. We coordinate transport and shipping, then the handover at your end.',
    services: ['Quality Inspection', 'Quantity Verification', 'Dispatch Coordination', 'Local Transportation', 'Receiving & Delivery'],
    receive: 'Quality and quantity reports, dispatch tracking and delivery confirmation.',
    icon: 'ship',
    photo: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=70'
  }
]

const CHECKLIST = [
  { title: 'Importer Exporter Code (IEC)', hint: 'Most commercial imports into India need one from the DGFT.' },
  { title: 'Product approvals checked', hint: 'Some categories need BIS certification or other approvals.' },
  { title: 'Duties and IGST budgeted', hint: 'Landed cost includes customs duty and IGST, not just product and freight.' },
  { title: 'Shipping terms decided', hint: 'For example FOB or CIF, agreed with the supplier.' },
  { title: 'Quantity and delivery date known', hint: 'So suppliers can quote and plan accurately.' }
]

const PORTS = ['Nhava Sheva (JNPT)', 'Mundra', 'Chennai', 'Kolkata', 'Inland container depots']

const FAQS = [
  {
    q: 'What do I need to start sourcing from China?',
    a: 'Tell us what you need made or bought: the product or category, specifications, quantity, target price, destination and the delivery date you are aiming for. Submit a proposal request and our team will get back to you.'
  },
  {
    q: 'Can I use only some of your services?',
    a: 'Yes. Pick individual services, such as supplier verification or pre-shipment inspection, or choose Complete Sourcing Management and let us run the process from supplier identification to final receiving.'
  },
  {
    q: 'Do you inspect goods before they ship to India?',
    a: 'Yes. We inspect samples before production and check finished goods for quality and quantity before dispatch, and you receive written reports with the findings.'
  },
  {
    q: 'Do you handle customs clearance in India?',
    a: 'We coordinate dispatch, shipping and import documentation. Final customs clearance in India is usually handled by a licensed customs broker (CHA), and we can align the documents with yours. Tell us how you import today and we will confirm the setup.'
  },
  {
    q: 'How do I know the supplier is genuine?',
    a: 'Our verification covers capability assessment, factory audits, financial verification and a quality system review. You get a report with the results and recommendations before you place an order.'
  }
]

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'
const brandGrad = 'bg-gradient-to-r from-[#F41703] to-[#F97316]'

/* Scroll-in animation. direction: up | left | right */
const Reveal = ({ children, delay = 0, from = 'up', className = '' }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])

  const hidden = from === 'left' ? '-translate-x-10' : from === 'right' ? 'translate-x-10' : 'translate-y-8'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? 'translate-x-0 translate-y-0 opacity-100' : `${hidden} opacity-0`
      } ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

/* Photo with a designed fallback: if the image fails, the gradient + icon still looks intentional */
const Photo = ({ src, icon, className = '' }) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-[#F41703] to-[#F97316] ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center text-white/25">{I[icon]('h-32 w-32')}</div>
      <img
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

const Eyebrow = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${dark ? 'bg-white/10 text-orange-300' : 'bg-[#F41703]/10 text-[#F41703]'}`}>
    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316]" />
    {children}
  </span>
)

const FaqItem = ({ id, q, a, open, onToggle }) => (
  <div className={`overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${open ? 'border-[#F41703]/30 shadow-xl shadow-[#F41703]/10' : 'border-orange-100 hover:border-orange-200'}`}>
    <h3>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className={`flex w-full items-center justify-between gap-4 px-7 py-6 text-left text-lg font-semibold text-gray-900 ${ring}`}>
        {q}
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${open ? `rotate-45 ${brandGrad} text-white` : 'bg-orange-50 text-[#F41703]'}`}>{I.plus('h-4 w-4')}</span>
      </button>
    </h3>
    <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
      <div className="overflow-hidden">
        <p className="px-7 pb-7 leading-relaxed text-gray-600">{a}</p>
      </div>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Hero visual: animated China to India route                         */
/* ------------------------------------------------------------------ */
const RouteVisual = () => (
  <div className="relative mx-auto w-full max-w-xl">
    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#F41703]/15 to-[#F97316]/20 blur-3xl" aria-hidden="true" />

    <svg viewBox="0 0 560 440" className="relative w-full" role="img" aria-label="Route from China to India with factory, inspection and shipping stops">
      <defs>
        <linearGradient id="indGrad" gradientUnits="userSpaceOnUse" x1="96" y1="0" x2="464" y2="0">
          <stop offset="0" stopColor="#F41703" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <filter id="indShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#F41703" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* faint grid */}
      <g stroke="#F41703" strokeOpacity="0.06">
        {[80, 160, 240, 320, 400].map((y) => (
          <line key={y} x1="0" y1={y} x2="560" y2={y} />
        ))}
        {[80, 160, 240, 320, 400, 480].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="440" />
        ))}
      </g>

      {/* route */}
      <path id="indRoute" d="M96 300 C 170 60, 390 60, 464 190" fill="none" stroke="url(#indGrad)" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 300 C 170 60, 390 60, 464 190" fill="none" stroke="url(#indGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" className="ind-dash" />

      {/* milestones */}
      {[
        { x: 206, y: 137, label: 'Inspection' },
        { x: 349, y: 107, label: 'Shipping' }
      ].map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy={m.y} r="9" fill="#fff" stroke="url(#indGrad)" strokeWidth="3" />
          <text x={m.x} y={m.y - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#374151">
            {m.label}
          </text>
        </g>
      ))}

      {/* China node */}
      <g filter="url(#indShadow)">
        <circle cx="96" cy="300" r="48" fill="#fff" stroke="url(#indGrad)" strokeWidth="3" />
      </g>
      <g transform="translate(96 300) scale(1.9) translate(-12 -12)" stroke="#F41703" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M5 20V10l7-7 7 7v10M9 20v-6h6v6" />
      </g>
      <text x="96" y="372" textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827">
        China
      </text>
      <text x="96" y="392" textAnchor="middle" fontSize="12" fill="#6B7280">
        Factory
      </text>

      {/* India node */}
      <circle cx="464" cy="190" r="48" fill="#F41703" className="ind-ring" />
      <g filter="url(#indShadow)">
        <circle cx="464" cy="190" r="48" fill="url(#indGrad)" />
      </g>
      <g transform="translate(464 190) scale(1.9) translate(-12 -12)" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
      </g>
      <text x="464" y="262" textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827">
        India
      </text>
      <text x="464" y="282" textAnchor="middle" fontSize="12" fill="#6B7280">
        Your warehouse
      </text>

      {/* moving shipments */}
      {[0, -4].map((begin) => (
        <g key={begin}>
          <circle r="11" fill="#fff" stroke="url(#indGrad)" strokeWidth="3.5" />
          <circle r="4" fill="#F41703" />
          <animateMotion dur="8s" begin={`${begin}s`} repeatCount="indefinite" rotate="auto">
            <mpath href="#indRoute" />
          </animateMotion>
        </g>
      ))}
    </svg>

    {/* floating chips */}
    <div className="ind-float absolute left-0 top-6 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-[#F41703]/10 ring-1 ring-orange-100 sm:-left-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">{I.check('h-4 w-4')}</span>
      <span className="text-sm font-semibold text-gray-800">Factory audit done</span>
    </div>
    <div className="ind-float absolute bottom-10 right-0 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-[#F41703]/10 ring-1 ring-orange-100 sm:-right-4" style={{ animationDelay: '-2s' }}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${brandGrad}`}>{I.shield('h-4 w-4')}</span>
      <span className="text-sm font-semibold text-gray-800">Inspection report ready</span>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const India = () => {
  const { t } = useTranslation()
  const [openFaq, setOpenFaq] = useState(0)
  const [checked, setChecked] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = t('countryPages.india.title')
    return () => {
      document.title = previous
    }
  }, [t])

  const toggleCheck = (i) => setChecked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  const done = checked.length
  const total = CHECKLIST.length
  const R = 54
  const C = 2 * Math.PI * R

  const readiness =
    done === 0
      ? 'Tick what you have already covered.'
      : done < total
      ? 'Good start. We can help you with the rest.'
      : "You're ready. Request your proposal."

  return (
    <div className="w-full overflow-x-hidden bg-[#FFFBF8] text-gray-900">
      <style>{`
        @keyframes ind-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes ind-dash { to { stroke-dashoffset: -28 } }
        @keyframes ind-ring { 0% { transform: scale(1); opacity: .35 } 100% { transform: scale(1.7); opacity: 0 } }
        @keyframes ind-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes ind-drift { 0%, 100% { transform: translate(0, 0) } 50% { transform: translate(40px, -24px) } }
        @keyframes ind-check { 0%, 8% { opacity: 0; transform: scale(.3) } 16%, 86% { opacity: 1; transform: scale(1) } 100% { opacity: 0; transform: scale(.3) } }
        @keyframes ind-row { 0%, 8% { background: transparent } 16%, 86% { background: rgba(34,197,94,.10) } 100% { background: transparent } }
        @keyframes ind-knob { 0%, 14% { transform: translateX(0) } 24%, 84% { transform: translateX(18px) } 94%, 100% { transform: translateX(0) } }
        @keyframes ind-track { 0%, 14% { background: #E5E7EB } 24%, 84% { background: #F41703 } 94%, 100% { background: #E5E7EB } }
        @keyframes ind-bar { 0% { width: 0 } 80%, 100% { width: 100% } }
        @keyframes ind-stop { 0%, 6% { background: #E5E7EB; transform: scale(1) } 14%, 100% { background: #F41703; transform: scale(1.15) } }
        .ind-float { animation: ind-float 5s ease-in-out infinite }
        .ind-dash { animation: ind-dash 1.2s linear infinite }
        .ind-ring { transform-box: fill-box; transform-origin: center; animation: ind-ring 2.4s ease-out infinite }
        .ind-ticker { animation: ind-ticker 45s linear infinite }
        .ind-ticker-wrap:hover .ind-ticker { animation-play-state: paused }
        .ind-drift { animation: ind-drift 14s ease-in-out infinite }
        .ind-check { animation: ind-check 7s ease-in-out infinite both }
        .ind-row { animation: ind-row 7s ease-in-out infinite both }
        .ind-knob { animation: ind-knob 6s ease-in-out infinite both }
        .ind-track { animation: ind-track 6s ease-in-out infinite both }
        .ind-bar { animation: ind-bar 7s ease-in-out infinite }
        .ind-stop { animation: ind-stop 7s ease-in-out infinite both }
        @media (prefers-reduced-motion: reduce) {
          .ind-float, .ind-dash, .ind-ring, .ind-drift, .ind-check, .ind-row, .ind-knob, .ind-track, .ind-bar, .ind-stop { animation: none }
          .ind-check { opacity: 1 }
        }
      `}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="ind-drift pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#F97316]/15 blur-3xl" aria-hidden="true" />
        <div className="ind-drift pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-[#F41703]/10 blur-3xl" style={{ animationDelay: '-7s' }} aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
              <Link to="/" className={`rounded transition-colors hover:text-[#F41703] ${ring}`}>
                Home
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="font-medium text-gray-800">{t('countryPages.india.breadcrumb')}</span>
            </nav>

            <Eyebrow>{t('countryPages.india.eyebrow')}</Eyebrow>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {t('countryPages.india.headline').split('.')[0]}.
              <span className="block bg-gradient-to-r from-[#F41703] to-[#F97316] bg-clip-text text-transparent">{t('countryPages.india.headline').split('.')[1]}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              {t('countryPages.india.description')}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to={CONTACT_PATH} className={`group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#F41703]/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#F41703]/40 ${brandGrad} ${ring}`}>
                Get a free consultation
                <span className="transition-transform group-hover:translate-x-1">{I.arrow('h-5 w-5')}</span>
              </Link>
              <Link to={SERVICES_PATH} className={`inline-flex items-center justify-center rounded-2xl border-2 border-gray-900/10 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-colors hover:border-[#F41703] hover:text-[#F41703] ${ring}`}>
                Explore services
              </Link>
            </div>

           
          </div>

          <RouteVisual />
        </div>
      </section>

      {/* ===================== TICKER (auto-scrolling) ===================== */}
      <div className={`ind-ticker-wrap overflow-hidden py-5 ${brandGrad}`} aria-label="Categories we source">
        <div className="ind-ticker flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <li key={item} className="flex items-center whitespace-nowrap text-lg font-semibold text-white">
                  <span className="px-8">{item}</span>
                  <span className="h-2 w-2 rotate-45 bg-white/60" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ============================ BENTO ============================ */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-3xl">
          <Eyebrow>Why IndoChinaBridge</Eyebrow>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">Everything between the factory and your warehouse</h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">Indian buyers often struggle with the same things: trusting a supplier, quality after payment, paperwork and visibility. We cover each one.</p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:auto-rows-[235px] lg:grid-cols-4">
          {/* A: verified factories (photo) */}
          <Reveal className="md:col-span-2 lg:row-span-2">
            <div className="group relative h-full min-h-[440px] overflow-hidden rounded-[2rem] text-white shadow-xl shadow-gray-900/10">
              <Photo src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=70" icon="factory" className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/50 to-gray-950/10" />
              <div className="relative flex h-full flex-col justify-end p-8 md:p-10">
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur">Source and verify</span>
                <h3 className="text-3xl font-bold leading-tight md:text-4xl">Factories that are checked, not just listed</h3>
                <p className="mt-3 max-w-md text-white/80">We screen manufacturers on capability, capacity, pricing and reliability before you spend a rupee on samples.</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {['Factory audits', 'Capability assessment', 'Financial verification', 'Quality system review'].map((c) => (
                    <li key={c} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* B: inspection checklist (animated) */}
          <Reveal delay={100} className="md:col-span-2">
            <div className="h-full rounded-[2rem] border border-orange-100 bg-white p-7 shadow-xl shadow-[#F41703]/5">
              <div className="mb-4 flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${brandGrad}`}>{I.shield('h-6 w-6')}</span>
                <div>
                  <h3 className="text-xl font-bold">Inspected before it ships</h3>
                  <p className="text-sm text-gray-500">Samples and finished goods, with photo reports</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {['Specifications match', 'Quantity and packing verified', 'Defects flagged, report issued'].map((t, i) => (
                  <li key={t} className="ind-row flex items-center gap-3 rounded-xl px-3 py-1.5" style={{ animationDelay: `${i * 1.1}s` }}>
                    <span className="ind-check flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white" style={{ animationDelay: `${i * 1.1}s` }}>
                      {I.check('h-3.5 w-3.5')}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* C: number */}
          <Reveal delay={150}>
            <div className={`relative h-full overflow-hidden rounded-[2rem] p-7 text-white shadow-xl shadow-[#F41703]/25 ${brandGrad}`}>
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15" aria-hidden="true" />
              <span className="relative block text-8xl font-black leading-none tracking-tighter">12</span>
              <p className="relative mt-2 text-lg font-semibold">sourcing services across 4 phases</p>
            </div>
          </Reveal>

          {/* D: pick one or all (animated toggles) */}
          <Reveal delay={200}>
            <div className="h-full rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl shadow-[#F41703]/5">
              <h3 className="mb-3 text-lg font-bold">Pick one, or all</h3>
              <ul className="space-y-2.5">
                {['Verification', 'Inspection', 'Shipping'].map((t, i) => (
                  <li key={t} className="flex items-center justify-between text-sm font-medium text-gray-700">
                    {t}
                    <span className="ind-track relative inline-block h-5 w-10 rounded-full" style={{ animationDelay: `${i * 0.9}s` }}>
                      <span className="ind-knob absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" style={{ animationDelay: `${i * 0.9}s` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* E: paperwork (dark) */}
          <Reveal delay={100} className="md:col-span-2">
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-gray-950 p-7 text-white shadow-xl shadow-gray-900/20">
              <div className="ind-drift absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F41703]/30 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white ${brandGrad}`}>{I.file('h-6 w-6')}</span>
                <h3 className="text-xl font-bold">Paperwork, lined up</h3>
                <p className="mt-1 max-w-md text-sm text-white/70">Contracts, specifications and commercial terms, plus export and import documentation, coordinated for you.</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {['Contracts', 'Specifications', 'Commercial terms', 'Export docs', 'Import docs'].map((c, i) => (
                    <li key={c} className="ind-float rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium" style={{ animationDelay: `${-i * 0.7}s` }}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* F: delivery progress (animated) */}
          <Reveal delay={200} className="md:col-span-2">
            <div className="h-full rounded-[2rem] border border-orange-100 bg-white p-7 shadow-xl shadow-[#F41703]/5">
              <div className="mb-6 flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${brandGrad}`}>{I.truck('h-6 w-6')}</span>
                <div>
                  <h3 className="text-xl font-bold">Followed all the way to delivery</h3>
                  <p className="text-sm text-gray-500">Dispatch, transport and final handover</p>
                </div>
              </div>
              <div className="relative px-2 pb-8">
                <div className="absolute left-2 right-2 top-[7px] h-1 rounded-full bg-gray-200">
                  <div className={`ind-bar h-full rounded-full ${brandGrad}`} />
                </div>
                <ol className="relative flex justify-between">
                  {['Dispatch', 'Port', 'In transit', 'Delivered'].map((s, i) => (
                    <li key={s} className="flex flex-col items-center">
                      <span className="ind-stop h-4 w-4 rounded-full ring-4 ring-white" style={{ animationDelay: `${(i / 3) * 5.6}s` }} />
                      <span className="mt-3 text-xs font-semibold text-gray-600">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ JOURNEY ========================== */}
      <section className="border-y border-orange-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <Reveal className="mx-auto mb-20 max-w-3xl text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">From first search to final delivery</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">Four phases. Use all of them, or only the ones you need.</p>
          </Reveal>

          <div className="space-y-24 md:space-y-32">
            {PHASES.map((p, i) => {
              const flip = i % 2 === 1
              return (
                <div key={p.number} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                  {/* photo */}
                  <Reveal from={flip ? 'right' : 'left'} className={flip ? 'lg:order-2' : ''}>
                    <div className="relative">
                      <div className={`absolute -inset-4 rounded-[3rem] ${brandGrad} opacity-10 blur-2xl`} aria-hidden="true" />
                      <div className="relative aspect-[4/3]">
                        <Photo src={p.photo} icon={p.icon} className="absolute inset-0 rounded-[2.5rem] shadow-2xl shadow-gray-900/15" />
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-gray-950/50 to-transparent" />
                        <span className="absolute bottom-5 left-6 text-8xl font-black leading-none tracking-tighter text-white drop-shadow-lg md:text-9xl">{p.number}</span>
                        <span className={`absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${brandGrad}`}>{I[p.icon]('h-7 w-7')}</span>
                      </div>
                    </div>
                  </Reveal>

                  {/* text */}
                  <Reveal from={flip ? 'left' : 'right'} delay={100}>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F41703]">Phase {p.number}</p>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{p.name}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-500">{p.tagline}</p>
                    <p className="mt-5 leading-relaxed text-gray-600">{p.text}</p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.services.map((s) => (
                        <li key={s} className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-[#FFF8F3] px-4 py-2 text-sm font-semibold text-gray-800">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F41703] text-white">{I.check('h-2.5 w-2.5')}</span>
                          {s}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 rounded-2xl border-l-4 border-[#F41703] bg-gradient-to-r from-[#FFF3EE] to-transparent py-4 pl-5 pr-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#F41703]">You receive</p>
                      <p className="mt-1 font-medium text-gray-800">{p.receive}</p>
                    </div>
                  </Reveal>
                </div>
              )
            })}
          </div>

          <Reveal className="mt-20 text-center">
            <Link to={SERVICES_PATH} className={`group inline-flex items-center gap-2 rounded-2xl border-2 border-[#F41703] px-8 py-3.5 font-bold text-[#F41703] transition-colors hover:bg-[#F41703] hover:text-white ${ring}`}>
              See all 12 services <span className="transition-transform group-hover:translate-x-1">{I.arrow('h-4 w-4')}</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================== IMPORT READINESS (interactive) ================ */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="ind-drift absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#F41703]/25 blur-3xl" aria-hidden="true" />
        <div className="ind-drift absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#F97316]/20 blur-3xl" style={{ animationDelay: '-7s' }} aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <Reveal>
            <Eyebrow dark>Importing into India</Eyebrow>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">Are you ready to import?</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">A quick self-check on the basics every Indian importer should plan for. Tick what you already have covered.</p>

            <div className="mt-10 flex items-center gap-7">
              <div className="relative h-36 w-36 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                  <defs>
                    <linearGradient id="indRing" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#F41703" />
                      <stop offset="1" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                  <circle cx="60" cy="60" r={R} fill="none" stroke="url(#indRing)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - done / total)} style={{ transition: 'stroke-dashoffset .7s cubic-bezier(.2,.8,.2,1)' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-4xl font-black leading-none">{done}/{total}</span>
                  <span className="mt-1 text-xs font-medium text-white/60">covered</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-white" aria-live="polite">{readiness}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={SERVICES_PATH} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white shadow-lg shadow-[#F41703]/30 ${brandGrad} focus-visible:ring-offset-gray-950 ${ring}`}>
                Request a proposal {I.arrow('h-4 w-4')}
              </Link>
              <Link to={CONTACT_PATH} className={`inline-flex items-center justify-center rounded-2xl border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:ring-offset-gray-950 ${ring}`}>
                Talk to us about the gaps
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <ul className="space-y-3">
              {CHECKLIST.map((c, i) => {
                const on = checked.includes(i)
                return (
                  <li key={c.title}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => toggleCheck(i)}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${
                        on ? 'border-[#F97316]/60 bg-white/[0.10]' : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${on ? 'scale-110 border-transparent bg-gradient-to-br from-[#F41703] to-[#F97316] text-white' : 'border-white/30 text-transparent'}`}>
                        {I.check('h-4 w-4')}
                      </span>
                      <span>
                        <span className="block font-bold text-white">{c.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-white/60">{c.hint}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-semibold text-white/60">We coordinate delivery to gateways such as</span>
              {PORTS.map((p) => (
                <span key={p} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">{p}</span>
              ))}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/40">General guidance only. Import rules, duties and certification requirements differ by product and change over time. Confirm the current requirements for your goods with your customs broker or advisor.</p>
          </Reveal>
        </div>
      </section>

      {/* ============================== FAQ ============================ */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <Reveal className="mb-12 text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">Questions Indian buyers ask</h2>
        </Reveal>
        <Reveal>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} id={`india-faq-${i}`} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </Reveal>
      </section>

   
    </div>
  )
}

export default India