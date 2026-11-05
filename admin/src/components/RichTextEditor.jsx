import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/* HTML sanitizer                                                     */
/* Keeps only safe, blog-friendly tags. Used for pasted content, for   */
/* the value coming in, and for the HTML sent out. Also exported so    */
/* your public blog page can sanitize before rendering.                */
/* ------------------------------------------------------------------ */
const ALLOWED_TAGS = new Set(['P', 'BR', 'H1', 'H2', 'H3', 'H4', 'STRONG', 'EM', 'U', 'S', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'HR', 'CODE', 'PRE', 'IMG'])
const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE', 'HR', 'PRE'])
const ALIGNABLE = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'LI'])
const RENAME = { B: 'STRONG', I: 'EM', STRIKE: 'S', DEL: 'S', H5: 'H4', H6: 'H4', TD: 'P', TH: 'P' }
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'LINK', 'META', 'HEAD', 'TITLE', 'PICTURE'])
const BLOCK_SELECTOR = 'p,div,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,table'

const safeUrl = (raw) => {
  const u = (raw || '').trim()
  if (!u) return ''
  if (/^(https?:\/\/|\/(?!\/)|#)/i.test(u)) return u
  if (/^(mailto:|tel:)/i.test(u)) return u
  return ''
}

export const sanitizeHtml = (html) => {
  if (!html || typeof DOMParser === 'undefined') return ''
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const out = doc.createElement('div')

  const walk = (src, dest) => {
    src.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        const isList = dest.nodeName === 'UL' || dest.nodeName === 'OL'
        const isListItem = dest.nodeName === 'LI'
        // Allow text in list items, but skip empty whitespace in lists
        if (isList && !node.nodeValue.trim()) return
        dest.appendChild(doc.createTextNode(node.nodeValue))
        return
      }
      if (node.nodeType !== 1) return

      let tag = node.tagName
      if (DROP.has(tag)) return
      if (tag === 'DIV' && !node.querySelector(BLOCK_SELECTOR)) tag = 'P'
      else if (RENAME[tag]) tag = RENAME[tag]

      // Unknown tag: unwrap it, but keep bold/italic/underline that came from inline styles (Word, Google Docs)
      if (!ALLOWED_TAGS.has(tag)) {
        let target = dest
        const s = node.style
        if (s) {
          const wraps = []
          const fw = s.fontWeight
          if (fw === 'bold' || parseInt(fw, 10) >= 600) wraps.push('strong')
          if (s.fontStyle === 'italic') wraps.push('em')
          const td = s.textDecorationLine || s.textDecoration || ''
          if (td.includes('underline')) wraps.push('u')
          if (td.includes('line-through')) wraps.push('s')
          wraps.forEach((w) => {
            const el = doc.createElement(w)
            target.appendChild(el)
            target = el
          })
        }
        walk(node, target)
        return
      }

      const el = doc.createElement(tag.toLowerCase())

      if (tag === 'A') {
        const href = safeUrl(node.getAttribute('href'))
        if (!href) {
          walk(node, dest)
          return
        }
        el.setAttribute('href', href)
        if (/^https?:/i.test(href)) {
          el.setAttribute('target', '_blank')
          el.setAttribute('rel', 'noopener noreferrer')
        }
      }

      if (tag === 'IMG') {
        const src = safeUrl(node.getAttribute('src'))
        if (!src) {
          walk(node, dest)
          return
        }
        el.setAttribute('src', src)
        const alt = node.getAttribute('alt') || ''
        el.setAttribute('alt', alt)
      }

      if (ALIGNABLE.has(tag)) {
        const m = /text-align:\s*(left|center|right|justify)/i.exec(node.getAttribute('style') || '')
        if (m) el.setAttribute('style', `text-align: ${m[1].toLowerCase()}`)
      }

      if (tag !== 'BR' && tag !== 'HR') walk(node, el)
      dest.appendChild(el)
    })
  }

  walk(doc.body, out)

  // Loose text and inline elements at the top level become paragraphs
  let run = null
  Array.from(out.childNodes).forEach((n) => {
    if (n.nodeType === 1 && BLOCK_TAGS.has(n.tagName)) {
      run = null
      return
    }
    if (n.nodeType === 3 && !n.nodeValue.trim() && !run) {
      out.removeChild(n)
      return
    }
    if (!run) {
      run = doc.createElement('p')
      out.insertBefore(run, n)
    }
    run.appendChild(n)
  })

  return out.innerHTML
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                      */
/* ------------------------------------------------------------------ */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const normalizeUrl = (raw) => {
  const v = (raw || '').trim()
  if (!v) return ''
  if (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(v)) return v
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`
  if (/^[^\s:]+\.[^\s]{2,}$/.test(v)) return `https://${v}`
  return ''
}

