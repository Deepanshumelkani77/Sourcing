import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import {
  sendSignupOTP,
  verifySignupOTP,
  signup,
  login,
  forgotPassword
} from '../services/authApi'

/* ------------------------------------------------------------------ */
/* Country data: [iso, name, dial code without "+"]                    */
/* ------------------------------------------------------------------ */
const RAW_COUNTRIES = [
  ['af', 'Afghanistan', '93'], ['al', 'Albania', '355'], ['dz', 'Algeria', '213'], ['as', 'American Samoa', '1'],
  ['ad', 'Andorra', '376'], ['ao', 'Angola', '244'], ['ai', 'Anguilla', '1'], ['ag', 'Antigua and Barbuda', '1'],
  ['ar', 'Argentina', '54'], ['am', 'Armenia', '374'], ['aw', 'Aruba', '297'], ['au', 'Australia', '61'],
  ['at', 'Austria', '43'], ['az', 'Azerbaijan', '994'], ['bs', 'Bahamas', '1'], ['bh', 'Bahrain', '973'],
  ['bd', 'Bangladesh', '880'], ['bb', 'Barbados', '1'], ['by', 'Belarus', '375'], ['be', 'Belgium', '32'],
  ['bz', 'Belize', '501'], ['bj', 'Benin', '229'], ['bm', 'Bermuda', '1'], ['bt', 'Bhutan', '975'],
  ['bo', 'Bolivia', '591'], ['ba', 'Bosnia and Herzegovina', '387'], ['bw', 'Botswana', '267'], ['br', 'Brazil', '55'],
  ['vg', 'British Virgin Islands', '1'], ['bn', 'Brunei', '673'], ['bg', 'Bulgaria', '359'], ['bf', 'Burkina Faso', '226'],
  ['bi', 'Burundi', '257'], ['kh', 'Cambodia', '855'], ['cm', 'Cameroon', '237'], ['ca', 'Canada', '1'],
  ['cv', 'Cape Verde', '238'], ['ky', 'Cayman Islands', '1'], ['cf', 'Central African Republic', '236'], ['td', 'Chad', '235'],
  ['cl', 'Chile', '56'], ['cn', 'China', '86'], ['co', 'Colombia', '57'], ['km', 'Comoros', '269'],
  ['cg', 'Congo', '242'], ['cd', 'DR Congo', '243'], ['ck', 'Cook Islands', '682'], ['cr', 'Costa Rica', '506'],
  ['ci', "Côte d'Ivoire", '225'], ['hr', 'Croatia', '385'], ['cu', 'Cuba', '53'], ['cw', 'Curaçao', '599'],
  ['cy', 'Cyprus', '357'], ['cz', 'Czech Republic', '420'], ['dk', 'Denmark', '45'], ['dj', 'Djibouti', '253'],
  ['dm', 'Dominica', '1'], ['do', 'Dominican Republic', '1'], ['ec', 'Ecuador', '593'], ['eg', 'Egypt', '20'],
  ['sv', 'El Salvador', '503'], ['gq', 'Equatorial Guinea', '240'], ['er', 'Eritrea', '291'], ['ee', 'Estonia', '372'],
  ['sz', 'Eswatini', '268'], ['et', 'Ethiopia', '251'], ['fk', 'Falkland Islands', '500'], ['fo', 'Faroe Islands', '298'],
  ['fj', 'Fiji', '679'], ['fi', 'Finland', '358'], ['fr', 'France', '33'], ['gf', 'French Guiana', '594'],
  ['pf', 'French Polynesia', '689'], ['ga', 'Gabon', '241'], ['gm', 'Gambia', '220'], ['ge', 'Georgia', '995'],
  ['de', 'Germany', '49'], ['gh', 'Ghana', '233'], ['gi', 'Gibraltar', '350'], ['gr', 'Greece', '30'],
  ['gl', 'Greenland', '299'], ['gd', 'Grenada', '1'], ['gp', 'Guadeloupe', '590'], ['gu', 'Guam', '1'],
  ['gt', 'Guatemala', '502'], ['gg', 'Guernsey', '44'], ['gn', 'Guinea', '224'], ['gw', 'Guinea-Bissau', '245'],
  ['gy', 'Guyana', '592'], ['ht', 'Haiti', '509'], ['hn', 'Honduras', '504'], ['hk', 'Hong Kong', '852'],
  ['hu', 'Hungary', '36'], ['is', 'Iceland', '354'], ['in', 'India', '91'], ['id', 'Indonesia', '62'],
  ['ir', 'Iran', '98'], ['iq', 'Iraq', '964'], ['ie', 'Ireland', '353'], ['im', 'Isle of Man', '44'],
  ['il', 'Israel', '972'], ['it', 'Italy', '39'], ['jm', 'Jamaica', '1'], ['jp', 'Japan', '81'],
  ['je', 'Jersey', '44'], ['jo', 'Jordan', '962'], ['kz', 'Kazakhstan', '7'], ['ke', 'Kenya', '254'],
  ['ki', 'Kiribati', '686'], ['xk', 'Kosovo', '383'], ['kw', 'Kuwait', '965'], ['kg', 'Kyrgyzstan', '996'],
  ['la', 'Laos', '856'], ['lv', 'Latvia', '371'], ['lb', 'Lebanon', '961'], ['ls', 'Lesotho', '266'],
  ['lr', 'Liberia', '231'], ['ly', 'Libya', '218'], ['li', 'Liechtenstein', '423'], ['lt', 'Lithuania', '370'],
  ['lu', 'Luxembourg', '352'], ['mo', 'Macau', '853'], ['mk', 'North Macedonia', '389'], ['mg', 'Madagascar', '261'],
  ['mw', 'Malawi', '265'], ['my', 'Malaysia', '60'], ['mv', 'Maldives', '960'], ['ml', 'Mali', '223'],
  ['mt', 'Malta', '356'], ['mh', 'Marshall Islands', '692'], ['mq', 'Martinique', '596'], ['mr', 'Mauritania', '222'],
  ['mu', 'Mauritius', '230'], ['yt', 'Mayotte', '262'], ['mx', 'Mexico', '52'], ['fm', 'Micronesia', '691'],
  ['md', 'Moldova', '373'], ['mc', 'Monaco', '377'], ['mn', 'Mongolia', '976'], ['me', 'Montenegro', '382'],
  ['ms', 'Montserrat', '1'], ['ma', 'Morocco', '212'], ['mz', 'Mozambique', '258'], ['mm', 'Myanmar', '95'],
  ['na', 'Namibia', '264'], ['nr', 'Nauru', '674'], ['np', 'Nepal', '977'], ['nl', 'Netherlands', '31'],
  ['nc', 'New Caledonia', '687'], ['nz', 'New Zealand', '64'], ['ni', 'Nicaragua', '505'], ['ne', 'Niger', '227'],
  ['ng', 'Nigeria', '234'], ['nu', 'Niue', '683'], ['kp', 'North Korea', '850'], ['mp', 'Northern Mariana Islands', '1'],
  ['no', 'Norway', '47'], ['om', 'Oman', '968'], ['pk', 'Pakistan', '92'], ['pw', 'Palau', '680'],
  ['ps', 'Palestine', '970'], ['pa', 'Panama', '507'], ['pg', 'Papua New Guinea', '675'], ['py', 'Paraguay', '595'],
  ['pe', 'Peru', '51'], ['ph', 'Philippines', '63'], ['pl', 'Poland', '48'], ['pt', 'Portugal', '351'],
  ['pr', 'Puerto Rico', '1'], ['qa', 'Qatar', '974'], ['re', 'Réunion', '262'], ['ro', 'Romania', '40'],
  ['ru', 'Russia', '7'], ['rw', 'Rwanda', '250'], ['bl', 'Saint Barthélemy', '590'], ['sh', 'Saint Helena', '290'],
  ['kn', 'Saint Kitts and Nevis', '1'], ['lc', 'Saint Lucia', '1'], ['mf', 'Saint Martin', '590'],
  ['pm', 'Saint Pierre and Miquelon', '508'], ['vc', 'Saint Vincent and the Grenadines', '1'], ['ws', 'Samoa', '685'],
  ['sm', 'San Marino', '378'], ['st', 'Sao Tome and Principe', '239'], ['sa', 'Saudi Arabia', '966'], ['sn', 'Senegal', '221'],
  ['rs', 'Serbia', '381'], ['sc', 'Seychelles', '248'], ['sl', 'Sierra Leone', '232'], ['sg', 'Singapore', '65'],
  ['sx', 'Sint Maarten', '1'], ['sk', 'Slovakia', '421'], ['si', 'Slovenia', '386'], ['sb', 'Solomon Islands', '677'],
  ['so', 'Somalia', '252'], ['za', 'South Africa', '27'], ['gs', 'South Georgia and the South Sandwich Islands', '500'],
  ['kr', 'South Korea', '82'], ['ss', 'South Sudan', '211'], ['es', 'Spain', '34'], ['lk', 'Sri Lanka', '94'],
  ['sd', 'Sudan', '249'], ['sr', 'Suriname', '597'], ['sj', 'Svalbard and Jan Mayen', '47'], ['se', 'Sweden', '46'],
  ['ch', 'Switzerland', '41'], ['sy', 'Syria', '963'], ['tw', 'Taiwan', '886'], ['tj', 'Tajikistan', '992'],
  ['tz', 'Tanzania', '255'], ['th', 'Thailand', '66'], ['tl', 'Timor-Leste', '670'], ['tg', 'Togo', '228'],
  ['tk', 'Tokelau', '690'], ['to', 'Tonga', '676'], ['tt', 'Trinidad and Tobago', '1'], ['tn', 'Tunisia', '216'],
  ['tr', 'Turkey', '90'], ['tm', 'Turkmenistan', '993'], ['tc', 'Turks and Caicos Islands', '1'], ['tv', 'Tuvalu', '688'],
  ['ae', 'United Arab Emirates', '971'], ['gb', 'United Kingdom', '44'], ['us', 'United States', '1'], ['ua', 'Ukraine', '380'],
  ['uy', 'Uruguay', '598'], ['uz', 'Uzbekistan', '998'], ['vu', 'Vanuatu', '678'], ['va', 'Vatican City', '379'],
  ['ve', 'Venezuela', '58'], ['vn', 'Vietnam', '84'], ['vi', 'US Virgin Islands', '1'], ['wf', 'Wallis and Futuna', '681'],
  ['ye', 'Yemen', '967'], ['zm', 'Zambia', '260'], ['zw', 'Zimbabwe', '263']
]

