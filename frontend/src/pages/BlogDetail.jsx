import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogBySlug, getPublishedBlogs } from '../services/blogApi'

const SITE_NAME = 'IndoChinaBridge'
const CONTACT_PATH = '/contact'
const SERVICES_PATH = '/services'

/* ------------------------------------------------------------------ */
/* Content sanitizer + table of contents                              */
/* The blog HTML comes from the database, so it is cleaned before it  */
/* is rendered (no scripts, no inline handlers, no unsafe links).     */
/* ------------------------------------------------------------------ */
const ALLOWED = new Set(['P', 'BR', 'H2', 'H3', 'H4', 'STRONG', 'EM', 'U', 'S', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'IMG', 'HR', 'CODE', 'PRE', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'FIGURE', 'FIGCAPTION'])
const BLOCKS = new Set(['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'BLOCKQUOTE', 'HR', 'PRE', 'TABLE', 'FIGURE'])
const ALIGNABLE = new Set(['P', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'LI', 'TD', 'TH'])
const RENAME = { B: 'STRONG', I: 'EM', STRIKE: 'S', DEL: 'S', H1: 'H2', H5: 'H4', H6: 'H4' }
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'LINK', 'META', 'HEAD', 'TITLE'])
const BLOCK_SELECTOR = 'p,div,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,pre,table'

