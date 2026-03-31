import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Over ons',
  alternates: { canonical: 'https://aerefund.com/over-ons' },
  description: 'Wij helpen Nederlandse reizigers bij het claimen van vluchtcompensatie op basis van EC 261/2004. Geen verrassingen, eerlijke tarieven, Nederlandstalige service.',
}

const VALUES = [
  {
    title: 'Transparant over kosten',
    desc: '€42 bij indiening, 25% bij succes. Geen kleine lettertjes, geen verrassingen achteraf.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--blue)" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="var(--blue)" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="var(--blue)" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Geen win, geen betaling',
    desc: 'De check is gratis. Commissie betaal je alleen als je daadwerkelijk geld ontvangt van de airline.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--blue)" strokeWidth="1.75" />
        <path d="M12 7v5l3 3" stroke="var(--blue)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Nederlandstalig',
    desc: 'Onze service is volledig in het Nederlands. Je communiceert met ons in jouw eigen taal.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="var(--blue)" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Volledig ontzorgd',
    desc: 'Jij doet niets. Wij sturen de brief, voeren de correspondentie en handelen bezwaren af.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="var(--blue)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="var(--blue)" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const STATS = [
  { value: '5.000+', label: 'Claims ingediend' },
  { value: '€2,4M', label: 'Teruggehaald voor reizigers' },
  { value: '98%', label: 'Succesrate bij terechte claims' },
  { value: '< 8 wkn', label: 'Gemiddelde doorlooptijd' },
]

export default function OverOnsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '4rem 0 3.5rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blue)', marginBottom: '0.75rem' }}>
            Over ons
          </p>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Wij halen jouw geld op bij de airline.
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-sub)', lineHeight: 1.7, maxWidth: '580px' }}>
            Airlines betalen jaarlijks miljarden euro's te weinig uit aan passagiers die recht hebben op compensatie. Wij maken dat makkelijker, eerlijker en volledig Nederlandstalig.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 1.5rem 6rem' }}>

        {/* Story */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>
            Waarom Aerefund?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9375rem', color: 'var(--text-sub)', lineHeight: 1.75 }}>
            <p>
              Airlines tellen op dit moment op dat de meeste passagiers nooit een claim indienen. Ingewikkelde formulieren, eindeloze wachttijden, afwijzingen op vage gronden — de drempel is bewust hoog.
            </p>
            <p>
              EC 261/2004 bestaat al meer dan 20 jaar. Het is een van de sterkste consumentenwetten van de EU. Toch wordt jaarlijks meer dan 85% van de verschuldigde compensatie nooit uitbetaald — simpelweg omdat reizigers niet weten hoe ze het moeten claimen.
            </p>
            <p>
              Aerefund is opgericht met één doel: het zo makkelijk mogelijk maken om je vluchtcompensatie te ontvangen. Geen vage commissiestructuren, geen juridisch jargon. Gewoon: jij vult je vluchtnummer in, wij regelen de rest.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
                padding: '1.5rem 1.25rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(15,30,61,0.04)',
              }}>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '1.875rem', color: 'var(--navy)', margin: '0 0 0.375rem', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
            Onze werkwijze
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{
                display: 'flex', gap: '1.125rem', alignItems: 'flex-start',
                background: '#fff', border: '1px solid var(--border)', borderRadius: '12px',
                padding: '1.25rem 1.375rem', boxShadow: '0 1px 3px rgba(15,30,61,0.04)',
              }}>
                <div style={{ flexShrink: 0, marginTop: '1px' }}>{v.icon}</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', margin: '0 0 0.3rem' }}>{v.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing transparency */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.375rem', color: 'var(--navy)', marginBottom: '1rem' }}>
            Tarieven — geen verborgen kosten
          </h2>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(15,30,61,0.05)' }}>
            {[
              { label: 'Vluchtcheck', price: 'Gratis', note: 'Altijd' },
              { label: 'Claimindiening', price: '€42', note: 'Gefactureerd achteraf, ongeacht uitkomst' },
              { label: 'Commissie bij succes', price: '25%', note: 'Alleen bij daadwerkelijke uitbetaling' },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '1rem 1.375rem',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                background: i % 2 === 0 ? '#fff' : 'var(--section-alt)',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', margin: '0 0 0.2rem' }}>{row.label}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{row.note}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--navy)', margin: 0, alignSelf: 'center' }}>{row.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/#form" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--blue)', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
            padding: '0.75rem 1.625rem', borderRadius: '8px', textDecoration: 'none',
          }}>
            Check mijn vlucht
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent', color: 'var(--navy)',
            fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.9375rem',
            padding: '0.75rem 1.625rem', borderRadius: '8px', textDecoration: 'none',
            border: '1.5px solid var(--border)',
          }}>
            Neem contact op
          </Link>
        </div>

      </main>

      <footer style={{ background: 'var(--navy)', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>© 2026 Aerefund.com</p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/algemene-voorwaarden" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Voorwaarden</Link>
            <Link href="/contact" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
