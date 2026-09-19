import React, { useEffect, useRef, useState } from 'react'

/* ---------------- Icons (one per step, same stroke style used across the site) ---------------- */
const IconClipboard = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
    <path d="M9 11h6M9 15h6M9 19h3" />
  </svg>
)
const IconSearch = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.8-4.8" />
  </svg>
)
const IconQuote = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
    <path d="M15 5v4a1 1 0 001 1h4" />
    <path d="M8 13h5M8 16.5h3.5" />
  </svg>
)
const IconSample = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M10 3v5.2a2 2 0 01-.4 1.2L5.9 15a2 2 0 001.6 3.2h9a2 2 0 001.6-3.2l-3.7-5.6a2 2 0 01-.4-1.2V3" />
    <path d="M8.2 14h7.6" />
  </svg>
)
const IconShield = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3.5v5c0 4.6-3 8.7-7 9.9-4-1.2-7-5.3-7-9.9v-5L12 3z" />
    <path d="M9 12l2 2 4-4.5" />
  </svg>
)
const IconTruck = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
)

const steps = [
  { num: '01', title: 'Requirement', body: 'You tell us what you need — spec, quantity, budget, and timeline.', Icon: IconClipboard },
  { num: '02', title: 'Supplier Search', body: 'We identify and shortlist suitable suppliers and manufacturers.', Icon: IconSearch },
  { num: '03', title: 'Quotation', body: 'You compare pricing, specifications, and options side by side.', Icon: IconQuote },
  { num: '04', title: 'Sample / Verification', body: 'We verify product or machinery specs against what was agreed.', Icon: IconSample },
  { num: '05', title: 'Quality Inspection', body: 'Products are inspected before shipment wherever applicable.', Icon: IconShield },
  { num: '06', title: 'Shipping', body: 'We coordinate logistics and delivery through to your door.', Icon: IconTruck },
]

const Process = () => {
  const [activeIndexes, setActiveIndexes] = useState(() => new Set())
  const itemRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx)
            setActiveIndexes((prev) => {
              if (prev.has(idx)) return prev
              const next = new Set(prev)
              next.add(idx)
              return next
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    )

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const maxActive = activeIndexes.size ? Math.max(...activeIndexes) : -1
  const progressPct = maxActive >= 0 ? (maxActive / (steps.length - 1)) * 100 : 0

  return (
    <div>
      <section className="py-20 px-4 bg-gray-50 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[#F41703] mb-3">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Sourcing Process
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Track (static) */}
            <div className="absolute left-7 md:left-8 top-2 bottom-2 w-[3px] bg-gray-200 rounded-full" />
            {/* Progress (animated fill, grows as steps enter view) */}
            <div
              className="absolute left-7 md:left-8 top-2 w-[3px] bg-[#F41703] rounded-full transition-all duration-700 ease-out"
              style={{ height: `calc(${progressPct}% )` }}
            />

            <div className="space-y-10">
              {steps.map((step, idx) => {
                const isActive = activeIndexes.has(idx)
                const reached = idx <= maxActive
                const { Icon } = step
                return (
                  <div
                    key={step.num}
                    ref={(el) => (itemRefs.current[idx] = el)}
                    data-idx={idx}
                    className={`relative flex items-start gap-6 transition-all duration-700 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: isActive ? `${(idx % 3) * 80}ms` : '0ms' }}
                  >
                    {/* Icon node on the spine */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        reached
                          ? 'bg-[#F41703] border-[#F41703] text-white shadow-lg shadow-red-200'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7" />
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-gray-50 ${
                          reached ? 'bg-gray-900 text-white' : 'bg-white text-gray-400'
                        }`}
                      >
                        {step.num}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-300">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Flow summary strip */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {['Requirement', 'Sourcing', 'Verification', 'Quality', 'Shipping', 'Delivery'].map((label, i, arr) => (
              <React.Fragment key={label}>
                <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-1.5">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5L13 10l-5.5 5.5" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Process