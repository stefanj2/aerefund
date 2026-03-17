'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
  }, [error])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '48px', width: 'auto', margin: '0 auto' }} />
        </div>

        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 7v8" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="14" cy="20" r="1.5" fill="#DC2626" />
            <path d="M5 24L14 4l9 20H5z" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '0.625rem' }}>
          Er is iets misgegaan
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
          Er is een onverwachte fout opgetreden. Je claim-gegevens zijn niet verloren gegaan.
          Probeer de pagina opnieuw te laden of ga terug naar de homepage.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px',
            padding: '0.75rem', marginBottom: '1.25rem', textAlign: 'left',
          }}>
            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#DC2626', margin: 0, wordBreak: 'break-all' }}>
              {error.message}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={reset}
            style={{
              width: '100%', padding: '0.75rem 1.25rem',
              background: 'var(--orange)', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              cursor: 'pointer',
            }}
          >
            Probeer opnieuw
          </button>
          <a
            href="/"
            style={{
              display: 'block', width: '100%', padding: '0.75rem 1.25rem',
              background: '#fff', color: 'var(--text-sub)',
              border: '1.5px solid var(--border)', borderRadius: '12px',
              fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.9375rem',
              textDecoration: 'none', boxSizing: 'border-box',
            }}
          >
            ← Terug naar homepage
          </a>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Blijft dit probleem optreden?{' '}
          <a href="mailto:info@aerefund.com" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600 }}>
            info@aerefund.com
          </a>
        </p>
      </div>
    </main>
  )
}
