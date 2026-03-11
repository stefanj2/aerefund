'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAirlineConfig } from '@/lib/airlines'
import { formatAmount } from '@/lib/compensation'
import { AIRPORTS } from '@/lib/airports'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import type { FlightData, CoPassenger } from '@/lib/types'

type ClaimSession = {
  flight: FlightData
  compensation: { amountPerPerson: number; eligible: boolean; reason: string }
  passengers: number
  token?: string
}

const STEPS = [
  { label: 'Jouw gegevens', short: 'Gegevens' },
  { label: 'Medereizgers',  short: 'Medereizigers' },
  { label: 'Indienen',      short: 'Indienen' },
]

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: '0.3rem' }}>{msg}</p>
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase',
      color: 'var(--text-muted)', marginBottom: '0.375rem',
    }}>
      {children}
    </label>
  )
}

export default function FormulierPage() {
  const router = useRouter()
  const [session, setSession] = useState<ClaimSession | null>(null)
  const [step, setStep] = useState(1)

  const [firstName, setFirstName]     = useState('')
  const [lastName, setLastName]       = useState('')
  const [email, setEmail]             = useState('')
  const [phone, setPhone]             = useState('')
  const [iban, setIban]               = useState('')
  const [address, setAddress]         = useState('')
  const [postalCode, setPostalCode]   = useState('')
  const [city, setCity]               = useState('')
  const [agreedToTerms, setAgreedToTerms]       = useState(false)
const [agreedToWithdrawal, setAgreedToWithdrawal] = useState(false)
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [coPassengers, setCoPassengers] = useState<CoPassenger[]>([])
  const [boardingPassFile, setBoardingPassFile] = useState<File | null>(null)
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_claim')
    if (!raw) { router.replace('/'); return }
    const parsed = JSON.parse(raw)
    setSession(parsed)
    const count = Math.max(0, (parsed.passengers ?? 1) - 1)
    setCoPassengers(Array.from({ length: count }, () => ({ firstName: '', lastName: '', email: '' })))
  }, [router])

  if (!session) return null

  const { flight, compensation, passengers } = session
  const iataPrefix = flight.iataPrefix ?? ''
  const airline    = getAirlineConfig(iataPrefix)
  const totalAmount = compensation.amountPerPerson * passengers

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Voornaam is verplicht'
    if (!lastName.trim())  errs.lastName  = 'Achternaam is verplicht'
    if (!email.trim() || !email.includes('@')) errs.email = 'Geldig emailadres verplicht'
    if (!phone.trim())     errs.phone     = 'Telefoonnummer is verplicht'
    if (!address.trim())   errs.address   = 'Adres is verplicht'
    if (!postalCode.trim()) errs.postalCode = 'Postcode is verplicht'
    if (!city.trim())      errs.city      = 'Woonplaats is verplicht'
    return errs
  }

  function validateStep3() {
    const errs: Record<string, string> = {}
    if (!agreedToTerms)      errs.terms      = 'Verplicht'
if (!agreedToWithdrawal) errs.withdrawal = 'Verplicht'
    return errs
  }

  function handleNext() {
    if (step === 1) {
      const errs = validateStep1()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      setErrors({})
      // Auto-skip medereizgers-step when traveling alone
      if (coPassengers.length === 0) { setStep(3); return }
    }
    if (step < 3) setStep(step + 1)
  }

  function updateCoPassenger(i: number, field: keyof CoPassenger, value: string) {
    setCoPassengers((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)))
  }

  async function handleSubmit() {
    const errs = validateStep3()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    setSubmitError(null)

    // Upload boarding pass to Supabase Storage (non-blocking on failure)
    let boardingPassPath: string | null = null
    if (boardingPassFile && session?.token) {
      try {
        const fd = new FormData()
        fd.append('file', boardingPassFile)
        fd.append('token', session.token)
        const uploadRes = await fetch('/api/upload-boarding-pass', { method: 'POST', body: fd })
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json()
          boardingPassPath = uploadJson.path ?? null
        }
      } catch {
        // Non-blocking — proceed without upload
      }
    }

    const submittedAt = new Date().toISOString()
    const payload = {
      token: session?.token ?? null,
      flight, compensation, passengers,
      firstName, lastName, customerEmail: email,
      phone, address, postalCode, city, iban,
      coPassengers,
      boardingPassFileName: boardingPassPath ?? (boardingPassFile?.name ?? null),
      submittedAt,
    }
    try {
      const res  = await fetch('/api/submit-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setSubmitError('Er is iets misgegaan. Probeer het opnieuw of mail naar info@aerefund.nl.')
        setSubmitting(false)
        return
      }
      sessionStorage.setItem('vv_submitted', JSON.stringify({ ...payload, agreedToTerms }))
      router.push('/bevestiging')
    } catch {
      setSubmitError('Geen verbinding. Controleer je internet en probeer opnieuw.')
      setSubmitting(false)
    }
  }

  const originName      = flight.origin      ? (AIRPORTS[flight.origin]?.name      ?? flight.origin)      : null
  const destinationName = flight.destination ? (AIRPORTS[flight.destination]?.name ?? flight.destination) : null

  return (
    <main className="min-h-screen pb-16" style={{ background: 'var(--bg)' }}>
      <FunnelNav
        step={4}
        flightInfo={{ number: flight.flightNumber, airline: airline.name, amount: formatAmount(totalAmount) }}
      />

      <div className="funnel-grid" style={{ paddingTop: '1.75rem' }}>
        <div>

          {/* Flight summary bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
            padding: '0.875rem 1.125rem', marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-card)',
          }}>
            {/* Airline logo */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              background: '#fff', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', padding: '5px',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.gstatic.com/flights/airline_logos/70px/${iataPrefix || 'UN'}.png`}
                alt={airline.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                  const parent = el.parentElement!
                  parent.style.background = airline.color
                  parent.style.padding = '0'
                  parent.innerHTML = `<span style="font-family:var(--font-sora);font-weight:900;font-size:0.65rem;color:#fff">${iataPrefix || airline.name.slice(0,2).toUpperCase()}</span>`
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 0.15rem', fontFamily: 'var(--font-sora)' }}>
                {airline.name} · {flight.flightNumber}
                {flight.date && (
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                    {' '}· {new Date(flight.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </p>
              {originName && destinationName && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {originName} → {destinationName}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0 0 0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Compensatie</p>
              <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-sora)', margin: 0 }}>
                {formatAmount(totalAmount)}
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div style={{
            display: 'flex', gap: '0', marginBottom: '1.75rem',
            background: '#fff', border: '1px solid var(--border)', borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {STEPS.map((s, i) => {
              const num = i + 1
              const isActive = num === step
              const isDone   = num < step
              return (
                <button
                  key={s.label}
                  disabled={num > step}
                  onClick={() => num < step && setStep(num)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.4rem', padding: '0.625rem 0.5rem',
                    background: isActive ? 'var(--blue-light)' : isDone ? 'var(--green-dim)' : 'transparent',
                    border: 'none',
                    borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                    cursor: isDone ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? 'var(--green)' : isActive ? 'var(--blue)' : 'var(--border)',
                    transition: 'background 0.2s',
                  }}>
                    {isDone ? (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: '0.55rem', fontWeight: 800, color: isActive ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-sora)' }}>
                        {num}
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--blue)' : isDone ? 'var(--green)' : 'var(--text-muted)',
                  }}>
                    {s.short}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Step 1: Jouw gegevens ─────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem',
                color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem',
              }}>
                Jouw gegevens
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                We dienen de claim in op jouw naam. Je adres hebben we nodig voor de officiële claimbrief naar {airline.name}.
              </p>

              <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Naam &amp; contact
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <Label>Voornaam *</Label>
                    <input className="input-field" type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)} placeholder="Jan" />
                    <FieldError msg={errors.firstName} />
                  </div>
                  <div>
                    <Label>Achternaam *</Label>
                    <input className="input-field" type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)} placeholder="de Vries" />
                    <FieldError msg={errors.lastName} />
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <Label>E-mailadres *</Label>
                  <input className="input-field" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="jan@email.nl" />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <Label>Telefoonnummer *</Label>
                  <input className="input-field" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)} placeholder="+31 6 12345678" />
                  <FieldError msg={errors.phone} />
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Adres
                </p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <Label>Straat + huisnummer *</Label>
                  <input className="input-field" type="text" value={address}
                    onChange={(e) => setAddress(e.target.value)} placeholder="Keizersgracht 1" />
                  <FieldError msg={errors.address} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <Label>Postcode *</Label>
                    <input className="input-field" type="text" value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.toUpperCase())} placeholder="1234 AB" />
                    <FieldError msg={errors.postalCode} />
                  </div>
                  <div>
                    <Label>Woonplaats *</Label>
                    <input className="input-field" type="text" value={city}
                      onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" />
                    <FieldError msg={errors.city} />
                  </div>
                </div>
              </div>

              <button onClick={handleNext} className="btn-cta" style={{ marginTop: '0.5rem' }}>
                {coPassengers.length > 0 ? 'Doorgaan naar medereizgers' : 'Doorgaan naar indienen'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Step 2: Medereizgers ──────────────────────────────────── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem',
                color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem',
              }}>
                Medereizgers
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {coPassengers.length === 0
                  ? 'Je reist alleen — geen medereizgers toe te voegen.'
                  : `Vul de gegevens in van je ${coPassengers.length} medepassagier${coPassengers.length > 1 ? 's' : ''}.`}
              </p>

              {coPassengers.length === 0 ? (
                <div className="card" style={{
                  padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '1.25rem',
                  borderStyle: 'dashed', borderColor: 'var(--border)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto 1rem',
                    background: 'var(--section-alt)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2h0A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="var(--text-muted)" />
                    </svg>
                  </div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sora)' }}>
                    Alleen gereisd
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Er zijn geen medereizgers om toe te voegen.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  {coPassengers.map((p, i) => (
                    <div key={i} className="card" style={{ padding: '1.25rem' }}>
                      <p style={{
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '1rem',
                      }}>
                        Medepassagier {i + 1}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <Label>Voornaam</Label>
                          <input className="input-field" type="text" value={p.firstName}
                            onChange={(e) => updateCoPassenger(i, 'firstName', e.target.value)} placeholder="Voornaam" />
                        </div>
                        <div>
                          <Label>Achternaam</Label>
                          <input className="input-field" type="text" value={p.lastName}
                            onChange={(e) => updateCoPassenger(i, 'lastName', e.target.value)} placeholder="Achternaam" />
                        </div>
                      </div>
                      <div>
                        <Label>E-mailadres</Label>
                        <input className="input-field" type="email" value={p.email}
                          onChange={(e) => updateCoPassenger(i, 'email', e.target.value)} placeholder="email@voorbeeld.nl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <button onClick={handleNext} className="btn-cta">
                  Doorgaan naar indienen
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button onClick={() => setStep(1)} className="btn-secondary">← Terug</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Indienen ─────────────────────────────────────── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem',
                color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem',
              }}>
                Controleer en indien
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Upload optioneel je boardingpass — dit versterkt de claim aanzienlijk.
              </p>

              {/* Boarding pass upload */}
              <div
                onClick={() => document.getElementById('fileInput')?.click()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1.125rem 1.25rem', borderRadius: '14px', cursor: 'pointer',
                  border: `1.5px dashed ${boardingPassFile ? 'var(--green)' : 'var(--border)'}`,
                  background: boardingPassFile ? 'var(--green-dim)' : '#fff',
                  marginBottom: '1rem', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                  background: boardingPassFile ? 'var(--green-dim)' : 'var(--section-alt)',
                  border: `1px solid ${boardingPassFile ? 'var(--green-border)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {boardingPassFile ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4 4 8-8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3v10M6 7l4-4 4 4" stroke="var(--text-muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 15v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1" stroke="var(--text-muted)" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: boardingPassFile ? 'var(--green)' : 'var(--text)', margin: '0 0 0.15rem', fontFamily: 'var(--font-sora)' }}>
                    {boardingPassFile ? boardingPassFile.name : 'Boardingpass uploaden'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {boardingPassFile ? 'Klik om te vervangen' : 'PDF, JPG of PNG · optioneel · max 10 MB'}
                  </p>
                </div>
                <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={(e) => setBoardingPassFile(e.target.files?.[0] ?? null)} />
              </div>

              {/* IBAN */}
              <div className="card" style={{ padding: '1.125rem 1.25rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  IBAN voor uitbetaling
                </p>
                <input className="input-field" type="text" value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())} placeholder="NL00 ABCD 0123 4567 89" />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  Optioneel — kan ook later worden opgegeven na uitbetaling
                </p>
              </div>

              {/* Claim summary */}
              <div className="card" style={{ padding: '1.125rem 1.25rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                  Overzicht claim
                </p>
                {[
                  ['Naam',        `${firstName} ${lastName}`],
                  ['Vlucht',      flight.flightNumber],
                  ['Airline',     airline.name],
                  ['Datum',       new Date(flight.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Passagiers',  String(passengers)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1.5px dashed var(--border)', marginTop: '0.625rem', paddingTop: '0.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verwachte compensatie</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-sora)' }}>{formatAmount(totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Onze factuur (na indiening)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>€42</span>
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                {[
                  {
                    key: 'terms',
                    checked: agreedToTerms,
                    set: setAgreedToTerms,
                    err: errors.terms,
                    text: <>Ik ga akkoord met de{' '}
                      <a href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--blue)', textDecoration: 'underline' }}
                        onClick={(e) => e.stopPropagation()}>algemene voorwaarden</a>{' '}
                      en de{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--blue)', textDecoration: 'underline' }}
                        onClick={(e) => e.stopPropagation()}>privacyverklaring</a>,
                      en geef Aerefund volmacht om namens mij een claim in te dienen bij {airline.name}.
                      Na indiening ontvang ik een factuur van 42 euro per e-mail,
                      en bij succesvolle uitbetaling wordt 10% commissie in rekening gebracht.
                    </>,
                  },
                  {
                    key: 'withdrawal',
                    checked: agreedToWithdrawal,
                    set: setAgreedToWithdrawal,
                    err: errors.withdrawal,
                    text: <>Ik doe afstand van mijn herroepingsrecht, omdat Aerefund direct na indiening start met de behandeling van mijn claim.</>,
                  },
                ].map(({ key, checked, set, err, text }) => (
                  <div
                    key={key}
                    style={{
                      background: checked ? 'var(--blue-light)' : '#fff',
                      border: `1.5px solid ${err ? 'var(--red)' : checked ? 'var(--blue-border)' : 'var(--border)'}`,
                      borderRadius: '10px', padding: '0.875rem 1rem',
                      cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
                    }}
                    onClick={() => { set(!checked); setErrors((p) => ({ ...p, [key]: '' })) }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, marginTop: '1px',
                        border: `1.5px solid ${checked ? 'var(--blue)' : err ? 'var(--red)' : 'var(--border)'}`,
                        background: checked ? 'var(--blue)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {checked && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
                        {text}
                      </p>
                    </div>
                    {err && <p style={{ fontSize: '0.72rem', color: 'var(--red)', margin: '0.375rem 0 0 1.625rem' }}>Verplicht om door te gaan</p>}
                  </div>
                ))}
              </div>

              {submitError && (
                <div style={{
                  background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)',
                  borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1rem',
                }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--red)', margin: 0, lineHeight: 1.5 }}>{submitError}</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={submitting} className="btn-cta" style={{ marginBottom: '0.875rem', flexDirection: 'column', gap: '0.2rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0,
                    }} />
                    Claim wordt aangemaakt…
                  </span>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Claim indienen
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.75, letterSpacing: '0.01em' }}>
                      Betalingsverplichting
                    </span>
                  </>
                )}
              </button>
              <button onClick={() => setStep(2)} className="btn-secondary">← Terug</button>
            </div>
          )}

        </div>{/* end main column */}
        <FunnelSidebar step={4} />
      </div>
    </main>
  )
}
