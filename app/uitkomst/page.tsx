'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAirlineConfig } from '@/lib/airlines'
import { formatAmount } from '@/lib/compensation'
import PassengerSelector from '@/components/PassengerSelector'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import type { FlightData } from '@/lib/types'

type ResultData = {
  flight: FlightData
  compensation: { eligible: boolean; amountPerPerson: number; reason: string }
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)
  useEffect(() => {
    if (startedRef.current || target === 0) return
    startedRef.current = true
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [target, duration])
  return count
}

const KLANTVERHALEN: Record<string, { name: string; quote: string }> = {
  KL: { name: 'Marjolein V.', quote: 'KLM weigerde eerst. Aerefund stuurde een bezwaar en twee weken later stond €400 op mijn rekening.' },
  FR: { name: 'Thomas B.', quote: 'Ryanair bood me een voucher aan. Aerefund haalde gewoon het geld op — €400 cash.' },
  HV: { name: 'Sandra K.', quote: 'Transavia bood €100 "vriendelijk gebaar" aan. Ik heb uiteindelijk €250 gekregen.' },
  U2: { name: 'Pieter M.', quote: 'easyJet hield me drie weken aan het lijntje. Aerefund regelde het in één brief.' },
  CD: { name: 'Fatima A.', quote: 'Corendon reageerde niet op mijn emails. Via Aerefund was het binnen 5 weken geregeld.' },
  TB: { name: 'Roel S.', quote: 'TUI schoof de schuld af op luchthavenproblemen. Aerefund wist beter — €250 binnengehaald.' },
  VY: { name: 'Nora B.', quote: 'Vueling communiceerde niks. Eén brief later was het geld er.' },
}

