import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { AppContext } from '../context/AppContext'
import { useTranslation } from 'react-i18next'

const API_URL = import.meta.env.VITE_API_URL || 'https://sourcing-x379.onrender.com'

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */
const SERVICE_PHASES = [
  {
    id: 'source',
    number: '01',
    name: 'Source',
    tagline: 'Find and vet the right manufacturers',
    services: [
      {
        id: 'supplier-identification',
        number: '01',
        title: 'Supplier Identification',
        description: 'Find suitable manufacturers that match your requirements.',
        details: 'We identify suitable manufacturers based on your product specifications, quantity, quality requirements, target pricing and destination.',
        included: ['Manufacturer search', 'Capability matching', 'MOQ comparison', 'Price comparison', 'Initial supplier screening'],
        deliverable: 'A shortlist of potential suppliers with relevant supplier information for your evaluation.'
      },
      {
        id: 'supplier-evaluation',
        number: '02',
        title: 'Supplier Evaluation & Verification',
        description: 'Evaluate capability, experience, capacity, pricing and reliability.',
        details: 'We conduct comprehensive supplier verification including factory audits, capability assessment, financial stability review, and quality system evaluation.',
        included: ['Factory audits', 'Capability assessment', 'Financial verification', 'Quality system review', 'Reliability assessment'],
        deliverable: 'Detailed supplier evaluation report with verification results and recommendations.'
      }
    ]
  },
  {
    id: 'sample',
    number: '02',
    name: 'Sample',
    tagline: 'Test and approve before you commit',
    services: [
      {
        id: 'sample-inspection',
        number: '03',
        title: 'Sample Inspection',
        description: 'Inspect samples before production.',
        details: 'Our quality experts inspect production samples against your specifications, quality standards, and technical requirements before mass production begins.',
        included: ['Visual inspection', 'Dimensional verification', 'Material testing', 'Functionality testing', 'Documentation review'],
        deliverable: 'Sample inspection report with detailed findings and photographs.'
      },
      {
        id: 'buyer-sample-approval',
        number: '04',
        title: 'Buyer Sample Approval',
        description: 'Send the sample/evidence to the buyer for approval.',
        details: 'We coordinate the sample submission process, provide inspection evidence, and facilitate your approval decision with comprehensive documentation.',
        included: ['Sample coordination', 'Evidence documentation', 'Approval facilitation', 'Change management', 'Approval tracking'],
        deliverable: 'Sample approval documentation with inspection evidence and status.'
      }
    ]
  },
  {
    id: 'order',
    number: '03',
    name: 'Order & Production',
    tagline: 'Lock in terms and track every milestone',
    services: [
      {
        id: 'order-placement',
        number: '05',
        title: 'Order Placement',
        description: 'Coordinate purchase order placement with the approved supplier.',
        details: 'We manage the entire order placement process including PO preparation, supplier confirmation, and timeline establishment.',
        included: ['PO preparation', 'Supplier confirmation', 'Timeline establishment', 'Terms negotiation', 'Order documentation'],
        deliverable: 'Confirmed purchase order with agreed terms and delivery schedule.'
      },
      {
        id: 'contract-documentation',
        number: '06',
        title: 'Contract & Documentation',
        description: 'Coordinate contracts, specifications, commercial terms and required documentation.',
        details: 'We prepare and manage all necessary contracts, specifications, commercial terms, and export/import documentation.',
        included: ['Contract preparation', 'Specification documents', 'Commercial terms', 'Export documentation', 'Import documentation'],
        deliverable: 'Complete contract and documentation package for legal and operational use.'
      },
      {
        id: 'production-monitoring',
        number: '07',
        title: 'Production Monitoring',
        description: 'Track production progress and communicate updates.',
        details: 'We monitor production progress at key milestones, conduct regular status checks, and provide timely updates on schedule adherence.',
        included: ['Production tracking', 'Milestone monitoring', 'Status reporting', 'Issue resolution', 'Schedule management'],
        deliverable: 'Regular production status reports with milestone progress and risk alerts.'
      }
    ]
  },
  {
    id: 'quality',
    number: '04',
    name: 'Quality & Delivery',
    tagline: 'Verify, ship and receive with confidence',
    services: [
      {
        id: 'quality-inspection',
        number: '08',
        title: 'Quality Inspection',
        description: 'Check production against agreed specifications and quality requirements.',
        details: 'Comprehensive quality inspection of finished goods against specifications, quality standards, and acceptance criteria.',
        included: ['Quality inspection', 'Specification verification', 'Defect detection', 'Compliance checking', 'Inspection reporting'],
        deliverable: 'Quality inspection report with defect analysis and acceptance status.'
      },
      {
        id: 'quantity-verification',
        number: '09',
        title: 'Quantity Verification',
        description: 'Verify quantities, packing quantities and order fulfillment.',
        details: 'We verify shipment quantities, packing quantities, labeling compliance, and order fulfillment accuracy.',
        included: ['Quantity counting', 'Packing verification', 'Label checking', 'Fulfillment verification', 'Documentation check'],
        deliverable: 'Quantity verification report with packing and fulfillment details.'
      },
      {
        id: 'dispatch-coordination',
        number: '10',
        title: 'Dispatch Coordination',
        description: 'Coordinate dispatch readiness and shipping handover.',
        details: 'We coordinate dispatch preparation, shipping documentation, carrier handover, and shipment tracking initiation.',
        included: ['Dispatch preparation', 'Shipping documentation', 'Carrier coordination', 'Handover management', 'Tracking setup'],
        deliverable: 'Dispatch confirmation with shipping documentation and tracking information.'
      },
      {
        id: 'local-transportation',
        number: '11',
        title: 'Local Transportation',
        description: 'Coordinate movement of goods from supplier/factory to warehouse, consolidation point, port, etc.',
        details: 'We manage inland transportation including pickup from factory, consolidation, and delivery to port/warehouse.',
        included: ['Factory pickup', 'Consolidation', 'Inland transport', 'Port delivery', 'Warehousing coordination'],
        deliverable: 'Transportation coordination with tracking and delivery confirmation.'
      },
      {
        id: 'receiving-delivery',
        number: '12',
        title: 'Receiving & Delivery',
        description: 'Coordinate receiving and final handover.',
        details: 'We coordinate final receiving, delivery confirmation, documentation handover, and completion verification.',
        included: ['Receiving coordination', 'Delivery confirmation', 'Documentation handover', 'Completion verification', 'Issue resolution'],
        deliverable: 'Delivery confirmation with complete documentation and completion report.'
      }
    ]
  }
]

