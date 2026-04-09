'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AirportCombobox from './AirportCombobox'

type ClaimType = 'vertraagd' | 'geannuleerd' | 'geweigerd'

const TYPE_OPTIONS: { value: ClaimType; label: string }[] = [
  { value: 'vertraagd',   label: 'Vertraagd' },
  { value: 'geannuleerd', label: 'Geannuleerd' },
  { value: 'geweigerd',   label: 'Instap geweigerd' },
]

export default function HeroSearchForm({ defaultType = 'vertraagd' }: { defaultType?: ClaimType }) {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [type, setType] = useState<ClaimType>(defaultType)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!origin) { setError('Selecteer je vertrekluchthaven'); return }
    if (!destination) { setError('Selecteer je aankomstluchthaven'); return }
    setLoading(true)
    sessionStorage.setItem('vv_route_search', JSON.stringify({
      origin, destination, date: '', type,
    }))
    router.push('/selecteer')
  }

  const fieldBase: React.CSSProperties = {
    background: '#fff',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    transition: 'border-color 0.15s',
    overflow: 'visible',
    position: 'relative',
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>

        {/* Type selector boven de luchthavens */}
        <div style={{ marginBottom: '0.625rem' }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            marginBottom: '0.375rem', fontFamily: 'var(--font-sora)',
          }}>
            Wat is er mis met je vlucht?
          </p>
          <div className="type-selector" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: '#f0f4f8',
            borderRadius: '10px',
            padding: '3px',
            gap: '2px',
          }}>
            {TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                style={{
                  padding: '0.5rem 0.5rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: type === value ? '#fff' : 'transparent',
                  color: type === value ? 'var(--navy)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: type === value ? 700 : 500,
                  fontFamily: 'var(--font-sora)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: type === value ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  textAlign: 'center',
                  minWidth: 0,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Luchthavens + knop */}
        <div className="stack-mobile" style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
          {/* Vertrek */}
          <div
            style={{ ...fieldBase, flex: 1 }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <AirportCombobox
              value={origin}
              onChange={setOrigin}
              placeholder="Vertrekluchthaven"
              flex="1 1 auto"
              contextIata={destination}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: '0.875rem' }}>
                  <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="var(--text-muted)" />
                </svg>
              }
            />
          </div>

          <span className="hide-mobile" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M1 4h14M11 1l4 3-4 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 10H5M9 7l-4 3 4 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          {/* Aankomst */}
          <div
            style={{ ...fieldBase, flex: 1 }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
            onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <AirportCombobox
              value={destination}
              onChange={setDestination}
              placeholder="Aankomstluchthaven"
              flex="1 1 auto"
              contextIata={origin}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: '0.875rem' }}>
                  <path d="M3 8v2l8 5v5.5l2 1.5 2-1.5V15l8-5V8l-8 2.5V5l2-1.5V2l-3.5 1L10 2v1.5L12 5v5.5L3 8z" fill="var(--text-muted)" />
                </svg>
              }
            />
          </div>

          {/* Knop */}
          <button
            type="submit"
            disabled={loading}
            className="full-width-mobile hero-submit-btn"
            style={{
              flexShrink: 0,
              background: 'var(--blue)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'var(--font-sora)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background 0.15s',
              opacity: loading ? 0.8 : 1,
              padding: '0 1.25rem',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--blue-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)' }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff',
                  animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0,
                }} />
                Zoeken…
              </>
            ) : (
              <>
                Check compensatie
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>
      )}
    </div>
  )
}