const safeUrl = (raw, allowMail = true) => {
  const u = (raw || '').trim()
  if (!u) return ''
  if (/^(https?:\/\/|\/(?!\/)|#)/i.test(u)) return u
  if (allowMail && /^(mailto:|tel:)/i.test(u)) return u
  return ''
}

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const buildContent = (html) => {
  if (!html || typeof DOMParser === 'undefined') return { html: '', toc: [], words: 0 }
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const out = doc.createElement('div')

  const walk = (src, dest) => {
    src.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        const parent = dest.nodeName
        if (['UL', 'OL', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR'].includes(parent) && !node.nodeValue.trim()) return
        dest.appendChild(doc.createTextNode(node.nodeValue))
        return
      }
      if (node.nodeType !== 1) return

      let tag = node.tagName
      if (DROP.has(tag)) return
      if (tag === 'DIV' && !node.querySelector(BLOCK_SELECTOR)) tag = 'P'
      else if (RENAME[tag]) tag = RENAME[tag]

      if (!ALLOWED.has(tag)) {
        // unwrap unknown tags but keep bold/italic/underline that came from inline styles
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
        const src2 = safeUrl(node.getAttribute('src'), false)
        if (!src2) return
        el.setAttribute('src', src2)
        el.setAttribute('alt', node.getAttribute('alt') || '')
        el.setAttribute('loading', 'lazy')
        el.setAttribute('decoding', 'async')
      }

      if (tag === 'TD' || tag === 'TH') {
        ;['colspan', 'rowspan'].forEach((a) => {
          const v = parseInt(node.getAttribute(a), 10)
          if (v > 1 && v < 50) el.setAttribute(a, String(v))
        })
      }

      if (ALIGNABLE.has(tag)) {
        const m = /text-align:\s*(left|center|right|justify)/i.exec(node.getAttribute('style') || '')
        if (m) el.setAttribute('style', `text-align: ${m[1].toLowerCase()}`)
      }

      if (tag !== 'IMG' && tag !== 'BR' && tag !== 'HR') walk(node, el)
      dest.appendChild(el)
    })
  }

  walk(doc.body, out)

  // loose text at the top level becomes paragraphs
  let run = null
  Array.from(out.childNodes).forEach((n) => {
    if (n.nodeType === 1 && BLOCKS.has(n.tagName)) {
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

  // headings get ids for the table of contents
  const toc = []
  const used = new Set()
  out.querySelectorAll('h2,h3').forEach((h, i) => {
    const text = h.textContent.trim()
    if (!text) return
    let id = slugify(text) || `section-${i + 1}`
    let n = 2
    while (used.has(id)) id = `${slugify(text) || 'section'}-${n++}`
    used.add(id)
    h.setAttribute('id', id)
    toc.push({ id, text, level: h.tagName === 'H3' ? 3 : 2 })
  })

  // tables scroll sideways on small screens
  out.querySelectorAll('table').forEach((tbl) => {
    const wrap = doc.createElement('div')
    wrap.setAttribute('class', 'table-wrap')
    tbl.parentNode.insertBefore(wrap, tbl)
    wrap.appendChild(tbl)
  })

  const text = out.textContent.trim()
  return { html: out.innerHTML, toc, words: text ? text.split(/\s+/).length : 0 }
}

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
const Svg = ({ children, className = 'h-5 w-5', sw = 2, fill = 'none' }) => (
  <svg viewBox="0 0 24 24" fill={fill} stroke={fill === 'none' ? 'currentColor' : 'none'} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
)
const IFacebook = (c) => <Svg className={c} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></Svg>
const IX = (c) => <Svg className={c} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></Svg>
const ILinkedin = (c) => <Svg className={c} fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></Svg>
const IWhatsapp = (c) => <Svg className={c} fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></Svg>
const ILink = (c) => <Svg className={c}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Svg>
const ICheck = (c) => <Svg className={c} sw={3}><path d="m5 13 4 4L19 7" /></Svg>
const IArrow = (c) => <Svg className={c} sw={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
const IBack = (c) => <Svg className={c} sw={2.2}><path d="M19 12H5M11 18l-6-6 6-6" /></Svg>
const IChevron = (c) => <Svg className={c} sw={2.2}><path d="m9 18 6-6-6-6" /></Svg>
const ICalendar = (c) => <Svg className={c}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Svg>
const IClock = (c) => <Svg className={c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
const IStar = (c) => <Svg className={c} fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></Svg>
const IList = (c) => <Svg className={c}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Svg>
const IUp = (c) => <Svg className={c} sw={2.4}><path d="M12 19V5M5 12l7-7 7 7" /></Svg>
const IShare = (c) => <Svg className={c}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></Svg>

/* ------------------------------------------------------------------ */
/* Styles for the article body                                        */
/* ------------------------------------------------------------------ */
const ARTICLE_CSS = `
.blog-content { color: #374151; font-size: 1.1875rem; line-height: 1.85; overflow-wrap: break-word; }
.blog-content > :first-child { margin-top: 0; }
.blog-content > p:first-of-type { font-size: 1.3rem; line-height: 1.75; color: #1f2937; }
.blog-content h2, .blog-content h3, .blog-content h4 { color: #111827; scroll-margin-top: 7rem; letter-spacing: -0.015em; }
.blog-content h2 { font-size: 2rem; font-weight: 800; line-height: 1.2; margin: 3rem 0 1rem; padding-top: .25rem; }
.blog-content h3 { font-size: 1.5rem; font-weight: 700; line-height: 1.3; margin: 2.25rem 0 .75rem; }
.blog-content h4 { font-size: 1.2rem; font-weight: 700; line-height: 1.4; margin: 1.75rem 0 .5rem; }
.blog-content p { margin: 1.25rem 0; }
.blog-content ul { list-style: disc; padding-left: 1.6rem; margin: 1.25rem 0; }
.blog-content ol { list-style: decimal; padding-left: 1.6rem; margin: 1.25rem 0; }
.blog-content li { margin: .55rem 0; padding-left: .25rem; }
.blog-content li::marker { color: #F41703; font-weight: 700; }
.blog-content li > ul, .blog-content li > ol { margin: .5rem 0; }
.blog-content a { color: #F41703; font-weight: 500; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; transition: color .2s; }
.blog-content a:hover { color: #b81002; }
.blog-content strong { font-weight: 700; color: #111827; }
.blog-content em { font-style: italic; }
.blog-content u { text-underline-offset: 3px; }
.blog-content s { color: #6b7280; }
.blog-content blockquote { position: relative; margin: 2rem 0; padding: 1.25rem 1.5rem 1.25rem 1.75rem; border-left: 4px solid #F41703; background: linear-gradient(90deg, #FFF3EE, #fff); border-radius: 0 1rem 1rem 0; color: #4b5563; font-size: 1.2rem; font-style: italic; }
.blog-content blockquote p { margin: .4rem 0; }
.blog-content img { display: block; max-width: 100%; height: auto; margin: 2rem auto; border-radius: 1rem; box-shadow: 0 10px 30px -10px rgba(17,24,39,.25); }
.blog-content figure { margin: 2rem 0; }
.blog-content figcaption { margin-top: .6rem; text-align: center; font-size: .9rem; color: #6b7280; }
.blog-content hr { border: 0; height: 2px; margin: 3rem 0; background: linear-gradient(90deg, transparent, #F41703, #F97316, transparent); opacity: .5; }
.blog-content code { background: #f3f4f6; color: #b81002; padding: .15rem .4rem; border-radius: .35rem; font-size: .9em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.blog-content pre { background: #111827; color: #f9fafb; padding: 1.1rem 1.25rem; border-radius: .9rem; overflow-x: auto; margin: 1.75rem 0; font-size: .95rem; line-height: 1.6; }
.blog-content pre code { background: none; color: inherit; padding: 0; }
.blog-content .table-wrap { overflow-x: auto; margin: 2rem 0; border: 1px solid #e5e7eb; border-radius: .9rem; }
.blog-content table { width: 100%; border-collapse: collapse; font-size: 1rem; }
.blog-content th, .blog-content td { padding: .8rem 1rem; border-bottom: 1px solid #e5e7eb; text-align: left; vertical-align: top; }
.blog-content th { background: #f9fafb; font-weight: 700; color: #111827; }
.blog-content tr:last-child td { border-bottom: 0; }
.blog-content tbody tr:hover { background: #fafafa; }
@media (max-width: 640px) {
  .blog-content { font-size: 1.0625rem; }
  .blog-content > p:first-of-type { font-size: 1.15rem; }
  .blog-content h2 { font-size: 1.6rem; }
  .blog-content h3 { font-size: 1.3rem; }
}
@keyframes bd-rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
.bd-rise { animation: bd-rise .7s cubic-bezier(.2,.8,.2,1) both; }
@media (prefers-reduced-motion: reduce) { .bd-rise { animation: none; } }
`

const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'
const brandGrad = 'bg-gradient-to-r from-[#F41703] to-[#F97316]'

const formatDate = (date, short = false) =>
  new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: short ? 'short' : 'long', year: 'numeric' })

/* ------------------------------------------------------------------ */
/* Share buttons                                                      */
/* ------------------------------------------------------------------ */
const ShareButtons = ({ title, size = 'md' }) => {
  const [copied, setCopied] = useState(false)
  const base = `flex ${size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'} items-center justify-center rounded-full text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ${ring}`

  const open = (u) => window.open(u, '_blank', 'noopener,noreferrer,width=600,height=450')
  const url = () => window.location.href
  const text = title || 'Check out this article'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      window.prompt('Copy this link', url())
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" aria-label="Share on Facebook" onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)} className={`${base} bg-[#1877F2]`}>
        {IFacebook('h-5 w-5')}
      </button>
      <button type="button" aria-label="Share on X" onClick={() => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url())}`)} className={`${base} bg-black`}>
        {IX('h-4 w-4')}
      </button>
      <button type="button" aria-label="Share on LinkedIn" onClick={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)} className={`${base} bg-[#0A66C2]`}>
        {ILinkedin('h-5 w-5')}
      </button>
      <button type="button" aria-label="Share on WhatsApp" onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`)} className={`${base} bg-[#25D366]`}>
        {IWhatsapp('h-5 w-5')}
      </button>
      <button type="button" aria-label={copied ? 'Link copied' : 'Copy link'} onClick={copy} className={`${base} ${copied ? 'bg-green-600' : 'bg-gray-700'}`}>
        {copied ? ICheck('h-5 w-5') : ILink('h-5 w-5')}
      </button>
      {copied && (
        <span role="status" className="text-sm font-semibold text-green-700">
          Link copied
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards used in the sidebar and at the bottom                        */
/* ------------------------------------------------------------------ */
const CtaCard = () => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl shadow-[#F41703]/25 ${brandGrad}`}>
    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15" aria-hidden="true" />
    <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-black/10" aria-hidden="true" />
    <div className="relative">
      <h3 className="text-xl font-bold leading-snug">Sourcing from China?</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/90">Tell us what you need made, and we'll come back with suppliers, samples, and a real landed cost.</p>
      <Link to={CONTACT_PATH} className={`group mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#F41703] shadow-lg transition-colors hover:bg-orange-50 focus-visible:ring-offset-[#F41703] ${ring}`}>
        Get a free consultation
        <span className="transition-transform group-hover:translate-x-1">{IArrow('h-4 w-4')}</span>
      </Link>
    </div>
  </div>
)

const Initial = ({ name, size = 'h-11 w-11 text-base' }) => (
  <span className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] font-bold text-white shadow-md shadow-[#F41703]/25`}>
    {(name || 'A').charAt(0).toUpperCase()}
  </span>
)

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coverOk, setCoverOk] = useState(true)
  const [activeId, setActiveId] = useState('')
  const [showTop, setShowTop] = useState(false)

  const articleRef = useRef(null)
  const barRef = useRef(null)

  /* ---------- data ---------- */
  useEffect(() => {
    let cancelled = false
    window.scrollTo(0, 0)
    setCoverOk(true)
    setRelatedBlogs([])

    const loadRelated = async (category, currentId) => {
      try {
        const result = await getPublishedBlogs({ category })
        if (!cancelled && result.success) {
          setRelatedBlogs(result.blogs.filter((b) => b._id !== currentId).slice(0, 3))
        }
      } catch (err) {
        console.error('Error fetching related blogs:', err)
      }
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getBlogBySlug(slug)
        if (cancelled) return
        if (result.success) {
          setBlog(result.blog)
          loadRelated(result.blog.category, result.blog._id)
        } else {
          setBlog(null)
          setError(result.message || 'Blog not found')
        }
      } catch (err) {
        console.error('Error fetching blog:', err)
        if (!cancelled) {
          setBlog(null)
          setError('Failed to load blog')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const content = useMemo(() => buildContent(blog?.content), [blog])
  const authorName = blog ? `${blog.author?.firstName || ''} ${blog.author?.lastName || ''}`.trim() || `${SITE_NAME} Team` : ''
  const readingTime = blog ? blog.readingTime || Math.max(1, Math.ceil(content.words / 200)) : 0

  /* ---------- SEO: title, description, structured data ---------- */
  useEffect(() => {
    if (!blog) return
    const prevTitle = document.title
    document.title = `${blog.title} | ${SITE_NAME} Blog`

    let meta = document.querySelector('meta[name="description"]')
    const createdMeta = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    const prevDesc = meta.getAttribute('content')
    if (blog.excerpt) meta.setAttribute('content', blog.excerpt)

    const ld = document.createElement('script')
    ld.type = 'application/ld+json'
    ld.id = 'blog-jsonld'
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt || undefined,
      image: blog.coverImage || undefined,
      datePublished: blog.publishedAt || blog.createdAt,
      dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
      author: { '@type': 'Person', name: authorName },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      mainEntityOfPage: window.location.href
    })
    document.head.appendChild(ld)

    return () => {
      document.title = prevTitle
      if (createdMeta) meta.remove()
      else if (prevDesc !== null) meta.setAttribute('content', prevDesc)
      ld.remove()
    }
  }, [blog, authorName])

  /* ---------- reading progress, active heading, back-to-top ---------- */
  useEffect(() => {
    if (!blog) return
    let ticking = false

    const update = () => {
      ticking = false
      const el = articleRef.current
      if (el && barRef.current) {
        const rect = el.getBoundingClientRect()
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / rect.height))
        barRef.current.style.transform = `scaleX(${progress})`
      }
      let current = ''
      for (const item of content.toc) {
        const h = document.getElementById(item.id)
        if (h && h.getBoundingClientRect().top <= 160) current = item.id
      }
      setActiveId((prev) => (prev === current ? prev : current))
      setShowTop(window.scrollY > 900)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [blog, content])

  const goToHeading = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nativeShare = () => {
    if (navigator.share) navigator.share({ title: blog.title, url: window.location.href }).catch(() => {})
  }

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-8 h-4 w-48 rounded bg-gray-200" />
            <div className="mb-5 h-7 w-28 rounded-full bg-gray-200" />
            <div className="mb-3 h-12 w-full rounded-lg bg-gray-200" />
            <div className="mb-8 h-12 w-3/4 rounded-lg bg-gray-200" />
            <div className="mb-10 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-3 w-32 rounded bg-gray-200" />
                <div className="h-3 w-48 rounded bg-gray-200" />
              </div>
            </div>
            <div className="mb-10 aspect-[16/8] rounded-3xl bg-gray-200" />
            <div className="space-y-4">
              {[100, 100, 83, 100, 66].map((w, i) => (
                <div key={i} className="h-4 rounded bg-gray-200" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- error ---------- */
  if (error || !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-xl shadow-[#F41703]/25 ${brandGrad}`}>
            <Svg className="h-10 w-10" sw={1.6}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M9.5 13.5l5 5M14.5 13.5l-5 5" /></Svg>
          </div>
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900">Article not found</h1>
          <p className="mb-8 text-gray-600">{error || 'The article you are looking for does not exist or has been moved.'}</p>
          <Link to="/blog" className={`inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold text-white shadow-lg shadow-[#F41703]/30 ${brandGrad} ${ring}`}>
            {IBack('h-4 w-4')} Back to all articles
          </Link>
        </div>
      </div>
    )
  }

  const hasToc = content.toc.length >= 2

  return (
    <div className="min-h-screen bg-white">
      <style>{ARTICLE_CSS}</style>

      {/* Reading progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1" aria-hidden="true">
        <div ref={barRef} className={`h-full origin-left ${brandGrad}`} style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* ============================ Header ============================ */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#FFF6F0] via-white to-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F97316]/10 blur-3xl" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(17,24,39,.07) 1px, transparent 1.4px)',
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 70%)',
            maskImage: 'linear-gradient(180deg, #000 0%, transparent 70%)'
          }}
          aria-hidden="true"
        />

        <div className="bd-rise relative mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center text-sm text-gray-500">
            <Link to="/" className={`rounded transition-colors hover:text-[#F41703] ${ring}`}>Home</Link>
            {IChevron('mx-1.5 h-4 w-4 flex-shrink-0 text-gray-300')}
            <Link to="/blog" className={`rounded transition-colors hover:text-[#F41703] ${ring}`}>Blog</Link>
            {IChevron('mx-1.5 h-4 w-4 flex-shrink-0 text-gray-300')}
            <span className="max-w-[12rem] truncate font-medium text-gray-800 sm:max-w-xs">{blog.title}</span>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-[#F41703]/25 ${brandGrad}`}>{blog.category}</span>
            {blog.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-semibold text-amber-800">
                {IStar('h-4 w-4 text-amber-500')} Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">{blog.title}</h1>

          {blog.excerpt && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-600">{blog.excerpt}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-gray-200/80 pt-6">
            <div className="flex items-center gap-3">
              <Initial name={authorName} />
              <div>
                <p className="text-sm font-bold text-gray-900">{authorName}</p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5">{ICalendar('h-4 w-4 text-[#F41703]')}{formatDate(blog.publishedAt || blog.createdAt)}</span>
              <span className="inline-flex items-center gap-1.5">{IClock('h-4 w-4 text-[#F41703]')}{readingTime} min read</span>
            </div>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button type="button" onClick={nativeShare} className={`ml-auto inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-[#F41703] hover:text-[#F41703] lg:hidden ${ring}`}>
                {IShare('h-4 w-4')} Share
              </button>
            )}
          </div>
        </div>

        {/* Cover image */}
        {blog.coverImage && coverOk && (
          <div className="bd-rise relative mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8" style={{ animationDelay: '120ms' }}>
            <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-2xl shadow-gray-900/15 ring-1 ring-black/5">
              <img
                src={blog.coverImage}
                alt={blog.coverImageAlt || blog.title}
                className="aspect-[16/8] w-full object-cover"
                onError={() => setCoverOk(false)}
              />
            </div>
          </div>
        )}
      </header>

      {/* ============================ Body ============================ */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:px-8 lg:py-16">
        <article ref={articleRef} className="min-w-0">
          {/* Table of contents on small screens */}
          {hasToc && (
            <details className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-gray-900">
                {IList('h-5 w-5 text-[#F41703]')} In this article
              </summary>
              <ol className="mt-4 space-y-2.5 border-l-2 border-gray-200 pl-4">
                {content.toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                    <a href={`#${item.id}`} onClick={(e) => goToHeading(e, item.id)} className="text-sm text-gray-600 hover:text-[#F41703]">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: content.html }} />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-8">
              <span className="mr-1 text-sm font-semibold text-gray-500">Tags</span>
              {blog.tags.map((tag, index) => (
                <span key={index} className="rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share (also the main share area on phones) */}
          <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-7 lg:hidden">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Share this article</h3>
            <ShareButtons title={blog.title} />
          </div>

          {/* Author */}
          <div className="mt-10 flex items-center gap-4 rounded-3xl border border-orange-100 bg-gradient-to-r from-[#FFF6F0] to-white p-6">
            <Initial name={authorName} size="h-14 w-14 text-xl" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#F41703]">Written by</p>
              <p className="truncate text-lg font-bold text-gray-900">{authorName}</p>
              <Link to="/blog" className={`mt-0.5 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-gray-600 hover:text-[#F41703] ${ring}`}>
                More articles {IArrow('h-3.5 w-3.5')}
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {hasToc && (
            <nav aria-label="Table of contents" className="hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900">
                {IList('h-4 w-4 text-[#F41703]')} In this article
              </h3>
              <ol className="max-h-[40vh] space-y-1 overflow-y-auto pr-1">
                {content.toc.map((item) => {
                  const on = activeId === item.id
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => goToHeading(e, item.id)}
                        aria-current={on ? 'location' : undefined}
                        className={`block rounded-lg border-l-2 py-1.5 text-sm leading-snug transition-all ${item.level === 3 ? 'pl-6' : 'pl-3'} ${
                          on ? 'border-[#F41703] bg-[#F41703]/5 font-semibold text-[#F41703]' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}

          <div className="hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:block">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-900">Share this article</h3>
            <ShareButtons title={blog.title} size="sm" />
          </div>

          <CtaCard />
        </aside>
      </div>

      {/* ======================== Related articles ======================== */}
      {relatedBlogs.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-[#F41703]">Keep reading</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Related articles</h2>
              </div>
              <Link to="/blog" className={`inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-[#F41703] hover:text-[#F41703] ${ring}`}>
                View all {IArrow('h-4 w-4')}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedBlogs.map((b) => (
                <Link
                  key={b._id}
                  to={`/blog/${b.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-900/10 ${ring}`}
                >
                  <div className={`relative h-52 overflow-hidden ${brandGrad}`}>
                    {b.coverImage && (
                      <img
                        src={b.coverImage}
                        alt={b.coverImageAlt || b.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#F41703] shadow">{b.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs font-medium text-gray-500">
                      <span>{formatDate(b.publishedAt || b.createdAt, true)}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span>{b.readingTime} min read</span>
                    </div>
                    <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#F41703]">{b.title}</h3>
                    <p className="line-clamp-2 flex-1 text-gray-600">{b.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#F41703]">
                      Read article <span className="transition-transform group-hover:translate-x-1">{IArrow('h-4 w-4')}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ Final CTA ============================ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className={`relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-2xl shadow-[#F41703]/25 sm:px-12 md:py-16 ${brandGrad}`}>
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" aria-hidden="true" />
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Ready to start your sourcing journey?</h2>
            <p className="mx-auto mt-4 text-lg text-white/90">From supplier discovery to final delivery, choose exactly the support you need.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={CONTACT_PATH} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-bold text-[#F41703] shadow-xl transition-colors hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#F41703]">
                Get a free consultation <span className="transition-transform group-hover:translate-x-1">{IArrow('h-4 w-4')}</span>
              </Link>
              <Link to={SERVICES_PATH} className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#F41703]">
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-white shadow-xl transition-all duration-300 hover:bg-[#F41703] ${ring} ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {IUp('h-5 w-5')}
      </button>
    </div>
  )
}

export default BlogDetail