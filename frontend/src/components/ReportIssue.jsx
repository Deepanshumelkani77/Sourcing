import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { submitOrderIssue } from '../services/issueApi'

const ISSUE_TYPES = [
  { id: 'wrong_item', label: 'Wrong item received', hint: 'Different from what I ordered' },
  { id: 'missing_items', label: 'Missing items', hint: 'Part of my order did not arrive' },
  { id: 'damaged', label: 'Damaged goods', hint: 'Broken or damaged in transit' },
  { id: 'quantity', label: 'Quantity mismatch', hint: 'Received more or less than ordered' },
  { id: 'quality', label: 'Quality not as expected', hint: 'Does not match the agreed sample or spec' },
  { id: 'other', label: 'Something else', hint: 'Any other problem or question' },
]

const RESOLUTIONS = ['Replacement', 'Refund', 'Call me back', 'Not sure yet']
const MAX_FILES = 3
const MAX_MB = 5
const MAX_CHARS = 1000

const styles = `
@keyframes riFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes riPop { from { opacity: 0; transform: translateY(16px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes riCheck { from { stroke-dashoffset: 30 } to { stroke-dashoffset: 0 } }
@keyframes riRing { 0% { transform: scale(.6); opacity: .8 } 100% { transform: scale(1.6); opacity: 0 } }
.ri-backdrop { animation: riFade .2s ease-out both }
.ri-dialog { animation: riPop .3s cubic-bezier(.2,.7,.2,1) both }
.ri-check { stroke-dasharray: 30; stroke-dashoffset: 30; animation: riCheck .5s ease-out .25s forwards }
.ri-ring { animation: riRing 1.1s ease-out .2s 1 both }
@media (prefers-reduced-motion: reduce) {
  .ri-backdrop, .ri-dialog, .ri-ring { animation: none !important }
  .ri-check { animation: none !important; stroke-dashoffset: 0 }
}
`

