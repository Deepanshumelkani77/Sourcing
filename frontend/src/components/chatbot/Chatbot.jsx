import React, { useState, useRef, useEffect, useCallback } from 'react'

// Configure API base URL
// For production: https://sourcing-x379.onrender.com/api
// For local development: /api (uses Vite proxy) or http://localhost:5000/api
const API_BASE_URL =
  import.meta.env.VITE_CHATBOT_API_URL || 'https://sourcing-x379.onrender.com/api'

/* Edit these to match the first questions your visitors ask */
const DEFAULT_QUICK_ACTIONS = [
  'Find a supplier',
  'Source machinery',
  'Quality inspection',
  'Shipping & logistics',
  'Get a quote'
]

const WELCOME = 'Hi 👋 Welcome to IndoChinaBridge! How can I help you with China sourcing today?'

const makeWelcome = () => ({
  id: 'welcome',
  type: 'bot',
  content: WELCOME,
  quickActions: DEFAULT_QUICK_ACTIONS,
  time: new Date()
})

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// Accepts ["text"] or [{label, value|action|text}] from your API
const normalizeActions = (list) =>
  (Array.isArray(list) ? list : [])
    .map((item) =>
      typeof item === 'string'
        ? { label: item, text: item }
        : {
            label: item.label || item.title || item.text || item.value,
            text: item.value || item.action || item.text || item.label
          }
    )
    .filter((a) => a.label && a.text)

