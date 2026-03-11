'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAirlineConfig } from '@/lib/airlines'
import { formatAmount } from '@/lib/compensation'
import FunnelNav from '@/components/FunnelNav'
import type { FlightData } from '@/lib/types'

type SubmittedData = {
  flight: FlightData
  compensation: { amountPerPerson: number }
  passengers: number
  firstName: string
  email: string
}

export default function BevestigingPage() {
  const router = useRouter()
  const [data, setData] = useState<SubmittedData | null>(null)
  const [copied, setCopied] = useState(false)
  const [referralCode] = useState(() => `VV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_submitted')
    if (!raw) { router.replace('/'); return }
    setData(JSON.parse(raw))
  }, [router])

  if (!data) return null

  const { flight, compensation, passengers, firstName, email } = data
  const airline = getAirlineConfig(flight.iataPrefix ?? '')
  const totalAmount = compensation.amountPerPerson * passengers
  const referralUrl = `https://aerefund.nl/?ref=${referralCode}`

  function copyReferral() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const timelineSteps = [
    { label: 'Nu', text: 'Claim ingediend bij Aerefund.nl', active: true },
    { label: 'Binnen 24 uur', text: `Factuur van €42 per email naar ${email}`, active: false },
    { label: 'Week 1–2', text: `Formele claimbrief naar ${airline.name}`, active: false },
    { label: `Week 2–${Math.max(3, airline.avgPaymentWeeks - 2)}`, text: `Onderhandeling met ${airline.name}`, active: false },
    { label: `±${airline.avgPaymentWeeks} weken`, text: `${formatAmount(totalAmount)} op jouw rekening`, active: false },
  ]

  return (
    <main className="min-h-screen pb-16" style={{ background: 'var(--bg)' }}>
      {/* All steps done — show completed state in nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ height: '3px', background: 'var(--green)' }} />
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem',
          height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ height: '40px', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block' }} />
            </div>
          </a>
          <span className="badge-green">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Claim ingediend
          </span>
        </div>
      </div>

      <div className="container pt-12 pb-10">
        {/* Success */}
        <div className="text-center mb-8 animate-fade-in">
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.25rem',
              background: 'var(--green-dim)',
              border: '2px solid var(--green-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M7 16l6 6 12-12" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-sora)' }}>
            Claim ingediend, {firstName}!
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-sub)' }}>
            Wij gaan voor jou aan de slag bij <strong style={{ color: 'var(--text)' }}>{airline.name}</strong>.
            Je ontvangt een bevestiging op <strong style={{ color: 'var(--text)' }}>{email}</strong>.
          </p>
        </div>

        {/* Invoice notice */}
        <div className="card-orange mb-5 animate-fade-in">
          <div className="flex items-start gap-3">
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,107,43,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M5 3h10a1 1 0 0 1 1 1v13l-2-1.5L12 17l-2-1.5L8 17l-2-1.5L4 17V4a1 1 0 0 1 1-1z" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8h4M8 11h3" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-1 text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
                Factuur van €42 volgt binnen 24 uur
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                Na betaling dienen wij de claim formeel in bij {airline.name}.
                Bij succes ontvangen wij ook 10% van het uitgekeerde bedrag.
              </p>
            </div>
          </div>
        </div>

        {/* Claim summary */}
        <div className="card mb-5 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-sora)' }}>Jouw claim</p>
            <span className="badge-green">✓ Ingediend</span>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Vlucht</span>
              <span className="font-medium">{flight.flightNumber} · {airline.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Passagiers</span>
              <span className="font-medium">{passengers}</span>
            </div>
            <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Compensatierecht</span>
              <span className="font-bold text-base" style={{ color: 'var(--green)' }}>{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card mb-5 animate-fade-in">
          <p className="font-semibold mb-4 text-sm" style={{ fontFamily: 'var(--font-sora)' }}>Wat er nu gaat gebeuren</p>
          <div className="flex flex-col">
            {timelineSteps.map((ts, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                      background: ts.active ? 'var(--blue)' : 'var(--bg)',
                      border: `1.5px solid ${ts.active ? 'var(--blue)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700,
                      color: ts.active ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div style={{ width: '1px', flex: 1, margin: '3px 0', background: 'var(--border)', minHeight: '20px' }} />
                  )}
                </div>
                <div style={{ paddingBottom: '1.25rem', flex: 1 }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: ts.active ? 'var(--blue)' : 'var(--text-muted)' }}>
                    {ts.label}
                  </p>
                  <p className="text-sm" style={{ color: ts.active ? 'var(--text)' : 'var(--text-sub)' }}>
                    {ts.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="card-green animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green-dim)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 7V4M10 4C10 4 8.5 2 7 2s-2.5 1-2.5 2S6 6 10 4zM10 4c0 0 1.5-2 3-2s2.5 1 2.5 2-1.5 2-5.5 0z" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="7" width="14" height="3" rx="1" stroke="var(--green)" strokeWidth="1.5" />
                <path d="M4 10v8h12v-8" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 10v8" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-1 text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
                Deel met vrienden — zij besparen €10
              </p>
              <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
                Vrienden betalen slechts €32 voor hun claim via jouw link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl mb-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
              {referralUrl}
            </p>
            <button onClick={copyReferral}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                background: copied ? 'var(--green)' : 'var(--border)',
                color: copied ? 'white' : 'var(--text-sub)',
                border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
              }}>
              {copied ? '✓ Gekopieerd' : 'Kopieer'}
            </button>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Heb jij ook vluchtvertraging? Check gratis: ${referralUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '0.625rem',
                borderRadius: '8px', fontWeight: 700, background: '#25D366',
                color: 'white', textDecoration: 'none',
              }}
            >
              WhatsApp
            </a>
            <a
              href={`mailto:?subject=Heb jij vluchtvertraging?&body=Check Aerefund.nl: ${referralUrl}`}
              style={{
                flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '0.625rem',
                borderRadius: '8px', fontWeight: 700, background: 'var(--surface)',
                color: 'var(--text-sub)', textDecoration: 'none',
                border: '1.5px solid var(--border)',
              }}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
