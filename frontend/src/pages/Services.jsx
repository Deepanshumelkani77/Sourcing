import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const SERVICES_HERO_IMAGE = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=800&fit=crop'

const ChevronDivider = () => (
  <svg
    className="w-4 h-4 text-white/50"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7.5 4.5L13 10l-5.5 5.5" />
  </svg>
)

/* ------------------------------------------------------------------ */
/* Icons (inline SVG, no extra dependency)                            */
/* ------------------------------------------------------------------ */
const Icon = ({ children, className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

const icons = {
  machinery: (
    <Icon>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  product: (
    <Icon>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Icon>
  ),
  supplier: (
    <Icon>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  ),
  quality: (
    <Icon>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  ),
  logistics: (
    <Icon>
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
      <path d="M12 10v4" />
      <path d="M12 2v3" />
    </Icon>
  ),
  endtoend: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  )
}

const Check = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
)

const Arrow = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 10a1 1 0 0 1 1-1h9.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L13.6 11H4a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const Services = () => {
  const { t } = useTranslation()

  const services = [
    {
      id: 'machinery',
      titleKey: 'whatWeDo.machinerySourcing.title',
      bodyKey: 'whatWeDo.machinerySourcing.body'
    },
    {
      id: 'product',
      titleKey: 'whatWeDo.productSourcing.title',
      bodyKey: 'whatWeDo.productSourcing.body'
    },
    {
      id: 'supplier',
      titleKey: 'whatWeDo.supplierIdentification.title',
      bodyKey: 'whatWeDo.supplierIdentification.body'
    },
    {
      id: 'quality',
      titleKey: 'whatWeDo.qualityInspection.title',
      bodyKey: 'whatWeDo.qualityInspection.body'
    },
    {
      id: 'logistics',
      titleKey: 'whatWeDo.logisticsShipping.title',
      bodyKey: 'whatWeDo.logisticsShipping.body'
    }
  ]

  const featured = {
    id: 'endtoend',
    titleKey: 'whatWeDo.endToEndSourcing.title',
    bodyKey: 'whatWeDo.endToEndSourcing.body'
  }

  // New copy uses defaultValue, so the page works before you add the keys.
  const highlights = [
    t('whatWeDo.highlights.factory', { defaultValue: 'Factory-direct suppliers' }),
    t('whatWeDo.highlights.inspection', { defaultValue: 'Inspection before shipping' }),
    t('whatWeDo.highlights.delivery', { defaultValue: 'Door-to-door delivery' })
  ]

  const steps = [
    {
      title: t('whatWeDo.process.brief.title', { defaultValue: 'Share your requirements' }),
      body: t('whatWeDo.process.brief.body', {
        defaultValue: 'Send us the product or machine, quantity, target price and destination.'
      })
    },
    {
      title: t('whatWeDo.process.shortlist.title', { defaultValue: 'Review verified suppliers' }),
      body: t('whatWeDo.process.shortlist.body', {
        defaultValue: 'We shortlist suppliers, compare quotes and arrange samples.'
      })
    },
    {
      title: t('whatWeDo.process.inspect.title', { defaultValue: 'Approve and inspect' }),
      body: t('whatWeDo.process.inspect.body', {
        defaultValue: 'You approve the sample. We inspect production before anything ships.'
      })
    },
    {
      title: t('whatWeDo.process.ship.title', { defaultValue: 'Receive your goods' }),
      body: t('whatWeDo.process.ship.body', {
        defaultValue: 'We handle freight and customs so the order arrives at your door.'
      })
    }
  ]

  const focusRing =
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'

  return (
    <div className="w-full bg-white text-gray-900">
      {/* ============================ HERO ============================ */}
      <div className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src={SERVICES_HERO_IMAGE}
          alt="Business logistics and sourcing operations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, rgba(120,12,3,0.32), rgba(120,12,3,0.35))`,
          }}
        />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <span>{t('nav.home', { defaultValue: 'Home' })}</span>
            <ChevronDivider />
            <span className="text-white font-medium">{t('nav.services', { defaultValue: 'Services' })}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white max-w-xl leading-tight">
            {t('services.hero.title', { defaultValue: 'Our Services' })}
          </h1>
          <p className="text-white/85 text-base sm:text-lg mt-4 max-w-xl leading-relaxed">
            {t('services.hero.subtitle', { defaultValue: 'Comprehensive sourcing solutions tailored to your business needs from China to India' })}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className={`group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F41703] to-[#F97316] text-white px-7 py-3.5 rounded-lg font-semibold shadow-lg shadow-[#F41703]/30 hover:shadow-xl hover:shadow-[#F41703]/40 transition-shadow ${focusRing}`}
            >
              {t('whatWeDo.cta.primary', { defaultValue: 'Get a free consultation' })}
              <Arrow />
            </Link>
            <a
              href="#services"
              className={`inline-flex items-center justify-center border border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors ${focusRing}`}
            >
              {t('whatWeDo.cta.explore', { defaultValue: 'Explore our services' })}
            </a>
          </div>
        </div>
      </div>

      {/* Highlights bar, overlaps the hero */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <ul className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl shadow-xl border border-gray-100 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {highlights.map((text) => (
            <li key={text} className="flex items-center gap-3 px-6 py-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F41703]/10 text-[#F41703] flex items-center justify-center">
                <Check />
              </span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* =========================== SERVICES ========================== */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 scroll-mt-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {t('whatWeDo.sectionTitle', { defaultValue: 'Everything between your idea and your warehouse' })}
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            {t('whatWeDo.sectionSubtitle', {
              defaultValue: 'Use one service on its own, or let us run the whole process.'
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-2xl hover:shadow-gray-900/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Brand accent line, revealed on hover */}
              <span
                className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#F41703] to-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F41703] to-[#F97316] text-white flex items-center justify-center mb-6 shadow-md shadow-[#F41703]/25">
                {icons[service.id]}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(service.titleKey)}</h3>
              <p className="text-gray-600 leading-relaxed flex-1">{t(service.bodyKey)}</p>

              <Link
                to={`/contact?service=${service.id}`}
                className={`mt-6 inline-flex items-center gap-2 text-[#F41703] font-semibold text-sm rounded ${focusRing}`}
              >
                <span className="group">
                  {t('whatWeDo.learnMore', { defaultValue: 'Ask about this service' })}
                </span>
                <Arrow />
              </Link>
            </article>
          ))}

          {/* Featured card: the full-service option */}
          <article className="relative flex flex-col rounded-2xl p-8 overflow-hidden bg-gray-950 text-white md:col-span-2 lg:col-span-1">
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] opacity-30 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col h-full">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F41703] to-[#F97316] text-white flex items-center justify-center mb-6">
                {icons[featured.id]}
              </div>
              <h3 className="text-xl font-bold mb-3">{t(featured.titleKey)}</h3>
              <p className="text-white/75 leading-relaxed flex-1">{t(featured.bodyKey)}</p>
              <Link
                to="/contact"
                className={`group mt-6 inline-flex items-center justify-center gap-2 bg-white text-[#F41703] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors ${focusRing} focus-visible:ring-offset-gray-950`}
              >
                {t('whatWeDo.cta.quote', { defaultValue: 'Request a quote' })}
                <Arrow />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ============================ PROCESS ========================== */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {t('whatWeDo.process.title', { defaultValue: 'How an order works' })}
            </h2>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              {t('whatWeDo.process.subtitle', {
                defaultValue: 'Four steps, with clear updates at each one.'
              })}
            </p>
          </div>

          <ol className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Connector line (desktop only) */}
            <div
              className="hidden lg:block absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-[#F41703]/40 via-[#F97316]/40 to-[#F41703]/10"
              aria-hidden="true"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-[#F41703] text-[#F41703] font-bold text-lg flex items-center justify-center mb-5">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== CTA ============================ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F41703] to-[#F97316]">
        <div
          className="absolute -left-20 -bottom-24 w-80 h-80 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10"
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {t('whatWeDo.cta.title', { defaultValue: 'Ready to start your sourcing journey?' })}
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('whatWeDo.cta.body', {
              defaultValue:
                "Tell us what you need made, and we'll come back with suppliers, samples, and a real landed cost."
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className={`group inline-flex items-center justify-center gap-2 bg-white text-[#F41703] px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg focus-visible:ring-offset-[#F41703] ${focusRing}`}
            >
              {t('whatWeDo.cta.primary', { defaultValue: 'Get a free consultation' })}
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services