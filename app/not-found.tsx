import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagina niet gevonden',
}

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.25rem', fontFamily: 'var(--font-inter)',
    }}>
      {/* Logo */}
      <a href="/" style={{ marginBottom: '3rem', display: 'block', textDecoration: 'none' }}>
        <div style={{ height: '40px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto' }} />
        </div>
      </a>

      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        {/* 404 number */}
        <div style={{
          fontFamily: 'var(--font-sora)', fontWeight: 900,
          fontSize: 'clamp(6rem, 20vw, 9rem)', color: 'var(--border)',
          lineHeight: 1, marginBottom: '1rem', letterSpacing: '-0.05em',
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-sora)', fontWeight: 800,
          fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', color: 'var(--navy)',
          marginBottom: '0.75rem', letterSpacing: '-0.02em',
        }}>
          Deze pagina bestaat niet
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
          De pagina die je zoekt is verplaatst, verwijderd of heeft nooit bestaan.
          Ga terug naar de homepage om je vlucht te controleren.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--orange)', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
            padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
          }}>
            Check mijn vlucht
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/faq" style={{
            display: 'inline-flex', alignItems: 'center',
            border: '1.5px solid var(--border)', color: 'var(--text-sub)',
            fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.9375rem',
            padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
            background: '#fff',
          }}>
            Veelgestelde vragen
          </Link>
        </div>
      </div>
    </main>
  )
}
