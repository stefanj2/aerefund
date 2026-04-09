'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS, haversineDistance } from '@/lib/airports'
import { getAirlineConfig } from '@/lib/airlines'
import { calculateCompensation } from '@/lib/compensation'
import { trackFlightSelected } from '@/lib/analytics'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import type { RouteSearchParams, RouteFlightOption } from '@/lib/types'

type LoadState = 'loading' | 'loaded' | 'error'

// ── Sub-components ─────────────────────────────────────────────────────────────

function AirlineLogo({ iata, name }: { iata: string; name: string }) {
  const [imgError, setImgError] = useState(false)
  const conf = getAirlineConfig(iata)
  const displayName = conf.name !== 'de airline' ? conf.name : name || iata
  if (!imgError && iata) {
    return (
      <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://www.gstatic.com/flights/airline_logos/70px/${iata}.png`} alt={displayName} width={32} height={32} onError={() => setImgError(true)} style={{ objectFit: 'contain' }} />
      </div>
    )
  }
  return (
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0, background: conf.color + '18', border: `1px solid ${conf.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.6rem', fontWeight: 800, fontFamily: 'var(--font-sora)', color: conf.color }}>
        {iata || displayName.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

function FlightCard({ flight, onSelect, isConnecting, isSelected = false }: {
  flight: RouteFlightOption; onSelect: () => void; isConnecting: boolean; isSelected?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isDelayed = (flight.delayMinutes != null && flight.delayMinutes >= 15) || flight.status?.toLowerCase().includes('delay')
  const isCancelled = flight.status?.toLowerCase().includes('cancel')
  const statusColor = isCancelled ? 'var(--red)' : isDelayed ? 'var(--orange)' : 'var(--green)'
  const STATUS_NL: Record<string, string> = { arrived: 'Geland', enroute: 'Onderweg', expected: 'Op tijd verwacht', boarding: 'Boarden', checkin: 'Inchecken', gateclosed: 'Gate gesloten', diverted: 'Omgeleid' }
  const rawStatusKey = flight.status?.toLowerCase().replace(/[\s-]/g, '') ?? ''
  const translatedStatus = rawStatusKey === 'departed' ? null : (STATUS_NL[rawStatusKey] ?? flight.status ?? null)
  const statusLabel = isCancelled ? 'Geannuleerd' : isDelayed ? `+${flight.delayMinutes ?? '?'} min` : (flight.delayMinutes != null && flight.delayMinutes < 15) ? 'Op tijd' : translatedStatus

  return (
    <button type="button" onClick={onSelect} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
        padding: '1rem 1.25rem',
        background: isSelected ? 'var(--blue-light)' : hovered ? 'var(--blue-light)' : '#fff',
        border: `1.5px solid ${isSelected ? 'var(--blue)' : hovered ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
      }}
    >
      <AirlineLogo iata={flight.iataPrefix} name={flight.airline} />
      <div style={{ flexShrink: 0, minWidth: '4.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', color: 'var(--text)' }}>{flight.flightNumber}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{flight.airline || flight.iataPrefix}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{flight.departureLocal ?? '—'}</span>
        {flight.arrivalLocal && (
          <>
            <svg width="28" height="8" viewBox="0 0 28 8" fill="none" style={{ opacity: 0.3 }}>
              <path d="M0 4h24M20 1l4 3-4 3" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{flight.arrivalLocal}</span>
          </>
        )}
      </div>
      {statusLabel && (
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor, background: statusColor + '14', border: `1px solid ${statusColor}30`, borderRadius: '4px', padding: '0.2rem 0.5rem', flexShrink: 0 }}>{statusLabel}</span>
      )}
      {isSelected ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="10" cy="10" r="9" fill="var(--blue)" />
          <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: hovered ? 1 : 0.35, transition: 'opacity 0.15s' }}>
          <path d="M4 8h8M8 4l4 4-4 4" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SelecteerVluchtPage() {
  const router = useRouter()
  const [params, setParams] = useState<RouteSearchParams | null>(null)

  const [flights, setFlights] = useState<RouteFlightOption[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loaded')
  const [showManual, setShowManual] = useState(false)
  const [manualFlight, setManualFlight] = useState('')

  // Multi-leg state
  const [legFlights, setLegFlights] = useState<RouteFlightOption[][]>([])
  const [legLoadStates, setLegLoadStates] = useState<(LoadState | null)[]>([])
  const [selectedLegs, setSelectedLegs] = useState<(RouteFlightOption | null)[]>([])
  const [manualLegs, setManualLegs] = useState<string[]>([])
  const [legValidationError, setLegValidationError] = useState<string | null>(null)
  const legCacheRef = useRef<Map<string, RouteFlightOption[]>>(new Map())
  const lastDirectSearchRef = useRef('')

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_route_search')
    if (!raw) { router.replace('/'); return }
    const p = JSON.parse(raw) as RouteSearchParams
    if (!p.type || !p.stopover) { router.replace('/selecteer/details'); return }
    setParams(p)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Search direct flights
  function searchFlights(p: RouteSearchParams) {
    setLoadState('loading')
    setFlights([])
    fetch(`/api/route-search?origin=${p.origin}&destination=${p.destination}&date=${p.date}`)
      .then(r => r.json())
      .then((data: RouteFlightOption[]) => {
        const safe = Array.isArray(data) ? data : []
        setFlights(safe)
        setLoadState('loaded')
      })
      .catch(() => setLoadState('error'))
  }

  // Trigger direct flight search
  useEffect(() => {
    if (!params || params.stopover !== 'no' || !params.date) return
    const key = `${params.origin}|${params.destination}|${params.date}`
    if (key === lastDirectSearchRef.current) return
    lastDirectSearchRef.current = key
    searchFlights(params)
  }, [params?.stopover, params?.date, params?.origin, params?.destination]) // eslint-disable-line

  // Fetch multi-leg flights
  useEffect(() => {
    if (!params?.date || !params.viaAirports || params.viaAirports.length === 0) return
    let cancelled = false
    const viaAirports = params.viaAirports
    const allAirports = [params.origin, ...viaAirports, params.destination]
    const numLegs = allAirports.length - 1

    setLegFlights(Array.from({ length: numLegs }, () => []))
    setLegLoadStates(Array(numLegs).fill(null))
    setSelectedLegs(prev => Array.from({ length: numLegs }, (_, i) => prev[i] ?? null))
    setManualLegs(prev => Array.from({ length: numLegs }, (_, i) => prev[i] ?? ''))

    function addDays(dateStr: string, days: number): string {
      const d = new Date(dateStr + 'T12:00')
      d.setDate(d.getDate() + days)
      return d.toISOString().split('T')[0]
    }

    async function fetchLegDates(from: string, to: string, legIndex: number): Promise<RouteFlightOption[]> {
      const fetchDate = async (d: string) => {
        const data = await fetch(`/api/route-search?origin=${from}&destination=${to}&date=${d}`).then(r => r.json()).catch(() => [])
        return Array.isArray(data) ? data as RouteFlightOption[] : []
      }
      const primary = await fetchDate(params!.date)
      if (primary.length > 0 || legIndex === 0) return primary
      return fetchDate(addDays(params!.date, legIndex))
    }

    async function fetchLegs() {
      for (let i = 0; i < numLegs; i++) {
        const from = allAirports[i]
        const to = allAirports[i + 1]
        const key = `${from}:${to}:${params!.date}:leg${i}`
        setLegLoadStates(prev => { const n = [...prev]; n[i] = 'loading'; return n })
        let result: RouteFlightOption[]
        if (legCacheRef.current.has(key)) {
          result = legCacheRef.current.get(key)!
        } else {
          result = await fetchLegDates(from, to, i)
          if (cancelled) return
          legCacheRef.current.set(key, result)
        }
        if (cancelled) return
        setLegFlights(prev => { const n = [...prev]; n[i] = result; return n })
        setLegLoadStates(prev => { const n = [...prev]; n[i] = 'loaded'; return n })
      }
    }
    fetchLegs()
    return () => { cancelled = true }
  }, [params?.viaAirports, params?.date, params?.origin, params?.destination]) // eslint-disable-line

  const selectFlight = useCallback((flight: RouteFlightOption, connecting: boolean) => {
    if (!params) return
    const claimDistanceKm = connecting ? haversineDistance(params.origin, params.destination) : undefined
    const prefetchedFlight = {
      flightNumber: flight.flightNumber, date: params.date, type: params.type,
      airline: flight.airline, iataPrefix: flight.iataPrefix,
      origin: flight.origin, destination: flight.destination,
      scheduledDeparture: null, scheduledArrival: null, actualArrival: null,
      delayMinutes: flight.delayMinutes, distanceKm: claimDistanceKm ?? flight.distanceKm, found: true,
    }
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: flight.flightNumber, date: params.date, type: params.type,
      ...(claimDistanceKm != null ? { claimDistanceKm } : {}),
      prefetchedFlight,
    }))
    trackFlightSelected({ flightNumber: flight.flightNumber, airline: flight.airline, iataPrefix: flight.iataPrefix, claimType: params.type ?? '', isManual: false })
    router.push('/laden')
  }, [params, router])

  const selectManual = useCallback(() => {
    if (!params || !manualFlight.trim()) return
    const fn = manualFlight.trim().toUpperCase()
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: fn, date: params.date, type: params.type,
    }))
    trackFlightSelected({ flightNumber: fn, airline: '', iataPrefix: fn.slice(0, 2), claimType: params.type ?? '', isManual: true })
    router.push('/laden')
  }, [params, manualFlight, router])

  function goToMultiResults() {
    if (!params || flights.length === 0) return
    const results = flights.map(f => {
      const comp = calculateCompensation(f.distanceKm ?? null, f.delayMinutes ?? null, params.type, f.delayMinutes != null,
        { origin: f.origin, destination: f.destination, cancellationNotice: params.cancellationNotice, causeType: params.causeType })
      return { flight: { flightNumber: f.flightNumber, date: params.date, type: params.type, airline: f.airline, iataPrefix: f.iataPrefix, origin: f.origin, destination: f.destination, scheduledDeparture: null, scheduledArrival: null, actualArrival: null, delayMinutes: f.delayMinutes, distanceKm: f.distanceKm, found: true }, compensation: comp }
    })
    sessionStorage.setItem('vv_multi_results', JSON.stringify(results))
    sessionStorage.removeItem('vv_result')
    sessionStorage.removeItem('vv_token')
    router.push('/uitkomst')
  }

  const proceedWithConnecting = useCallback(() => {
    if (!params) return
    const viaAirports = params.viaAirports ?? []
    const numLegs = viaAirports.length + 1
    const flightNumbers: string[] = []
    const prefetchedFlights: object[] = []
    setLegValidationError(null)

    for (let i = 0; i < numLegs; i++) {
      const sel = selectedLegs[i]
      const man = (manualLegs[i] ?? '').trim().toUpperCase()
      const fn = sel?.flightNumber ?? (man || null)
      if (fn) {
        flightNumbers.push(fn)
        if (sel) {
          prefetchedFlights.push({ flightNumber: sel.flightNumber, date: params.date, type: params.type, airline: sel.airline, iataPrefix: sel.iataPrefix, origin: sel.origin, destination: sel.destination, scheduledDeparture: null, scheduledArrival: null, actualArrival: null, delayMinutes: sel.delayMinutes, distanceKm: null, found: true })
        }
      } else {
        const allAirports = [params.origin, ...viaAirports, params.destination]
        setLegValidationError(`Selecteer of voer het vluchtnummer in voor leg ${i + 1}: ${allAirports[i]} → ${allAirports[i + 1]}`)
        return
      }
    }
    if (!flightNumbers.length) return
    const claimDistanceKm = haversineDistance(params.origin, params.destination)
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: flightNumbers[0], flightNumbers, date: params.date, type: params.type,
      claimDistanceKm, isConnecting: true,
      ...(prefetchedFlights.length > 0 ? { prefetchedFlights } : {}),
    }))
    router.push('/laden')
  }, [params, selectedLegs, manualLegs, router])

  const originName = params ? (AIRPORTS[params.origin]?.name ?? params.origin) : ''
  const destinationName = params ? (AIRPORTS[params.destination]?.name ?? params.destination) : ''
  const viaAirports = params?.viaAirports ?? []
  const isMultiLeg = params?.stopover === 'yes'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: isMultiLeg && selectedLegs.some(s => s) ? '9rem' : '4rem' }}>
      <FunnelNav step={1} progress={50} />

      <div className="funnel-grid" style={{ paddingTop: '2.5rem' }}>
        <div>

          {/* Route strip */}
          {params && (
            <div className="animate-fade-up d1 route-strip" style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                <span className="route-iata" style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>{params.origin}</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--blue-light)', borderRadius: '6px', padding: '0.25rem 0.625rem' }}>
                  <svg width="18" height="8" viewBox="0 0 24 10" fill="none">
                    <path d="M0 5h20M16 2l4 3-4 3" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="route-iata" style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>{params.destination}</span>
              </div>
              <div className="route-names" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {originName} → {destinationName}
                  {params.date && <span style={{ color: 'var(--text-sub)', fontWeight: 500 }}> · {new Date(params.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                </span>
              </div>
            </div>
          )}

          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Selecteer jouw vlucht
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {isMultiLeg ? 'Selecteer voor elke leg de juiste vlucht.' : 'Klik op je vlucht om direct door te gaan.'}
          </p>

          {/* Direct flights */}
          {!isMultiLeg && (
            <div style={{ marginBottom: '1.5rem' }}>
              {loadState === 'loading' && (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--blue)', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.875rem' }} />
                  <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>Vluchten zoeken…</p>
                </div>
              )}
              {loadState === 'loaded' && flights.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', margin: 0 }}>
                      {flights.length > 1 ? `${flights.length} vluchten gevonden` : 'Jouw vlucht'}
                    </p>
                    {flights.length > 1 && (
                      <button type="button" onClick={goToMultiResults} style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)', background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '6px', padding: '0.2rem 0.625rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        Bekijk compensatie
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {flights.map(f => (
                      <FlightCard key={f.flightNumber} flight={f} onSelect={() => selectFlight(f, false)} isConnecting={false} />
                    ))}
                  </div>
                </>
              )}
              {loadState === 'loaded' && flights.length === 0 && (
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '1.5rem 1.25rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.4rem', fontFamily: 'var(--font-sora)' }}>
                    {params?.type === 'geannuleerd'
                      ? 'Geannuleerde vlucht niet gevonden in de database'
                      : `Geen vluchten gevonden op ${params?.date ? new Date(params.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }) : 'deze datum'}`}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.55 }}>
                    {params?.type === 'geannuleerd'
                      ? 'Dat klopt vaak — geannuleerde vluchten staan niet altijd in realtime-data. Gebruik je vluchtnummer van de boekingsbevestiging.'
                      : 'Gebruik je vluchtnummer van de boekingsbevestiging om door te gaan.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManual(true)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.75rem 1rem' }}
                  >
                    Voer vluchtnummer handmatig in
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.625rem 0 0' }}>
                    of{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/selecteer/details')}
                      style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.72rem', color: 'var(--blue)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
                    >
                      probeer een andere datum
                    </button>
                  </p>
                </div>
              )}
              {loadState === 'error' && (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>Kon geen vluchten ophalen. Voer je vluchtnummer handmatig in.</p>
                </div>
              )}
            </div>
          )}

          {/* Multi-leg flights */}
          {isMultiLeg && (
            <div style={{ marginBottom: '1.5rem' }}>
              {viaAirports.length === 0 && (
                <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--blue)', fontWeight: 500 }}>
                    Ga terug en voeg een tussenstop-luchthaven in om vluchten te zoeken.
                  </p>
                </div>
              )}
              {viaAirports.length > 0 && (() => {
                const allAirports = [params!.origin, ...viaAirports, params!.destination]
                const numLegs = allAirports.length - 1
                return Array.from({ length: numLegs }, (_, i) => {
                  const from = allAirports[i]; const to = allAirports[i + 1]
                  const state = legLoadStates[i]; const legF = legFlights[i] ?? []
                  const selected = selectedLegs[i] ?? null; const manual = manualLegs[i] ?? ''
                  return (
                    <div key={`${from}-${to}`} style={{ marginBottom: '1.5rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', margin: '0 0 0.75rem' }}>
                        Leg {i + 1} — {from} → {to}
                      </p>
                      {state === 'loading' && (
                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2.5px solid var(--border)', borderTopColor: 'var(--blue)', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.5rem' }} />
                          <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>Vluchten zoeken…</p>
                        </div>
                      )}
                      {selected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'var(--green-dim)', border: '1.5px solid var(--green-border)', borderRadius: '10px', padding: '0.875rem 1.125rem' }}>
                          <AirlineLogo iata={selected.iataPrefix} name={selected.airline} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', color: 'var(--text)' }}>{selected.flightNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {selected.departureLocal && selected.arrivalLocal ? `${selected.departureLocal} → ${selected.arrivalLocal}` : selected.airline}
                            </div>
                          </div>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="9" cy="9" r="8" fill="var(--green)" />
                            <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <button type="button" onClick={() => setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n })} style={{ flexShrink: 0, padding: '0.375rem 0.75rem', borderRadius: '7px', border: '1.5px solid var(--green-border)', background: '#fff', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green)', cursor: 'pointer' }}>
                            Wijzigen
                          </button>
                        </div>
                      )}
                      {!selected && state === 'loaded' && legF.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                          {legF.map(f => (
                            <FlightCard key={f.flightNumber} flight={f} isConnecting={true} isSelected={false} onSelect={() => { setSelectedLegs(prev => { const n = [...prev]; n[i] = f; return n }); setManualLegs(prev => { const n = [...prev]; n[i] = ''; return n }) }} />
                          ))}
                        </div>
                      )}
                      {state === 'loaded' && legF.length === 0 && (
                        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.625rem', textAlign: 'center' }}>Geen vluchten gevonden op deze leg.</p>
                          <input type="text" value={manual} onChange={e => { const v = e.target.value.toUpperCase(); setManualLegs(prev => { const n = [...prev]; n[i] = v; return n }); setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n }) }} placeholder={`Vluchtnummer leg ${i + 1} (bijv. KL201)`} maxLength={8} style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--text)', outline: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--blue)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          )}

          {/* Manual entry (direct only) */}
          {!isMultiLeg && (
            <div style={{ marginBottom: '1rem' }}>
              <button type="button" onClick={() => setShowManual(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', background: showManual ? 'var(--section-alt)' : '#fff', border: `1.5px solid ${showManual ? 'var(--border-hover)' : 'var(--border)'}`, borderRadius: showManual ? '10px 10px 0 0' : '10px', padding: '0.875rem 1.25rem', cursor: 'pointer', color: 'var(--text-sub)', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M4 8h8M4 6h5M4 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                Ik weet mijn vluchtnummer
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', transform: showManual ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showManual && (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '0 0 10px 10px', borderTop: 'none', padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={manualFlight} onChange={e => setManualFlight(e.target.value.toUpperCase())} placeholder="bijv. KL1021" maxLength={8} style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--text)', outline: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--blue)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} onKeyDown={e => e.key === 'Enter' && selectManual()} />
                    <button type="button" onClick={selectManual} disabled={!manualFlight.trim()} style={{ background: manualFlight.trim() ? 'var(--blue)' : 'var(--border)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 1.25rem', fontWeight: 700, fontSize: '0.875rem', cursor: manualFlight.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sora)', transition: 'background 0.15s' }}>
                      Gebruik dit →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => router.push('/selecteer/details')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', padding: '0.75rem 0',
                fontFamily: 'inherit',
                marginTop: '1rem',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Terug
            </button>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Niet jouw vlucht? <a href="/" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>Zoek opnieuw</a>
            </p>
          </div>
        </div>
        <FunnelSidebar step={1} />
      </div>

      {/* Sticky CTA voor multi-leg */}
      {isMultiLeg && selectedLegs.some(s => s) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', borderTop: '1.5px solid var(--border)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '0.875rem 1.25rem', paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {Array.from({ length: viaAirports.length + 1 }, (_, i) => {
                const sel = selectedLegs[i]; const man = (manualLegs[i] ?? '').trim(); const fn = sel?.flightNumber ?? man
                if (!fn) return null
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '6px', padding: '0.3rem 0.625rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>L{i + 1}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-sora)', color: 'var(--blue)' }}>{fn}</span>
                    <button onClick={() => { setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n }); setManualLegs(prev => { const n = [...prev]; n[i] = ''; return n }) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 0 0 2px', lineHeight: 1 }}>×</button>
                  </div>
                )
              })}
            </div>
            {legValidationError && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--red)', margin: 0 }}>{legValidationError}</p>
              </div>
            )}
            <button onClick={proceedWithConnecting} className="btn-primary">
              {(() => { const n = selectedLegs.filter(Boolean).length; return n === 1 ? 'Doorgaan met 1 vlucht →' : `Doorgaan met ${n} vluchten →` })()}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
