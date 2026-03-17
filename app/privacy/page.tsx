import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  alternates: { canonical: 'https://aerefund.com/privacy' },
  description: 'Privacyverklaring van Aerefund.com. Hoe wij omgaan met jouw persoonsgegevens conform de AVG (GDPR).',
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>

      <SiteNav />

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>

        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Versie 1.0 — 1 maart 2025
        </p>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: 'var(--navy)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Privacyverklaring
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '3rem', lineHeight: 1.6 }}>
          Aerefund.com respecteert jouw privacy en verwerkt persoonsgegevens conform de Algemene Verordening Gegevensbescherming (AVG / GDPR).
        </p>

        <LegalSection title="1. Verwerkingsverantwoordelijke">
          <p>
            De verwerkingsverantwoordelijke voor jouw persoonsgegevens is:
          </p>
          <div style={{
            background: '#fff', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '1rem 1.25rem', fontSize: '0.875rem', lineHeight: 1.8,
          }}>
            <strong>GoodbyeGuru</strong><br />
            Handelend onder: Aerefund.com<br />
            KvK-nummer: 67332706<br />
            BTW-nummer: NL224452794B01<br />
            Adres: Keurenplein 24, 1069 CD Amsterdam<br />
            E-mail: <a href="mailto:privacy@aerefund.com" style={{ color: 'var(--blue)' }}>privacy@aerefund.com</a>
          </div>
        </LegalSection>

        <LegalSection title="2. Welke gegevens verwerken wij?">
          <p>Wij verwerken de volgende categorieën persoonsgegevens:</p>

          <DataTable rows={[
            ['Naam (voor- en achternaam)', 'Identificatie voor de claimbrief'],
            ['E-mailadres', 'Communicatie, bevestiging en factuurverzending'],
            ['Telefoonnummer', 'Optioneel contactmiddel'],
            ['Adres, postcode, woonplaats', 'Vereist voor de cessie-akte en claimbrief'],
            ['IBAN-rekeningnummer', 'Optioneel, voor uitbetaling van compensatie'],
            ['Vluchtgegevens (nummer, datum, route)', 'Kerngegevens voor de claim'],
            ['Boardingpass / boekingsbevestiging', 'Optioneel bewijsmateriaal'],
            ['IP-adres en browsergegevens', 'Technische werking van de website'],
          ]} />
          <p>
            Wij verwerken <strong>geen bijzondere categorieën</strong> persoonsgegevens (zoals gezondheidsgegevens of biometrische gegevens).
          </p>
        </LegalSection>

        <LegalSection title="3. Doel en grondslag van de verwerking">
          <p>Wij verwerken jouw gegevens voor de volgende doelen:</p>

          <DataTable rows={[
            ['Uitvoering van de overeenkomst', 'Indienen van de vluchtclaim namens jou (artikel 6 lid 1 sub b AVG)'],
            ['Facturering', 'Verzenden van de factuur van €42 en inning commissie (art. 6 lid 1 sub b)'],
            ['Wettelijke verplichtingen', 'Bewaarplicht voor de belastingdienst (art. 6 lid 1 sub c)'],
            ['Gerechtvaardigd belang', 'Verbetering van onze dienstverlening en fraudepreventie (art. 6 lid 1 sub f)'],
          ]} />
        </LegalSection>

        <LegalSection title="4. Hoe lang bewaren wij jouw gegevens?">
          <p>Wij bewaren jouw persoonsgegevens niet langer dan noodzakelijk:</p>
          <ul>
            <li><strong>Claimgegevens en correspondentie:</strong> 5 jaar na afronding van de claim (conform verjaringstermijnen burgerlijk recht).</li>
            <li><strong>Financiële gegevens (facturen, IBAN):</strong> 7 jaar conform de fiscale bewaarplicht.</li>
            <li><strong>Niet-ingediende leads (emailadressen):</strong> maximaal 6 maanden na het laatste contact.</li>
            <li><strong>Website-loggegevens (IP-adres, browsergegevens):</strong> maximaal 90 dagen.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Delen met derden">
          <p>Wij delen jouw gegevens alleen met derden voor zover dat noodzakelijk is:</p>
          <ul>
            <li><strong>Luchtvaartmaatschappijen:</strong> naam, contactgegevens en vluchtdata zijn noodzakelijk voor de indiening van de claim.</li>
            <li><strong>Emaildienst (bijv. Resend / SendGrid):</strong> voor het verzenden van bevestigingen en facturen. Wij sluiten een verwerkersovereenkomst af.</li>
            <li><strong>Boekhoudsoftware (bijv. Moneybird):</strong> voor facturatie. Wij sluiten een verwerkersovereenkomst af.</li>
            <li><strong>Juridisch geschillenorgaan:</strong> indien nodig voor verdere afhandeling van de claim.</li>
          </ul>
          <p>
            Wij verkopen jouw gegevens <strong>nooit</strong> aan derden en verstrekken ze niet voor marketingdoeleinden van derden.
          </p>
          <p>
            Wij verwerken alle gegevens bij voorkeur binnen de EER. Indien gegevens buiten de EER worden verwerkt, zorgen wij voor passende waarborgen (bijv. Standard Contractual Clauses).
          </p>
        </LegalSection>

        <LegalSection title="6. Jouw rechten">
          <p>Op grond van de AVG heb je de volgende rechten:</p>
          <ul>
            <li><strong>Recht op inzage (art. 15 AVG):</strong> je kunt opvragen welke gegevens wij over jou verwerken.</li>
            <li><strong>Recht op rectificatie (art. 16 AVG):</strong> je kunt onjuiste gegevens laten corrigeren.</li>
            <li><strong>Recht op verwijdering (art. 17 AVG):</strong> je kunt verzoeken om verwijdering van jouw gegevens, voor zover dat niet in strijd is met een wettelijke bewaarplicht.</li>
            <li><strong>Recht op beperking van de verwerking (art. 18 AVG):</strong> in bepaalde situaties kun je vragen de verwerking te beperken.</li>
            <li><strong>Recht op gegevensoverdraagbaarheid (art. 20 AVG):</strong> je kunt jouw gegevens in een gestructureerd, gangbaar formaat opvragen.</li>
            <li><strong>Recht van bezwaar (art. 21 AVG):</strong> je kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang.</li>
          </ul>
          <p>
            Verzoeken kun je indienen via <a href="mailto:privacy@aerefund.com" style={{ color: 'var(--blue)' }}>privacy@aerefund.com</a>. Wij reageren binnen 30 dagen.
          </p>
        </LegalSection>

        <LegalSection title="7. Beveiliging">
          <p>
            Aerefund.com neemt passende technische en organisatorische maatregelen om jouw persoonsgegevens te beveiligen, waaronder:
          </p>
          <ul>
            <li>Versleutelde verbindingen (HTTPS/TLS) voor alle dataoverdracht;</li>
            <li>Toegangscontrole tot systemen met persoonsgegevens;</li>
            <li>Periodieke beoordeling van beveiligingsmaatregelen.</li>
          </ul>
          <p>
            Bij een datalek dat jouw rechten en vrijheden in gevaar brengt, stellen wij jou en de Autoriteit Persoonsgegevens hiervan onverwijld op de hoogte.
          </p>
        </LegalSection>

        <LegalSection title="8. Cookies">
          <p>
            Aerefund.com maakt gebruik van <strong>functionele cookies</strong> die noodzakelijk zijn voor de werking van de website (bijv. sessieopslag voor het claimproces). Voor deze cookies is geen toestemming vereist.
          </p>
          <p>
            Wij plaatsen <strong>geen analytische of tracking cookies van derden</strong> zonder jouw toestemming. Indien wij in de toekomst analytische tools inzetten, zullen wij je hierover vooraf informeren en jouw toestemming vragen.
          </p>
        </LegalSection>

        <LegalSection title="9. Klacht indienen">
          <p>
            Indien je van mening bent dat wij jouw persoonsgegevens onrechtmatig verwerken, heb je het recht een klacht in te dienen bij de toezichthoudende autoriteit:
          </p>
          <div style={{
            background: '#fff', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '1rem 1.25rem', fontSize: '0.875rem', lineHeight: 1.8,
          }}>
            <strong>Autoriteit Persoonsgegevens</strong><br />
            Website: <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>autoriteitpersoonsgegevens.nl</a><br />
            Telefoon: 088 - 1805 250
          </div>
        </LegalSection>

        <LegalSection title="10. Wijzigingen">
          <p>
            Wij behouden het recht deze privacyverklaring te wijzigen. De meest recente versie is altijd beschikbaar op <strong>aerefund.com/privacy</strong>. Bij wezenlijke wijzigingen informeren wij jou per email.
          </p>
        </LegalSection>


        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Vragen over deze privacyverklaring?{' '}
            <a href="mailto:privacy@aerefund.com" style={{ color: 'var(--blue)' }}>privacy@aerefund.com</a>
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link href="/algemene-voorwaarden" style={{ fontSize: '0.8125rem', color: 'var(--blue)', textDecoration: 'none' }}>Algemene voorwaarden →</Link>
            <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Terug naar home</Link>
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--navy)', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>© 2026 Aerefund.com</p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/passagiersrechten" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Passagiersrechten</Link>
            <Link href="/faq" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>FAQ</Link>
            <Link href="/algemene-voorwaarden" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Voorwaarden</Link>
            <Link href="/contact" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1.0625rem',
        color: 'var(--navy)', marginBottom: '0.875rem',
        paddingBottom: '0.5rem', borderBottom: '1.5px solid var(--border)',
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.75,
        display: 'flex', flexDirection: 'column', gap: '0.625rem',
      }}>
        {children}
      </div>
    </section>
  )
}

function DataTable({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', margin: '0.25rem 0' }}>
      {rows.map(([gegeven, doel], i) => (
        <div
          key={i}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1.5fr',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
            background: i % 2 === 0 ? '#fff' : 'var(--bg)',
          }}
        >
          <div style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{gegeven}</div>
          <div style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem', color: 'var(--text-sub)', borderLeft: '1px solid var(--border)' }}>{doel}</div>
        </div>
      ))}
    </div>
  )
}
