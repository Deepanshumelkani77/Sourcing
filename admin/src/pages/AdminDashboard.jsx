import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllContainers } from '../services/containerApi'
import { getAllUsers } from '../services/userApi'
import { getAllOrders } from '../services/orderApi'
import { getIssues } from '../services/issueApi'
import { getReviews } from '../services/reviewApi'
import api from '../config/axios'

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
const Svg = ({ children, className = 'h-5 w-5', sw = 1.9 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)

const ICONS = {
  containers: (c) => (
    <Svg className={c}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </Svg>
  ),
  orders: (c) => (
    <Svg className={c}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </Svg>
  ),
  customers: (c) => (
    <Svg className={c}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  ),
  leads: (c) => (
    <Svg className={c}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  ),
  issues: (c) => (
    <Svg className={c}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </Svg>
  ),
  reviews: (c) => (
    <Svg className={c}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  ),
  refresh: (c) => (
    <Svg className={c}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5" />
    </Svg>
  ),
  search: (c) => (
    <Svg className={c}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  ),
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
  inbox: (c) => (
    <Svg className={c} sw={1.6}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </Svg>
  ),
  bars: (c) => (
    <Svg className={c}>
      <path d="M12 20V10M18 20V4M6 20v-4" />
    </Svg>
  ),
  funnel: (c) => (
    <Svg className={c}>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </Svg>
  ),
  bell: (c) => (
    <Svg className={c}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const TONES = {
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-gray-100 text-gray-700 ring-gray-500/20'
}

const Pill = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${TONES[tone]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children}
  </span>
)

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A')
const fmtMoney = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(n) || 0)
const shortId = (id) => (id ? `#${String(id).slice(-6)}` : 'N/A')

const getCustomerName = (item) => {
  // Try different possible field names for customer name
  if (item.customerName) return item.customerName
  if (item.customer?.firstName || item.customer?.lastName) {
    return `${item.customer?.firstName || ''} ${item.customer?.lastName || ''}`.trim()
  }
  if (item.userId?.firstName || item.userId?.lastName) {
    return `${item.userId?.firstName || ''} ${item.userId?.lastName || ''}`.trim()
  }
  if (item.firstName || item.lastName) {
    return `${item.firstName || ''} ${item.lastName || ''}`.trim()
  }
  if (item.name) return item.name
  return 'N/A'
}

const initials = (name) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?'

const Avatar = ({ name }) => (
  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] text-xs font-bold text-white">{initials(name)}</span>
)

const uniqueCustomers = (container) => new Set((container.goods || []).map((g) => String(g.userId?._id || g.userId || '')).filter(Boolean)).size

