import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import api from '../config/axios'
import { getAllOrders } from '../services/orderApi'
import { uploadDocument } from '../services/uploadApi'
import {
  getAllAgreements,
  getAgreementStats,
  getAgreementById,
  createAgreement,
  updateAgreement,
  updateAgreementStatus,
  sendAgreement,
  signAgreement,
  deleteAgreement,
  downloadAgreementPdf
} from '../services/agreementApi'

/* ================================================================== */
/* Constants                                                          */
/* ================================================================== */
const STATUSES = [
  { id: 'draft', label: 'Draft', pill: 'bg-gray-100 text-gray-700 ring-gray-500/20', dot: '#6B7280' },
  { id: 'pending_review', label: 'Pending Review', pill: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: '#D97706' },
  { id: 'sent', label: 'Sent', pill: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: '#2563EB' },
  { id: 'viewed', label: 'Viewed', pill: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', dot: '#4F46E5' },
  { id: 'signed', label: 'Signed', pill: 'bg-green-50 text-green-700 ring-green-600/20', dot: '#059669' },
  { id: 'rejected', label: 'Rejected', pill: 'bg-red-50 text-red-700 ring-red-600/20', dot: '#DC2626' },
  { id: 'expired', label: 'Expired', pill: 'bg-orange-50 text-orange-700 ring-orange-600/20', dot: '#EA580C' },
  { id: 'cancelled', label: 'Cancelled', pill: 'bg-gray-100 text-gray-600 ring-gray-500/20', dot: '#9CA3AF' }
]
const meta = (id) => STATUSES.find((s) => s.id === id) || { id, label: id, pill: 'bg-gray-100 text-gray-700 ring-gray-500/20', dot: '#6B7280' }

const CURRENCIES = ['USD', 'CNY', 'INR']
const SHIPPING_TERMS = ['FOB', 'CIF', 'EXW', 'CFR', 'CPT', 'CIP', 'DAP', 'DDP', 'FCA', 'Other']
const PAYMENT_METHODS = ['Bank Transfer', 'Letter of Credit (LC)', 'Telegraphic Transfer (TT)', 'Cash in Advance', 'Other']

const EDITABLE = ['draft', 'pending_review', 'sent']
const NOT_SENDABLE = ['signed', 'cancelled', 'rejected', 'expired']
const NOT_SIGNABLE = ['signed', 'cancelled']
const DELETABLE = ['draft', 'cancelled']
const OPEN_STATUSES = ['draft', 'pending_review', 'sent', 'viewed']
const PROGRESS_STEPS = ['draft', 'pending_review', 'sent', 'viewed', 'signed']
const NEEDS_CONFIRM = ['rejected', 'cancelled', 'expired']

const emptyProduct = { productName: '', description: '', quantity: 1, unitPrice: 0 }

const emptyForm = () => ({
  customer: '',
  order: '',
  agreementDate: new Date().toISOString().split('T')[0],
  validUntil: '',
  customerName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  customerCompany: '',
  companyType: '',
  registrationNo: '',
  customerAddress: '',
  customerEmail: '',
  mobileNumber: '',
  alternateMobile: '',
  whatsappNo: '',
  pinCode: '',
  city: '',
  state: '',
  country: '',
  products: [{ ...emptyProduct }],
  currency: 'USD',
  sourcingServiceCharges: 0,
  supplierDetails: 'Nest N Best',
  qualityInspectionTerms: '',
  sampleApprovalTerms: '',
  packagingRequirements: '',
  deliveryTimeline: '',
  shippingTerms: '',
  customsDutyResponsibility: '',
  advancePayment: 0,
  remainingPayment: 0,
  paymentMilestones: '',
  paymentMethod: '',
  refundPolicy: '',
  icbResponsibilities: '',
  customerResponsibilities: '',
  deliveryDelayConditions: '',
  disputeResolution: '',
  confidentiality: '',
  terminationConditions: ''
})

const PAGE_SORTS = {
  newest: { label: 'Newest first', fn: (a, b) => new Date(b.agreementDate || b.createdAt || 0) - new Date(a.agreementDate || a.createdAt || 0) },
  amount: { label: 'Highest amount', fn: (a, b) => (b.totalAmount || 0) - (a.totalAmount || 0) },
  customer: { label: 'Customer A to Z', fn: (a, b) => String(a.customerName || a.customer?.customerName || '').localeCompare(String(b.customerName || b.customer?.customerName || '')) },
  expiry: { label: 'Expiring soonest', fn: (a, b) => (a.validUntil ? new Date(a.validUntil) : Infinity) - (b.validUntil ? new Date(b.validUntil) : Infinity) }
}

/* ================================================================== */
/* Helpers                                                            */
/* ================================================================== */
const toDateInput = (d) => (d ? String(d).split('T')[0] : '')
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '')
const fmtMoney = (n, cur = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0)
  } catch (e) {
    return `${cur} ${Number(n || 0).toFixed(2)}`
  }
}
const dayDiff = (dateStr) => {
  const [y, m, d] = toDateInput(dateStr).split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((target - now) / 86400000)
}
const initials = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?'
const customerOf = (a) => a.customerName || a.customer?.customerName || '—'
const companyOf = (a) => a.customerCompany || a.customer?.companyName || ''

/* How long is the agreement still valid? Only for agreements that are still open. */
const validityOf = (a) => {
  if (a.status === 'signed') return { text: a.signedAt ? `Signed ${fmtDate(a.signedAt)}` : 'Signed', tone: 'text-green-700' }
  if (!OPEN_STATUSES.includes(a.status) || !a.validUntil) return null
  const d = dayDiff(a.validUntil)
  if (d < 0) return { text: `Validity ended ${Math.abs(d)}d ago`, tone: 'text-red-600 font-semibold' }
  if (d === 0) return { text: 'Valid until today', tone: 'text-amber-700 font-semibold' }
  if (d <= 7) return { text: `Expires in ${d} day${d === 1 ? '' : 's'}`, tone: 'text-amber-700 font-semibold' }
  return { text: `Valid until ${fmtDate(a.validUntil)}`, tone: 'text-gray-500' }
}

const calcTotals = (form) => {
  const product = form.products.reduce((s, p) => s + (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0), 0)
  const charges = Number(form.sourcingServiceCharges) || 0
  const total = product + charges
  const advance = Number(form.advancePayment) || 0
  const remaining = Number(form.remainingPayment) || 0
  return { product, charges, total, advance, remaining, diff: Math.round((total - advance - remaining) * 100) / 100 }
}