/* ------------------------------------------------------------------ */
/*  Modal                                                               */
/* ------------------------------------------------------------------ */
const IssueModal = ({ order, user, onClose, onSubmitted }) => {
  const [type, setType] = useState('')
  const [itemIds, setItemIds] = useState([])
  const [description, setDescription] = useState('')
  const [resolution, setResolution] = useState('Replacement')
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)
  const dialogRef = useRef(null)

  const items = order.items || []
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

  // Escape to close, lock page scroll, focus the dialog
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !submitting && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, submitting])

  const toggleItem = (id) =>
    setItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    let msg = ''
    const ok = []
    picked.forEach((f) => {
      if (!f.type.startsWith('image/')) msg = 'Only image files can be attached.'
      else if (f.size > MAX_MB * 1024 * 1024) msg = `Each image must be under ${MAX_MB} MB.` 
      else ok.push(f)
    })
    const merged = [...files, ...ok]
    if (merged.length > MAX_FILES) msg = `You can attach up to ${MAX_FILES} photos.` 
    setFileError(msg)
    setFiles(merged.slice(0, MAX_FILES))
  }

  const canSubmit = type && description.trim().length >= 10 && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const result = await submitOrderIssue({
        orderId: order._id,
        orderNumber: order.orderNumber,
        type,
        itemIds,
        description: description.trim(),
        resolution,
        files,
      })
      if (result?.success) {
        setDone({ ticket: result.issue?.ticketNumber || result.ticketNumber || null })
        onSubmitted?.()
      } else {
        setError(result?.message || 'We could not submit your report. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'We could not submit your report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <style>{styles}</style>
      <div
        className="ri-backdrop absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-title"
        className="ri-dialog relative w-full sm:max-w-xl max-h-[92vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-200">
          <div>
            <h2 id="issue-title" className="text-lg font-semibold text-slate-900">Report a problem</h2>
            <p className="text-sm text-slate-500 mt-0.5">Order {order.orderNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          /* Success */
          <div className="px-6 py-12 text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <span className="ri-ring absolute inset-0 rounded-full bg-emerald-400/40" />
              <span className="relative w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="ri-check" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">We have received your report</h3>
            {done.ticket && (
              <p className="text-sm text-slate-500 mt-2">
                Reference: <span className="font-semibold text-slate-800">{done.ticket}</span>
              </p>
            )}
            <p className="text-slate-600 mt-3 max-w-sm mx-auto">
              Our team will review the details and get back to you{user?.email ? ` at ${user.email}` : ''}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            <div className="px-6 py-5 space-y-6 overflow-y-auto">
              {/* Type */}
              <fieldset>
                <legend className="text-sm font-medium text-slate-800 mb-2">What went wrong?</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ISSUE_TYPES.map((t) => (
                    <label
                      key={t.id}
                      className={`cursor-pointer rounded-lg border px-3.5 py-3 transition-all focus-within:ring-2 focus-within:ring-sky-400 ${
                        type === t.id ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input type="radio" name="issueType" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="sr-only" />
                      <span className={`block text-sm font-medium ${type === t.id ? 'text-sky-900' : 'text-slate-800'}`}>{t.label}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{t.hint}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Items */}
              {items.length > 0 && (
                <fieldset>
                  <legend className="text-sm font-medium text-slate-800">Which items are affected? <span className="font-normal text-slate-400">(optional)</span></legend>
                  <div className="mt-2 space-y-1.5">
                    {items.map((item, i) => {
                      const id = String(item._id || item.productId?._id || i)
                      const checked = itemIds.includes(id)
                      return (
                        <label key={id} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${checked ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleItem(id)} className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400" />
                          <span className="text-sm text-slate-800 flex-1 truncate">{item.productId?.productName || 'Product'}</span>
                          {item.quantity != null && <span className="text-xs text-slate-500">Qty {item.quantity}</span>}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {/* Description */}
              <div>
                <label htmlFor="issue-desc" className="text-sm font-medium text-slate-800">Tell us what happened</label>
                <textarea
                  id="issue-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
                  rows={4}
                  placeholder="For example: I ordered 500 units of model A but received model B."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 resize-none"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className={description.length > 0 && description.trim().length < 10 ? 'text-amber-600' : 'text-slate-400'}>
                    {description.length > 0 && description.trim().length < 10 ? 'Please add a little more detail' : ' '}
                  </span>
                  <span className="text-slate-400 tabular-nums">{description.length}/{MAX_CHARS}</span>
                </div>
              </div>

              {/* Photos */}
              <div>
                <p className="text-sm font-medium text-slate-800">Photos <span className="font-normal text-slate-400">(optional, up to {MAX_FILES})</span></p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={src} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
                        aria-label={`Remove photo ${i + 1}`}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-sky-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[11px] mt-0.5">Add</span>
                      <input type="file" accept="image/*" multiple onChange={addFiles} className="sr-only" />
                    </label>
                  )}
                </div>
                {fileError && <p className="text-xs text-red-600 mt-2">{fileError}</p>}
              </div>

              {/* Resolution */}
              <fieldset>
                <legend className="text-sm font-medium text-slate-800 mb-2">How would you like us to resolve it?</legend>
                <div className="flex flex-wrap gap-2">
                  {RESOLUTIONS.map((r) => (
                    <label key={r} className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-sky-400 ${resolution === r ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      <input type="radio" name="resolution" value={r} checked={resolution === r} onChange={() => setResolution(r)} className="sr-only" />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <div role="alert" className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <svg className="w-5 h-5 shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <p className="text-xs text-slate-500 hidden sm:block">{user?.email ? `Replies go to ${user.email}` : 'Our team will contact you.'}</p>
              <div className="flex gap-2 ml-auto">
                <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors"
                >
                  {submitting && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                  {submitting ? 'Submitting' : 'Submit report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

/* ------------------------------------------------------------------ */
/*  Table cell content: button (delivered orders only) + modal          */
/* ------------------------------------------------------------------ */
const ReportIssue = ({ order, user }) => {
  const [open, setOpen] = useState(false)
  const [reported, setReported] = useState(Boolean(order.issueReported || order.hasIssue))

  if (order.status !== 'Delivered') {
    return <span className="text-xs text-slate-400">Available after delivery</span>
  }

  return (
    <>
      {reported ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Issue reported
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          Report
        </button>
      )}
      {open && (
        <IssueModal
          order={order}
          user={user}
          onClose={() => setOpen(false)}
          onSubmitted={() => setReported(true)}
        />
      )}
    </>
  )
}

export default ReportIssue
