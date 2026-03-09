import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Veelgestelde vragen — Aerefund.nl',
  description: 'Antwoorden op de meest gestelde vragen over vluchtclaims, EC 261/2004 compensatie, kosten en het claimproces bij Aerefund.nl.',
}

const FAQ_CATEGORIES = [
  {
    title: 'Kosten & betaling',
    items: [
      {
        q: 'Wat kost het?',
        a: 'De check is volledig gratis. Als je besluit de claim in te dienen, sturen wij een factuur van €42 (incl. BTW) per email. Bij een succesvolle uitbetaling rekenen wij ook 10% commissie over de ontvangen compensatie. Geen succes? Dan geen commissie.',
      },
      {
        q: 'Wanneer moet ik betalen?',
        a: 'Je ontvangt de factuur van €42 binnen 24 uur nadat je de claim hebt ingediend. Je hebt 14 dagen om te betalen. Er is geen vooruitbetaling vereist.',
      },
      {
        q: 'Hoe wordt de commissie berekend?',
        a: 'De commissie van 10% is alleen verschuldigd als de airline daadwerkelijk compensatie uitkeert. De commissie wordt berekend over het bruto uitgekeerde bedrag, exclusief BTW.',
      },
      {
        q: 'Betaalt de airline rechtstreeks aan mij?',
        a: 'In de meeste gevallen ja — de airline betaalt de compensatie rechtstreeks aan jou als passagier. Wij ontvangen de betaling niet als tussenpersoon.',
      },
    ],
  },
  {
    title: 'Vluchten & aanspraak',
    items: [
      {
        q: 'Welke vluchten komen in aanmerking?',
        a: 'Vluchten die vertrekken vanuit een EU-luchthaven (ongeacht de airline), én vluchten die landen op een EU-luchthaven met een EU-airline. Je aankomst moet minimaal 3 uur vertraagd zijn, de vlucht mag niet geannuleerd zijn om buitengewone omstandigheden, en je moet een bevestigde boeking hebben gehad.',
      },
      {
        q: 'Hoelang heb ik de tijd om een claim in te dienen?',
        a: 'Je hebt in Nederland 3 jaar de tijd na de vluchtdatum. Hoe ouder de vlucht, hoe moeilijker de bewijsvoering — wacht dus niet te lang. Vul je vluchtnummer in, dan controleren wij direct of je claim nog geldig is.',
      },
      {
        q: 'Geldt EC 261/2004 ook voor Ryanair en andere budgetmaatschappijen?',
        a: 'Ja, absoluut. De EU-verordening geldt voor alle airlines die vanuit een EU-luchthaven vliegen, inclusief Ryanair, easyJet, Transavia en andere lowcostcarriers. Zij zijn verplicht dezelfde compensatie te betalen als KLM of Lufthansa.',
      },
      {
        q: 'Mijn vlucht was een pakketreis — heb ik alsnog aanspraak?',
        a: 'Ja. EC 261/2004 geldt ook bij pakketreizen. De claim richt zich tegen de uitvoerende airline, niet de touroperator. Wij kunnen de claim voor je indienen.',
      },
      {
        q: 'Ik heb een vliegticket tweedehands gekocht. Heb ik nog recht op compensatie?',
        a: 'De compensatie is persoonsgebonden aan de passagier die daadwerkelijk aan boord was. Als jij de passagier bent geweest, heb je recht op compensatie — ook als het ticket originally van iemand anders was.',
      },
    ],
  },
  {
    title: 'Het claimproces',
    items: [
      {
        q: 'Hoe werkt het precies?',
        a: 'Je vult je vluchtnummer en datum in op onze website. Wij controleren automatisch of je vlucht in aanmerking komt en hoeveel compensatie je kunt verwachten. Als je akkoord gaat, sturen wij een formele claimbrief naar de airline namens jou. Jij doet niets.',
      },
      {
        q: 'Hoe lang duurt het voordat ik mijn geld ontvang?',
        a: 'Dit varieert sterk per airline. KLM betaalt gemiddeld binnen 6-8 weken. Ryanair kan 3-6 maanden duren. Als de airline weigert, kan het claimproces langer duren via een geschillencommissie of rechter.',
      },
      {
        q: 'Wat als de airline weigert te betalen?',
        a: 'Wij kennen de weigeringstactieken van elke airline en sturen herhaalde sommatiesbrieven. Als dat niet werkt, verwijzen wij de zaak door naar een juridisch geschillenorgaan (Geschillencommissie Luchtvaart) of een rechter. In dat geval informeren wij jou altijd eerst.',
      },
      {
        q: 'Heb ik een boardingpass nodig?',
        a: 'Een boardingpass is handig als bewijsmateriaal, maar niet verplicht. Een boekingsbevestiging of je boekingreferentienummer zijn ook voldoende. Als je niets meer hebt, kunnen wij in veel gevallen de vluchtdata bij de airline opvragen.',
      },
      {
        q: 'Kan ik een claim indienen voor meerdere passagiers tegelijk?',
        a: 'Ja. Tijdens het invullen van het formulier kun je medereizgers toevoegen. Elke passagier heeft individueel recht op compensatie, dus een gezin van 4 ontvangt 4× het compensatiebedrag.',
      },
    ],
  },
  {
    title: 'Buitengewone omstandigheden',
    items: [
      {
        q: 'Mijn airline zegt dat het "buitengewone omstandigheden" waren. Wat nu?',
        a: 'Airlines roepen dit argument regelmatig onterecht in. Technische mankementen, personeelstekort of IT-storingen zijn bijna nooit buitengewone omstandigheden. Wij beoordelen je claim en bepalen of de weigeringsgrond steekhoudend is. De check is gratis.',
      },
      {
        q: 'Is een staking altijd een buitengewone omstandigheid?',
        a: 'Niet altijd. Een staking van de eigen medewerkers van de airline (bijv. cabinepersoneel) is in de EU-rechtspraak géén buitengewone omstandigheid — de airline had dit intern moeten oplossen. Een staking van ATC-medewerkers is dat soms wel.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>
      <SiteNav />

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '3.5rem 0 3rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--blue)', marginBottom: '0.75rem' }}>
            Veelgestelde vragen
          </p>
          <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: 'var(--navy)', lineHeight: 1.15, marginBottom: '1rem' }}>
            Alles wat je wilt weten over vluchtclaims
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-sub)', lineHeight: 1.65, maxWidth: '520px', margin: '0 0 1.5rem' }}>
            Staat je vraag er niet bij?{' '}
            <Link href="/contact" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
              Stuur ons een bericht.
            </Link>
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        {FAQ_CATEGORIES.map((cat) => (
          <section key={cat.title} style={{ marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem',
              color: 'var(--navy)', marginBottom: '1rem',
              paddingBottom: '0.625rem', borderBottom: '1.5px solid var(--border)',
            }}>
              {cat.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {cat.items.map((item) => (
                <div key={item.q} style={{
                  background: '#fff', border: '1px solid var(--border)', borderRadius: '12px',
                  padding: '1.25rem 1.375rem', boxShadow: '0 1px 3px rgba(15,30,61,0.04)',
                }}>
                  <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--navy)', margin: '0 0 0.5rem' }}>
                    {item.q}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.7, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div style={{ background: 'var(--navy)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '1.375rem', color: '#fff', marginBottom: '0.75rem' }}>
            Klaar om je claim in te dienen?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Check gratis in 2 minuten of jouw vlucht in aanmerking komt.
          </p>
          <Link href="/#form" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#f97316', color: '#fff',
            fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '1rem',
            padding: '0.875rem 2rem', borderRadius: '10px', textDecoration: 'none',
          }}>
            Check mijn vlucht — gratis
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </main>

      <footer style={{ background: 'var(--navy)', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>© 2025 Aerefund.nl</p>
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