/* ================================================================== */
/* Icons                                                              */
/* ================================================================== */
const PATHS = {
  plus: ['M12 5v14M5 12h14'],
  search: ['M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z', 'm21 21-4.3-4.3'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  pencil: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'],
  pdf: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z', 'M14 2v4a2 2 0 0 0 2 2h4M10 13h4M10 17h4'],
  send: ['M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z'],
  sign: ['M12 2l2.4 2.1 3.2-.2.9 3.1 2.7 1.8-1.1 3 1.1 3-2.7 1.8-.9 3.1-3.2-.2L12 22l-2.4-2.1-3.2.2-.9-3.1L2.8 15.2l1.1-3-1.1-3 2.7-1.8.9-3.1 3.2.2z', 'm9 12 2 2 4-4'],
  trash: ['M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6'],
  x: ['M18 6 6 18M6 6l12 12'],
  check: ['m5 13 4 4L19 7'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
  alert: ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4M12 17h.01'],
  refresh: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5'],
  chevron: ['m9 18 6-6-6-6'],
  chevronDown: ['m6 9 6 6 6-6'],
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'],
  box: ['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'm3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12'],
  truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14', 'M17 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  card: ['M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M2 10h20'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'],
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z', 'M14 2v4a2 2 0 0 0 2 2h4'],
  link: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71']
}
const Icon = ({ name, className = 'h-4 w-4', sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {(PATHS[name] || []).map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
)

/* ================================================================== */
/* Small UI pieces                                                    */
/* ================================================================== */
const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'
const brandGrad = 'bg-gradient-to-r from-[#F41703] to-[#F97316]'
const inputBase = 'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:ring-2'
const inputOk = 'border-gray-300 focus:border-[#F41703] focus:ring-[#F41703]/15'
const inputBad = 'border-red-400 focus:ring-red-200'

const StatusPill = ({ status }) => {
  const m = meta(status)
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${m.pill}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  )
}

const Avatar = ({ name, size = 'h-9 w-9 text-xs' }) => (
  <span className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] font-bold text-white`}>{initials(name)}</span>
)

const IconBtn = ({ icon, label, onClick, tone = 'hover:bg-gray-100 hover:text-gray-900', disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label} className={`rounded-lg p-2 text-gray-500 transition-colors disabled:opacity-40 ${tone} ${ring}`}>
    <Icon name={icon} />
  </button>
)

const Toasts = ({ items, dismiss }) => (
  <div className="pointer-events-none fixed bottom-6 right-6 z-[95] flex w-[min(92vw,380px)] flex-col gap-3" aria-live="polite">
    {items.map((t) => (
      <div key={t.id} role="status" className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl ${t.type === 'error' ? 'border-red-200' : 'border-green-200'}`}>
        <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white ${t.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          <Icon name={t.type === 'error' ? 'alert' : 'check'} className="h-3.5 w-3.5" sw={3} />
        </span>
        <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
        <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-gray-400 hover:text-gray-600">
          <Icon name="x" />
        </button>
      </div>
    ))}
  </div>
)

const ConfirmDialog = ({ dialog, onCancel }) =>
  dialog && (
    <div className="fixed inset-0 z-[90] flex h-screen items-center justify-center bg-gray-900/50 backdrop-blur-sm" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${dialog.danger ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-[#F41703]'}`}>
          <Icon name={dialog.icon || 'alert'} className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{dialog.title}</h3>
        <p className="mt-1.5 text-sm text-gray-600">{dialog.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 ${ring}`}>
            Cancel
          </button>
          <button onClick={dialog.onConfirm} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${dialog.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#F41703] hover:bg-[#d31402]'} ${ring}`}>
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )

const Field = ({ label, children, span, error, hint }) => (
  <div className={span ? 'md:col-span-2' : ''}>
    <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
)

/* ================================================================== */
/* Create / edit wizard                                               */
/* ================================================================== */
const STEPS = [
  { id: 'parties', label: 'Parties & dates', icon: 'users' },
  { id: 'products', label: 'Products & pricing', icon: 'box' },
  { id: 'sourcing', label: 'Sourcing terms', icon: 'truck' },
  { id: 'payment', label: 'Payment', icon: 'card' },
  { id: 'conditions', label: 'Conditions', icon: 'shield' }
]

const AgreementForm = ({ editing, customers, orders, onClose, onSaved, notify }) => {
  const [form, setForm] = useState(() => {
    if (!editing) return emptyForm()
    const a = editing
    return {
      ...emptyForm(),
      customer: a.customer?._id || a.customer || '',
      order: a.order?._id || a.order || '',
      agreementDate: toDateInput(a.agreementDate),
      validUntil: toDateInput(a.validUntil),
      customerName: a.customerName || '',
      firstName: a.firstName || '',
      middleName: a.middleName || '',
      lastName: a.lastName || '',
      customerCompany: a.customerCompany || '',
      companyType: a.companyType || '',
      registrationNo: a.registrationNo || '',
      customerAddress: a.customerAddress || '',
      customerEmail: a.customerEmail || '',
      mobileNumber: a.mobileNumber || '',
      alternateMobile: a.alternateMobile || '',
      whatsappNo: a.whatsappNo || '',
      pinCode: a.pinCode || '',
      city: a.city || '',
      state: a.state || '',
      country: a.country || '',
      products: a.products?.length ? a.products.map((p) => ({ ...emptyProduct, ...p })) : [{ ...emptyProduct }],
      currency: a.currency || 'USD',
      sourcingServiceCharges: a.sourcingServiceCharges || 0,
      supplierDetails: a.supplierDetails || '',
      qualityInspectionTerms: a.qualityInspectionTerms || '',
      sampleApprovalTerms: a.sampleApprovalTerms || '',
      packagingRequirements: a.packagingRequirements || '',
      deliveryTimeline: a.deliveryTimeline || '',
      shippingTerms: a.shippingTerms || '',
      customsDutyResponsibility: a.customsDutyResponsibility || '',
      advancePayment: a.advancePayment || 0,
      remainingPayment: a.remainingPayment || 0,
      paymentMilestones: a.paymentMilestones || '',
      paymentMethod: a.paymentMethod || '',
      refundPolicy: a.refundPolicy || '',
      icbResponsibilities: a.icbResponsibilities || '',
      customerResponsibilities: a.customerResponsibilities || '',
      deliveryDelayConditions: a.deliveryDelayConditions || '',
      disputeResolution: a.disputeResolution || '',
      confidentiality: a.confidentiality || '',
      terminationConditions: a.terminationConditions || ''
    }
  })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [askDiscard, setAskDiscard] = useState(false)
  const initial = useRef(JSON.stringify(form))
  const dirty = JSON.stringify(form) !== initial.current
  const totals = calcTotals(form)

  const set = (key, value) => {
    let v = value
    if (/mobile|phone|whatsapp|contact/i.test(key)) v = String(v ?? '').replace(/[^\d+\-\s()]/g, '').slice(0, 20)
    else if (/email/i.test(key)) v = String(v ?? '').replace(/[^a-zA-Z0-9@._%+\-]/g, '')
    else if (/pin/i.test(key)) v = String(v ?? '').replace(/\D/g, '').slice(0, 6)
    setForm((f) => ({ ...f, [key]: v }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }
  const setProduct = (index, key, value) => {
    setForm((f) => {
      const products = [...f.products]
      products[index] = { ...products[index], [key]: value }
      return { ...f, products }
    })
    setErrors((e) => (e.products ? { ...e, products: undefined } : e))
  }

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c._id === customerId)
    setForm((f) => ({
      ...f,
      customer: customerId,
      customerName: customer?.customerName || '',
      firstName: customer?.customerName || '',
      customerCompany: customer?.companyName || '',
      customerAddress: [customer?.address, customer?.city, customer?.state, customer?.country].filter(Boolean).join(', '),
      customerEmail: customer?.email || '',
      mobileNumber: customer?.phone || '',
      whatsappNo: customer?.whatsapp || '',
      pinCode: customer?.pincode || '',
      city: customer?.city || '',
      state: customer?.state || '',
      country: customer?.country || ''
    }))
    setErrors((e) => (e.customer ? { ...e, customer: undefined } : e))
  }

  const setAdvancePercent = (pct) => {
    const advance = Math.round(totals.total * pct) / 100
    setForm((f) => ({ ...f, advancePayment: advance, remainingPayment: Math.max(0, Math.round((totals.total - advance) * 100) / 100) }))
  }

  const requestClose = () => (dirty ? setAskDiscard(true) : onClose())

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (askDiscard ? setAskDiscard(false) : requestClose())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const validate = () => {
    const e = {}
    if (!form.customer) e.customer = 'Please select a customer'
    if (!form.companyType) e.companyType = 'Please select company type'
    if (!form.agreementDate) e.agreementDate = 'Required'
    if (form.validUntil && form.agreementDate && form.validUntil < form.agreementDate) e.validUntil = 'Must be on or after the agreement date'
    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) e.customerEmail = 'Enter a valid email'
    const named = form.products.filter((p) => p.productName)
    if (!named.length) e.products = 'Add at least one product with a name'
    else if (named.some((p) => !(Number(p.quantity) > 0) || Number(p.unitPrice) < 0)) e.products = 'Each product needs a quantity above 0 and a valid price'
    if (Number(form.sourcingServiceCharges) < 0) e.sourcingServiceCharges = 'Cannot be negative'
    if (Number(form.advancePayment) < 0) e.advancePayment = 'Cannot be negative'
    if (Number(form.remainingPayment) < 0) e.remainingPayment = 'Cannot be negative'
    return e
  }

  const stepOfError = { customer: 0, companyType: 0, agreementDate: 0, validUntil: 0, customerEmail: 0, products: 1, sourcingServiceCharges: 1, advancePayment: 3, remainingPayment: 3 }
  const stepErrors = STEPS.map((_, i) => Object.keys(errors).filter((k) => errors[k] && stepOfError[k] === i).length)

  const handleSave = async () => {
    const e = validate()
    setErrors(e)
    const keys = Object.keys(e)
    if (keys.length) {
      setStep(Math.min(...keys.map((k) => stepOfError[k])))
      notify('error', e[keys[0]])
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, products: form.products.filter((p) => p.productName) }
      const result = editing ? await updateAgreement(editing._id, payload) : await createAgreement(payload)
      if (result.success) onSaved(!!editing)
      else notify('error', result.message || 'Failed to save agreement')
    } catch (err) {
      notify('error', err?.response?.data?.message || err?.message || 'Failed to save agreement')
    } finally {
      setSaving(false)
    }
  }

  const inp = (key, error) => `${inputBase} ${error ? inputBad : inputOk}`
  const grid = 'grid grid-cols-1 gap-4 md:grid-cols-2'
  const textarea = (key, label, placeholder) => (
    <Field label={label} span>
      <textarea rows={3} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={`${inp(key)} resize-none`} />
    </Field>
  )

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-gray-900/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div role="dialog" aria-modal="true" aria-label={editing ? 'Edit agreement' : 'Create agreement'} className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{editing ? `Edit agreement ${editing.agreementNumber}` : 'Create agreement'}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{editing ? 'Update the terms below. Changes are saved when you press Update.' : 'Work through the five steps. The agreement number is generated when you save.'}</p>
          </div>
          <button onClick={requestClose} aria-label="Close" className={`rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${ring}`}>
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-gray-50 px-4 py-2" role="tablist">
          {STEPS.map((s, i) => {
            const on = step === i
            const done = i < step
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                onClick={() => setStep(i)}
                className={`flex flex-shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${ring} ${on ? 'bg-white text-[#F41703] shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${on ? `${brandGrad} text-white` : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {done ? <Icon name="check" className="h-3.5 w-3.5" sw={3} /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
                {stepErrors[i] > 0 && <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{stepErrors[i]}</span>}
              </button>
            )
          })}
        </div>

        {/* Body: step content + live summary */}
        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_300px]">
          <div className="min-h-0 overflow-y-auto px-6 py-6">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field label="Agreement number">
                  <input type="text" value={editing ? editing.agreementNumber : 'Auto-generated on save'} disabled className={`${inputBase} ${inputOk} bg-gray-100 text-gray-500`} />
                </Field>
                <Field label="Agreement date *" error={errors.agreementDate}>
                  <input type="date" value={form.agreementDate} onChange={(e) => set('agreementDate', e.target.value)} className={inp('agreementDate', errors.agreementDate)} />
                </Field>
                <Field label="Valid until" error={errors.validUntil}>
                  <input type="date" value={form.validUntil} onChange={(e) => set('validUntil', e.target.value)} className={inp('validUntil', errors.validUntil)} />
                </Field>
                <Field label="Customer *" error={errors.customer}>
                  <select value={form.customer} onChange={(e) => handleCustomerChange(e.target.value)} className={inp('customer', errors.customer)}>
                    <option value="">Select customer...</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.customerName}
                        {c.companyName ? ` — ${c.companyName}` : ''}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="md:col-span-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Field label="First name">
                    <input type="text" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inp()} placeholder="First name" />
                  </Field>
                  <Field label="Middle name">
                    <input type="text" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} className={inp()} placeholder="Middle name" />
                  </Field>
                  <Field label="Last name">
                    <input type="text" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inp()} placeholder="Last name" />
                  </Field>
                  <Field label="Customer company name">
                    <input type="text" value={form.customerCompany} onChange={(e) => set('customerCompany', e.target.value)} className={inp()} />
                  </Field>
                  <Field label="Type of company *" error={errors.companyType} span>
                    <select value={form.companyType} onChange={(e) => set('companyType', e.target.value)} className={inp('companyType', errors.companyType)}>
                      <option value="">Select company type...</option>
                      {['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'HUF', 'Trust', 'Society', 'Government', 'Other'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Registration no." span>
                    <input type="text" value={form.registrationNo} onChange={(e) => set('registrationNo', e.target.value)} className={inp()} placeholder="Company registration / CIN number" />
                  </Field>
                </div>
                <Field label="Mobile number">
                  <input type="tel" value={form.mobileNumber} onChange={(e) => set('mobileNumber', e.target.value)} className={inp()} placeholder="Mobile number" />
                </Field>
                <Field label="Alternate mobile number">
                  <input type="tel" value={form.alternateMobile} onChange={(e) => set('alternateMobile', e.target.value)} className={inp()} placeholder="Alternate mobile" />
                </Field>
                <Field label="WhatsApp no">
                  <input type="tel" value={form.whatsappNo} onChange={(e) => set('whatsappNo', e.target.value)} className={inp()} placeholder="WhatsApp number" />
                </Field>
                <Field label="Customer email" error={errors.customerEmail}>
                  <input type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} className={inp('customerEmail', errors.customerEmail)} />
                </Field>
                <Field label="PIN code">
                  <input type="text" value={form.pinCode} onChange={(e) => set('pinCode', e.target.value)} className={inp()} placeholder="PIN code" />
                </Field>
                <Field label="City">
                  <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} className={inp()} placeholder="City" />
                </Field>
                <Field label="State">
                  <input type="text" value={form.state} onChange={(e) => set('state', e.target.value)} className={inp()} placeholder="State" />
                </Field>
                <Field label="Country">
                  <input type="text" value={form.country} onChange={(e) => set('country', e.target.value)} className={inp()} placeholder="Country" />
                </Field>
                <Field label="Customer address" span>
                  <input type="text" value={form.customerAddress} onChange={(e) => set('customerAddress', e.target.value)} className={inp()} />
                </Field>
                <Field label="Related order" span>
                  <select value={form.order} onChange={(e) => set('order', e.target.value)} className={inp()}>
                    <option value="">No related order</option>
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.orderNumber}
                        {o.userId?.name ? ` — ${o.userId.name}` : ''}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className={grid}>
                  <Field label="Currency">
                    <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inp()}>
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div>
                  <div className="mb-2 hidden grid-cols-[1.4fr_1.4fr_90px_120px_110px_32px] gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 md:grid">
                    <span>Product *</span>
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Unit price</span>
                    <span className="text-right">Line total</span>
                    <span />
                  </div>
                  <div className="space-y-3">
                    {form.products.map((product, index) => {
                      const line = (Number(product.quantity) || 0) * (Number(product.unitPrice) || 0)
                      return (
                        <div key={index} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
                          <div className="grid grid-cols-2 items-center gap-2 md:grid-cols-[1.4fr_1.4fr_90px_120px_110px_32px]">
                            <input type="text" placeholder="Product name" aria-label="Product name" value={product.productName} onChange={(e) => setProduct(index, 'productName', e.target.value)} className={`${inp()} col-span-2 md:col-span-1`} />
                            <input type="text" placeholder="Description" aria-label="Description" value={product.description} onChange={(e) => setProduct(index, 'description', e.target.value)} className={`${inp()} col-span-2 md:col-span-1`} />
                            <input type="number" min="0" placeholder="Qty" aria-label="Quantity" value={product.quantity} onChange={(e) => setProduct(index, 'quantity', e.target.value)} className={inp()} />
                            <input type="number" min="0" step="0.01" placeholder="Unit price" aria-label="Unit price" value={product.unitPrice} onChange={(e) => setProduct(index, 'unitPrice', e.target.value)} className={inp()} />
                            <span className="text-right text-sm font-bold text-gray-800">{fmtMoney(line, form.currency)}</span>
                            <button type="button" disabled={form.products.length === 1} onClick={() => setForm((f) => ({ ...f, products: f.products.filter((_, i) => i !== index) }))} aria-label="Remove product" className="justify-self-end rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30">
                              <Icon name="trash" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {errors.products && <p className="mt-2 text-xs font-medium text-red-600">{errors.products}</p>}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, products: [...f.products, { ...emptyProduct }] }))} className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#F41703] hover:bg-[#F41703]/10 ${ring}`}>
                    <Icon name="plus" /> Add product
                  </button>
                </div>

                <div className={grid}>
                  <Field label={`Sourcing service charges (${form.currency})`} error={errors.sourcingServiceCharges}>
                    <input type="number" min="0" step="0.01" value={form.sourcingServiceCharges} onChange={(e) => set('sourcingServiceCharges', e.target.value)} className={inp('x', errors.sourcingServiceCharges)} />
                  </Field>
                  <Field label="Total agreement amount">
                    <input type="text" disabled value={fmtMoney(totals.total, form.currency)} className={`${inputBase} ${inputOk} bg-gray-100 font-bold text-gray-800`} />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={grid}>
                <Field label="Supplier details" span>
                  <input type="text" list="supplier-options" value={form.supplierDetails} onChange={(e) => set('supplierDetails', e.target.value)} className={inp()} placeholder="e.g. Supplier name, location" />
                  <datalist id="supplier-options">
                    <option value="Nest N Best" />
                    <option value="Guangzhou Trading Co." />
                    <option value="Shenzhen Electronics Ltd." />
                    <option value="Yiwu Commodity Market" />
                  </datalist>
                </Field>
                {textarea('qualityInspectionTerms', 'Quality inspection terms')}
                {textarea('sampleApprovalTerms', 'Sample approval terms')}
                {textarea('packagingRequirements', 'Packaging requirements')}
                <Field label="Delivery timeline">
                  <input type="text" value={form.deliveryTimeline} onChange={(e) => set('deliveryTimeline', e.target.value)} className={inp()} placeholder="e.g. 30-45 days after order confirmation" />
                </Field>
                <Field label="Shipping terms">
                  <select value={form.shippingTerms} onChange={(e) => set('shippingTerms', e.target.value)} className={inp()}>
                    <option value="">Select...</option>
                    {SHIPPING_TERMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Customs and import duty responsibility" span>
                  <input type="text" value={form.customsDutyResponsibility} onChange={(e) => set('customsDutyResponsibility', e.target.value)} className={inp()} placeholder="e.g. Buyer bears all import duties" />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Quick split of {fmtMoney(totals.total, form.currency)}</p>
                  <div className="flex flex-wrap gap-2">
                    {[30, 50, 70, 100].map((pct) => (
                      <button key={pct} type="button" onClick={() => setAdvancePercent(pct)} className={`rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#F41703] hover:text-[#F41703] ${ring}`}>
                        {pct}% advance
                      </button>
                    ))}
                  </div>
                </div>

                <div className={grid}>
                  <Field label={`Advance payment (${form.currency})`} error={errors.advancePayment}>
                    <input type="number" min="0" step="0.01" value={form.advancePayment} onChange={(e) => set('advancePayment', e.target.value)} className={inp('x', errors.advancePayment)} />
                  </Field>
                  <Field label={`Remaining payment (${form.currency})`} error={errors.remainingPayment}>
                    <div className="flex gap-2">
                      <input type="number" min="0" step="0.01" value={form.remainingPayment} onChange={(e) => set('remainingPayment', e.target.value)} className={inp('x', errors.remainingPayment)} />
                      <button type="button" onClick={() => set('remainingPayment', Math.max(0, Math.round((totals.total - totals.advance) * 100) / 100))} className={`flex-shrink-0 rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-600 hover:border-[#F41703] hover:text-[#F41703] ${ring}`}>
                        Auto-fill
                      </button>
                    </div>
                  </Field>
                  <Field label="Payment milestones" span>
                    <textarea rows={2} value={form.paymentMilestones} onChange={(e) => set('paymentMilestones', e.target.value)} className={`${inp()} resize-none`} placeholder="e.g. 30% advance, 70% before shipment" />
                    <button type="button" onClick={() => set('paymentMilestones', '30% advance, 70% before shipment')} className="mt-1.5 text-xs font-semibold text-[#F41703] hover:underline">
                      Use "30% advance, 70% before shipment"
                    </button>
                  </Field>
                  <Field label="Payment method">
                    <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inp()}>
                      <option value="">Select...</option>
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {textarea('refundPolicy', 'Refund and cancellation policy')}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className={grid}>
                {textarea('icbResponsibilities', 'Responsibilities of IndoChinaBridge')}
                {textarea('customerResponsibilities', 'Responsibilities of the customer')}
                {textarea('deliveryDelayConditions', 'Delivery and delay conditions')}
                {textarea('disputeResolution', 'Quality and dispute resolution')}
                {textarea('confidentiality', 'Confidentiality')}
                {textarea('terminationConditions', 'Termination conditions')}
              </div>
            )}
          </div>

          {/* Live summary */}
          <aside className="border-t border-gray-200 bg-gray-50 p-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Summary</p>
            <div className="mb-4 flex items-center gap-3">
              <Avatar name={form.customerName || '?'} size="h-10 w-10 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{form.customerName || 'No customer yet'}</p>
                <p className="truncate text-xs text-gray-500">{form.customerCompany || 'Select a customer'}</p>
              </div>
            </div>

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Products</dt><dd className="font-semibold text-gray-800">{form.products.filter((p) => p.productName).length}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Product value</dt><dd className="font-semibold text-gray-800">{fmtMoney(totals.product, form.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Service charges</dt><dd className="font-semibold text-gray-800">{fmtMoney(totals.charges, form.currency)}</dd></div>
              <div className="flex items-end justify-between border-t border-gray-200 pt-3">
                <dt className="font-semibold text-gray-700">Total</dt>
                <dd className="bg-gradient-to-r from-[#F41703] to-[#F97316] bg-clip-text text-xl font-extrabold text-transparent">{fmtMoney(totals.total, form.currency)}</dd>
              </div>
            </dl>

            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-3.5">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Payment split</p>
              <div className="mb-2 flex h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="bg-[#F41703]" style={{ width: `${totals.total ? Math.min(100, (totals.advance / totals.total) * 100) : 0}%` }} />
                <div className="bg-[#F97316]" style={{ width: `${totals.total ? Math.min(100, (totals.remaining / totals.total) * 100) : 0}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#F41703]" />Advance {fmtMoney(totals.advance, form.currency)}</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#F97316]" />Rest {fmtMoney(totals.remaining, form.currency)}</span>
              </div>
              {totals.total > 0 && totals.diff !== 0 ? (
                <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs font-medium text-amber-800">
                  <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  Advance and remaining payment {totals.diff > 0 ? 'are' : 'exceed the total by'} {fmtMoney(Math.abs(totals.diff), form.currency)} {totals.diff > 0 ? 'short of the total.' : '.'}
                </p>
              ) : totals.total > 0 ? (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-700">
                  <Icon name="check" className="h-3.5 w-3.5" sw={3} /> Payments add up to the total
                </p>
              ) : null}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex gap-2">
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              Back
            </button>
            <button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40">
              Next
            </button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={requestClose} className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 ${ring}`}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className={`rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-md shadow-[#F41703]/25 disabled:opacity-60 ${brandGrad} ${ring}`}>
              {saving ? 'Saving...' : editing ? 'Update agreement' : 'Create agreement'}
            </button>
          </div>
        </div>

        {askDiscard && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h4 className="text-lg font-bold text-gray-900">Discard your changes?</h4>
              <p className="mt-1.5 text-sm text-gray-600">Anything you have entered in this form will be lost.</p>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setAskDiscard(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Keep editing</button>
                <button onClick={onClose} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Discard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* Detail view (document style)                                       */
/* ================================================================== */
const Block = ({ title, icon, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5">
    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
      <Icon name={icon} className="h-4 w-4 text-[#F41703]" /> {title}
    </h3>
    {children}
  </section>
)

const KV = ({ items }) => (
  <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
    {items.map(([k, v, span]) => (
      <div key={k} className={span ? 'sm:col-span-2' : ''}>
        <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{k}</dt>
        <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm font-medium text-gray-800">{v || '—'}</dd>
      </div>
    ))}
  </dl>
)

const AgreementView = ({ agreement: a, onClose, onEdit, onPdf, onSend, onSign, onStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (menuOpen ? setMenuOpen(false) : onClose())
    const onDown = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [menuOpen, onClose])

  const cur = a.currency
  const stepIdx = PROGRESS_STEPS.indexOf(a.status)
  const terminal = ['rejected', 'cancelled', 'expired'].includes(a.status)
  const validity = validityOf(a)
  const products = a.products || []
  const productTotal = products.reduce((s, p) => s + (Number(p.totalPrice) || (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0)), 0)

  const btn = 'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-gray-900/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={`Agreement ${a.agreementNumber}`} className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar name={customerOf(a)} size="h-12 w-12 text-base" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-gray-900">{a.agreementNumber}</h2>
                  <StatusPill status={a.status} />
                </div>
                <p className="truncate text-sm text-gray-500">
                  {customerOf(a)}
                  {companyOf(a) ? ` · ${companyOf(a)}` : ''}
                </p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className={`rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${ring}`}>
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</p><p className="text-lg font-extrabold text-gray-900">{fmtMoney(a.totalAmount, cur)}</p></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Date</p><p className="text-sm font-semibold text-gray-800">{fmtDate(a.agreementDate)}</p></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Valid until</p><p className="text-sm font-semibold text-gray-800">{fmtDate(a.validUntil)}</p>{validity && <p className={`text-xs ${validity.tone}`}>{validity.text}</p>}</div>
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Order</p><p className="text-sm font-semibold text-gray-800">{a.orderNumber || a.order?.orderNumber || '—'}</p></div>
          </div>

          {/* Progress */}
          {terminal ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              <Icon name="alert" /> This agreement is {meta(a.status).label.toLowerCase()}.
            </p>
          ) : (
            <ol className="mt-5 flex items-center" aria-label="Agreement progress">
              {PROGRESS_STEPS.map((s, i) => {
                const done = i < stepIdx
                const on = i === stepIdx
                return (
                  <li key={s} className="flex flex-1 items-center last:flex-none">
                    <span className="flex flex-col items-center gap-1.5">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${on ? `${brandGrad} text-white shadow-md shadow-[#F41703]/30` : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {done ? <Icon name="check" className="h-3.5 w-3.5" sw={3} /> : i + 1}
                      </span>
                      <span className={`hidden text-[11px] font-semibold sm:block ${on ? 'text-gray-900' : 'text-gray-400'}`}>{meta(s).label}</span>
                    </span>
                    {i < PROGRESS_STEPS.length - 1 && <span className={`mx-2 mb-5 h-0.5 flex-1 rounded sm:mb-5 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />}
                  </li>
                )
              })}
            </ol>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button onClick={() => onPdf(a)} className={`${btn} bg-gray-100 text-gray-700 hover:bg-gray-200 ${ring}`}>
              <Icon name="pdf" /> Download PDF
            </button>
            {EDITABLE.includes(a.status) && (
              <button onClick={() => onEdit(a)} className={`${btn} bg-gray-100 text-gray-700 hover:bg-gray-200 ${ring}`}>
                <Icon name="pencil" /> Edit
              </button>
            )}
            {!NOT_SENDABLE.includes(a.status) && (
              <button onClick={() => onSend(a)} className={`${btn} bg-blue-600 text-white hover:bg-blue-700 ${ring}`}>
                <Icon name="send" /> Send to customer
              </button>
            )}
            {!NOT_SIGNABLE.includes(a.status) && (
              <button onClick={() => onSign(a)} className={`${btn} bg-green-600 text-white hover:bg-green-700 ${ring}`}>
                <Icon name="sign" /> Mark as signed
              </button>
            )}
            <div className="relative ml-auto" ref={menuRef}>
              <button onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className={`${btn} border border-gray-300 text-gray-700 hover:bg-gray-50 ${ring}`}>
                Change status <Icon name="chevronDown" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 top-full z-20 mt-1.5 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
                  {STATUSES.filter((s) => s.id !== a.status).map((s) => (
                    <button
                      key={s.id}
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false)
                        onStatus(a, s.id)
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} /> {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <Block title="Parties" icon="users">
            <KV items={[['Customer', customerOf(a)], ['Company', companyOf(a)], ['Company type', a.companyType], ['Registration no', a.registrationNo], ['Email', a.customerEmail || a.customer?.email], ['Mobile', a.mobileNumber], ['Alternate mobile', a.alternateMobile], ['WhatsApp', a.whatsappNo], ['PIN / City / State / Country', [a.pinCode, a.city, a.state, a.country].filter(Boolean).join(', ')], ['Address', a.customerAddress, true]]} />
          </Block>

          <Block title="Products and pricing" icon="box">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="bg-gray-50 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5">Product</th>
                    <th className="px-4 py-2.5 text-right">Qty</th>
                    <th className="px-4 py-2.5 text-right">Unit price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{p.productName}</p>
                        {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{p.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmtMoney(p.unitPrice, cur)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmtMoney(p.totalPrice ?? (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0), cur)}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">No products</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto mt-4 w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Product value</dt><dd className="font-semibold">{fmtMoney(productTotal, cur)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Sourcing charges</dt><dd className="font-semibold">{fmtMoney(a.sourcingServiceCharges, cur)}</dd></div>
              <div className="flex justify-between border-t border-gray-200 pt-2"><dt className="font-bold text-gray-800">Total</dt><dd className="text-base font-extrabold text-[#F41703]">{fmtMoney(a.totalAmount, cur)}</dd></div>
            </dl>
          </Block>

          <Block title="Sourcing and service terms" icon="truck">
            <KV items={[['Supplier details', a.supplierDetails, true], ['Quality inspection', a.qualityInspectionTerms, true], ['Sample approval', a.sampleApprovalTerms, true], ['Packaging', a.packagingRequirements, true], ['Delivery timeline', a.deliveryTimeline], ['Shipping terms', a.shippingTerms], ['Customs and duty', a.customsDutyResponsibility, true]]} />
          </Block>

          <Block title="Payment terms" icon="card">
            <KV items={[['Advance payment', a.advancePayment ? fmtMoney(a.advancePayment, cur) : ''], ['Remaining payment', a.remainingPayment ? fmtMoney(a.remainingPayment, cur) : ''], ['Payment method', a.paymentMethod], ['Milestones', a.paymentMilestones, true], ['Refund policy', a.refundPolicy, true]]} />
          </Block>

          <Block title="Agreement conditions" icon="shield">
            <KV items={[['IndoChinaBridge responsibilities', a.icbResponsibilities, true], ['Customer responsibilities', a.customerResponsibilities, true], ['Delivery and delay', a.deliveryDelayConditions, true], ['Dispute resolution', a.disputeResolution, true], ['Confidentiality', a.confidentiality, true], ['Termination', a.terminationConditions, true]]} />
          </Block>

          {a.signedDocument?.url && (
            <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700">
                <Icon name="sign" className="h-4 w-4" /> Signed document
              </h3>
              <p className="text-sm font-semibold text-green-900">{a.signedDocument.name}</p>
              {a.signerName && <p className="mt-0.5 text-xs text-green-700">Signed by {a.signerName}{a.signedAt ? ` on ${fmtDateTime(a.signedAt)}` : ''}</p>}
              <a href={a.signedDocument.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100">
                <Icon name="link" /> View document
              </a>
            </section>
          )}

          {(a.history || []).length > 0 && (
            <Block title="History" icon="clock">
              <ol className="relative ml-3 space-y-5 border-l-2 border-gray-200">
                {[...a.history].reverse().map((h, i) => (
                  <li key={i} className="ml-5">
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-white" style={{ background: meta(h.status).dot }} />
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={h.status} />
                      <span className="text-xs text-gray-400">{fmtDateTime(h.changedAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{h.note || 'Status changed'}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Sign dialog                                                        */
/* ================================================================== */
const SignDialog = ({ agreement, onClose, onDone, notify }) => {
  const [signerName, setSignerName] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  const pick = (f) => {
    if (!f) return
    if (!(f.type === 'application/pdf' || f.type.startsWith('image/'))) {
      setError('Please choose a PDF or an image.')
      return
    }
    setError('')
    setFile(f)
  }

  const submit = async () => {
    if (!signerName.trim()) {
      setError('Please enter the signer name')
      return
    }
    setBusy(true)
    try {
      let signedDocument = null
      if (file) {
        const upload = await uploadDocument(file)
        if (!upload.success || !upload.documentUrl) {
          notify('error', 'Failed to upload the signed document')
          return
        }
        signedDocument = { name: file.name, url: upload.documentUrl }
      }
      const result = await signAgreement(agreement._id, signerName.trim(), signedDocument)
      if (result.success) onDone(result.agreement)
      else notify('error', result.message || 'Failed to sign agreement')
    } catch (err) {
      notify('error', err?.response?.data?.message || err?.message || 'Failed to sign agreement')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex h-screen items-center justify-center bg-gray-900/50 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Mark agreement as signed" className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Icon name="sign" className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mark as signed</h2>
              <p className="text-sm text-gray-500">{agreement.agreementNumber}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} aria-label="Close" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <Field label="Signer name *">
            <input autoFocus type="text" value={signerName} onChange={(e) => { setSignerName(e.target.value); setError('') }} placeholder="Name of the person who signed" className={`${inputBase} ${inputOk}`} />
          </Field>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Signed document (optional)</label>
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#F41703] shadow-sm">
                  <Icon name="file" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} aria-label="Remove file" className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-red-600">
                  <Icon name="x" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${ring} ${drag ? 'border-[#F41703] bg-[#F41703]/5' : 'border-gray-300 hover:border-[#F41703]/60 hover:bg-gray-50'}`}
              >
                <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#F41703]/10 text-[#F41703]">
                  <Icon name="upload" className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-gray-700">Drop the file here or click to browse</p>
                <p className="mt-0.5 text-xs text-gray-400">PDF or image</p>
              </div>
            )}
            <input ref={inputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
          </div>

          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button onClick={onClose} disabled={busy} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={submit} disabled={busy} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-green-600/25 hover:bg-green-700 disabled:opacity-60">
            {busy ? (file ? 'Uploading...' : 'Saving...') : 'Confirm signature'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Page                                                               */
/* ================================================================== */
const AdminAgreements = () => {
  const [agreements, setAgreements] = useState([])
  const [stats, setStats] = useState({ total: 0, draft: 0, pendingReview: 0, sent: 0, signed: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [formState, setFormState] = useState(null) // { editing }
  const [viewing, setViewing] = useState(null)
  const [signing, setSigning] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [toasts, setToasts] = useState([])
  const reqId = useRef(0)

  const notify = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  // wait a moment after typing before asking the server
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchAgreements = useCallback(async () => {
    const id = ++reqId.current
    try {
      setLoading(true)
      const result = await getAllAgreements({ status: statusFilter, search })
      if (id !== reqId.current) return
      if (result.success) {
        setAgreements(result.agreements)
        setLoadError('')
      } else {
        setLoadError(result.message || 'Could not load agreements')
      }
    } catch (error) {
      console.error('Error fetching agreements:', error)
      if (id === reqId.current) setLoadError(error?.response?.data?.message || error?.message || 'Could not load agreements')
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [statusFilter, search])

  const fetchStats = useCallback(async () => {
    try {
      const result = await getAgreementStats()
      if (result.success) setStats(result.stats)
    } catch (e) {
      console.error('Error fetching stats:', e)
    }
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/crm/customers')
      setCustomers(response.data.data || response.data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const result = await getAllOrders()
      if (result.success) setOrders(result.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchAgreements()
  }, [fetchAgreements])

  useEffect(() => {
    fetchStats()
    fetchCustomers()
    fetchOrders()
  }, [fetchStats])

  useEffect(() => setPage(1), [statusFilter, search, sortKey, pageSize])

  const refreshAll = () => {
    fetchAgreements()
    fetchStats()
  }

  /* ---------- actions ---------- */
  const openCreate = () => setFormState({ editing: null })

  const openEdit = async (agreement) => {
    try {
      const result = await getAgreementById(agreement._id)
      if (!result.success) return notify('error', result.message || 'Failed to load agreement')
      setViewing(null)
      setFormState({ editing: result.agreement })
    } catch (e) {
      notify('error', 'Failed to load agreement')
    }
  }

  const openView = async (agreement) => {
    try {
      const result = await getAgreementById(agreement._id)
      if (result.success) setViewing(result.agreement)
      else notify('error', result.message || 'Failed to load agreement')
    } catch (e) {
      notify('error', 'Failed to load agreement')
    }
  }

  const handleSaved = (wasEditing) => {
    setFormState(null)
    refreshAll()
    notify('success', wasEditing ? 'Agreement updated.' : 'Agreement created.')
  }

  const doSend = async (agreement) => {
    setConfirm(null)
    try {
      const result = await sendAgreement(agreement._id)
      notify(result.success ? 'success' : 'error', result.message || (result.success ? 'Agreement sent.' : 'Failed to send'))
      refreshAll()
      if (viewing?._id === agreement._id && result.agreement) setViewing(result.agreement)
    } catch (e) {
      notify('error', e?.response?.data?.message || 'Failed to send agreement')
    }
  }

  const askSend = (agreement) =>
    setConfirm({
      title: 'Send this agreement?',
      message: `${agreement.agreementNumber} will be sent to ${customerOf(agreement)}${agreement.customerEmail ? ` (${agreement.customerEmail})` : ''}.`,
      confirmLabel: 'Send agreement',
      icon: 'send',
      onConfirm: () => doSend(agreement)
    })

  const askDelete = (agreement) =>
    setConfirm({
      title: 'Delete this agreement?',
      message: `${agreement.agreementNumber} will be permanently removed.`,
      confirmLabel: 'Delete agreement',
      danger: true,
      icon: 'trash',
      onConfirm: async () => {
        setConfirm(null)
        try {
          const result = await deleteAgreement(agreement._id)
          if (result.success) {
            if (viewing?._id === agreement._id) setViewing(null)
            refreshAll()
            notify('success', 'Agreement deleted.')
          } else notify('error', result.message || 'Failed to delete')
        } catch (e) {
          notify('error', 'Failed to delete agreement')
        }
      }
    })

  const handlePdf = async (agreement) => {
    try {
      const result = await downloadAgreementPdf(agreement)
      if (!result.success) notify('error', result.message || 'Failed to download PDF')
    } catch (e) {
      notify('error', 'Failed to download PDF')
    }
  }

  const applyStatus = async (agreement, status) => {
    setConfirm(null)
    try {
      const result = await updateAgreementStatus(agreement._id, status)
      if (result.success) {
        refreshAll()
        if (viewing?._id === agreement._id) setViewing(result.agreement)
        notify('success', `Status changed to ${meta(status).label}.`)
      } else notify('error', result.message || 'Failed to update status')
    } catch (e) {
      notify('error', 'Failed to update status')
    }
  }

  const askStatus = (agreement, status) => {
    if (NEEDS_CONFIRM.includes(status)) {
      setConfirm({
        title: `Mark as ${meta(status).label.toLowerCase()}?`,
        message: `${agreement.agreementNumber} will be marked as ${meta(status).label.toLowerCase()}. This is recorded in its history.`,
        confirmLabel: `Mark as ${meta(status).label}`,
        danger: status !== 'expired',
        onConfirm: () => applyStatus(agreement, status)
      })
    } else applyStatus(agreement, status)
  }

  const handleSigned = (updated) => {
    setSigning(null)
    refreshAll()
    if (viewing && updated && viewing._id === updated._id) setViewing(updated)
    notify('success', 'Agreement marked as signed.')
  }

  /* ---------- derived ---------- */
  const sorted = useMemo(() => [...agreements].sort(PAGE_SORTS[sortKey].fn), [agreements, sortKey])
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)
  const valueByCurrency = useMemo(() => {
    const map = {}
    agreements.forEach((a) => {
      map[a.currency || 'USD'] = (map[a.currency || 'USD'] || 0) + (Number(a.totalAmount) || 0)
    })
    return Object.entries(map)
  }, [agreements])

  const statCards = [
    { id: 'all', label: 'Total agreements', value: stats.total, color: '#F41703', icon: 'file' },
    { id: 'draft', label: 'Draft', value: stats.draft, color: '#6B7280', icon: 'pencil' },
    { id: 'pending_review', label: 'Pending review', value: stats.pendingReview, color: '#D97706', icon: 'clock' },
    { id: 'sent', label: 'Sent', value: stats.sent, color: '#2563EB', icon: 'send' },
    { id: 'signed', label: 'Signed', value: stats.signed, color: '#059669', icon: 'sign' },
    { id: 'rejected', label: 'Rejected', value: stats.rejected, color: '#DC2626', icon: 'x' }
  ]

  const selectCls = 'rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#F41703]'
  const filtersActive = statusFilter !== 'all' || searchInput

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Agreement Management</h1>
          <p className="mt-1 text-sm text-gray-500">Create, send and track sourcing agreements</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refreshAll} aria-label="Refresh" title="Refresh" className={`rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:text-[#F41703] ${ring}`}>
            <Icon name="refresh" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreate} className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#F41703]/25 transition-shadow hover:shadow-lg ${brandGrad} ${ring}`}>
            <Icon name="plus" /> Create Agreement
          </button>
        </div>
      </div>

      {/* Status cards (click to filter) */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map((c) => {
          const on = statusFilter === c.id
          const share = stats.total ? Math.round(((c.value || 0) / stats.total) * 100) : 0
          return (
            <button
              key={c.id}
              onClick={() => setStatusFilter(on && c.id !== 'all' ? 'all' : c.id)}
              aria-pressed={on}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-white px-4 py-3 text-left transition-all duration-300 ${ring} ${on ? 'shadow-lg' : 'border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md'}`}
              style={on ? { borderColor: c.color, boxShadow: `0 12px 26px -12px ${c.color}77` } : undefined}
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-10 transition-opacity group-hover:opacity-20" style={{ background: c.color }} aria-hidden="true" />
              <span className="pointer-events-none absolute -bottom-5 -right-2 h-14 w-14 rounded-full opacity-[0.07] transition-opacity group-hover:opacity-15" style={{ background: c.color }} aria-hidden="true" />
              <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white" style={{ background: c.color }}>
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-gray-500">{c.label}</span>
                <span className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-gray-900">{c.value ?? 0}</span>
                  {on && <span className="text-[10px] font-bold" style={{ color: c.color }}>●</span>}
                </span>
                {c.id !== 'all' && (
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-gray-100">
                    <span className="block h-full rounded-full transition-all duration-700" style={{ width: `${share}%`, background: c.color }} />
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by agreement no, customer, order..."
            aria-label="Search agreements"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#F41703]"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className={selectCls} aria-label="Sort agreements">
          {Object.entries(PAGE_SORTS).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>
        {filtersActive && (
          <button onClick={() => { setSearchInput(''); setStatusFilter('all') }} className={`rounded-xl px-3 py-2.5 text-sm font-semibold text-[#F41703] hover:bg-[#F41703]/10 ${ring}`}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loadError ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><Icon name="alert" className="h-6 w-6" /></span>
            <p className="font-semibold text-gray-900">Could not load agreements</p>
            <p className="mt-1 text-sm text-gray-500">{loadError}</p>
            <button onClick={fetchAgreements} className={`mt-4 rounded-lg bg-[#F41703] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d31402] ${ring}`}>Try again</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead className="bg-gray-50/80">
                  <tr>
                    {['Agreement', 'Customer', 'Order', 'Amount', 'Status', 'Validity', 'Created by', ''].map((h) => (
                      <th key={h || 'actions'} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && agreements.length === 0 &&
                    [...Array(6)].map((_, r) => (
                      <tr key={r} className="animate-pulse">
                        {[...Array(8)].map((__, c) => (
                          <td key={c} className="px-4 py-4"><div className="h-4 rounded bg-gray-200" style={{ width: `${55 + ((r + c) % 3) * 15}%` }} /></td>
                        ))}
                      </tr>
                    ))}

                  {paged.map((a) => {
                    const v = validityOf(a)
                    return (
                      <tr key={a._id} tabIndex={0} onClick={() => openView(a)} onKeyDown={(e) => e.key === 'Enter' && openView(a)} className="group cursor-pointer transition-colors hover:bg-[#FFF7F4] focus:bg-[#FFF7F4] focus:outline-none">
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm font-bold text-gray-900">{a.agreementNumber}</p>
                          <p className="text-xs text-gray-500">{fmtDate(a.agreementDate)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={customerOf(a)} />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{customerOf(a)}</p>
                              <p className="text-xs text-gray-500">{companyOf(a) || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{a.orderNumber || a.order?.orderNumber || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-gray-900">{fmtMoney(a.totalAmount, a.currency)}</td>
                        <td className="whitespace-nowrap px-4 py-3"><StatusPill status={a.status} /></td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs">{v ? <span className={v.tone}>{v.text}</span> : <span className="text-gray-400">—</span>}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {a.createdBy ? `${a.createdBy.firstName || ''} ${a.createdBy.lastName || ''}`.trim() || a.createdBy.email : '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            <IconBtn icon="eye" label="View" onClick={() => openView(a)} tone="hover:bg-blue-50 hover:text-blue-600" />
                            {EDITABLE.includes(a.status) && <IconBtn icon="pencil" label="Edit" onClick={() => openEdit(a)} tone="hover:bg-amber-50 hover:text-amber-600" />}
                            <IconBtn icon="pdf" label="Download PDF" onClick={() => handlePdf(a)} tone="hover:bg-red-50 hover:text-red-600" />
                            {!NOT_SENDABLE.includes(a.status) && <IconBtn icon="send" label="Send to customer" onClick={() => askSend(a)} tone="hover:bg-green-50 hover:text-green-600" />}
                            {!NOT_SIGNABLE.includes(a.status) && <IconBtn icon="sign" label="Mark as signed" onClick={() => setSigning(a)} tone="hover:bg-emerald-50 hover:text-emerald-600" />}
                            {DELETABLE.includes(a.status) && <IconBtn icon="trash" label="Delete" onClick={() => askDelete(a)} tone="hover:bg-red-50 hover:text-red-600" />}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!loading && agreements.length === 0 && (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400"><Icon name="inbox" className="h-7 w-7" /></span>
                <p className="font-semibold text-gray-800">{filtersActive ? 'No agreements match these filters' : 'No agreements yet'}</p>
                <p className="mt-1 text-sm text-gray-500">{filtersActive ? 'Try a different status or search.' : 'Create your first agreement to start tracking it here.'}</p>
                {!filtersActive && (
                  <button onClick={openCreate} className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${brandGrad} ${ring}`}>Create Agreement</button>
                )}
              </div>
            )}

            {agreements.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3 text-sm text-gray-600">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Showing <b className="text-gray-900">{(page - 1) * pageSize + 1}</b> to <b className="text-gray-900">{Math.min(page * pageSize, sorted.length)}</b> of <b className="text-gray-900">{sorted.length}</b></span>
                  {valueByCurrency.length > 0 && (
                    <span className="text-gray-500">Value in view: {valueByCurrency.map(([cur, val]) => <b key={cur} className="mr-2 text-gray-800">{fmtMoney(val, cur)}</b>)}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <span className="hidden sm:inline">Rows</span>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
                      {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <div className="flex items-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className={`rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold hover:border-[#F41703] disabled:opacity-40 ${ring}`}>Prev</button>
                    <span className="px-1 font-semibold text-gray-700">{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold hover:border-[#F41703] disabled:opacity-40 ${ring}`}>Next</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {formState && (
        <AgreementForm key={formState.editing?._id || 'new'} editing={formState.editing} customers={customers} orders={orders} notify={notify} onClose={() => setFormState(null)} onSaved={handleSaved} />
      )}

      {viewing && (
        <AgreementView
          agreement={viewing}
          onClose={() => setViewing(null)}
          onEdit={openEdit}
          onPdf={handlePdf}
          onSend={askSend}
          onSign={(a) => setSigning(a)}
          onStatus={askStatus}
        />
      )}

      {signing && <SignDialog agreement={signing} notify={notify} onClose={() => setSigning(null)} onDone={handleSigned} />}

      <ConfirmDialog dialog={confirm} onCancel={() => setConfirm(null)} />
      <Toasts items={toasts} dismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  )
}

export default AdminAgreements