const Stars = ({ rating = 0 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

/* ------------------------------------------------------------------ */
/* View configuration: data source, filters and table columns          */
/* ------------------------------------------------------------------ */
const asArray = (v) => (Array.isArray(v) ? v : [])

const LOADERS = {
  containers: async (params) => {
    const r = await getAllContainers(params)
    if (r?.success) return r.containers || []
    throw new Error(r?.message || 'Could not load containers')
  },
  customers: async (params) => {
    const r = await getAllUsers(params)
    if (r?.success) return r.users || []
    throw new Error(r?.message || 'Could not load customers')
  },
  orders: async (params) => {
    const r = await getAllOrders(params)
    if (r?.success) return r.orders || []
    throw new Error(r?.message || 'Could not load orders')
  },
  leads: async (params) => {
    const r = await api.get('/api/crm/leads', { params })
    // the leads endpoint can answer with { data: { data: [] } } or { data: [] }
    if (r?.data?.data) return asArray(r.data.data)
    if (r?.data) return asArray(r.data)
    throw new Error('Could not load leads')
  },
  issues: async (params) => {
    const r = await getIssues(params)
    if (r?.success) return r.issues || []
    throw new Error(r?.message || 'Could not load complaints')
  },
  reviews: async (params) => {
    const r = await getReviews(params)
    if (r?.success) return r.reviews || []
    throw new Error(r?.message || 'Could not load reviews')
  }
}

const CONTAINER_TONE = (s) => (s === 'Completed' ? 'green' : s === 'Goods Under Stuffing' ? 'yellow' : 'orange')
const ORDER_TONE = (s) => (s === 'completed' ? 'green' : s === 'processing' ? 'blue' : 'yellow')
const LEAD_TONE = (s) => ({ New: 'blue', Contacted: 'yellow', Qualified: 'purple', Converted: 'green' }[s] || 'red')
const PRIORITY_TONE = (p) => (p === 'High' ? 'red' : p === 'Medium' ? 'yellow' : 'gray')
const ISSUE_TONE = (s) => ({ Pending: 'yellow', 'In Review': 'blue', Resolved: 'green' }[s] || 'gray')
const REVIEW_TONE = (s) => (s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'yellow')

const VIEWS = [
  {
    id: 'containers',
    label: 'Containers',
    route: '/containers',
    rowRoute: (r) => `/containers/${r._id}`,
    empty: 'No containers found',
    filters: [
      { value: 'all', label: 'All', test: () => true },
      { value: 'active', label: 'Active', test: (c) => c.currentStatus !== 'Completed' },
      { value: 'delivered', label: 'Delivered', test: (c) => c.currentStatus === 'Completed' },
      { value: 'stuffing', label: 'Under Stuffing', test: (c) => c.currentStatus === 'Goods Under Stuffing' }
    ],
    search: (c) => `${c.containerNumber} ${c.destination} ${c.currentStatus}`,
    columns: [
      { header: 'Container No.', cell: (c) => <span className="font-semibold text-gray-900">{c.containerNumber}</span> },
      { header: 'Destination', cell: (c) => c.destination || 'N/A' },
      { header: 'Customers', cell: (c) => uniqueCustomers(c) },
      { header: 'Status', cell: (c) => <Pill tone={CONTAINER_TONE(c.currentStatus)}>{c.currentStatus}</Pill> },
      { header: 'ETA', cell: (c) => (c.eta ? fmtDate(c.eta) : 'TBD') }
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    route: '/orders',
    rowRoute: (r) => `/orders/${r._id}`,
    empty: 'No orders found',
    filters: [
      { value: 'all', label: 'All', test: () => true },
      { value: 'pending', label: 'Pending', test: (o) => o.status === 'pending' },
      { value: 'processing', label: 'Processing', test: (o) => o.status === 'processing' },
      { value: 'completed', label: 'Completed', test: (o) => o.status === 'completed' }
    ],
    search: (o) => `${o._id} ${getCustomerName(o)} ${o.status}`,
    columns: [
      { header: 'Order ID', cell: (o) => <span className="font-semibold text-gray-900">{shortId(o._id)}</span> },
      { header: 'Customer', cell: (o) => getCustomerName(o) },
      { header: 'Status', cell: (o) => <Pill tone={ORDER_TONE(o.status)}>{o.status || 'pending'}</Pill> },
      { header: 'Total', cell: (o) => <span className="font-medium text-gray-900">{fmtMoney(o.totalAmount)}</span> },
      { header: 'Date', cell: (o) => fmtDate(o.createdAt) }
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    route: '/customers',
    rowRoute: (r) => `/customers/${r._id}`,
    empty: 'No customers found',
    filters: null,
    search: (c) => `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.company}`,
    columns: [
      {
        header: 'Name',
        cell: (c) => (
          <div className="flex items-center gap-3">
            <Avatar name={`${c.firstName || ''} ${c.lastName || ''}`.trim()} />
            <span className="font-semibold text-gray-900">
              {c.firstName} {c.lastName}
            </span>
          </div>
        )
      },
      { header: 'Email', cell: (c) => c.email },
      { header: 'Phone', cell: (c) => c.phone || 'N/A' },
      { header: 'Company', cell: (c) => c.company || 'N/A' },
      { header: 'Joined', cell: (c) => fmtDate(c.createdAt) }
    ]
  },
  {
    id: 'leads',
    label: 'Leads',
    route: '/crm/leads',
    rowRoute: (r) => `/crm/leads/${r._id}`,
    empty: 'No leads found',
    filters: [
      { value: 'all', label: 'All', test: () => true },
      { value: 'new', label: 'New', test: (l) => l.status === 'New' },
      { value: 'contacted', label: 'Contacted', test: (l) => l.status === 'Contacted' },
      { value: 'qualified', label: 'Qualified', test: (l) => l.status === 'Qualified' },
      { value: 'converted', label: 'Converted', test: (l) => l.status === 'Converted' },
      { value: 'lost', label: 'Lost', test: (l) => l.status === 'Lost' }
    ],
    search: (l) => `${l._id} ${l.customerName} ${l.companyName} ${l.status} ${l.priority}`,
    columns: [
      { header: 'Lead ID', cell: (l) => <span className="font-semibold text-gray-900">{shortId(l._id)}</span> },
      { header: 'Customer', cell: (l) => l.customerName || 'N/A' },
      { header: 'Company', cell: (l) => l.companyName || 'N/A' },
      { header: 'Status', cell: (l) => <Pill tone={LEAD_TONE(l.status)}>{l.status || 'New'}</Pill> },
      { header: 'Priority', cell: (l) => <Pill tone={PRIORITY_TONE(l.priority)}>{l.priority || 'Medium'}</Pill> },
      { header: 'Date', cell: (l) => fmtDate(l.createdAt) }
    ]
  },
  {
    id: 'issues',
    label: 'Customer Complaints',
    route: '/issues',
    rowRoute: (r) => `/issues/${r._id}`,
    empty: 'No complaints found',
    filters: [
      { value: 'all', label: 'All', test: () => true },
      { value: 'pending', label: 'Pending', test: (i) => i.status === 'Pending' },
      { value: 'in-review', label: 'In Review', test: (i) => i.status === 'In Review' },
      { value: 'resolved', label: 'Resolved', test: (i) => i.status === 'Resolved' },
      { value: 'closed', label: 'Closed', test: (i) => i.status === 'Closed' }
    ],
    search: (i) => `${i._id} ${getCustomerName(i)} ${i.type} ${i.status}`,
    columns: [
      { header: 'Issue ID', cell: (i) => <span className="font-semibold text-gray-900">{shortId(i._id)}</span> },
      { header: 'Customer', cell: (i) => getCustomerName(i) },
      { header: 'Type', cell: (i) => i.type || 'N/A' },
      { header: 'Status', cell: (i) => <Pill tone={ISSUE_TONE(i.status)}>{i.status || 'Pending'}</Pill> },
      { header: 'Date', cell: (i) => fmtDate(i.createdAt) }
    ]
  },
  {
    id: 'reviews',
    label: 'Reviews',
    route: '/reviews',
    rowRoute: (r) => `/reviews/${r._id}`,
    empty: 'No reviews found',
    filters: [
      { value: 'all', label: 'All', test: () => true },
      { value: 'pending', label: 'Pending', test: (r) => r.status === 'pending' },
      { value: 'approved', label: 'Approved', test: (r) => r.status === 'approved' },
      { value: 'rejected', label: 'Rejected', test: (r) => r.status === 'rejected' }
    ],
    search: (r) => `${r._id} ${getCustomerName(r)} ${r.status} ${r.rating}`,
    columns: [
      { header: 'Review ID', cell: (r) => <span className="font-semibold text-gray-900">{shortId(r._id)}</span> },
      { header: 'Customer', cell: (r) => getCustomerName(r) },
      { header: 'Rating', cell: (r) => <Stars rating={r.rating || 0} /> },
      { header: 'Status', cell: (r) => <Pill tone={REVIEW_TONE(r.status)}>{r.status || 'pending'}</Pill> },
      { header: 'Date', cell: (r) => fmtDate(r.createdAt) }
    ]
  }
]

const VIEW_BY_ID = Object.fromEntries(VIEWS.map((v) => [v.id, v]))
const STORAGE_KEY = 'adminDashboardViews'
const FILTERS_KEY = 'adminDashboardFilters'
const PAGE = 10

const readSavedViews = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    const valid = asArray(saved).filter((id) => VIEW_BY_ID[id])
    return valid.length ? valid : ['containers']
  } catch (e) {
    return ['containers']
  }
}

const readSavedFilters = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(FILTERS_KEY) || 'null')
    return saved || { year: '', month: '' }
  } catch (e) {
    return { year: '', month: '' }
  }
}

