import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import HeroSearchForm from '@/components/HeroSearchForm'
import SiteNav from '@/components/SiteNav'
import { AIRLINES } from '@/lib/airlines'
import {
  IATA_TO_SLUG,
  getIataFromSlug,
  getAirlineFaqs,
  getHeroPhotoUrl,
} from '@/lib/airline-page-data'
import { getAirlineDelays } from '@/lib/airline-delays'
import { getReviewsForAirline } from '@/data/reviews'

// Revalidate every 24 hours so delay data stays fresh
export const revalidate = 86400

// ── Wikipedia photo fetch (runs at build time for SSG) ────────────────────────

async function fetchAirlineWikiPhoto(airlineName: string): Promise<string | null> {
  // Strip legal suffixes for a cleaner search term
  const cleanName = airlineName
    .replace(/\s+(Airlines?|Airways?|Air Lines?|Flugdienst|Corporation|International|Nederland|UK|Hungary)\b/gi, '')
    .trim()

  const queries = [
    `${cleanName} Boeing`,
    `${cleanName} Airbus`,
    `${cleanName} aircraft livery`,
  ]

  for (const q of queries) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=8&prop=imageinfo&iiprop=url|mime|size&format=json&origin=*`
      const res = await fetch(url, { next: { revalidate: 604800 } })
      if (!res.ok) continue
      const data = await res.json()
      const pages = Object.values(
        (data?.query?.pages ?? {}) as Record<string, { imageinfo?: { url: string; mime: string; width?: number }[] }>
      )
      // Pick first wide JPEG (landscape aircraft shot, not logo)
      const photo = pages.find(p => {
        const ii = p.imageinfo?.[0]
        return ii?.mime === 'image/jpeg' && (ii.width ?? 0) >= 800
      })
      if (photo?.imageinfo?.[0]?.url) return photo.imageinfo[0].url
    } catch {
      continue
    }
  }
  return null
}

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
    description: `${cfg.name} vlucht vertraagd of geannuleerd? Aerefund haalt jouw EC 261-compensatie op. ${cfg.successRate}% slagingskans, gemiddeld binnen ${cfg.avgPaymentWeeks} weken. Gratis check, €42 pas bij indiening.`,
    alternates: { canonical: `https://aerefund.com/airlines/${slug}` },
    openGraph: {
      title: `${cfg.name} vlucht vertraagd? Claim tot €600`,
      description: `Aerefund haalt jouw ${cfg.name} compensatie op. ${cfg.successRate}% slagingskans.`,
      url: `https://aerefund.com/airlines/${slug}`,
    },
  }
}

// ── Airplane SVG — generic commercial jet silhouette ─────────────────────────