const setLinkAttrs = (a) => {
  const href = a.getAttribute('href') || ''
  if (/^https?:/i.test(href)) {
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
  } else {
    a.removeAttribute('target')
    a.removeAttribute('rel')
  }
}

const BLOCK_SELECT = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE'])

const getBlockTag = (root) => {
  const sel = window.getSelection()
  if (!sel || !sel.anchorNode) return 'p'
  let node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
  while (node && node !== root) {
    if (BLOCK_SELECT.has(node.tagName)) return node.tagName.toLowerCase()
    node = node.parentElement
  }
  return 'p'
}

const getAnchor = (root) => {
  const sel = window.getSelection()
  if (!sel || !sel.anchorNode) return null
  let node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
  while (node && node !== root) {
    if (node.tagName === 'A') return node
    node = node.parentElement
  }
  return null
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '')
const MOD = isMac ? '⌘' : 'Ctrl'

/* ------------------------------------------------------------------ */
/* Toolbar pieces (defined outside the component so they are not      */
/* re-created on every keystroke)                                      */
/* ------------------------------------------------------------------ */
const Ic = ({ children, className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)

const TBtn = ({ label, shortcut, active, disabled, onClick, children, wide }) => (
  <button
    type="button"
    aria-label={label}
    title={shortcut ? `${label} (${shortcut})` : label}
    aria-pressed={active === undefined ? undefined : active}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`flex h-8 items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703] disabled:cursor-not-allowed disabled:opacity-40 ${
      wide ? 'px-2.5' : 'w-8'
    } ${active ? 'bg-[#F41703]/10 text-[#F41703]' : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'}`}
  >
    {children}
  </button>
)

const Sep = () => <span className="mx-1 hidden h-5 w-px bg-gray-300 sm:block" aria-hidden="true" />

const EDITOR_CSS = `
.rte-content { outline: none; color: #1f2937; font-size: 1.0625rem; line-height: 1.75; overflow-wrap: anywhere; }
.rte-content[data-empty="true"]::before { content: attr(data-placeholder); color: #9ca3af; float: left; height: 0; pointer-events: none; }
.rte-content > :first-child { margin-top: 0; }
.rte-content h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin: 2rem 0 1rem; color: #111827; }
.rte-content h2 { font-size: 1.75rem; font-weight: 800; line-height: 1.25; letter-spacing: -0.01em; margin: 1.9rem 0 0.75rem; color: #111827; }
.rte-content h3 { font-size: 1.35rem; font-weight: 700; line-height: 1.3; margin: 1.6rem 0 0.5rem; color: #111827; }
.rte-content h4 { font-size: 1.1rem; font-weight: 700; line-height: 1.4; margin: 1.3rem 0 0.5rem; color: #111827; }
.rte-content p { margin: 0.85rem 0; }
.rte-content ul { list-style: disc; padding-left: 1.75rem; margin: 0.85rem 0; list-style-position: outside; }
.rte-content ul li { margin: 0.4rem 0; padding-left: 0.25rem; }
.rte-content ul li::marker { color: #F41703; font-size: 1.1em; }
.rte-content ol { list-style: decimal; padding-left: 1.75rem; margin: 0.85rem 0; list-style-position: outside; }
.rte-content ol li { margin: 0.4rem 0; padding-left: 0.25rem; }
.rte-content ol li::marker { color: #F41703; font-weight: 600; }
.rte-content strong { font-weight: 700; }
.rte-content em { font-style: italic; }
.rte-content a { color: #F41703; text-decoration: underline; text-underline-offset: 2px; cursor: text; }
.rte-content blockquote { border-left: 4px solid #F41703; background: #FFF7F4; padding: 0.75rem 1.1rem; margin: 1.4rem 0; color: #4b5563; font-style: italic; border-radius: 0 0.6rem 0.6rem 0; }
.rte-content blockquote p { margin: 0.25rem 0; }
.rte-content hr { border: 0; border-top: 2px solid #e5e7eb; margin: 2rem 0; }
.rte-content code { background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 0.3rem; font-size: 0.9em; }
.rte-content pre { background: #111827; color: #f9fafb; padding: 1rem; border-radius: 0.6rem; overflow-x: auto; margin: 1.2rem 0; }
@keyframes rte-pop { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: none } }
.rte-pop { animation: rte-pop .15s ease-out both; }
@media (prefers-reduced-motion: reduce) { .rte-pop { animation: none; } }
`

