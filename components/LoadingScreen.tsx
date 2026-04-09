'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { lookupFlight } from '@/lib/flight-api'
import { calculateCompensation } from '@/lib/compensation'
import { isEuCarrier } from '@/lib/airlines'
import FunnelNav from '@/components/FunnelNav'
import type { FlightData, FlightType } from '@/lib/types'


// EC 261: first leg with delay is the responsible carrier (first-carrier principle)
function findResponsibleLeg(legs: FlightData[], claimType?: string): FlightData {
  // For cancellations, the cancelled leg (delayMinutes === null) is responsible
  if (claimType === 'geannuleerd') {
    const cancelledLeg = legs.find(l => l.delayMinutes === null)
    if (cancelledLeg) return cancelledLeg
  }
  return legs.find(l => (l.delayMinutes ?? 0) > 0) ?? legs[0]
}

// EC 261 kijkt naar AANKOMSTVERTRAGING. Bereken vanuit scheduledArrival/actualArrival
// als die beschikbaar zijn; anders fallback op vertrekvertraging (departure delay).
function computeArrivalDelay(flight: FlightData): number | null {
  if (flight.scheduledArrival && flight.actualArrival) {
    const s = new Date(flight.scheduledArrival).getTime()
    const a = new Date(flight.actualArrival).getTime()
    if (!isNaN(s) && !isNaN(a)) return Math.round((a - s) / 60000)
  }
  return flight.delayMinutes
}

type SearchParams = {
  flightNumber: string
  flightNumbers?: string[]
  flightNumber2?: string
  date: string
  type: FlightType
  claimDistanceKm?: number
  isConnecting?: boolean
  prefetchedFlight?: FlightData
  prefetchedFlights?: FlightData[]
}

type ScreenState = 'loading' | 'done' | 'not_found' | 'error'

