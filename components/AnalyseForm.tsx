'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AirportCombobox from './AirportCombobox'

type FlightType = 'vertraagd' | 'geannuleerd' | 'geweigerd'

const TYPE_OPTIONS: { value: FlightType; label: string; sub: string }[] = [
  { value: 'vertraagd',   label: 'Vertraagd',        sub: '3+ uur' },
  { value: 'geannuleerd', label: 'Geannuleerd',       sub: 'vlucht' },
  { value: 'geweigerd',   label: 'Instap geweigerd', sub: 'overbooking' },
]

export default function AnalyseForm() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<FlightType>('vertraagd')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const threeYearsAgo = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!origin) { setError('Selecteer je vertrekluchthaven'); return }
    if (!destination) { setError('Selecteer je aankomstluchthaven'); return }
    if (!date) { setError('Selecteer de vluchtdatum'); return }
    setLoading(true)
    sessionStorage.setItem('vv_route_search', JSON.stringify({ origin, destination, date, type }))
    router.push('/selecteer')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Origin */}
      <div>
        <label className="input-label">Van (luchthaven)</label>
        <div className="input-field" style={{ padding: 0, display: 'flex', alignItems: 'center', overflow: 'visible' }}>
          <AirportCombobox
            value={origin}
            onChange={setOrigin}
            placeholder="bijv. Amsterdam Schiphol"
            inputStyle={{ padding: '0.8125rem 1rem' }}
            contextIata={destination}
          />
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="input-label">Naar (luchthaven)</label>
        <div className="input-field" style={{ padding: 0, display: 'flex', alignItems: 'center', overflow: 'visible' }}>
          <AirportCombobox
            value={destination}
            onChange={setDestination}
            placeholder="bijv. Barcelona El Prat"
            inputStyle={{ padding: '0.8125rem 1rem' }}
            contextIata={origin}
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="input-label" htmlFor="date">Vluchtdatum</label>
        <input
          id="date"
          className="input-field"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={threeYearsAgo}
          max={today}
        />
      </div>

      {/* Type selector */}
      <div>
        <label className="input-label">Wat is er gebeurd?</label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '0.625rem 0.5rem',
                borderRadius: '8px',
                border: `1.5px solid ${type === opt.value ? 'var(--blue)' : 'var(--border)'}`,
                background: type === opt.value ? 'var(--blue-light)' : 'var(--surface)',
                color: type === opt.value ? 'var(--blue)' : 'var(--text-sub)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{opt.label}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--red)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ marginTop: '0.25rem' }}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <span
              style={{
                width: '14px', height: '14px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.35)',
                borderTopColor: 'white',
                animation: 'spin 0.7s linear infinite',
                display: 'inline-block',
              }}
            />
            Vlucht zoeken…
          </span>
        ) : (
          'Check mijn vlucht — gratis →'
        )}
      </button>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Geen account · Geen creditcard · Factuur alleen bij indiening
      </p>
    </form>
  )
}
