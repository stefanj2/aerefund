'use client'

import { useState } from 'react'

// Right-side conversion sidebar for funnel pages
// Each step shows content relevant to the user's current concern

type AirlineInfo = {
  name: string
  successRate: number
  avgPaymentWeeks: number
  claimDifficulty: 'easy' | 'medium' | 'hard'
}

type Props = {
  step: 1 | 3 | 4
  airline?: AirlineInfo
  review?: { name: string; quote: string }
}

function SideSection({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-card)',
      marginBottom: '0.875rem',
    }}>
      {children}
    </div>
  )
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.875rem',
    }}>
      {children}
    </p>
  )
}

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{
          border: '1px solid var(--border)',
          borderRadius: '10px',
          overflow: 'hidden',
          background: open === i ? 'var(--section-alt)' : '#fff',
          transition: 'background 0.2s',
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '0.5rem', padding: '0.625rem 0.875rem',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-sora)', lineHeight: 1.4 }}>
              {item.q}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{
                flexShrink: 0,
                transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                color: 'var(--text-muted)',
              }}
            >
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {open === i && (
            <div style={{ padding: '0 0.875rem 0.75rem' }}>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', lineHeight: 1.65, margin: 0 }}>
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
        background: 'var(--blue)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>{children}</span>
    </div>
  )
}

