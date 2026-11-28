import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useAuth } from '../context/AuthProvider'

const ANNOUNCEMENTS = [
  { text: 'Agreement Management is now live — create, send and track customer agreements.', tag: 'New' },
  { text: 'Bulk lead upload is available in CRM — import Meta & Google lead CSVs in one click.', tag: 'CRM' },
  { text: 'Review pending customer approvals to keep orders moving.', tag: 'Action' },
  { text: 'Keep container statuses updated for accurate shipment tracking.', tag: 'Tip' }
]

const AnnouncementTicker = () => {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || ANNOUNCEMENTS.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  const a = ANNOUNCEMENTS[idx]
  const tagColors = {
    New: 'bg-emerald-100 text-emerald-700',
    CRM: 'bg-blue-100 text-blue-700',
    Action: 'bg-amber-100 text-amber-700',
    Tip: 'bg-purple-100 text-purple-700'
  }

  return (
    <div
      className="mx-4 hidden min-w-0 flex-1 items-center justify-center md:flex"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex w-full max-w-2xl items-center gap-3 overflow-hidden rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 px-4 py-2 shadow-sm">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow-sm">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </span>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tagColors[a.tag] || 'bg-gray-100 text-gray-600'}`}>
          {a.tag}
        </span>
        <p key={idx} className="min-w-0 flex-1 truncate text-[13px] font-medium text-gray-700" style={{ animation: 'annSlide .5s ease' }}>
          {a.text}
        </p>
        <div className="flex flex-shrink-0 gap-1">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Announcement ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-[#F41703]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes annSlide { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

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
            <AnnouncementTicker />
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
    </div>
  )
}

export default AdminLayout
