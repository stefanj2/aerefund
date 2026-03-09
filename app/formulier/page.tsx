'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAirlineConfig } from '@/lib/airlines'
import { formatAmount } from '@/lib/compensation'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import type { FlightData, CoPassenger } from '@/lib/types'

type ClaimSession = {
  flight: FlightData
  compensation: { amountPerPerson: number; eligible: boolean; reason: string }
  passengers: number
  token?: string
}

const STEPS = ['Gegevens', 'Medereizgers', 'Indienen']

export default function FormulierPage() {
  const router = useRouter()
  const [session, setSession] = useState<ClaimSession | null>(null)
  const [step, setStep] = useState(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [iban, setIban] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [coPassengers, setCoPassengers] = useState<CoPassenger[]>([])
  const [boardingPassFile, setBoardingPassFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
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
  const airline = getAirlineConfig(flight.iataPrefix ?? '')
  const totalAmount = compensation.amountPerPerson * passengers

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Voornaam is verplicht'
    if (!lastName.trim()) errs.lastName = 'Achternaam is verplicht'
    if (!email.trim() || !email.includes('@')) errs.email = 'Geldig emailadres verplicht'
    if (!address.trim()) errs.address = 'Adres is verplicht'
    if (!postalCode.trim()) errs.postalCode = 'Postcode is verplicht'
    if (!city.trim()) errs.city = 'Woonplaats is verplicht'
    if (!agreedToTerms) errs.terms = 'Je moet akkoord gaan met de voorwaarden'
    return errs
  }

  function handleNext() {
    if (step === 1) {
      const errs = validateStep1()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
      setErrors({})
    }
    if (step < 3) setStep(step + 1)
  }

  function updateCoPassenger(i: number, field: keyof CoPassenger, value: string) {
    setCoPassengers((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)

    const submittedAt = new Date().toISOString()
    const payload = {
      token: session?.token ?? null,
      flight,
      compensation,
      passengers,
      firstName,
      lastName,
      customerEmail: email,
      phone,
      address,
      postalCode,
      city,
      iban,
      coPassengers,
      boardingPassFileName: boardingPassFile?.name ?? null,
      submittedAt,
    }

    try {
      const res = await fetch('/api/submit-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        setSubmitError('Er is iets misgegaan. Probeer het opnieuw of stuur een email naar info@aerefund.nl.')
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

  return (
    <main className="min-h-screen pb-10" style={{ background: 'var(--bg)' }}>
      {/* FunnelNav — global step 4, inner step shown below */}
      <FunnelNav
        step={4}
        flightInfo={{ number: flight.flightNumber, airline: airline.name, amount: formatAmount(totalAmount) }}
      />

      {/* Inner form progress bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0.625rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
              <div style={{
                height: '4px', borderRadius: '2px', flex: 1,
                background: i + 1 <= step ? 'var(--blue)' : 'var(--border)',
                transition: 'background 0.3s',
              }} />
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: i + 1 === step ? 'var(--blue)' : i + 1 < step ? 'var(--green)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>
                {i + 1 < step ? '✓ ' : ''}{label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="funnel-grid" style={{ paddingTop: '2rem' }}>
      <div>
        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-sora)' }}>Jouw gegevens</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              We hebben deze nodig om de claim op jouw naam in te dienen.
            </p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Voornaam *', value: firstName, set: setFirstName, placeholder: 'Jan', err: errors.firstName },
                  { label: 'Achternaam *', value: lastName, set: setLastName, placeholder: 'de Vries', err: errors.lastName },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="input-label">{f.label}</label>
                    <input className="input-field" type="text" value={f.value}
                      onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} />
                    {f.err && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{f.err}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label className="input-label">E-mailadres *</label>
                <input className="input-field" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="jan@email.nl" />
                {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.email}</p>}
              </div>

              <div>
                <label className="input-label">Telefoonnummer</label>
                <input className="input-field" type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} placeholder="+31 6 12345678" />
              </div>

              <div>
                <label className="input-label">Adres (straat + huisnummer) *</label>
                <input className="input-field" type="text" value={address}
                  onChange={(e) => setAddress(e.target.value)} placeholder="Keizersgracht 1" />
                {errors.address && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Postcode *</label>
                  <input className="input-field" type="text" value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.toUpperCase())} placeholder="1234 AB" />
                  {errors.postalCode && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="input-label">Woonplaats *</label>
                  <input className="input-field" type="text" value={city}
                    onChange={(e) => setCity(e.target.value)} placeholder="Amsterdam" />
                  {errors.city && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.city}</p>}
                </div>
              </div>

              {/* Terms */}
              <div
                className="card cursor-pointer"
                style={{ padding: '1rem', userSelect: 'none' }}
                onClick={() => setAgreedToTerms(!agreedToTerms)}
              >
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, marginTop: '1px',
                      border: `1.5px solid ${agreedToTerms ? 'var(--blue)' : 'var(--border)'}`,
                      background: agreedToTerms ? 'var(--blue)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {agreedToTerms && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    Ik ga akkoord met de{' '}
                    <a
                      href="/algemene-voorwaarden"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--blue)', textDecoration: 'underline' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      algemene voorwaarden
                    </a>{' '}
                    en geef Aerefund.nl volmacht om namens mij een claim in te dienen bij{' '}
                    {airline.name}. Ik begrijp dat ik een factuur van{' '}
                    <strong style={{ color: 'var(--text)' }}>€42</strong> ontvang na indiening, plus{' '}
                    <strong style={{ color: 'var(--text)' }}>10% commissie</strong> bij succesvolle uitbetaling.
                  </p>
                </div>
                {errors.terms && <p className="text-xs mt-2" style={{ color: 'var(--red)' }}>{errors.terms}</p>}
              </div>

              <button onClick={handleNext} className="btn-primary">Volgende stap →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-sora)' }}>Medereizgers</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {coPassengers.length === 0
                ? 'Je reist alleen — geen medereizgers.'
                : `Vul de gegevens in van je ${coPassengers.length} medepassagier${coPassengers.length > 1 ? 's' : ''}.`}
            </p>

            {coPassengers.length === 0 ? (
              <div className="card mb-6 text-center py-10" style={{ borderStyle: 'dashed' }}>
                <p className="text-3xl mb-3">✈️</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Geen medereizgers toe te voegen.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-6">
                {coPassengers.map((p, i) => (
                  <div key={i} className="card">
                    <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--blue)' }}>
                      Medepassagier {i + 1}
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="input-label">Voornaam</label>
                          <input className="input-field" type="text" value={p.firstName}
                            onChange={(e) => updateCoPassenger(i, 'firstName', e.target.value)} placeholder="Voornaam" />
                        </div>
                        <div>
                          <label className="input-label">Achternaam</label>
                          <input className="input-field" type="text" value={p.lastName}
                            onChange={(e) => updateCoPassenger(i, 'lastName', e.target.value)} placeholder="Achternaam" />
                        </div>
                      </div>
                      <div>
                        <label className="input-label">E-mailadres</label>
                        <input className="input-field" type="email" value={p.email}
                          onChange={(e) => updateCoPassenger(i, 'email', e.target.value)} placeholder="email@voorbeeld.nl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={handleNext} className="btn-primary">Volgende stap →</button>
              <button onClick={() => setStep(1)} className="btn-secondary">← Terug</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-sora)' }}>Indienen</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Een boardingpass versterkt je claim. Optioneel — je kunt dit ook later insturen.
            </p>

            {/* Upload */}
            <div
              className="mb-5 text-center py-10 rounded-xl cursor-pointer"
              style={{
                border: `2px dashed ${boardingPassFile ? 'var(--green)' : 'var(--border)'}`,
                background: boardingPassFile ? 'var(--green-dim)' : 'var(--surface)',
              }}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {boardingPassFile ? (
                <>
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-medium text-sm" style={{ color: 'var(--green)' }}>{boardingPassFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Klik om te vervangen</p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-3">📎</div>
                  <p className="font-medium text-sm mb-1">Sleep of klik om te selecteren</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PDF, JPG, PNG — max 10 MB</p>
                </>
              )}
              <input id="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                onChange={(e) => setBoardingPassFile(e.target.files?.[0] ?? null)} />
            </div>

            {/* IBAN */}
            <div className="mb-5">
              <label className="input-label">IBAN (voor uitbetaling)</label>
              <input className="input-field" type="text" value={iban}
                onChange={(e) => setIban(e.target.value.toUpperCase())} placeholder="NL00 ABCD 0123 4567 89" />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Optioneel — kan ook na uitbetaling worden opgegeven</p>
            </div>

            {/* Summary */}
            <div className="card mb-6">
              <p className="font-semibold text-sm mb-3" style={{ fontFamily: 'var(--font-sora)' }}>Overzicht claim</p>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  ['Vlucht', flight.flightNumber],
                  ['Airline', airline.name],
                  ['Datum', new Date(flight.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Passagiers', String(passengers)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Totale compensatie</span>
                  <span className="font-bold" style={{ color: 'var(--green)' }}>{formatAmount(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Onze factuur (na indiening)</span>
                  <span>€42</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {submitError && (
                <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--red)', margin: 0, lineHeight: 1.5 }}>{submitError}</p>
                </div>
              )}
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary"
                style={{ fontSize: '1rem', padding: '1rem 2rem' }}>
                {submitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block',
                    }} />
                    Claim wordt aangemaakt…
                  </span>
                ) : 'Claim aanmaken — factuur volgt →'}
              </button>
              <button onClick={() => setStep(2)} className="btn-secondary">← Terug</button>
            </div>
          </div>
        )}
      </div>{/* end main column */}
      <FunnelSidebar step={4} />
      </div>{/* end funnel-grid */}
    </main>
  )
}
