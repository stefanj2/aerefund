import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import { AIRLINES } from '@/lib/airlines'
import { IATA_TO_SLUG } from '@/lib/airline-page-data'

export const metadata: Metadata = {
  title: 'Vliegtuigmaatschappijen — Compensatie per airline | Aerefund',
  description: 'Bekijk per vliegtuigmaatschappij hoe je compensatie kunt claimen bij vluchtvertraging of annulering. KLM, Ryanair, Transavia, easyJet en 55+ andere airlines.',
  alternates: { canonical: 'https://aerefund.com/vliegtuigmaatschappijen' },
}

// Group airlines by region
const REGIONS: { label: string; iatas: string[] }[] = [
  {
    label: 'Nederland & België',
    iatas: ['KL', 'WA', 'HV', 'CD', 'TB', 'SN'],
  },
  {
    label: 'Groot-Brittannië & Ierland',
    iatas: ['BA', 'U2', 'EI', 'LS', 'BY', 'W9'],
  },
  {
    label: 'Duitsland & Oostenrijk',
    iatas: ['LH', 'EW', '4U', 'DE', 'X3', 'OS'],
  },
  {
    label: 'Frankrijk & Zwitserland',
    iatas: ['AF', 'LX'],
  },
  {
    label: 'Spanje & Portugal',
    iatas: ['VY', 'IB', 'UX', 'V7', 'YW', 'TP'],
  },
  {
    label: 'Italië & Griekenland',
    iatas: ['AZ', 'A3'],
  },
  {
    label: 'Scandinavië & Noord-Europa',
    iatas: ['SK', 'DY', 'D8', 'AY', 'FI', 'BT', 'OV'],
  },
  {
    label: 'Oost-Europa',
    iatas: ['FR', 'W6', 'LO', 'RO', 'OK', 'OU', 'FB', 'TE', 'KM', 'LG', 'JU'],
  },
  {
    label: 'Turkije',
    iatas: ['TK', 'PC', 'XQ', 'OE'],
  },
  {
    label: 'Golf & Midden-Oosten',
    iatas: ['EK', 'QR', 'EY', 'FZ', 'G9'],
  },
  {
    label: 'Afrika & Azië',
    iatas: ['AT', 'MS', 'AI', 'ET', 'KQ'],
  },
]

const difficultyConfig = {
  easy:   { label: 'Makkelijk',  color: '#15803d', bg: 'rgba(21,128,61,0.08)',  border: 'rgba(21,128,61,0.20)' },
  medium: { label: 'Gemiddeld',  color: '#b45309', bg: 'rgba(180,83,9,0.08)',  border: 'rgba(180,83,9,0.20)' },
  hard:   { label: 'Uitdagend',  color: '#dc2626', bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.20)' },
}

export default function VliegtuigmaatschappijenPage() {
  const totalAirlines = Object.keys(IATA_TO_SLUG).length

  return (
    <>
      <SiteNav />

      {/* ── Hero ── */}
      <section style={{ background: '#eef5ff', borderBottom: '1px solid var(--border)', padding: '4rem 0 3.5rem' }}>
        <div className="container-wide" style={{ maxWidth: '860px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '0.75rem' }}>
            Compensatie per airline
          </p>
          <h1 style={{
            fontFamily: 'var(--font-sora)', fontWeight: 800,
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            color: 'var(--navy)', letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            Vliegtuigmaatschappijen
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-sub)', lineHeight: 1.7, maxWidth: '580px', marginBottom: '2rem' }}>
            Vloog je met een van de {totalAirlines} airlines hieronder en had je vertraging of annulering?
            Kies jouw airline voor specifieke informatie, tips en een gratis compensatiecheck.
          </p>

          {/* Stats strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { num: `${totalAirlines}+`, label: 'airlines gedekt' },
              { num: '€600', label: 'max. per persoon' },
              { num: '€0', label: 'kosten vooraf' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--navy)', lineHeight: 1, marginBottom: '0.2rem', letterSpacing: '-0.03em' }}>{s.num}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Airline grid per region ── */}
      <section style={{ background: '#fff', padding: '4rem 0 6rem' }}>
        <div className="container-wide" style={{ maxWidth: '1040px' }}>
          {REGIONS.map((region) => {
            const regionAirlines = region.iatas
              .filter(iata => AIRLINES[iata] && IATA_TO_SLUG[iata])
              .map(iata => ({ iata, cfg: AIRLINES[iata], slug: IATA_TO_SLUG[iata] }))

            if (regionAirlines.length === 0) return null

            return (
              <div key={region.label} style={{ marginBottom: '3.5rem' }}>
                {/* Region header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-sora)', fontWeight: 800,
                    fontSize: '1.0625rem', color: 'var(--navy)',
                    letterSpacing: '-0.01em', margin: 0,
                  }}>
                    {region.label}
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {regionAirlines.length} airline{regionAirlines.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                  gap: '0.75rem',
                }}>
                  {regionAirlines.map(({ iata, cfg, slug }) => {
                    const diff = difficultyConfig[cfg.claimDifficulty]
                    return (
                      <Link
                        key={iata}
                        href={`/airlines/${slug}`}
                        style={{ textDecoration: 'none' }}
                        className="airline-card"
                      >
                        <div style={{
                          background: '#fff',
                          border: '1.5px solid var(--border)',
                          borderRadius: '14px',
                          padding: '1.125rem 1.25rem',
                          display: 'flex', alignItems: 'center', gap: '0.875rem',
                          transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                          cursor: 'pointer',
                          height: '100%',
                          boxSizing: 'border-box',
                        }}
                          className="airline-card-inner"
                        >
                          {/* Airline logo */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://images.kiwi.com/airlines/64/${iata}.png`}
                            alt={cfg.name}
                            width={32}
                            height={32}
                            style={{ objectFit: 'contain', borderRadius: '6px', flexShrink: 0 }}
                          />

                          {/* Info */}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{
                              fontFamily: 'var(--font-sora)', fontWeight: 700,
                              fontSize: '0.875rem', color: 'var(--navy)',
                              margin: '0 0 0.3rem', lineHeight: 1.2,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {cfg.name}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.65rem', fontWeight: 700,
                                color: diff.color, background: diff.bg,
                                border: `1px solid ${diff.border}`,
                                borderRadius: '999px', padding: '1px 7px',
                                whiteSpace: 'nowrap',
                              }}>
                                {diff.label}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {cfg.successRate}% succes
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--text-muted)', opacity: 0.5 }}>
                            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ background: 'var(--navy)', padding: '4.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-sora)', fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            color: '#fff', margin: '0 0 0.75rem', letterSpacing: '-0.02em',
          }}>
            Jouw airline staat er al bij.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', marginBottom: '2rem' }}>
            Gratis check in 2 minuten — geen account, geen creditcard.
          </p>
          <Link href="/#form" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--blue)', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem',
            padding: '1rem 2.5rem', borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(26,86,219,0.35)',
          }}>
            Check mijn vlucht — gratis →
          </Link>
        </div>
      </section>

      <style>{`
        .airline-card-inner:hover {
          border-color: var(--blue) !important;
          box-shadow: 0 4px 16px rgba(26,86,219,0.10) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  )
}
