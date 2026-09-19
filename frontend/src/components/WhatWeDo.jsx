import React, { useEffect, useRef, useState } from 'react'

/* ---------------- Icons (same stroke style used across the site) ---------------- */
const IconFactory = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21V11l5 3.5V11l5 3.5V11l5 3.5V21H3z" />
    <path d="M7 8V5M11 8V4M15 8V6" />
    <path d="M3 21h18" />
  </svg>
)
const IconPackage = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M4.5 7.5L12 12l7.5-4.5M12 12v9" />
  </svg>
)
const IconTarget = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <circle cx="11" cy="11" r="3" />
    <path d="M20 20l-3.2-3.2" />
  </svg>
)
const IconShieldCheck = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3.5v5c0 4.6-3 8.7-7 9.9-4-1.2-7-5.3-7-9.9v-5L12 3z" />
    <path d="M9 12l2 2 4-4.5" />
  </svg>
)
const IconShip = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 16l1.5 4.2a2 2 0 001.9 1.3h11.2a2 2 0 001.9-1.3L21 16" />
    <path d="M5 16l1-8h12l1 8" />
    <path d="M9 8V4h6v4" />
    <path d="M3 16h18" />
  </svg>
)
const IconLink = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 14.5l5-5" />
    <path d="M8 16.5l-1.8 1.8a3.5 3.5 0 01-5-5L3 11.5a3.5 3.5 0 015-5" />
    <path d="M16 7.5l1.8-1.8a3.5 3.5 0 015 5L21 12.5a3.5 3.5 0 01-5 5" />
  </svg>
)

const services = [
  { Icon: IconFactory, title: 'Machinery Sourcing', body: 'Industrial machinery, manufacturing equipment and specialized machines.' },
  { Icon: IconPackage, title: 'Product Sourcing', body: 'Source products according to your specifications, quantity and budget.' },
  { Icon: IconTarget, title: 'Supplier Identification', body: 'Find and evaluate suitable manufacturers and suppliers.' },
  { Icon: IconShieldCheck, title: 'Quality Inspection', body: 'Quality checks and inspection carried out before shipment.' },
  { Icon: IconShip, title: 'Logistics & Shipping', body: 'Coordinate transportation from China to your destination.' },
  { Icon: IconLink, title: 'End-to-End Sourcing', body: 'From requirement to supplier, production, inspection and shipping.' },
]

const WhatWeDo = () => {
  const [visible, setVisible] = useState(() => new Set())
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx)
            setVisible((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-[#F41703] mb-3">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ Icon, title, body }, idx) => {
              const isVisible = visible.has(idx)
              return (
                <div
                  key={title}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  data-idx={idx}
                  className={`group relative bg-white p-7 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-red-100 transition-all duration-300 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: isVisible ? `${(idx % 3) * 90}ms` : '0ms' }}
                >
                  <div className="w-[52px] h-[52px] rounded-lg bg-red-50 text-[#F41703] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#F41703] group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{body}</p>

                  <span className="absolute bottom-0 left-7 right-7 h-[2px] bg-[#F41703] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default WhatWeDo