// ── Step 1: Selecteer (vlucht kiezen) ──────────────────────────────────────
function Step1Sidebar() {
  return (
    <>
      {/* How it works */}
      <SideSection>
        <SideLabel>Zo werkt het</SideLabel>
        {[
          { num: '1', title: 'Gratis check', desc: 'Vul je vluchtnummer in en zie direct of je recht hebt op compensatie.' },
          { num: '2', title: 'Wij dienen in', desc: 'Na betaling van €42 sturen wij de formele claimbrief naar de airline.' },
          { num: '3', title: 'Geld ontvangen', desc: 'De compensatie wordt rechtstreeks naar jou overgemaakt.' },
        ].map((s) => (
          <div key={s.num} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--blue-light)', border: '1px solid var(--blue-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 800, color: 'var(--blue)',
              fontFamily: 'var(--font-sora)',
            }}>
              {s.num}
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.15rem', fontFamily: 'var(--font-sora)' }}>{s.title}</p>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </SideSection>

      {/* Free & no obligation */}
      <SideSection>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: 'var(--green-dim)', border: '1px solid var(--green-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3 6-6" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem', fontFamily: 'var(--font-sora)' }}>
              Gratis en vrijblijvend
            </p>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', lineHeight: 1.55, margin: 0 }}>
              De check kost niets. Je beslist zelf of je de claim wilt indienen.
            </p>
          </div>
        </div>
      </SideSection>

      {/* Stats */}
      <SideSection>
        <SideLabel>Waarom Aerefund</SideLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {[
            { value: '87%', label: 'gemiddelde slagingskans' },
            { value: '€42', label: 'vaste kosten na indiening' },
            { value: '2 min', label: 'om te beginnen' },
            { value: '100%', label: 'no cure no pay risico' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'var(--section-alt)', borderRadius: '10px', padding: '0.625rem 0.75rem',
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue)', fontFamily: 'var(--font-sora)', margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.35 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </SideSection>

      {/* SSL trust */}
      <TrustBadges />
    </>
  )
}

// ── Step 3: Uitkomst (claim aanbod) ────────────────────────────────────────
function Step3Sidebar({ airline, review }: { airline?: AirlineInfo; review?: { name: string; quote: string } }) {
  const airlineName = airline?.name ?? 'de airline'
  const successRate = airline?.successRate ?? 87
  const avgWeeks = airline?.avgPaymentWeeks ?? 8
  const difficulty = airline?.claimDifficulty ?? 'medium'

  const difficultyLabel = difficulty === 'easy' ? 'Makkelijk' : difficulty === 'medium' ? 'Gemiddeld' : 'Moeilijk'
  const difficultyColor = difficulty === 'easy' ? 'var(--green)' : difficulty === 'medium' ? 'var(--blue)' : 'var(--orange)'
  const difficultyBg = difficulty === 'easy' ? 'var(--green-dim)' : difficulty === 'medium' ? 'var(--blue-light)' : 'rgba(255,107,43,0.1)'
  const difficultyBorder = difficulty === 'easy' ? 'var(--green-border)' : difficulty === 'medium' ? 'var(--blue-border)' : 'rgba(255,107,43,0.25)'
  const difficultyNote = difficulty === 'hard'
    ? `${airlineName} staat bekend om het uitstellen van uitbetaling. Een formele claimbrief via Aerefund verhoogt je kans aanzienlijk.`
    : difficulty === 'easy'
    ? `${airlineName} betaalt doorgaans snel en zonder gedoe zodra een formele claim wordt ingediend.`
    : `${airlineName} reageert normaal gesproken binnen de wettelijke termijn als de claim correct is ingediend.`

  return (
    <>
      {/* Airline success stat */}
      <SideSection>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <SideLabel>Claim bij {airlineName}</SideLabel>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '5px',
            background: difficultyBg, border: `1px solid ${difficultyBorder}`, color: difficultyColor,
          }}>
            {difficultyLabel}
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.875rem' }}>
          <div style={{ background: 'var(--section-alt)', borderRadius: '10px', padding: '0.75rem' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--blue)', fontFamily: 'var(--font-sora)', margin: 0, lineHeight: 1 }}>
              {successRate}%
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: 1.35 }}>
              slagingskans
            </p>
          </div>
          <div style={{ background: 'var(--section-alt)', borderRadius: '10px', padding: '0.75rem' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)', fontFamily: 'var(--font-sora)', margin: 0, lineHeight: 1 }}>
              {avgWeeks}w
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: 1.35 }}>
              gem. betaaltermijn
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
          {difficultyNote}
        </p>
      </SideSection>

      {/* What happens after submission — timeline */}
      <SideSection>
        <SideLabel>Wat gebeurt er na indiening?</SideLabel>
        {[
          { dot: 'var(--blue)', label: 'Binnen 24 uur', text: 'Claimbrief verstuurd naar ' + airlineName },
          { dot: 'var(--blue)', label: `Week 1–${Math.round(avgWeeks / 2)}`, text: airlineName + ' reageert op onze aanvraag' },
          { dot: 'var(--green)', label: `Week ${Math.round(avgWeeks / 2)}–${avgWeeks}`, text: 'Compensatie overgemaakt naar jouw rekening' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: i < 2 ? '0.5rem' : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.dot, flexShrink: 0, marginTop: '3px' }} />
              {i < 2 && <div style={{ width: '1.5px', flex: 1, background: 'var(--border)', minHeight: '18px', margin: '3px 0' }} />}
            </div>
            <div style={{ paddingBottom: i < 2 ? '0.375rem' : 0 }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.1rem' }}>
                {item.label}
              </p>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </SideSection>

      {/* Customer review */}
      {review && (
        <SideSection>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '3px', flexShrink: 0, alignSelf: 'stretch', minHeight: '3rem',
              background: 'var(--blue)', borderRadius: '2px',
            }} />
            <div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'var(--text-sub)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                &ldquo;{review.quote}&rdquo;
              </p>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                — {review.name}
              </p>
            </div>
          </div>
        </SideSection>
      )}

      {/* No win no fee + FAQ */}
      <SideSection>
        <div style={{
          background: 'var(--green-dim)', border: '1px solid var(--green-border)',
          borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.875rem',
        }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)', margin: '0 0 0.25rem', fontFamily: 'var(--font-sora)' }}>
            ✓ Geen resultaat? Dan betaal je niets extra.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.55 }}>
            De €42 dekt de indieningskosten. Als {airlineName} niet betaalt, rekenen wij geen commissie.
          </p>
        </div>

        <SideLabel>Veelgestelde vragen</SideLabel>

        <FaqAccordion items={[
          {
            q: `Wat als ${airlineName} weigert?`,
            a: `${successRate}% van onze claims wordt uitbetaald. Bij afwijzing gaan wij automatisch in bezwaar — zonder extra kosten voor jou.`,
          },
          {
            q: 'Wat kost het precies?',
            a: `€42 factuur na indiening + 25% commissie bij succesvolle uitbetaling. De check is altijd gratis.`,
          },
          {
            q: 'Hoe lang duurt het?',
            a: `${airlineName} betaalt gemiddeld binnen ${avgWeeks} weken. Jij hoeft niets te doen — wij houden je per email op de hoogte.`,
          },
          {
            q: 'Moet ik zelf iets doen?',
            a: 'Nee. Na het invullen van je gegevens regelen wij alles: de claimbrief, eventueel bezwaar, en de opvolging.',
          },
        ]} />
      </SideSection>

      {/* Urgency: statute of limitations */}
      <div style={{
        background: 'rgba(255,107,43,0.06)', border: '1px solid rgba(255,107,43,0.2)',
        borderRadius: '12px', padding: '0.875rem 1rem', marginBottom: '0.875rem',
        display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
      }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
          <circle cx="8" cy="8" r="6.5" stroke="var(--orange)" strokeWidth="1.4" />
          <path d="M8 5v3.5l2 1.5" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text)' }}>Let op verjaringstermijn.</strong>{' '}
          EC 261-claims verjaren doorgaans na 2–3 jaar. Hoe eerder je indient, hoe groter de kans op uitbetaling.
        </p>
      </div>

      <TrustBadges />
    </>
  )
}