export default function LoadingScreen() {
  const router = useRouter()
  const [state, setState] = useState<ScreenState>('loading')
  const [search, setSearch] = useState<SearchParams | null>(null)
  const [notFoundFlight, setNotFoundFlight] = useState<FlightData | null>(null)
  const [statusMessage, setStatusMessage] = useState('Vluchtdata ophalen…')
  const cancelledRef = useRef(false)
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []
  }, [])

  const runLookup = useCallback((parsed: SearchParams) => {
    cancelledRef.current = false
    clearTimers()
    setState('loading')
    setNotFoundFlight(null)

    // Derive initial status based on claim type
    const initialStatus =
      parsed.type === 'geannuleerd' ? 'Vluchtgegevens ophalen…' :
      parsed.type === 'geweigerd'   ? 'Vluchtgegevens ophalen…' :
      parsed.type === 'downgrade'   ? 'Vluchtgegevens ophalen…' :
      'Vluchtdata ophalen…'
    setStatusMessage(initialStatus)

    // Progressive status messages for slow API responses
    timeoutIdsRef.current.push(setTimeout(() => {
      if (!cancelledRef.current) setStatusMessage('Nog even geduld…')
    }, 2000))
    timeoutIdsRef.current.push(setTimeout(() => {
      if (!cancelledRef.current) setStatusMessage('Bijna klaar…')
    }, 4500))

    const startedAt = Date.now()
    const MIN_LOADING_MS = 1000

    // Resolve which flight data to use, applying EC 261 first-carrier principle for multi-leg
    const apiPromise: Promise<FlightData | null> = (() => {
      // New: prefetchedFlights array (N legs from multi-stopover route-search)
      if (Array.isArray(parsed.prefetchedFlights) && parsed.prefetchedFlights.length > 0) {
        return Promise.resolve(findResponsibleLeg(parsed.prefetchedFlights as FlightData[], parsed.type))
      }

      // New: flightNumbers array with length > 1 (N legs, no prefetch — fetch via API)
      if (Array.isArray(parsed.flightNumbers) && parsed.flightNumbers.length > 1) {
        return Promise.all(
          (parsed.flightNumbers as string[]).map(fn =>
            lookupFlight(fn, parsed.date, parsed.type).catch(() => null)
          )
        ).then(legs => {
          const valid = legs.filter(Boolean) as FlightData[]
          return valid.length > 0 ? findResponsibleLeg(valid, parsed.type) : null
        })
      }

      // Legacy: single prefetchedFlight (direct or old connecting format)
      if (parsed.prefetchedFlight) {
        return Promise.resolve(parsed.prefetchedFlight as FlightData)
      }

      // Legacy: flightNumber2 (two-leg binary format)
      if (parsed.flightNumber2) {
        return Promise.all([
          lookupFlight(parsed.flightNumber, parsed.date, parsed.type).catch(() => null),
          lookupFlight(parsed.flightNumber2, parsed.date, parsed.type).catch(() => null),
        ]).then(([leg1, leg2]) => {
          if (!leg1 && !leg2) return null
          if (!leg1) return leg2
          if (!leg2) return leg1
          return findResponsibleLeg([leg1, leg2], parsed.type)
        })
      }

      // Single direct flight
      return lookupFlight(parsed.flightNumber, parsed.date, parsed.type).catch(() => null)
    })()

    const finalize = (flightData: FlightData | null) => {
      if (cancelledRef.current) return
      clearTimers()

      if (!flightData) {
        setState('error')
        return
      }

      // Lees eligibility-verfijners die op /selecteer zijn ingevuld
      const routeRaw = sessionStorage.getItem('vv_route_search')
      const routeParams = routeRaw ? JSON.parse(routeRaw) : {}

      if (!flightData.found) {
        // Geannuleerde en geweigerde vluchten zijn altijd eligible ongeacht API-data —
        // proceed automatisch naar uitkomst zonder de "niet gevonden" foutmelding te tonen.
        if (parsed.type === 'geannuleerd' || parsed.type === 'geweigerd' || parsed.type === 'downgrade') {
          const distKm = parsed.claimDistanceKm ?? flightData.distanceKm
          const prefix = flightData.iataPrefix ?? ''
          const comp = calculateCompensation(distKm, null, parsed.type, false, {
            origin:             flightData.origin      ?? routeParams.origin,
            destination:        flightData.destination ?? routeParams.destination,
            carrierIsEu:        isEuCarrier(prefix),
            cancellationNotice: routeParams.cancellationNotice,
            causeType:          routeParams.causeType,
            ticketPriceEur:     routeParams.ticketPriceEur,
          })
          sessionStorage.setItem('vv_result', JSON.stringify({ flight: { ...flightData, distanceKm: distKm }, compensation: comp }))
          setState('done')
          timeoutIdsRef.current.push(setTimeout(() => { if (!cancelledRef.current) router.push('/uitkomst') }, 800))
          return
        }
        setNotFoundFlight(flightData)
        setState('not_found')
        return
      }

      // Override distance for connecting flights (EC 261: total journey distance)
      const effectiveDistanceKm =
        parsed.claimDistanceKm != null ? parsed.claimDistanceKm : flightData.distanceKm

      // EC 261 kijkt naar AANKOMSTVERTRAGING, niet vertrekvertraging.
      // Gebruik scheduledArrival + actualArrival indien beschikbaar.
      const effectiveDelay = computeArrivalDelay(flightData)

      const carrierPrefix = flightData.iataPrefix ?? ''
      const compensation = calculateCompensation(
        effectiveDistanceKm,
        effectiveDelay,
        parsed.type,
        flightData.found,
        {
          origin:             flightData.origin      ?? routeParams.origin,
          destination:        flightData.destination ?? routeParams.destination,
          carrierIsEu:        isEuCarrier(carrierPrefix),
          cancellationNotice: routeParams.cancellationNotice,
          causeType:          routeParams.causeType,
          ticketPriceEur:     routeParams.ticketPriceEur,
        }
      )
      sessionStorage.setItem(
        'vv_result',
        JSON.stringify({ flight: { ...flightData, distanceKm: effectiveDistanceKm, delayMinutes: effectiveDelay }, compensation })
      )
      setState('done')
      timeoutIdsRef.current.push(setTimeout(() => { if (!cancelledRef.current) router.push('/uitkomst') }, 800))
    }

    apiPromise.then((flightData) => {
      if (cancelledRef.current) return
      // Enforce minimum loading time to avoid flash
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      if (remaining === 0) {
        finalize(flightData)
      } else {
        timeoutIdsRef.current.push(setTimeout(() => finalize(flightData), remaining))
      }
    }).catch(() => {
      if (cancelledRef.current) return
      clearTimers()
      setState('error')
    })
  }, [clearTimers, router])

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_search')
    if (!raw) {
      router.replace('/')
      return
    }

    const parsed = JSON.parse(raw) as SearchParams
    setSearch(parsed)
    runLookup(parsed)

    return () => {
      cancelledRef.current = true
      clearTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = useCallback(() => {
    if (!search) {
      const raw = sessionStorage.getItem('vv_search')
      if (!raw) {
        router.replace('/')
        return
      }
      const parsed = JSON.parse(raw) as SearchParams
      setSearch(parsed)
      runLookup(parsed)
      return
    }
    runLookup(search)
  }, [search, runLookup, router])

  // ── Niet gevonden ──────────────────────────────────────────────────────────
  if (state === 'not_found') {
    return (
      <div style={{ minHeight: 'calc(100vh - 59px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Icon */}
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'var(--orange-dim)', border: '1.5px solid rgba(249,115,22,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 7v8" stroke="var(--orange)" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="14" cy="20" r="1.5" fill="var(--orange)" />
              <path d="M5 24L14 4l9 20H5z" stroke="var(--orange)" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text)' }}>
            Vlucht niet gevonden
          </h2>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
              We konden{' '}
              <strong style={{ color: 'var(--text)' }}>{search?.flightNumber}</strong> op{' '}
              <strong style={{ color: 'var(--text)' }}>
                {search?.date ? new Date(search.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : search?.date}
              </strong>{' '}
              niet vinden in onze vluchtendatabase.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => router.replace('/')} className="btn-primary">
              ← Probeer opnieuw
            </button>
            <button
              onClick={() => {
                if (!notFoundFlight || !search) return
                const routeRaw2 = sessionStorage.getItem('vv_route_search')
                const rp = routeRaw2 ? JSON.parse(routeRaw2) : {}
                const compensation = calculateCompensation(
                  notFoundFlight.distanceKm, notFoundFlight.delayMinutes, notFoundFlight.type, false,
                  { origin: notFoundFlight.origin ?? rp.origin, destination: notFoundFlight.destination ?? rp.destination, cancellationNotice: rp.cancellationNotice, causeType: rp.causeType }
                )
                sessionStorage.setItem('vv_result', JSON.stringify({ flight: notFoundFlight, compensation }))
                router.push('/uitkomst')
              }}
              className="btn-secondary"
            >
              Toch doorgaan met {notFoundFlight?.airline ?? 'de airline'} →
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
            Boardingpass of boekingsbevestiging? Die kun je uploaden in de volgende stap.
          </p>
        </div>
      </div>
    )
  }

  // ── Verbindingsfout ────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div style={{ minHeight: 'calc(100vh - 59px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '320px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'var(--red-dim)', border: '1.5px solid rgba(220,38,38,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5M12 15.5v.5" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" />
              <path d="M10.3 3.3L2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" stroke="var(--red)" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
            Verbindingsfout
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We konden de vluchtdata niet ophalen. Controleer je internetverbinding en probeer opnieuw.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--blue)', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2v4h-4M2 14v-4h4M14 6a6 6 0 0 0-11.2-2M2 10a6 6 0 0 0 11.2 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Opnieuw proberen
          </button>
          <div>
            <a
              href="/selecteer/vlucht"
              style={{
                display: 'inline-block', marginTop: '0.75rem',
                color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'underline',
              }}
            >
              Of ga terug en probeer een andere vlucht
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Laden / Klaar ──────────────────────────────────────────────────────────
  const spinnerColor = state === 'done' ? 'var(--green)' : 'var(--blue)'
  const headingText = state === 'done' ? 'Klaar!' : statusMessage
  const flightLabel = search?.flightNumber
    ? `Bezig met ${search.flightNumber}…`
    : null

  return (
    <div style={{ minHeight: 'calc(100vh - 59px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>

      {/* Spinner ring */}
      <div style={{ position: 'relative', marginBottom: '1.75rem', width: '80px', height: '80px' }}>
        {/* Track */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          border: '4px solid var(--border)',
          position: 'absolute', inset: 0,
        }} />
        {/* Spinning segment */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: spinnerColor,
          animation: state === 'done' ? 'none' : 'loading-spin 0.9s linear infinite',
          transition: 'border-top-color 0.4s',
          position: 'absolute', inset: 0,
        }} />
        {/* Center icon */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {state === 'done' ? (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 14l5 5 9-9" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2h0A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="var(--blue)" />
            </svg>
          )}
        </div>
      </div>

      {/* Status text (fades in on change via key) */}
      <div
        key={headingText}
        style={{
          textAlign: 'center',
          animation: 'loading-fade 0.35s ease-out',
          maxWidth: '340px',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-sora)',
          fontWeight: 700,
          fontSize: '1.125rem',
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {headingText}
        </h2>
        {flightLabel && state !== 'done' && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            marginBottom: 0,
            fontFamily: 'var(--font-inter)',
          }}>
            {flightLabel}
          </p>
        )}
      </div>


      <style jsx>{`
        @keyframes loading-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes loading-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
