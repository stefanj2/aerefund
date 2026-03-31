import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Passagiersrechten',
  alternates: { canonical: 'https://aerefund.com/passagiersrechten' },
  description: 'Alles over jouw rechten als passagier op basis van EU-verordening EC 261/2004. Wanneer heb je recht op compensatie bij vertraging, annulering of overboeking?',
}

const RIGHTS = [
  {
    num: '01',
    title: 'Vertraging van 3+ uur',
    sub: 'Aankomsttijd — niet vertrekttijd',
    desc: 'Als je vlucht meer dan 3 uur vertraagd aankomt op de eindbestemming heb je recht op compensatie. De wet kijkt naar de aankomsttijd.',
    amount: '€250 – €600',
  },
  {
    num: '02',
    title: 'Geannuleerde vlucht',
    sub: 'Minder dan 14 dagen van tevoren',
    desc: 'Annulering met minder dan 14 dagen notice geeft recht op compensatie én keuze: terugbetaling of omboeken op een alternatieve vlucht.',
    amount: '€250 – €600',
  },
  {
    num: '03',
    title: 'Instapweigering',
    sub: 'Overboeking of denied boarding',
    desc: 'Tijdig aanwezig met geldige boeking maar toch geweigerd? Dan heb je direct recht op compensatie — en de airline moet alternatief vervoer regelen.',
    amount: '€250 – €600',
  },
  {
    num: '04',
    title: 'Gemiste aansluiting',
    sub: 'Door vertraging op heenvlucht',
    desc: 'Eerste vlucht vertraagd waardoor je de aansluitende vlucht mist én je eindbestemming 3+ uur later bereikt? Ook dan geldt de compensatieverplichting.',
    amount: '€250 – €600',
  },
]

const AMOUNTS = [
  {
    amount: '€250',
    km: 'Vlucht tot 1.500 km',
    examples: 'AMS → LHR · AMS → BCN · AMS → BRU',
    accentColor: '#1a56db',
    bgColor: 'rgba(26,86,219,0.04)',
  },
  {
    amount: '€400',
    km: 'Vlucht 1.500 – 3.500 km',
    examples: 'AMS → ATH · AMS → DXB · AMS → CAI',
    accentColor: '#0f1e3d',
    bgColor: 'rgba(15,30,61,0.03)',
    featured: true,
  },
  {
    amount: '€600',
    km: 'Vlucht boven 3.500 km',
    examples: 'AMS → JFK · AMS → BKK · AMS → DXB',
    accentColor: '#15803d',
    bgColor: 'rgba(21,128,61,0.05)',
  },
]

const CHECKLIST = [
  { label: 'Vlucht vertrekt vanuit een EU-luchthaven (ongeacht de airline)', or: false },
  { label: 'Vlucht landt in de EU én de airline heeft een EU-vergunning', or: true },
  { label: 'Aankomst is 3 uur of meer te laat op de eindbestemming', or: false },
  { label: 'Vertraging niet door buitengewone omstandigheden', or: false },
  { label: 'Vlucht vond plaats na 17 februari 2005', or: false },
  { label: 'Je had een bevestigde boeking en was tijdig aanwezig', or: false },
]

const EXCEPTIONS = [
  { label: 'Extreme weersomstandigheden', detail: 'Storm, ijzel, dichte mist, bliksem' },
  { label: 'Politieke instabiliteit', detail: 'Beveiligingsrisico\'s, luchtruimsluiting' },
  { label: 'ATC-staking', detail: 'Staking luchtverkeersleidingsmedewerkers' },
  { label: 'Medisch noodgeval aan boord', detail: 'Directe veiligheidsbedreiging' },
  { label: 'Verborgen fabricagefout vliegtuig', detail: 'Niet voorzienbare technische mankement' },
]

