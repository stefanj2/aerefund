'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AIRPORTS, type Airport } from '@/lib/airports'

const NL_IATAS = ['AMS', 'EIN', 'RTM', 'MST', 'GRQ']

const AIRPORT_LIST: Airport[] = [
  ...NL_IATAS.map(i => AIRPORTS[i]).filter(Boolean),
  ...Object.values(AIRPORTS)
    .filter(a => !NL_IATAS.includes(a.iata))
    .sort((a, b) => a.name.localeCompare(b.name, 'nl')),
]

// Popular destinations per departure airport (Dutch market)
const POPULAR_FROM: Record<string, string[]> = {
  AMS: ['BCN','PMI','AGP','AYT','LHR','CDG','FCO','ATH','HER','TFS','LPA','DXB','JFK','BKK','LIS','MXP','VCE','MAD','CMN','RAK','HRG','DPS','SIN','NBO','CUN','PUJ','ALC','IBZ','NCE','ZRH'],
  EIN: ['BCN','PMI','AGP','STN','LGW','ALC','FAO','MAD','ATH','RHO','AYT','MRS','LIS','VLC','IBZ'],
  RTM: ['PMI','AGP','TFS','LPA','BCN','AYT','ALC','FAO','HRG','SSH','FUE','ACE','CMN','RAK'],
  MST: ['AYT','PMI','AGP','TFS','HRG','BCN','ATH','LIS','CMN'],
  GRQ: ['AYT','PMI','AGP','BCN','TFS','HRG','LGW','FCO','ATH'],
  BCN: ['AMS','EIN','RTM','BRU','DUS','LHR','CDG'],
  PMI: ['AMS','EIN','RTM','MST','GRQ','BRU'],
  AGP: ['AMS','EIN','RTM','MST','GRQ','BRU'],
  AYT: ['AMS','EIN','RTM','MST','GRQ'],
  LHR: ['AMS','BRU','CDG','FRA'],
  ATH: ['AMS','EIN','BRU','CDG'],
  HER: ['AMS','EIN','RTM','BRU'],
  DXB: ['AMS','BRU','CDG','FRA'],
  TFS: ['AMS','EIN','RTM','MST'],
  LPA: ['AMS','EIN','RTM'],
  BKK: ['AMS','FRA','CDG','LHR'],
  DPS: ['AMS','FRA','CDG'],
}

function getDefaultSuggestions(contextIata?: string): Airport[] {
  if (contextIata && POPULAR_FROM[contextIata]) {
    return POPULAR_FROM[contextIata]
      .map(iata => AIRPORTS[iata])
      .filter(Boolean)
      .slice(0, 10)
  }
  return AIRPORT_LIST.slice(0, 8)
}

const COUNTRY_NL: Record<string, string> = {
  NL: 'nederland',
  GB: 'verenigd koninkrijk engeland groot-brittannië',
  IE: 'ierland',
  DE: 'duitsland',
  FR: 'frankrijk',
  ES: 'spanje',
  IT: 'italië italie',
  PT: 'portugal',
  GR: 'griekenland',
  TR: 'turkije',
  DK: 'denemarken',
  SE: 'zweden',
  NO: 'noorwegen',
  FI: 'finland',
  PL: 'polen',
  CZ: 'tsjechië tsjechie',
  HU: 'hongarije',
  AT: 'oostenrijk',
  RS: 'servië servie',
  RO: 'roemenië roemenie',
  BG: 'bulgarije',
  LV: 'letland',
  EE: 'estland',
  LT: 'litouwen',
  EG: 'egypte',
  MA: 'marokko',
  TN: 'tunesië tunesie',
  KE: 'kenia',
  ZA: 'zuid-afrika',
  AE: 'verenigde arabische emiraten dubai',
  QA: 'qatar',
  SA: 'saoedi-arabië saudi-arabie',
  IL: 'israël israel',
  JO: 'jordanië jordanie',
  TH: 'thailand',
  SG: 'singapore',
  MY: 'maleisië maleisie',
  HK: 'hongkong',
  CN: 'china',
  JP: 'japan',
  KR: 'zuid-korea',
  IN: 'india',
  LK: 'sri lanka',
  ID: 'indonesië indonesie bali',
  US: 'verenigde staten amerika',
  CA: 'canada',
  BR: 'brazilië brazilie',
  AR: 'argentinië argentinie',
  CO: 'colombia',
  MX: 'mexico',
  CU: 'cuba',
  DO: 'dominicaanse republiek',
  CW: 'curaçao curacao',
  AW: 'aruba',
  AU: 'australië australie',
  NZ: 'nieuw-zeeland',
  BE: 'belgië belgie',
  CH: 'zwitserland',
}

function matchesCountry(ap: Airport, q: string): boolean {
  return (COUNTRY_NL[ap.country] ?? '').includes(q.toLowerCase())
}

function countryFlag(code: string): string {
  return code.toUpperCase().split('').map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join('')
}

