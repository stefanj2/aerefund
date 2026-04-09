'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Image from 'next/image'

const BUNQME_BASE = process.env.NEXT_PUBLIC_BUNQME_URL ?? 'https://bunq.me/aerefund'
const AEREFUND_IBAN = process.env.NEXT_PUBLIC_AEREFUND_IBAN ?? ''

function addDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BetalenContent() {
  const params = useSearchParams()
  const ref = params.get('ref') ?? ''
  const naam = params.get('naam') ?? ''
  const vlucht = params.get('vlucht') ?? ''
  const airline = params.get('airline') ?? ''

  const [clicked, setClicked] = useState(false)
  const [showIban, setShowIban] = useState(false)

  const dueDate = addDays(14)
  const bunqUrl = `${BUNQME_BASE}/42/${encodeURIComponent(ref)}`
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '520px', width: '100%', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: '#ffffff', padding: 'clamp(20px, 5vw, 28px) clamp(16px, 5vw, 32px) 20px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
          <Image src="/logo-aerefund.png" alt="Aerefund" width={160} height={48} style={{ height: '48px', width: 'auto', display: 'inline-block' }} />
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(20px, 5vw, 28px) clamp(16px, 5vw, 32px)' }}>
          {/* Green badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '99px', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>✓ Claim ingediend</span>
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: '#111827' }}>
            {naam ? `Hoi ${naam}, ` : ''}servicenota
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
            Je claim is verwerkt. Hieronder vind je de nota voor onze dienstverlening.
          </p>

          {/* Invoice card */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: 'clamp(14px, 4vw, 18px) clamp(14px, 4vw, 20px)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ref && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>Referentie</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', letterSpacing: '0.05em' }}>{ref}</span>
                </div>
              )}
              {vlucht && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>Vlucht</span>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{vlucht}{airline ? ` · ${airline}` : ''}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Factuurdatum</span>
                <span style={{ fontSize: '13px', color: '#374151' }}>{today}</span>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Te voldoen voor</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{dueDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Totaalbedrag</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>€&thinsp;42,00</span>
              </div>
            </div>
          </div>

          {/* Pay button */}
          <a
            href={bunqUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setClicked(true)}
            style={{
              display: 'block',
              textAlign: 'center',
              background: clicked ? '#9ca3af' : '#FF6B2B',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '17px',
              padding: '15px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'background 0.2s',
              marginBottom: '12px',
            }}
          >
            {clicked ? 'Je wordt doorgestuurd…' : 'Betaal via bunq.me →'}
          </a>
          <p style={{ margin: '0 0 20px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
            Veilig via bunq.me &middot; iDEAL &middot; creditcard
          </p>

          {/* Manual transfer toggle */}
          <button
            onClick={() => setShowIban(v => !v)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#6b7280', fontSize: '13px', textDecoration: 'underline', display: 'block', margin: '0 auto' }}
          >
            {showIban ? 'Verberg' : 'Liever handmatig overmaken?'}
          </button>

          {showIban && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px 18px', marginTop: '14px' }}>
              <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#166534', fontSize: '14px' }}>Bankoverschrijving</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#166534' }}>IBAN</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>{AEREFUND_IBAN || 'Wordt bevestigd per email'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#166534' }}>Ten name van</span>
                  <span style={{ fontSize: '13px', color: '#166534' }}>GoodbyeGuru</span>
                </div>
                {ref && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#166534' }}>Kenmerk</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>{ref}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #bbf7d0', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Bedrag</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>€ 42,00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '16px 32px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
            Vragen?{' '}
            <a href="mailto:claim@aerefund.com" style={{ color: '#FF6B2B', textDecoration: 'none', fontWeight: 600 }}>
              claim@aerefund.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BetalenPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f3f4f6' }} />}>
      <BetalenContent />
    </Suspense>
  )
}