// ── Step 4: Formulier (gegevens invullen) ──────────────────────────────────
function Step4Sidebar() {
  return (
    <>
      {/* What you need */}
      <SideSection>
        <SideLabel>Wat heb je nodig?</SideLabel>
        <CheckRow>Voornaam en achternaam (zoals op je paspoort)</CheckRow>
        <CheckRow>Emailadres voor communicatie en factuur</CheckRow>
        <CheckRow>Boardingpass of boekingsbevestiging (optioneel maar handig)</CheckRow>
        <CheckRow>Gegevens van eventuele medereizgers</CheckRow>
      </SideSection>

      {/* What happens after */}
      <SideSection>
        <SideLabel>Wat gebeurt er daarna?</SideLabel>
        {[
          { label: 'Binnen 24 uur', text: 'Je ontvangt een factuur van €42 per email.' },
          { label: 'Na betaling', text: 'Wij dienen de formele claimbrief in bij de airline.' },
          { label: 'Week 1–2', text: 'De airline heeft 14 dagen om te reageren.' },
          { label: 'Uitbetaling', text: 'Het compensatiebedrag wordt rechtstreeks naar jou overgemaakt.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: i < 3 ? '0.75rem' : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: i === 0 ? 'var(--blue)' : 'var(--border)',
                flexShrink: 0, marginTop: '4px',
              }} />
              {i < 3 && <div style={{ width: '1px', flex: 1, background: 'var(--border)', minHeight: '20px', margin: '3px 0' }} />}
            </div>
            <div style={{ paddingBottom: i < 3 ? '0.5rem' : 0 }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: i === 0 ? 'var(--blue)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.15rem' }}>
                {item.label}
              </p>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </SideSection>

      {/* Security */}
      <SideSection>
        <SideLabel>Jouw gegevens zijn veilig</SideLabel>
        <CheckRow>SSL-versleuteld formulier</CheckRow>
        <CheckRow>AVG/GDPR-conform — jouw data wordt niet verkocht</CheckRow>
        <CheckRow>Gegevens worden alleen gebruikt voor jouw claim</CheckRow>
      </SideSection>

      <TrustBadges />
    </>
  )
}

// ── Shared: trust badges ───────────────────────────────────────────────────
function TrustBadges() {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center',
      padding: '0.25rem 0',
    }}>
      {[
        { icon: (
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
            <rect x="1.5" y="5.5" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ), label: 'SSL beveiligd' },
        { icon: (
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5L8 4.5l3.5.5-2.5 2.5.6 3.5L6.5 9.5 3.4 11l.6-3.5L1.5 5l3.5-.5L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        ), label: '4.8 / 5 beoordeling' },
        { icon: (
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 6.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ), label: 'EC 261/2004 specialist' },
      ].map((b) => (
        <div key={b.label} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
          background: 'var(--section-alt)', borderRadius: '6px', padding: '0.3rem 0.6rem',
        }}>
          {b.icon}
          {b.label}
        </div>
      ))}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function FunnelSidebar({ step, airline, review }: Props) {
  return (
    <aside className="hide-mobile" style={{ position: 'sticky', top: '76px' }}>
      {step === 1 && <Step1Sidebar />}
      {step === 3 && <Step3Sidebar airline={airline} review={review} />}
      {step === 4 && <Step4Sidebar />}
    </aside>
  )
}
