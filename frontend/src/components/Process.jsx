import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
const IconFactory = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20" />
    <path d="M5 20V10l7-7 7 7v10" />
    <path d="M9 20v-6h6v6" />
  </svg>
)
const IconBox = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const Ctl = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    {children}
  </svg>
)

const steps = [
  { num: '01', titleKey: 'process.steps.requirement.title', bodyKey: 'process.steps.requirement.body', Icon: IconClipboard },
  { num: '02', titleKey: 'process.steps.supplierSearch.title', bodyKey: 'process.steps.supplierSearch.body', Icon: IconSearch },
  { num: '03', titleKey: 'process.steps.quotation.title', bodyKey: 'process.steps.quotation.body', Icon: IconQuote },
  { num: '04', titleKey: 'process.steps.sampleVerification.title', bodyKey: 'process.steps.sampleVerification.body', Icon: IconSample },
  { num: '05', titleKey: 'process.steps.production.title', bodyKey: 'process.steps.production.body', Icon: IconFactory },
  { num: '06', titleKey: 'process.steps.qualityInspection.title', bodyKey: 'process.steps.qualityInspection.body', Icon: IconShield },
  { num: '07', titleKey: 'process.steps.shipping.title', bodyKey: 'process.steps.shipping.body', Icon: IconTruck },
  { num: '08', titleKey: 'process.steps.delivery.title', bodyKey: 'process.steps.delivery.body', Icon: IconBox }
]

const TOTAL = steps.length
const STEP_MS = 4500 // how long the ship stays at each step before sailing on
const PAD = 7 // % of empty space left and right of the first and last step

/* x position (in % of the scene width) of step i */
const pos = (i) => PAD + (i * (100 - PAD * 2)) / (TOTAL - 1)

/* One period of the wave repeated 4 times; the layer is 200% wide and slides by 50%, so it loops seamlessly */
const WAVE_PATH =
  'M0 30 C100 0 200 0 300 30 S500 60 600 30 S800 0 900 30 S1100 60 1200 30 S1400 0 1500 30 S1700 60 1800 30 S2000 0 2100 30 S2300 60 2400 30 V60 H0 Z'

const Wave = ({ top, color, duration, reverse, zIndex }) => (
  <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top, zIndex }} aria-hidden="true">
    <svg
      className="prc-wave absolute left-0 top-0 h-10 w-[200%]"
      viewBox="0 0 2400 60"
      preserveAspectRatio="none"
      style={{ animation: `${reverse ? 'prc-wave-r' : 'prc-wave'} ${duration}s linear infinite` }}
    >
      <path d={WAVE_PATH} fill={color} />
    </svg>
    <div className="absolute inset-x-0 bottom-0 top-[39px]" style={{ background: color }} />
  </div>
)

/* Cargo ship in side view, loaded with brand-coloured containers */
const Ship = () => {
  const colors = ['#F41703', '#F97316', '#FFFFFF', '#DC2626', '#FB923C', '#F3F4F6']
  const tiers = [
    { y: 44, xs: [66, 92, 118, 144, 170] },
    { y: 28, xs: [66, 92, 118, 144] },
    { y: 12, xs: [92, 118] }
  ]
  let n = 0
  return (
    <svg viewBox="0 0 224 100" className="block h-full w-full overflow-visible" aria-hidden="true">
      {/* containers */}
      {tiers.map((tier) =>
        tier.xs.map((x) => {
          const c = colors[n++ % colors.length]
          const light = c === '#FFFFFF' || c === '#F3F4F6'
          return (
            <g key={`${tier.y}-${x}`}>
              <rect x={x} y={tier.y} width="24" height="16" rx="1.5" fill={c} stroke={light ? '#E5E7EB' : 'none'} />
              <path d={`M${x + 8} ${tier.y + 1}v14M${x + 16} ${tier.y + 1}v14`} stroke="rgba(0,0,0,.14)" strokeWidth="1" />
            </g>
          )
        })
      )}

      {/* bridge */}
      <rect x="18" y="28" width="36" height="32" fill="#F9FAFB" stroke="#E5E7EB" />
      <rect x="22" y="36" width="28" height="5" rx="1" fill="#1F2937" />
      <rect x="22" y="46" width="28" height="5" rx="1" fill="#1F2937" />
      <rect x="24" y="16" width="24" height="12" fill="#fff" stroke="#E5E7EB" />
      <rect x="27" y="20" width="18" height="4" rx="1" fill="#1F2937" />
      <rect x="30" y="4" width="12" height="12" fill="#F41703" />
      <rect x="30" y="8" width="12" height="3" fill="#fff" />

      {/* smoke */}
      {[0, 0.9, 1.8].map((d) => (
        <circle key={d} cx="36" cy="2" r="4" fill="#9CA3AF" className="prc-smoke" style={{ animationDelay: `${d}s` }} />
      ))}

      {/* hull */}
      <rect x="6" y="60" width="208" height="6" rx="1" fill="#4B5563" />
      <polygon points="6,66 214,66 196,96 28,96" fill="#1F2937" />
      <polygon points="22.1,88 200.8,88 196,96 28,96" fill="#F41703" />
      <text x="40" y="80" fontSize="9" fontWeight="800" fill="#fff" letterSpacing="1.2">
        IndoChinaBridge
      </text>
    </svg>
  )
}