/* ------------------------------------------------------------------ */
/* Editor                                                             */
/* ------------------------------------------------------------------ */
const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Write your content here...',
  minHeight = 320,
  disabled = false,
  stickyToolbar = true,
  toolbarOffset = 0, // set to your fixed header's height if the toolbar should stick below it
  error = '',
  className = ''
}) => {
  const editorRef = useRef(null)
  const popRef = useRef(null)
  const savedRange = useRef(null)
  const lastEmitted = useRef(null)
  const editingAnchor = useRef(null)
  const raf = useRef(0)

  const [stats, setStats] = useState({ words: 0, chars: 0, empty: true })
  const [active, setActive] = useState({})
  const [popover, setPopover] = useState(null) // null | 'link' | 'image'
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkNeedsText, setLinkNeedsText] = useState(false)
  const [popError, setPopError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [source, setSource] = useState(false)
  const [sourceText, setSourceText] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  /* ---------- stats / change emit ---------- */
  const updateStats = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const text = (el.innerText || '').replace(/\u200B/g, '').trim()
    setStats({
      words: text ? text.split(/\s+/).length : 0,
      chars: text.length,
      empty: !text && !el.querySelector('hr')
    })
  }, [])

  const emit = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const empty = !(el.innerText || '').trim() && !el.querySelector('hr')
    const html = empty ? '' : sanitizeHtml(el.innerHTML)
    lastEmitted.current = html
    onChange?.(html)
    updateStats()
  }, [onChange, updateStats])

  /* ---------- sync value from the parent (e.g. when editing an existing post) ---------- */
  useLayoutEffect(() => {
    const el = editorRef.current
    if (!el) return
    const incoming = value || ''
    if (incoming === lastEmitted.current) return
    const clean = sanitizeHtml(incoming)
    if (el.innerHTML !== clean) el.innerHTML = clean
    lastEmitted.current = incoming
    updateStats()
  }, [value, updateStats])

  /* Paragraph tags instead of <div> when pressing Enter */
  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p')
    } catch (e) {
      /* ignore */
    }
  }, [])

  /* ---------- selection tracking ---------- */
  const refreshActive = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const q = (c) => {
      try {
        return document.queryCommandState(c)
      } catch (e) {
        return false
      }
    }
    setActive({
      bold: q('bold'),
      italic: q('italic'),
      underline: q('underline'),
      strike: q('strikeThrough'),
      ul: q('insertUnorderedList'),
      ol: q('insertOrderedList'),
      center: q('justifyCenter'),
      right: q('justifyRight'),
      link: !!getAnchor(el),
      block: getBlockTag(el)
    })
  }, [])

  useEffect(() => {
    const onSel = () => {
      const el = editorRef.current
      const sel = window.getSelection()
      if (!el || !sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) return
      savedRange.current = sel.getRangeAt(0).cloneRange()
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(refreshActive)
    }
    document.addEventListener('selectionchange', onSel)
    return () => {
      document.removeEventListener('selectionchange', onSel)
      cancelAnimationFrame(raf.current)
    }
  }, [refreshActive])

  const focusEditor = () => {
    const el = editorRef.current
    if (!el) return
    if (document.activeElement !== el) {
      el.focus()
      const r = savedRange.current
      if (r) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(r)
      }
    }
  }

  /* ---------- commands ---------- */
  const run = (cmd, val = null) => {
    if (disabled) return
    focusEditor()
    document.execCommand(cmd, false, val)
    emit()
    refreshActive()
  }

  const setBlock = (tag) => {
    const next = active.block === tag && tag !== 'p' ? 'p' : tag
    run('formatBlock', `<${next}>`)
  }

  const clearFormatting = () => {
    focusEditor()
    document.execCommand('removeFormat')
    document.execCommand('unlink')
    document.execCommand('formatBlock', false, '<p>')
    emit()
    refreshActive()
  }

  /* ---------- link ---------- */
  const openLink = () => {
    if (disabled) return
    focusEditor()
    const el = editorRef.current
    const sel = window.getSelection()
    const anchor = getAnchor(el)
    editingAnchor.current = anchor
    setLinkUrl(anchor ? anchor.getAttribute('href') || '' : '')
    setLinkText('')
    setLinkNeedsText(!anchor && !!sel && sel.isCollapsed)
    setPopError('')
    setPopover('link')
  }

  const applyLink = (e) => {
    e.preventDefault()
    const href = normalizeUrl(linkUrl)
    if (!href) {
      setPopError('Enter a valid web address, email or phone link.')
      return
    }
    closePopover()
    focusEditor()
    const anchor = editingAnchor.current
    if (anchor && editorRef.current.contains(anchor)) {
      anchor.setAttribute('href', href)
      setLinkAttrs(anchor)
    } else if (linkNeedsText) {
      const label = linkText.trim() || href.replace(/^(https?:\/\/|mailto:|tel:)/i, '')
      document.execCommand('insertHTML', false, `<a href="${esc(href)}">${esc(label)}</a>`)
      editorRef.current.querySelectorAll('a[href]').forEach(setLinkAttrs)
    } else {
      document.execCommand('createLink', false, href)
      editorRef.current.querySelectorAll('a[href]').forEach(setLinkAttrs)
    }
    emit()
    refreshActive()
  }

  const removeLink = () => {
    closePopover()
    focusEditor()
    const anchor = editingAnchor.current
    if (anchor && editorRef.current.contains(anchor)) {
      const range = document.createRange()
      range.selectNodeContents(anchor)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
    document.execCommand('unlink')
    emit()
    refreshActive()
  }

  const closePopover = () => {
    setPopover(null)
    setPopError('')
    setImageUrl('')
    setImageAlt('')
  }

  /* ---------- image ---------- */
  const openImage = () => {
    if (disabled) return
    focusEditor()
    setImageUrl('')
    setImageAlt('')
    setPopError('')
    setPopover('image')
  }

  const applyImage = (e) => {
    e.preventDefault()
    const src = normalizeUrl(imageUrl)
    if (!src) {
      setPopError('Enter a valid image URL.')
      return
    }
    closePopover()
    focusEditor()
    const imgHtml = `<img src="${esc(src)}" alt="${esc(imageAlt)}" style="max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; display: block;">`
    document.execCommand('insertHTML', false, imgHtml)
    emit()
    refreshActive()
  }

  /* ---------- source view / fullscreen ---------- */
  const prettyHtml = (html) =>
    html.replace(/<\/(p|h2|h3|h4|ul|ol|li|blockquote|pre)>/g, '</$1>\n').replace(/<(hr)>/g, '<$1>\n').trim()

  const toggleSource = () => {
    const el = editorRef.current
    if (!source) {
      setSourceText(prettyHtml(sanitizeHtml(el ? el.innerHTML : '')))
      closePopover()
      setSource(true)
    } else {
      if (el) {
        el.innerHTML = sanitizeHtml(sourceText)
        emit()
      }
      setSource(false)
    }
  }

  useEffect(() => {
    if (!fullscreen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [fullscreen])

  useEffect(() => {
    if (!popover && !fullscreen) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (popover) closePopover()
      else setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [popover, fullscreen])

  useEffect(() => {
    if (!popover) return
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) closePopover()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [popover])

  /* ---------- editor events ---------- */
  const onFocus = () => {
    const el = editorRef.current
    try {
      document.execCommand('styleWithCSS', false, false)
    } catch (e) {
      /* ignore */
    }
    if (!el.innerHTML.trim()) {
      el.innerHTML = '<p><br></p>'
      const range = document.createRange()
      range.selectNodeContents(el.firstChild)
      range.collapse(true)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  const onInput = () => {
    const el = editorRef.current
    if (el.firstChild && el.firstChild.nodeType === 3) document.execCommand('formatBlock', false, '<p>')
    emit()
  }

  const onKeyDown = (e) => {
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      openLink()
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault()
      run('strikeThrough')
    }
  }

  const onPaste = (e) => {
    if (disabled) return
    e.preventDefault()
    const data = e.clipboardData
    const html = data.getData('text/html')
    const text = data.getData('text/plain')
    const sel = window.getSelection()

    // Pasting a link over selected text turns the selection into a link
    if (sel && !sel.isCollapsed && /^https?:\/\/\S+$/i.test(text.trim())) {
      document.execCommand('createLink', false, text.trim())
      editorRef.current.querySelectorAll('a[href]').forEach(setLinkAttrs)
      emit()
      return
    }

    if (html) {
      const clean = sanitizeHtml(html)
      if (clean) document.execCommand('insertHTML', false, clean)
    } else if (text) {
      if (/\r?\n/.test(text.trim())) {
        const paragraphs = text
          .trim()
          .split(/\r?\n\s*\r?\n/)
          .map((p) => `<p>${esc(p).replace(/\r?\n/g, '<br>')}</p>`)
          .join('')
        document.execCommand('insertHTML', false, paragraphs)
      } else {
        document.execCommand('insertText', false, text)
      }
    }
    emit()
  }

  /* ---------- render ---------- */
  const minutes = Math.max(1, Math.ceil(stats.words / 200))
  const toolbarDisabled = disabled || source

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-[1000] flex flex-col bg-white' : ''} ${className}`}>
      <style>{EDITOR_CSS}</style>

      <div
        className={`flex flex-col rounded-xl border bg-white transition focus-within:ring-4 ${
          error ? 'border-red-400 focus-within:ring-red-100' : 'border-gray-300 focus-within:border-[#F41703] focus-within:ring-[#F41703]/10'
        } ${fullscreen ? 'min-h-0 flex-1 rounded-none border-0 focus-within:ring-0' : ''}`}
      >
        {/* ===================== Toolbar ===================== */}
        <div
          role="toolbar"
          aria-label="Text formatting"
          className={`relative z-20 flex flex-wrap items-center gap-0.5 rounded-t-[11px] border-b border-gray-200 bg-gray-50/95 px-2 py-1.5 backdrop-blur ${
            stickyToolbar && !fullscreen ? 'sticky' : ''
          }`}
          style={stickyToolbar && !fullscreen ? { top: toolbarOffset } : undefined}
        >
          <TBtn label="Undo" shortcut={`${MOD}+Z`} disabled={toolbarDisabled} onClick={() => run('undo')}>
            <Ic><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></Ic>
          </TBtn>
          <TBtn label="Redo" shortcut={`${MOD}+Shift+Z`} disabled={toolbarDisabled} onClick={() => run('redo')}>
            <Ic><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" /></Ic>
          </TBtn>

          <Sep />

          <select
            aria-label="Text style"
            value={active.block || 'p'}
            disabled={toolbarDisabled}
            onChange={(e) => run('formatBlock', `<${e.target.value}>`)}
            className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703] disabled:opacity-40"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote</option>
          </select>

          <Sep />

          <TBtn label="Bold" shortcut={`${MOD}+B`} active={active.bold} disabled={toolbarDisabled} onClick={() => run('bold')}>
            <span className="font-bold">B</span>
          </TBtn>
          <TBtn label="Italic" shortcut={`${MOD}+I`} active={active.italic} disabled={toolbarDisabled} onClick={() => run('italic')}>
            <span className="italic">I</span>
          </TBtn>
          <TBtn label="Underline" shortcut={`${MOD}+U`} active={active.underline} disabled={toolbarDisabled} onClick={() => run('underline')}>
            <span className="underline">U</span>
          </TBtn>
          <TBtn label="Strikethrough" shortcut={`${MOD}+Shift+X`} active={active.strike} disabled={toolbarDisabled} onClick={() => run('strikeThrough')}>
            <span className="line-through">S</span>
          </TBtn>

          <Sep />

          <TBtn label="Bullet list" active={active.ul} disabled={toolbarDisabled} onClick={() => run('insertUnorderedList')}>
            <Ic><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Ic>
          </TBtn>
          <TBtn label="Numbered list" active={active.ol} disabled={toolbarDisabled} onClick={() => run('insertOrderedList')}>
            <Ic><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></Ic>
          </TBtn>
          <TBtn label="Quote" active={active.block === 'blockquote'} disabled={toolbarDisabled} onClick={() => setBlock('blockquote')}>
            <Ic><path d="M7 8h4v4a4 4 0 0 1-4 4M15 8h4v4a4 4 0 0 1-4 4" /></Ic>
          </TBtn>

          <Sep />

          <TBtn label="Align left" active={!active.center && !active.right} disabled={toolbarDisabled} onClick={() => run('justifyLeft')}>
            <Ic><path d="M4 6h16M4 12h10M4 18h16" /></Ic>
          </TBtn>
          <TBtn label="Align center" active={active.center} disabled={toolbarDisabled} onClick={() => run('justifyCenter')}>
            <Ic><path d="M4 6h16M7 12h10M4 18h16" /></Ic>
          </TBtn>
          <TBtn label="Align right" active={active.right} disabled={toolbarDisabled} onClick={() => run('justifyRight')}>
            <Ic><path d="M4 6h16M10 12h10M4 18h16" /></Ic>
          </TBtn>

          <Sep />

          <TBtn label={active.link ? 'Edit link' : 'Insert link'} shortcut={`${MOD}+K`} active={active.link} disabled={toolbarDisabled} onClick={openLink}>
            <Ic><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Ic>
          </TBtn>
          <TBtn label="Insert image" disabled={toolbarDisabled} onClick={openImage}>
            <Ic><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Ic>
          </TBtn>
          <TBtn label="Horizontal line" disabled={toolbarDisabled} onClick={() => run('insertHorizontalRule')}>
            <Ic><path d="M3 12h18" /></Ic>
          </TBtn>
          <TBtn label="Clear formatting" disabled={toolbarDisabled} onClick={clearFormatting}>
            <Ic><path d="M4 7V4h16v3M5 20h6M13 4 8 20M15 15l5 5M20 15l-5 5" /></Ic>
          </TBtn>

          <span className="ml-auto flex items-center gap-0.5">
            <TBtn label={source ? 'Back to editor' : 'Edit HTML'} active={source} disabled={disabled} wide onClick={toggleSource}>
              <Ic><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></Ic>
              <span className="ml-1.5 hidden text-xs font-semibold sm:inline">HTML</span>
            </TBtn>
            <TBtn label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={() => setFullscreen((f) => !f)}>
              {fullscreen ? (
                <Ic><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></Ic>
              ) : (
                <Ic><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></Ic>
              )}
            </TBtn>
          </span>

          {/* ---------- Link panel ---------- */}
          {popover === 'link' && (
            <div
              ref={popRef}
              role="dialog"
              aria-label="Insert link"
              className="rte-pop absolute left-2 top-full z-30 mt-1.5 w-[min(94vw,430px)] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/15"
            >
              <form onSubmit={applyLink} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Link address</label>
                    <input
                      autoFocus
                      type="text"
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value)
                        setPopError('')
                      }}
                      placeholder="https://example.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15"
                    />
                  </div>
                  {linkNeedsText && (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-600">Text to show</label>
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        placeholder="Optional"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15"
                      />
                    </div>
                  )}
                  {popError && <p className="text-xs font-medium text-red-600">{popError}</p>}
                  <div className="flex items-center justify-between gap-2">
                    {editingAnchor.current ? (
                      <button type="button" onClick={removeLink} className="text-sm font-semibold text-red-600 hover:underline">
                        Remove link
                      </button>
                    ) : (
                      <span />
                    )}
                    <div className="flex gap-2">
                      <button type="button" onClick={closePopover} className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        Cancel
                      </button>
                      <button type="submit" className="rounded-lg bg-[#F41703] px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-[#d31402]">
                        Apply
                      </button>
                    </div>
                  </div>
              </form>
            </div>
          )}

          {/* ---------- Image panel ---------- */}
          {popover === 'image' && (
            <div
              ref={popRef}
              role="dialog"
              aria-label="Insert image"
              className="rte-pop absolute left-2 top-full z-30 mt-1.5 w-[min(94vw,430px)] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/15"
            >
              <form onSubmit={applyImage} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Image URL</label>
                    <input
                      autoFocus
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value)
                        setPopError('')
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Alt text (optional)</label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Image description"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15"
                    />
                  </div>
                  {popError && <p className="text-xs font-medium text-red-600">{popError}</p>}
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={closePopover} className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="rounded-lg bg-[#F41703] px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-[#d31402]">
                      Insert
                    </button>
                  </div>
              </form>
            </div>
          )}
        </div>

        {/* ===================== Writing area ===================== */}
        <div className={fullscreen ? 'min-h-0 flex-1 overflow-y-auto bg-white' : ''}>
          <div className={fullscreen ? 'mx-auto w-full max-w-3xl' : ''}>
            <div
              ref={editorRef}
              contentEditable={!disabled}
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Content editor"
              aria-invalid={error ? true : undefined}
              spellCheck
              data-placeholder={placeholder}
              data-empty={stats.empty}
              onFocus={onFocus}
              onInput={onInput}
              onPaste={onPaste}
              onKeyDown={onKeyDown}
              className={`rte-content px-5 py-5 md:px-7 ${source ? 'hidden' : ''} ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-70' : ''}`}
              style={fullscreen ? { minHeight: '60vh' } : { minHeight }}
            />
          </div>

          {source && (
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onBlur={() => {
                // keep the form value up to date even if the user submits straight from this view
                const clean = sanitizeHtml(sourceText)
                lastEmitted.current = clean
                onChange?.(clean)
              }}
              spellCheck={false}
              aria-label="HTML source"
              className="block w-full resize-y border-0 bg-gray-950 p-4 font-mono text-sm leading-relaxed text-gray-100 outline-none"
              style={fullscreen ? { minHeight: '60vh' } : { minHeight }}
            />
          )}
        </div>

        {/* ===================== Status bar ===================== */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-[11px] border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          <span>
            {stats.words} {stats.words === 1 ? 'word' : 'words'} · {stats.chars} characters · {stats.words ? `${minutes} min read` : 'empty'}
          </span>
          <span className="hidden sm:inline">
            {`${MOD}+K link · ${MOD}+B bold · ${MOD}+I italic`}
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default RichTextEditor