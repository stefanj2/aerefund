import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  alternates: { canonical: 'https://aerefund.com/algemene-voorwaarden' },
  description: 'Algemene voorwaarden van Aerefund.com voor de indiening van vluchtclaims op basis van EU-verordening EC 261/2004.',
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)' }}>

      <SiteNav />

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>

        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Versie 1.2 — 14 maart 2026
        </p>
        <h1 style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: 'var(--navy)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Algemene Voorwaarden
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-sub)', marginBottom: '3rem', lineHeight: 1.6 }}>
          Aerefund.com — indiening van vluchtclaims op basis van EU-verordening EC 261/2004
        </p>

        <LegalSection title="Artikel 1 — Definities">
          <p>In deze algemene voorwaarden wordt verstaan onder:</p>
          <ul>
            <li><strong>Aerefund.com</strong>: de handelsnaam van GoodbyeGuru, ingeschreven bij de Kamer van Koophandel onder nummer 67332706, gevestigd te Keurenplein 24, 1069 CD Amsterdam.</li>
            <li><strong>Opdrachtgever</strong>: de natuurlijke persoon die Aerefund.com opdracht geeft tot het indienen van een vluchtclaim.</li>
            <li><strong>Claim</strong>: het verzoek tot compensatie op grond van EU-verordening EC 261/2004 bij een luchtvaartmaatschappij.</li>
            <li><strong>Compensatie</strong>: het bedrag dat de luchtvaartmaatschappij uitkeert op grond van EC 261/2004.</li>
            <li><strong>Cessie</strong>: de overdracht van de vordering van de opdrachtgever op de luchtvaartmaatschappij aan Aerefund.com, op grond van BW 3:94.</li>
            <li><strong>Cedent</strong>: de opdrachtgever in diens hoedanigheid als overdrager van de vordering.</li>
            <li><strong>Cessionaris</strong>: Aerefund.com in diens hoedanigheid als overnemer van de vordering.</li>
            <li><strong>Dienst</strong>: het door Aerefund.com indienen en begeleiden van een vluchtclaim als cessionaris.</li>
          </ul>
        </LegalSection>

        <LegalSection title="Artikel 2 — Toepasselijkheid">
          <p>
            Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Aerefund.com en de opdrachtgever. Door het indienen van een claim via onze website gaat de opdrachtgever akkoord met deze voorwaarden. Afwijkingen zijn alleen geldig als zij schriftelijk zijn overeengekomen.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 3 — Dienstverlening">
          <p>Aerefund.com biedt de volgende diensten aan:</p>
          <ol>
            <li>Analyse van de vluchtgegevens op basis van EC 261/2004;</li>
            <li>Opstellen en indienen van een formele claimbrief bij de luchtvaartmaatschappij;</li>
            <li>Bezwaarprocedure indien de luchtvaartmaatschappij de claim afwijst;</li>
            <li>Indien nodig: doorverwijzing naar een juridisch geschillenorgaan (bijv. de Geschillencommissie Luchtvaart of een rechtbank).</li>
          </ol>
          <p>
            Aerefund.com beoordeelt naar eigen inzicht of een claim kansrijk is. Wij behouden het recht om een opdracht te weigeren of te beëindigen indien wij van oordeel zijn dat de claim weinig kans van slagen heeft. In dat geval wordt de opdrachtgever hiervan schriftelijk op de hoogte gesteld.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 4 — Vorderingsoverdracht (cessie)">
          <p>
            Door het indienen van een claim via Aerefund.com draagt de opdrachtgever (cedent) zijn vordering
            op de luchtvaartmaatschappij op grond van EU-verordening EC 261/2004 over aan Aerefund.com
            (cessionaris). Deze overdracht (cessie) geschiedt door middel van de elektronische akte die
            tot stand komt op het moment dat de opdrachtgever de checkbox voor akkoord aanvinkt bij het
            indienen van de claim (art. 3:94 lid 3 BW jo. art. 6:227a lid 1 BW).
          </p>
          <p>De cessie omvat:</p>
          <ol>
            <li>Het recht op compensatie op grond van EC 261/2004 voor de betreffende vlucht;</li>
            <li>Het recht om de claim formeel in te dienen en te begeleiden bij de luchtvaartmaatschappij;</li>
            <li>Het recht om de compensatie als eigen schuldeiser te innen bij de luchtvaartmaatschappij.</li>
          </ol>
          <p>
            Aerefund.com zal de luchtvaartmaatschappij van de cessie in kennis stellen (mededeling als
            bedoeld in art. 3:94 lid 1 BW) door middel van de claimbrief. Na ontvangst van de compensatie
            maakt Aerefund.com — na inhouding van de servicenota (€42) en de commissie van 25% — het
            nettobedrag binnen 5 werkdagen over naar het door de opdrachtgever nader op te geven IBAN.
          </p>
          <p>
            De overdracht is beperkt tot de ingediende claim en vervalt automatisch zodra de claim is
            afgewikkeld of door de opdrachtgever schriftelijk wordt ingetrokken. Aerefund.com is niet
            bevoegd namens de opdrachtgever gerechtelijke procedures te starten zonder diens uitdrukkelijke
            schriftelijke toestemming.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 5 — Tarieven en betaling">
          <div style={{
            background: 'var(--green-dim)', border: '1.5px solid var(--green-border)',
            borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.5rem',
          }}>
            <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
              Betaling vindt altijd <em>achteraf</em> plaats, op factuurbasis.
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Er wordt tijdens het claimproces geen betaling gevraagd. Je ontvangt pas een factuur <strong>nadat je de claim hebt ingediend</strong>. Je hoeft dus niets vooraf te betalen om gebruik te maken van onze dienst.
            </p>
          </div>
          <ol>
            <li>
              <strong>Indieningstarief — achteraf per factuur:</strong> voor het opstellen en indienen van de claim brengt Aerefund.com een vast bedrag van <strong>€42 (inclusief BTW)</strong> in rekening. De factuur wordt binnen 24 uur na indiening per email verstuurd. Betaling dient te geschieden binnen <strong>14 dagen na factuurdatum</strong>. Dit bedrag is verschuldigd ongeacht de uitkomst van de claim.
            </li>
            <li>
              <strong>Commissie bij succes:</strong> bij succesvolle uitbetaling van compensatie door de luchtvaartmaatschappij is Aerefund.com gerechtigd een commissie van <strong>25% van het uitgekeerde compensatiebedrag (exclusief BTW)</strong> in te houden. Deze commissie is uitsluitend verschuldigd indien daadwerkelijk compensatie wordt uitbetaald.
            </li>
            <li>
              Bij niet-tijdige betaling van de factuur is Aerefund.com gerechtigd de dienstverlening op te schorten totdat betaling heeft plaatsgevonden.
            </li>
            <li>
              De luchtvaartmaatschappij betaalt de compensatie rechtstreeks aan Aerefund.com. Na ontvangst maakt Aerefund.com — na inhouding van de servicenota (€42) en de commissie van 25% — het nettobedrag binnen <strong>5 werkdagen</strong> over naar het door de opdrachtgever nader op te geven IBAN. De opdrachtgever machtigt Aerefund.com uitdrukkelijk tot verrekening van de servicenota en commissie met de ontvangen compensatie alvorens het nettobedrag over te maken.
            </li>
            <li>
              Indien de luchtvaartmaatschappij de compensatie rechtstreeks aan de opdrachtgever uitbetaalt, is de opdrachtgever gehouden de verschuldigde commissie van <strong>25% (exclusief BTW)</strong> over het ontvangen compensatiebedrag binnen <strong>14 dagen</strong> na ontvangst aan Aerefund.com te voldoen. Aerefund.com stuurt hiervoor een aparte factuur.
            </li>
          </ol>
        </LegalSection>

        <LegalSection title="Artikel 6 — Verplichtingen opdrachtgever">
          <p>De opdrachtgever is verplicht:</p>
          <ol>
            <li>Correcte en volledige informatie te verstrekken over de vlucht, de vertraging en de persoonlijke gegevens;</li>
            <li>Mee te werken aan het claimproces, waaronder het tijdig aanleveren van gevraagde documenten (zoals boardingpass of boekingsbevestiging);</li>
            <li>Aerefund.com onmiddellijk te informeren indien de opdrachtgever zelf of via een derde een regeling treft met de luchtvaartmaatschappij;</li>
            <li>Niet gelijktijdig een identieke claim in te dienen via een andere partij of rechtstreeks bij de luchtvaartmaatschappij gedurende de looptijd van de overeenkomst.</li>
            <li>Gevraagde aanvullende informatie of documenten te verstrekken binnen de door Aerefund.com gestelde termijn (minimaal 14 dagen), indien dit noodzakelijk is voor de behandeling van de claim.</li>
            <li>Op eerste verzoek van Aerefund.com het bankrekeningnummer (IBAN) te verstrekken waarop de netto-compensatie kan worden overgemaakt.</li>
          </ol>
          <p>
            Bij het verstrekken van onjuiste of onvolledige informatie is de opdrachtgever aansprakelijk voor de schade die Aerefund.com daardoor lijdt.
          </p>
          <p>
            Indien de opdrachtgever nalaat tijdig te reageren op een verzoek om aanvullende informatie of documenten die noodzakelijk zijn voor de behandeling van de claim, en dit leidt tot extra werkzaamheden aan de zijde van Aerefund.com, is Aerefund.com gerechtigd de daadwerkelijk gemaakte juridische en administratieve kosten te verhalen op de opdrachtgever. Deze kosten bedragen <strong>€120 per uur (exclusief BTW)</strong>. Aerefund.com zal de opdrachtgever voorafgaand aan het in rekening brengen van deze kosten schriftelijk informeren en een laatste redelijke termijn stellen om de benodigde informatie alsnog aan te leveren.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 7 — Geen garantie op uitkomst">
          <p>
            Aerefund.com streeft naar een succesvolle afwikkeling van iedere claim, maar kan geen garantie geven op de uitkomst. Het recht op compensatie is afhankelijk van factoren die buiten de invloedssfeer van Aerefund.com liggen, waaronder de beslissing van de luchtvaartmaatschappij en de toepasselijkheid van uitzonderingsgronden (buitengewone omstandigheden als bedoeld in EC 261/2004).
          </p>
          <p>
            Het indieningstarief van €42 is in alle gevallen verschuldigd, ook indien de claim wordt afgewezen. De commissie van 25% is alleen verschuldigd bij daadwerkelijke uitbetaling van compensatie.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 8 — Aansprakelijkheid">
          <ol>
            <li>Aerefund.com is niet aansprakelijk voor schade die voortvloeit uit het niet of niet tijdig verkrijgen van compensatie van de luchtvaartmaatschappij.</li>
            <li>De aansprakelijkheid van Aerefund.com is in alle gevallen beperkt tot het door de opdrachtgever betaalde indieningstarief (€42).</li>
            <li>Aerefund.com is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst.</li>
          </ol>
        </LegalSection>

        <LegalSection title="Artikel 9 — Herroepingsrecht">
          <p>
            De opdrachtgever heeft het recht de overeenkomst te herroepen binnen <strong>14 dagen</strong> na het sluiten daarvan, zonder opgave van redenen. Herroeping dient schriftelijk te geschieden via <a href="mailto:info@aerefund.com" style={{ color: 'var(--blue)' }}>info@aerefund.com</a>.
          </p>
          <p>
            Indien de opdrachtgever uitdrukkelijk verzoekt om de dienstverlening te starten vóór het verstrijken van de herroepingstermijn en de dienst is volledig uitgevoerd, vervalt het herroepingsrecht.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 10 — Beëindiging">
          <p>
            De opdrachtgever kan de overeenkomst op elk moment schriftelijk opzeggen via <a href="mailto:info@aerefund.com" style={{ color: 'var(--blue)' }}>info@aerefund.com</a>. Bij opzegging na aanvang van de dienstverlening blijft het indieningstarief van €42 verschuldigd. Indien de claim op het moment van opzegging reeds succesvol is afgewikkeld, blijft de commissie van 25% verschuldigd.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 11 — Toepasselijk recht en geschillen">
          <p>
            Op deze overeenkomst is uitsluitend Nederlands recht van toepassing. Geschillen worden bij voorkeur in goed overleg opgelost. Indien dat niet lukt, worden geschillen voorgelegd aan de bevoegde rechtbank, tenzij de opdrachtgever als consument kiest voor de wettelijk bevoegde rechter in zijn woonplaats.
          </p>
          <p>
            Klachten kunnen ook worden ingediend via het Europees ODR-platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>ec.europa.eu/consumers/odr</a>.
          </p>
        </LegalSection>

        <LegalSection title="Artikel 12 — Wijziging voorwaarden">
          <p>
            Aerefund.com behoudt zich het recht voor deze algemene voorwaarden te wijzigen. Wijzigingen worden ten minste 30 dagen van tevoren aangekondigd via de website. Op lopende overeenkomsten zijn de voorwaarden van toepassing zoals geldend op het moment van het sluiten van de overeenkomst.
          </p>
        </LegalSection>


        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Vragen over deze voorwaarden? Stuur een email naar{' '}
            <a href="mailto:info@aerefund.com" style={{ color: 'var(--blue)' }}>info@aerefund.com</a>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'var(--blue)', textDecoration: 'none' }}>Privacyverklaring →</Link>
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
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy</Link>
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