const Process = () => {
  const { t } = useTranslation()

  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [cycle, setCycle] = useState(0) // bumped to restart the timer after any change
  const [inView, setInView] = useState(false)
  const [fade, setFade] = useState(false) // ship fades out before the voyage restarts
  const [jump, setJump] = useState(false) // moves the ship back to the start without sailing

  const sectionRef = useRef(null)
  const nodeRefs = useRef([])

  /* Start when the section scrolls into view */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Autoplay: sail to the next step; after the last one, start the voyage again.
     It keeps running until someone presses the pause button. */
  useEffect(() => {
    if (!playing || !inView) return
    let wrap
    const id = setTimeout(() => {
      if (active === TOTAL - 1) {
        setFade(true)
        wrap = setTimeout(() => {
          setJump(true)
          setActive(0)
          setFade(false)
          requestAnimationFrame(() => requestAnimationFrame(() => setJump(false)))
        }, 550)
      } else {
        setActive((a) => a + 1)
      }
    }, STEP_MS)
    return () => {
      clearTimeout(id)
      clearTimeout(wrap)
    }
  }, [active, playing, inView, cycle])

  const goTo = (i) => {
    setFade(false)
    setActive((i + TOTAL) % TOTAL)
    setCycle((c) => c + 1)
  }

  const togglePlay = () => {
    setPlaying((p) => !p)
    setCycle((c) => c + 1)
  }

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + TOTAL) % TOTAL
    goTo(next)
    nodeRefs.current[next]?.focus()
  }

  const { Icon: ActiveIcon, titleKey, bodyKey, num } = steps[active]
  const progress = (active / (TOTAL - 1)) * 100

  return (
    <div>
      <style>{`
        .prc-scene { --node: 30px; --node-top: 16px; --ship-w: 112px; --ship-top: 96px; --water: 134px; height: 200px }
        @media (min-width: 640px) {
          .prc-scene { --node: 56px; --node-top: 54px; --ship-w: 196px; --ship-top: 142px; --water: 208px; height: 316px }
        }
        .prc-node svg { width: 46%; height: 46% }

        @keyframes prc-wave { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes prc-wave-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes prc-bob { 0%, 100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-4px) rotate(1deg) } }
        @keyframes prc-smoke { 0% { opacity: 0; transform: translate(0, 0) scale(.5) } 20% { opacity: .5 } 100% { opacity: 0; transform: translate(-16px, -30px) scale(1.7) } }
        @keyframes prc-foam { 0%, 100% { opacity: .75; transform: scaleX(1) } 50% { opacity: .35; transform: scaleX(1.35) } }
        @keyframes prc-cloud { from { transform: translateX(-30vw) } to { transform: translateX(110vw) } }
        @keyframes prc-beam { to { background-position: 0 9px } }
        @keyframes prc-ping { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(1.9); opacity: 0 } }
        @keyframes prc-burst { 0% { opacity: 1; transform: rotate(var(--a)) translateY(-16px) scale(1) } 100% { opacity: 0; transform: rotate(var(--a)) translateY(-44px) scale(.3) } }
        @keyframes prc-fill { from { width: 0 } to { width: 100% } }
        @keyframes prc-swap { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        @keyframes prc-rise { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
        @keyframes prc-glow { 0%, 100% { opacity: .75; transform: scale(1) } 50% { opacity: 1; transform: scale(1.06) } }

        .prc-bob { animation: prc-bob 3.6s ease-in-out infinite; transform-origin: 50% 100% }
        .prc-smoke { animation: prc-smoke 2.7s ease-out infinite; transform-box: fill-box; transform-origin: center }
        .prc-foam { animation: prc-foam 1.8s ease-in-out infinite }
        .prc-cloud { animation: prc-cloud 70s linear infinite }
        .prc-beam { background-image: repeating-linear-gradient(to bottom, rgba(244,23,3,.65) 0 4px, transparent 4px 9px); animation: prc-beam .6s linear infinite }
        .prc-ping { animation: prc-ping 2s ease-out infinite }
        .prc-burst i { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; animation: prc-burst 1.3s ease-out infinite }
        .prc-swap { animation: prc-swap .5s cubic-bezier(.2,.8,.2,1) both }
        .prc-rise { animation: prc-rise .8s cubic-bezier(.2,.8,.2,1) both }
        .prc-glow { animation: prc-glow 5s ease-in-out infinite }

        /* Only decoration is switched off for reduced-motion; the ship keeps sailing and the steps keep advancing */
        @media (prefers-reduced-motion: reduce) {
          .prc-bob, .prc-smoke, .prc-foam, .prc-cloud, .prc-beam, .prc-ping, .prc-burst i, .prc-glow, .prc-wave, .prc-rise { animation: none !important }
        }
      `}</style>

      <section ref={sectionRef} className="overflow-hidden bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mb-10 text-center md:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F41703]/10 px-4 py-1.5 text-sm font-semibold text-[#F41703]">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316]" />
              {t('process.subtitle')}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{t('process.title')}</h2>
          </div>

          {/* ======================= The voyage ======================= */}
          <div
            className={`prc-scene relative overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-b from-white via-[#FFF9F5] to-[#FFEDE0] shadow-xl shadow-[#F41703]/5 ${inView ? 'prc-rise' : ''}`}
            onKeyDown={onKeyDown}
          >
            {/* sun */}
            <div
              className="prc-glow absolute right-[9%] z-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,.55),rgba(249,115,22,0)_68%)] sm:h-44 sm:w-44"
              style={{ top: 'calc(var(--water) - 80px)' }}
              aria-hidden="true"
            />
            <div
              className="absolute right-[12%] z-0 h-10 w-10 rounded-full bg-gradient-to-b from-[#F97316] to-[#F41703] opacity-90 sm:h-14 sm:w-14"
              style={{ top: 'calc(var(--water) - 40px)' }}
              aria-hidden="true"
            />

            {/* clouds */}
            <div className="prc-cloud absolute left-0 z-0" style={{ top: 'calc(var(--ship-top) - 38px)' }} aria-hidden="true">
              <div className="h-4 w-20 rounded-full bg-white shadow-[0_6px_18px_rgba(244,23,3,.08)] sm:h-5 sm:w-28" />
            </div>
            <div className="prc-cloud absolute left-0 z-0" style={{ top: 'calc(var(--ship-top) - 8px)', animationDelay: '-35s' }} aria-hidden="true">
              <div className="h-3 w-14 rounded-full bg-white/90 shadow-[0_6px_18px_rgba(244,23,3,.08)] sm:h-4 sm:w-20" />
            </div>

            {/* back wave (behind the ship) */}
            <Wave top="calc(var(--water) - 22px)" color="rgba(249,115,22,.22)" duration={22} zIndex={1} />

            {/* route line: grey track + brand fill up to the active step */}
            <div className="absolute z-[2] h-[3px] -translate-y-1/2 rounded-full bg-gray-200" style={{ left: `${PAD}%`, right: `${PAD}%`, top: 'calc(var(--node-top) + var(--node) / 2)' }} />
            <div className="absolute z-[2] h-[3px] -translate-y-1/2" style={{ left: `${PAD}%`, right: `${PAD}%`, top: 'calc(var(--node-top) + var(--node) / 2)' }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F41703] to-[#F97316]"
                style={{ width: `${progress}%`, transition: jump ? 'none' : 'width 1.6s cubic-bezier(.45,.05,.2,1)' }}
              />
            </div>

            {/* step labels (tablet and up) */}
            {steps.map((step, i) => (
              <span
                key={step.num}
                className={`pointer-events-none absolute top-3 z-[3] hidden max-h-8 w-[118px] -translate-x-1/2 overflow-hidden text-center text-xs font-semibold leading-tight transition-colors duration-500 sm:block ${
                  i === active ? 'text-gray-900' : i < active ? 'text-gray-500' : 'text-gray-400'
                }`}
                style={{ left: `${pos(i)}%` }}
              >
                {t(step.titleKey)}
              </span>
            ))}

            {/* step markers */}
            {steps.map((step, i) => {
              const state = i === active ? 'active' : i < active ? 'done' : 'todo'
              const { Icon } = step
              return (
                <button
                  key={step.num}
                  ref={(el) => (nodeRefs.current[i] = el)}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={state === 'active' ? 'step' : undefined}
                  aria-label={`${step.num}. ${t(step.titleKey)}`}
                  className={`prc-node absolute z-[3] flex -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703] focus-visible:ring-offset-2 ${
                    state === 'active'
                      ? 'scale-110 border-transparent bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-[0_8px_24px_rgba(244,23,3,.45)]'
                      : state === 'done'
                      ? 'border-transparent bg-gradient-to-br from-[#F41703] to-[#F97316] text-white/90'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-[#F41703]/50 hover:text-[#F41703]'
                  }`}
                  style={{ left: `${pos(i)}%`, top: 'var(--node-top)', width: 'var(--node)', height: 'var(--node)' }}
                >
                  {state === 'active' && <span className="prc-ping pointer-events-none absolute inset-0 rounded-full border-2 border-[#F97316]" />}
                  <Icon />
                  {i === TOTAL - 1 && active === TOTAL - 1 && (
                    <span className="prc-burst pointer-events-none absolute inset-0" aria-hidden="true">
                      {Array.from({ length: 10 }).map((_, k) => (
                        <i key={k} style={{ '--a': `${k * 36}deg`, background: k % 2 ? '#F97316' : '#F41703', animationDelay: `${k * 0.05}s` }} />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}

            {/* beam from the active step down to the ship */}
            <div
              className="prc-beam absolute z-[2] w-[2px] -translate-x-1/2"
              style={{
                left: `${pos(active)}%`,
                top: 'calc(var(--node-top) + var(--node))',
                height: 'calc(var(--ship-top) - var(--node-top) - var(--node))',
                opacity: fade ? 0 : 1,
                transition: jump ? 'opacity .4s' : 'left 1.6s cubic-bezier(.45,.05,.2,1), opacity .4s'
              }}
              aria-hidden="true"
            />

            {/* the ship */}
            <div
              className="absolute z-[4] -translate-x-1/2"
              style={{
                left: `${pos(active)}%`,
                top: 'var(--ship-top)',
                width: 'var(--ship-w)',
                opacity: fade ? 0 : 1,
                transition: jump ? 'opacity .4s' : 'left 1.6s cubic-bezier(.45,.05,.2,1), opacity .4s'
              }}
              aria-hidden="true"
            >
              <div className="prc-bob relative">
                <Ship />
                <span className="prc-foam absolute -left-8 bottom-[8%] h-2 w-14 rounded-full bg-white/90 blur-[1px] sm:-left-12 sm:w-20" />
                <span className="prc-foam absolute -right-1 bottom-[6%] h-1.5 w-8 rounded-full bg-white/90 blur-[1px]" style={{ animationDelay: '-.9s' }} />
              </div>
            </div>

            {/* middle and front waves (in front of the ship) */}
            <Wave top="calc(var(--water) - 12px)" color="rgba(244,23,3,.16)" duration={15} reverse zIndex={5} />
            <Wave top="calc(var(--water) - 4px)" color="rgba(244,23,3,.26)" duration={10} zIndex={6} />
          </div>

          {/* ======================= Step card ======================= */}
          <div className={`relative z-10 mx-auto -mt-6 max-w-3xl px-3 sm:px-0 ${inView ? 'prc-rise' : ''}`} style={{ animationDelay: '200ms' }}>
            <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-[#F41703]/10">
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-8" aria-live="polite">
                <div key={`i-${active}`} className="prc-swap relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-lg shadow-[#F41703]/30 sm:h-20 sm:w-20">
                  <ActiveIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-[11px] font-bold text-white">{num}</span>
                </div>

                <div key={`t-${active}`} className="prc-swap min-w-0 flex-1">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#F41703]">
                    {t('process.stepOf', { current: active + 1, total: TOTAL, defaultValue: 'Step {{current}} of {{total}}' })}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{t(titleKey)}</h3>
                  <p className="mt-1.5 leading-relaxed text-gray-600">{t(bodyKey)}</p>
                </div>

                {/* controls */}
                <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label={t('process.prev', { defaultValue: 'Previous step' })}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#F41703] hover:text-[#F41703] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703]"
                  >
                    <Ctl><path d="m15 18-6-6 6-6" /></Ctl>
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? t('process.pause', { defaultValue: 'Pause' }) : t('process.play', { defaultValue: 'Play' })}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#F41703] hover:text-[#F41703] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703]"
                  >
                    {playing ? <Ctl><path d="M8 5v14M16 5v14" strokeWidth="3" /></Ctl> : <Ctl><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></Ctl>}
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label={t('process.next', { defaultValue: 'Next step' })}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-md shadow-[#F41703]/30 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703] focus-visible:ring-offset-2"
                  >
                    <Ctl><path d="m9 18 6-6-6-6" /></Ctl>
                  </button>
                </div>
              </div>

              {/* timer bar (visual only; the timing itself runs in the effect above) */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100">
                {playing && inView && !fade && (
                  <div
                    key={`${active}-${cycle}`}
                    className="h-full bg-gradient-to-r from-[#F41703] to-[#F97316]"
                    style={{ animation: `prc-fill ${STEP_MS}ms linear forwards` }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Process