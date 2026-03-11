'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS, haversineDistance } from '@/lib/airports'
import { getAirlineConfig } from '@/lib/airlines'
import AirportCombobox from '@/components/AirportCombobox'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import { suggestVia } from '@/lib/via-suggestions'
import { calculateCompensation } from '@/lib/compensation'
import type { RouteFlightOption, RouteSearchParams, CancellationNotice, CauseType, FlightType } from '@/lib/types'

type LoadState = 'loading' | 'loaded' | 'error'
type StopoverAnswer = 'yes' | 'no' | null

// ── Sub-components ────────────────────────────────────────────────────────────

function AirlineLogo({ iata, name }: { iata: string; name: string }) {
  const [imgError, setImgError] = useState(false)
  const conf = getAirlineConfig(iata)
  const displayName = conf.name !== 'de airline' ? conf.name : name || iata

  if (!imgError && iata) {
    return (
      <div style={{
        width: '40px', height: '40px', borderRadius: '8px',
        border: '1px solid var(--border)', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://www.gstatic.com/flights/airline_logos/70px/${iata}.png`}
          alt={displayName}
          width={32}
          height={32}
          onError={() => setImgError(true)}
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }

  // Fallback: colored text badge
  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
      background: conf.color + '18', border: `1px solid ${conf.color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: '0.6rem', fontWeight: 800, fontFamily: 'var(--font-sora)', color: conf.color }}>
        {iata || displayName.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

function FlightCard({ flight, onSelect, isConnecting, isSelected = false, compensation }: {
  flight: RouteFlightOption; onSelect: () => void; isConnecting: boolean; isSelected?: boolean
  compensation?: { eligible: boolean; amountPerPerson: number } | null
}) {
  const [hovered, setHovered] = useState(false)
  const isDelayed = (flight.delayMinutes != null && flight.delayMinutes >= 15) || flight.status?.toLowerCase().includes('delay')
  const isCancelled = flight.status?.toLowerCase().includes('cancel')
  const statusColor = isCancelled ? 'var(--red)' : isDelayed ? 'var(--orange)' : 'var(--green)'

  const STATUS_NL: Record<string, string> = {
    arrived: 'Geland', enroute: 'Onderweg',
    expected: 'Op tijd verwacht', boarding: 'Boarden', checkin: 'Inchecken',
    gateclosed: 'Gate gesloten', diverted: 'Omgeleid',
  }
  const rawStatusKey = flight.status?.toLowerCase().replace(/[\s-]/g, '') ?? ''
  // "Departed" is the default state for all historical flights — not useful, omit it
  const translatedStatus = rawStatusKey === 'departed' ? null : (STATUS_NL[rawStatusKey] ?? flight.status ?? null)

  const statusLabel = isCancelled
    ? 'Geannuleerd'
    : isDelayed
      ? `+${flight.delayMinutes ?? '?'} min`
      : (flight.delayMinutes != null && flight.delayMinutes < 15)
        ? 'Op tijd'
        : translatedStatus

  return (
    <button type="button" onClick={onSelect}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
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
        <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', color: 'var(--text)' }}>
          {flight.flightNumber}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
          {flight.airline || flight.iataPrefix}
        </div>
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
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, color: statusColor,
          background: statusColor + '14', border: `1px solid ${statusColor}30`,
          borderRadius: '4px', padding: '0.2rem 0.5rem', flexShrink: 0,
        }}>{statusLabel}</span>
      )}
      {compensation && (
        <span style={{
          fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
          color: compensation.eligible ? 'var(--green)' : 'var(--text-muted)',
          background: compensation.eligible ? 'var(--green-dim)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${compensation.eligible ? 'var(--green-border)' : 'var(--border)'}`,
          borderRadius: '4px', padding: '0.2rem 0.5rem',
        }}>
          {compensation.eligible ? `€${compensation.amountPerPerson}` : 'Geen recht'}
        </span>
      )}
      {isSelected ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="10" cy="10" r="9" fill="var(--blue)" />
          <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ flexShrink: 0, opacity: hovered ? 1 : 0.35, transition: 'opacity 0.15s' }}>
          <path d="M4 8h8M8 4l4 4-4 4" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SelecteerPage() {
  const router = useRouter()
  const [params, setParams] = useState<RouteSearchParams | null>(null)

  // Step 1: tussenstop question
  const [stopover, setStopover] = useState<StopoverAnswer>(null)

  // Multi-stopover: array of committed via airports (IATA codes)
  const [viaAirports, setViaAirports] = useState<string[]>([])
  // Whether to show combobox for a new (pending) via airport
  const [addingVia, setAddingVia] = useState(false)

  // Per-leg state arrays (index = leg number, 0-based)
  const [legFlights, setLegFlights] = useState<RouteFlightOption[][]>([])
  const [legLoadStates, setLegLoadStates] = useState<(LoadState | null)[]>([])
  const [selectedLegs, setSelectedLegs] = useState<(RouteFlightOption | null)[]>([])
  const [manualLegs, setManualLegs] = useState<string[]>([])

  // Cache: key = "FROM:TO:DATE" → prevents re-fetching unchanged legs
  const legCacheRef = useRef<Map<string, RouteFlightOption[]>>(new Map())
  // Track last direct-flight search to avoid duplicate calls
  const lastDirectSearchRef = useRef('')

  // Direct flight state
  const [flights, setFlights] = useState<RouteFlightOption[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loaded')
  const [flightCompensations, setFlightCompensations] = useState<Record<string, { eligible: boolean; amountPerPerson: number }>>( {})

  // Manual entry (direct only)
  const [showManual, setShowManual] = useState(false)
  const [manualFlight, setManualFlight] = useState('')

  // Eligibility refiners — persisted to vv_route_search
  const [cancellationNotice, setCancellationNotice] = useState<CancellationNotice | null>(null)
  const [causeType, setCauseType] = useState<CauseType | null>(null)

  // Annulering: 2-staps notice matrix
  // noticeWindow = eerste vraag (wanneer gemeld?), alternativeAdequate = tweede vraag
  const [noticeWindow, setNoticeWindow] = useState<'gt14days' | 'd7_13' | 'lt7' | 'no_notice' | null>(null)
  const [alternativeAdequate, setAlternativeAdequate] = useState<boolean | null>(null)

  // Connecting flight: één boeking of aparte tickets?
  const [singleBooking, setSingleBooking] = useState<'single' | 'separate' | null>(null)

  // Multi-leg validatie error
  const [legValidationError, setLegValidationError] = useState<string | null>(null)

  function updateRouteParam<K extends keyof RouteSearchParams>(key: K, value: RouteSearchParams[K]) {
    setParams(prev => {
      if (!prev) return prev
      const updated = { ...prev, [key]: value }
      sessionStorage.setItem('vv_route_search', JSON.stringify(updated))
      return updated
    })
  }

  function handleCancellationNotice(val: CancellationNotice) {
    setCancellationNotice(val)
    updateRouteParam('cancellationNotice', val)
  }

  function handleCauseType(val: CauseType) {
    setCauseType(val)
    updateRouteParam('causeType', val)
  }

  // Compute + store cancellationNotice from 2-step notice matrix
  function handleNoticeWindow(window: 'gt14days' | 'd7_13' | 'lt7' | 'no_notice') {
    setNoticeWindow(window)
    setAlternativeAdequate(null)
    if (window === 'gt14days') {
      handleCancellationNotice('gt14days')
    } else if (window === 'no_notice') {
      handleCancellationNotice('no_notice')
    }
    // d7_13 / lt7: wait for alternativeAdequate answer
  }

  function handleAlternativeAdequate(adequate: boolean) {
    setAlternativeAdequate(adequate)
    if (noticeWindow === 'd7_13') {
      handleCancellationNotice(adequate ? 'd7_13_ok' : 'd7_13_bad')
    } else if (noticeWindow === 'lt7') {
      handleCancellationNotice(adequate ? 'lt7_ok' : 'lt7_bad')
    }
  }

  function handleSingleBooking(val: 'single' | 'separate') {
    setSingleBooking(val)
    updateRouteParam('singleBooking', val)
  }

  function handleTypeChange(newType: FlightType) {
    if (!params) return
    // Reset all flight state
    setFlights([])
    setFlightCompensations({})
    setLoadState('loaded')
    setStopover(null)
    setViaAirports([])
    setAddingVia(false)
    setLegFlights([])
    setLegLoadStates([])
    setSelectedLegs([])
    setManualLegs([])
    setManualFlight('')
    setShowManual(false)
    lastDirectSearchRef.current = ''
    // Reset eligibility refiners
    setCancellationNotice(null)
    setCauseType(null)
    setNoticeWindow(null)
    setAlternativeAdequate(null)
    setSingleBooking(null)
    setLegValidationError(null)
    const updated: RouteSearchParams = { ...params, type: newType, cancellationNotice: undefined, causeType: undefined, singleBooking: undefined, ticketPriceEur: undefined }
    setParams(updated)
    sessionStorage.setItem('vv_route_search', JSON.stringify(updated))
  }

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_route_search')
    if (!raw) { router.replace('/'); return }
    const p = JSON.parse(raw) as RouteSearchParams
    setParams(p)
    if (p.cancellationNotice) setCancellationNotice(p.cancellationNotice)
    if (p.causeType) setCauseType(p.causeType)
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
        const comps: Record<string, { eligible: boolean; amountPerPerson: number }> = {}
        safe.forEach(f => {
          const c = calculateCompensation(f.distanceKm ?? null, f.delayMinutes ?? null, p.type, f.delayMinutes != null,
            { origin: f.origin, destination: f.destination, cancellationNotice: p.cancellationNotice, causeType: p.causeType })
          comps[f.flightNumber] = { eligible: c.eligible, amountPerPerson: c.amountPerPerson }
        })
        setFlightCompensations(comps)
      })
      .catch(() => setLoadState('error'))
  }

  // Fetch all connecting legs whenever viaAirports changes (cached — no redundant API calls)
  // For legs after leg 0, also searches date+legIndex to handle overnight/multi-day layovers.
  useEffect(() => {
    if (!params?.date || viaAirports.length === 0) return
    let cancelled = false

    const allAirports = [params.origin, ...viaAirports, params.destination]
    const numLegs = allAirports.length - 1

    // Initialise per-leg state arrays (preserve existing selections)
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
      // Always fetch primary date first. For leg i>0, fall back to date+i only if no results
      // (sequential to avoid hitting the AeroDataBox 1 req/sec rate limit with parallel calls).
      const fetchDate = async (d: string) => {
        const data = await fetch(`/api/route-search?origin=${from}&destination=${to}&date=${d}`)
          .then(r => r.json()).catch(() => [])
        return Array.isArray(data) ? data as RouteFlightOption[] : []
      }

      const primary = await fetchDate(params!.date)
      if (primary.length > 0 || legIndex === 0) return primary

      // Primary date returned nothing and this is an intermediate leg — try date+legIndex (overnight layover)
      const nextDay = addDays(params!.date, legIndex)
      const fallback = await fetchDate(nextDay)
      return fallback
    }

    async function fetchLegs() {
      for (let i = 0; i < numLegs; i++) {
        const from = allAirports[i]
        const to = allAirports[i + 1]
        const key = `${from}:${to}:${params!.date}:leg${i}`

        setLegLoadStates(prev => { const n = [...prev]; n[i] = 'loading'; return n })

        let flights: RouteFlightOption[]
        if (legCacheRef.current.has(key)) {
          flights = legCacheRef.current.get(key)!
        } else {
          flights = await fetchLegDates(from, to, i)
          if (cancelled) return
          legCacheRef.current.set(key, flights)
        }

        if (cancelled) return
        setLegFlights(prev => { const n = [...prev]; n[i] = flights; return n })
        setLegLoadStates(prev => { const n = [...prev]; n[i] = 'loaded'; return n })
      }
    }

    fetchLegs()
    return () => { cancelled = true }
  }, [viaAirports, params?.date, params?.origin, params?.destination])

  function handleDateChange(newDate: string) {
    if (!params) return
    const updated = { ...params, date: newDate }
    setParams(updated)
    sessionStorage.setItem('vv_route_search', JSON.stringify(updated))
    // Direct-flight search is handled by the useEffect below
    // Via-leg fetching is handled by the useEffect that watches params.date + viaIata
  }

  function handleStopoverAnswer(answer: StopoverAnswer) {
    lastDirectSearchRef.current = '' // reset so useEffect re-triggers if needed
    setStopover(answer)
    setViaAirports([])
    setAddingVia(answer === 'yes')
    setLegFlights([])
    setLegLoadStates([])
    setSelectedLegs([])
    setManualLegs([])
    setFlights([])
    setFlightCompensations({})
  }

  // Single source of truth: search direct flights whenever stopover='no' + date is set
  useEffect(() => {
    if (stopover !== 'no' || !params?.date) return
    const key = `${params.origin}|${params.destination}|${params.date}`
    if (key === lastDirectSearchRef.current) return
    lastDirectSearchRef.current = key
    searchFlights(params)
  }, [stopover, params?.date, params?.origin, params?.destination]) // eslint-disable-line

  function addViaAirport(iata: string) {
    const next = [...viaAirports, iata]
    setViaAirports(next)
    setAddingVia(false)
  }

  function removeViaAirport(index: number) {
    const next = viaAirports.filter((_, i) => i !== index)
    setViaAirports(next)
    // Reset legs from the removed point onwards
    setSelectedLegs(prev => prev.slice(0, index))
    setManualLegs(prev => prev.slice(0, index))
    if (next.length === 0) setAddingVia(true)
  }

  const selectFlight = useCallback((flight: RouteFlightOption, connecting: boolean) => {
    if (!params) return
    const claimDistanceKm = connecting
      ? haversineDistance(params.origin, params.destination)
      : undefined
    // Store route-search data so LoadingScreen can skip the API call
    // (the /flights/number endpoint may not be available on the current plan)
    const prefetchedFlight = {
      flightNumber: flight.flightNumber,
      date: params.date,
      type: params.type,
      airline: flight.airline,
      iataPrefix: flight.iataPrefix,
      origin: flight.origin,
      destination: flight.destination,
      scheduledDeparture: null,
      scheduledArrival: null,
      actualArrival: null,
      delayMinutes: flight.delayMinutes,
      distanceKm: claimDistanceKm ?? flight.distanceKm,
      found: true,
    }
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: flight.flightNumber,
      date: params.date,
      type: params.type,
      ...(claimDistanceKm != null ? { claimDistanceKm } : {}),
      prefetchedFlight,
    }))
    router.push('/laden')
  }, [params, router])

  const selectManual = useCallback(() => {
    if (!params || !manualFlight.trim()) return
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: manualFlight.trim().toUpperCase(),
      date: params.date,
      type: params.type,
    }))
    router.push('/laden')
  }, [params, manualFlight, router])

  function goToMultiResults() {
    if (!params || flights.length === 0) return
    const results = flights.map(f => {
      const comp = calculateCompensation(f.distanceKm ?? null, f.delayMinutes ?? null, params.type, f.delayMinutes != null,
        { origin: f.origin, destination: f.destination, cancellationNotice: params.cancellationNotice, causeType: params.causeType })
      return {
        flight: {
          flightNumber: f.flightNumber,
          date: params.date,
          type: params.type,
          airline: f.airline,
          iataPrefix: f.iataPrefix,
          origin: f.origin,
          destination: f.destination,
          scheduledDeparture: null,
          scheduledArrival: null,
          actualArrival: null,
          delayMinutes: f.delayMinutes,
          distanceKm: f.distanceKm,
          found: true,
        },
        compensation: comp,
      }
    })
    sessionStorage.setItem('vv_multi_results', JSON.stringify(results))
    sessionStorage.removeItem('vv_result')
    sessionStorage.removeItem('vv_token')
    router.push('/uitkomst')
  }

  const proceedWithConnecting = useCallback(() => {
    if (!params) return
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
          prefetchedFlights.push({
            flightNumber: sel.flightNumber, date: params.date, type: params.type,
            airline: sel.airline, iataPrefix: sel.iataPrefix,
            origin: sel.origin, destination: sel.destination,
            scheduledDeparture: null, scheduledArrival: null, actualArrival: null,
            delayMinutes: sel.delayMinutes, distanceKm: null, found: true,
          })
        }
      } else {
        // Leg has no selection and no manual entry — validation error
        const allAirports = [params.origin, ...viaAirports, params.destination]
        setLegValidationError(`Selecteer of voer het vluchtnummer in voor leg ${i + 1}: ${allAirports[i]} → ${allAirports[i + 1]}`)
        return
      }
    }

    if (!flightNumbers.length) return
    const claimDistanceKm = haversineDistance(params.origin, params.destination)

    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: flightNumbers[0],
      flightNumbers,
      date: params.date,
      type: params.type,
      claimDistanceKm,
      isConnecting: true,
      ...(prefetchedFlights.length > 0 ? { prefetchedFlights } : {}),
    }))
    router.push('/laden')
  }, [params, viaAirports, selectedLegs, manualLegs, router])

  const originName = params ? (AIRPORTS[params.origin]?.name ?? params.origin) : ''
  const destinationName = params ? (AIRPORTS[params.destination]?.name ?? params.destination) : ''
  const formatDate = (d: string) =>
    new Date(d + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  const dateReady = !!params?.date
  const showFlightSection = stopover !== null && dateReady

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: stopover === 'yes' && selectedLegs.some(s => s) ? '9rem' : '4rem' }}>

      <FunnelNav step={1} />

      <div className="funnel-grid" style={{ paddingTop: '2.5rem' }}>
      <div>

        {/* Route hero strip */}
        {params && (
          <div
            className="animate-fade-in"
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* IATA codes + arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {params.origin}
              </span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: 'var(--blue-light)', borderRadius: '6px', padding: '0.25rem 0.625rem',
              }}>
                <svg width="18" height="8" viewBox="0 0 24 10" fill="none">
                  <path d="M0 5h20M16 2l4 3-4 3" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {params.destination}
              </span>
            </div>
            {/* Full names + date + type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {originName} → {destinationName}
                {params.date && <span style={{ color: 'var(--text-sub)', fontWeight: 500 }}> · {formatDate(params.date)}</span>}
              </span>
              {params.type && (
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px',
                  background: params.type === 'geannuleerd' ? 'var(--red-dim)' : params.type === 'geweigerd' ? 'var(--orange-dim)' : params.type === 'downgrade' ? 'rgba(139,92,246,0.1)' : 'var(--blue-light)',
                  color: params.type === 'geannuleerd' ? 'var(--red)' : params.type === 'geweigerd' ? 'var(--orange)' : params.type === 'downgrade' ? '#7c3aed' : 'var(--blue)',
                  border: `1px solid ${params.type === 'geannuleerd' ? 'rgba(220,38,38,0.2)' : params.type === 'geweigerd' ? 'rgba(249,115,22,0.2)' : params.type === 'downgrade' ? 'rgba(139,92,246,0.25)' : 'var(--blue-border)'}`,
                }}>
                  {{ vertraagd: 'Vertraging', geannuleerd: 'Annulering', geweigerd: 'Instapweigering', downgrade: 'Klasseverlaging' }[params.type]}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── STAP 0: Wat is de reden? ─────────────────────────────────────── */}
        {params && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
              Wat is de reden van je claim?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {([
                {
                  val: 'vertraagd' as FlightType,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M9 5v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  label: 'Vertraging',
                  sub: 'Vlucht arriveerde meer dan 3 uur te laat',
                },
                {
                  val: 'geannuleerd' as FlightType,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 15L15 3M10.5 3.5l4 1-1 4M7.5 14.5l-4-1 1-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  label: 'Annulering',
                  sub: 'Vlucht werd geannuleerd door de airline',
                },
                {
                  val: 'geweigerd' as FlightType,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M13 8l3 3M16 8l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  ),
                  label: 'Instapweigering',
                  sub: 'Je werd geweigerd door overboeking of een andere reden',
                },
                {
                  val: 'downgrade' as FlightType,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="4" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                      <rect x="2" y="10" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 1.5" />
                      <path d="M9 8.5v2M7.5 10l1.5 1.5L10.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  label: 'Klasseverlaging (downgrade)',
                  sub: 'Je vloog in een lagere klasse dan je geboekt en betaald had',
                },
              ]).map(opt => {
                const isActive = params.type === opt.val
                return (
                  <button key={opt.val} type="button" onClick={() => handleTypeChange(opt.val)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.875rem 1.125rem', borderRadius: '10px', cursor: 'pointer',
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
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="9" cy="9" r="8" fill="var(--blue)" />
                        <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STAP 1: Datum ────────────────────────────────────────────────── */}
        {params && (
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              color: 'var(--text-sub)', marginBottom: '0.4rem',
            }}>
              Wanneer vloog je?
            </label>
            <input
              type="date"
              value={params?.date ?? ''}
              onChange={e => handleDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min={new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="input-field"
              style={{ colorScheme: 'light', maxWidth: '220px' }}
            />
          </div>
        )}

        {/* ── STAP 2: Tussenstop vraag ─────────────────────────────────────── */}
        {params && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem',
            }}>
              Had je een tussenstop?
            </p>

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {/* Nee */}
              <button type="button" onClick={() => handleStopoverAnswer('no')}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: '0.25rem', padding: '1rem 1.25rem', borderRadius: '10px', cursor: 'pointer',
                  border: `2px solid ${stopover === 'no' ? 'var(--blue)' : 'var(--border)'}`,
                  background: stopover === 'no' ? 'var(--blue-light)' : '#fff',
                  transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10h14M13 6l4 4-4 4" stroke={stopover === 'no' ? 'var(--blue)' : 'var(--text-muted)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: stopover === 'no' ? 'var(--blue)' : 'var(--text)' }}>
                    Nee, directe vlucht
                  </span>
                  {stopover === 'no' && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto' }}>
                      <circle cx="8" cy="8" r="7" fill="var(--blue)" />
                      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', paddingLeft: '1.75rem' }}>
                  Ik vloog rechtstreeks van A naar B
                </span>
              </button>

              {/* Ja */}
              <button type="button" onClick={() => handleStopoverAnswer('yes')}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  gap: '0.25rem', padding: '1rem 1.25rem', borderRadius: '10px', cursor: 'pointer',
                  border: `2px solid ${stopover === 'yes' ? 'var(--blue)' : 'var(--border)'}`,
                  background: stopover === 'yes' ? 'var(--blue-light)' : '#fff',
                  transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="4" cy="10" r="2" fill={stopover === 'yes' ? 'var(--blue)' : 'var(--text-muted)'} />
                    <circle cx="10" cy="6" r="2" fill={stopover === 'yes' ? 'var(--blue)' : 'var(--text-muted)'} />
                    <circle cx="16" cy="10" r="2" fill={stopover === 'yes' ? 'var(--blue)' : 'var(--text-muted)'} />
                    <path d="M6 10C7 8 8.5 6 10 6M10 6C11.5 6 13 8 14 10" stroke={stopover === 'yes' ? 'var(--blue)' : 'var(--text-muted)'} strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: stopover === 'yes' ? 'var(--blue)' : 'var(--text)' }}>
                    Ja, ik moest overstappen
                  </span>
                  {stopover === 'yes' && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto' }}>
                      <circle cx="8" cy="8" r="7" fill="var(--blue)" />
                      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', paddingLeft: '1.75rem' }}>
                  Mijn vlucht had één of meer stops
                </span>
              </button>
            </div>

            {/* Via airports (dynamic, 'yes' only) */}
            {stopover === 'yes' && (
              <div style={{ marginTop: '0.875rem' }}>
                {/* Committed via airports */}
                {viaAirports.map((iata, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: '0.625rem',
                      background: 'var(--blue-light)', border: '1.5px solid var(--blue-border)',
                      borderRadius: '8px', padding: '0.625rem 1rem',
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Stop {idx + 1}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-sora)', color: 'var(--blue)' }}>
                        {iata}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                        {AIRPORTS[iata]?.name ?? iata}
                      </span>
                    </div>
                    <button type="button" onClick={() => removeViaAirport(idx)} style={{
                      background: 'none', border: '1.5px solid var(--border)', borderRadius: '8px',
                      padding: '0.625rem 0.75rem', cursor: 'pointer', color: 'var(--text-muted)',
                      fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                    }}>
                      Verwijder
                    </button>
                  </div>
                ))}

                {/* Combobox for new via airport */}
                {addingVia && (
                  <div>
                    <label style={{
                      display: 'block', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: 'var(--text-sub)', marginBottom: '0.4rem',
                    }}>
                      {viaAirports.length === 0 ? 'Via welke luchthaven?' : `Stop ${viaAirports.length + 1}`}
                    </label>
                    <div style={{
                      background: '#fff', borderRadius: '8px',
                      border: '1.5px solid var(--border)',
                      overflow: 'visible', position: 'relative',
                    }}>
                      <AirportCombobox
                        value=""
                        onChange={addViaAirport}
                        placeholder="Tussenstop luchthaven (bijv. Dubai)"
                        inputStyle={{ padding: '0.8125rem 1rem' }}
                        suggestions={params && viaAirports.length === 0 ? suggestVia(params.origin, params.destination) : undefined}
                        suggestionsLabel={params && viaAirports.length === 0 ? `Logische tussenstops voor ${params.origin} → ${params.destination}` : undefined}
                      />
                    </div>
                    {viaAirports.length > 0 && (
                      <button type="button" onClick={() => setAddingVia(false)} style={{
                        marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      }}>
                        Annuleer
                      </button>
                    )}
                  </div>
                )}

                {/* Add another stop button */}
                {!addingVia && viaAirports.length > 0 && viaAirports.length < 3 && (
                  <button type="button" onClick={() => setAddingVia(true)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem',
                    background: 'none', border: '1.5px dashed var(--border)', borderRadius: '8px',
                    padding: '0.625rem 1rem', cursor: 'pointer', color: 'var(--text-muted)',
                    fontSize: '0.8rem', fontWeight: 600, width: '100%', transition: 'all 0.15s',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Nog een tussenstop toevoegen
                  </button>
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Compensatie wordt berekend op de totale reisafstand ({params?.origin} → {params?.destination}).
                </p>
              </div>
            )}

            {/* Enkele boeking vs. aparte tickets — alleen relevant bij tussenstop */}
            {stopover === 'yes' && viaAirports.length > 0 && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.625rem' }}>
                  Was dit één boeking of aparte tickets?
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { val: 'single' as const, label: 'Eén boeking', sub: 'Alle vluchten op één reserveringsnummer', ok: true },
                    { val: 'separate' as const, label: 'Aparte tickets', sub: 'Losse boekingen voor elke vlucht', ok: false },
                  ].map(opt => (
                    <button key={opt.val} type="button" onClick={() => handleSingleBooking(opt.val)}
                      style={{
                        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem',
                        padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${singleBooking === opt.val ? (opt.ok ? 'var(--green)' : 'var(--orange)') : 'var(--border)'}`,
                        background: singleBooking === opt.val ? (opt.ok ? 'var(--green-dim)' : 'rgba(249,115,22,0.07)') : '#fff',
                        transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: singleBooking === opt.val ? (opt.ok ? 'var(--green)' : 'var(--orange)') : 'var(--text)' }}>
                        {opt.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {singleBooking === 'separate' && (
                  <div style={{ marginTop: '0.625rem', padding: '0.75rem 1rem', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--orange)', margin: 0, lineHeight: 1.5 }}>
                      <strong>Let op:</strong> EC 261/2004 geldt alleen bij één boekingsreferentie. Bij aparte tickets heb je bij een gemiste aansluiting geen claim op de tweede vlucht. Wij controleren dit voor je.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STAP 3: Aanvullende vragen ────────────────────────────────────── */}

        {/* Vraag 3a: Annuleringsmelding — 2-staps matrix (alleen bij geannuleerd) */}
        {params && params.type === 'geannuleerd' && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
              Wanneer werd je op de hoogte gesteld van de annulering?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {([
                { val: 'no_notice' as const, label: 'Dag van de vlucht zelf (of niet gemeld)', sub: 'Altijd recht op compensatie', color: 'var(--blue)' },
                { val: 'lt7' as const,       label: 'Minder dan 7 dagen van tevoren', sub: 'Mogelijk recht — afhankelijk van aangeboden alternatief', color: 'var(--blue)' },
                { val: 'd7_13' as const,     label: '7 tot 13 dagen van tevoren', sub: 'Mogelijk recht — afhankelijk van aangeboden alternatief', color: 'var(--blue)' },
                { val: 'gt14days' as const,  label: '14 dagen of meer van tevoren', sub: 'Geen compensatierecht (EC 261/2004 art. 5(1)(c))', color: 'var(--red)' },
              ]).map(opt => (
                <button key={opt.val} type="button" onClick={() => handleNoticeWindow(opt.val)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: '0.15rem', padding: '0.875rem 1.125rem', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${noticeWindow === opt.val ? opt.color : 'var(--border)'}`,
                    background: noticeWindow === opt.val ? (opt.val === 'gt14days' ? 'rgba(220,38,38,0.05)' : 'var(--blue-light)') : '#fff',
                    transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: noticeWindow === opt.val ? opt.color : 'var(--text)' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                </button>
              ))}
            </div>

            {/* Sub-vraag: adequaatheid alternatief (bij d7_13 of lt7) */}
            {(noticeWindow === 'd7_13' || noticeWindow === 'lt7') && (
              <div style={{ marginTop: '0.875rem', padding: '1rem 1.125rem', background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)', margin: '0 0 0.625rem' }}>
                  {noticeWindow === 'd7_13'
                    ? 'Was het alternatief acceptabel? (max. 2u eerder vertrek + max. 4u later aankomst)'
                    : 'Was het alternatief acceptabel? (max. 1u eerder vertrek + max. 2u later aankomst)'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { val: false, label: 'Nee — slecht of geen alternatief', note: 'Recht op compensatie' },
                    { val: true,  label: 'Ja — acceptabel alternatief', note: 'Geen compensatierecht' },
                  ].map(opt => (
                    <button key={String(opt.val)} type="button" onClick={() => handleAlternativeAdequate(opt.val)}
                      style={{
                        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.1rem',
                        padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                        border: `2px solid ${alternativeAdequate === opt.val ? (opt.val ? 'var(--red)' : 'var(--green)') : 'var(--border)'}`,
                        background: alternativeAdequate === opt.val ? (opt.val ? 'rgba(220,38,38,0.05)' : 'var(--green-dim)') : '#fff',
                        transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: alternativeAdequate === opt.val ? (opt.val ? 'var(--red)' : 'var(--green)') : 'var(--text)' }}>
                        {opt.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(cancellationNotice === 'gt14days' || cancellationNotice === 'd7_13_ok' || cancellationNotice === 'lt7_ok') && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--red)', margin: 0, lineHeight: 1.5 }}>
                  <strong>Waarschijnlijk geen recht op compensatie</strong> op basis van de aankondiging (EC 261/2004 art. 5(1)(c)). Ga toch door als je twijfelt — een jurist beoordeelt je zaak kosteloos.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vraag 3b: Oorzaak — bij vertraagd of geannuleerd */}
        {params && (params.type === 'vertraagd' || params.type === 'geannuleerd') && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
              Wat was de oorzaak van de {params.type === 'vertraagd' ? 'vertraging' : 'annulering'}?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {([
                {
                  val: 'unknown' as CauseType,
                  label: 'Ik weet het niet / geen reden opgegeven',
                  sub: 'Meest gekozen — wij onderzoeken de oorzaak voor jou',
                  forceMajeure: false,
                },
                {
                  val: 'technical' as CauseType,
                  label: 'Technisch defect, staking of andere reden',
                  sub: 'Geen overmacht — jij hebt recht op compensatie',
                  forceMajeure: false,
                },
                {
                  val: 'weather' as CauseType,
                  label: 'Extreem slecht weer of luchtverkeersstaking',
                  sub: 'Ga toch door als je twijfelt — wij toetsen of dit echt overmacht was',
                  forceMajeure: true,
                },
              ]).map(opt => (
                <button key={opt.val} type="button" onClick={() => handleCauseType(opt.val)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: '0.15rem', padding: '0.875rem 1.125rem', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${causeType === opt.val ? (opt.forceMajeure ? 'var(--orange)' : 'var(--blue)') : 'var(--border)'}`,
                    background: causeType === opt.val ? (opt.forceMajeure ? 'rgba(249,115,22,0.07)' : 'var(--blue-light)') : '#fff',
                    transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: causeType === opt.val ? (opt.forceMajeure ? 'var(--orange)' : 'var(--blue)') : 'var(--text)' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                </button>
              ))}
            </div>
            {(causeType === 'weather' || causeType === 'atc-strike') && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--orange)', margin: 0, lineHeight: 1.5 }}>
                  <strong>Mogelijk geen compensatierecht</strong> bij buitengewone omstandigheden (art. 5(3)). Ga toch door als je twijfelt — wij checken of de omstandigheid echt als force majeure kwalificeert.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── STAP 4: Vluchten / Invoer ────────────────────────────────────── */}

        {/* Directe vluchten */}
        {showFlightSection && stopover === 'no' && (
          <div style={{ marginBottom: '1.5rem' }}>
            {loadState === 'loading' && (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '3px solid var(--border)', borderTopColor: 'var(--blue)',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 0.875rem',
                }} />
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
                    <button type="button" onClick={goToMultiResults} style={{
                      fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)',
                      background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
                      borderRadius: '6px', padding: '0.2rem 0.625rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      Bekijk compensatie
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5h8M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {flights.map(f => (
                    <FlightCard
                      key={f.flightNumber}
                      flight={f}
                      onSelect={() => selectFlight(f, false)}
                      isConnecting={false}
                      compensation={flightCompensations[f.flightNumber] ?? null}
                    />
                  ))}
                </div>
              </>
            )}
            {loadState === 'loaded' && flights.length === 0 && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
                  {params?.type === 'geannuleerd'
                    ? 'Geannuleerde vlucht niet gevonden in de database.'
                    : 'Geen directe vluchten gevonden op deze route en datum.'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {params?.type === 'geannuleerd'
                    ? 'Dat kan kloppen — gebruik je vluchtnummer van de boekingsbevestiging hieronder.'
                    : 'Gebruik de handmatige invoer hieronder.'}
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

        {/* Overstap vluchten — dynamic N legs */}
        {showFlightSection && stopover === 'yes' && (
          <div style={{ marginBottom: '1.5rem' }}>
            {viaAirports.length === 0 && (
              <div style={{ background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--blue)', fontWeight: 500 }}>
                  Selecteer eerst de tussenstop-luchthaven hierboven om vluchten te zoeken.
                </p>
              </div>
            )}

            {/* Render each leg */}
            {viaAirports.length > 0 && (() => {
              const allAirports = [params!.origin, ...viaAirports, params!.destination]
              const numLegs = allAirports.length - 1
              return Array.from({ length: numLegs }, (_, i) => {
                const from = allAirports[i]
                const to = allAirports[i + 1]
                const state = legLoadStates[i]
                const flights = legFlights[i] ?? []
                const selected = selectedLegs[i] ?? null
                const manual = manualLegs[i] ?? ''

                return (
                  <div key={`${from}-${to}`} style={{ marginBottom: '1.5rem' }}>
                    {/* Leg header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', margin: 0 }}>
                        Leg {i + 1} — {from} → {to}
                      </p>
                    </div>

                    {/* Loading */}
                    {state === 'loading' && (
                      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          border: '2.5px solid var(--border)', borderTopColor: 'var(--blue)',
                          animation: 'spin 0.8s linear infinite', margin: '0 auto 0.5rem',
                        }} />
                        <p style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>Vluchten zoeken…</p>
                      </div>
                    )}

                    {/* Selected state — collapsed card with change button */}
                    {selected && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                        background: 'var(--green-dim)', border: '1.5px solid var(--green-border)',
                        borderRadius: '10px', padding: '0.875rem 1.125rem',
                      }}>
                        <AirlineLogo iata={selected.iataPrefix} name={selected.airline} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--font-sora)', color: 'var(--text)' }}>
                            {selected.flightNumber}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {selected.departureLocal && selected.arrivalLocal
                              ? `${selected.departureLocal} → ${selected.arrivalLocal}`
                              : selected.airline}
                          </div>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="9" cy="9" r="8" fill="var(--green)" />
                          <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <button
                          type="button"
                          onClick={() => setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n })}
                          style={{
                            flexShrink: 0, padding: '0.375rem 0.75rem', borderRadius: '7px',
                            border: '1.5px solid var(--green-border)', background: '#fff',
                            fontSize: '0.8rem', fontWeight: 600, color: 'var(--green)',
                            cursor: 'pointer',
                          }}
                        >
                          Wijzigen
                        </button>
                      </div>
                    )}

                    {/* Flight list — only when nothing selected yet */}
                    {!selected && state === 'loaded' && flights.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {flights.map(f => (
                          <FlightCard
                            key={f.flightNumber} flight={f} isConnecting={true}
                            isSelected={false}
                            onSelect={() => {
                              setSelectedLegs(prev => { const n = [...prev]; n[i] = f; return n })
                              setManualLegs(prev => { const n = [...prev]; n[i] = ''; return n })
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* No flights found — manual fallback */}
                    {state === 'loaded' && flights.length === 0 && (
                      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.625rem', textAlign: 'center' }}>
                          Geen vluchten gevonden op deze leg.
                        </p>
                        <input
                          type="text" value={manual}
                          onChange={e => {
                            const v = e.target.value.toUpperCase()
                            setManualLegs(prev => { const n = [...prev]; n[i] = v; return n })
                            setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n })
                          }}
                          placeholder={`Vluchtnummer leg ${i + 1} (bijv. KL201)`}
                          maxLength={8}
                          style={{
                            width: '100%', border: '1.5px solid var(--border)', borderRadius: '8px',
                            padding: '0.625rem 0.875rem', fontSize: '0.9375rem',
                            fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--text)', outline: 'none',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        />
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        )}

        {/* ── Handmatige invoer ────────────────────────────────────────────── */}
        {stopover === 'no' && (
          <div style={{ marginBottom: '1rem' }}>
            <button type="button" onClick={() => setShowManual(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%',
                background: showManual ? 'var(--section-alt)' : '#fff',
                border: `1.5px solid ${showManual ? 'var(--border-hover)' : 'var(--border)'}`,
                borderRadius: showManual ? '10px 10px 0 0' : '10px',
                padding: '0.875rem 1.25rem', cursor: 'pointer', color: 'var(--text-sub)',
                fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M4 8h8M4 6h5M4 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Ik weet mijn vluchtnummer
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ marginLeft: 'auto', transform: showManual ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showManual && (
              <div style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: '0 0 10px 10px', borderTop: 'none', padding: '1rem 1.25rem',
              }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text" value={manualFlight}
                    onChange={e => setManualFlight(e.target.value.toUpperCase())}
                    placeholder="bijv. KL1021" maxLength={8}
                    style={{
                      flex: 1, border: '1.5px solid var(--border)', borderRadius: '8px',
                      padding: '0.625rem 0.875rem', fontSize: '0.9375rem',
                      fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--text)', outline: 'none',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    onKeyDown={e => e.key === 'Enter' && selectManual()}
                  />
                  <button type="button" onClick={selectManual} disabled={!manualFlight.trim()}
                    style={{
                      background: manualFlight.trim() ? 'var(--blue)' : 'var(--border)',
                      color: '#fff', border: 'none', borderRadius: '8px', padding: '0 1.25rem',
                      fontWeight: 700, fontSize: '0.875rem', cursor: manualFlight.trim() ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font-sora)', transition: 'background 0.15s',
                    }}
                  >
                    Gebruik dit →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', lineHeight: 1.6 }}>
          Niet jouw vlucht? <a href="/" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>Zoek opnieuw</a>
        </p>
      </div>
      <FunnelSidebar step={1} />
      </div>

      {/* ── Sticky CTA voor overstap (N legs) ────────────────────────────────── */}
      {stopover === 'yes' && selectedLegs.some(s => s) && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.97)',
          borderTop: '1.5px solid var(--border)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          padding: '0.875rem 1.25rem',
          paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Selected leg chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {Array.from({ length: viaAirports.length + 1 }, (_, i) => {
                const sel = selectedLegs[i]
                const man = (manualLegs[i] ?? '').trim()
                const fn = sel?.flightNumber ?? man
                if (!fn) return null
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
                    borderRadius: '6px', padding: '0.3rem 0.625rem',
                  }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>L{i + 1}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-sora)', color: 'var(--blue)' }}>
                      {fn}
                    </span>
                    <button onClick={() => {
                      setSelectedLegs(prev => { const n = [...prev]; n[i] = null; return n })
                      setManualLegs(prev => { const n = [...prev]; n[i] = ''; return n })
                    }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 0 0 2px', lineHeight: 1 }}>×</button>
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
              {(() => {
                const n = selectedLegs.filter(Boolean).length
                return n === 1 ? 'Doorgaan met 1 vlucht →' : `Doorgaan met ${n} vluchten →`
              })()}
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
