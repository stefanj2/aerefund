'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/overview')
      } else {
        setError('Ongeldig wachtwoord. Probeer opnieuw.')
      }
    } catch {
      setError('Verbindingsfout. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'var(--font-inter)',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ height: '40px', overflow: 'hidden', display: 'inline-block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block' }} />
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-sora)',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--text)',
            margin: '0 0 0.375rem',
          }}>
            Inloggen
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 1.5rem' }}>
            Aerefund beheerder portaal
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-sub)',
                marginBottom: '0.375rem',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}>
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '0.6875rem 0.875rem',
                  borderRadius: '8px',
                  border: error ? '1.5px solid var(--red)' : '1.5px solid var(--border)',
                  fontSize: '0.9375rem',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: 'var(--bg)',
                  transition: 'border-color 0.15s',
                  fontFamily: 'var(--font-inter)',
                }}
              />
            </div>

            {error && (
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--red)',
                marginBottom: '1rem',
                padding: '0.625rem 0.875rem',
                background: 'var(--red-dim)',
                borderRadius: '8px',
                border: '1px solid rgba(220,38,38,0.15)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: loading || !password ? 'var(--border)' : 'var(--blue)',
                color: loading || !password ? 'var(--text-muted)' : '#fff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: loading || !password ? 'default' : 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-sora)',
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? 'Inloggen…' : 'Inloggen →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Aerefund.nl — Intern beheerportaal
        </p>
      </div>
    </div>
  )
}
