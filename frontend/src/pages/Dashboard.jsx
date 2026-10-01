import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { getUserOrders } from '../services/orderApi'
import { getUserContainers } from '../services/containerApi'
import OrderTracking from '../components/OrderTracking'
import ReportIssue from '../components/ReportIssue'

const REFRESH_MS = 30000 // silent refresh so status changes appear live

// Order journey, in sequence. Index is used for progress bars.
const ORDER_STAGES = [
  { key: 'Order Placed', short: 'Placed', bar: 'bg-slate-400', pill: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  { key: 'Under Manufacturing', short: 'Manufacturing', bar: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  { key: 'Under Inspection', short: 'Inspection', bar: 'bg-yellow-400', pill: 'bg-yellow-50 text-yellow-800', dot: 'bg-yellow-400' },
  { key: 'Under Packing', short: 'Packing', bar: 'bg-orange-400', pill: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
  { key: 'Transportation to Shipping Port/Airport', short: 'To port', bar: 'bg-purple-500', pill: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500' },
  { key: 'Under Delivery', short: 'Delivery', bar: 'bg-teal-500', pill: 'bg-teal-50 text-teal-700', dot: 'bg-teal-500' },
  { key: 'Delivered', short: 'Delivered', bar: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
]

// Container journey, in sequence. Matches Container schema statuses.
const CONTAINER_STAGES = [
  { key: 'Goods Under Stuffing', short: 'Stuffing', bar: 'bg-slate-400', pill: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  { key: 'Container Loaded', short: 'Loaded', bar: 'bg-blue-500', pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  { key: 'Under Shipment', short: 'Shipment', bar: 'bg-indigo-500', pill: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-500' },
  { key: 'Arrival Port Added', short: 'Arrival', bar: 'bg-purple-500', pill: 'bg-purple-50 text-purple-700', dot: 'bg-purple-500' },
  { key: 'Custom Clearance', short: 'Clearance', bar: 'bg-pink-500', pill: 'bg-pink-50 text-pink-700', dot: 'bg-pink-500' },
  { key: 'Under Transportation', short: 'Transport', bar: 'bg-teal-500', pill: 'bg-teal-50 text-teal-700', dot: 'bg-teal-500' },
  { key: 'Completed', short: 'Completed', bar: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
]

const orderStageIndex = (status) => {
  const i = ORDER_STAGES.findIndex((s) => s.key.toLowerCase() === String(status || '').toLowerCase())
  return i === -1 ? 0 : i
}

const containerStageIndex = (status) => {
  const i = CONTAINER_STAGES.findIndex((s) => s.key.toLowerCase() === String(status || '').toLowerCase())
  return i === -1 ? 0 : i
}

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-'

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`

/* Keyframes live here so no Tailwind config change is needed */
const styles = `
@keyframes sbBob { 0%,100% { transform: translateY(0) rotate(-1.5deg) } 50% { transform: translateY(-5px) rotate(1.5deg) } }
@keyframes sbFly { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
@keyframes sbWave { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes sbCloud { from { transform: translateX(-30%) } to { transform: translateX(520%) } }
@keyframes sbBurst { 0% { transform: translate(-50%,-50%) scale(.5); opacity: .9 } 100% { transform: translate(-50%,-50%) scale(3.2); opacity: 0 } }
@keyframes sbPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(56,189,248,.55) } 50% { box-shadow: 0 0 0 7px rgba(56,189,248,0) } }
@keyframes sbPop { from { opacity: 0; transform: translateY(-6px) scale(.95) } to { opacity: 1; transform: none } }
@keyframes sbFade { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
.sb-bob { animation: sbBob 3s ease-in-out infinite }
.sb-fly { animation: sbFly 2.2s ease-in-out infinite }
.sb-wave-1 { animation: sbWave 9s linear infinite }
.sb-wave-2 { animation: sbWave 5.5s linear infinite }
.sb-cloud { animation: sbCloud 26s linear infinite }
.sb-burst { animation: sbBurst 1.2s ease-out 2 }
.sb-pulse { animation: sbPulse 1.8s infinite }
.sb-pop { animation: sbPop .35s ease-out both }
.sb-fade { opacity: 0; animation: sbFade .5s ease-out forwards }
@media (prefers-reduced-motion: reduce) {
  .sb-bob, .sb-fly, .sb-wave-1, .sb-wave-2, .sb-cloud, .sb-burst, .sb-pulse, .sb-pop, .sb-fade { animation: none !important; opacity: 1 }
}
`

const ShipIcon = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <rect x="5" y="9.5" width="4" height="4.5" rx=".5" opacity=".95" />
    <rect x="10" y="7" width="4" height="7" rx=".5" />
    <rect x="15" y="10.5" width="4" height="3.5" rx=".5" opacity=".95" />
    <path d="M2 15h20l-3 5H5z" />
  </svg>
)

const PlaneIcon = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 24 24" className={`${className} rotate-90`} fill="currentColor" aria-hidden="true">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-1.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4.5l8 1.5z" />
  </svg>
)

const Wave = ({ className, fill }) => (
  <div className={`absolute left-0 bottom-0 w-[200%] ${className}`}>
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 block">
      <path
        d="M0 20 Q 75 0 150 20 T 300 20 T 450 20 T 600 20 T 750 20 T 900 20 T 1050 20 T 1200 20 V40 H0Z"
        fill={fill}
      />
    </svg>
  </div>
)

/* ------------------------------------------------------------------ */
/*  Shipment card: click the arrow to open the animated status panel    */
/* ------------------------------------------------------------------ */
const ShipmentCard = ({ container }) => {
  const [open, setOpen] = useState(false)
  const [sailed, setSailed] = useState(false) // drives the "ship sails in" animation each time it opens
  const [showFull, setShowFull] = useState(false)
  const [justUpdated, setJustUpdated] = useState(false)
  const prev = useRef(container.currentStatus)

  const idx = containerStageIndex(container.currentStatus)
  const stage = CONTAINER_STAGES[idx]
  const delivered = idx === CONTAINER_STAGES.length - 1
  const progress = (idx / (CONTAINER_STAGES.length - 1)) * 100

  // Adjust these field names to match your container schema
  const mode = String(container.shippingType || container.transportMode || container.mode || '')
  const isAir = /air/i.test(mode)
  const title =
    container.containerNumber || container.containerNo || `Container ${String(container._id).slice(-6).toUpperCase()}`
  const origin = container.origin || container.portOfLoading
  const destination = container.destination || container.portOfDischarge
  const eta = container.eta || container.estimatedArrival
  const Vehicle = isAir ? PlaneIcon : ShipIcon
  const panelId = `shipment-panel-${container._id}`

  useEffect(() => {
    if (!open) {
      setSailed(false)
      return
    }
    const t = setTimeout(() => setSailed(true), 180)
    return () => clearTimeout(t)
  }, [open])

  // Flash when the status changes after the first render
  useEffect(() => {
    if (prev.current !== container.currentStatus) {
      prev.current = container.currentStatus
      setJustUpdated(true)
      const t = setTimeout(() => setJustUpdated(false), 6000)
      return () => clearTimeout(t)
    }
  }, [container.currentStatus])

  const shipLeft = 6 + progress * 0.88 // keep the vehicle inside the scene

  return (
    <article
      className={`rounded-2xl border bg-white transition-all duration-300 ${
        open ? 'border-sky-300 shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Header (the whole row is the toggle) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left px-5 sm:px-6 py-4 flex items-center gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <span
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            delivered ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-sky-300'
          }`}
        >
          <Vehicle className="w-7 h-7" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold text-slate-900">{title}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${stage.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
              {container.currentStatus || stage.key}
            </span>
            {justUpdated && (
              <span className="sb-pop inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status updated
              </span>
            )}
          </span>
          <span className="block text-sm text-slate-500 mt-1">
            {origin || destination ? `${origin || 'Origin'} to ${destination || 'Destination'}` : isAir ? 'Air freight' : 'Sea freight'}
            {eta ? `  |  Arrives ${formatDate(eta)}` : ''}
          </span>
          <span className="flex gap-0.5 mt-2.5" aria-hidden="true">
            {CONTAINER_STAGES.map((s, i) => (
              <span
                key={s.key}
                className={`h-1 flex-1 max-w-[2.5rem] rounded-full transition-colors duration-700 ${i <= idx ? stage.bar : 'bg-slate-200'}`}
              />
            ))}
          </span>
        </span>

        <span
          className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            open ? 'bg-slate-900 border-slate-900 text-white rotate-180' : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Expandable panel */}
      <div
        id={panelId}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className={`px-4 sm:px-6 pb-6 pt-1 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
            {/* Scene */}
            <div
              className={`relative h-44 rounded-xl overflow-hidden ${
                isAir
                  ? 'bg-gradient-to-b from-sky-600 via-sky-500 to-sky-300'
                  : 'bg-gradient-to-b from-slate-900 via-sky-900 to-sky-800'
              }`}
            >
              {/* glow + clouds */}
              <div className="absolute top-5 right-8 w-14 h-14 rounded-full bg-amber-200/80 blur-sm shadow-[0_0_50px_14px_rgba(253,230,138,.35)]" />
              <div className="sb-cloud absolute top-8 left-0 w-20 h-5 rounded-full bg-white/20 blur-[2px]" />
              <div className="sb-cloud absolute top-16 left-0 w-28 h-6 rounded-full bg-white/15 blur-[2px]" style={{ animationDelay: '-12s' }} />

              {/* start / end markers */}
              <span className="absolute left-4 top-3 text-xs text-white/70">{origin || 'Placed'}</span>
              <span className="absolute right-4 bottom-12 text-xs text-white/70 hidden sm:block">{destination || 'Delivered'}</span>

              {/* vehicle */}
              <div
                className="absolute z-10 transition-[left] duration-[2200ms] ease-[cubic-bezier(.45,.05,.2,1)]"
                style={{ left: `${sailed ? shipLeft : 6}%`, bottom: isAir ? '3.5rem' : '1.6rem' }}
              >
                <div className="relative -translate-x-1/2">
                  {/* floating label */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-white text-slate-900 px-2.5 py-1 rounded-full shadow">
                    {stage.short}
                    <span className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45 bg-white" />
                  </span>
                  {justUpdated && (
                    <span className="sb-burst absolute left-1/2 top-1/2 w-12 h-12 rounded-full border-2 border-emerald-300" />
                  )}
                  {/* wake trail */}
                  {!delivered && sailed && (
                    <span
                      className="absolute right-full top-1/2 h-1.5 w-24 -mr-3 rounded-full bg-gradient-to-l from-white/50 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                  <div className={`${delivered || !sailed ? '' : isAir ? 'sb-fly' : 'sb-bob'} text-white drop-shadow-[0_6px_10px_rgba(0,0,0,.35)]`}>
                    <Vehicle className="w-14 h-14" />
                  </div>
                </div>
              </div>

              {/* sea */}
              {!isAir ? (
                <>
                  <Wave className="sb-wave-1 opacity-60" fill="#0ea5e9" />
                  <Wave className="sb-wave-2" fill="#0c4a6e" />
                </>
              ) : (
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/40 to-transparent" />
              )}
            </div>

            {/* Current status summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
              <div>
                <p className="text-sm text-slate-500">Current status</p>
                <p className="text-lg font-semibold text-slate-900">{container.currentStatus || stage.key}</p>
              </div>
              <p className="text-sm text-slate-500">
                Step <span className="font-semibold text-slate-900">{idx + 1}</span> of {CONTAINER_STAGES.length}
              </p>
            </div>

            {/* Step list, revealed one by one after opening */}
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mt-4">
              {CONTAINER_STAGES.map((s, i) => {
                const done = i < idx || (i === idx && delivered)
                const current = i === idx && !delivered
                return (
                  <li
                    key={s.key}
                    className={`flex lg:flex-col items-center lg:items-start gap-3 rounded-lg border px-3 py-3 transition-all duration-500 ${
                      sailed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    } ${
                      current ? 'border-sky-300 bg-sky-50' : done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'
                    }`}
                    style={{ transitionDelay: sailed ? `${300 + i * 90}ms` : '0ms' }}
                  >
                    <span
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : current
                          ? 'bg-sky-500 text-white sb-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {done ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-medium ${current ? 'text-sky-900' : done ? 'text-slate-800' : 'text-slate-400'}`}>
                        {s.short}
                      </span>
                      <span className={`block text-xs ${current ? 'text-sky-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {done ? 'Completed' : current ? 'In progress' : 'Upcoming'}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>

            {/* Your original tracking component, on demand */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => setShowFull((v) => !v)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors"
              >
                {showFull ? 'Hide full tracking details' : 'Show full tracking details'}
              </button>
            </div>
            {showFull && open && (
              <div className="mt-2 border-t border-slate-100">
                <OrderTracking container={container} />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

const Dashboard = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)

      const ordersResult = await getUserOrders()
      if (ordersResult.success) {
        setOrders(ordersResult.orders)
        setError('')
      } else if (!silent) {
        setError(ordersResult.message || 'Failed to fetch orders')
      }

      const containersResult = await getUserContainers()
      if (containersResult.success) {
        setContainers(containersResult.containers)
      }
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to fetch data')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    fetchData()
    const id = setInterval(() => fetchData(true), REFRESH_MS)
    return () => clearInterval(id)
  }, [user, fetchData])

  const stats = useMemo(() => {
    const delivered = containers.filter((c) => c.currentStatus === 'Completed').length
    const totalValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const counts = ORDER_STAGES.map((s) => orders.filter((o) => orderStageIndex(o.status) === ORDER_STAGES.indexOf(s)).length)
    return {
      delivered,
      active: containers.length - delivered,
      totalValue,
      counts,
    }
  }, [orders, containers])

  // Active shipments first, delivered ones after
  const sortedContainers = useMemo(
    () =>
      [...containers].sort(
        (a, b) => Number(a.currentStatus === 'Completed') - Number(b.currentStatus === 'Completed')
      ),
    [containers]
  )

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-slate-50">
        <div className="h-56 bg-slate-900 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-6">
          <div className="h-64 bg-white rounded-lg shadow animate-pulse" />
          <div className="h-48 bg-white rounded-lg shadow animate-pulse" />
        </div>
      </div>
    )
  }

  const summary = [
    { label: 'Total orders', value: orders.length, note: 'All time' },
    { label: 'Order value', value: formatMoney(stats.totalValue), note: 'Across all orders' },
    { label: 'Active shipments', value: stats.active, note: 'On the way to you' },
    { label: 'Delivered', value: stats.delivered, note: 'Shipments completed' },
  ]

  return (
    <div className="min-h-screen pt-15 bg-slate-50">
      <style>{styles}</style>

      {/* Hero band */}
      <div className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Welcome back, {user?.firstName || 'User'}
              </h1>
              <p className="text-slate-400 mt-2">
                {orders.length > 0
                  ? `You have ${stats.active} active shipment${stats.active === 1 ? '' : 's'} and ${orders.length} order${orders.length === 1 ? '' : 's'} in total.`
                  : 'Your orders and shipments will show up here.'}
              </p>
            </div>
          </div>

          {/* Pipeline: where all your orders are right now */}
          {orders.length > 0 && (
            <div className="mt-8">
              <p className="text-sm text-slate-400 mb-3">Orders by stage</p>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-slate-800">
                {ORDER_STAGES.map((s, i) =>
                  stats.counts[i] > 0 ? (
                    <div
                      key={s.key}
                      className={s.bar}
                      style={{ flexGrow: stats.counts[i], flexBasis: 0 }}
                      title={`${s.short}: ${stats.counts[i]}`}
                    />
                  ) : null
                )}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                {ORDER_STAGES.map((s, i) =>
                  stats.counts[i] > 0 ? (
                    <div key={s.key} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.short}
                      <span className="text-white font-medium">{stats.counts[i]}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-12">
        {/* Summary strip */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 grid grid-cols-2 lg:grid-cols-4 divide-slate-200 divide-x divide-y lg:divide-y-0">
          {summary.map((item) => (
            <div key={item.label} className="px-6 py-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1 tabular-nums">{item.value}</p>
              <p className="text-xs text-slate-400 mt-1">{item.note}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <section className="mt-8 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">My orders</h2>
            {orders.length > 0 && (
              <span className="text-sm text-slate-500">{orders.length} total</span>
            )}
          </div>

          {error ? (
            <div className="p-6">
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div>
                  <p className="font-medium">We couldn't load your orders</p>
                  <p className="text-sm mt-0.5">{error}. Refresh the page to try again.</p>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-800 font-medium">No orders yet</p>
              <p className="text-slate-500 text-sm mt-1">Orders placed with our team will appear here with live status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-3 font-medium">Order</th>
                    <th className="px-6 py-3 font-medium">Items</th>
                    <th className="px-6 py-3 font-medium text-right">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium">Progress</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const idx = orderStageIndex(order.status)
                    const stage = ORDER_STAGES[idx]
                    const items = order.items || []
                    return (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                          {items.slice(0, 2).map((item, i) => (
                            <div key={i} className="truncate">{item.productId?.productName || 'Product'}</div>
                          ))}
                          {items.length > 2 && (
                            <div className="text-xs text-slate-400 mt-0.5">+{items.length - 2} more</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-right tabular-nums">
                          {order.totalQuantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 text-right tabular-nums">
                          {formatMoney(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stage.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                            {order.status}
                          </span>
                          <div className="flex gap-0.5 mt-2" aria-hidden="true">
                            {ORDER_STAGES.map((s, i) => (
                              <span
                                key={s.key}
                                className={`h-1 w-5 rounded-full ${i <= idx ? stage.bar : 'bg-slate-200'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ReportIssue order={order} user={user} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Shipments */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">My shipments</h2>
              <p className="text-sm text-slate-500 mt-0.5">Select the arrow on a shipment to see where it is.</p>
            </div>
            {containers.length > 0 && (
              <span className="text-sm text-slate-500">
                {stats.active} active, {stats.delivered} delivered
              </span>
            )}
          </div>

          {containers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 px-6 py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShipIcon className="w-7 h-7" />
              </div>
              <p className="text-slate-800 font-medium">No shipments yet</p>
              <p className="text-slate-500 text-sm mt-1">Once your orders are loaded into a container, you can track it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContainers.map((container) => (
                <ShipmentCard key={container._id} container={container} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard