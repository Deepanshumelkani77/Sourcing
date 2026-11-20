import React, { useEffect, useState, useCallback } from 'react'
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

const STATUSES = [
  { id: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { id: 'pending_review', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
  { id: 'viewed', label: 'Viewed', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'signed', label: 'Signed', color: 'bg-green-100 text-green-800' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { id: 'expired', label: 'Expired', color: 'bg-orange-100 text-orange-800' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-gray-200 text-gray-600' }
]

const statusLabel = (id) => STATUSES.find((s) => s.id === id)?.label || id
const statusColor = (id) => STATUSES.find((s) => s.id === id)?.color || 'bg-gray-100 text-gray-700'

const CURRENCIES = ['USD', 'CNY', 'INR']
const SHIPPING_TERMS = ['FOB', 'CIF', 'EXW', 'CFR', 'CPT', 'CIP', 'DAP', 'DDP', 'FCA', 'Other']
const PAYMENT_METHODS = ['Bank Transfer', 'Letter of Credit (LC)', 'Telegraphic Transfer (TT)', 'Cash in Advance', 'Other']

const emptyProduct = { productName: '', description: '', quantity: 1, unitPrice: 0 }

const emptyForm = {
  customer: '',
  order: '',
  agreementDate: new Date().toISOString().split('T')[0],
  validUntil: '',
  customerName: '',
  customerCompany: '',
  customerAddress: '',
  customerEmail: '',
  products: [{ ...emptyProduct }],
  currency: 'USD',
  sourcingServiceCharges: 0,
  supplierDetails: '',
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
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none'
const labelCls = 'block text-xs font-medium text-gray-600 mb-1'

const Field = ({ label, children, span }) => (
  <div className={span ? 'md:col-span-2' : ''}>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
)

const Section = ({ title, children }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  </div>
)

const AdminAgreements = () => {
  const [agreements, setAgreements] = useState([])
  const [stats, setStats] = useState({ total: 0, draft: 0, pendingReview: 0, sent: 0, signed: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const [viewing, setViewing] = useState(null)
  const [signing, setSigning] = useState(null)
  const [signForm, setSignForm] = useState({ signerName: '', signedDoc: null, uploading: false })

  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const setProduct = (index, key, value) => {
    setForm((f) => {
      const products = [...f.products]
      products[index] = { ...products[index], [key]: value }
      return { ...f, products }
    })
  }

  const productTotal = form.products.reduce((s, p) => s + (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0), 0)
  const grandTotal = productTotal + (Number(form.sourcingServiceCharges) || 0)

  const fetchAgreements = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getAllAgreements({ status: statusFilter, search })
      if (result.success) setAgreements(result.agreements)
    } catch (error) {
      console.error('Error fetching agreements:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  const fetchStats = async () => {
    const result = await getAgreementStats()
    if (result.success) setStats(result.stats)
  }

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/api/crm/customers')
      const list = response.data.data || response.data.customers || []
      setCustomers(list)
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
    fetchStats()
    fetchCustomers()
    fetchOrders()
  }, [fetchAgreements])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = async (agreement) => {
    const result = await getAgreementById(agreement._id)
    if (!result.success) {
      alert(result.message || 'Failed to load agreement')
      return
    }
    const a = result.agreement
    setEditing(a)
    setForm({
      ...emptyForm,
      customer: a.customer?._id || a.customer || '',
      order: a.order?._id || a.order || '',
      agreementDate: a.agreementDate ? a.agreementDate.split('T')[0] : '',
      validUntil: a.validUntil ? a.validUntil.split('T')[0] : '',
      customerName: a.customerName || '',
      customerCompany: a.customerCompany || '',
      customerAddress: a.customerAddress || '',
      customerEmail: a.customerEmail || '',
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
    })
    setShowForm(true)
  }

  const handleCustomerChange = (customerId) => {
    const customer = customers.find((c) => c._id === customerId)
    setForm((f) => ({
      ...f,
      customer: customerId,
      customerName: customer?.customerName || '',
      customerCompany: customer?.companyName || '',
      customerAddress: [customer?.address, customer?.city, customer?.state, customer?.country].filter(Boolean).join(', '),
      customerEmail: customer?.email || ''
    }))
  }

  const handleSave = async () => {
    if (!form.customer) {
      alert('Please select a customer')
      return
    }
    if (!form.products.some((p) => p.productName)) {
      alert('Please add at least one product')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, products: form.products.filter((p) => p.productName) }
      const result = editing
        ? await updateAgreement(editing._id, payload)
        : await createAgreement(payload)
      if (result.success) {
        setShowForm(false)
        fetchAgreements()
        fetchStats()
      } else {
        alert(result.message || 'Failed to save agreement')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async (agreement) => {
    if (!confirm(`Send agreement ${agreement.agreementNumber} to the customer?`)) return
    const result = await sendAgreement(agreement._id)
    alert(result.message || (result.success ? 'Agreement sent' : 'Failed to send'))
    fetchAgreements()
    fetchStats()
    if (viewing?._id === agreement._id) setViewing(result.agreement || viewing)
  }

  const handleDelete = async (agreement) => {
    if (!confirm(`Delete agreement ${agreement.agreementNumber}?`)) return
    const result = await deleteAgreement(agreement._id)
    if (result.success) {
      fetchAgreements()
      fetchStats()
    } else {
      alert(result.message || 'Failed to delete')
    }
  }

  const handlePdf = async (agreement) => {
    const result = await downloadAgreementPdf(agreement)
    if (!result.success) alert(result.message || 'Failed to download PDF')
  }

  const openView = async (agreement) => {
    const result = await getAgreementById(agreement._id)
    if (result.success) setViewing(result.agreement)
  }

  const handleSignSubmit = async () => {
    if (!signForm.signerName.trim()) {
      alert('Please enter the signer name')
      return
    }
    setSignForm((f) => ({ ...f, uploading: true }))
    try {
      let signedDocument = null
      if (signForm.signedDoc) {
        const upload = await uploadDocument(signForm.signedDoc)
        if (!upload.success || !upload.documentUrl) {
          alert('Failed to upload signed document')
          return
        }
        signedDocument = { name: signForm.signedDoc.name, url: upload.documentUrl }
      }
      const result = await signAgreement(signing._id, signForm.signerName.trim(), signedDocument)
      if (result.success) {
        setSigning(null)
        setSignForm({ signerName: '', signedDoc: null, uploading: false })
        fetchAgreements()
        fetchStats()
        if (viewing?._id === signing._id) setViewing(result.agreement)
      } else {
        alert(result.message || 'Failed to sign agreement')
      }
    } finally {
      setSignForm((f) => ({ ...f, uploading: false }))
    }
  }

  const handleStatusChange = async (agreement, status) => {
    const result = await updateAgreementStatus(agreement._id, status)
    if (result.success) {
      fetchAgreements()
      fetchStats()
      if (viewing?._id === agreement._id) setViewing(result.agreement)
    } else {
      alert(result.message || 'Failed to update status')
    }
  }

  const statCards = [
    { label: 'Total Agreements', value: stats.total, color: 'text-gray-800' },
    { label: 'Draft', value: stats.draft, color: 'text-gray-600' },
    { label: 'Pending Review', value: stats.pendingReview, color: 'text-yellow-600' },
    { label: 'Sent', value: stats.sent, color: 'text-blue-600' },
    { label: 'Signed', value: stats.signed, color: 'text-green-600' }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agreement Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, send and track sourcing agreements</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#D41503] transition text-sm font-medium"
        >
          + Create Agreement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agreement no, customer, order..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F41703] focus:border-transparent outline-none"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Agreement ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created By</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">Loading agreements...</td></tr>
              ) : agreements.length === 0 ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No agreements found</td></tr>
              ) : (
                agreements.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.agreementNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{a.customerName || a.customer?.customerName || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{a.orderNumber || a.order?.orderNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{a.agreementDate ? new Date(a.agreementDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{a.currency} {Number(a.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.createdBy ? `${a.createdBy.firstName || ''} ${a.createdBy.lastName || ''}`.trim() || a.createdBy.email : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openView(a)} title="View" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {['draft', 'pending_review', 'sent'].includes(a.status) && (
                          <button onClick={() => openEdit(a)} title="Edit" className="p-1.5 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        )}
                        <button onClick={() => handlePdf(a)} title="Download PDF" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                        {!['signed', 'cancelled', 'rejected', 'expired'].includes(a.status) && (
                          <button onClick={() => handleSend(a)} title="Send to customer" className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          </button>
                        )}
                        {!['signed', 'cancelled'].includes(a.status) && (
                          <button onClick={() => { setSigning(a); setSignForm({ signerName: '', signedDoc: null, uploading: false }) }} title="Mark as signed" className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        )}
                        {['draft', 'cancelled'].includes(a.status) && (
                          <button onClick={() => handleDelete(a)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editing ? `Edit Agreement — ${editing.agreementNumber}` : 'Create Agreement'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Section title="A. Basic Information">
                <Field label="Agreement Number">
                  <input type="text" value={editing ? editing.agreementNumber : 'Auto-generated on save'} disabled className={`${inputCls} bg-gray-100 text-gray-500`} />
                </Field>
                <Field label="Agreement Date *">
                  <input type="date" value={form.agreementDate} onChange={(e) => set('agreementDate', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Valid Until">
                  <input type="date" value={form.validUntil} onChange={(e) => set('validUntil', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Customer *">
                  <select value={form.customer} onChange={(e) => handleCustomerChange(e.target.value)} className={inputCls}>
                    <option value="">Select customer...</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>{c.customerName}{c.companyName ? ` — ${c.companyName}` : ''}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Customer Company Name">
                  <input type="text" value={form.customerCompany} onChange={(e) => set('customerCompany', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Customer Address" span>
                  <input type="text" value={form.customerAddress} onChange={(e) => set('customerAddress', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Customer Email">
                  <input type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Related Order">
                  <select value={form.order} onChange={(e) => set('order', e.target.value)} className={inputCls}>
                    <option value="">No related order</option>
                    {orders.map((o) => (
                      <option key={o._id} value={o._id}>{o.orderNumber}{o.userId?.name ? ` — ${o.userId.name}` : ''}</option>
                    ))}
                  </select>
                </Field>
              </Section>

              <Section title="B. Product & Order Details">
                <Field label="Currency">
                  <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={inputCls}>
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                {form.products.map((product, index) => (
                  <div key={index} className="md:col-span-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Product {index + 1}</span>
                      {form.products.length > 1 && (
                        <button type="button" onClick={() => setForm((f) => ({ ...f, products: f.products.filter((_, i) => i !== index) }))} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input type="text" placeholder="Product name *" value={product.productName} onChange={(e) => setProduct(index, 'productName', e.target.value)} className={inputCls} />
                      <input type="text" placeholder="Description" value={product.description} onChange={(e) => setProduct(index, 'description', e.target.value)} className={inputCls} />
                      <input type="number" min="0" placeholder="Qty" value={product.quantity} onChange={(e) => setProduct(index, 'quantity', e.target.value)} className={inputCls} />
                      <input type="number" min="0" step="0.01" placeholder="Unit price" value={product.unitPrice} onChange={(e) => setProduct(index, 'unitPrice', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                ))}
                <div className="md:col-span-2">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, products: [...f.products, { ...emptyProduct }] }))} className="text-sm text-[#F41703] hover:underline font-medium">+ Add Product</button>
                </div>
                <Field label={`Total Product Value (${form.currency})`}>
                  <input type="text" value={productTotal.toFixed(2)} disabled className={`${inputCls} bg-gray-100 text-gray-600`} />
                </Field>
                <Field label={`Sourcing Service Charges (${form.currency})`}>
                  <input type="number" min="0" step="0.01" value={form.sourcingServiceCharges} onChange={(e) => set('sourcingServiceCharges', e.target.value)} className={inputCls} />
                </Field>
                <Field label={`Total Agreement Amount (${form.currency})`}>
                  <input type="text" value={grandTotal.toFixed(2)} disabled className={`${inputCls} bg-gray-100 font-semibold text-gray-800`} />
                </Field>
              </Section>

              <Section title="C. Sourcing & Service Terms">
                <Field label="Supplier Details" span>
                  <input type="text" value={form.supplierDetails} onChange={(e) => set('supplierDetails', e.target.value)} className={inputCls} placeholder="e.g. Supplier name, location" />
                </Field>
                <Field label="Quality Inspection Terms" span>
                  <textarea rows={2} value={form.qualityInspectionTerms} onChange={(e) => set('qualityInspectionTerms', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Sample Approval Terms" span>
                  <textarea rows={2} value={form.sampleApprovalTerms} onChange={(e) => set('sampleApprovalTerms', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Packaging Requirements" span>
                  <textarea rows={2} value={form.packagingRequirements} onChange={(e) => set('packagingRequirements', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Delivery Timeline">
                  <input type="text" value={form.deliveryTimeline} onChange={(e) => set('deliveryTimeline', e.target.value)} className={inputCls} placeholder="e.g. 30-45 days after order confirmation" />
                </Field>
                <Field label="Shipping Terms">
                  <select value={form.shippingTerms} onChange={(e) => set('shippingTerms', e.target.value)} className={inputCls}>
                    <option value="">Select...</option>
                    {SHIPPING_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Customs & Import Duty Responsibility" span>
                  <input type="text" value={form.customsDutyResponsibility} onChange={(e) => set('customsDutyResponsibility', e.target.value)} className={inputCls} placeholder="e.g. Buyer bears all import duties" />
                </Field>
              </Section>

              <Section title="D. Payment Terms">
                <Field label={`Advance Payment (${form.currency})`}>
                  <input type="number" min="0" step="0.01" value={form.advancePayment} onChange={(e) => set('advancePayment', e.target.value)} className={inputCls} />
                </Field>
                <Field label={`Remaining Payment (${form.currency})`}>
                  <input type="number" min="0" step="0.01" value={form.remainingPayment} onChange={(e) => set('remainingPayment', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Payment Milestones" span>
                  <textarea rows={2} value={form.paymentMilestones} onChange={(e) => set('paymentMilestones', e.target.value)} className={inputCls} placeholder="e.g. 30% advance, 70% before shipment" />
                </Field>
                <Field label="Payment Method">
                  <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inputCls}>
                    <option value="">Select...</option>
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Refund & Cancellation Policy" span>
                  <textarea rows={2} value={form.refundPolicy} onChange={(e) => set('refundPolicy', e.target.value)} className={inputCls} />
                </Field>
              </Section>

              <Section title="E. Agreement Conditions">
                <Field label="Responsibilities of IndoChinaBridge" span>
                  <textarea rows={2} value={form.icbResponsibilities} onChange={(e) => set('icbResponsibilities', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Responsibilities of Customer" span>
                  <textarea rows={2} value={form.customerResponsibilities} onChange={(e) => set('customerResponsibilities', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Delivery & Delay Conditions" span>
                  <textarea rows={2} value={form.deliveryDelayConditions} onChange={(e) => set('deliveryDelayConditions', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Quality & Dispute Resolution" span>
                  <textarea rows={2} value={form.disputeResolution} onChange={(e) => set('disputeResolution', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Confidentiality" span>
                  <textarea rows={2} value={form.confidentiality} onChange={(e) => set('confidentiality', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Termination Conditions" span>
                  <textarea rows={2} value={form.terminationConditions} onChange={(e) => set('terminationConditions', e.target.value)} className={inputCls} />
                </Field>
              </Section>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#F41703] text-white rounded-lg hover:bg-[#D41503] transition text-sm disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update Agreement' : 'Create Agreement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{viewing.agreementNumber}</h2>
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(viewing.status)}`}>{statusLabel(viewing.status)}</span>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Section title="Basic Information">
                <Field label="Customer"><p className="text-sm text-gray-800 py-2">{viewing.customerName || viewing.customer?.customerName}</p></Field>
                <Field label="Company"><p className="text-sm text-gray-800 py-2">{viewing.customerCompany || viewing.customer?.companyName || '—'}</p></Field>
                <Field label="Email"><p className="text-sm text-gray-800 py-2">{viewing.customerEmail || viewing.customer?.email || '—'}</p></Field>
                <Field label="Address" span><p className="text-sm text-gray-800 py-2">{viewing.customerAddress || '—'}</p></Field>
                <Field label="Related Order"><p className="text-sm text-gray-800 py-2">{viewing.orderNumber || viewing.order?.orderNumber || '—'}</p></Field>
                <Field label="Agreement Date"><p className="text-sm text-gray-800 py-2">{viewing.agreementDate ? new Date(viewing.agreementDate).toLocaleDateString() : '—'}</p></Field>
                <Field label="Valid Until"><p className="text-sm text-gray-800 py-2">{viewing.validUntil ? new Date(viewing.validUntil).toLocaleDateString() : '—'}</p></Field>
              </Section>

              <Section title="Products & Order Details">
                {(viewing.products || []).map((p, i) => (
                  <div key={i} className="md:col-span-2 text-sm text-gray-700 bg-gray-50 rounded p-2">
                    {p.productName} — Qty {p.quantity} x {viewing.currency} {p.unitPrice} = {viewing.currency} {p.totalPrice}
                    {p.description && <span className="text-gray-500"> ({p.description})</span>}
                  </div>
                ))}
                <Field label="Total Amount"><p className="text-sm font-semibold text-gray-800 py-2">{viewing.currency} {Number(viewing.totalAmount || 0).toLocaleString()}</p></Field>
                <Field label="Sourcing Charges"><p className="text-sm text-gray-800 py-2">{viewing.sourcingServiceCharges ? `${viewing.currency} ${viewing.sourcingServiceCharges}` : '—'}</p></Field>
              </Section>

              <Section title="Sourcing & Service Terms">
                <Field label="Supplier Details" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.supplierDetails || '—'}</p></Field>
                <Field label="Quality Inspection" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.qualityInspectionTerms || '—'}</p></Field>
                <Field label="Sample Approval" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.sampleApprovalTerms || '—'}</p></Field>
                <Field label="Packaging" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.packagingRequirements || '—'}</p></Field>
                <Field label="Delivery Timeline"><p className="text-sm text-gray-800 py-2">{viewing.deliveryTimeline || '—'}</p></Field>
                <Field label="Shipping Terms"><p className="text-sm text-gray-800 py-2">{viewing.shippingTerms || '—'}</p></Field>
                <Field label="Customs & Duty" span><p className="text-sm text-gray-800 py-2">{viewing.customsDutyResponsibility || '—'}</p></Field>
              </Section>

              <Section title="Payment Terms">
                <Field label="Advance Payment"><p className="text-sm text-gray-800 py-2">{viewing.advancePayment ? `${viewing.currency} ${viewing.advancePayment}` : '—'}</p></Field>
                <Field label="Remaining Payment"><p className="text-sm text-gray-800 py-2">{viewing.remainingPayment ? `${viewing.currency} ${viewing.remainingPayment}` : '—'}</p></Field>
                <Field label="Payment Milestones" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.paymentMilestones || '—'}</p></Field>
                <Field label="Payment Method"><p className="text-sm text-gray-800 py-2">{viewing.paymentMethod || '—'}</p></Field>
                <Field label="Refund Policy" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.refundPolicy || '—'}</p></Field>
              </Section>

              <Section title="Agreement Conditions">
                <Field label="ICB Responsibilities" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.icbResponsibilities || '—'}</p></Field>
                <Field label="Customer Responsibilities" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.customerResponsibilities || '—'}</p></Field>
                <Field label="Delivery & Delay" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.deliveryDelayConditions || '—'}</p></Field>
                <Field label="Dispute Resolution" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.disputeResolution || '—'}</p></Field>
                <Field label="Confidentiality" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.confidentiality || '—'}</p></Field>
                <Field label="Termination" span><p className="text-sm text-gray-800 py-2 whitespace-pre-wrap">{viewing.terminationConditions || '—'}</p></Field>
              </Section>

              {viewing.signedDocument?.url && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-green-800 mb-1">Signed Document</h3>
                  <p className="text-sm text-green-700">{viewing.signedDocument.name}</p>
                  {viewing.signerName && <p className="text-xs text-green-600 mt-1">Signed by {viewing.signerName} on {viewing.signedAt ? new Date(viewing.signedAt).toLocaleString() : ''}</p>}
                  <a href={viewing.signedDocument.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">View document</a>
                </div>
              )}

              {(viewing.history || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">History</h3>
                  <div className="space-y-2">
                    {[...viewing.history].reverse().map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusColor(h.status)}`}>{statusLabel(h.status)}</span>
                        <div>
                          <p className="text-gray-700">{h.note || 'Status changed'}</p>
                          <p className="text-xs text-gray-400">{h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <label className={labelCls}>Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.filter((s) => s.id !== viewing.status).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleStatusChange(viewing, s.id)}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      → {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => handlePdf(viewing)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm">Download PDF</button>
              {!['signed', 'cancelled', 'rejected', 'expired'].includes(viewing.status) && (
                <button onClick={() => handleSend(viewing)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">Send to Customer</button>
              )}
              {!['signed', 'cancelled'].includes(viewing.status) && (
                <button onClick={() => { setSigning(viewing); setSignForm({ signerName: '', signedDoc: null, uploading: false }) }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">Mark as Signed</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign Modal */}
      {signing && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Mark Agreement as Signed</h2>
              <button onClick={() => setSigning(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Signer Name *</label>
                <input
                  type="text"
                  value={signForm.signerName}
                  onChange={(e) => setSignForm((f) => ({ ...f, signerName: e.target.value }))}
                  className={inputCls}
                  placeholder="Name of person who signed"
                />
              </div>
              <div>
                <label className={labelCls}>Signed Document (optional)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setSignForm((f) => ({ ...f, signedDoc: e.target.files?.[0] || null }))}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-sm file:text-gray-700 hover:file:bg-gray-200"
                />
                {signForm.signedDoc && <p className="text-xs text-gray-500 mt-1">{signForm.signedDoc.name}</p>}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setSigning(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={handleSignSubmit} disabled={signForm.uploading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50">
                {signForm.uploading ? 'Uploading...' : 'Confirm Signature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAgreements
