'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Stats = {
  total: number
  this_week: number
  awaiting_invoice: number
  active_at_airline: number
  won: number
  rejected: number
  by_status: Record<string, number>
  potential_revenue: number
}

type Claim = {
  token: string
  status: string
  first_name: string | null
  last_name: string | null
  email: string | null
  flight_data: { flightNumber?: string; airline?: string; iataPrefix?: string; origin?: string; destination?: string } | null
  compensation: { amountPerPerson?: number } | null
  passengers: number | null
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  result_viewed:    { label: 'Bekeken',            color: '#6B7280', bg: '#F3F4F6' },
  submitted:        { label: 'Ingediend',          color: '#1D4ED8', bg: '#EFF6FF' },
  invoice_sent:     { label: 'Factuur verstuurd',  color: '#D97706', bg: '#FFFBEB' },
  invoice_paid:     { label: 'Factuur betaald',    color: '#059669', bg: '#ECFDF5' },
  claim_filed:      { label: 'Claim ingediend',    color: '#7C3AED', bg: '#F5F3FF' },
  in_progress:      { label: 'In behandeling',     color: '#2563EB', bg: '#EFF6FF' },
  won:              { label: 'Gewonnen',            color: '#059669', bg: '#ECFDF5' },
  compensation_paid:{ label: 'Uitbetaald',         color: '#047857', bg: '#D1FAE5' },
  rejected:         { label: 'Afgewezen',          color: '#DC2626', bg: '#FEF2F2' },
  appeal_filed:     { label: 'Bezwaar',            color: '#D97706', bg: '#FFFBEB' },
  closed:           { label: 'Gesloten',           color: '#6B7280', bg: '#F3F4F6' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#F3F4F6' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.2rem 0.6rem', borderRadius: '20px',
      fontSize: '0.7rem', fontWeight: 600,
      color: cfg.color, background: cfg.bg,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

function fmt(n: number) {
  return `€${Math.round(n).toLocaleString('nl-NL')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

const PIPELINE_ORDER = ['submitted', 'invoice_sent', 'invoice_paid', 'claim_filed', 'in_progress', 'won', 'compensation_paid']

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/claims')
      .then(r => r.json())
      .then(({ claims, stats }) => {
        setStats(stats)
        setRecent((claims as Claim[]).slice(0, 8))
      })
      .finally(() => setLoading(false))
  }, [])

  const KPI_CARDS = stats ? [
    {
      label: 'Totale claims',
      value: stats.total,
      sub: 'Alle ingediende claims',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 4h14M3 8h10M3 12h7" stroke="#1D4ED8" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Deze week',
      value: stats.this_week,
      sub: 'Nieuw in de afgelopen 7 dagen',
      color: '#7C3AED',
      bg: '#F5F3FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="#7C3AED" strokeWidth="1.75" />
          <path d="M7 2v3M13 2v3M3 9h14" stroke="#7C3AED" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Wacht op factuur',
      value: stats.awaiting_invoice,
      sub: 'Actie vereist: factuur sturen',
      color: '#D97706',
      bg: '#FFFBEB',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 3h10a1 1 0 0 1 1 1v13l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z" stroke="#D97706" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M8 8h4M8 11h2" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Actief bij airline',
      value: stats.active_at_airline,
      sub: 'Claim ingediend of in behandeling',
      color: '#0891B2',
      bg: '#ECFEFF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17 8v-2l-7-4-7 4v2l7-2 7 2zM3 10v6h4v-4h6v4h4v-6" stroke="#0891B2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Gewonnen',
      value: stats.won,
      sub: 'Uitbetaald of gewonnen',
      color: '#059669',
      bg: '#ECFDF5',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l5 5 7-8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: 'Potentiële omzet',
      value: fmt(stats.potential_revenue),
      isAmount: true,
      sub: 'Op basis van actieve claims',
      color: '#1D4ED8',
      bg: '#F0F9FF',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="#1D4ED8" strokeWidth="1.75" />
          <path d="M10 6v1.5M10 12.5V14M7.5 9.5c0-.83.67-1.5 1.5-1.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H9c-.83 0-1.5.67-1.5 1.5S8.17 14 9 14h1.5c.83 0 1.5-.67 1.5-1.5" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ] : []

  return (
    <div style={{ padding: '2rem 2rem 3rem', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
          Overzicht
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
          Alle actieve claims en statistieken in één oogopslag.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9CA3AF', fontSize: '0.875rem' }}>
          Laden…
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {KPI_CARDS.map((card, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.125rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {card.icon}
                  </div>
                </div>
                <div style={{ fontSize: card.isAmount ? '1.375rem' : '1.875rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-sora)', lineHeight: 1, marginBottom: '0.25rem' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.2rem' }}>{card.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          {stats && (
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.25rem', marginBottom: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: '0 0 1rem' }}>
                Pipeline
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PIPELINE_ORDER.map(s => {
                  const count = stats.by_status[s] ?? 0
                  const cfg = STATUS_CONFIG[s]
                  const max = Math.max(...PIPELINE_ORDER.map(k => stats.by_status[k] ?? 0), 1)
                  const pct = Math.round((count / max) * 100)
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '140px', flexShrink: 0, fontSize: '0.75rem', fontWeight: 500, color: '#6B7280' }}>
                        {cfg?.label ?? s}
                      </div>
                      <div style={{ flex: 1, height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: cfg?.color ?? '#6B7280', borderRadius: '4px', transition: 'width 0.4s' }} />
                      </div>
                      <div style={{ width: '28px', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 700, color: count > 0 ? '#111827' : '#D1D5DB' }}>
                        {count}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent claims */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: '#111827', margin: 0 }}>
                Recente claims
              </h2>
              <Link href="/admin/claims" style={{ fontSize: '0.8rem', color: '#1D4ED8', textDecoration: 'none', fontWeight: 500 }}>
                Alle claims →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Token', 'Naam', 'Vlucht', 'Bedrag', 'Status', 'Datum'].map(h => (
                      <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
                        Nog geen claims.
                      </td>
                    </tr>
                  ) : recent.map(claim => (
                    <tr key={claim.token} style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer' }}
                      onClick={() => window.location.href = `/admin/claims/${claim.token}`}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <code style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', background: '#F3F4F6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                          {claim.token}
                        </code>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>
                        {claim.first_name ?? '—'} {claim.last_name ?? ''}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151' }}>
                        {claim.flight_data?.flightNumber ?? '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                        {claim.compensation?.amountPerPerson && claim.passengers
                          ? fmt(claim.compensation.amountPerPerson * claim.passengers)
                          : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <StatusBadge status={claim.status} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                        {claim.created_at ? formatDate(claim.created_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
