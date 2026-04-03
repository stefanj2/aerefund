'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

type ClaimData = {
  found: boolean
  token: string
  status: string
  statusLabel: string
  firstName: string | null
  flight: {
    flightNumber: string | null
    airline: string | null
    date: string | null
    origin: string | null
    destination: string | null
    type: string | null
  }
  compensation: {
    amountPerPerson: number | null
    eligible: boolean | null
    reason: string | null
  }
  passengers: number
  timeline: Array<{ date: string; label: string }>
  documents: {
    hasIban: boolean
    hasBoardingPass: boolean
    hasIdCopy: boolean
    hasConsentPdf: boolean
  }
  payout: {
    status: string
    amount: number | null
    sentAt: string | null
  }
  aanvullenUrl: string
}

function statusColor(status: string): string {
  if (['won', 'compensation_paid'].includes(status)) return '#22C55E'
  if (['rejected'].includes(status)) return '#EF4444'
  if (['in_progress', 'claim_filed', 'appeal_filed'].includes(status)) return '#FF6B2B'
  return '#94a3b8'
}

function statusBg(status: string): string {
  if (['won', 'compensation_paid'].includes(status)) return 'rgba(34,197,94,0.12)'
  if (['rejected'].includes(status)) return 'rgba(239,68,68,0.10)'
  if (['in_progress', 'claim_filed', 'appeal_filed'].includes(status)) return 'rgba(255,107,43,0.10)'
  return 'rgba(148,163,184,0.10)'
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function fmtFlightDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function typeLabel(type: string | null): string {
  if (!type) return ''
  const map: Record<string, string> = {
    delay: 'Vertraging',
    cancellation: 'Annulering',
    overbooking: 'Overboeking',
    missed_connection: 'Gemiste aansluiting',
  }
  return map[type] ?? type
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#22C55E" />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#1f3148" strokeWidth="1.5" />
      <path d="M6 8h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Token Entry Form ─────────────────────────────────────────── */
function TokenForm() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = token.toUpperCase().replace(/\s/g, '')
    if (clean.length < 4) { setError('Vul een geldige claimcode in.'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/mijn-claim?token=${encodeURIComponent(clean)}`)
      const data = await res.json()
      if (!data.found) {
        setError('Claimcode niet gevonden. Controleer de code en probeer opnieuw.')
        setLoading(false)
        return
      }
      router.push(`/mijn-claim?token=${encodeURIComponent(clean)}`)
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />
      <main style={{ maxWidth: '420px', margin: '0 auto', padding: '4rem 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 1.25rem',
            background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#FF6B2B" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M9 3h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3z" stroke="#FF6B2B" strokeWidth="1.8" />
              <path d="M9 12h6M9 16h4" stroke="#FF6B2B" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: '#0D1B2A', marginBottom: '0.375rem' }}>
            Claim status bekijken
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Vul je claimcode in om de voortgang van je claim te bekijken.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: '#64748b', marginBottom: '0.4rem',
            }}>
              Claimcode
            </label>
            <input
              className="input-field"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="bijv. A3B7K2"
              maxLength={10}
              autoFocus
              style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.12em', fontFamily: 'var(--font-sora)', marginBottom: '1rem' }}
            />
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
              }}>
                <p style={{ fontSize: '0.8125rem', color: '#EF4444', margin: 0 }}>{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Ophalen...
                </span>
              ) : 'Bekijk mijn claim'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Je vindt je claimcode in de bevestigingsmail van Aerefund.
        </p>
      </main>
    </div>
  )
}

/* ─── Main Claim View ──────────────────────────────────────────── */
function MijnClaimContent() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [claim, setClaim] = useState<ClaimData | null>(null)

  useEffect(() => {
    if (!token) { setClaim({ found: false } as ClaimData); return }
    fetch(`/api/mijn-claim?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(setClaim)
      .catch(() => setClaim({ found: false } as ClaimData))
  }, [token])

  // No token — show entry form
  if (!token) return <TokenForm />

  // Loading
  if (!claim) return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '28px', height: '28px', border: '3px solid #1f3148', borderTopColor: '#FF6B2B', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  // Not found
  if (!claim.found) return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />
      <div style={{ maxWidth: '420px', margin: '5rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 1.25rem',
          background: '#f1f5f9', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9 9l4 4M13 9l-4 4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.125rem', color: '#0D1B2A', marginBottom: '0.5rem' }}>
          Claim niet gevonden
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          Controleer de claimcode of neem contact op via{' '}
          <a href="mailto:claim@aerefund.com" style={{ color: '#FF6B2B', fontWeight: 600, textDecoration: 'none' }}>claim@aerefund.com</a>.
        </p>
        <Link href="/mijn-claim" style={{ fontSize: '0.8125rem', color: '#94a3b8', textDecoration: 'none', fontWeight: 600 }}>
          Andere code proberen
        </Link>
      </div>
    </div>
  )

  const sColor = statusColor(claim.status)
  const sBg = statusBg(claim.status)
  const amountPP = claim.compensation.amountPerPerson ?? 0
  const totalAmount = amountPP * claim.passengers
  const missingDocs = !claim.documents.hasIban || !claim.documents.hasBoardingPass || !claim.documents.hasIdCopy

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1.25rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FF6B2B', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
            Claimstatus
          </p>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.25rem, 4vw, 1.625rem)', color: '#0D1B2A', marginBottom: '0.25rem', lineHeight: 1.15 }}>
            {claim.firstName ? `Hoi ${claim.firstName}` : 'Jouw claim'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>
            Hieronder vind je de actuele status van je compensatieclaim.
          </p>
        </div>

        {/* ── Status Banner ──────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
              background: sBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {['won', 'compensation_paid'].includes(claim.status) ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={sColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : claim.status === 'rejected' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke={sColor} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke={sColor} strokeWidth="2" />
                  <path d="M12 7v5l3 3" stroke={sColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{
                display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
                color: sColor, background: sBg,
                padding: '0.2rem 0.625rem', borderRadius: '6px',
                letterSpacing: '0.03em', marginBottom: '0.25rem',
              }}>
                {claim.statusLabel}
              </span>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                {claim.status === 'submitted' && 'We hebben je claim ontvangen en gaan ermee aan de slag.'}
                {claim.status === 'invoice_sent' && 'We hebben de factuur verstuurd. Na betaling dienen we de claim in.'}
                {claim.status === 'invoice_paid' && 'Factuur betaald. We bereiden je claim voor bij de airline.'}
                {claim.status === 'claim_filed' && 'Je claim is ingediend bij de airline. We wachten op reactie.'}
                {claim.status === 'in_progress' && 'De airline behandelt je claim. Dit duurt gemiddeld 4-8 weken.'}
                {claim.status === 'won' && 'Goed nieuws! De airline heeft je compensatie goedgekeurd.'}
                {claim.status === 'compensation_paid' && 'De compensatie is uitbetaald naar je rekening.'}
                {claim.status === 'rejected' && 'De airline heeft je claim afgewezen. We bekijken de opties.'}
                {claim.status === 'appeal_filed' && 'We hebben bezwaar ingediend tegen de afwijzing.'}
                {claim.status === 'closed' && 'Deze claim is afgesloten.'}
                {claim.status === 'result_viewed' && 'Je hebt het resultaat bekeken. Dien je claim in om te starten.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tijdlijn ──────────────────────────────────────────── */}
        {claim.timeline.length > 0 && (
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: '#0D1B2A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#FF6B2B" strokeWidth="1.5" />
                <path d="M8 4.5V8l2.5 1.5" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tijdlijn
            </h2>
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {claim.timeline.map((step, i) => {
                const isLast = i === claim.timeline.length - 1
                return (
                  <div key={i} style={{ position: 'relative', paddingBottom: isLast ? 0 : '1.25rem' }}>
                    {/* Vertical line */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute', left: '-1.5rem', top: '10px', bottom: 0,
                        width: '2px', marginLeft: '5px',
                        background: isLast ? 'transparent' : '#e2e8f0',
                      }} />
                    )}
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: '-1.5rem', top: '2px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: isLast ? sColor : '#22C55E',
                      border: isLast ? `3px solid ${sBg}` : '3px solid rgba(34,197,94,0.15)',
                      boxShadow: isLast ? `0 0 0 3px ${sBg}` : 'none',
                    }} />
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0D1B2A', margin: '0 0 0.125rem' }}>
                        {step.label}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                        {fmtDate(step.date)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Vluchtgegevens ────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: '#0D1B2A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12h12M4.5 8.5L8 3l3.5 5.5" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Vluchtgegevens
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {claim.flight.flightNumber && (
              <InfoItem label="Vluchtnummer" value={claim.flight.flightNumber} />
            )}
            {claim.flight.airline && (
              <InfoItem label="Airline" value={claim.flight.airline} />
            )}
            {claim.flight.date && (
              <InfoItem label="Datum" value={fmtFlightDate(claim.flight.date)} />
            )}
            {claim.flight.type && (
              <InfoItem label="Type" value={typeLabel(claim.flight.type)} />
            )}
            {claim.flight.origin && claim.flight.destination && (
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoItem label="Route" value={`${claim.flight.origin} \u2192 ${claim.flight.destination}`} />
              </div>
            )}
          </div>
        </div>

        {/* ── Compensatie ───────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: '#0D1B2A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#22C55E" strokeWidth="1.5" />
              <path d="M8 4.5v7M5.5 6.5c0-1.1 1.12-2 2.5-2s2.5.9 2.5 2c0 1.5-2.5 1.5-2.5 3M5.5 11.5c0-1.1 1.12-2 2.5-2s2.5.9 2.5 2" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Compensatie
          </h2>
          {amountPP > 0 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Per persoon</span>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0D1B2A' }}>&euro;{amountPP}</span>
              </div>
              {claim.passengers > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Aantal passagiers</span>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0D1B2A' }}>{claim.passengers}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0D1B2A' }}>Totaal</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22C55E', fontFamily: 'var(--font-sora)' }}>&euro;{totalAmount}</span>
              </div>
              {claim.payout.amount != null && claim.payout.status === 'forwarded_to_customer' && (
                <div style={{
                  marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px',
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                }}>
                  <p style={{ fontSize: '0.8125rem', color: '#22C55E', margin: 0, fontWeight: 600 }}>
                    Uitbetaald: &euro;{claim.payout.amount}
                    {claim.payout.sentAt && <span style={{ fontWeight: 400, color: '#64748b' }}> op {fmtDate(claim.payout.sentAt)}</span>}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>
              {claim.compensation.reason ?? 'Compensatiebedrag wordt berekend.'}
            </p>
          )}
        </div>

        {/* ── Documenten ────────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: '#0D1B2A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#FF6B2B" strokeWidth="1.5" />
              <path d="M6 6h4M6 8.5h4M6 11h2" stroke="#FF6B2B" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Documenten
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <DocRow label="IBAN-rekeningnummer" done={claim.documents.hasIban} />
            <DocRow label="Boardingpass / boekingsbevestiging" done={claim.documents.hasBoardingPass} />
            <DocRow label="Kopie identiteitsbewijs" done={claim.documents.hasIdCopy} />
            <DocRow label="Ondertekend machtigingsformulier" done={claim.documents.hasConsentPdf} />
          </div>
          {missingDocs && (
            <a
              href={claim.aanvullenUrl}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                marginTop: '1rem', padding: '0.75rem 1.25rem', borderRadius: '10px',
                background: '#FF6B2B', color: '#fff',
                fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.8125rem',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Upload documenten
            </a>
          )}
        </div>

        {/* ── Contact ───────────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: '#0D1B2A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#FF6B2B" strokeWidth="1.5" />
              <path d="M2 5.5l6 4 6-4" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Vragen?
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.65 }}>
            Mail naar{' '}
            <a href={`mailto:claim@aerefund.com?subject=Claim ${claim.token}`} style={{ color: '#FF6B2B', fontWeight: 600, textDecoration: 'none' }}>
              claim@aerefund.com
            </a>{' '}
            met referentie <strong style={{ color: '#0D1B2A' }}>{claim.token}</strong>.
          </p>
        </div>

      </main>
    </div>
  )
}

/* ─── Shared Components ────────────────────────────────────────── */

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.125rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0D1B2A', margin: 0 }}>
        {value}
      </p>
    </div>
  )
}

function DocRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
      <CheckIcon done={done} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: done ? '#0D1B2A' : '#94a3b8' }}>
        {label}
      </span>
    </div>
  )
}


/* ─── Page Export ───────────────────────────────────────────────── */
export default function MijnClaimPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid #1f3148', borderTopColor: '#FF6B2B', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    }>
      <MijnClaimContent />
    </Suspense>
  )
}
