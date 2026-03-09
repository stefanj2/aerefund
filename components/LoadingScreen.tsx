'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { lookupFlight } from '@/lib/flight-api'
import { calculateCompensation, formatAmount } from '@/lib/compensation'
import FunnelNav from '@/components/FunnelNav'
import type { FlightData } from '@/lib/types'
import type { CompensationResult } from '@/lib/compensation'

// EC 261: first leg with delay is the responsible carrier (first-carrier principle)
function findResponsibleLeg(legs: FlightData[]): FlightData {
  return legs.find(l => (l.delayMinutes ?? 0) > 0) ?? legs[0]
}

const STEPS = [
  { label: 'Vluchtdata ophalen…', duration: 1200 },
  { label: 'Vertraging meten…', duration: 1000 },
  { label: 'EC 261/2004 toetsen…', duration: 900 },
  { label: 'Compensatiebedrag berekenen…', duration: 700 },
]

type ScreenState = 'loading' | 'done' | 'not_found' | 'error'

export default function LoadingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<ScreenState>('loading')
  const [search, setSearch] = useState<{
    flightNumber: string
    flightNumbers?: string[]
    flightNumber2?: string
    date: string
    claimDistanceKm?: number
    isConnecting?: boolean
  } | null>(null)
  const [notFoundFlight, setNotFoundFlight] = useState<FlightData | null>(null)
  const [result, setResult] = useState<CompensationResult | null>(null)

  useEffect(() => {
    let cancelled = false
    const timeoutIds: ReturnType<typeof setTimeout>[] = []

    const raw = sessionStorage.getItem('vv_search')
    if (!raw) {
      router.replace('/')
      return
    }

    const parsed = JSON.parse(raw)
    setSearch(parsed)

    // Resolve which flight data to use, applying EC 261 first-carrier principle for multi-leg
    const apiPromise: Promise<FlightData | null> = (() => {
      // New: prefetchedFlights array (N legs from multi-stopover route-search)
      if (Array.isArray(parsed.prefetchedFlights) && parsed.prefetchedFlights.length > 0) {
        return Promise.resolve(findResponsibleLeg(parsed.prefetchedFlights as FlightData[]))
      }

      // New: flightNumbers array with length > 1 (N legs, no prefetch — fetch via API)
      if (Array.isArray(parsed.flightNumbers) && parsed.flightNumbers.length > 1) {
        return Promise.all(
          (parsed.flightNumbers as string[]).map(fn =>
            lookupFlight(fn, parsed.date, parsed.type).catch(() => null)
          )
        ).then(legs => {
          const valid = legs.filter(Boolean) as FlightData[]
          return valid.length > 0 ? findResponsibleLeg(valid) : null
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
          return findResponsibleLeg([leg1, leg2])
        })
      }

      // Single direct flight
      return lookupFlight(parsed.flightNumber, parsed.date, parsed.type).catch(() => null)
    })()

    let step = 0
    const advance = () => {
      if (cancelled) return
      if (step < STEPS.length - 1) {
        step++
        setCurrentStep(step)
        timeoutIds.push(setTimeout(advance, STEPS[step].duration))
      } else {
        apiPromise.then((flightData) => {
          if (cancelled) return

          if (!flightData) {
            setState('error')
            return
          }

          if (!flightData.found) {
            setNotFoundFlight(flightData)
            setState('not_found')
            return
          }

          // Override distance for connecting flights (EC 261: total journey distance)
          const effectiveDistanceKm =
            parsed.claimDistanceKm != null ? parsed.claimDistanceKm : flightData.distanceKm

          const compensation = calculateCompensation(
            effectiveDistanceKm,
            flightData.delayMinutes,
            parsed.type,
            flightData.found
          )
          sessionStorage.setItem(
            'vv_result',
            JSON.stringify({ flight: { ...flightData, distanceKm: effectiveDistanceKm }, compensation })
          )
          setResult(compensation)
          setState('done')
          timeoutIds.push(setTimeout(() => { if (!cancelled) router.push('/uitkomst') }, 2200))
        })
      }
    }

    timeoutIds.push(setTimeout(advance, STEPS[0].duration))

    return () => {
      cancelled = true
      timeoutIds.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                const compensation = calculateCompensation(notFoundFlight.distanceKm, notFoundFlight.delayMinutes, notFoundFlight.type, false)
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
          <button onClick={() => router.replace('/')} className="btn-primary" style={{ maxWidth: '240px' }}>
            Opnieuw proberen
          </button>
        </div>
      </div>
    )
  }

  // ── Laden / Klaar ──────────────────────────────────────────────────────────
  const spinnerColor = state === 'done'
    ? (result?.eligible ? 'var(--green)' : 'var(--text-muted)')
    : 'var(--blue)'

  return (
    <div style={{ minHeight: 'calc(100vh - 59px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>

      {/* Spinner ring */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
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
        }} />
        {/* Center icon */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {state === 'done' ? (
            result?.eligible ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7 14l5 5 9-9" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M16 6L6 16M6 6l10 10" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2h0A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="var(--blue)" />
            </svg>
          )}
        </div>
      </div>

      {/* Step list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%', maxWidth: '340px' }}>
        {STEPS.map((step, i) => {
          const isDone = i < currentStep || state === 'done'
          const isActive = i === currentStep && state !== 'done'
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                opacity: i <= currentStep ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }}
            >
              {/* Step dot */}
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'var(--green)' : isActive ? 'var(--blue)' : 'var(--border)',
                transition: 'background 0.3s',
              }}>
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: isActive ? '#fff' : 'var(--text-muted)',
                    animation: isActive ? 'pulse 1.2s ease-in-out infinite' : 'none',
                  }} />
                )}
              </div>
              {/* Label */}
              <span style={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isDone ? 'var(--green)' : isActive ? 'var(--text)' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>
                {i === STEPS.length - 1 && state === 'done' && result
                  ? result.eligible
                    ? `${formatAmount(result.amountPerPerson)} compensatie gevonden`
                    : 'Geen compensatierecht vastgesteld'
                  : step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Result reveal */}
      {state === 'done' && result && (
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }} className="animate-fade-in">
          {result.eligible ? (
            <div style={{
              background: '#fff', border: '1.5px solid var(--green-border)',
              borderRadius: '16px', padding: '1.5rem 2rem',
              boxShadow: '0 4px 24px rgba(21,128,61,0.12)',
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--green)', marginBottom: '0.375rem' }}>
                Compensatierecht gevonden
              </p>
              <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '3.5rem', color: 'var(--green)', lineHeight: 1, margin: 0 }} className="animate-count">
                {formatAmount(result.amountPerPerson)}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                per persoon · je wordt doorgestuurd…
              </p>
            </div>
          ) : (
            <div style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem 1.5rem',
            }}>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-sub)', marginBottom: '0.375rem' }}>
                Helaas geen recht op compensatie
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: 1.55 }}>
                {result.reason}
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes loading-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
