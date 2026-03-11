import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AnalyseForm from '@/components/AnalyseForm'
import SiteNav from '@/components/SiteNav'
import { AIRLINES } from '@/lib/airlines'
import {
  IATA_TO_SLUG,
  getIataFromSlug,
  getFlightRecords,
  getAirlineFaqs,
} from '@/lib/airline-page-data'
import { getReviewsForAirline } from '@/data/reviews'

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.values(IATA_TO_SLUG).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const iata = getIataFromSlug(slug)
  if (!iata) return { title: 'Airline niet gevonden' }
  const cfg = AIRLINES[iata]

  return {
    title: `${cfg.name} vlucht vertraagd? Claim tot €600 compensatie`,
    description: `${cfg.name} vliegtuig vertraagd of geannuleerd? Aerefund haalt jouw EC 261-compensatie op. ${cfg.successRate}% slagingskans, gemiddeld binnen ${cfg.avgPaymentWeeks} weken. Gratis check, €42 pas bij indiening.`,
    alternates: {
      canonical: `https://aerefund.com/airlines/${slug}`,
    },
    openGraph: {
      title: `${cfg.name} vlucht vertraagd? Claim tot €600`,
      description: `Aerefund haalt jouw ${cfg.name} compensatie op. ${cfg.successRate}% slagingskans.`,
      url: `https://aerefund.com/airlines/${slug}`,
    },
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const map = {
    easy:   { label: 'Relatief makkelijk', color: '#15803d', bg: 'rgba(21,128,61,0.08)', border: 'rgba(21,128,61,0.22)' },
    medium: { label: 'Gemiddeld',          color: '#b45309', bg: 'rgba(180,83,9,0.08)',  border: 'rgba(180,83,9,0.22)' },
    hard:   { label: 'Uitdagend',          color: '#dc2626', bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.22)' },
  }
  const s = map[level]
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      {s.label}
    </span>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.875rem', letterSpacing: '1px' }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AirlinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const iata = getIataFromSlug(slug)
  if (!iata) notFound()

  const cfg     = AIRLINES[iata]
  const flights = getFlightRecords(iata)
  const faqs    = getAirlineFaqs(iata)
  const reviews = getReviewsForAirline(iata).slice(0, 2)

  const accentColor = cfg.color ?? '#1a56db'
  // Derive a readable text color for the accent (white for dark, dark for light)
  const accentIsLight = parseInt(accentColor.replace('#', ''), 16) > 0xaaaaaa
  const accentText = accentIsLight ? '#0f1e3d' : '#ffffff'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Aerefund</a>
            <span style={{ margin: '0 0.4rem' }}>›</span>
            <a href="/airlines" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Airlines</a>
            <span style={{ margin: '0 0.4rem' }}>›</span>
            <span style={{ color: 'var(--text-sub)' }}>{cfg.name}</span>
          </nav>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)',
            gap: '3rem',
            alignItems: 'start',
          }}
            className="hero-grid"
          >
            {/* Left: copy */}
            <div>
              {/* Airline pill */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '4px 14px 4px 6px',
                  borderRadius: '999px',
                  background: accentColor,
                  color: accentText,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                  }}>
                    {iata}
                  </span>
                  {cfg.fullName}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-sora)',
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                lineHeight: 1.15,
                color: 'var(--text)',
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}>
                {cfg.name} vlucht vertraagd of geannuleerd?<br />
                <span style={{ color: 'var(--blue)' }}>Claim tot €600 compensatie.</span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-sub)',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
                maxWidth: '520px',
              }}>
                {cfg.name} is jou compensatie verschuldigd onder EU-richtlijn EC&nbsp;261/2004.
                Wij halen dat geld voor jou op — gratis check, €42 pas bij indiening.
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                <StatPill
                  value={`${cfg.successRate}%`}
                  label="slagingskans"
                  color="var(--green)"
                  bg="rgba(21,128,61,0.08)"
                  border="rgba(21,128,61,0.22)"
                />
                <StatPill
                  value={`~${cfg.avgPaymentWeeks} weken`}
                  label="gemiddelde uitbetaling"
                  color="var(--blue)"
                  bg="var(--blue-light)"
                  border="var(--blue-border)"
                />
                <StatPill
                  value="€0 vooraf"
                  label="geen risico"
                  color="var(--text-sub)"
                  bg="var(--section-alt)"
                  border="var(--border)"
                />
              </div>

              {/* Difficulty info */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke={accentText} strokeWidth="1.5"/>
                    <path d="M8 5v4M8 11v.5" stroke={accentText} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>
                      {cfg.name} — claimmoeilijkheid
                    </span>
                    <DifficultyBadge level={cfg.claimDifficulty} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                    {cfg.difficultyNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div id="check" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '80px',
            }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '0.4rem',
                }}>
                  Gratis vluchtcheck
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-sora)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: 'var(--text)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}>
                  Controleer jouw {cfg.name} vlucht
                </h2>
              </div>
              <AnalyseForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── USP strip ────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--navy)', padding: '2.25rem 0' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}
            className="usp-grid"
          >
            {[
              {
                icon: '⚖️',
                title: 'EC 261/2004 expert',
                desc: `Wij kennen de exacte gronden waarop ${cfg.name} claims afwijst — en hoe we dat doorbreken.`,
              },
              {
                icon: '💶',
                title: 'Pas betalen bij indiening',
                desc: 'Geen verborgen kosten. €42 vaste vergoeding bij indiening, 10% bij uitbetaling.',
              },
              {
                icon: '📋',
                title: 'Volledige ontzorging',
                desc: 'Jij hoeft niets te doen. Wij schrijven de juridische brieven, volgen op en onderhandelen.',
              },
            ].map((usp) => (
              <div key={usp.title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}>
                  {usp.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9rem', color: '#fff', margin: '0 0 0.3rem' }}>
                    {usp.title}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.55 }}>
                    {usp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent flights table ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '0.5rem',
            }}>
              Recente vertragingen
            </span>
            <h2 style={{
              fontFamily: 'var(--font-sora)',
              fontWeight: 800,
              fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {cfg.name} vluchten waarvoor passagiers compensatie kregen
            </h2>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                <thead>
                  <tr style={{ background: 'var(--section-alt)', borderBottom: '1px solid var(--border)' }}>
                    {['Datum', 'Vlucht', 'Route', 'Vertraging', 'Compensatie', 'Actie'].map((h) => (
                      <th key={h} style={{
                        padding: '0.75rem 1.1rem',
                        textAlign: 'left',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flights.map((f, i) => (
                    <tr key={i} style={{
                      borderBottom: i < flights.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.1s',
                    }}>
                      <td style={{ padding: '0.875rem 1.1rem', fontSize: '0.825rem', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>
                        {f.date}
                      </td>
                      <td style={{ padding: '0.875rem 1.1rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-sora)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'var(--text)',
                          letterSpacing: '0.02em',
                        }}>
                          {f.flightNumber}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.1rem', fontSize: '0.825rem', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                        {f.route}
                      </td>
                      <td style={{ padding: '0.875rem 1.1rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#dc2626',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle cx="5" cy="5" r="4" fill="rgba(220,38,38,0.12)"/>
                            <path d="M5 3v2.5l1.5 1" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          {f.delay}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.1rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-sora)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: 'var(--green)',
                        }}>
                          €{f.compensation}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.1rem' }}>
                        <a
                          href="#check"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '0.35rem 0.875rem',
                            borderRadius: '8px',
                            background: 'var(--blue)',
                            color: '#fff',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.01em',
                          }}
                        >
                          Claim {f.flightNumber} →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ marginTop: '0.875rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            *Het getoonde bedrag is de wettelijke compensatie per persoon onder EC 261/2004.
            De daadwerkelijke toekenning hangt af van de vluchtomstandigheden en de oorzaak van de vertraging.
            Historische vluchten zijn illustratief.
          </p>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section style={{ background: 'var(--section-alt)', padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
          <div className="container-wide">
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '0.5rem',
              }}>
                Klantbeoordelingen
              </span>
              <h2 style={{
                fontFamily: 'var(--font-sora)',
                fontWeight: 800,
                fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                color: 'var(--text)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Wat klanten zeggen over hun {cfg.name}-claim
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {reviews.map((r, i) => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', margin: '0 0 2px' }}>
                        {r.author}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        {r.location} · {r.date}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Stars n={r.rating} />
                      <p style={{
                        fontFamily: 'var(--font-sora)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: 'var(--green)',
                        margin: '2px 0 0',
                      }}>
                        €{r.amount.toLocaleString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.65, margin: 0 }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '0.5rem',
            }}>
              Veelgestelde vragen
            </span>
            <h2 style={{
              fontFamily: 'var(--font-sora)',
              fontWeight: 800,
              fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Alles over {cfg.name}-claims
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {faqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <summary style={{
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: 'var(--text)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  userSelect: 'none',
                }}>
                  <span>{faq.q}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0, opacity: 0.45 }}
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div style={{
                  padding: '0 1.25rem 1.125rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-sub)',
                  lineHeight: 1.7,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.875rem',
                }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--navy)',
        padding: '3.5rem 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <p style={{
            fontFamily: 'var(--font-sora)',
            fontWeight: 800,
            fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
            color: '#fff',
            margin: '0 0 0.75rem',
            letterSpacing: '-0.025em',
          }}>
            Weet niet zeker of jouw {cfg.name} vlucht in aanmerking komt?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Doe de gratis check — geen account, geen creditcard, geen verplichtingen.
          </p>
          <a
            href="#check"
            className="btn-primary-lg"
            style={{ display: 'inline-block' }}
          >
            Check mijn vlucht — gratis →
          </a>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            Alleen €42 bij indiening · 10% commissie bij uitbetaling · Geen kosten vooraf
          </p>
        </div>
      </section>

      {/* ── Responsive styles ────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .usp-grid {
            grid-template-columns: 1fr !important;
          }
          details summary {
            font-size: 0.85rem !important;
          }
        }
        details[open] > summary svg {
          transform: rotate(180deg);
        }
        details summary svg {
          transition: transform 0.2s;
        }
        tr:hover td {
          background: var(--section-alt);
        }
      `}</style>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({
  value, label, color, bg, border,
}: {
  value: string
  label: string
  color: string
  bg: string
  border: string
}) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      background: bg,
      border: `1px solid ${border}`,
    }}>
      <span style={{
        fontFamily: 'var(--font-sora)',
        fontWeight: 800,
        fontSize: '1.1rem',
        color,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
        {label}
      </span>
    </div>
  )
}