function AirplaneSVG({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 640 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* ── Fuselage ── */}
      <path
        d="M 68 131 C 88 128 150 125 275 127 L 490 130 C 514 130 530 127 538 121 C 530 120 514 114 490 114 L 275 117 C 150 119 88 116 68 113 Z"
        fill={color}
        opacity={opacity}
      />
      {/* ── Nose ── */}
      <path
        d="M 68 113 C 42 116 22 121 22 122 C 22 123 42 128 68 131 Z"
        fill={color}
        opacity={opacity}
      />
      {/* ── Main wing (bottom) ── */}
      <path
        d="M 248 130 L 118 181 L 152 181 L 268 133 Z"
        fill={color}
        opacity={opacity * 0.92}
      />
      {/* ── Main wing (top) ── */}
      <path
        d="M 248 127 L 118 76 L 152 76 L 268 124 Z"
        fill={color}
        opacity={opacity * 0.92}
      />
      {/* ── Winglet bottom ── */}
      <path
        d="M 118 181 L 108 194 L 120 194 L 152 181 Z"
        fill={color}
        opacity={opacity * 0.75}
      />
      {/* ── Winglet top ── */}
      <path
        d="M 118 76 L 108 63 L 120 63 L 152 76 Z"
        fill={color}
        opacity={opacity * 0.75}
      />
      {/* ── Engine 1 (bottom) ── */}
      <ellipse cx="185" cy="182" rx="36" ry="11" fill={color} opacity={opacity * 0.85} />
      <ellipse cx="185" cy="182" rx="22" ry="7" fill={color} opacity={opacity * 0.55} />
      {/* ── Engine 2 (top) ── */}
      <ellipse cx="185" cy="75" rx="36" ry="11" fill={color} opacity={opacity * 0.85} />
      <ellipse cx="185" cy="75" rx="22" ry="7" fill={color} opacity={opacity * 0.55} />
      {/* ── Vertical stabilizer ── */}
      <path
        d="M 462 114 L 456 76 L 478 76 L 494 114 Z"
        fill={color}
        opacity={opacity}
      />
      {/* ── Horizontal stabilizer (bottom) ── */}
      <path
        d="M 468 130 L 418 154 L 432 154 L 474 132 Z"
        fill={color}
        opacity={opacity * 0.88}
      />
      {/* ── Horizontal stabilizer (top) ── */}
      <path
        d="M 468 114 L 418 90 L 432 90 L 474 112 Z"
        fill={color}
        opacity={opacity * 0.88}
      />
      {/* ── Windows row ── */}
      {[108, 130, 152, 174, 196, 218, 240, 262, 284, 306, 328, 350, 372, 394].map((x, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={121}
          rx={7}
          ry={5}
          fill="rgba(255,255,255,0.55)"
        />
      ))}
      {/* ── Door outlines ── */}
      <rect x="96" y="113" width="14" height="18" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="336" y="113" width="14" height="18" rx="2" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p style={{
      fontSize: '0.68rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.1em',
      color: dark ? 'rgba(255,255,255,0.45)' : 'var(--blue)',
      marginBottom: '0.75rem',
    }}>
      {children}
    </p>
  )
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.8rem', letterSpacing: '1px' }}>
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
  const flights = await getAirlineDelays(iata)
  const faqs    = getAirlineFaqs(iata)
  const reviews = getReviewsForAirline(iata).slice(0, 2)

  const accentColor  = cfg.color ?? '#1a56db'
  const wikiPhoto    = await fetchAirlineWikiPhoto(cfg.fullName ?? cfg.name)
  const heroPhotoUrl = wikiPhoto ?? getHeroPhotoUrl(iata)

  const difficultyMap = {
    easy:   { label: 'Relatief makkelijk', color: '#15803d', bg: 'rgba(21,128,61,0.09)', border: 'rgba(21,128,61,0.25)' },
    medium: { label: 'Gemiddeld',          color: '#b45309', bg: 'rgba(180,83,9,0.09)',  border: 'rgba(180,83,9,0.25)' },
    hard:   { label: 'Uitdagend',          color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)' },
  }
  const diff = difficultyMap[cfg.claimDifficulty]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  // Build timeline story specific to this airline
  const storyWeeks = cfg.avgPaymentWeeks
  const storyAmount = reviews[0]?.amount ?? 400
  const storyTotal = storyAmount * 3 // typical family of 3
  const timeline = [
    { label: 'Dag 1',     text: 'Vluchtdata ingevuld, compensatie berekend', final: false },
    { label: 'Dag 2',     text: `Claim bij ${cfg.name} ingediend`, final: false },
    { label: 'Week 3',    text: cfg.claimDifficulty === 'hard' ? `${cfg.name} weigert — wij sturen bezwaarschrift` : `${cfg.name} erkent de claim`, final: false },
    { label: `Week ${Math.round(storyWeeks * 0.7)}`, text: 'Formele sommatie verstuurd', final: false },
    { label: `Week ${storyWeeks}`, text: `€${storyTotal.toLocaleString('nl-NL')} bijgeschreven`, final: true },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteNav />

      {/* ── Disclaimer banner ─────────────────────────────────────────────── */}
      <div style={{
        background: '#f0f4ff',
        borderBottom: '1px solid #d0daf0',
        padding: '0.6rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-sub)',
        lineHeight: 1.5,
      }}>
        <strong style={{ color: 'var(--navy)' }}>Let op:</strong>{' '}
        Aerefund is een onafhankelijke claimorganisatie en is op geen enkele wijze gelieerd aan, gesponsord door of verbonden met {cfg.name}.
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — full-width airport photo + gradient + airline airplane
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="form"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '640px',
          background: '#e8edf5',
        }}
      >
        {/* Airline aircraft photo */}
        <Image
          src={heroPhotoUrl}
          alt={`${cfg.name} vliegtuig in vlucht`}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          priority
        />

        {/* Airline-color wash on the right — subtle brand tint */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `linear-gradient(100deg, #fff 0%, #fff 38%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.30) 68%, ${accentColor}22 84%, ${accentColor}44 100%)`,
        }} />


        {/* Content */}
        <div className="container-wide" style={{ position: 'relative', zIndex: 3 }}>
          <div style={{ maxWidth: '580px', padding: '4.5rem 0 5rem' }}>

            {/* Breadcrumb */}
            <p style={{ fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--blue)' }}>Aerefund.</strong>{' '}
              <span style={{ color: 'var(--text-sub)' }}>Compensatie voor</span>{' '}
              <strong style={{ color: 'var(--navy)' }}>{cfg.name} vluchten</strong>
            </p>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-sora)',
              fontWeight: 800,
              fontSize: 'clamp(1.875rem, 4vw, 3rem)',
              lineHeight: 1.1,
              color: 'var(--navy)',
              marginBottom: '1rem',
              letterSpacing: '-0.025em',
            }}>
              {cfg.name} vlucht vertraagd<br />
              of geannuleerd?
              <span style={{
                display: 'block',
                color: 'var(--blue)',
                marginTop: '0.1em',
              }}>
                Claim tot €600 per persoon.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '2rem', lineHeight: 1.65, maxWidth: '480px' }}>
              {cfg.name} is jou compensatie verschuldigd onder{' '}
              <strong style={{ color: 'var(--text)' }}>EU-richtlijn EC&nbsp;261/2004</strong>.
              Wij halen dat geld op — gratis check, €42 pas bij indiening.
            </p>

            {/* Search form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <HeroSearchForm />
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              {[
                `${cfg.successRate}% slagingskans`,
                `Gem. ${cfg.avgPaymentWeeks} weken`,
                '€0 kosten vooraf',
              ].map((text) => (
                <span key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.8125rem', color: 'var(--text-sub)', fontWeight: 500,
                }}>
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'var(--blue)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {text}
                </span>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#eef5ff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3.5rem 0' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}
            className="stats-grid"
          >
            {[
              {
                num: `${cfg.successRate}%`,
                label: `Gewonnen ${cfg.name}-claims`,
                note: 'Bij kwalificerende dossiers',
                accent: 'var(--green)',
              },
              {
                num: `~${cfg.avgPaymentWeeks} wk`,
                label: 'Gemiddelde uitbetaling',
                note: 'Na formele indiening',
                accent: 'var(--blue)',
              },
              {
                num: '€600',
                label: 'Max. compensatie p.p.',
                note: 'Op vluchten boven 3.500 km',
                accent: 'var(--navy)',
              },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.75rem',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(15,30,61,0.06)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sora)',
                  fontWeight: 900,
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  color: stat.accent,
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.03em',
                }}>
                  {stat.num}
                </p>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          AIRLINE-SPECIFIC INFO + STORY TIMELINE
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '5.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide" style={{ maxWidth: '860px' }}>

          <SectionLabel>Zo werkt het in de praktijk</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--navy)', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
            Van &ldquo;{cfg.name} reageert niet&rdquo; naar €{storyTotal.toLocaleString('nl-NL')} op de rekening
          </h2>

          {/* Quote */}
          <div style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '1.75rem', marginBottom: '2.5rem' }}>
            <p style={{
              fontFamily: 'var(--font-sora)',
              fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
              fontWeight: 500,
              color: 'var(--navy)',
              lineHeight: 1.75,
              fontStyle: 'italic',
              margin: '0 0 1.25rem',
            }}>
              &ldquo;Ik wist niet eens dat ik recht had op geld. {cfg.name} mailde dat de vertraging
              door &lsquo;buitengewone omstandigheden&rsquo; was. Via een vriendin hoorde ik van Aerefund
              — twee minuten later zag ik dat we recht hadden op €{storyTotal.toLocaleString('nl-NL')}.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.875rem', color: '#fff',
              }}>
                M
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>
                  {reviews[0]?.author ?? 'Marjolein S.'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {flights[0]?.route} · {cfg.name} · {flights[0]?.delay} vertraging
                </p>
              </div>
              <div style={{ marginLeft: 'auto', background: 'var(--green-dim)', border: '1px solid var(--green-border)', borderRadius: '6px', padding: '0.3rem 0.75rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)' }}>
                  ✓ €{storyTotal.toLocaleString('nl-NL')} ontvangen
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '520px' }}>
              {timeline.map((step, i, arr) => (
                <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                        background: step.final ? 'var(--green)' : '#fff',
                        border: step.final ? '2px solid var(--green)' : '2px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {step.final
                          ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : <span style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--text-muted)' }}>{i + 1}</span>
                        }
                      </div>
                      {i < arr.length - 1 && <div style={{ flex: 1, height: '1px', background: 'var(--border)', margin: '0 0.25rem' }} />}
                    </div>
                    <p style={{ fontSize: '0.63rem', fontWeight: 700, color: step.final ? 'var(--green)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>
                      {step.label}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: step.final ? 'var(--navy)' : 'var(--text-sub)', lineHeight: 1.45, margin: 0, fontWeight: step.final ? 700 : 400, paddingRight: '0.5rem' }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Airline difficulty note */}
          <div style={{
            marginTop: '2.5rem',
            background: '#f8faff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: diff.bg, border: `1.5px solid ${diff.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke={diff.color} strokeWidth="1.5"/>
                <path d="M8 5v4M8 11v.5" stroke={diff.color} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>
                  {cfg.name} — hoe moeilijk is claimen?
                </span>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: diff.color,
                  background: diff.bg,
                  border: `1px solid ${diff.border}`,
                }}>
                  {diff.label}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.65 }}>
                {cfg.difficultyNote}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          REPUTATION + TIPS
      ══════════════════════════════════════════════════════════════════════ */}
      {(cfg.reputationNote || cfg.claimTips?.length) && (
        <section style={{ background: '#fff', padding: '5.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-wide" style={{ maxWidth: '860px' }}>

            <SectionLabel>Wat je moet weten</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--navy)', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
              {cfg.name} en EC 261: de realiteit
            </h2>

            {/* Reputation paragraph */}
            {cfg.reputationNote && (
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: cfg.claimTips?.length ? '2.5rem' : 0 }}>
                {cfg.reputationNote}
              </p>
            )}

            {/* Tips */}
            {cfg.claimTips && cfg.claimTips.length > 0 && (
              <div>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  3 tips om jouw {cfg.name}-claim te versterken
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {cfg.claimTips.map((tip, i) => {
                    const [title, ...rest] = tip.split('. ')
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: '1rem', alignItems: 'flex-start',
                        background: '#f8faff',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1.125rem 1.375rem',
                      }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                          background: accentColor + '18',
                          border: `1.5px solid ${accentColor}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.75rem',
                          color: accentColor,
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>
                          <strong style={{ color: 'var(--navy)' }}>{title}.</strong>{' '}
                          {rest.join('. ')}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          RECENT FLIGHTS TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#eef5ff', padding: '5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <SectionLabel>Recente vertragingen</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.35rem, 3vw, 1.875rem)', color: 'var(--navy)', margin: 0, letterSpacing: '-0.02em' }}>
                {cfg.name} vluchten met succesvol uitbetaalde claim
              </h2>
            </div>
            <a href="#form" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem',
              padding: '0.625rem 1.375rem', borderRadius: '8px',
              textDecoration: 'none', boxShadow: '0 2px 12px var(--blue-glow)',
              whiteSpace: 'nowrap',
            }}>
              Check mijn vlucht →
            </a>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 14px rgba(15,30,61,0.07)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '580px' }}>
                <thead>
                  <tr style={{ background: 'var(--section-alt)', borderBottom: '1px solid var(--border)' }}>
                    {['Datum', 'Vlucht', 'Route', 'Vertraging', 'Vergoeding p.p.', 'Claim indienen'].map((h) => (
                      <th key={h} style={{
                        padding: '0.8125rem 1.125rem',
                        textAlign: 'left',
                        fontSize: '0.68rem',
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
                    <tr
                      key={i}
                      style={{ borderBottom: i < flights.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <td style={{ padding: '0.9375rem 1.125rem', fontSize: '0.8125rem', color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>
                        {f.date}
                      </td>
                      <td style={{ padding: '0.9375rem 1.125rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', letterSpacing: '0.02em',
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`https://images.kiwi.com/airlines/64/${iata}.png`} alt="" width={16} height={16} style={{ objectFit: 'contain', borderRadius: '3px' }} />
                          {f.flightNumber}
                        </span>
                      </td>
                      <td style={{ padding: '0.9375rem 1.125rem', fontSize: '0.85rem', color: 'var(--text)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {f.route}
                      </td>
                      <td style={{ padding: '0.9375rem 1.125rem', whiteSpace: 'nowrap' }}>
                        <span className="badge-red">
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.1"/>
                            <path d="M4.5 2.5v2.5l1.5 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                          </svg>
                          {f.delay}
                        </span>
                      </td>
                      <td style={{ padding: '0.9375rem 1.125rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--green)',
                        }}>
                          €{f.compensation}
                        </span>
                      </td>
                      <td style={{ padding: '0.9375rem 1.125rem' }}>
                        <a href="#form" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.375rem 0.9375rem',
                          borderRadius: '7px',
                          background: 'var(--blue-light)',
                          color: 'var(--blue)',
                          fontSize: '0.78rem', fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          border: '1.5px solid var(--blue-border)',
                          transition: 'all 0.15s',
                        }}
                          className="claim-btn"
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

          <p style={{ marginTop: '0.875rem', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            *Wettelijke vergoeding per persoon onder EC 261/2004. Historische vluchten zijn illustratief — daadwerkelijke toekenning hangt af van vluchtomstandigheden.
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section style={{ background: '#fff', padding: '5.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-wide" style={{ maxWidth: '900px' }}>

            <SectionLabel>Klantbeoordelingen</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--navy)', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
              Wat klanten zeggen over hun {cfg.name}-claim
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {reviews.map((r, i) => (
                <div key={i} className="why-card">
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.875rem', color: '#fff',
                      }}>
                        {r.author[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>
                          {r.author}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '1px 0 0' }}>
                          {r.location} · {r.date}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Stars n={r.rating} />
                      <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--green)', margin: '2px 0 0' }}>
                        +€{r.amount.toLocaleString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.7, margin: 0, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#eef5ff', padding: '5.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}>

          <SectionLabel>Veelgestelde vragen</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--navy)', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
            Alles over {cfg.name}-claims
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {faqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(15,30,61,0.05)',
                }}
              >
                <summary style={{
                  padding: '1.0625rem 1.375rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: 'var(--navy)',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  userSelect: 'none',
                }}>
                  <span>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div style={{
                  padding: '0 1.375rem 1.125rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-sub)',
                  lineHeight: 1.75,
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1rem',
                }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', marginBottom: '0.875rem',
          }}>
            Gratis check — geen account vereist
          </p>
          <h2 style={{
            fontFamily: 'var(--font-sora)', fontWeight: 800,
            fontSize: 'clamp(1.625rem, 3.5vw, 2.375rem)',
            color: '#fff', margin: '0 0 0.875rem',
            letterSpacing: '-0.025em', lineHeight: 1.15,
          }}>
            Weet niet zeker of jouw {cfg.name} vlucht<br />
            in aanmerking komt?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Check het gratis in 2 minuten — geen account, geen creditcard.
          </p>
          <a
            href="#form"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem',
              padding: '1rem 2.5rem', borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(26,86,219,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            Check mijn vlucht — gratis →
          </a>
          <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
            €42 bij indiening · 25% commissie bij uitbetaling · Niets vooraf
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RESPONSIVE + INTERACTION STYLES
      ══════════════════════════════════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 820px) {
          .hero-plane { display: none !important; }
          .hero-logo-badge { display: none !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        details[open] > summary svg { transform: rotate(180deg); }
        details > summary svg { transition: transform 0.2s; }
        details[open] { box-shadow: 0 4px 20px rgba(26,86,219,0.08) !important; }
        tbody tr:hover td { background: #f8faff; }
        .claim-btn:hover { background: var(--blue) !important; color: #fff !important; }
      `}</style>
    </>
  )
}
