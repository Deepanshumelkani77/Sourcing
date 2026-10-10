import React, { useEffect, useMemo, useRef, useState } from 'react'
import { countries, POPULAR_ISO } from './countries'

// Flag images (emoji flags don't render on Windows Chrome/Edge)
const Flag = ({ iso, size = 20 }) => (
  <img
    src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`}
    width={size}
    height={Math.round(size * 0.75)}
    alt=""
    loading="lazy"
    onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
    className="rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shrink-0"
  />
)

const Code = ({ value, onChange, brandColor = '#F41703' }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  const popular = useMemo(
    () => POPULAR_ISO.map((iso) => countries.find((c) => c.iso === iso)).filter(Boolean),
    []
  )

  // Flat list drives keyboard navigation
  const items = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '')
    if (!q) return [...popular, ...countries]
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase() === q ||
        c.dial.replace('+', '').startsWith(q)
    )
  }, [query, popular])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search on open, reset state on close
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0)
    } else {
      setQuery('')
      setActive(0)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  // Keep highlighted row visible
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const select = (country) => {
    onChange(country)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (items[active]) select(items[active])
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setOpen(false)
    }
  }

  const renderRow = (c, index, keyPrefix) => {
    const isActive = index === active
    const isSelected = c.iso === value.iso
    return (
      <li
        key={`${keyPrefix}-${c.iso}`}
        role="option"
        aria-selected={isSelected}
        data-index={index}
        onMouseEnter={() => setActive(index)}
        onClick={() => select(c)}
        className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${isActive ? 'bg-gray-100' : ''}`}
      >
        <Flag iso={c.iso} />
        <span className="flex-1 truncate text-gray-800">{c.name}</span>
        <span className="text-gray-500 tabular-nums">{c.dial}</span>
        {isSelected && (
          <svg className="w-4 h-4 shrink-0" style={{ color: brandColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </li>
    )
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${value.name} ${value.dial}`}
        className="h-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#F41703] outline-none"
      >
        <Flag iso={value.iso} />
        <span className="text-gray-800 tabular-nums">{value.dial}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search country or code"
                aria-label="Search country or code"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-[#F41703] placeholder-gray-400"
              />
            </div>
          </div>

          <ul ref={listRef} role="listbox" className="max-h-56 overflow-y-auto py-1">
            {items.length === 0 && (
              <li className="px-3 py-4 text-sm text-center text-gray-500">No countries found</li>
            )}

            {!query && (
              <>
                {popular.map((c, i) => renderRow(c, i, 'pop'))}
                <li role="separator" className="my-1 border-t border-gray-100" />
                {countries.map((c, i) => renderRow(c, popular.length + i, 'all'))}
              </>
            )}

            {query && items.map((c, i) => renderRow(c, i, 'res'))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Code