export default function UitkomstPage() {
  const router = useRouter()
  const [data, setData] = useState<ResultData | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_result')
    if (!raw) { router.replace('/'); return }
    const parsed: ResultData = JSON.parse(raw)
    setData(parsed)

    // Restore existing token or create a new claim in DB
    const existingToken = sessionStorage.getItem('vv_token')
    if (existingToken) {
      setToken(existingToken)
    } else if (parsed.compensation.eligible) {
      fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightData: parsed.flight,
          compensation: parsed.compensation,
          passengers: 1,
        }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.token) {
            sessionStorage.setItem('vv_token', json.token)
            setToken(json.token)
          }
        })
        .catch(() => {/* ignore — non-critical */})
    }
  }, [router])

  const totalAmount = (data?.compensation.amountPerPerson ?? 0) * passengers
  const animatedTotal = useCountUp(totalAmount, 750)

  if (!data) return null

  const { flight, compensation } = data
  const iataPrefix = flight.iataPrefix ?? ''
  const airline = getAirlineConfig(iataPrefix)
  const verhaal = KLANTVERHALEN[iataPrefix] ?? {
    name: 'Laura de G.',
    quote: 'Ik had geen idee dat ik recht had op compensatie. Aerefund heeft alles voor me geregeld.',
  }

  function handleClaim() {
    // Update passengers count in DB
    if (token) {
      fetch('/api/claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, passengers, status: 'claim_started' }),
      }).catch(() => {/* ignore */})
    }
    sessionStorage.setItem('vv_claim', JSON.stringify({ flight, compensation, passengers, token }))
    router.push('/formulier')
  }

  // ── Niet in aanmerking ─────────────────────────────────────────────────────
  if (!compensation.eligible) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <FunnelNav step={3} />
        <div className="container pt-24 pb-10">
          <div style={{ maxWidth: '380px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--section-alt)', border: '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="11" stroke="var(--text-muted)" strokeWidth="1.8" />
                <path d="M13 8v6" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="13" cy="18" r="1.2" fill="var(--text-muted)" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-sora)' }}>
              Geen recht op compensatie
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-sub)' }}>
              Op basis van de beschikbare vluchtdata kom je{' '}
              <strong style={{ color: 'var(--text)' }}>waarschijnlijk niet in aanmerking</strong>{' '}
              voor compensatie onder EC 261/2004.
            </p>
            <div className="card text-left mb-8" style={{ padding: '1rem 1.25rem' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Reden</p>
              <p className="text-sm" style={{ color: 'var(--text-sub)' }}>{compensation.reason}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => router.replace('/')} className="btn-primary">← Controleer een andere vlucht</button>
              <button
                onClick={() => {
                  const override = {
                    ...data,
                    compensation: {
                      ...compensation, eligible: true,
                      amountPerPerson: flight.distanceKm
                        ? flight.distanceKm < 1500 ? 250 : flight.distanceKm <= 3500 ? 400 : 600
                        : 400,
                      reason: 'Compensatie op basis van eigen opgave passagier',
                    },
                  }
                  sessionStorage.setItem('vv_result', JSON.stringify(override))
                  window.location.reload()
                }}
                className="btn-secondary"
              >
                Ik ben het hier niet mee eens — toch doorgaan
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ── Wel in aanmerking ──────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg)' }}>
      <FunnelNav
        step={3}
        flightInfo={{ number: flight.flightNumber, airline: airline.name, amount: formatAmount(totalAmount) }}
      />

      <div className="funnel-grid">
      <div>

        {/* Hero text */}
        <div className="text-center mb-6 animate-fade-up d1">
          <p style={{
            fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--blue)', marginBottom: '0.75rem',
          }}>
            Compensatierecht bevestigd
          </p>
          <h1 style={{
            fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
            lineHeight: 1.15, color: 'var(--navy)', letterSpacing: '-0.025em', marginBottom: '0.625rem',
          }}>
            <span style={{ color: 'var(--blue)' }}>{airline.name}</span> is jou{' '}
            <span style={{ color: 'var(--green)' }}>{formatAmount(compensation.amountPerPerson)}</span>{' '}
            verschuldigd
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            {flight.flightNumber} · EC 261/2004 — {compensation.reason}
          </p>
        </div>

        {/* Amount card */}
        <div className="card mb-4 animate-receipt d2">
          <p style={{
            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '0.875rem',
          }}>
            Jouw compensatie
          </p>
          <div style={{ textAlign: 'center', paddingBottom: '0.25rem' }}>
            <p style={{
              fontFamily: 'var(--font-sora)', fontWeight: 900, lineHeight: 1,
              fontSize: 'clamp(3rem, 12vw, 4rem)',
              color: 'var(--navy)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em',
            }} className="animate-count d3">
              €{animatedTotal.toLocaleString('nl-NL')}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
              {passengers > 1
                ? `${passengers} × ${formatAmount(compensation.amountPerPerson)}`
                : formatAmount(compensation.amountPerPerson) + ' per persoon'}
            </p>
          </div>
          <hr style={{ border: 'none', borderTop: '1.5px dashed var(--border)', margin: '1.125rem 0' }} />
          <PassengerSelector value={passengers} onChange={setPassengers} amountPerPerson={compensation.amountPerPerson} />
        </div>

        {/* Primary CTA */}
        <button onClick={handleClaim} className="btn-cta mb-3 animate-fade-up d3">
          Claim mijn {formatAmount(totalAmount)}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Resume token */}
        {token && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.6rem 0.875rem', borderRadius: '10px',
            background: 'var(--section-alt)', border: '1px solid var(--border)',
            marginBottom: '0.5rem',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              <rect x="1.5" y="5.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M4.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Claimcode om later verder te gaan:&nbsp;
              <strong style={{ fontFamily: 'var(--font-sora)', color: 'var(--text)', letterSpacing: '0.08em' }}>
                {token}
              </strong>
            </span>
          </div>
        )}
      </div>{/* end main column */}

      <FunnelSidebar step={3} airline={{
        name: airline.name,
        successRate: airline.successRate,
        avgPaymentWeeks: airline.avgPaymentWeeks,
        claimDifficulty: airline.claimDifficulty,
      }} review={verhaal} />
      </div>{/* end funnel-grid */}

      {/* Sticky mobile CTA */}
      <div className="sticky-cta-bar">
        <button onClick={handleClaim} className="btn-cta" style={{ fontSize: '0.9rem', padding: '0.875rem 1.5rem' }}>
          Claim {formatAmount(totalAmount)}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </main>
  )
}