/* Extra search words, so "uae", "usa" or "uk" find the right country */
const ALIASES = {
  ae: 'uae emirates', us: 'usa america', gb: 'uk britain england', kr: 'korea', cz: 'czechia',
  ci: 'ivory coast', mm: 'burma', sz: 'swaziland', cv: 'cabo verde', mk: 'macedonia', tl: 'east timor', cd: 'congo kinshasa'
}

const COUNTRIES = RAW_COUNTRIES.map(([iso, name, dial]) => ({
  iso,
  name,
  dial,
  code: `+${dial}`,
  search: `${name} ${ALIASES[iso] || ''}`.toLowerCase()
})).sort((a, b) => a.name.localeCompare(b.name, 'en'))

const COUNTRY_BY_ISO = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]))
const POPULAR = ['in', 'ae', 'cn', 'sa', 'us', 'gb', 'sg'].map((iso) => COUNTRY_BY_ISO[iso])
const DEFAULT_ISO = 'in'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                */
/* ------------------------------------------------------------------ */

/* Flag from the flag-icons CSS. If the CSS cannot load, the ISO code shows instead. */
const Flag = ({ iso }) => (
  <span className="relative inline-flex h-[18px] w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-gray-100 text-[8px] font-bold leading-none text-gray-400 ring-1 ring-black/10">
    {iso.toUpperCase()}
    <span
      className={`fi fi-${iso}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover' }}
    />
  </span>
)

const EyeToggle = ({ shown, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={shown ? 'Hide password' : 'Show password'}
    className="absolute right-2 top-1/2 -translate-y-1/2 rounded text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703]"
  >
    {shown ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.973 9.973 0 012.223-3.607" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.88 9.88a3 3 0 104.24 4.24" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
)

const SocialButtons = ({ onSocial }) => (
  <div className="mt-3">
    <div className="my-3 flex items-center gap-3">
      <hr className="flex-1 border-t border-gray-200" />
      <span className="text-xs text-gray-400 sm:text-sm">or continue with</span>
      <hr className="flex-1 border-t border-gray-200" />
    </div>
    <div className="flex gap-3">
      <button type="button" onClick={() => onSocial('google')} className="flex flex-1 items-center justify-center gap-2 rounded-md border px-2 py-2 hover:bg-gray-50 sm:gap-3 sm:px-3">
        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.2 9.23 3.15l6.9-6.9C36.6 2.48 30.63 0 24 0 14.73 0 6.95 5.24 3.02 12.9l7.99 6.2C12.99 13.12 17.98 9.5 24 9.5z" />
          <path fill="#34A853" d="M46.5 24c0-1.62-.14-3.19-.4-4.7H24v9.02h12.7c-.55 2.98-2.43 5.5-5.18 7.18l7.92 6.15C43.9 39.1 46.5 32.1 46.5 24z" />
          <path fill="#4A90E2" d="M10.99 28.1A14.9 14.9 0 0112 24c0-1.33-.2-2.62-.58-3.84L3.44 13.96A24 24 0 000 24c0 3.94.96 7.65 2.7 10.95l8.29-6.85z" />
          <path fill="#FBBC05" d="M24 48c6.63 0 12.6-2.19 17.27-5.96l-8.4-6.55C29.02 36.4 26.02 37.5 24 37.5c-6.02 0-11.01-3.62-12.99-8.14l-8 6.02C6.95 42.76 14.73 48 24 48z" />
        </svg>
        <span className="text-xs sm:text-sm">Google</span>
      </button>
      <button type="button" onClick={() => onSocial('facebook')} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1877F2] px-2 py-2 text-white hover:brightness-95 sm:gap-3 sm:px-3">
        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#ffffff" d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.793.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.315h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z" />
        </svg>
        <span className="text-xs sm:text-sm">Facebook</span>
      </button>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Country code dropdown: flags, search, keyboard support              */
/* ------------------------------------------------------------------ */
const CountryCodeSelect = ({ value, onChange }) => {
  const uid = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(null)

  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const searchRef = useRef(null)

  const selected = COUNTRY_BY_ISO[value] || COUNTRY_BY_ISO[DEFAULT_ISO]
  const q = query.trim().toLowerCase().replace(/^\+/, '')

  const groups = useMemo(() => {
    if (!q) {
      return [
        { label: 'Popular', items: POPULAR },
        { label: 'All countries', items: COUNTRIES }
      ]
    }
    const items = COUNTRIES.filter((c) => c.search.includes(q) || c.dial.startsWith(q) || c.iso === q).sort(
      (a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q))
    )
    return [{ label: null, items }]
  }, [q])

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])

  /* Place the panel next to the trigger. It is position:fixed, so the modal's overflow never clips it. */
  const place = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(340, vw - 24)
    const left = Math.min(Math.max(12, r.left), vw - width - 12)
    const spaceBelow = vh - r.bottom - 16
    const spaceAbove = r.top - 16
    const openUp = spaceBelow < 300 && spaceAbove > spaceBelow
    setPos({
      left,
      width,
      top: openUp ? undefined : r.bottom + 6,
      bottom: openUp ? vh - r.top + 6 : undefined,
      maxHeight: Math.max(220, Math.min(380, openUp ? spaceAbove : spaceBelow)),
      openUp
    })
  }, [])

  useLayoutEffect(() => {
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    const t = setTimeout(() => searchRef.current?.focus(), 0)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      clearTimeout(t)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, uid, groups])

  const openPanel = () => {
    setQuery('')
    const inPopular = POPULAR.findIndex((c) => c.iso === selected.iso)
    setActive(inPopular >= 0 ? inPopular : POPULAR.length + COUNTRIES.findIndex((c) => c.iso === selected.iso))
    setOpen(true)
  }

  const choose = (c) => {
    onChange(c.iso)
    setOpen(false)
    btnRef.current?.focus()
  }

  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(Math.max(flat.length - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) choose(flat[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      btnRef.current?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openPanel()
    }
  }

  let optionIndex = -1

  return (
    <>
      <style>{`@keyframes ccs-in { from { opacity: 0; transform: translateY(-6px) scale(.98) } to { opacity: 1; transform: none } }
      @media (prefers-reduced-motion: reduce) { .ccs-panel { animation: none !important } }`}</style>

      <button
        ref={btnRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} ${selected.code}`}
        className={`flex min-w-[104px] flex-shrink-0 items-center gap-2 self-stretch rounded-md border bg-white px-2.5 text-xs transition sm:text-sm ${
          open ? 'border-[#F41703] ring-2 ring-[#F41703]/20' : 'border-gray-200 hover:border-gray-300'
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F41703]`}
      >
        <Flag iso={selected.iso} />
        <span className="font-medium tabular-nums text-gray-800">{selected.code}</span>
        <svg className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          className="ccs-panel fixed z-[1100] flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/20"
          style={{
            left: pos.left,
            width: pos.width,
            top: pos.top,
            bottom: pos.bottom,
            maxHeight: pos.maxHeight,
            transformOrigin: pos.openUp ? 'bottom left' : 'top left',
            animation: 'ccs-in .15s ease-out'
          }}
        >
          {/* Search */}
          <div className="border-b border-gray-100 p-2.5">
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onSearchKeyDown}
                placeholder="Search country or code"
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-list`}
                aria-activedescendant={flat.length ? `${uid}-opt-${active}` : undefined}
                aria-label="Search countries"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#F41703] focus:bg-white focus:ring-2 focus:ring-[#F41703]/15"
              />
            </div>
          </div>

          {/* List */}
          <ul id={`${uid}-list`} role="listbox" aria-label="Country codes" className="min-h-0 flex-1 overflow-y-auto py-1 [scrollbar-width:thin]">
            {flat.length === 0 && (
              <li role="presentation" className="px-4 py-8 text-center text-sm text-gray-500">
                No countries found for "{query}"
              </li>
            )}

            {groups.map((g, gi) => (
              <React.Fragment key={gi}>
                {g.label && (
                  <li role="presentation" className="sticky top-0 z-10 bg-white/95 px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 backdrop-blur">
                    {g.label}
                  </li>
                )}
                {g.items.map((c) => {
                  optionIndex += 1
                  const i = optionIndex
                  const isSelected = c.iso === selected.iso
                  return (
                    <li
                      key={`${gi}-${c.iso}`}
                      id={`${uid}-opt-${i}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(c)}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${i === active ? 'bg-orange-50' : ''} ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                    >
                      <Flag iso={c.iso} />
                      <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      <span className="flex-shrink-0 tabular-nums text-gray-500">{c.code}</span>
                      {isSelected && (
                        <svg className="h-4 w-4 flex-shrink-0 text-[#F41703]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  )
                })}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Signup / Login modal                                               */