export default function PassagiersrechtenPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />

      {/* ── Hero — zelfde stijl als homepage ──────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '560px', background: '#f0f4fa' }}>

        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=85&w=1600&auto=format&fit=crop&crop=focalpoint&fp-x=0.7&fp-y=0.5"
          alt="Passagiers op luchthaven"
          fill
          style={{ objectFit: 'cover', objectPosition: 'right center' }}
          priority
        />

        {/* Left-to-right gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(100deg, #fff 0%, #fff 38%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.55) 65%, rgba(255,255,255,0.1) 80%, transparent 100%)',
        }} />

        {/* Content */}
        <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '580px', padding: '5rem 0 5.5rem' }}>

            {/* Breadcrumb */}
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--blue)' }}>Aerefund.</strong>{' '}
              <strong style={{ color: 'var(--text)' }}>Passagiersrechten</strong>{' '}
              <span style={{ color: 'var(--text-sub)' }}>·</span>{' '}
              <strong style={{ color: 'var(--text)' }}>EU-verordening EC 261/2004</strong>
            </p>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-sora)', fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1, color: 'var(--navy)',
              marginBottom: '1rem',
            }}>
              Wist je dat de EU jou<br />beschermt als passagier?
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Bij vertraging, annulering of overboeking heb je wettelijk recht op{' '}
              <strong style={{ color: 'var(--text)' }}>tot €600 compensatie</strong> per persoon.
              Op deze pagina lees je precies wanneer, hoeveel en hoe je dat claimt.
            </p>

            {/* CTA */}
            <Link href="/#form" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              padding: '0.75rem 1.75rem', borderRadius: '8px', textDecoration: 'none',
              marginBottom: '2rem',
            }}>
              Check of mijn vlucht in aanmerking komt
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1.5rem' }}>
              {[
                'Geldig in alle 27 EU-landen',
                'Van kracht sinds 2005',
                'Tot 3 jaar terug te claimen',
              ].map((text) => (
                <span key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.875rem', color: 'var(--text-sub)', fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--blue)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {text}
                </span>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 4 Situaties ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)', marginBottom: '0.625rem' }}>
              Wanneer heb je recht op compensatie?
            </p>
            <h2 style={{
              fontFamily: 'var(--font-sora)', fontWeight: 900,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--navy)',
              lineHeight: 1.15, margin: 0,
            }}>
              4 situaties waarbij de airline<br />verplicht is te betalen
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RIGHTS.map((r, i) => (
              <div key={r.num} style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: '0 2rem',
                alignItems: 'start',
                paddingTop: i === 0 ? '0' : '2.5rem',
                paddingBottom: '2.5rem',
                borderBottom: i < RIGHTS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Number */}
                <div style={{
                  fontFamily: 'var(--font-sora)', fontWeight: 900,
                  fontSize: '3rem', color: 'var(--border)',
                  lineHeight: 1, letterSpacing: '-0.04em',
                  userSelect: 'none',
                }}>
                  {r.num}
                </div>

                {/* Content */}
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                    {r.sub}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-sora)', fontWeight: 800,
                    fontSize: '1.125rem', color: 'var(--navy)',
                    margin: '0 0 0.75rem', lineHeight: 1.2,
                  }}>
                    {r.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>
                    {r.desc}
                  </p>
                </div>

                {/* Amount badge */}
                <div style={{
                  background: 'rgba(21,128,61,0.08)',
                  border: '1.5px solid rgba(21,128,61,0.2)',
                  borderRadius: '10px',
                  padding: '0.625rem 1rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '1rem', color: '#15803d', margin: '0 0 0.1rem', lineHeight: 1 }}>
                    {r.amount}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: '#15803d', opacity: 0.7, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    per persoon
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compensatiebedragen ───────────────────────────────────────────────── */}
      <section style={{ background: '#f4f6fb', padding: '5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)', marginBottom: '0.625rem' }}>
              Hoeveel heb ik recht op?
            </p>
            <h2 style={{
              fontFamily: 'var(--font-sora)', fontWeight: 900,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--navy)',
              lineHeight: 1.15, margin: 0,
            }}>
              Compensatiebedrag hangt af van<br />de afstand van je vlucht
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {AMOUNTS.map((a) => (
              <div key={a.amount} style={{
                background: a.featured ? '#fff' : '#fff',
                border: `1px solid ${a.featured ? 'var(--navy)' : 'var(--border)'}`,
                borderTop: `4px solid ${a.accentColor}`,
                borderRadius: '14px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: a.featured ? '0 8px 32px rgba(15,30,61,0.12)' : '0 1px 4px rgba(15,30,61,0.05)',
                position: 'relative',
              }}>
                {a.featured && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--navy)', color: '#fff',
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '0.25rem 0.75rem', borderRadius: '100px',
                    whiteSpace: 'nowrap',
                  }}>
                    Meest voorkomend
                  </div>
                )}
                <p style={{
                  fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem',
                }}>
                  {a.km}
                </p>
                <p style={{
                  fontFamily: 'var(--font-sora)', fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                  color: a.accentColor,
                  margin: '0 0 0.5rem', lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}>
                  {a.amount}
                </p>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 500,
                  color: 'var(--text-muted)', lineHeight: 1.6, margin: 0,
                }}>
                  {a.examples}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.6 }}>
            * Bij vluchten buiten de EU boven de 3.500 km kan de airline de compensatie halveren naar €300 als je maximaal 4 uur later aankomt op een alternatieve vlucht.
          </p>
        </div>
      </section>

      {/* ── Checklist & uitzonderingen ────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

            {/* Checklist */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--blue)', marginBottom: '0.625rem' }}>
                Kom ik in aanmerking?
              </p>
              <h2 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 900,
                fontSize: '1.375rem', color: 'var(--navy)',
                lineHeight: 1.2, marginBottom: '2rem',
              }}>
                Checklist EC 261/2004
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {CHECKLIST.map((item, i) => (
                  <div key={i}>
                    {item.or && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>of</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                      </div>
                    )}
                    <div style={{
                      display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                      padding: '0.875rem 0',
                      borderBottom: i < CHECKLIST.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'rgba(21,128,61,0.1)',
                        border: '1.5px solid rgba(21,128,61,0.25)',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: '1px',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.55, margin: 0 }}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exceptions */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b45309', marginBottom: '0.625rem' }}>
                Wanneer geldt het niet?
              </p>
              <h2 style={{
                fontFamily: 'var(--font-sora)', fontWeight: 900,
                fontSize: '1.375rem', color: 'var(--navy)',
                lineHeight: 1.2, marginBottom: '2rem',
              }}>
                Buitengewone omstandigheden
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {EXCEPTIONS.map((ex, i) => (
                  <div key={i} style={{
                    background: 'rgba(249,115,22,0.05)',
                    border: '1px solid rgba(249,115,22,0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                  }}>
                    <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', margin: '0 0 0.15rem' }}>
                      {ex.label}
                    </p>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
                      {ex.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{
                background: 'rgba(21,128,61,0.07)',
                border: '1.5px solid rgba(21,128,61,0.2)',
                borderRadius: '12px',
                padding: '1rem 1.125rem',
              }}>
                <p style={{ fontSize: '0.8375rem', color: '#15803d', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                  <strong>Belangrijk:</strong> Airlines roepen dit argument regelmatig <em>onterecht</em> in. Technische mankementen en personeelstekort zijn bijna nooit buitengewone omstandigheden. Wij beoordelen je claim gratis.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>
            Gratis check — geen risico
          </p>
          <h2 style={{
            fontFamily: 'var(--font-sora)', fontWeight: 900,
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem',
          }}>
            Denk je recht te hebben op compensatie?
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '440px', margin: '0 auto 2.5rem' }}>
            Check het in 2 minuten. Wij dienen de claim in, voeren de correspondentie en handelen bezwaren af. Jij hoeft niets te doen.
          </p>
          <Link href="/#form" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
            background: '#f97316', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.0625rem',
            padding: '1rem 2.25rem', borderRadius: '12px', textDecoration: 'none',
            boxShadow: '0 0 0 4px rgba(249,115,22,0.25), 0 8px 32px rgba(249,115,22,0.35)',
          }}>
            Check mijn vlucht — gratis
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '1.25rem' }}>
            €42 bij indiening · 25% commissie bij succes · geen win, geen kosten
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--navy)', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>© 2026 Aerefund.com</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/faq" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>FAQ</Link>
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/algemene-voorwaarden" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Voorwaarden</Link>
            <Link href="/contact" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