const initialMap = (value) => Object.fromEntries(VIEWS.map((v) => [v.id, value]))

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                    */
/* ------------------------------------------------------------------ */
const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'

const SkeletonRows = ({ cols }) =>
  [...Array(5)].map((_, r) => (
    <tr key={r} className="animate-pulse">
      {[...Array(cols)].map((__, c) => (
        <td key={c} className="px-6 py-4">
          <div className="h-4 rounded bg-gray-200" style={{ width: `${60 + ((r + c) % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  ))

const Panel = ({ icon, title, subtitle, children, className = '' }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F41703]/10 to-[#F97316]/15 text-[#F41703]">{ICONS[icon]('h-5 w-5')}</span>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
)

const Bar = ({ label, value, max, tone = 'from-[#F41703] to-[#F97316]', suffix }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-bold text-gray-900">
        {value}
        {suffix && <span className="ml-1 text-xs font-medium text-gray-500">{suffix}</span>}
      </span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full bg-gradient-to-r ${tone} transition-all duration-700`} style={{ width: `${max ? Math.max(value ? 4 : 0, (value / max) * 100) : 0}%` }} />
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* One table section                                                  */
/* ------------------------------------------------------------------ */
const ViewSection = ({ view, rows, loading, error, filter, onFilter, search, limit, onMore, onRetry, onOpenAll, onOpenRow }) => {
  const filters = useMemo(() => (view.filters ? view.filters.map((f) => ({ ...f, count: rows.filter(f.test).length })) : null), [view, rows])
  const active = filters ? filters.find((f) => f.value === filter) || filters[0] : null

  const filtered = useMemo(() => {
    let list = active ? rows.filter(active.test) : rows
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((r) => view.search(r).toLowerCase().includes(q))
    return list
  }, [rows, active, search, view])

  const shown = filtered.slice(0, limit)
  const firstLoad = loading && rows.length === 0

  return (
    <section id={`section-${view.id}`} className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-md shadow-[#F41703]/25">{ICONS[view.id]('h-5 w-5')}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{view.label}</h2>
            <p className="text-xs text-gray-500">
              {rows.length} total{loading && rows.length > 0 ? ' · updating...' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters && (
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-gray-100 p-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFilter(f.value)}
                  aria-pressed={active.value === f.value}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${ring} ${
                    active.value === f.value ? 'bg-white text-[#F41703] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${active.value === f.value ? 'bg-[#F41703]/10 text-[#F41703]' : 'bg-gray-200 text-gray-600'}`}>{f.count}</span>
                </button>
              ))}
            </div>
          )}
          <button onClick={onOpenAll} className={`inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#F41703] hover:text-[#F41703] ${ring}`}>
            View All {ICONS.arrow('h-3.5 w-3.5')}
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">{ICONS.issues('h-6 w-6')}</span>
          <p className="font-semibold text-gray-900">Could not load {view.label.toLowerCase()}</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button onClick={onRetry} className={`mt-4 rounded-lg bg-[#F41703] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d10f02] ${ring}`}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50/80">
                <tr>
                  {view.columns.map((col) => (
                    <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {firstLoad && <SkeletonRows cols={view.columns.length} />}
                {!firstLoad &&
                  shown.map((row) => (
                    <tr
                      key={row._id}
                      className="group transition-colors hover:bg-gray-50"
                    >
                      {view.columns.map((col, i) => (
                        <td key={col.header} className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            {col.cell(row)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                {!firstLoad && shown.length === 0 && (
                  <tr>
                    <td colSpan={view.columns.length} className="px-6 py-14 text-center">
                      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">{ICONS.inbox('h-6 w-6')}</span>
                      <p className="font-semibold text-gray-700">{search.trim() ? 'No results match your search' : view.empty}</p>
                      {(search.trim() || (active && active.value !== 'all')) && <p className="mt-1 text-sm text-gray-500">Try another filter or clear the search.</p>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!firstLoad && filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-3 text-sm text-gray-500">
              <span>
                Showing <b className="text-gray-800">{shown.length}</b> of <b className="text-gray-800">{filtered.length}</b>
              </span>
              {filtered.length > shown.length && (
                <button onClick={onMore} className={`rounded-lg px-3 py-1.5 font-semibold text-[#F41703] hover:bg-[#F41703]/10 ${ring}`}>
                  Show {Math.min(PAGE, filtered.length - shown.length)} more
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
/* ------------------------------------------------------------------ */
const AdminDashboard = () => {
  const navigate = useNavigate()

  const [selectedViews, setSelectedViews] = useState(readSavedViews)
  const [data, setData] = useState(() => initialMap([]))
  const [loadingMap, setLoadingMap] = useState(() => initialMap(true))
  const [errorMap, setErrorMap] = useState(() => initialMap(''))
  const [filters, setFilters] = useState(() => initialMap('all'))
  const [limits, setLimits] = useState(() => initialMap(PAGE))
  const savedFilters = readSavedFilters()
  const [yearFilter, setYearFilter] = useState(savedFilters.year)
  const [monthFilter, setMonthFilter] = useState(savedFilters.month)
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const yearRef = useRef(yearFilter)
  const monthRef = useRef(monthFilter)
  yearRef.current = yearFilter
  monthRef.current = monthFilter
  const requestIds = useRef({})
  const mounted = useRef(false)

  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  /* Each view loads on its own, so one slow or failing request never blocks the rest */
  const loadView = useCallback(async (id) => {
    const reqId = (requestIds.current[id] || 0) + 1
    requestIds.current[id] = reqId
    setLoadingMap((m) => ({ ...m, [id]: true }))
    setErrorMap((m) => ({ ...m, [id]: '' }))
    try {
      const params = {}
      if (yearRef.current) params.year = yearRef.current
      if (monthRef.current) params.month = monthRef.current
      const rows = await LOADERS[id](Object.keys(params).length > 0 ? params : undefined)
      if (requestIds.current[id] !== reqId) return
      setData((d) => ({ ...d, [id]: rows }))
      setLastUpdated(new Date())
    } catch (err) {
      console.error(`Error fetching ${id}:`, err)
      if (requestIds.current[id] === reqId) setErrorMap((m) => ({ ...m, [id]: err?.response?.data?.message || err?.message || 'Please try again.' }))
    } finally {
      if (requestIds.current[id] === reqId) setLoadingMap((m) => ({ ...m, [id]: false }))
    }
  }, [])

  const loadAll = useCallback(() => {
    VIEWS.forEach((v) => loadView(v.id))
  }, [loadView])

  useEffect(() => {
    loadAll()
    mounted.current = true
  }, [loadAll])

  // year and month filter affects all views
  useEffect(() => {
    if (mounted.current) loadAll()
  }, [yearFilter, monthFilter, loadAll])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedViews))
    } catch (e) {
      /* ignore */
    }
  }, [selectedViews])

  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify({ year: yearFilter, month: monthFilter }))
    } catch (e) {
      /* ignore */
    }
  }, [yearFilter, monthFilter])

  const toggleView = (id) =>
    setSelectedViews((prev) => {
      if (prev.includes(id)) return prev.length === 1 ? prev : prev.filter((x) => x !== id)
      return [...prev, id]
    })

  const jumpTo = (id, filterValue) => {
    const view = VIEWS.find((v) => v.id === id)
    if (!view) return

    // Build query parameters for the page
    const params = new URLSearchParams()
    if (filterValue) params.append('filter', filterValue)
    if (yearFilter) params.append('year', yearFilter)
    if (monthFilter) params.append('month', monthFilter)

    const queryString = params.toString()
    const url = queryString ? `${view.route}?${queryString}` : view.route

    navigate(url)
  }

  /* ---------- numbers for the cards and insights ---------- */
  const stats = useMemo(() => {
    const { containers, orders, customers, leads, issues, reviews } = data
    const now = new Date()
    const newCustomers = customers.filter((c) => {
      if (!c.createdAt) return false
      const d = new Date(c.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const openIssues = issues.filter((i) => i.status === 'Pending' || i.status === 'In Review').length
    const pendingReviews = reviews.filter((r) => r.status === 'pending').length
    const newLeads = leads.filter((l) => l.status === 'New').length
    const stuffing = containers.filter((c) => c.currentStatus === 'Goods Under Stuffing').length

    const containerStatus = Object.entries(
      containers.reduce((acc, c) => {
        const s = c.currentStatus || 'Unknown'
        acc[s] = (acc[s] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])

    const funnel = ['New', 'Contacted', 'Qualified', 'Converted'].map((s) => [s, leads.filter((l) => l.status === s).length])
    const converted = funnel[3][1]

    return {
      kpi: {
        containers: { value: containers.length, sub: `${containers.filter((c) => c.currentStatus !== 'Completed').length} active` },
        orders: { value: orders.length, sub: `${pendingOrders} pending` },
        customers: { value: customers.length, sub: `${newCustomers} new this month` },
        leads: { value: leads.length, sub: `${newLeads} new` },
        issues: { value: issues.length, sub: `${openIssues} open` },
        reviews: { value: reviews.length, sub: `${pendingReviews} to approve` }
      },
      attention: [
        { id: 'orders', filter: 'pending', label: 'Pending orders', count: pendingOrders, icon: 'orders' },
        { id: 'issues', filter: 'pending', label: 'Complaints waiting', count: data.issues.filter((i) => i.status === 'Pending').length, icon: 'issues' },
        { id: 'reviews', filter: 'pending', label: 'Reviews to approve', count: pendingReviews, icon: 'reviews' },
        { id: 'leads', filter: 'new', label: 'New leads to contact', count: newLeads, icon: 'leads' },
        { id: 'containers', filter: 'stuffing', label: 'Containers under stuffing', count: stuffing, icon: 'containers' }
      ],
      containerStatus,
      funnel,
      conversion: leads.length ? Math.round((converted / leads.length) * 100) : 0
    }
  }, [data])

  const anyLoading = Object.values(loadingMap).some(Boolean)
  const firstLoadOf = (id) => loadingMap[id] && data[id].length === 0
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const statusTone = (s) => (s === 'Completed' ? 'from-green-500 to-emerald-400' : s === 'Goods Under Stuffing' ? 'from-amber-500 to-yellow-400' : 'from-[#F41703] to-[#F97316]')
  const funnelTone = ['from-blue-500 to-sky-400', 'from-amber-500 to-yellow-400', 'from-purple-500 to-fuchsia-400', 'from-green-500 to-emerald-400']

  return (
    <div className="space-y-8">
      {/* ===================== Header ===================== */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{today}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening across IndoChinaBridge.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span className="hidden sm:inline">Filter by</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#F41703]"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#F41703]"
            >
              <option value="">All Years</option>
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </label>

          <button onClick={loadAll} disabled={anyLoading} className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F41703] to-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#F41703]/25 transition-all hover:shadow-lg disabled:opacity-70 ${ring}`}>
            <span className={anyLoading ? 'animate-spin' : ''}>{ICONS.refresh('h-4 w-4')}</span>
            {anyLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      {lastUpdated && <p className="-mt-5 text-xs text-gray-400">Last updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}

      

      {/* ===================== Insights ===================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel icon="bell" title="Needs attention" subtitle="Click an item to view details">
          <ul className="space-y-2">
            {stats.attention.map((a) => (
              <li key={a.label}>
                <button
                  onClick={() => jumpTo(a.id, a.filter)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${ring}`}
                >
                  <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${a.count > 0 ? 'bg-[#F41703]/10 text-[#F41703]' : 'bg-green-50 text-green-600'}`}>
                    {a.count > 0 ? ICONS[a.icon]('h-5 w-5') : ICONS.check('h-4 w-4')}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{a.label}</span>
                  {loadingMap[a.id] && data[a.id].length === 0 ? (
                    <span className="h-5 w-8 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <span className={`min-w-[2rem] rounded-full px-2.5 py-0.5 text-center text-sm font-bold ${a.count > 0 ? 'bg-[#F41703] text-white' : 'bg-green-100 text-green-700'}`}>{a.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel icon="bars" title="Container status" subtitle={
          yearFilter && monthFilter
            ? `${monthNames[monthFilter]} ${yearFilter}`
            : yearFilter
            ? `Year ${yearFilter}`
            : monthFilter
            ? monthNames[monthFilter]
            : 'All time'
        }>
          {firstLoadOf('containers') ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : stats.containerStatus.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No containers to show</p>
          ) : (
            <div className="space-y-4">
              {stats.containerStatus.slice(0, 5).map(([status, count]) => (
                <Bar key={status} label={status} value={count} max={stats.containerStatus[0][1]} tone={statusTone(status)} />
              ))}
            </div>
          )}
        </Panel>

        <Panel icon="funnel" title="Lead pipeline" subtitle={`${stats.conversion}% converted`}>
          {firstLoadOf('leads') ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : data.leads.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No leads yet</p>
          ) : (
            <div className="space-y-4">
              {stats.funnel.map(([stage, count], i) => (
                <Bar key={stage} label={stage} value={count} max={Math.max(...stats.funnel.map((f) => f[1]), 1)} tone={funnelTone[i]} />
              ))}
            </div>
          )}
        </Panel>
      </div>


{/* ===================== KPI cards (also the view selector) ===================== */}
      <div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {VIEWS.map((view) => {
            const on = selectedViews.includes(view.id)
            const k = stats.kpi[view.id]
            return (
              <button
                key={view.id}
                onClick={() => toggleView(view.id)}
                aria-pressed={on}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${ring} ${
                  on
                    ? 'border-[#F41703] bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-xl shadow-[#F41703]/25'
                    : 'border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:border-[#F41703]/30 hover:shadow-lg hover:shadow-[#F41703]/10'
                }`}
              >
                {/* Decorative background pattern */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-all ${on ? 'bg-white' : 'bg-[#F41703] group-hover:opacity-20'}`} />
                <div className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full opacity-5 transition-all ${on ? 'bg-white' : 'bg-[#F97316] group-hover:opacity-10'}`} />

                <div className="relative flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all shadow-lg ${
                    on
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 group-hover:from-[#F41703]/10 group-hover:to-[#F97316]/10 group-hover:text-[#F41703]'
                  }`}>
                    {ICONS[view.id]('h-6 w-6')}
                  </span>
                  {on && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white shadow-lg">
                      {ICONS.check('h-4 w-4')}
                    </span>
                  )}
                </div>
                <p className={`relative mt-4 text-sm font-semibold ${on ? 'text-white/90' : 'text-gray-500'}`}>{view.label}</p>
                {firstLoadOf(view.id) ? (
                  <div className="relative mt-2 h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
                ) : errorMap[view.id] && data[view.id].length === 0 ? (
                  <p className="relative mt-2 text-sm font-semibold text-red-600">Failed to load</p>
                ) : (
                  <>
                    <p className={`relative mt-1 text-3xl font-extrabold tracking-tight ${on ? 'text-white' : 'text-gray-900'}`}>{k.value}</p>
                    <p className={`relative mt-1 text-xs font-medium ${on ? 'text-white/80' : 'text-gray-500'}`}>{k.sub}</p>
                  </>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">Click a card to show or hide its table. Your choice is remembered.</p>
      </div>

      {/* ===================== Search + tables ===================== */}
      <div className="space-y-6">
      

        {VIEWS.filter((v) => selectedViews.includes(v.id)).map((view) => (
          <ViewSection
            key={view.id}
            view={view}
            rows={data[view.id]}
            loading={loadingMap[view.id]}
            error={errorMap[view.id]}
            filter={filters[view.id]}
            onFilter={(value) => {
              setFilters((f) => ({ ...f, [view.id]: value }))
              setLimits((l) => ({ ...l, [view.id]: PAGE }))
            }}
            search={search}
            limit={limits[view.id]}
            onMore={() => setLimits((l) => ({ ...l, [view.id]: l[view.id] + PAGE }))}
            onRetry={() => loadView(view.id)}
            onOpenAll={() => navigate(view.route)}
            onOpenRow={(path) => navigate(path)}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard