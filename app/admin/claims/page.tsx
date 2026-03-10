'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Claim = {
  token: string
  status: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  flight_data: { flightNumber?: string; airline?: string; iataPrefix?: string; origin?: string; destination?: string; date?: string } | null
  compensation: { amountPerPerson?: number } | null
  passengers: number | null
  created_at: string
  submitted_at: string | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  result_viewed:     { label: 'Bekeken',           color: '#6B7280', bg: '#F3F4F6' },
  submitted:         { label: 'Ingediend',         color: '#1D4ED8', bg: '#EFF6FF' },
  invoice_sent:      { label: 'Factuur verstuurd', color: '#D97706', bg: '#FFFBEB' },
  invoice_paid:      { label: 'Factuur betaald',   color: '#059669', bg: '#ECFDF5' },
  claim_filed:       { label: 'Claim ingediend',   color: '#7C3AED', bg: '#F5F3FF' },
  in_progress:       { label: 'In behandeling',    color: '#2563EB', bg: '#EFF6FF' },
  won:               { label: 'Gewonnen',           color: '#059669', bg: '#ECFDF5' },
  compensation_paid: { label: 'Uitbetaald',        color: '#047857', bg: '#D1FAE5' },
  rejected:          { label: 'Afgewezen',         color: '#DC2626', bg: '#FEF2F2' },
  appeal_filed:      { label: 'Bezwaar',           color: '#D97706', bg: '#FFFBEB' },
  closed:            { label: 'Gesloten',          color: '#6B7280', bg: '#F3F4F6' },
}

const FILTER_TABS = [
  { key: 'all',              label: 'Alle' },
  { key: 'submitted',        label: 'Ingediend' },
  { key: 'invoice_sent',     label: 'Factuur verstuurd' },
  { key: 'invoice_paid',     label: 'Factuur betaald' },
  { key: 'claim_filed',      label: 'Claim ingediend' },
  { key: 'in_progress',      label: 'In behandeling' },
  { key: 'won',              label: 'Gewonnen' },
  { key: 'compensation_paid',label: 'Uitbetaald' },
  { key: 'rejected',         label: 'Afgewezen' },
  { key: 'closed',           label: 'Gesloten' },
]

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#F3F4F6' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.2rem 0.6rem', borderRadius: '20px',
      fontSize: '0.7rem', fontWeight: 600,
      color: cfg.color, background: cfg.bg, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

function fmt(n: number) {
  return `€${Math.round(n).toLocaleString('nl-NL')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminClaimsPage() {
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search) params.set('search', search)

    fetch(`/api/admin/claims?${params}`)
      .then(r => r.json())
      .then(({ claims }) => setClaims(claims ?? []))
      .finally(() => setLoading(false))
  }, [statusFilter, search])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <div style={{ padding: '2rem 2rem 3rem', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
          Claims
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
          {loading ? 'Laden…' : `${claims.length} claim${claims.length !== 1 ? 's' : ''} gevonden`}
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem', position: 'relative', maxWidth: '360px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}>
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Zoek op naam, token, vluchtnummer…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5625rem 0.75rem 0.5625rem 2.25rem',
            borderRadius: '8px',
            border: '1.5px solid #E5E7EB',
            fontSize: '0.875rem',
            color: '#111827',
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 500,
              border: statusFilter === tab.key ? '1.5px solid #1D4ED8' : '1.5px solid #E5E7EB',
              background: statusFilter === tab.key ? '#EFF6FF' : '#fff',
              color: statusFilter === tab.key ? '#1D4ED8' : '#6B7280',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                {['Token', 'Naam', 'Email', 'Vlucht', 'Route', 'Bedrag', 'Status', 'Ingediend'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
                    Laden…
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#9CA3AF' }}>
                    Geen claims gevonden.
                  </td>
                </tr>
              ) : claims.map(claim => (
                <tr
                  key={claim.token}
                  style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => router.push(`/admin/claims/${claim.token}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <code style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', background: '#F3F4F6', padding: '0.2rem 0.4rem', borderRadius: '4px', letterSpacing: '0.05em' }}>
                      {claim.token}
                    </code>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                      {claim.first_name ?? '—'} {claim.last_name ?? ''}
                    </div>
                    {claim.phone && (
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{claim.phone}</div>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#6B7280', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {claim.email ?? '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#374151', whiteSpace: 'nowrap' }}>
                    {claim.flight_data?.flightNumber ?? '—'}
                    {claim.flight_data?.date && (
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                        {new Date(claim.flight_data.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {claim.flight_data?.origin && claim.flight_data?.destination
                      ? `${claim.flight_data.origin} → ${claim.flight_data.destination}`
                      : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                    {claim.compensation?.amountPerPerson && claim.passengers
                      ? fmt(claim.compensation.amountPerPerson * claim.passengers)
                      : '—'}
                    {(claim.passengers ?? 0) > 1 && claim.compensation?.amountPerPerson && (
                      <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400 }}>
                        {claim.passengers}× {fmt(claim.compensation.amountPerPerson)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {claim.submitted_at
                      ? formatDate(claim.submitted_at)
                      : claim.created_at
                        ? formatDate(claim.created_at)
                        : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
