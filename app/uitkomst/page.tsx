'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getAirlineConfig } from '@/lib/airlines'
import { formatAmount, isIntraEuRoute } from '@/lib/compensation'
import { trackResultViewed, trackClaimStarted } from '@/lib/analytics'
import PassengerSelector from '@/components/PassengerSelector'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import { AIRPORTS } from '@/lib/airports'
import type { FlightData } from '@/lib/types'

type ResultData = {
  flight: FlightData
  compensation: { eligible: boolean; amountPerPerson: number; reason: string; downgradePercentage?: number }
}

type MultiResultItem = {
  flight: FlightData
  compensation: { eligible: boolean; amountPerPerson: number; reason: string; distanceKm: number | null }
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0)
  const prevRef = useRef(0)
  useEffect(() => {
    if (target === 0) return
    const from = prevRef.current
    prevRef.current = target
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(from + eased * (target - from)))
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
  const [multiResults, setMultiResults] = useState<MultiResultItem[] | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [token, setToken] = useState<string | null>(null)
  const [claimingIdx, setClaimingIdx] = useState<number | null>(null)
  // Downgrade: live ticketprice input on uitkomst
  const [downgradeTicketPrice, setDowngradeTicketPrice] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_result')
    if (!raw) {
      const rawMulti = sessionStorage.getItem('vv_multi_results')
      if (rawMulti) { setMultiResults(JSON.parse(rawMulti)); return }
      router.replace('/')
      return
    }
    const parsed: ResultData = JSON.parse(raw)
    setData(parsed)

    // Track result view (moved here to avoid Rules-of-Hooks violation)
    const fl = parsed.flight
    const prefix = fl.iataPrefix ?? ''
    const al = getAirlineConfig(prefix)
    const alName = al.name === 'de airline' && fl.airline ? fl.airline : al.name
    trackResultViewed({
      eligible:        parsed.compensation.eligible,
      amountPerPerson: parsed.compensation.amountPerPerson,
      airline:         alName,
      iataPrefix:      prefix,
      claimType:       fl.type ?? '',
      distanceKm:      fl.distanceKm ?? null,
    })
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'ViewContent', {
        currency: 'EUR',
        value: parsed.compensation.amountPerPerson ?? 0,
        content_name: fl.flightNumber ?? '',
      })
    }

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

  // For downgrade: recalculate amount from live ticket price input if provided
  const downgradeAmount = (() => {
    if (!data?.compensation.downgradePercentage) return null
    const pct = data.compensation.downgradePercentage
    const price = parseFloat(downgradeTicketPrice.replace(',', '.'))
    if (!isNaN(price) && price > 0) return Math.round(price * pct / 100)
    return data.compensation.amountPerPerson // 0 if no ticket price was provided
  })()
  const effectiveAmountPerPerson = downgradeAmount !== null ? downgradeAmount : (data?.compensation.amountPerPerson ?? 0)
  const totalAmount = effectiveAmountPerPerson * passengers
  const animatedTotal = useCountUp(totalAmount, 750)

  async function handleMultiClaim(item: MultiResultItem, idx: number) {
    setClaimingIdx(idx)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightData: item.flight, compensation: item.compensation, passengers: 1 }),
      })
      const json = await res.json()
      const t = json.token ?? null
      if (t) sessionStorage.setItem('vv_token', t)
      sessionStorage.setItem('vv_claim', JSON.stringify({ flight: item.flight, compensation: item.compensation, passengers: 1, token: t }))
      sessionStorage.removeItem('vv_multi_results')
      router.push('/formulier')
    } catch {
      setClaimingIdx(null)
    }
  }

  // Multi-results view (bypasses /laden flow)
  if (multiResults) {
    const eligibleCount = multiResults.filter(r => r.compensation.eligible).length
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <FunnelNav step={3} />
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>

            {/* Header */}
            <div className="animate-fade-up d1" style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 800,
                fontSize: 'clamp(1.25rem, 4vw, 1.625rem)',
                color: 'var(--navy)', letterSpacing: '-0.02em', margin: '0 0 0.5rem',
              }}>
                {eligibleCount > 0
                  ? `${eligibleCount} van ${multiResults.length} vluchten komen in aanmerking`
                  : 'Compensatiecheck klaar'}
              </h1>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                Herken jouw vlucht en klik op <strong>Claim indienen</strong> om verder te gaan.
              </p>
            </div>

            {/* Flight result cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {multiResults.map((item, idx) => {
                const prefix = item.flight.iataPrefix ?? ''
                const al = getAirlineConfig(prefix)
                const eligible = item.compensation.eligible
                const isClaiming = claimingIdx === idx

                return (
                  <div key={item.flight.flightNumber} className="animate-fade-up" style={{
                    background: '#fff', border: `1.5px solid ${eligible ? 'var(--green-border)' : 'var(--border)'}`,
                    borderRadius: '14px', overflow: 'hidden',
                    boxShadow: eligible ? '0 2px 16px rgba(34,197,94,0.10)' : 'var(--shadow-sm)',
                    animationDelay: `${idx * 80}ms`,
                  }}>
                    {/* Status strip */}
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: eligible ? 'var(--green-dim)' : 'rgba(0,0,0,0.03)',
                      borderBottom: `1px solid ${eligible ? 'var(--green-border)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: eligible ? 'var(--green)' : 'var(--text-muted)',
                      }}>
                        {eligible ? `€${item.compensation.amountPerPerson} per persoon · EC 261/2004` : 'Geen compensatierecht vastgesteld'}
                      </span>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '1rem 1.125rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      {/* Airline logo */}
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                        background: '#fff', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', padding: '5px',
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://www.gstatic.com/flights/airline_logos/70px/${prefix || 'UN'}.png`}
                          alt={al.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            const el = e.currentTarget; el.style.display = 'none'
                            const p = el.parentElement!; p.style.background = al.color; p.style.padding = '0'
                            p.innerHTML = `<span style="font-family:var(--font-sora);font-weight:900;font-size:0.65rem;color:#fff">${prefix || al.name.slice(0,2).toUpperCase()}</span>`
                          }}
                        />
                      </div>

                      {/* Flight info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.9375rem', color: 'var(--navy)', margin: '0 0 0.2rem' }}>
                          {item.flight.flightNumber}
                          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                            {al.name}
                          </span>
                        </p>
                        {item.flight.origin && item.flight.destination && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.15rem' }}>
                            {AIRPORTS[item.flight.origin]?.name ?? item.flight.origin} → {AIRPORTS[item.flight.destination]?.name ?? item.flight.destination}
                          </p>
                        )}
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-sub)', margin: 0 }}>
                          {item.compensation.reason}
                        </p>
                      </div>

                      {/* CTA */}
                      {eligible && (
                        <button
                          onClick={() => handleMultiClaim(item, idx)}
                          disabled={claimingIdx !== null}
                          style={{
                            flexShrink: 0, padding: '0.5rem 0.875rem',
                            background: isClaiming ? 'var(--green-dim)' : 'var(--green)',
                            color: isClaiming ? 'var(--green)' : '#fff',
                            border: 'none', borderRadius: '8px', cursor: claimingIdx !== null ? 'default' : 'pointer',
                            fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-sora)',
                            transition: 'all 0.15s',
                          }}
                        >
                          {isClaiming ? 'Bezig…' : 'Claim →'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button onClick={() => router.replace('/selecteer')} className="btn-secondary animate-fade-up d4" style={{ marginTop: '1.5rem' }}>
              ← Andere route controleren
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!data) return null

  const { flight, compensation } = data
  const iataPrefix = flight.iataPrefix ?? ''
  const airline = getAirlineConfig(iataPrefix)
  // Use raw flight.airline name when prefix isn't in our config (fallback shows "de airline")
  const airlineName = airline.name === 'de airline' && flight.airline ? flight.airline : airline.name

  const verhaal = KLANTVERHALEN[iataPrefix] ?? {
    name: 'Laura de G.',
    quote: 'Ik had geen idee dat ik recht had op compensatie. Aerefund heeft alles voor me geregeld.',
  }

  const daysUntilExpiry = (() => {
    if (!flight.date) return null
    const expiry = new Date(flight.date + 'T12:00')
    expiry.setFullYear(expiry.getFullYear() + 3)
    return Math.ceil((expiry.getTime() - Date.now()) / 86400000)
  })()

  function handleClaim() {
    trackClaimStarted({ totalAmount, amountPerPerson: effectiveAmountPerPerson, passengers, airline: airlineName, iataPrefix })
    // Update passengers count in DB
    if (token) {
      fetch('/api/claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, passengers, status: 'claim_started' }),
      }).catch(() => {/* ignore */})
    }
    sessionStorage.setItem('vv_claim', JSON.stringify({
      flight,
      compensation: { ...compensation, amountPerPerson: effectiveAmountPerPerson },
      passengers,
      token,
    }))
    router.push('/formulier')
  }

  // ── Niet in aanmerking ─────────────────────────────────────────────────────
  const overrideAmount = (() => {
    const km = flight.distanceKm
    if (!km) return 400
    if (km < 1500) return 250
    if (km <= 3500) return 400
    // > 3500 km: intra-EU cap at €400
    if (flight.origin && flight.destination && isIntraEuRoute(flight.origin, flight.destination)) return 400
    return 600
  })()

  function handleOverride() {
    const override: ResultData = {
      ...data!,
      compensation: {
        ...compensation, eligible: true,
        amountPerPerson: overrideAmount,
        reason: 'Compensatie op basis van eigen opgave passagier',
      },
    }
    sessionStorage.setItem('vv_result', JSON.stringify(override))
    setData(override)
  }

  if (!compensation.eligible) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <FunnelNav step={3} />
        <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>

            {/* Flight identity block */}
            <div className="card animate-fade-up d1" style={{ marginBottom: '1.25rem', padding: '1.125rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Airline logo */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: '#fff', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', padding: '6px',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://www.gstatic.com/flights/airline_logos/70px/${iataPrefix || 'UN'}.png`}
                    alt={airlineName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      const el = e.currentTarget
                      el.style.display = 'none'
                      const parent = el.parentElement!
                      parent.style.background = airline.color
                      parent.style.padding = '0'
                      parent.innerHTML = `<span style="font-family:var(--font-sora);font-weight:900;font-size:0.75rem;color:#fff;letter-spacing:0.04em">${iataPrefix || airlineName.slice(0,2).toUpperCase()}</span>`
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sora)' }}>
                    {airlineName} — vlucht {flight.flightNumber}
                  </p>
                  {flight.date && (
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>
                      {new Date(flight.date + 'T12:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {flight.origin && flight.destination && (
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', margin: 0 }}>
                      {AIRPORTS[flight.origin]?.name ?? flight.origin}
                      {' '}
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                      {' '}
                      {AIRPORTS[flight.destination]?.name ?? flight.destination}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Heading + reason */}
            <div className="animate-fade-up d1" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h1 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 800,
                fontSize: '1.375rem', lineHeight: 1.25,
                color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.625rem',
              }}>
                Waarschijnlijk geen recht op compensatie
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                {compensation.reason}
              </p>
            </div>

            {/* Card: why try anyway */}
            <div className="card animate-fade-up d2" style={{ marginBottom: '1rem', padding: '1.125rem 1.25rem' }}>
              <p style={{
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem',
              }}>
                Toch een kans?
              </p>
              {[
                'Aankomstvertraging telt — niet vertrek. Dit verschilt soms flink.',
                'Vluchtnummers kunnen gewijzigd zijn door codeshare-afspraken',
                'Airlines registreren vluchtdata niet altijd correct',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', marginBottom: i < 2 ? '0.5rem' : 0 }}>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                    background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button onClick={handleOverride} className="btn-cta animate-fade-up d3" style={{ marginBottom: '0.625rem' }}>
              Toch doorgaan — claim €{overrideAmount}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="animate-fade-up d3" style={{
              fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem',
            }}>
              Handmatige beoordeling · geen resultaat = geen extra kosten
            </p>

            <button onClick={() => router.replace('/')} className="btn-secondary animate-fade-up d4">
              ← Andere vlucht controleren
            </button>

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
        flightInfo={{ number: flight.flightNumber, airline: airlineName, amount: formatAmount(totalAmount) }}
      />

      <div className="funnel-grid">
      <div>

        {/* ① Flight identity */}
        <div className="card animate-fade-up d1" style={{ padding: '0.875rem 1.125rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
              background: '#fff', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', padding: '5px',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.gstatic.com/flights/airline_logos/70px/${iataPrefix || 'UN'}.png`}
                alt={airlineName}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  const el = e.currentTarget; el.style.display = 'none'
                  const p = el.parentElement!; p.style.background = airline.color; p.style.padding = '0'
                  p.innerHTML = `<span style="font-family:var(--font-sora);font-weight:900;font-size:0.65rem;color:#fff">${iataPrefix || airlineName.slice(0,2).toUpperCase()}</span>`
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 0.15rem', fontFamily: 'var(--font-sora)' }}>
                {airlineName} · {flight.flightNumber}
                {flight.date && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{' '}· {new Date(flight.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
              </p>
              {flight.origin && flight.destination && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {AIRPORTS[flight.origin]?.name ?? flight.origin} → {AIRPORTS[flight.destination]?.name ?? flight.destination}
                </p>
              )}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0,
              background: 'var(--green-dim)', border: '1px solid var(--green-border)',
              borderRadius: '6px', padding: '0.25rem 0.625rem',
            }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--green)' }}>In aanmerking</span>
            </div>
          </div>
        </div>

        {/* Verjaringstermijn strip */}
        {daysUntilExpiry !== null && (
          <div className="animate-fade-up d2" style={{
            marginBottom: '0.875rem', padding: '0.5rem 0.875rem',
            background: daysUntilExpiry < 90 ? 'rgba(220,38,38,0.07)' : daysUntilExpiry < 365 ? 'rgba(255,107,43,0.07)' : 'var(--blue-light)',
            border: `1px solid ${daysUntilExpiry < 90 ? 'rgba(220,38,38,0.25)' : daysUntilExpiry < 365 ? 'rgba(255,107,43,0.25)' : 'var(--blue-border)'}`,
            borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6.5" stroke={daysUntilExpiry < 90 ? '#dc2626' : daysUntilExpiry < 365 ? 'var(--orange)' : 'var(--blue)'} strokeWidth="1.4"/>
              <path d="M8 5v3.5l2 1.5" stroke={daysUntilExpiry < 90 ? '#dc2626' : daysUntilExpiry < 365 ? 'var(--orange)' : 'var(--blue)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontSize: '0.775rem', margin: 0, lineHeight: 1.4, color: 'var(--text-sub)' }}>
              {daysUntilExpiry < 90
                ? <><strong style={{ color: '#dc2626' }}>Let op: nog {daysUntilExpiry} dagen</strong> voor de verjaringstermijn — dien snel in.</>
                : daysUntilExpiry < 365
                ? <><strong style={{ color: 'var(--orange)' }}>{daysUntilExpiry} dagen</strong> resterend voor verjaringstermijn (3 jaar).</>
                : <>Verjaringstermijn loopt af over <strong>{Math.floor(daysUntilExpiry / 365)} jaar en {Math.floor((daysUntilExpiry % 365) / 30)} maanden</strong>.</>
              }
            </p>
          </div>
        )}

        {/* ② Result — heading + amount + passengers in één kaart */}
        <div className="animate-receipt d2" style={{
          marginBottom: '1rem', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', background: '#fff',
        }}>
          {/* Green header strip — geen margin-trucs, overflow:hidden knipt de hoeken */}
          <div style={{
            padding: '0.875rem 1.25rem',
            background: 'var(--green-dim)',
            borderBottom: '1px solid var(--green-border)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" fill="var(--green)" />
              <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)' }}>
              {flight.type === 'geannuleerd' ? 'Annulering bevestigd' : flight.type === 'geweigerd' ? 'Instapweigering' : flight.type === 'downgrade' ? 'Klasseverlaging bevestigd' : 'Compensatierecht bevestigd'} · EC 261/2004
            </span>
          </div>

          {/* Card body */}
          <div style={{ padding: '1.25rem' }}>
            {/* Headline + amount side by side */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-sora)', fontWeight: 800,
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  lineHeight: 1.2, color: 'var(--navy)', letterSpacing: '-0.02em', margin: '0 0 0.375rem',
                }}>
                  {flight.type === 'geannuleerd'
                    ? <>{airlineName} annuleerde<br />jouw vlucht</>
                    : flight.type === 'geweigerd'
                    ? <>{airlineName} weigerde<br />jou de instap</>
                    : flight.type === 'downgrade'
                    ? <>{airlineName} verlaagde<br />jouw reisklasse</>
                    : <>{airlineName} is jou<br />compensatie verschuldigd</>
                  }
                </h1>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {compensation.reason}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-sora)', fontWeight: 900, lineHeight: 1,
                  fontSize: 'clamp(2rem, 8vw, 2.75rem)',
                  color: 'var(--green)', letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums', margin: 0,
                }} className="animate-count d2">
                  €{animatedTotal.toLocaleString('nl-NL')}
                </p>
                {passengers > 1 && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {passengers} × {formatAmount(compensation.amountPerPerson)}
                  </p>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1.5px dashed var(--border)', margin: '1rem 0' }} />

            {/* Downgrade: ticketprice input to calculate amount */}
            {compensation.downgradePercentage && (
              <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>
                  Vergoeding: {compensation.downgradePercentage}% van ticketprijs (art. 10)
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>€</span>
                    <input
                      type="number" min="0" step="1" value={downgradeTicketPrice}
                      onChange={e => setDowngradeTicketPrice(e.target.value)}
                      placeholder="ticketprijs"
                      style={{
                        width: '140px', border: '1.5px solid rgba(139,92,246,0.35)', borderRadius: '8px',
                        padding: '0.5rem 0.75rem 0.5rem 1.625rem', fontSize: '0.875rem',
                        fontFamily: 'var(--font-sora)', fontWeight: 700, color: 'var(--text)', outline: 'none',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {downgradeTicketPrice && !isNaN(parseFloat(downgradeTicketPrice))
                      ? `→ €${Math.round(parseFloat(downgradeTicketPrice) * compensation.downgradePercentage / 100)} vergoeding`
                      : 'voer ticketprijs in voor exact bedrag'}
                  </span>
                </div>
              </div>
            )}

            <PassengerSelector value={passengers} onChange={setPassengers} amountPerPerson={effectiveAmountPerPerson} />

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginTop: '1rem', padding: '0.625rem 0.875rem',
              background: 'rgba(255,107,43,0.06)', border: '1px solid rgba(255,107,43,0.18)',
              borderRadius: '8px',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="6.5" stroke="var(--orange)" strokeWidth="1.4" />
                <path d="M8 5v3.5l2 1.5" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text)' }}>{airlineName} betaalt gemiddeld binnen {airline.avgPaymentWeeks} weken</strong>{' '}na indiening van de claim.
              </p>
            </div>
          </div>
        </div>

        {/* ③ Extra rechten info */}
        {/* 5-uursrecht: recht op terugbetaling bij vertraging ≥ 5 uur of annulering */}
        {(flight.type === 'geannuleerd' || (flight.type === 'vertraagd' && (flight.delayMinutes ?? 0) >= 300)) && (
          <div className="animate-fade-up d3" style={{
            marginBottom: '0.875rem', padding: '0.875rem 1.125rem',
            background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '12px',
          }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.4rem' }}>
              5-uursrecht (art. 8)
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.55 }}>
              Bij {flight.type === 'geannuleerd' ? 'een annulering' : 'vertraging ≥ 5 uur'} heb je ook recht op <strong>volledige terugbetaling van je ticket</strong> als je de reis niet meer wilt voortzetten — los van de compensatie. Dit geldt zelfs bij force majeure.
            </p>
          </div>
        )}

        {/* Zorgplicht: maaltijden en hotel altijd claimbaar */}
        <div className="animate-fade-up d3" style={{
          marginBottom: '0.875rem', padding: '0.875rem 1.125rem',
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: '12px',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.4rem' }}>
            Zorgplicht (art. 9) — bewaar bonnetjes
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.55 }}>
            {flight.type === 'geannuleerd' || flight.type === 'geweigerd'
              ? <>{airlineName} is ook verplicht maaltijden, hotel en transport te vergoeden. <strong>Houd bonnetjes bij</strong> — dit is cumulatief met de compensatie.</>
              : <>Bij wachttijd ≥ 2 uur heb je recht op maaltijden en 2 telefoongesprekken. Bij overnight-vertraging ook hotel + transport. <strong>Houd bonnetjes bij.</strong></>
            }
          </p>
        </div>

        {/* Fee vergelijking — alleen tonen als we goedkoper zijn dan marktgemiddelde */}
        {effectiveAmountPerPerson > 0 && Math.round(effectiveAmountPerPerson * 0.35) - Math.round(42 + effectiveAmountPerPerson * 0.25) > 0 && (
          <div className="animate-fade-up d3" style={{
            marginBottom: '0.875rem', padding: '0.875rem 1rem',
            background: '#fff', border: '1px solid var(--border)', borderRadius: '12px',
          }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
              Kosten bij jouw claim
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { name: 'Aerefund', detail: '€42 + 25%', total: Math.round(42 + effectiveAmountPerPerson * 0.25), best: true },
                { name: 'ClaimCompass', detail: '35%', total: Math.round(effectiveAmountPerPerson * 0.35), best: false },
                { name: 'AirHelp', detail: '45%', total: Math.round(effectiveAmountPerPerson * 0.45), best: false },
              ].map(({ name, detail, total, best }) => (
                <div key={name} style={{
                  flex: 1, padding: '0.5rem 0.375rem', borderRadius: '8px', textAlign: 'center', position: 'relative',
                  background: best ? 'var(--green-dim)' : 'var(--section-alt)',
                  border: `1px solid ${best ? 'var(--green-border)' : 'var(--border)'}`,
                }}>
                  {best && (
                    <div style={{
                      position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--green)', color: '#fff', fontSize: '0.5rem', fontWeight: 800,
                      letterSpacing: '0.06em', padding: '1px 6px', borderRadius: '99px', whiteSpace: 'nowrap',
                    }}>VOORDELIGST</div>
                  )}
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', margin: '0.1rem 0 0.15rem', fontFamily: 'var(--font-sora)' }}>{name}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-sub)', margin: '0 0 0.2rem' }}>{detail}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 900, color: best ? 'var(--green)' : 'var(--text)', fontFamily: 'var(--font-sora)', margin: 0 }}>€{total}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.5rem 0 0', textAlign: 'center' }}>
              Jij bespaart {formatAmount(Math.round(effectiveAmountPerPerson * 0.35) - Math.round(42 + effectiveAmountPerPerson * 0.25))} t.o.v. de markt
            </p>
          </div>
        )}

        {/* ④ CTA */}
        {daysUntilExpiry !== null && daysUntilExpiry < 365 && (
          <div className="animate-fade-up d3" style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'center',
            marginBottom: '0.5rem',
          }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6.5" stroke={daysUntilExpiry < 90 ? '#dc2626' : 'var(--orange)'} strokeWidth="1.4"/>
              <path d="M8 5v3.5l2 1.5" stroke={daysUntilExpiry < 90 ? '#dc2626' : 'var(--orange)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '0.72rem', color: daysUntilExpiry < 90 ? '#dc2626' : 'var(--orange)', fontWeight: 600 }}>
              {daysUntilExpiry} dagen resterend — dien nu in
            </span>
          </div>
        )}
        <button onClick={handleClaim} className="btn-cta animate-fade-up d3" style={{ marginBottom: '0.375rem' }}>
          Claim mijn {formatAmount(totalAmount)}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ⑤ Trust + token */}
        <div className="animate-fade-up d4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Social proof + fee disclaimer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { icon: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.5l3.5-.5L6 1z" fill="var(--blue)" /></svg>, label: '4.8/5 beoordeling' },
              { icon: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="var(--green)" strokeWidth="1.3"/><path d="M3.5 6l2 2 3-3" stroke="var(--green)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: '1.400+ claims' },
              { icon: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="var(--blue)" strokeWidth="1.3"/><path d="M6 3.5v2.5l1.5 1" stroke="var(--blue)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'Geen betaling nu · €42 pas na indiening' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {item.icon}{item.label}
              </div>
            ))}
          </div>

          {/* Token */}
          {token && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.55rem 0.875rem', borderRadius: '10px',
              background: 'var(--section-alt)', border: '1px solid var(--border)',
            }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <rect x="1.5" y="5.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Claimcode:&nbsp;<strong style={{ fontFamily: 'var(--font-sora)', color: 'var(--text)', letterSpacing: '0.08em' }}>{token}</strong>
              </span>
            </div>
          )}
        </div>

      </div>{/* end main column */}

      <FunnelSidebar step={3} airline={{
        name: airlineName,
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