/* ------------------------------------------------------------------ */
const Signup = () => {
  const navigate = useNavigate()
  const { showSignup, signupMode, closeSignup, setSignupMode } = useContext(AppContext)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ firstName: '', middleName: '', lastName: '', email: '', phone: '', password: '' })
  const [countryIso, setCountryIso] = useState(DEFAULT_ISO)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [userCaptcha, setUserCaptcha] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpVerified, setEmailOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const selectedCountry = COUNTRY_BY_ISO[countryIso] || COUNTRY_BY_ISO[DEFAULT_ISO]

  useEffect(() => {
    if (!showSignup) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    generateCaptcha()
    return () => {
      document.body.style.overflow = original
    }
  }, [showSignup])

  /* Flag icons stylesheet: loaded once and kept, so flags never flash in late on reopen */
  useEffect(() => {
    if (!showSignup || document.getElementById('flag-icons-css')) return
    const link = document.createElement('link')
    link.id = 'flag-icons-css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css'
    document.head.appendChild(link)
  }, [showSignup])

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setUserCaptcha('')
  }

  if (!showSignup) return null

  const close = () => closeSignup()

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSignupChange = (e) => {
    const { name } = e.target
    let { value } = e.target
    // phone: digits only, so spaces, dashes or a typed "+" never break validation
    if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 15)
    setSignupData({ ...signupData, [name]: value })
    setError('')

    if (name === 'email') {
      setEmailOtpSent(false)
      setEmailOtp('')
      setEmailOtpVerified(false)
      setOtpError('')
    }
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (userCaptcha.trim().toLowerCase() !== captcha.trim().toLowerCase()) {
      setError('Please enter the correct CAPTCHA code')
      generateCaptcha()
      return
    }

    if (!EMAIL_REGEX.test(loginData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (loginData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      setLoading(true)
      const result = await login(loginData.email, loginData.password)

      if (result.success) {
        close()
        window.location.reload()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
    } else if (provider === 'facebook') {
      window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/facebook`
    } else {
      console.log(`${provider} OAuth is not configured yet`)
    }
  }

  const sendEmailOtp = async () => {
    setOtpError('')

    if (!EMAIL_REGEX.test(signupData.email)) {
      setOtpError('Please enter a valid email address first')
      return
    }

    try {
      setOtpLoading(true)
      const result = await sendSignupOTP(signupData.email)

      if (result.success) {
        setEmailOtpSent(true)
        setEmailOtpVerified(false)
        setEmailOtp('')
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Unable to send OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyEmailOtp = async () => {
    setOtpError('')

    if (emailOtp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setOtpLoading(true)
      const result = await verifySignupOTP(signupData.email, emailOtp)

      if (result.success) {
        setEmailOtpVerified(true)
        setOtpError('')
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const submitSignup = async (e) => {
    e.preventDefault()
    setError('')

    const phoneRegex = /^[0-9]{7,15}$/

    if (!signupData.firstName.trim()) {
      setError('Please enter your first name')
      return
    }

    if (!signupData.lastName.trim()) {
      setError('Please enter your last name')
      return
    }

    if (!EMAIL_REGEX.test(signupData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!phoneRegex.test(signupData.phone)) {
      setError('Please enter a valid phone number')
      return
    }

    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!emailOtpVerified) {
      setError('Please verify your email before creating your account')
      return
    }

    try {
      setLoading(true)
      const result = await signup({
        firstName: signupData.firstName,
        middleName: signupData.middleName,
        lastName: signupData.lastName,
        email: signupData.email,
        phone: `${selectedCountry.code}${signupData.phone}`,
        password: signupData.password,
        emailVerified: true
      })

      if (result.success) {
        // Switch to login mode after successful signup
        setSignupMode('login')
        setLoginData({ email: signupData.email, password: '' })
        setSignupData({ firstName: '', middleName: '', lastName: '', email: '', phone: '', password: '' })
        setEmailOtpSent(false)
        setEmailOtpVerified(false)
        setEmailOtp('')
        setError('')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotError('')

    if (!EMAIL_REGEX.test(forgotEmail)) {
      setForgotError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      await forgotPassword(forgotEmail)
      setForgotSuccess(true)
      setForgotEmail('')
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={close}></div>

        <div className="relative mx-2 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl sm:mx-4 md:grid-cols-2">
          {/* Left - marketing / toggle with sourcing image */}
          <div className="relative hidden flex-col gap-6 overflow-hidden p-8 text-white md:flex">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F41703]/75 via-[#F41703]/80 to-[#F41703]/75" />

            <div className="relative flex-1">
              <h2 className="mb-2 text-2xl font-semibold">Welcome to IndoChinaBridge</h2>
              <p className="text-sm text-red-100">Your trusted partner for sourcing machinery and products from China.</p>
            </div>

            {/* Promo card */}
            <div className="relative flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div>
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">Exclusive Offer</p>
                <p className="text-sm font-semibold leading-snug">
                  Get free sourcing
                  <br />
                  consultation today
                </p>
              </div>
              <button
                onClick={() => {
                  close()
                  navigate('/contact')
                }}
                className="shrink-0 cursor-pointer rounded-full bg-[#F97316] px-3 py-1.5 text-xs font-bold transition-colors hover:bg-[#e86a15]"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right - forms */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{signupMode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
                <p className="mt-1 text-sm text-gray-500">{signupMode === 'login' ? 'Enter credentials to access your account securely.' : 'Fill the details below to create your account.'}</p>
              </div>
              <button onClick={close} aria-label="Close" className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {signupMode === 'login' ? (
              <form onSubmit={submitLogin} className="space-y-3 sm:space-y-4">
                <div>
                  <input name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Email address or phone number" required className="w-full rounded-md border border-gray-200 px-2 py-2 text-xs placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:px-3 sm:py-2.5 sm:text-sm" />
                </div>
                <div>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={handleLoginChange} placeholder="Password" required className="w-full rounded-md border border-gray-200 px-2 py-2 pr-9 text-xs placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:px-3 sm:py-2.5 sm:text-sm" />
                    <EyeToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />
                  </div>
                </div>
                <div>
                  <div className="flex gap-1 sm:gap-2">
                    <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Enter CAPTCHA" required className="flex-1 rounded-md border border-gray-200 px-2 py-2 text-xs placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:px-3 sm:text-sm" />
                    <div className="flex min-w-[60px] flex-shrink-0 select-none items-center justify-center rounded-md border border-gray-300 bg-gray-100 px-2 py-2 font-mono text-sm tracking-wider sm:min-w-[80px] sm:px-3 sm:text-base">
                      {captcha}
                    </div>
                    <button type="button" onClick={generateCaptcha} className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700" aria-label="Refresh CAPTCHA">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                {error && <div className="text-xs text-red-600 sm:text-sm">{error}</div>}
                <button type="submit" disabled={loading} className="w-full rounded-md bg-[#F41703] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d31402] disabled:opacity-60 sm:py-3 sm:text-base">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="flex flex-col items-center justify-between gap-2 text-xs text-gray-600 sm:flex-row sm:gap-0 sm:text-sm">
                  <span>Don't have an account? <button type="button" onClick={() => setSignupMode('signup')} className="font-semibold text-[#F41703]">Sign up</button></span>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[#F97316] hover:underline">Forgot password?</button>
                </div>

                <SocialButtons onSocial={handleSocialLogin} />
              </form>
            ) : (
              <form onSubmit={submitSignup} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <input name="firstName" value={signupData.firstName} onChange={handleSignupChange} placeholder="First name *" required className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:py-2.5 sm:text-base" />
                  </div>
                  <div>
                    <input name="middleName" value={signupData.middleName} onChange={handleSignupChange} placeholder="Middle name" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:py-2.5 sm:text-base" />
                  </div>
                  <div>
                    <input name="lastName" value={signupData.lastName} onChange={handleSignupChange} placeholder="Last name *" required className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:py-2.5 sm:text-base" />
                  </div>
                </div>

                <div>
                  <div className="flex gap-1 sm:gap-2">
                    <input name="email" type="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email address *" required className="flex-1 rounded-md border border-gray-200 px-2 py-2 text-xs placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:px-3 sm:py-2.5 sm:text-sm" />
                    {!emailOtpVerified && (
                      <button type="button" onClick={sendEmailOtp} disabled={emailOtpSent || otpLoading} className="flex-shrink-0 whitespace-nowrap rounded-md bg-[#F41703] px-2 py-2 text-xs text-white hover:bg-[#d31402] disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-3 sm:py-2.5 sm:text-sm">
                        {otpLoading ? 'Sending...' : emailOtpSent ? 'OTP Sent' : 'Send OTP'}
                      </button>
                    )}
                    {emailOtpVerified && (
                      <div className="flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-green-100 px-2 py-2 text-xs text-green-700 sm:px-3 sm:py-2.5 sm:text-sm">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  {emailOtpSent && !emailOtpVerified && (
                    <div className="mt-2">
                      <div className="flex justify-between gap-1 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={emailOtp[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '')
                              if (value) {
                                const newOtp = emailOtp.split('')
                                newOtp[index] = value
                                setEmailOtp(newOtp.join(''))
                                // Auto-focus next input
                                const nextInput = e.target.nextElementSibling
                                if (nextInput && index < 5) {
                                  nextInput.focus()
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
                                const prevInput = e.target.previousElementSibling
                                if (prevInput) {
                                  prevInput.focus()
                                }
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault()
                              const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
                              if (pastedData) {
                                setEmailOtp(pastedData)
                                // Focus the last filled input
                                const inputs = e.target.parentElement.querySelectorAll('input')
                                const lastIndex = Math.min(pastedData.length - 1, 5)
                                inputs[lastIndex].focus()
                              }
                            }}
                            className="h-10 w-8 rounded-md border border-gray-200 text-center text-lg font-semibold outline-none placeholder:text-gray-300 focus:border-transparent focus:ring-2 focus:ring-[#F41703] sm:h-12 sm:w-10 sm:text-xl"
                            placeholder="•"
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={verifyEmailOtp} disabled={otpLoading || emailOtp.length !== 6} className="flex-1 whitespace-nowrap rounded-md bg-green-600 px-2 py-2 text-xs text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-2.5 sm:text-sm">
                          {otpLoading ? 'Checking...' : 'Verify OTP'}
                        </button>
                        <button type="button" onClick={sendEmailOtp} disabled={otpLoading} className="whitespace-nowrap rounded-md bg-gray-200 px-2 py-2 text-xs text-gray-700 hover:bg-gray-300 disabled:opacity-60 sm:px-3 sm:py-2.5 sm:text-sm">
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  )}
                  {otpError && <div className="text-sm text-red-600">{otpError}</div>}
                </div>

                {/* Phone with country code */}
                <div>
                  <div className="flex items-stretch gap-1 sm:gap-2">
                    <CountryCodeSelect value={countryIso} onChange={setCountryIso} />
                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      placeholder="Phone number *"
                      required
                      className="min-w-0 flex-1 rounded-md border border-gray-200 px-2 py-2 text-xs placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:px-3 sm:py-2.5 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {signupData.phone
                      ? `Saved as ${selectedCountry.code} ${signupData.phone}`
                      : 'Choose your country code and enter your number without it.'}
                  </p>
                </div>

                <div>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" required className="w-full rounded-md border border-gray-200 px-3 py-2 pr-9 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#F41703] sm:py-2.5 sm:text-base" />
                    <EyeToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />
                  </div>
                </div>
                {error && <div className="text-xs text-red-600 sm:text-sm">{error}</div>}
                <button type="submit" disabled={loading || !emailOtpVerified} className="w-full rounded-md bg-[#F41703] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d31402] disabled:cursor-not-allowed disabled:bg-gray-400 sm:py-3 sm:text-base">
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
                <div className="text-center text-xs text-gray-600 sm:text-sm">Already have an account? <button type="button" onClick={() => setSignupMode('login')} className="font-semibold text-[#F41703]">Sign in</button></div>

                <SocialButtons onSocial={handleSocialLogin} />
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForgotPassword(false)}></div>
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <button onClick={() => setShowForgotPassword(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">✕</button>

            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-gray-800">Forgot Password?</h2>
              <p className="text-sm text-gray-500">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#F41703]"
                  />
                </div>
                {forgotError && <div className="text-sm text-red-600">{forgotError}</div>}
                <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#F41703] py-3 font-semibold text-white transition hover:bg-[#d31402] disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full py-2 text-sm text-gray-600 transition hover:text-gray-800">
                  Back to Login
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Check Your Email</h3>
                <p className="text-sm text-gray-500">We've sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
                <button onClick={() => { setShowForgotPassword(false); setForgotSuccess(false) }} className="w-full rounded-lg bg-[#F41703] py-3 font-semibold text-white transition hover:bg-[#d31402]">
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Signup