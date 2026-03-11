'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DoorgaanInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill token from URL param (?token=XXXXXX)
  useEffect(() => {
    const t = searchParams.get('token')
    if (t) setToken(t.toUpperCase())
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = token.toUpperCase().replace(/\s/g, '')
    if (clean.length < 4) { setError('Vul een geldige claimcode in.'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/claim?token=${encodeURIComponent(clean)}`)
      if (!res.ok) { setError('Claimcode niet gevonden. Controleer de code en probeer opnieuw.'); setLoading(false); return }

      const claim = await res.json()

      if (claim.status === 'submitted') {
        setError('Deze claim is al ingediend. Heb je vragen? Mail naar claim@aerefund.com.')
        setLoading(false)
        return
      }

      // Restore session storage
      const flightData = claim.flight_data
      const compensation = claim.compensation
      const passengers = claim.passengers ?? 1

      sessionStorage.setItem('vv_token', claim.token)
      sessionStorage.setItem('vv_result', JSON.stringify({ flight: flightData, compensation }))
      sessionStorage.setItem('vv_claim', JSON.stringify({ flight: flightData, compensation, passengers, token: claim.token }))

      router.push('/formulier')
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      {/* Logo */}
      <a href="/" style={{ marginBottom: '2.5rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
        <div style={{ height: '40px', overflow: 'hidden', display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto' }} />
        </div>
      </a>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card">
          {/* Icon */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="9" width="14" height="9" rx="2" stroke="var(--blue)" strokeWidth="1.6" />
              <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
            Claim hervatten
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Vul je claimcode in om verder te gaan waar je gebleven was.
          </p>

          <form onSubmit={handleSubmit}>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--text-sub)', marginBottom: '0.4rem',
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
                background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
              }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--red)', margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                  Claim ophalen…
                </span>
              ) : 'Verder gaan →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Geen code?{' '}
          <a href="/" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
            Start een nieuwe check
          </a>
        </p>
      </div>
    </main>
  )
}

export default function DoorgaanPage() {
  return (
    <Suspense>
      <DoorgaanInner />
    </Suspense>
  )
}
