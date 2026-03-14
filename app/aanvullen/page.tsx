'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { validateIban } from '@/lib/validateIban'

type ClaimInfo = {
  found: boolean
  firstName?: string
  flight?: { flightNumber?: string; iataPrefix?: string; date?: string; airline?: string }
  hasIban?: boolean
  hasBoardingPass?: boolean
  hasIdCopy?: boolean
}

function UploadArea({
  id, file, label, hint, onChange, alreadyHas,
}: {
  id: string; file: File | null; label: string; hint: string
  onChange: (f: File | null) => void; alreadyHas: boolean
}) {
  const isSet = alreadyHas || !!file
  return (
    <div
      onClick={() => document.getElementById(id)?.click()}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.875rem 1rem', borderRadius: '10px', cursor: 'pointer',
        border: `1.5px dashed ${isSet ? 'var(--green)' : 'var(--border)'}`,
        background: isSet ? 'var(--green-dim)' : 'var(--bg)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
        background: isSet ? 'rgba(34,197,94,0.15)' : '#fff',
        border: `1px solid ${isSet ? 'var(--green-border)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isSet ? (
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v10M6 7l4-4 4 4" stroke="var(--text-muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1" stroke="var(--text-muted)" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '0.8125rem', fontWeight: 700, margin: '0 0 0.125rem',
          fontFamily: 'var(--font-sora)',
          color: isSet ? 'var(--green)' : 'var(--text)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {alreadyHas && !file ? 'Al ontvangen' : file ? file.name : label}
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
          {alreadyHas && !file ? 'Klik om een nieuw bestand te uploaden ter vervanging' : hint}
        </p>
      </div>
      <input
        id={id} type="file" accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onClick={e => e.stopPropagation()}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="var(--green)" />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="var(--border)" strokeWidth="1.5" />
    </svg>
  )
}

function AanvullenContent() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [claim, setClaim]           = useState<ClaimInfo | null>(null)
  const [iban, setIban]             = useState('')
  const [ibanError, setIbanError]   = useState('')
  const [bpFile, setBpFile]         = useState<File | null>(null)
  const [idFile, setIdFile]         = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) { setClaim({ found: false }); return }
    fetch(`/api/aanvullen?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(setClaim)
      .catch(() => setClaim({ found: false }))
  }, [token])

  // Loading
  if (!claim) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  // Not found
  if (!claim.found) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar color="var(--border)" />
      <NavBar token="" />
      <div style={{ maxWidth: '420px', margin: '5rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 1.25rem',
          background: 'var(--section-alt)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
          Link niet gevonden
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          Controleer de link in je email of neem contact op via{' '}
          <a href="mailto:claim@aerefund.com" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>claim@aerefund.com</a>.
        </p>
        <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
          ← Terug naar home
        </Link>
      </div>
    </div>
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (iban) {
      const err = validateIban(iban)
      if (err) { setIbanError(err); return }
    }
    setSubmitting(true)
    setSubmitError(null)

    const fd = new FormData()
    fd.append('token', token)
    if (iban.trim()) fd.append('iban', iban.trim())
    if (bpFile)      fd.append('boarding_pass', bpFile)
    if (idFile)      fd.append('id_copy', idFile)

    try {
      const res  = await fetch('/api/aanvullen', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setSubmitError('Er is iets misgegaan. Probeer opnieuw of mail naar claim@aerefund.com.')
      } else {
        setDone(true)
      }
    } catch {
      setSubmitError('Geen verbinding. Controleer je internet en probeer opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  const hasIbanNow   = claim.hasIban        || !!iban.trim()
  const hasBpNow     = claim.hasBoardingPass || !!bpFile
  const hasIdNow     = claim.hasIdCopy      || !!idFile
  const somethingNew = !!iban.trim()        || !!bpFile || !!idFile
  const allDone      = hasIbanNow && hasBpNow && hasIdNow

  const flightLabel = claim.flight?.flightNumber
    ? `${claim.flight.flightNumber}${claim.flight.date ? ' · ' + new Date(claim.flight.date + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}`
    : null

  // Success
  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar color="var(--green)" />
      <NavBar token={token} />
      <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '68px', height: '68px', borderRadius: '50%', margin: '0 auto 1.25rem',
          background: 'var(--green-dim)', border: '2px solid var(--green-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path d="M7 16l6 6 12-12" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
          Gegevens ontvangen
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.375rem' }}>
          {claim.firstName ? `Bedankt, ${claim.firstName}.` : 'Bedankt.'} Alles is toegevoegd aan je claim.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '2rem' }}>
          Wij nemen contact op zodra de compensatie is ontvangen.
        </p>
        <a href="https://aerefund.com" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none' }}>
          ← Terug naar Aerefund
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>
      <TopBar color={allDone ? 'var(--green)' : 'var(--orange)'} />
      <NavBar token={token} />

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.25rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
            Claim aanvullen
          </p>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', color: 'var(--navy)', marginBottom: '0.375rem', lineHeight: 1.15 }}>
            {claim.firstName ? `${claim.firstName}, nog 3 gegevens nodig` : 'Nog 3 gegevens nodig'}
          </h1>
          {flightLabel && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{flightLabel}</p>
          )}
        </div>

        {/* Progress row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem', marginBottom: '1.75rem',
        }}>
          {[
            { label: 'IBAN', done: hasIbanNow },
            { label: 'Boardingpass', done: hasBpNow },
            { label: 'ID-bewijs', done: hasIdNow },
          ].map(({ label, done: isDone }) => (
            <div key={label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
              padding: '0.625rem 0.5rem',
              background: isDone ? 'var(--green-dim)' : '#fff',
              border: `1px solid ${isDone ? 'var(--green-border)' : 'var(--border)'}`,
              borderRadius: '10px',
            }}>
              <CheckIcon done={isDone} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isDone ? 'var(--green)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* ── 1. IBAN ─────────────────────────────────────────────── */}
          <div className="card" style={{ padding: '1.125rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="5" width="16" height="12" rx="2" stroke="var(--orange)" strokeWidth="1.5" />
                  <path d="M2 9h16" stroke="var(--orange)" strokeWidth="1.5" />
                  <path d="M6 13h3" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>
                    IBAN-rekeningnummer
                  </p>
                  {claim.hasIban && (
                    <span className="badge-green" style={{ fontSize: '0.62rem' }}>
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      Al ontvangen
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>
                  Hierop storten wij het nettobedrag na ontvangst van de compensatie
                </p>
              </div>
            </div>
            <input
              className="input-field"
              type="text"
              value={iban}
              onChange={e => { setIban(e.target.value.toUpperCase()); setIbanError('') }}
              placeholder={claim.hasIban ? 'Al ingevuld — optioneel bijwerken' : 'NL00 ABCD 0123456789'}
              autoComplete="off"
              spellCheck={false}
              style={{ letterSpacing: '0.05em' }}
            />
            {ibanError && <p style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: '0.3rem' }}>{ibanError}</p>}
          </div>

          {/* ── 2. Boardingpass ─────────────────────────────────────── */}
          <div className="card" style={{ padding: '1.125rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" stroke="var(--orange)" strokeWidth="1.5" />
                  <path d="M8 7h4M8 10h4M8 13h2" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>
                    Boardingpass of boekingsbevestiging
                  </p>
                  {claim.hasBoardingPass && (
                    <span className="badge-green" style={{ fontSize: '0.62rem' }}>
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      Al ontvangen
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>
                  Bewijs dat je daadwerkelijk op de vlucht zat
                </p>
              </div>
            </div>
            <UploadArea
              id="bp_upload" file={bpFile}
              label="Boardingpass uploaden" hint="PDF, JPG of PNG · max 10 MB"
              onChange={setBpFile} alreadyHas={claim.hasBoardingPass ?? false}
            />
          </div>

          {/* ── 3. Kopie ID ─────────────────────────────────────────── */}
          <div className="card" style={{ padding: '1.125rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="13" rx="2" stroke="var(--orange)" strokeWidth="1.5" />
                  <circle cx="7" cy="10" r="2" stroke="var(--orange)" strokeWidth="1.5" />
                  <path d="M11 9h4M11 12h3" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>
                    Kopie identiteitsbewijs
                  </p>
                  {claim.hasIdCopy && (
                    <span className="badge-green" style={{ fontSize: '0.62rem' }}>
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      Al ontvangen
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>
                  Paspoort of rijbewijs · sommige airlines vragen dit standaard op
                </p>
              </div>
            </div>
            <UploadArea
              id="id_upload" file={idFile}
              label="Identiteitsbewijs uploaden" hint="PDF, JPG of PNG · voor- en achterkant · max 10 MB"
              onChange={setIdFile} alreadyHas={claim.hasIdCopy ?? false}
            />
          </div>

          {submitError && (
            <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--red)', margin: 0 }}>{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !somethingNew}
            className="btn-cta"
            style={{ marginTop: '0.25rem' }}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                Opslaan…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {somethingNew ? 'Gegevens opslaan' : 'Niets te wijzigen'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
            Je kunt later terugkomen via dezelfde link in je email
          </p>
        </form>
      </main>
    </div>
  )
}

function TopBar({ color }: { color: string }) {
  return <div style={{ height: '3px', background: color, transition: 'background 0.4s' }} />
}

function NavBar({ token }: { token: string }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 1.25rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ height: '40px', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block' }} />
          </div>
        </a>
        {token && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--text-muted)', background: 'var(--bg)',
            border: '1px solid var(--border)', borderRadius: '6px',
            padding: '0.25rem 0.625rem', fontFamily: 'var(--font-sora)',
          }}>
            {token}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AanvullenPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid var(--border)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    }>
      <AanvullenContent />
    </Suspense>
  )
}
