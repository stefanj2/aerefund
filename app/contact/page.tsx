import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  alternates: { canonical: 'https://aerefund.com/contact' },
  description: 'Neem contact op met Aerefund.com. Vragen over je claim, de kosten of het claimproces? Wij helpen je graag.',
}

const TOPICS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" stroke="var(--blue)" strokeWidth="1.6" />
        <path d="M11 7v4l2.5 2.5" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Lopende claim',
    desc: 'Vragen over een claim die je al hebt ingediend? Vermeld je vluchtnummer en naam zodat we snel kunnen zoeken.',
    email: 'claim@aerefund.com',
    responseTime: 'Reactie binnen 1 werkdag',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2.5" stroke="var(--blue)" strokeWidth="1.6" />
        <path d="M2 8l9 5 9-5" stroke="var(--blue)" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Algemene vragen',
    desc: 'Vragen over kosten, het proces of of jouw vlucht in aanmerking komt? We helpen je graag op weg.',
    email: 'info@aerefund.com',
    responseTime: 'Reactie binnen 2 werkdagen',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="var(--blue)" strokeWidth="1.6" />
        <path d="M12 8v4l3 3" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12h2M18 12h2M12 2v2M12 18v2" stroke="var(--blue)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Privacy & persoonsgegevens',
    desc: 'Verzoeken voor inzage, rectificatie of verwijdering van je gegevens conform de AVG.',
    email: 'privacy@aerefund.com',
    responseTime: 'Reactie binnen 30 dagen (wettelijk vereist)',
  },
]

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blue)', marginBottom: '0.75rem' }}>
            Contact
          </p>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: '1rem' }}>
            Hoe kunnen we je helpen?
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-sub)', lineHeight: 1.65, maxWidth: '500px' }}>
            Kies het juiste onderwerp hieronder — dan weet je direct op welk emailadres je terecht kunt en hoe snel je een reactie kunt verwachten.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        {/* Contact cards */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {TOPICS.map((topic) => (
              <div key={topic.title} style={{
                background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
                padding: '1.5rem', boxShadow: '0 1px 4px rgba(15,30,61,0.05)',
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {topic.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', margin: '0 0 0.375rem' }}>
                      {topic.title}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.65, margin: '0 0 1rem' }}>
                      {topic.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <a href={`mailto:${topic.email}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                        background: 'var(--blue-light)', color: 'var(--blue)',
                        fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.875rem',
                        padding: '0.5rem 1rem', borderRadius: '7px', textDecoration: 'none',
                        border: '1px solid var(--blue-border)',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" /><path d="M1 5.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" /></svg>
                        {topic.email}
                      </a>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{topic.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1.5px solid var(--border)' }}>
            Stuur ons een bericht
          </h2>

          <ContactForm />
        </section>

        {/* Quick links */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: '1rem', paddingBottom: '0.625rem', borderBottom: '1.5px solid var(--border)' }}>
            Misschien staat je antwoord hier al
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Veelgestelde vragen', href: '/faq', desc: 'Kosten, doorlooptijden, vluchten' },
              { label: 'Passagiersrechten', href: '/passagiersrechten', desc: 'Wanneer heb je recht op compensatie?' },
              { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden', desc: 'Tarieven en werkwijze' },
              { label: 'Privacyverklaring', href: '/privacy', desc: 'Hoe we omgaan met je gegevens' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', flexDirection: 'column', gap: '0.25rem',
                background: '#fff', border: '1px solid var(--border)', borderRadius: '10px',
                padding: '1rem 1.125rem', textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(15,30,61,0.04)',
              }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--blue)' }}>{link.label} →</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{link.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Office info */}
        <section>
          <div style={{ background: 'var(--section-alt)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', marginBottom: '1rem' }}>
              Bedrijfsgegevens
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 2 }}>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>Bedrijfsnaam:</strong> GoodbyeGuru</p>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>Handelsnaam:</strong> Aerefund.com</p>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>KvK-nummer:</strong> 67332706</p>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>BTW-nummer:</strong> NL224452794B01</p>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>Adres:</strong> Keurenplein 24, 1069 CD Amsterdam</p>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--text)', fontWeight: 600 }}>Email algemeen:</strong>{' '}
                <a href="mailto:info@aerefund.com" style={{ color: 'var(--blue)', textDecoration: 'none' }}>info@aerefund.com</a>
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ background: 'var(--navy)', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>© 2026 Aerefund.com</p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/algemene-voorwaarden" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Voorwaarden</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
