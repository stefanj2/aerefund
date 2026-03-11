'use client'

// Shared nav for all funnel pages — matches homepage header style
// step 1=Selecteer, 2=Laden/Check, 3=Uitkomst/Aanbod, 4=Formulier/Gegevens

const STEPS = [
  { label: 'Vlucht',   short: '1' },
  { label: 'Check',    short: '2' },
  { label: 'Aanbod',   short: '3' },
  { label: 'Gegevens', short: '4' },
]

type FlightInfo = {
  number: string
  airline: string
  amount?: string
}

type Props = {
  step: 1 | 2 | 3 | 4
  progress?: number   // 0-100 override for the progress line (optional)
  flightInfo?: FlightInfo
  badge?: React.ReactNode
}

function timeLeft(pct: number): string {
  if (pct <= 17) return 'nog ~2 min'
  if (pct <= 33) return 'nog ~1½ min'
  if (pct <= 50) return 'nog ~1 min'
  if (pct <= 75) return 'nog ~30 sec'
  return ''
}

export default function FunnelNav({ step, progress, flightInfo, badge }: Props) {
  const pct = progress !== undefined ? progress : (step / 4) * 100
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 12px rgba(15,30,61,0.06)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Progress accent line */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, var(--blue) 0%, var(--blue) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`,
        transition: 'all 0.4s ease',
      }} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem',
        height: '56px', display: 'flex', alignItems: 'center', gap: '1.25rem',
      }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ height: '40px', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block' }} />
          </div>
        </a>

        {/* Stepper */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => {
              const num = i + 1
              const isActive = num === step
              const isDone = num < step
              const isUpcoming = num > step
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {/* Step circle */}
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--blue)' : isActive ? 'var(--blue)' : 'transparent',
                      border: isDone || isActive ? '2px solid var(--blue)' : '2px solid var(--border)',
                      transition: 'all 0.25s',
                      animation: isActive ? 'stepPulse 2s ease-in-out infinite' : 'none',
                    }}>
                      {isDone ? (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 800, lineHeight: 1,
                          color: isActive ? '#fff' : 'var(--text-muted)',
                          fontFamily: 'var(--font-sora)',
                        }}>
                          {num}
                        </span>
                      )}
                    </div>

                    {/* Label — visible on sm+ */}
                    <span className="step-label" style={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text)' : 'var(--text-muted)',
                      opacity: isUpcoming ? 0.5 : 1,
                    }}>
                      {s.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: '2rem', height: '1.5px', margin: '0 0.375rem',
                      background: num < step ? 'var(--blue)' : 'var(--border)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {badge}
          {flightInfo ? (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.675rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.25 }}>
                {flightInfo.number} · {flightInfo.airline}
              </p>
              {flightInfo.amount && (
                <p style={{
                  fontSize: '0.875rem', fontWeight: 700, margin: 0, lineHeight: 1.25,
                  color: 'var(--green)', fontFamily: 'var(--font-sora)',
                }}>
                  {flightInfo.amount}
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {timeLeft(pct) && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, color: 'var(--blue)',
                  background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
                  borderRadius: '20px', padding: '0.2rem 0.625rem',
                  transition: 'all 0.3s ease',
                }}>
                  {timeLeft(pct)}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="1.5" y="5.5" width="10" height="6" rx="1.5" stroke="var(--green)" strokeWidth="1.2" />
                  <path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="var(--green)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>SSL</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 440px) {
          .step-label { display: none !important; }
        }
      `}</style>
    </header>
  )
}
