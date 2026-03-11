'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS } from '@/lib/airports'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import type { RouteSearchParams, FlightType } from '@/lib/types'

const TYPE_OPTIONS: { val: FlightType; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    val: 'vertraagd',
    label: 'Vertraging',
    sub: 'Vlucht arriveerde meer dan 3 uur te laat',
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 5v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    val: 'geannuleerd',
    label: 'Annulering',
    sub: 'Vlucht werd geannuleerd door de airline',
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M3 15L15 3M10.5 3.5l4 1-1 4M7.5 14.5l-4-1 1-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    val: 'geweigerd',
    label: 'Instapweigering',
    sub: 'Je werd geweigerd door overboeking of een andere reden',
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 8l3 3M16 8l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    val: 'downgrade',
    label: 'Klasseverlaging (downgrade)',
    sub: 'Je vloog in een lagere klasse dan je geboekt en betaald had',
    icon: (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="2" y="10" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 1.5" />
        <path d="M9 8.5v2M7.5 10l1.5 1.5L10.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function SelecteerTypePage() {
  const router = useRouter()
  const [params, setParams] = useState<RouteSearchParams | null>(null)
  const [selected, setSelected] = useState<FlightType | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_route_search')
    if (!raw) { router.replace('/'); return }
    const p = JSON.parse(raw) as RouteSearchParams
    setParams(p)
    if (p.type) setSelected(p.type)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(type: FlightType) {
    setSelected(type)
    if (!params) return
    // Reset eligibility refiners when type changes
    const updated: RouteSearchParams = {
      ...params,
      type,
      cancellationNotice: undefined,
      causeType: undefined,
      stopover: undefined,
      viaAirports: undefined,
      singleBooking: undefined,
    }
    sessionStorage.setItem('vv_route_search', JSON.stringify(updated))
    setParams(updated)
  }

  function handleNext() {
    if (!selected) return
    router.push('/selecteer/details')
  }

  const originName = params ? (AIRPORTS[params.origin]?.name ?? params.origin) : ''
  const destinationName = params ? (AIRPORTS[params.destination]?.name ?? params.destination) : ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      <FunnelNav step={2} />

      <div className="funnel-grid" style={{ paddingTop: '2.5rem' }}>
        <div>

          {/* Route hero strip */}
          {params && (
            <div className="animate-fade-up d1" style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {params.origin}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--blue-light)', borderRadius: '6px', padding: '0.25rem 0.625rem' }}>
                  <svg width="18" height="8" viewBox="0 0 24 10" fill="none">
                    <path d="M0 5h20M16 2l4 3-4 3" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {params.destination}
                </span>
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {originName} → {destinationName}
              </span>
            </div>
          )}

          {/* Sub-step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem' }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{
                height: '3px', flex: 1, borderRadius: '2px',
                background: n === 1 ? 'var(--blue)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Wat is er met je vlucht gebeurd?
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Kies de reden van je claim — we stellen daarna de juiste vervolgvragen.
          </p>

          <div className="animate-fade-up d2" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.75rem' }}>
            {TYPE_OPTIONS.map(opt => {
              const isActive = selected === opt.val
              return (
                <button key={opt.val} type="button" onClick={() => handleSelect(opt.val)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
                    border: `2px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
                    background: isActive ? 'var(--blue-light)' : '#fff',
                    transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--blue)' : 'var(--text-muted)', flexShrink: 0 }}>
                    {opt.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: isActive ? 'var(--blue)' : 'var(--text)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {opt.sub}
                    </div>
                  </div>
                  {isActive && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="10" cy="10" r="9" fill="var(--blue)" />
                      <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="btn-cta animate-fade-up d3"
            style={{ opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed' }}
          >
            Doorgaan
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
        <FunnelSidebar step={1} />
      </div>
    </div>
  )
}
