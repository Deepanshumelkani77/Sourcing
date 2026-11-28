import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LEADS_SUBITEMS = [
  { path: '/crm/leads', label: 'Leads' },
  { path: '/service-requests', label: 'Service Requests' },
  { path: '/product-requests', label: 'Product Requests' }
]

const CRM_ITEMS = [
  { path: '/crm', label: 'Dashboard' },
  { label: 'Leads', children: LEADS_SUBITEMS },
  { path: '/crm/customers', label: 'Customers' },
  { path: '/crm/followups', label: 'Follow-ups' },
  { path: '/crm/complaints', label: 'Complaints' },
  { path: '/crm/reviews', label: 'Reviews' }
]

const GROUP_ICONS = {
  crm: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
}

const NavGroup = ({ label, icon, items, open, onToggle, pathname, setIsOpen }) => {
  const [openChild, setOpenChild] = useState(null)
  const groupActive = items.some((i) => i.path ? pathname === i.path : (i.children || []).some((c) => pathname === c.path))

  const childLink = (child, extraCls = '') => {
    const childActive = pathname === child.path
    return (
      <Link
        key={child.path}
        to={child.path}
        onClick={() => setIsOpen(false)}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${extraCls} ${
          childActive ? 'bg-[#F41703] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <span className="font-medium">{child.label}</span>
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
          groupActive ? 'bg-[#F41703]/15 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
        <span className="flex-1 text-left font-medium">{label}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-700 pl-3">
          {items.map((item) => {
            if (item.children) {
              const childActive = item.children.some((c) => pathname === c.path)
              const subOpen = openChild === item.label
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenChild(subOpen ? null : item.label)}
                    className={`flex w-full items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      childActive ? 'bg-[#F41703]/15 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${subOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {subOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-700/60 pl-3">
                      {item.children.map((c) => childLink(c))}
                    </div>
                  )}
                </div>
              )
            }
            return childLink(item)
          })}
        </div>
      )}
    </div>
  )
}

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const pathname = location.pathname
  const [crmOpen, setCrmOpen] = useState(false)

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/services', label: 'Services', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { path: '/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/containers', label: 'Containers', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/jobs', label: 'Careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/agreements', label: 'Agreements', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/blogs', label: 'Blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1h2a2 2 0 012 2v8a2 2 0 01-2 2h-2zM9 7h6M9 11h6M9 15h6' },
    { path: '/contact-submissions', label: 'Contact Submissions', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/employees', label: 'Employees', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gray-900 text-white transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400 mt-1">IndoChinaBridge</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-700">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#F41703] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <NavGroup
            label="CRM"
            icon={GROUP_ICONS.crm}
            items={CRM_ITEMS}
            open={crmOpen}
            onToggle={() => setCrmOpen((o) => !o)}
            pathname={pathname}
            setIsOpen={setIsOpen}
          />
        </nav>

        {/* User Info */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F41703] to-[#F97316] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@indochinabridge.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