const ALL_SERVICES = SERVICE_PHASES.flatMap((phase) =>
  phase.services.map((s) => ({ ...s, phaseId: phase.id, phaseName: phase.name, phaseNumber: phase.number }))
)
const ALL_IDS = ALL_SERVICES.map((s) => s.id)

const PIPELINE = ['Supplier', 'Sample', 'Order', 'Production', 'QC', 'Dispatch', 'Delivery']

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
const Svg = ({ children, className = 'w-5 h-5', sw = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

const CheckIcon = ({ className, sw = 3 }) => (
  <Svg className={className} sw={sw}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
)
const CloseIcon = ({ className }) => (
  <Svg className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
)
const ArrowIcon = ({ className = 'w-4 h-4' }) => (
  <Svg className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <Svg className={className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

const PHASE_ICONS = {
  source: (
    <Svg className="w-6 h-6" sw={1.75}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  ),
  sample: (
    <Svg className="w-6 h-6" sw={1.75}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7M7 16h10" />
    </Svg>
  ),
  order: (
    <Svg className="w-6 h-6" sw={1.75}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
    </Svg>
  ),
  quality: (
    <Svg className="w-6 h-6" sw={1.75}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/* Shared styles                                                      */
/* ------------------------------------------------------------------ */
const ring =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'
const brandGrad = 'bg-gradient-to-r from-[#F41703] to-[#F97316]'
const inputCls =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#F41703] focus:ring-4 focus:ring-[#F41703]/10'

const Field = ({ label, required, as = 'input', className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-[#F41703]"> *</span>}
    </span>
    {as === 'textarea' ? (
      <textarea required={required} className={inputCls} {...props} />
    ) : (
      <input required={required} className={inputCls} {...props} />
    )}
  </label>
)

/* ------------------------------------------------------------------ */
/* Service card                                                       */
/* ------------------------------------------------------------------ */
const ServiceCard = ({ service, selected, onToggle, onOpen, wide, t }) => (
  <article
    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 motion-reduce:transition-none ${
      selected
        ? 'border-[#F41703] bg-gradient-to-br from-[#FFF8F5] to-white shadow-xl shadow-[#F41703]/15 ring-2 ring-[#F41703]/20'
        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:-translate-y-2 hover:border-[#F41703]/30 hover:shadow-2xl hover:shadow-gray-900/10 motion-reduce:hover:translate-y-0'
    } ${wide ? 'md:col-span-2' : ''}`}
  >
    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
    </div>

    {/* Top accent line */}
    <div className={`h-1 w-full transition-all duration-300 ${
      selected ? 'bg-gradient-to-r from-[#F41703] to-[#F97316]' : 'bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-[#F41703]/50 group-hover:to-[#F97316]/50'
    }`} />

    <div className="relative p-6">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold tracking-tight transition-all duration-300 ${
              selected
                ? `${brandGrad} text-white shadow-lg shadow-[#F41703]/30 scale-110`
                : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 group-hover:from-[#F41703]/10 group-hover:to-[#F97316]/10 group-hover:text-[#F41703] group-hover:scale-105'
            }`}
          >
            {service.number}
          </span>
          {/* Glow effect for selected state */}
          {selected && (
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F41703] to-[#F97316] rounded-2xl blur opacity-30 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-xl font-bold leading-snug text-gray-900 group-hover:text-[#F41703] transition-colors">
            {t(`services.service.${service.id}.title`)}
          </h3>
          <p className="leading-relaxed text-gray-600 text-sm">
            {t(`services.service.${service.id}.description`)}
          </p>
        </div>
        {selected && (
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F41703] text-white shadow-lg shadow-[#F41703]/30">
            <CheckIcon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100/50 pt-5">
        <button
          type="button"
          onClick={() => onOpen(service)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            selected
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'text-gray-700 hover:text-[#F41703] hover:bg-[#F41703]/5'
          } ${ring}`}
        >
          {t('services.viewDetails')}
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(service.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-sm ${ring} ${
            selected
              ? 'bg-gradient-to-r from-[#F41703] to-[#F97316] text-white hover:from-[#d31302] hover:to-[#e86a15] hover:shadow-lg hover:shadow-[#F41703]/30'
              : 'border-2 border-[#F41703]/30 text-[#F41703] hover:border-[#F41703] hover:bg-[#F41703] hover:text-white hover:shadow-md hover:shadow-[#F41703]/20'
          }`}
        >
          {selected ? (
            <>
              <CheckIcon className="h-4 w-4" /> {t('services.added')}
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" /> {t('services.add')}
            </>
          )}
        </button>
      </div>
    </div>
  </article>
)

/* ------------------------------------------------------------------ */
/* Detail modal                                                       */
/* ------------------------------------------------------------------ */
const DetailModal = ({ service, selected, onToggle, onClose, t }) => (
  <div
    className="svc-fade fixed inset-0 z-50 flex items-end justify-center bg-gray-950/60 backdrop-blur-sm sm:items-center sm:p-4"
    onClick={onClose}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(`services.service.${service.id}.title`)}
      onClick={(e) => e.stopPropagation()}
      className="svc-pop flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
    >
      {/* Header */}
      <div className={`relative overflow-hidden ${brandGrad} px-6 pb-7 pt-6 text-white sm:px-8`}>
        <span
          className="pointer-events-none absolute -right-4 -top-8 select-none text-[9rem] font-black leading-none text-white/10"
          aria-hidden="true"
        >
          {service.number}
        </span>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              {t('services.phases.source.name')} {service.phaseNumber} · {t(`services.phases.${service.phaseId}.name`)}
            </span>
            <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{t(`services.service.${service.id}.title`)}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
        <section>
          <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#F41703]">What we do</h4>
          <p className="leading-relaxed text-gray-700">{t(`services.service.${service.id}.details`)}</p>
        </section>

        <section>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#F41703]">What's included</h4>
          <ul className="grid gap-3 sm:grid-cols-2">
            {service.included.map((item, index) => (
              <li key={index} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#F41703]/15 bg-gradient-to-br from-[#FFF3EE] to-white p-5">
          <h4 className="mb-1.5 text-sm font-bold uppercase tracking-wider text-[#F41703]">You receive</h4>
          <p className="leading-relaxed text-gray-800">{t(`services.service.${service.id}.deliverable`)}</p>
        </section>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
        <button
          onClick={onClose}
          className={`rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 ${ring}`}
        >
          Close
        </button>
        <button
          onClick={() => {
            onToggle(service.id)
            onClose()
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all ${ring} ${
            selected
              ? 'bg-green-600 shadow-green-600/25 hover:bg-green-700'
              : `${brandGrad} shadow-[#F41703]/30 hover:shadow-xl hover:shadow-[#F41703]/40`
          }`}
        >
          {selected ? (
            <>
              <CheckIcon className="h-5 w-5" /> {t('services.serviceSelected')}
            </>
          ) : (
            t('services.selectThisService')
          )}
        </button>
      </div>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Request modal                                                      */
/* ------------------------------------------------------------------ */
const RequestModal = ({ selectedIds, user, loading, submitted, error, onRemove, onSubmit, onClose, onDone, t }) => (
  <div
    className="svc-fade fixed inset-0 z-50 flex items-end justify-center bg-gray-950/60 backdrop-blur-sm sm:items-center sm:p-4"
    onClick={submitted ? undefined : onClose}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('services.submitRequest')}
      onClick={(e) => e.stopPropagation()}
      className="svc-pop flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
    >
      {submitted ? (
        <div className="px-8 py-16 text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${brandGrad} text-white shadow-xl shadow-[#F41703]/30`}>
            <CheckIcon className="h-10 w-10" />
          </div>
          <h3 className="mb-3 text-3xl font-bold text-gray-900">Request submitted</h3>
          <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-600">
            Your sourcing request has been submitted successfully! Our team will contact you shortly.
          </p>
          <button
            onClick={onDone}
            className={`rounded-xl px-10 py-3 font-bold text-white shadow-lg shadow-[#F41703]/30 ${brandGrad} ${ring}`}
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={`relative overflow-hidden ${brandGrad} px-6 py-6 text-white sm:px-8`}>
            <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">{t('services.submitRequest')}</h3>
                <p className="mt-1 text-white/90">{t('services.subtitle')}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
              {/* Selected services */}
              <section>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#F41703]">
                  Selected services
                  <span className="rounded-full bg-[#F41703]/10 px-2 py-0.5 text-xs">{selectedIds.length}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id) => {
                    const s = ALL_SERVICES.find((x) => x.id === id)
                    if (!s) return null
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-1.5 text-sm font-medium text-gray-800"
                      >
                        {s.title}
                        <button
                          type="button"
                          onClick={() => onRemove(id)}
                          aria-label={`Remove ${s.title}`}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#F41703] hover:text-white"
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#F41703]">Your requirements</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Product / Category"
                    required
                    name="productCategory"
                    placeholder="e.g., Industrial Equipment, Textiles, Electronics"
                    className="sm:col-span-2"
                  />
                  <Field
                    label="Product Specifications"
                    as="textarea"
                    rows={3}
                    name="productSpecifications"
                    placeholder="Describe your product requirements..."
                    className="sm:col-span-2"
                  />
                  <Field label="Quantity" required name="quantity" placeholder="e.g., 500 units" />
                  <Field label="Target Price" name="targetPrice" placeholder="e.g., $50 per unit" />
                  <Field label="Destination Country" required name="destinationCountry" placeholder="e.g., UAE, India, USA" />
                  <Field label="Required Delivery Date" type="date" name="requiredDeliveryDate" />
                </div>
              </section>

              {/* Contact */}
              <section>
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#F41703]">Contact information</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company Name" name="companyName" placeholder="Your company name" />
                  <Field
                    label="Your Name"
                    required
                    name="name"
                    defaultValue={user?.name || ''}
                    placeholder="Your full name"
                  />
                  <Field
                    label="Email"
                    required
                    type="email"
                    name="email"
                    defaultValue={user?.email || ''}
                    placeholder="your@email.com"
                  />
                  <Field
                    label="WhatsApp / Phone"
                    required
                    name="phone"
                    defaultValue={user?.phone || ''}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </section>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:flex-1 ${ring}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg shadow-[#F41703]/30 transition-all hover:shadow-xl hover:shadow-[#F41703]/40 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-[2] ${brandGrad} ${ring}`}
              >
                {loading ? t('services.sending') : t('services.submitRequest')}
                {!loading && <ArrowIcon />}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const Services = () => {
  const { user } = useAuth()
  const { openSignup } = React.useContext(AppContext)
  const { t } = useTranslation()

  const [selectedServices, setSelectedServices] = useState([])
  const [activeService, setActiveService] = useState(null) // detail modal
  const [showRequest, setShowRequest] = useState(false) // request form modal
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const allSelected = selectedServices.length === ALL_SERVICES.length
  const isSelected = (id) => selectedServices.includes(id)

  const toggleService = (id) =>
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const toggleSelectAll = () => setSelectedServices(allSelected ? [] : ALL_IDS)

  const togglePhase = (phase) => {
    const ids = phase.services.map((s) => s.id)
    const all = ids.every((id) => selectedServices.includes(id))
    setSelectedServices((prev) =>
      all ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))
    )
  }

  const phaseCount = (phase) => phase.services.filter((s) => selectedServices.includes(s.id)).length

  const openRequest = () => {
    if (!user) {
      openSignup()
    } else {
      setSubmitError('')
      setShowRequest(true)
    }
  }

  const closeRequest = () => {
    setShowRequest(false)
    setSubmitError('')
  }

  const finishRequest = () => {
    setShowRequest(false)
    setSubmitted(false)
    setSelectedServices([])
  }

  const handleSubmitRequest = async (formData) => {
    setLoading(true)
    setSubmitError('')
    try {
      const response = await fetch(`${API_URL}/api/sourcing-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selectedServices,
          source: 'Website - Services Page'
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
      } else {
        setSubmitError('Failed to submit request: ' + (data.message || 'Please try again.'))
      }
    } catch (error) {
      console.error('Failed to submit request:', error)
      setSubmitError('Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Close the form if the visitor removes every service from it
  useEffect(() => {
    if (showRequest && !submitted && selectedServices.length === 0) setShowRequest(false)
  }, [showRequest, submitted, selectedServices.length])

  // Lock page scroll while a modal is open
  const modalOpen = Boolean(activeService) || showRequest
  useEffect(() => {
    if (!modalOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [modalOpen])

  // Escape closes the top-most modal
  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (activeService) setActiveService(null)
      else if (!submitted && !loading) closeRequest()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, activeService, submitted, loading])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <style>{`
        @keyframes svc-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes svc-pop { from { opacity: 0; transform: translateY(18px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes svc-rise { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
        .svc-fade { animation: svc-fade .2s ease both }
        .svc-pop { animation: svc-pop .28s cubic-bezier(.2,.8,.2,1) both }
        .svc-rise { animation: svc-rise .35s cubic-bezier(.2,.8,.2,1) both }
        @media (prefers-reduced-motion: reduce) { .svc-fade, .svc-pop, .svc-rise { animation: none } }
      `}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative w-full h-[340px] sm:h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&h=800&fit=crop"
          alt="International sourcing and supply chain operations"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/25 to-[#F41703]/60" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F97316]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 h-full flex flex-col justify-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur w-fit">
            <span className="h-2 w-2 rounded-full bg-[#F97316]" />
            {t('services.subtitle')}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('services.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* ===================== PHASE OVERVIEW STRIP ==================== */}
      <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_PHASES.map((phase) => {
            const count = phaseCount(phase)
            const total = phase.services.length
            return (
              <li key={phase.id}>
                <a
                  href={`#phase-${phase.id}`}
                  className={`group block h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-lg shadow-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0 ${ring}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${brandGrad}`}>
                      {PHASE_ICONS[phase.id]}
                    </span>
                    <h3 className="flex-1 text-center text-lg font-bold text-gray-900">{phase.name}</h3>
                    <span className="text-3xl font-black text-gray-200 transition-colors group-hover:text-[#F41703]/30">
                      {phase.number}
                    </span>
                  </div>
                  <p className="mt-3 text-center text-sm text-gray-500">
                    {total} service{total !== 1 ? 's' : ''}
                    {count > 0 && <span className="font-semibold text-[#F41703]"> · {count} selected</span>}
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${brandGrad}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ===================== COMPLETE SOURCING ===================== */}
        <section
          id="complete"
          className="relative scroll-mt-6 overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-2xl sm:p-12"
        >
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] opacity-30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#F97316]/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                Full-service option
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Complete Sourcing Management</h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/75">
                Let IndoChina Bridge manage your sourcing journey from supplier identification to final receiving.
              </p>

              <ul className="mt-6 flex flex-wrap items-center gap-y-2 text-sm font-medium">
                {PIPELINE.map((step, i) => (
                  <li key={step} className="flex items-center">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-white/90">{step}</span>
                    {i < PIPELINE.length - 1 && <ArrowIcon className="mx-1.5 h-4 w-4 text-[#F97316]" />}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={toggleSelectAll}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 ${
                allSelected
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white text-[#F41703] hover:bg-gray-100'
              }`}
            >
              {allSelected ? (
                <>
                  <CheckIcon className="h-5 w-5" /> Complete service selected
                </>
              ) : (
                <>
                  Select complete service <ArrowIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* ===================== INDIVIDUAL SERVICES ==================== */}
        <div id="services" className="scroll-mt-6">
          <div className="my-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Or build your own package</p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-lg text-gray-600">
              <span className="font-bold text-gray-900">{ALL_SERVICES.length}</span> services available
              {selectedServices.length > 0 && (
                <span className="text-[#F41703]"> · {selectedServices.length} selected</span>
              )}
            </p>
            <button
              onClick={toggleSelectAll}
              className={`rounded-xl border-2 border-[#F41703] px-6 py-2.5 font-semibold text-[#F41703] transition-colors hover:bg-[#F41703] hover:text-white ${ring}`}
            >
              {allSelected ? 'Deselect All Services' : 'Select All Services'}
            </button>
          </div>

          {SERVICE_PHASES.map((phase, phaseIndex) => {
            const count = phase.services.length
            const phaseAll = phaseCount(phase) === count
            const gridCols = count === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
            const oddLast = count % 2 === 1 && count !== 3

            return (
              <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-6">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <span className="bg-gradient-to-br from-[#F41703] to-[#F97316] bg-clip-text text-5xl font-black leading-none text-transparent sm:text-6xl">
                      {phase.number}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('services.phases.source.name')}</p>
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{t(`services.phases.${phase.id}.name`)}</h2>
                      <p className="mt-0.5 text-gray-500">{t(`services.phases.${phase.id}.tagline`)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePhase(phase)}
                    className={`rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#F41703] hover:text-[#F41703] ${ring}`}
                  >
                    {phaseAll ? t('services.added') : t('services.add')}
                  </button>
                </div>

                <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
                  {phase.services.map((service, i) => (
                    <ServiceCard
                      key={service.id}
                      service={{ ...service, phaseId: phase.id, phaseName: phase.name, phaseNumber: phase.number }}
                      selected={isSelected(service.id)}
                      onToggle={toggleService}
                      onOpen={setActiveService}
                      wide={oddLast && i === count - 1}
                      t={t}
                    />
                  ))}
                </div>

                {phaseIndex < SERVICE_PHASES.length - 1 && (
                  <div className="flex justify-center py-10" aria-hidden="true">
                    <div className="h-14 border-l-2 border-dashed border-[#F41703]/30" />
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {/* Spacer for floating bar */}
        <div className="h-28" />
      </div>

      {/* ===================== FLOATING SELECTION BAR ==================== */}
      {selectedServices.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6">
          <div className="svc-rise pointer-events-auto mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl bg-gray-950 p-4 text-white shadow-2xl shadow-gray-900/40 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0 sm:w-64">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{selectedServices.length}</span>
                <span className="text-white/60">of {ALL_SERVICES.length} services selected</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${brandGrad}`}
                  style={{ width: `${(selectedServices.length / ALL_SERVICES.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedServices([])}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Clear
              </button>
              <button
                onClick={openRequest}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg shadow-[#F41703]/40 transition-all hover:shadow-xl hover:shadow-[#F41703]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none ${brandGrad}`}
              >
                Request a Sourcing Proposal <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================= MODALS ========================= */}
      {activeService && (
        <DetailModal
          service={activeService}
          selected={isSelected(activeService.id)}
          onToggle={toggleService}
          onClose={() => setActiveService(null)}
          t={t}
        />
      )}

      {showRequest && (
        <RequestModal
          selectedIds={selectedServices}
          user={user}
          loading={loading}
          submitted={submitted}
          error={submitError}
          onRemove={toggleService}
          onClose={closeRequest}
          onDone={finishRequest}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmitRequest(Object.fromEntries(new FormData(e.target)))
          }}
          t={t}
        />
      )}
    </div>
  )
}

export default Services