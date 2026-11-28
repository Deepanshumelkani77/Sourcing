import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../context/AuthProvider'
import api from '../config/axios'

const TAG_COLORS = {
  New: 'bg-emerald-100 text-emerald-700',
  Update: 'bg-blue-100 text-blue-700',
  CRM: 'bg-blue-100 text-blue-700',
  Action: 'bg-amber-100 text-amber-700',
  Tip: 'bg-purple-100 text-purple-700',
  Alert: 'bg-red-100 text-red-700',
  General: 'bg-gray-100 text-gray-600'
}
const TAG_OPTIONS = Object.keys(TAG_COLORS)

/* ------------------------------------------------------------------ */
/* Manage announcements modal                                          */
/* ------------------------------------------------------------------ */
const AnnouncementsManager = ({ onClose, onChanged }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | {} new | item
  const [form, setForm] = useState({ text: '', tag: 'General', link: '', isActive: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/announcements?all=true')
      setItems(res.data?.data || [])
    } catch (e) {
      console.error('Failed to load announcements', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => {
    setEditing({})
    setForm({ text: '', tag: 'General', link: '', isActive: true })
  }
  const openEdit = (a) => {
    setEditing(a)
    setForm({ text: a.text, tag: a.tag || 'General', link: a.link || '', isActive: a.isActive })
  }

  const save = async () => {
    if (!form.text.trim()) return
    setSaving(true)
    try {
      if (editing?._id) {
        await api.put(`/api/announcements/${editing._id}`, form)
      } else {
        await api.post('/api/announcements', form)
      }
      setEditing(null)
      await load()
      onChanged?.()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save announcement')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (a) => {
    try {
      await api.put(`/api/announcements/${a._id}`, { isActive: !a.isActive })
      await load()
      onChanged?.()
    } catch (e) {
      alert('Failed to update announcement')
    }
  }

  const remove = async (a) => {
    if (!window.confirm(`Delete announcement "${a.text.slice(0, 40)}..."?`)) return
    try {
      await api.delete(`/api/announcements/${a._id}`)
      await load()
      onChanged?.()
    } catch (e) {
      alert('Failed to delete announcement')
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex h-screen items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Announcements</h3>
            <p className="text-xs text-gray-500">Control what appears in the top announcement bar</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {editing !== null ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Announcement text</label>
                <textarea
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="e.g. New feature launched — check it out"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Category</label>
                  <select
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703]"
                  >
                    {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Link (optional)</label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="/agreements"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703]"
                  />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#F41703] focus:ring-[#F41703]"
                />
                Active (visible in top bar)
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditing(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={save} disabled={saving || !form.text.trim()} className="rounded-lg bg-[#F41703] px-5 py-2 text-sm font-bold text-white hover:bg-[#d31402] disabled:opacity-50">
                  {saving ? 'Saving...' : editing?._id ? 'Update' : 'Add announcement'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={openNew} className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#F41703] px-4 py-2 text-sm font-bold text-white hover:bg-[#d31402]">
                + New announcement
              </button>
              {loading ? (
                <p className="py-8 text-center text-sm text-gray-500">Loading...</p>
              ) : items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">No announcements yet. Add one to show in the top bar.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((a) => (
                    <li key={a._id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${TAG_COLORS[a.tag] || TAG_COLORS.General}`}>
                        {a.tag}
                      </span>
                      <p className={`min-w-0 flex-1 truncate text-sm ${a.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{a.text}</p>
                      <button onClick={() => toggle(a)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${a.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {a.isActive ? 'Active' : 'Hidden'}
                      </button>
                      <button onClick={() => openEdit(a)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">Edit</button>
                      <button onClick={() => remove(a)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Announcement ticker                                                 */
/* ------------------------------------------------------------------ */
const AnnouncementTicker = ({ items, onManage }) => {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => { setIdx(0) }, [items.length])

  useEffect(() => {
    if (paused || items.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [paused, items.length])

  if (!items.length) {
    return (
      <div className="mx-4 hidden min-w-0 flex-1 items-center justify-center md:flex">
        <button onClick={onManage} className="rounded-full border border-dashed border-gray-300 px-4 py-1.5 text-xs font-semibold text-gray-400 hover:border-[#F41703] hover:text-[#F41703]">
          + Add announcement
        </button>
      </div>
    )
  }

  const a = items[Math.min(idx, items.length - 1)]

  return (
    <div
      className="mx-4 hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a
        href={a.link || undefined}
        className="flex w-full max-w-2xl items-center gap-3 overflow-hidden rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 px-4 py-2 shadow-sm transition hover:shadow-md"
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-sm">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </span>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_COLORS[a.tag] || TAG_COLORS.General}`}>
          {a.tag}
        </span>
        <p key={a._id || idx} className="min-w-0 flex-1 truncate text-[13px] font-medium text-gray-700" style={{ animation: 'annSlide .5s ease' }}>
          {a.text}
        </p>
      </a>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {items.length > 1 && items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Announcement ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-[#F41703]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
        <button onClick={onManage} title="Manage announcements" className="ml-1 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#F41703]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <style>{`@keyframes annSlide { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [showAnnManager, setShowAnnManager] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const loadAnnouncements = useCallback(async () => {
    try {
      const res = await api.get('/api/announcements')
      setAnnouncements(res.data?.data || [])
    } catch (e) {
      setAnnouncements([])
    }
  }, [])

  useEffect(() => { loadAnnouncements() }, [loadAnnouncements])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <AnnouncementTicker items={announcements} onManage={() => setShowAnnManager(true)} />
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {showAnnManager && (
        <AnnouncementsManager onClose={() => setShowAnnManager(false)} onChanged={loadAnnouncements} />
      )}
    </div>
  )
}

export default AdminLayout
