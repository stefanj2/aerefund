'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, color: '#166534', marginBottom: '0.375rem' }}>Bericht verstuurd!</p>
        <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>We reageren zo snel mogelijk, doorgaans binnen 1-2 werkdagen.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
            Naam *
          </label>
          <input
            type="text" required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Jan de Vries"
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
            Email *
          </label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="jan@email.nl"
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
          Onderwerp
        </label>
        <input
          type="text" value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          placeholder="bijv. Vraag over mijn claim"
          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
          Bericht *
        </label>
        <textarea
          required value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Stel hier je vraag of beschrijf je situatie..."
          rows={5}
          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.9rem', fontFamily: 'var(--font-inter)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '0.8125rem', color: '#dc2626', margin: 0 }}>
          Verzenden mislukt. Probeer het opnieuw of mail rechtstreeks naar{' '}
          <a href="mailto:info@aerefund.com" style={{ color: '#dc2626' }}>info@aerefund.com</a>.
        </p>
      )}
      <div>
        <button
          type="submit" disabled={status === 'sending'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--orange)', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
            padding: '0.75rem 1.5rem', borderRadius: '9px', border: 'none',
            cursor: status === 'sending' ? 'default' : 'pointer',
            opacity: status === 'sending' ? 0.7 : 1,
          }}
        >
          {status === 'sending' ? 'Versturen…' : 'Bericht versturen →'}
        </button>
      </div>
    </form>
  )
}