function countryName(code: string): string {
  const raw = COUNTRY_NL[code]
  if (!raw) return code
  const first = raw.split(' ')[0]
  return first.charAt(0).toUpperCase() + first.slice(1)
}

type DropdownRect = { top: number; left: number; width: number; maxHeight: number; placement: 'below' | 'above' }

type Props = {
  value: string
  onChange: (iata: string) => void
  placeholder: string
  icon?: React.ReactNode
  inputStyle?: React.CSSProperties
  flex?: number | string
  contextIata?: string
  suggestions?: Airport[]        // custom default list (overrides contextIata logic)
  suggestionsLabel?: string      // label shown above default list
}

export default function AirportCombobox({ value, onChange, placeholder, icon, inputStyle, flex, contextIata, suggestions, suggestionsLabel }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [dropdownRect, setDropdownRect] = useState<DropdownRect | null>(null)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const selectedAirport = AIRPORTS[value] ?? null
  const displayValue = open
    ? query
    : selectedAirport
    ? `${selectedAirport.iata} — ${selectedAirport.name}`
    : ''

  const filtered = query.length >= 1
    ? AIRPORT_LIST.filter(ap =>
        ap.iata.toLowerCase().startsWith(query.toLowerCase()) ||
        ap.name.toLowerCase().includes(query.toLowerCase()) ||
        matchesCountry(ap, query)
      ).slice(0, 10)
    : (suggestions ?? getDefaultSuggestions(contextIata))

  const updateRect = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    // Use visualViewport on iOS to account for on-screen keyboard
    const vv = typeof window !== 'undefined' ? window.visualViewport : null
    const viewportHeight = vv?.height ?? window.innerHeight
    const viewportOffsetTop = vv?.offsetTop ?? 0

    const spaceBelow = (viewportHeight + viewportOffsetTop) - rect.bottom
    const spaceAbove = rect.top - viewportOffsetTop
    const margin = 16

    // If there's not enough space below (e.g. iOS keyboard open) AND there's more space above,
    // flip the dropdown to open above the input
    const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow

    if (openAbove) {
      setDropdownRect({
        top: Math.max(viewportOffsetTop + margin, rect.top - 4 - Math.min(320, spaceAbove - margin)),
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(320, spaceAbove - margin),
        placement: 'above',
      })
    } else {
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(320, spaceBelow - margin),
        placement: 'below',
      })
    }
  }, [])

  const handleFocus = () => {
    updateRect()
    setQuery('')
    setOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) onChange('')
    updateRect()
  }

  const handleSelect = useCallback((airport: Airport) => {
    onChange(airport.iata)
    setQuery('')
    setOpen(false)
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // Update position on scroll/resize/keyboard while open
  useEffect(() => {
    if (!open) return
    const handler = () => updateRect()
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    // iOS visual viewport changes when keyboard opens/closes
    const vv = window.visualViewport
    vv?.addEventListener('resize', handler)
    vv?.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
      vv?.removeEventListener('resize', handler)
      vv?.removeEventListener('scroll', handler)
    }
  }, [open, updateRect])

  const sectionLabel = query.length >= 1
    ? 'Resultaten'
    : suggestionsLabel
    ? suggestionsLabel
    : contextIata && POPULAR_FROM[contextIata]
    ? `Populair vanaf ${contextIata}`
    : 'Nederlandse luchthavens'

  const dropdown = open && filtered.length > 0 && dropdownRect && (
    <div
      style={{
        position: 'fixed',
        top: dropdownRect.top,
        left: dropdownRect.left,
        width: `min(${dropdownRect.width}px, calc(100vw - 2rem))`,
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: dropdownRect.placement === 'above'
          ? '0 -8px 32px rgba(0,0,0,0.14)'
          : '0 8px 32px rgba(0,0,0,0.14)',
        zIndex: 9999,
        overflow: 'hidden',
        maxHeight: `${Math.max(180, dropdownRect.maxHeight)}px`,
        overflowY: 'auto',
      }}
    >
      <div style={{
        padding: '0.5rem 1rem 0.3rem',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border)',
      }}>
        {sectionLabel}
      </div>

      {filtered.map(ap => (
        <button
          key={ap.iata}
          type="button"
          onMouseDown={() => handleSelect(ap)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            width: '100%',
            padding: '0.625rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <span style={{ fontSize: '1.125rem', flexShrink: 0, lineHeight: 1 }}>
            {countryFlag(ap.country)}
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: '0.75rem',
            color: 'var(--blue)',
            flexShrink: 0,
            minWidth: '2.25rem',
            fontFamily: 'var(--font-sora)',
          }}>
            {ap.iata}
          </span>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{ap.name}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.375rem' }}>
              {countryName(ap.country)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: flex ?? 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.125rem', height: '100%' }}>
        {icon}
        <input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9375rem',
            color: 'var(--text)',
            background: 'transparent',
            fontFamily: 'inherit',
            minWidth: 0,
            padding: '1rem 0',
            cursor: 'text',
            ...inputStyle,
          }}
        />
      </div>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  )
}
