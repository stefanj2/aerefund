'use client'

import { useEffect, useState, useCallback } from 'react'

type FunnelStep = { key: string; label: string; count: number }
type AirlineRow = { iata: string; submitted: number; won: number; total_compensation: number }
type TypeRow = { type: string; submitted: number; won: number }
type Revenue = { fees_invoiced: number; fees_collected: number; commission_earned: number; total_earned: number }

type FunnelData = {
  total: number
  funnel: FunnelStep[]
  by_airline: AirlineRow[]
  by_type: TypeRow[]
  revenue: Revenue
}

const PERIODS = [
  { label: '7 dagen', days: 7 },
  { label: '30 dagen', days: 30 },
  { label: '90 dagen', days: 90 },
  { label: 'Alles', days: 0 },
]

const TYPE_LABELS: Record<string, string> = {
  delay:     'Vertraging',
  cancelled: 'Annulering',
  denied:    'Instapweigering',
}

function fmt(n: number) {
  return `€${Math.round(n).toLocaleString('nl-NL')}`
}

function pct(a: number, b: number) {
  if (b === 0) return '—'
  return `${Math.round((a / b) * 100)}%`
}

export default function AdminFunnelPage() {
  const [data, setData] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  const load = useCallback((days: number) => {
    setLoading(true)
    fetch(`/api/admin/funnel?days=${days}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load(period) }, [period, load])

  const topCount = data?.funnel[0]?.count ?? 1

  return (
    <div style={{ padding: '2rem 2rem 3rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
            Funnel analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
            Conversieratio per stap en breakdown per airline en claimtype.
          </p>
        </div>

        {/* Period selector */}
        <div style={{ display: 'flex', gap: '2px', background: '#E5E7EB', borderRadius: '8px', padding: '2px' }}>
          {PERIODS.map(p => (
            <button key={p.days}
              onClick={() => setPeriod(p.days)}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: period === p.days ? 600 : 400,
                background: period === p.days ? '#fff' : 'transparent',
                color: period === p.days ? '#111827' : '#6B7280',
                boxShadow: period === p.days ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#9CA3AF', fontSize: '0.875rem' }}>
          Laden…
        </div>
      ) : !data ? (
        <div style={{ color: '#EF4444', fontSize: '0.875rem' }}>Kon data niet laden.</div>
      ) : (
        <>
          {/* Revenue KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {[
              { label: 'Facturen verstuurd', value: fmt(data.revenue.fees_invoiced), sub: `${Math.round(data.revenue.fees_invoiced / 42)} facturen × €42`, color: '#D97706', bg: '#FFFBEB' },
              { label: 'Fees geïnd',         value: fmt(data.revenue.fees_collected), sub: 'Betaalde facturen', color: '#059669', bg: '#ECFDF5' },
              { label: 'Commissie verdiend', value: fmt(data.revenue.commission_earned), sub: '10% van uitbetalingen', color: '#7C3AED', bg: '#F5F3FF' },
              { label: 'Totale omzet',       value: fmt(data.revenue.total_earned), sub: 'Fees + commissie', color: '#1D4ED8', bg: '#EFF6FF' },
            ].map((card, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.125rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: card.color, marginBottom: '0.875rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-sora)', lineHeight: 1, marginBottom: '0.25rem' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.2rem' }}>{card.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Funnel visualization */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', marginBottom: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: '0 0 1.25rem' }}>
              Conversiefunnel
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {data.funnel.map((step, i) => {
                const prev = i > 0 ? data.funnel[i - 1].count : null
                const barPct = Math.max(4, Math.round((step.count / Math.max(topCount, 1)) * 100))
                const convPct = prev !== null ? Math.round((step.count / Math.max(prev, 1)) * 100) : null

                return (
                  <div key={step.key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.625rem 0' }}>
                      {/* Step label */}
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', margin: 0 }}>{step.label}</p>
                        {convPct !== null && (
                          <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: '0.1rem 0 0' }}>
                            {convPct}% van vorige stap
                          </p>
                        )}
                      </div>

                      {/* Bar */}
                      <div style={{ flex: 1, height: '28px', background: '#F3F4F6', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                          width: `${barPct}%`, height: '100%',
                          background: i === data.funnel.length - 1
                            ? 'linear-gradient(90deg, #059669, #34d399)'
                            : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                          borderRadius: '6px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>

                      {/* Count */}
                      <div style={{ width: '60px', textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-sora)' }}>
                          {step.count}
                        </span>
                      </div>

                      {/* % of total */}
                      <div style={{ width: '52px', textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {pct(step.count, data.total)}
                        </span>
                      </div>
                    </div>

                    {/* Drop-off arrow between steps */}
                    {i < data.funnel.length - 1 && (
                      <div style={{ paddingLeft: '192px', paddingBottom: '2px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#D1D5DB' }}>▼</span>
                        {prev !== null && data.funnel[i + 1].count < step.count && (
                          <span style={{ fontSize: '0.7rem', color: '#EF4444', marginLeft: '0.35rem' }}>
                            − {step.count - data.funnel[i + 1].count} uitgevallen
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Breakdown row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>

            {/* By airline */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>
                  Per airline
                </h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Airline', 'Claims', 'Gewonnen', 'Win%', 'Compensatie'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 1rem', textAlign: h === 'Airline' ? 'left' : 'right', fontSize: '0.68rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.by_airline.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF' }}>Geen data</td></tr>
                  ) : data.by_airline.map(row => (
                    <tr key={row.iata} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      <td style={{ padding: '0.625rem 1rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{row.iata || 'Overig'}</span>
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#111827', fontWeight: 600 }}>{row.submitted}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>{row.won}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#9CA3AF' }}>{pct(row.won, row.submitted)}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#111827' }}>{row.total_compensation > 0 ? fmt(row.total_compensation) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* By type */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
                <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>
                  Per claimtype
                </h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Type', 'Claims', 'Gewonnen', 'Win%'].map(h => (
                      <th key={h} style={{ padding: '0.5rem 1rem', textAlign: h === 'Type' ? 'left' : 'right', fontSize: '0.68rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.by_type.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF' }}>Geen data</td></tr>
                  ) : data.by_type.map(row => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      <td style={{ padding: '0.625rem 1rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
                          {TYPE_LABELS[row.type] ?? row.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#111827', fontWeight: 600 }}>{row.submitted}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>{row.won}</td>
                      <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.8125rem', color: '#9CA3AF' }}>{pct(row.won, row.submitted)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GA4 note */}
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="9" cy="9" r="7.5" stroke="#0284C7" strokeWidth="1.5" />
              <path d="M9 8v4M9 6.5v.5" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0C4A6E', margin: '0 0 0.2rem' }}>
                GA4 koppeling actief
              </p>
              <p style={{ fontSize: '0.75rem', color: '#075985', margin: 0 }}>
                Funnel events worden ook naar Google Analytics gestuurd (G-1VBKEHCXN5).
                Bekijk volledige gebruikersdata inclusief verkeersbronnen in GA4 → Rapporten → Funnel verkenner.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