// Safe mini-markdown: **bold**, links, line breaks (no dangerouslySetInnerHTML)
const renderContent = (text = '') =>
  String(text)
    .split('\n')
    .map((line, i, arr) => {
      const parts = line.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g).map((part, j) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={j}>{part.slice(2, -2)}</strong>
        if (/^https?:\/\//.test(part))
          return (
            <a key={j} href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          )
        return part
      })
      return (
        <React.Fragment key={i}>
          {parts}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      )
    })

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
const Svg = ({ children, size = 20, fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const ChatIcon = ({ size }) => (
  <Svg size={size}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
)
const CloseIcon = ({ size }) => (
  <Svg size={size}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
)
const SendIcon = ({ size }) => (
  <Svg size={size}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </Svg>
)
const ResetIcon = ({ size }) => (
  <Svg size={size}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Svg>
)
const BotIcon = ({ size }) => (
  <Svg size={size}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 8V4M9 13v1M15 13v1" />
    <circle cx="12" cy="3.5" r="1" />
  </Svg>
)

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => [makeWelcome()])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [showTeaser, setShowTeaser] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const lastTextRef = useRef({ text: '', quickAction: false })

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping, isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Auto-grow textarea (max ~4 lines)
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [inputValue, isOpen])

  // One-time greeting teaser
  useEffect(() => {
    const show = setTimeout(() => setShowTeaser(true), 3500)
    const hide = setTimeout(() => setShowTeaser(false), 12000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  // Escape closes
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const openChat = () => {
    setIsOpen(true)
    setHasOpened(true)
    setShowTeaser(false)
  }

  const sendMessage = useCallback(
    async (text, { quickAction = false, silent = false } = {}) => {
      const content = text.trim()
      if (!content) return

      lastTextRef.current = { text: content, quickAction }

      if (!silent) {
        setMessages((prev) => [
          ...prev,
          { id: `u-${Date.now()}`, type: 'user', content, time: new Date() }
        ])
      }
      setIsTyping(true)

      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            conversationId,
            ...(quickAction ? { quickAction: true } : {})
          })
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()

        if (data.conversationId) setConversationId(data.conversationId)

        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            type: 'bot',
            content: data.message,
            quickActions: data.quickActions,
            time: new Date()
          }
        ])
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            type: 'bot',
            error: true,
            content:
              'Sorry, something went wrong on our side. Please try again, or contact us directly.',
            time: new Date()
          }
        ])
      } finally {
        setIsTyping(false)
      }
    },
    [conversationId]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return
    const text = inputValue
    setInputValue('')
    sendMessage(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e)
  }

  const retry = () => {
    // drop the error bubble, resend the last text without duplicating the user bubble
    setMessages((prev) => prev.filter((m) => !m.error))
    sendMessage(lastTextRef.current.text, {
      quickAction: lastTextRef.current.quickAction,
      silent: true
    })
  }

  const resetChat = () => {
    setMessages([makeWelcome()])
    setConversationId(null)
    setInputValue('')
    setIsTyping(false)
    inputRef.current?.focus()
  }

  const lastMessageId = messages[messages.length - 1]?.id
  const canSend = inputValue.trim().length > 0 && !isTyping

  return (
    <>
      <style>{`
        .icb {
          --icb-red: #F41703;
          --icb-orange: #F97316;
          --icb-grad: linear-gradient(135deg, #F41703 0%, #F97316 100%);
          --icb-ink: #1F2430;
          --icb-muted: #6B7280;
          --icb-line: #ECEEF2;
          --icb-bot: #F3F4F7;
          font-family: inherit;
        }
        .icb *, .icb *::before, .icb *::after { box-sizing: border-box; }
        .icb button { font-family: inherit; }
        .icb :focus-visible { outline: 2px solid var(--icb-red); outline-offset: 2px; }

        /* ---------- Launcher ---------- */
        .icb-launcher {
          position: fixed; right: 24px; bottom: 24px; z-index: 9999;
          width: 62px; height: 62px; border: 0; border-radius: 50%;
          background: var(--icb-grad); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 28px rgba(244,23,3,.38), 0 2px 6px rgba(0,0,0,.12);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .icb-launcher:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 14px 34px rgba(244,23,3,.45), 0 2px 6px rgba(0,0,0,.12); }
        .icb-launcher:active { transform: scale(.96); }
        .icb-launcher.pulse::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--icb-red); animation: icb-ping 2.2s ease-out infinite;
        }
        .icb-badge {
          position: absolute; top: 2px; right: 2px; width: 14px; height: 14px;
          background: #22C55E; border: 2px solid #fff; border-radius: 50%;
        }

        .icb-teaser {
          position: fixed; right: 24px; bottom: 100px; z-index: 9998;
          max-width: 260px; padding: 14px 40px 14px 16px;
          background: #fff; color: var(--icb-ink); font-size: 14px; line-height: 1.45;
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 12px 32px rgba(17,24,39,.16), 0 0 0 1px rgba(17,24,39,.04);
          cursor: pointer; animation: icb-pop .35s cubic-bezier(.2,.9,.3,1.2);
        }
        .icb-teaser strong { display: block; margin-bottom: 2px; }
        .icb-teaser-close {
          position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border: 0;
          background: transparent; color: var(--icb-muted); border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .icb-teaser-close:hover { background: var(--icb-bot); }

        /* ---------- Window ---------- */
        .icb-window {
          position: fixed; right: 24px; bottom: 100px; z-index: 9999;
          width: 400px; max-width: calc(100vw - 32px);
          height: 640px; max-height: calc(100vh - 124px);
          display: flex; flex-direction: column; overflow: hidden;
          background: #fff; border-radius: 20px;
          box-shadow: 0 24px 64px rgba(17,24,39,.22), 0 0 0 1px rgba(17,24,39,.05);
          animation: icb-slide .3s cubic-bezier(.2,.8,.2,1);
          transform-origin: bottom right;
        }

        /* ---------- Header ---------- */
        .icb-header {
          position: relative; overflow: hidden; flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 18px 16px 18px 20px; color: #fff; background: var(--icb-grad);
        }
        .icb-header::before, .icb-header::after {
          content: ''; position: absolute; border-radius: 50%; background: rgba(255,255,255,.12); pointer-events: none;
        }
        .icb-header::before { width: 140px; height: 140px; top: -60px; right: -30px; }
        .icb-header::after { width: 90px; height: 90px; bottom: -50px; right: 90px; }
        .icb-head-left { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; min-width: 0; }
        .icb-avatar {
          position: relative; flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%;
          background: #fff; color: var(--icb-red);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,.15);
        }
        .icb-online {
          position: absolute; right: -1px; bottom: -1px; width: 12px; height: 12px;
          background: #22C55E; border: 2px solid #fff; border-radius: 50%;
        }
        .icb-title { margin: 0; font-size: 16px; font-weight: 700; letter-spacing: .1px; }
        .icb-sub { margin: 2px 0 0; font-size: 12.5px; opacity: .92; }
        .icb-head-actions { position: relative; z-index: 1; display: flex; gap: 6px; }
        .icb-icon-btn {
          width: 34px; height: 34px; border: 0; border-radius: 10px; cursor: pointer;
          background: rgba(255,255,255,.18); color: #fff;
          display: flex; align-items: center; justify-content: center; transition: background .2s;
        }
        .icb-icon-btn:hover { background: rgba(255,255,255,.32); }
        .icb-header :focus-visible { outline-color: #fff; }

        /* ---------- Messages ---------- */
        .icb-messages {
          flex: 1; overflow-y: auto; padding: 20px 16px 8px; background: #FAFAFC;
          display: flex; flex-direction: column; gap: 14px; scroll-behavior: smooth;
        }
        .icb-messages::-webkit-scrollbar { width: 6px; }
        .icb-messages::-webkit-scrollbar-thumb { background: #D5D8DF; border-radius: 3px; }
        .icb-messages::-webkit-scrollbar-thumb:hover { background: var(--icb-red); }

        .icb-row { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }
        .icb-row.user { flex-direction: row-reverse; }
        .icb-mini {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: var(--icb-grad); color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .icb-col { display: flex; flex-direction: column; gap: 4px; min-width: 0; max-width: 82%; }
        .icb-row.user .icb-col { align-items: flex-end; }

        .icb-bubble {
          padding: 11px 15px; font-size: 14.5px; line-height: 1.55; word-wrap: break-word; overflow-wrap: anywhere;
        }
        .icb-bubble.bot {
          background: #fff; color: var(--icb-ink);
          border: 1px solid var(--icb-line); border-radius: 18px 18px 18px 5px;
          box-shadow: 0 1px 2px rgba(17,24,39,.04);
        }
        .icb-bubble.bot.error { background: #FEF2F2; border-color: #FECACA; color: #991B1B; }
        .icb-bubble.user {
          background: var(--icb-grad); color: #fff; border-radius: 18px 18px 5px 18px;
          box-shadow: 0 4px 12px rgba(244,23,3,.22);
        }
        .icb-bubble a { color: var(--icb-red); text-decoration: underline; text-underline-offset: 2px; }
        .icb-bubble.user a { color: #fff; }
        .icb-time { font-size: 11px; color: #9AA0AC; padding: 0 4px; }

        .icb-retry {
          align-self: flex-start; margin-top: 2px; padding: 6px 12px; border-radius: 999px;
          border: 1px solid #FECACA; background: #fff; color: #B91C1C; font-size: 12.5px; font-weight: 600; cursor: pointer;
        }
        .icb-retry:hover { background: #FEE2E2; }

        /* ---------- Quick replies ---------- */
        .icb-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 2px 0 0 36px; }
        .icb-chip {
          padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
          color: var(--icb-red); background: #fff;
          border: 1.5px solid rgba(244,23,3,.28); border-radius: 999px;
          transition: all .18s ease;
        }
        .icb-chip:hover { background: var(--icb-grad); border-color: transparent; color: #fff; transform: translateY(-1px); box-shadow: 0 6px 14px rgba(244,23,3,.25); }
        .icb-chip:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ---------- Typing ---------- */
        .icb-typing { display: flex; gap: 5px; padding: 6px 2px; }
        .icb-typing span { width: 7px; height: 7px; border-radius: 50%; background: #B4B9C4; animation: icb-bounce 1.3s infinite; }
        .icb-typing span:nth-child(2) { animation-delay: .15s; }
        .icb-typing span:nth-child(3) { animation-delay: .3s; }

        /* ---------- Composer ---------- */
        .icb-composer { flex-shrink: 0; padding: 12px 16px 10px; background: #fff; border-top: 1px solid var(--icb-line); }
        .icb-field {
          display: flex; align-items: flex-end; gap: 8px; padding: 6px 6px 6px 16px;
          background: #F6F7F9; border: 1.5px solid transparent; border-radius: 24px;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .icb-field:focus-within { background: #fff; border-color: var(--icb-red); box-shadow: 0 0 0 4px rgba(244,23,3,.10); }
        .icb-textarea {
          flex: 1; resize: none; border: 0; outline: none; background: transparent;
          padding: 9px 0; font: inherit; font-size: 14.5px; line-height: 1.4; color: var(--icb-ink); max-height: 96px;
        }
        .icb-textarea::placeholder { color: #9AA0AC; }
        .icb-send {
          flex-shrink: 0; width: 40px; height: 40px; border: 0; border-radius: 50%;
          background: var(--icb-grad); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform .15s, opacity .2s, box-shadow .2s;
          box-shadow: 0 4px 10px rgba(244,23,3,.3);
        }
        .icb-send:hover:not(:disabled) { transform: scale(1.08); }
        .icb-send:disabled { opacity: .35; cursor: not-allowed; box-shadow: none; }
        .icb-foot { margin: 8px 0 0; text-align: center; font-size: 11px; color: #9AA0AC; }
        .icb-foot b { color: var(--icb-muted); font-weight: 600; }

        /* ---------- Motion ---------- */
        @keyframes icb-slide { from { opacity: 0; transform: translateY(16px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes icb-pop { from { opacity: 0; transform: translateY(8px) scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes icb-ping { 0% { transform: scale(1); opacity: .6; } 80%, 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes icb-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .6; } 30% { transform: translateY(-6px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .icb *, .icb *::before, .icb *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        }

        /* ---------- Mobile: full-screen sheet ---------- */
        @media (max-width: 480px) {
          .icb-window { right: 0; bottom: 0; width: 100vw; max-width: none; height: 100dvh; max-height: none; border-radius: 0; }
          .icb-launcher { right: 16px; bottom: 16px; width: 56px; height: 56px; }
          .icb-launcher.hide-mobile { display: none; }
          .icb-teaser { right: 16px; bottom: 84px; }
          .icb-col { max-width: 86%; }
        }
      `}</style>

      <div className="icb">
        {/* Greeting teaser */}
        {!isOpen && showTeaser && (
          <div className="icb-teaser" role="status" onClick={openChat}>
            <strong>Need help sourcing from China?</strong>
            Ask our assistant about suppliers, quality checks or shipping.
            <button
              className="icb-teaser-close"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation()
                setShowTeaser(false)
              }}
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Launcher */}
        <button
          className={`icb-launcher ${!hasOpened && !isOpen ? 'pulse' : ''} ${isOpen ? 'hide-mobile' : ''}`}
          onClick={() => (isOpen ? setIsOpen(false) : openChat())}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
        >
          {isOpen ? <CloseIcon size={26} /> : <ChatIcon size={26} />}
          {!isOpen && <span className="icb-badge" aria-hidden="true" />}
        </button>

        {/* Chat window */}
        {isOpen && (
          <section className="icb-window" role="dialog" aria-label="Chat with ICB Assistant">
            {/* Header */}
            <header className="icb-header">
              <div className="icb-head-left">
                <div className="icb-avatar">
                  <BotIcon size={24} />
                  <span className="icb-online" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="icb-title">ICB Assistant</h3>
                  <p className="icb-sub">IndoChinaBridge · Online</p>
                </div>
              </div>
              <div className="icb-head-actions">
                <button className="icb-icon-btn" onClick={resetChat} aria-label="Start new chat" title="New chat">
                  <ResetIcon size={17} />
                </button>
                <button className="icb-icon-btn" onClick={() => setIsOpen(false)} aria-label="Close chat" title="Close">
                  <CloseIcon size={19} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="icb-messages" role="log" aria-live="polite">
              {messages.map((m) => {
                const actions = normalizeActions(m.quickActions)
                const showActions =
                  m.type === 'bot' && m.id === lastMessageId && !isTyping && actions.length > 0

                return (
                  <React.Fragment key={m.id}>
                    <div className={`icb-row ${m.type}`}>
                      {m.type === 'bot' && (
                        <div className="icb-mini">
                          <BotIcon size={15} />
                        </div>
                      )}
                      <div className="icb-col">
                        <div className={`icb-bubble ${m.type} ${m.error ? 'error' : ''}`}>
                          {renderContent(m.content)}
                        </div>
                        {m.error && m.id === lastMessageId && (
                          <button className="icb-retry" onClick={retry}>
                            Try again
                          </button>
                        )}
                        <span className="icb-time">{formatTime(m.time)}</span>
                      </div>
                    </div>

                    {showActions && (
                      <div className="icb-chips">
                        {actions.map((a) => (
                          <button
                            key={a.label}
                            className="icb-chip"
                            disabled={isTyping}
                            onClick={() => sendMessage(a.text, { quickAction: true })}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )
              })}

              {isTyping && (
                <div className="icb-row bot">
                  <div className="icb-mini">
                    <BotIcon size={15} />
                  </div>
                  <div className="icb-bubble bot" aria-label="Assistant is typing">
                    <div className="icb-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form className="icb-composer" onSubmit={handleSubmit}>
              <div className="icb-field">
                <textarea
                  ref={inputRef}
                  className="icb-textarea"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  aria-label="Message"
                />
                <button type="submit" className="icb-send" disabled={!canSend} aria-label="Send message">
                  <SendIcon size={18} />
                </button>
              </div>
              <p className="icb-foot">
                Powered by <b>IndoChinaBridge</b>
              </p>
            </form>
          </section>
        )}
      </div>
    </>
  )
}

export default Chatbot