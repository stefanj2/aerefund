import Image from 'next/image'
import AnalyseForm from '@/components/AnalyseForm'
import HeroSearchForm from '@/components/HeroSearchForm'
import SiteNav from '@/components/SiteNav'
import { REVIEWS } from '@/data/reviews'

// ── Data ──────────────────────────────────────────────────────────────────────

const AIRLINE_LOGOS = [
  { name: 'KLM',          iata: 'KL', bg: '#009BDE' },
  { name: 'Ryanair',      iata: 'FR', bg: '#073590' },
  { name: 'Transavia',    iata: 'HV', bg: '#00A04A' },
  { name: 'easyJet',      iata: 'U2', bg: '#FF6600' },
  { name: 'Corendon',     iata: 'XC', bg: '#E87722' },
  { name: 'TUI fly',      iata: 'TB', bg: '#E2001A' },
  { name: 'Vueling',      iata: 'VY', bg: '#F0D500' },
  { name: 'Lufthansa',    iata: 'LH', bg: '#05164D' },
  { name: 'Air France',   iata: 'AF', bg: '#002157' },
  { name: 'Brussels',     iata: 'SN', bg: '#ED1C24' },
]


const WHY_ITEMS = [
  {
    title: 'Slechts 2 minuten',
    desc: 'Vul je vluchtnummer en datum in en wacht op het resultaat. Wij regelen alles van A tot Z — jij hoeft niets te doen.',
    visual: (
      <div style={{ background: 'linear-gradient(135deg, #eef3ff 0%, #e4eefe 100%)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', minHeight: '148px' }}>
        {/* Search bar */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #dde6f5' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="#94a3b8" strokeWidth="1.2"/><path d="M8 8l2 2" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <span style={{ fontSize: '0.65rem', color: '#64748b', flex: 1, fontFamily: 'var(--font-sora)' }}>KL1234 · 15 jan 2024</span>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3.5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        {/* Result card */}
        <div style={{ background: '#fff', borderRadius: '10px', padding: '0.75rem 0.875rem', boxShadow: '0 4px 18px rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', gap: '0.625rem', border: '1.5px solid rgba(34,197,94,0.25)' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#009BDE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.52rem', color: '#fff', letterSpacing: '-0.01em' }}>KLM</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.7rem', color: 'var(--text)', margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>KL1234 · AMS → BCN</p>
            <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0 }}>4u 12min vertraging · ✓ EC 261/2004</p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.4)', borderRadius: '8px', padding: '0.3rem 0.6rem', textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--green)', margin: 0, lineHeight: 1 }}>€400</p>
            <p style={{ fontSize: '0.52rem', color: 'var(--green)', margin: 0, opacity: 0.75 }}>p.p.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Geen winst, geen kosten',
    desc: 'Onze juridische experts halen de compensatie voor jou op. Geen financieel risico — je betaalt €42 bij indiening en 25% bij succes.',
    visual: (
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #d9fce8 100%)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', minHeight: '148px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'stretch', height: '100%' }}>
          {/* Others */}
          <div>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#ef4444', margin: '0 0 0.5rem' }}>Anderen</p>
            {[['Kosten vooraf', '25–35%'], ['Bij mislukking', 'Verlies']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: '6px', padding: '0.32rem 0.5rem', marginBottom: '0.3rem', border: '1px solid rgba(239,68,68,0.18)' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>{l}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#ef4444' }}>{v}</span>
              </div>
            ))}
          </div>
          {/* VS divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '1.25rem' }}>
            <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.08)' }} />
          </div>
          {/* Us */}
          <div>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--green)', margin: '0 0 0.5rem' }}>Wij</p>
            {[['Vooraf', '€0 ✓'], ['Indiening', '€42'], ['Bij succes', '+ 25%']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: '6px', padding: '0.32rem 0.5rem', marginBottom: '0.3rem', border: '1px solid rgba(34,197,94,0.22)' }}>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>{l}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: l === 'Vooraf' ? 'var(--green)' : 'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Ontvang makkelijk compensatie',
    desc: 'Als je zelf een aanvraag indient, wijst de airline in 70% van de gevallen af. Wij hebben een slagingspercentage van 98%.',
    visual: (
      <div style={{ background: 'linear-gradient(135deg, #f8faff 0%, #edf2ff 100%)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', minHeight: '148px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
        {/* Self */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Zelf aanvragen</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444' }}>~30%</span>
          </div>
          <div style={{ height: '11px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', borderRadius: '6px', background: 'linear-gradient(90deg, #fca5a5, #f87171)' }} />
          </div>
        </div>
        {/* Aerefund */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--navy)', fontWeight: 700, fontFamily: 'var(--font-sora)' }}>Aerefund</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--green)' }}>~98%</span>
          </div>
          <div style={{ height: '11px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{ width: '98%', height: '100%', borderRadius: '6px', background: 'linear-gradient(90deg, #4ade80, #16a34a)' }} />
          </div>
        </div>
        <p style={{ fontSize: '0.58rem', color: '#94a3b8', margin: 0, textAlign: 'center', letterSpacing: '0.02em' }}>
          % claims met succesvolle uitbetaling
        </p>
      </div>
    ),
  },
  {
    title: 'Nederlandstalige support',
    desc: 'Onze klantenservice is bereikbaar via telefoon en email in het Nederlands. Wij kennen de wegen bij elke Nederlandse airline.',
    visual: (
      <div style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e5ecfd 100%)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', minHeight: '148px', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
        {/* User message */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: 'var(--blue)', color: '#fff', borderRadius: '12px 12px 2px 12px', padding: '0.45rem 0.75rem', fontSize: '0.64rem', maxWidth: '82%', lineHeight: 1.4 }}>
            Wat is de status van mijn claim?
          </div>
        </div>
        {/* Support response */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '0.375rem' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-sora)' }}>VV</span>
          </div>
          <div style={{ background: '#fff', color: 'var(--text)', borderRadius: '12px 12px 12px 2px', padding: '0.45rem 0.75rem', fontSize: '0.64rem', fontWeight: 600, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #dde6f5', maxWidth: '80%', lineHeight: 1.45 }}>
            KLM heeft betaald! 🎉 €800 staat onderweg naar jouw rekening.
          </div>
        </div>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.2rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.58rem', color: '#64748b' }}>Nederlandstalige support · ma–vr 09:00–17:00</span>
        </div>
      </div>
    ),
  },
]

const HELPS_ITEMS = [
  {
    title: 'Compensatie voor vertraagde vluchten',
    desc: 'Als een vlucht meer dan 3 uur vertraagd aankomt, hebben passagiers recht op €250 tot €600, afhankelijk van de vliegafstand.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="var(--blue)" strokeWidth="1.5" />
        <path d="M10 5.5v5l3 2" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Compensatie voor geannuleerde vluchten',
    desc: 'Passagiers hebben recht op compensatie als hun vlucht geannuleerd wordt zonder tijdige kennisgeving vooraf.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M17 9V7L10 3.5V1.5A1 1 0 0 0 8 1.5V3.5L1 7v2l7-1.5v4l-2 1V14l4-1 4 1v-1.5l-2-1v-4L17 9z" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Compensatie voor geweigerde instap',
    desc: 'Als je instap geweigerd wordt door overboeking, is de airline verplicht alternatieven of financiële compensatie te bieden.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="var(--blue)" strokeWidth="1.5" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Oncoöperatieve airlines',
    desc: 'Reageert de airline niet op jouw verzoek? Ons juridische team helpt je om directe antwoorden en betaling te verkrijgen.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 4v5M10 14v.5" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

const STEPS = [
  {
    num: '1',
    title: 'Dien de compensatieclaim in',
    desc: 'Het duurt slechts 2 minuten om je compensatiebedrag te berekenen en de claim in te dienen.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '1rem' }}>
        <rect x="10" y="6" width="28" height="36" rx="5" fill="#EEF3FF" stroke="#C7D5FF" strokeWidth="1.5"/>
        <rect x="18" y="3" width="12" height="7" rx="3.5" fill="#1a56db"/>
        <path d="M17 20h14M17 26h9M17 32h11" stroke="#94A3C4" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="35" cy="35" r="8" fill="#22C55E"/>
        <path d="M31.5 35l2.5 2.5 4.5-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Wij werken voor jouw rechten',
    desc: 'Ons juridisch team werkt met airlines en instanties samen om jouw claim te winnen.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '1rem' }}>
        <path d="M24 5L40 12v11c0 10.5-7 19-16 21C15 42 8 33.5 8 23V12z" fill="#EEF3FF" stroke="#C7D5FF" strokeWidth="1.5"/>
        <circle cx="24" cy="22" r="6" fill="#fff" stroke="#1a56db" strokeWidth="1.5"/>
        <path d="M20.5 22l2.5 2.5 5-4.5" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 31h14" stroke="#C7D5FF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Ontvang je compensatie',
    desc: 'Zodra wij de zaak winnen, ontvang je de compensatie direct op jouw bankrekening.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '1rem' }}>
        <rect x="6" y="14" width="36" height="24" rx="6" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5"/>
        <rect x="6" y="19" width="36" height="8" fill="#D9FCE8" opacity="0.8"/>
        <circle cx="36" cy="34" r="8" fill="#22C55E"/>
        <path d="M33 34c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M36 28v2M36 38v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 26h14M13 30h9" stroke="#94A3B4" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const FAQS = [
  { q: 'Wat kost het?', a: 'De check is gratis. Als je besluit de claim in te dienen, sturen wij een factuur van €42. Bij succes ook 25% commissie over het uitgekeerde bedrag.' },
  { q: 'Hoelang heb ik de tijd?', a: 'Je hebt 3 jaar de tijd na de vluchtdatum. Hoe ouder de vlucht, hoe lastiger de bewijsvoering — check zo snel mogelijk.' },
  { q: 'Wat als de airline weigert?', a: 'Wij kennen de weigeringstactieken per airline en sturen formele sommatiesbrieven. In het uiterste geval schakelen we juridische bijstand in.' },
  { q: 'Welke vluchten komen in aanmerking?', a: 'Vluchten vertrokken uit de EU, of naar de EU met een EU-airline. Vertraging 3+ uur, annulering of overbooking.' },
]

const MARQUEE_REVIEWS = Object.values(REVIEWS).flat().slice(0, 10)

const FOOTER_COLS = [
  {
    title: 'Ken je rechten',
    links: [
      { label: 'Passagiersrechten', href: '/passagiersrechten' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Bedrijf',
    links: [
      { label: 'Over ons', href: '/over-ons' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Juridisch',
    links: [
      { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
      { label: 'Privacybeleid', href: '/privacy' },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aerefund',
  url: 'https://aerefund.com',
  logo: 'https://aerefund.com/logo-aerefund.png',
  description: 'Aerefund helpt Nederlandse reizigers hun vluchtcompensatie te claimen op basis van EC 261/2004.',
  contactPoint: { '@type': 'ContactPoint', email: 'info@aerefund.com', contactType: 'customer service', availableLanguage: 'Dutch' },
  address: { '@type': 'PostalAddress', streetAddress: 'Keurenplein 24', addressLocality: 'Amsterdam', postalCode: '1069 CD', addressCountry: 'NL' },
  legalName: 'GoodbyeGuru',
  foundingDate: '2024',
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Vluchtcompensatie claimen via Aerefund',
  provider: { '@type': 'Organization', name: 'Aerefund', url: 'https://aerefund.com' },
  description: 'Aerefund dient vluchtclaims in op basis van EU-verordening EC 261/2004 voor vertraagde en geannuleerde vluchten. €250–€600 compensatie per passagier.',
  areaServed: 'NL',
  serviceType: 'Vluchtclaim indienen',
  offers: {
    '@type': 'Offer',
    price: '42',
    priceCurrency: 'EUR',
    description: 'Vaste intake-fee per claim. Bij succes ook 25% commissie.',
  },
}

export default function Home() {
  return (
    <main style={{ background: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <SiteNav />

      {/* ── Hero — full-width background photo with overlay ─────────────────── */}
      {/*
        Exact refly.org layout:
        - Airport photo covers the FULL section (bleeds to right edge)
        - White-to-transparent gradient on the left keeps text readable
        - Content (label + H1 + subtext + form + trust) sits over the left ~55%
        - No split-column — single overlay
      */}
      <section id="form" style={{ position: 'relative', overflow: 'hidden', minHeight: '620px', background: '#f0f4fa' }}>

        {/* Background photo — fills the section, positioned right */}
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=85&w=1600&auto=format&fit=crop&crop=focalpoint&fp-x=0.65&fp-y=0.45"
          alt="Passagier met koffer op luchthaven"
          fill
          style={{ objectFit: 'cover', objectPosition: 'right center' }}
          priority
        />

        {/* Left-to-right gradient so text stays legible */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(100deg, #fff 0%, #fff 38%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.55) 65%, rgba(255,255,255,0.1) 80%, transparent 100%)',
        }} />

        {/* Content */}
        <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '600px', padding: '5rem 0 5.5rem' }}>

            {/* Breadcrumb label */}
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--blue)' }}>Aerefund.</strong>{' '}
              <strong style={{ color: 'var(--text)' }}>Compensatie</strong>{' '}
              <span style={{ color: 'var(--text-sub)' }}>voor</span>{' '}
              <strong style={{ color: 'var(--text)' }}>Vluchtvertraging & Annulering</strong>
            </p>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-sora)', fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1, color: 'var(--navy)',
              marginBottom: '1rem',
            }}>
              Jouw airline is jou<br />waarschijnlijk geld schuldig.
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Check gratis in 2 minuten of je recht hebt op <strong style={{ color: 'var(--text)' }}>€250 tot €600</strong> per persoon — wij doen de rest.
            </p>

            {/* Horizontal search form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <HeroSearchForm />
            </div>

            {/* Trust badges — blue circle checkmarks */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1.5rem' }}>
              {[
                'Gratis check · €42 bij indiening',
                'Compensatie voor oude vluchten',
                'Slechts 2 minuten',
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


      {/* ── Stats + Airlines ─────────────────────────────────────────────── */}
      <section style={{ background: '#eef5ff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container-wide">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionLabel>Bewezen track record</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.375rem)', color: 'var(--navy)', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
              Meer dan 5.000 passagiers gingen je voor
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}>
              Wij claimen compensatie bij elke grote airline — snel, transparant en zonder risico.
            </p>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {[
              { num: '98%', sup: '*', label: 'Gewonnen cases', note: '* bij kwalificerende claims', accent: 'var(--green)' },
              { num: '5.000+', sup: '',  label: 'Passagiers geholpen', note: 'Ongeacht de ticketprijs', accent: 'var(--blue)' },
              { num: '€600',   sup: '',  label: 'Max. compensatie p.p.', note: 'Op vluchten boven 3.500 km', accent: 'var(--navy)' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#fff', border: '1px solid var(--border)', borderRadius: '16px',
                padding: '2rem', textAlign: 'center',
                boxShadow: '0 2px 10px rgba(15,30,61,0.06)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-sora)', fontWeight: 900,
                  fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                  color: stat.accent, lineHeight: 1, marginBottom: '0.625rem', letterSpacing: '-0.03em',
                }}>
                  {stat.num}
                  {stat.sup && <sup style={{ fontSize: '0.35em', fontWeight: 700, verticalAlign: 'super', color: 'var(--text-muted)', letterSpacing: 0 }}>{stat.sup}</sup>}
                </p>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>{stat.label}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.note}</p>
              </div>
            ))}
          </div>

          {/* Airlines marquee */}
          <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.25rem' }}>
            Claims bij 100+ airlines, waaronder:
          </p>
          <div className="marquee-outer" style={{ marginBottom: '3.5rem' }}>
            <div className="marquee-track">
              {[...AIRLINE_LOGOS, ...AIRLINE_LOGOS].map((airline, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '0.4rem 0.875rem 0.4rem 0.625rem',
                  boxShadow: '0 1px 4px rgba(15,30,61,0.05)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.kiwi.com/airlines/64/${airline.iata}.png`} alt={airline.name} width={20} height={20} style={{ objectFit: 'contain', borderRadius: '3px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-sub)', whiteSpace: 'nowrap' }}>{airline.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <a href="#form" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem',
              padding: '0.9375rem 2.5rem', borderRadius: '9px',
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(26,86,219,0.25)',
            }}>
              Check mijn vlucht — gratis
            </a>
            <p style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Gratis check — €42 bij indiening — geen betaling vooraf
            </p>
          </div>

        </div>
      </section>

      {/* ── Klantverhaal ───────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '5.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide" style={{ maxWidth: '860px' }}>

          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blue)', marginBottom: '0.625rem' }}>
            Zo werkt het in de praktijk
          </p>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--navy)', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
            Van &ldquo;KLM weigert&rdquo; naar €1.200 op de rekening
          </h2>

          {/* Quote — editorial style, thick left border */}
          <div style={{ borderLeft: '4px solid var(--blue)', paddingLeft: '1.75rem', marginBottom: '2.5rem' }}>
            <p style={{
              fontFamily: 'var(--font-sora)', fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
              fontWeight: 500, color: 'var(--navy)', lineHeight: 1.75,
              fontStyle: 'italic', margin: '0 0 1.25rem',
            }}>
              &ldquo;Ik wist niet eens dat ik recht had op geld. KLM mailde dat de vertraging door &lsquo;buitengewone omstandigheden&rsquo; was. Ik geloofde ze. Via een vriendin hoorde ik van Aerefund — twee minuten later zag ik dat we recht hadden op €1.200.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '0.875rem', color: '#fff' }}>M</div>
              <div>
                <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)', margin: 0 }}>Marjolein, 34</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Amsterdam → Barcelona · KLM · 4u 40min vertraging</p>
              </div>
              <div style={{ marginLeft: 'auto', background: 'var(--green-dim)', border: '1px solid var(--green-border)', borderRadius: '6px', padding: '0.3rem 0.75rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)' }}>✓ €1.200 ontvangen</span>
              </div>
            </div>
          </div>

          {/* Timeline — clean table style */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: '560px' }}>
              {[
                { label: 'Dag 1', text: 'Vluchtnummer ingevuld, €400 p.p. berekend', final: false },
                { label: 'Dag 2', text: 'Claim ingediend, factuur €42 verstuurd', final: false },
                { label: 'Week 2', text: 'KLM weigert — wij sturen bezwaarschrift', final: false },
                { label: 'Week 3', text: 'Formele sommatie verstuurd', final: false },
                { label: 'Week 6', text: '€1.200 bijgeschreven', final: true },
              ].map((step, i, arr) => (
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

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
            Meer dan <strong style={{ color: 'var(--text-sub)' }}>5.000 passagiers</strong> gingen je voor.
          </p>
        </div>
      </section>


      {/* ── Why choose ─────────────────────────────────────────────────────── */}
      <section id="rechten" style={{ background: '#fff', padding: '6rem 0' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>25% commissie alleen bij succes</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.875rem, 3vw, 2.625rem)', color: 'var(--navy)', letterSpacing: '-0.025em', marginBottom: '0.875rem' }}>
              Waarom Aerefund kiezen?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', maxWidth: '520px', lineHeight: 1.7 }}>
              Eenvoudig, transparant en zonder financieel risico. Jij regelt niets — wij halen je geld op.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="why-card">
                {item.visual}
                <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="#form" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              padding: '0.875rem 2.25rem', borderRadius: '8px',
              textDecoration: 'none', boxShadow: '0 4px 16px var(--blue-glow)',
            }}>
              Check compensatie
            </a>
          </div>
        </div>
      </section>

      {/* ── Helps you with ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--section-alt)', padding: '6rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>Wat wij voor je regelen</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.875rem, 3vw, 2.625rem)', color: 'var(--navy)', letterSpacing: '-0.025em', marginBottom: '0.875rem' }}>
              Aerefund helpt je bij:
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', maxWidth: '520px', lineHeight: 1.7 }}>
              Wij werken samen met meer dan <strong style={{ color: 'var(--text)' }}>100 airlines</strong> om passagiers te beschermen.
            </p>
          </div>

          {/* 3-col layout: text | phone | text */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Left 2 items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              {HELPS_ITEMS.slice(0, 2).map((item) => (
                <div key={item.title}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Center: phone mockup */}
            <div style={{
              width: '210px',
              background: '#fff',
              borderRadius: '28px',
              border: '2px solid #dde6f5',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              padding: '1.125rem',
              alignSelf: 'center',
              position: 'relative',
            }}>
              {/* Phone notch */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.875rem' }}>
                <div style={{ width: '56px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }} />
              </div>
              {/* Amount card */}
              <div style={{ background: 'linear-gradient(135deg, #1a56db 0%, #1341b0 100%)', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.58rem', marginBottom: '0.25rem', letterSpacing: '0.04em', fontWeight: 600 }}>COMPENSATIERECHT</p>
                <p style={{ fontFamily: 'var(--font-sora)', color: '#fff', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1, marginBottom: '0.2rem' }}>€400</p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.55rem' }}>per persoon · KL1234</p>
              </div>
              {/* Status steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { text: 'Vertraging bevestigd', done: true },
                  { text: 'EC 261 van toepassing', done: true },
                  { text: 'Claim ingediend', done: true },
                ].map((s) => (
                  <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', borderRadius: '7px', padding: '0.38rem 0.6rem', border: '1px solid #e8f0fb' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 3.5l2 2 3-3" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-sub)', fontWeight: 600 }}>{s.text}</span>
                  </div>
                ))}
              </div>
              {/* CTA */}
              <div style={{ background: 'var(--blue)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center', marginTop: '0.625rem' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sora)' }}>Dien claim in →</span>
              </div>
            </div>

            {/* Right 2 items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
              {HELPS_ITEMS.slice(2, 4).map((item) => (
                <div key={item.title}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="#form" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              padding: '0.875rem 2.25rem', borderRadius: '8px',
              textDecoration: 'none', boxShadow: '0 4px 16px var(--blue-glow)',
            }}>
              Check compensatie
            </a>
          </div>
        </div>
      </section>

      {/* ── Reviews marquee ────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '4.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <SectionLabel>Klantbeoordelingen</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)', color: 'var(--navy)', letterSpacing: '-0.02em' }}>
            Wat onze klanten zeggen
          </h2>
        </div>
        <div className="marquee-outer" style={{ '--marquee-fade-color': '#fff' } as React.CSSProperties}>
          <div className="marquee-track">
            {[...MARQUEE_REVIEWS, ...MARQUEE_REVIEWS].map((review, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem 1.125rem',
                  marginRight: '0.875rem',
                  width: '260px',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="10" height="10" viewBox="0 0 12 12" fill={j < review.rating ? '#FBBF24' : '#e2e8f0'}>
                      <path d="M6 1l1.39 2.82L10.5 4.24l-2.25 2.19.53 3.09L6 7.97 3.22 9.52l.53-3.09L1.5 4.24l3.11-.42L6 1z" />
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>{review.author}</span>
                  <span className="badge-green" style={{ fontSize: '0.65rem', padding: '0.18rem 0.5rem' }}>€{review.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 steps ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '6rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '4rem' }}>
            <SectionLabel>Eenvoudig en snel</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.875rem, 3vw, 2.625rem)', color: 'var(--navy)', letterSpacing: '-0.025em', marginBottom: '0.875rem' }}>
              Claim je compensatie in{' '}
              <span style={{ color: 'var(--blue)' }}>3 stappen:</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-sub)', maxWidth: '400px', lineHeight: 1.7 }}>
              Wij regelen alles — jij hoeft niets te doen.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
            {STEPS.map((step) => (
              <div key={step.num} className="step-card" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{step.icon}</div>
                <div className="step-num" style={{ margin: '0 auto 1rem' }}>{step.num}</div>
                <h3 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.625rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="#form" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--blue)', color: '#fff',
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem',
              padding: '0.875rem 2.25rem', borderRadius: '8px',
              textDecoration: 'none', boxShadow: '0 4px 16px var(--blue-glow)',
            }}>
              Check compensatie
            </a>
            <div style={{ marginTop: '0.875rem' }}>
              <span className="badge-green">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2.5 2.5L7 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Snelle uitbetaling
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" style={{ background: 'var(--section-alt)', padding: '6rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <SectionLabel>Veelgestelde vragen</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(1.875rem, 3vw, 2.625rem)', color: 'var(--navy)', letterSpacing: '-0.025em' }}>
              Alles wat je wil weten
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq) => (
              <div key={faq.q} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.375rem 1.5rem', boxShadow: '0 1px 4px rgba(15,30,61,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', margin: 0 }}>{faq.q}</p>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bold CTA ───────────────────────────────────────────────────────── */}
      <section style={{ background: '#0B1220', padding: '6.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SectionLabel dark>Gratis check — geen risico</SectionLabel>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', color: '#fff', lineHeight: 1.08, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Jouw airline heeft je<br />waarschijnlijk nog niet betaald.
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2.75rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 2.75rem' }}>
            Check in 2 minuten of je recht hebt op tot <strong style={{ color: '#fff' }}>€600 per persoon</strong>.<br />Geen betaling vooraf.
          </p>
          <a href="#form" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            background: 'var(--blue)', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.0625rem',
            padding: '1.125rem 2.75rem', borderRadius: '10px',
            textDecoration: 'none', boxShadow: '0 4px 28px rgba(26,86,219,0.5)',
          }}>
            Check compensatie
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <p style={{ marginTop: '1.125rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
            €42 achteraf bij indiening &nbsp;·&nbsp; 25% commissie alleen bij succes
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#080E1C', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3.5rem 0 2rem' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            {/* Brand */}
            <div>
              <div style={{ height: '40px', overflow: 'hidden', marginBottom: '1rem', mixBlendMode: 'screen' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block', filter: 'invert(1) grayscale(1) brightness(2)' }} />
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '220px' }}>
                Wij helpen passagiers bij het claimen van compensatie voor vertraagde en geannuleerde vluchten.
              </p>
            </div>

            {/* Columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="footer-col-title">{col.title}</p>
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Aerefund — handelsnaam van Dune Legal · EC 261/2004
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/algemene-voorwaarden" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Algemene voorwaarden</a>
              <a href="/privacy" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacybeleid</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="sticky-cta-bar">
        <a href="#form" className="btn-primary" style={{ fontSize: '0.9rem' }}>
          Check compensatie →
        </a>
      </div>

    </main>
  )
}
