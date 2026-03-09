# Marketingplan: VluchtVertraagd.nl
### De Gratis Analyse Funnel — Volledig Uitgewerkt
> *Doorvoerd met de principes van Eugene Schwartz (Mass Desire, State of Awareness, Sophistication, Mechanization)*

---

## De Kern van Alles: De Funnel

Het gehele marketing-ecosysteem draait om één ding:
**de bestaande woede en het onrechtsgevoel kanaliseren via de gratis analyse — en de uitkomst laat ze converteren.**

*Schwartz: "Copy cannot create desire — it can only channel existing desire."*
De frustatie zit al in de markt. De wachttijd, het gevoel van onmacht, de afwijzende email van de airline. Onze funnel geeft die emotie een concrete uitweg.

```
VERKEER
  │
  ▼
┌─────────────────────────────┐
│  GRATIS ANALYSE             │  ← Lage drempel, iedereen doet het
│  "Check gratis in 60 sec"   │    Ons mechanisme (Schwartz Stadium 3)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  UITKOMST PAGINA            │  ← Dit is het conversiemoment
│  "KLM heeft jou €400        │    Redefinitie-frame (Schwartz):
│   schuldig staan, Jan."     │    airline = debtor, klant = crediteur
│  "Wij halen dat op — €42"   │
└──────────────┬──────────────┘
               │
         Ja ──►│◄── Nee (retargeting)
               │
               ▼
┌─────────────────────────────┐
│  BETALING €42               │  ← Commitment moment
│  + Volmacht ondertekenen    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  DASHBOARD + UPDATES        │  ← Vertrouwen opbouwen
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  GEWONNEN → 10% COMMISSIE   │  ← Blije klant = reviews + referrals
└─────────────────────────────┘
```

---

## Deel 1: De Gratis Analyse — Technisch Uitgewerkt

### Waarom gratis?

De gratis analyse is geen kostenpost — het is je **sterkste marketingtool**.

| Met gratis analyse | Zonder gratis analyse |
|---|---|
| Lage drempel → veel gebruikers | Hoge drempel → weinig aanmeldingen |
| Uitkomst creëert urgentie | Geen emotionele haak |
| Leads altijd te retargeten | Anoniem verkeer verloren |
| Bouwt vertrouwen voor €42 | Grote stap naar betaling |
| Data over welke vluchten → betere ads | Geen inzicht in doelgroep |

---

### Stap 1: De Analyse Pagina

**URL:** vluchtvetraagd.nl/analyse *(of direct op de homepage)*

**Doel:** Zo min mogelijk wrijving. Maximaal 3 velden om te starten.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│         Controleer gratis of jij recht hebt op              │
│                compensatie — in 60 seconden                  │
│                                                              │
│   Vluchtnummer:    [ KL 1234              ]                  │
│   Vertrekdatum:    [ 15-08-2025    ▾ ]                       │
│   Wat gebeurde er? ( ) Vertraagd  ( ) Geannuleerd            │
│                    ( ) Boarding geweigerd                    │
│                                                              │
│         [ CHECK MIJN VLUCHT — GRATIS  → ]                   │
│                                                              │
│   🔒 Geen account nodig · Geen verplichtingen · 100% gratis  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Wat er achter de schermen gebeurt:**
- Vluchtnummer + datum → ophalen bij FlightAware API of AviationStack API (goedkope API die vluchtdata levert)
- Systeem bepaalt automatisch: was de vertraging >3 uur? Wat was de afstand? Welke airline?
- Op basis hiervan wordt het compensatiebedrag berekend
- Resultaat verschijnt binnen 5 seconden

**Vluchtdata APIs:**
| API | Prijs | Wat je krijgt |
|---|---|---|
| AviationStack | Gratis t/m 500 req/maand, daarna €10/mnd | Vertrek/aankomsttijden, vertraging |
| FlightAware AeroAPI | $0,01 per request | Meest accuraat |
| OpenSky Network | Gratis | Historische vluchtdata |

**Aanbeveling:** Start met AviationStack gratis tier, switch naar FlightAware bij groei.

---

### Stap 2: De Uitkomst Pagina — Het Conversiemoment

Dit is de **belangrijkste pagina van je hele website**. Hier beslist de klant.

#### Scenario A: Positieve uitkomst ✓

**Schwartz — Redefinitie:** Verander het frame van "jij hebt recht op" (passief) naar "KLM heeft jou schuldig" (airline is debtor). Dit verhoogt urgentie en bereidheid om te handelen fundamenteel.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   KLM heeft jou €400 schuldig staan, Jan.                    │
│                                                              │
│   Jouw vlucht KL1234 van 15 augustus landde 4u18m te laat.  │
│   Op grond van EU-recht (EC 261/2004, artikel 7) is KLM      │
│   verplicht jou te compenseren. Ze hebben dat niet gedaan.   │
│                                                              │
│   ┌──────────────────────────────────┐                       │
│   │   💶  € 400,—  per persoon       │                       │
│   │   Amsterdam → Barcelona (1.654km)│                       │
│   └──────────────────────────────────┘                       │
│                                                              │
│   Hoeveel mensen in jouw reisgezelschap?                     │
│   [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5+ ]                            │
│                                                              │
│   Jullie totale vergoeding: € 800,—  (2 personen)           │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │  Wat kost het jou?                                   │   │
│   │  • €42 eenmalige administratiekosten                 │   │
│   │  • 10% commissie (€80) — alleen bij succes           │   │
│   │  • Jij ontvangt netto: minimaal €678                 │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   ⏱  KLM reageert gemiddeld binnen 6–8 weken               │
│   ✓  Wij regelen alles — jij hoeft niets te doen           │
│                                                              │
│   [ 🚀 JA, DIEN MIJN CLAIM IN VOOR €42  →  ]               │
│                                                              │
│   Of: Sla op en besluit later  (link per email)             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Psychologische triggers op deze pagina:**
- Persoonlijke naam (als ze die al ingevuld hebben)
- Exact vluchtnummer en datum → bewijst dat het systeem klopt
- Grote euro-bedrag prominent → ankert de waarde
- Schuifregelaar/knoppen voor aantal personen → actieve betrokkenheid + hogere waarde
- Transparante kostenopbouw → vertrouwen
- Sociale bewijskracht onder de knop

**Onder de CTA-knop (vertrouwenselementen):**
```
┌─────────────────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐  "Binnen 7 weken €800 ontvangen!"        │
│  — Marieke en Tom uit Utrecht                       │
│                                                     │
│  🔒 Veilige betaling via iDEAL                      │
│  📋 Wij hebben al 1.200+ claims succesvol afgehandeld│
│  ↩️  Geen claim? Administratiekosten worden deels    │
│      gerestitueerd.                                  │
└─────────────────────────────────────────────────────┘
```

---

#### Scenario B: Negatieve uitkomst ✗

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ⚠️  Helaas, jouw vlucht komt mogelijk niet in aanmerking  │
│                                                              │
│   Vlucht KL1234 — vertraging was 2u45m                      │
│   EC 261/2004 geldt vanaf 3 uur aankomstvertraging.         │
│                                                              │
│   Mogelijke redenen:                                         │
│   • De vertraging was minder dan 3 uur                      │
│   • De vlucht vertrok buiten de EU met een niet-EU airline  │
│   • De vlucht is ouder dan 3 jaar                           │
│                                                              │
│   Twijfel je? Onze experts kijken altijd nog even mee.      │
│   [  Laat een expert gratis meekijken  ]                     │
│                                                              │
│   Andere vlucht gehad? [ Doe een nieuwe analyse ]            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Belangrijk:** Zelfs een negatieve uitkomst is waardevol — je vangt het emailadres, kunt retargeten, en misschien klopt de automatische analyse niet 100%. Een expert-check als vangnet voorkomt dat je geld laat liggen.

---

#### Scenario C: Twijfelachtig / Niet te controleren

```
Wij kunnen jouw vlucht niet automatisch verifiëren.
Dit kan komen door:
• Vlucht te recent (data nog niet beschikbaar)
• Kleine regionale airline

Wil je dat een van onze experts dit handmatig controleert?
→ Laat je emailadres achter, wij nemen binnen 24u contact op.
[  Ja, controleer mijn vlucht handmatig — gratis  ]
```

---

### Stap 3: De Betaalpagina (€42)

Na klikken op "Dien mijn claim in":

```
Stap 1 van 3: Jouw gegevens
  Naam: [          ]  Achternaam: [          ]
  Email: [                        ]
  Telefoon: [              ] (optioneel)

Stap 2 van 3: Medereizigiers (indien van toepassing)
  + Voeg reiziger toe

Stap 3 van 3: Betaling
  Administratiekosten: €42,00
  [ iDEAL ▾ ]  [ Creditcard ]  [ PayPal ]

  ☐ Ik ga akkoord met de algemene voorwaarden
  ☐ Ik machtiger VluchtVertraagd.nl om namens mij op te treden

  [ BETAAL NU →  €42,00 ]

  🔒 SSL-beveiligde betaling
```

---

## Deel 2: Verkeer Genereren naar de Analyse

### Kanaal 1: Google Search Ads

**Het principe:** mensen zoeken op Google direct NA hun vertraging. Dit is het perfecte moment.

**Campagnestructuur:**

```
Campagne 1: Generieke zoekwoorden
├── Ad Group: "Vlucht vertraagd"
│   Keywords: vlucht vertraagd compensatie, vliegtuig vertraagd geld,
│             vertraagde vlucht claim, vlucht vertraging vergoeding
│
├── Ad Group: "Vlucht geannuleerd"
│   Keywords: vlucht geannuleerd compensatie, annulering vlucht geld terug,
│             geannuleerde vlucht rechten
│
└── Ad Group: "Airline-specifiek"
    Keywords: KLM vertraging compensatie, Ryanair geannuleerd vergoeding,
              Transavia vertraagd claim, EasyJet annulering geld

Campagne 2: Branded
    Keywords: vluchtvetraagd, vlucht vetraagd nl

Campagne 3: Concurrenten
    Keywords: euclaim alternatief, aviclaim ervaringen
```

**Advertentieteksten — Per Schwartz Awareness Stadium:**

```
Advertentie A — Stadium 3 (kent wens, niet het product):
Titel 1: Airlines Hebben Jou €400 Schuldig
Titel 2: Check Gratis Of Dat Klopt — 60 Seconden
Titel 3: Al €312.000 Opgehaald · 85% Succesrate
Beschrijving: Jouw vlucht was vertraagd — EC 261/2004 verplicht de airline
              tot betaling. Check gratis of jij in aanmerking komt.
URL: vluchtvetraagd.nl/gratis-analyse

Advertentie B — Stadium 4 (kent probleem, niet de oplossing):
Titel 1: Was Je Vlucht Meer Dan 3 Uur Te Laat?
Titel 2: Dan Heeft De Airline Jou Geld Schuldig
Titel 3: Gratis Check · Resultaat In 60 Seconden
Beschrijving: Wist jij dat de airline verplicht is jou te betalen?
              Voer je vluchtnummer in — wij berekenen hoeveel.
URL: vluchtvetraagd.nl/gratis-analyse

Advertentie C — Stadium 5 / Identificatie (koud verkeer):
Titel 1: Airlines Rekenen Erop Dat Jij Opgeeft
Titel 2: 97% Doet Dat Ook. Jij Hoeft Dat Niet.
Titel 3: Check Gratis Of Jij Recht Hebt — 60 Sec
Beschrijving: Had je ooit een vlucht met meer dan 3 uur vertraging?
              Dan staat er waarschijnlijk geld op jou te wachten. Gratis check.
URL: vluchtvetraagd.nl/gratis-analyse
```

**Budget & verwachting:**

| Maand | Budget | Klikken (CPC €2,50) | Analyses (CR 40%) | Betalingen (CR 15%) | Omzet |
|---|---|---|---|---|---|
| 1 | €500 | 200 | 80 | 12 | €504 + toekomstige commissie |
| 3 | €1.000 | 400 | 160 | 24 | €1.008 + commissie |
| 6 | €2.000 | 800 | 320 | 48 | €2.016 + commissie |

*CR analyse = conversieratio van klik naar gratis analyse doen*
*CR betaling = conversieratio van analyse naar €42 betalen*

**Tip:** Gebruik Google's "Responsive Search Ads" — vul 10–15 titels en beschrijvingen in, Google test automatisch welke combinaties het beste werken.

---

### Kanaal 2: SEO — Organisch Gratis Verkeer

SEO duurt 3–6 maanden maar levert daarna structureel gratis verkeer.

**Contentstrategie:**

**Categorie A: Informatief — Camouflage Principe (Schwartz)**

SEO-content werkt als camouflage: het voelt als consumentenadvies, niet als reclame. De lezer verlaagt zijn verdediging. De CTA naar de gratis analyse komt organisch aan het einde.

| Artikel | Doel zoekwoord | Schwartz-titel (camouflage) |
|---|---|---|
| Vlucht vertraagd: wat zijn jouw rechten in 2026? | vlucht vertraagd rechten | "Wat airlines je nooit vertellen over jouw rechten bij vertraging" |
| EC 261/2004 uitgelegd: wanneer heb jij recht op compensatie? | ec 261 2004 | "De EU-wet die airlines verplicht jou te betalen — en hoe ze dat omzeilen" |
| Vlucht geannuleerd? Dit kun jij claimen (stappenplan) | vlucht geannuleerd compensatie | "Vlucht geannuleerd: zo haal jij jouw geld op (stap voor stap)" |
| Buitengewone omstandigheden: wanneer betaalt de airline NIET? | buitengewone omstandigheden vlucht | "Technisch probleem is géén overmacht — dit weet de airline ook" |
| Hoe lang duurt een vluchtclaim? Eerlijke tijdlijn | vluchtclaim hoe lang | "Waarom 97% van gedupeerde reizigers nooit hun geld terugkrijgt" |

**Categorie B: Airline-specifiek (hoog koopintentie)**

| Artikel | Doel zoekwoord |
|---|---|
| KLM vertraging compensatie claimen: zo werkt het | KLM vertraging compensatie |
| Ryanair weigert te betalen: wat nu? | Ryanair compensatie weigering |
| Transavia annulering: recht op €250 of €400? | Transavia annulering compensatie |
| EasyJet claim indienen: stap voor stap | EasyJet claim |
| Corendon vlucht vertraagd: jouw rechten | Corendon vertraging |

**Categorie C: Vergelijkend (mensen die twijfelen)**

| Artikel | Doel zoekwoord |
|---|---|
| Zelf claim indienen vs. claimbureau: wat is slimmer? | claim zelf indienen |
| EUclaim vs. VluchtVertraagd.nl — eerlijke vergelijking | euclaim ervaringen |
| Is een claimbureau het waard? Rekensommetje | claimbureau kosten |

**Content format per artikel:**
- 1.200–2.000 woorden
- Duidelijke H1, H2, H3 structuur
- FAQ-sectie onderaan (scoort in Google Featured Snippets)
- Interne link naar de gratis analyse
- Actueel houden (jaartal in titel updaten)

---

### Kanaal 3: Social Media Ads

**Platform focus:** Instagram & TikTok voor bereik, Facebook voor retargeting

**Hook-formules die werken:**

```
TikTok/Reels Video — Stadium 5 Identificatie (Schwartz):

[0–3 sec] Identificatie-hook — beschrijf hun ervaring, geen product:
"Je hebt er geen zin meer in gehad. Je was moe, je was gefrustreerd,
 je hebt je koffers gepakt en bent naar huis gegaan."

[3–7 sec] Onthulling (de twist):
"Maar de airline is je nog steeds geld schuldig.
 Op basis van Europese wet: €250 tot €600 per persoon."

[7–11 sec] Vijand benoemen (Intensificatie):
"Airlines weten dat 97% van de mensen het opgeeft.
 Ze budgetteren hier letterlijk op.
 Ze rekenen op jouw stilzwijgen."

[11–15 sec] Zachte CTA (Camouflage — geen harde verkoop):
"Benieuwd of jij recht hebt? Check gratis — link in bio. 60 seconden."
```

**Waarom dit werkt (Schwartz):** Koud TikTok-publiek is Stadium 5 — volledig onbewust. Een productpitch werkt hier niet. De identificatie-hook zorgt dat ze stoppen met scrollen omdat ze zichzelf herkennen. Pas daarna is de onthulling geloofwaardig.

**Contentkalender social media:**

| Dag | Type content | Voorbeeld |
|---|---|---|
| Maandag | Educatief | "3 dingen die airlines je NIET vertellen over vertragingen" |
| Woensdag | Case study | "Zo haalden we €1.200 op voor een gezin van 3 uit Amsterdam" |
| Vrijdag | Interactief | Poll: "Had jij ooit een vlucht met meer dan 3 uur vertraging?" |
| Zondag | Tip | "Tip: bewaar altijd je boardingpass — dit heb je nodig voor een claim" |

**Betaalde social strategie:**

```
Laag 1 — Koude doelgroep (awareness):
  Doelgroep: NL, 25–55 jaar, interesse in reizen, vliegvakanties
  Budget: €5/dag
  Doel: Videoweergaven en websitebezoek
  Creatie: korte video "Wist jij dat..."

Laag 2 — Warme doelgroep (retargeting):
  Doelgroep: Website bezoekers laatste 30 dagen (pixel)
  Budget: €5/dag
  Doel: Conversie naar gratis analyse
  Creatie: "Jij bezocht onze site — doe nu de gratis check"

Laag 3 — Heropvolging (retargeting):
  Doelgroep: Mensen die gratis analyse deden maar niet betaalden
  Budget: €3/dag
  Creatie: "Je uitkomst staat nog klaar — claim nu voor €42"
```

---

### Kanaal 4: Retargeting — De Lekkende Emmer Dichten

**Scenario:** 100 mensen doen de gratis analyse → 85 betalen NIET → dit is je grootste kans.

**Retargetingstrategie per gedrag (Schwartz — Stadium 1–2):**

```
Segment A: Deed analyse, positieve uitkomst, GEEN betaling (Stadium 1–2)
  → Email: "KLM wacht erop dat jij het opgeeft, Jan — €400 ligt te wachten"
  → Facebook Ad: "Jan, jouw analyse toonde €400. KLM heeft dat nog niet betaald."
  → Google Display: Gepersonaliseerde banner met exact bedrag + "Nog [X] mnd"

Segment B: Deed analyse, klikte op betalen, VERLIET betaalpagina
  → Email: "Er ging iets mis — jouw €42 betaling is niet afgerond"
  → Directe link terug naar betaalpagina

Segment C: Deed analyse, negatieve uitkomst
  → Email na 2 weken: "Andere vlucht gehad? Doe een nieuwe gratis check"
  → Seizoensgebonden: "Vakantievlucht vertraagd? Check nu gratis"

Segment D: Betaalde, wacht op uitkomst (nurturing)
  → Wekelijkse statusupdates
  → Educatieve emails (hoe het proces werkt)
  → Referral uitnodiging
```

---

### Kanaal 5: Email Funnel

**Email reeks na gratis analyse (NIET betaald) — Schwartz Intensificatie:**

```
Email 1 — Direct na analyse (0 minuten):
  Onderwerp: "KLM wacht erop dat jij het opgeeft, Jan"
  Inhoud: Redefinitie-frame: "KLM heeft jou €400 schuldig staan.
          Ze hebben het nog niet betaald. Ze wachten af of jij iets doet."
  CTA: [Dien mijn claim in — €42]

Email 2 — 24 uur later (Intensificatie):
  Onderwerp: "€400 dat de airline al die tijd van jou afhoudt"
  Inhoud: Verliesframe + urgentie (claims verjaren na 3 jaar)
          "97% van gedupeerde passagiers doet niets.
           Airlines budgetteren hier letterlijk op."
  CTA: [Haal mijn €400 op]

Email 3 — 3 dagen later (Dramatiseer):
  Onderwerp: "Ze lachten toen hij zei dat hij ging claimen"
  Inhoud: Case study: Ryanair weigerde driemaal — op de vierde keer: €250.
          Identificatie: "Ik had het allang opgegeven. Jullie niet."
  CTA: [Wij doen dit ook voor jou — €42]

Email 4 — 7 dagen later (Waarschuwing):
  Onderwerp: "Over [X] dagen kan niemand je meer helpen"
  Inhoud: Verjaringstermijn (3 jaar NL). Echte deadline.
          "De airline hoopt dat jij dit vergeet."
  CTA: [Dien alsnog in — deadline nadert]

Email 5 — 30 dagen later (Heractivering):
  Onderwerp: "Andere vlucht vertraagd gehad?"
  Inhoud: Heractivering met nieuwe check uitnodiging
```

**Email reeks na betaling (klant onboarding) — Schwartz Vertrouwen opbouwen:**

```
Email 1 — Direct na betaling:
  Onderwerp: "Jouw claim is ingediend — KLM staat nu onder druk"
  Inhoud: Bevestiging + actieve taal: "We zijn er mee bezig.
          KLM heeft een wettelijke reactietermijn van 6 weken.
          Wij houden jou elke week op de hoogte." + dashboard link

Email 2 — Dag 3:
  Onderwerp: "Officiële claimbrief verstuurd naar [Airline]"
  Inhoud: Brief is verstuurd. Mechanisme zichtbaar maken:
          "Wij verwezen naar EC 261/2004, artikel 7.
           Ze zijn wettelijk verplicht te reageren."

Email 3 — Week 3 (Intensificatie):
  Onderwerp: "[Airline] denkt nog steeds dat jij het opgeeft, Jan"
  Inhoud: "We hebben een herinnering gestuurd. Ze hebben nog 3 weken.
           Daarna schakelen wij de ILT in. Jij hoeft niets te doen."

Email 4 — Week 6:
  Onderwerp: "Aanmaning gestuurd — [Airline] staat nu écht onder druk"
  Inhoud: Actieve taal: we pushen door, jij hoeft niets te doen

Email 5 — Bij uitbetaling (Dramatiseer resultaat):
  Onderwerp: "[Airline] betaalt. Jij wint, Jan."
  Inhoud: "Ze wilden niet. Wij bleven aandringen. Nu betalen ze."
          Uitbetaling, review verzoek, referral uitnodiging
```

---

### Kanaal 6: Referral Programma

**Principe:** Tevreden klanten zijn je goedkoopste marketingkanaal.

**Hoe het werkt:**
```
Na succesvolle uitbetaling ontvangt klant:

  "Ken jij iemand die ook een vertraagde vlucht heeft gehad?
   Stuur hen jouw persoonlijke link.
   Als zij een claim indienen, ontvangen jullie BEIDEN €15 korting."

  Jouw link: vluchtvetraagd.nl/ref/jan-de-vries
```

**Referral economics:**
- Kosten per referral: €15 (veel goedkoper dan Google Ads!)
- Verwachte conversieratio via referral: 30–40% (vs 4% koud verkeer)
- Elke klant heeft gemiddeld 2,3 kennissen die ook vliegen

---

### Kanaal 7: Partnerships

**Reisblogs & influencers:**

| Type | Voorbeeld | Samenwerking |
|---|---|---|
| Reisbloggers | Nomadicsoul.nl, reizigersblog.nl | Affiliate link + review artikel |
| Budgetreizen influencers | Instagram/TikTok 10k–100k volgers | Betaalde post €100–500 + affiliate |
| Vliegdeals communities | Facebook groepen "vliegdeals NL" | Organische posts, affiliate voor admins |
| Vergelijkingssites | Independer, Pricewise | Betaalde listing of affiliate deal |

**Affiliate structuur:**
- Publisher ontvangt: **€15 per betaalde claim** (na de €42)
- Tracking via eenvoudig affiliate systeem (bv. Tapfiliate of PartnerStack)
- Real-time dashboard voor publishers

---

## Deel 3: Conversie Optimalisatie (CRO)

### De Analyse Pagina Optimaliseren

**A/B test ideeën:**

| Element | Variant A | Variant B |
|---|---|---|
| CTA knop | "Check mijn vlucht gratis" | "Controleer nu — gratis" |
| Boven de vouw | Alleen formulier | Formulier + voorbeeld uitkomst |
| Vertrouwenselement | Trustpilot rating | "Geen account nodig" |
| Urgentie | Geen | "Claims verjaren na 3 jaar" |

### De Uitkomst Pagina Optimaliseren

**De 5 elementen die de conversie bepalen (Schwartz-aanpak):**

1. **Redefinitie** — Niet "Jij hebt recht op €400" maar "KLM heeft jou €400 schuldig staan" → airline is debtor, klant is crediteur → hogere urgentie
2. **Transparantie** — Exacte kostenopbouw, geen verborgen fees
3. **Mechanisme** — Leg stap voor stap uit HOE wij het ophalen (Schwartz: hoe concreter het mechanisme, hoe geloofwaardiger de belofte)
4. **Intensificatie + Urgentie** — "Ze hebben dat nog niet betaald" + verjaringstermijn: "De airline hoopt dat jij dit vergeet"
5. **Garantie** — "Geen succes? Dan alleen €42"

### Heatmapping & Analytics

Installeer op dag 1:
- **Google Analytics 4** — alle paginabezoeken, conversies, bronnen
- **Microsoft Clarity** (gratis) — heatmaps en sessie-opnames
- **Google Tag Manager** — voor alle tracking pixels

**KPI's om bij te houden:**

| Metric | Doel |
|---|---|
| Conversieratio analyse → betaling | >12% |
| Kosten per betaalde klant (CAC) | <€50 |
| Emailopen rate | >35% |
| Claim-to-payment tijd (airlines) | <10 weken gemiddeld |
| Klanttevredenheid (NPS) | >50 |
| Succespercentage claims | >65% |

---

## Deel 4: Jaarplanning Marketing

### Maand 1–2: Fundament

```
Week 1–2:
  ✓ Website live met gratis analyse tool
  ✓ Google Analytics + Clarity installeren
  ✓ Facebook Pixel installeren
  ✓ Mollie betalingen testen

Week 3–4:
  ✓ Google Ads account aanmaken
  ✓ Eerste campagne lanceren (€15/dag budget)
  ✓ Email reeksen instellen
  ✓ Eerste 3 SEO-artikelen publiceren
```

### Maand 3–4: Leren & Optimaliseren

```
  → Google Ads data analyseren (welke zoekwoorden converteren?)
  → A/B test uitkomst pagina starten
  → Eerste retargeting campagnes live
  → 5 extra SEO-artikelen publiceren
  → Eerste partnership-emails sturen
```

### Maand 5–6: Schalen

```
  → Verdubbel budget op winnende Google Ads campagnes
  → TikTok organisch starten (2x per week)
  → Affiliate programma lanceren
  → Referral systeem voor bestaande klanten
  → Persberichten sturen naar consumentenmedia
```

### Maand 7–12: Doorgroeien

```
  → Instagram/TikTok betaald adverteren
  → SEO begint organisch te renderen (gratis verkeer)
  → PR: aanbieden als expert bij vliegnieuws
  → Analyse uitbreiden naar België (FR + NL)
  → Seizoenscampagnes (zomer = piekseizoen vertragingen)
```

---

## Deel 5: Budget Overzicht

### Maandelijks Marketingbudget

| Kanaal | Maand 1–3 | Maand 4–6 | Maand 7–12 |
|---|---|---|---|
| Google Search Ads | €500 | €1.200 | €2.500 |
| Facebook Retargeting | €150 | €300 | €500 |
| TikTok/Instagram | €0 | €200 | €500 |
| SEO Content (schrijven) | €300 | €300 | €300 |
| Tools (Clarity, Mailchimp, etc.) | €100 | €150 | €200 |
| Affiliate uitbetalingen | €0 | €150 | €400 |
| **Totaal per maand** | **€1.050** | **€2.300** | **€4.400** |

### Cost per Acquisition (target)

```
Doel: maximaal €45 kosten per betalende klant

Rekensom:
  Google Ads: €1.000/maand
  Gemiddelde CPC: €2,50
  Klikken: 400
  Analyse-CR: 40% → 160 analyses
  Betaling-CR: 15% → 24 betalingen

  CAC via Google: €1.000 / 24 = €42 per klant ✓

  Admin fee dekt dit grotendeels: €42 x 24 = €1.008
  Commissie inkomsten komen er bovenop (vertraagd maar structureel)
```

---

## Samenvatting: De 3 Gouden Regels

**1. Kanaliseer — verlaag de drempel maximaal (Schwartz: Mass Desire)**
De gratis analyse is de sleutel — maar de reden dat het werkt, is Schwartz: de woede en het onrechtsgevoel bestaan al. De gratis analyse geeft die emotie een concrete eerste actie. Niemand hoeft iets te betalen om te weten of ze recht hebben. Hierdoor heb je veel meer data, leads en conversiekansen.

**2. Herdefinieer het frame — laat de uitkomst het werk doen (Schwartz: Redefinitie)**
Op de uitkomstpagina is de klant het meest gemotiveerd. Maar de framing bepaalt de conversie. "KLM heeft jou €400 schuldig staan" converteert beter dan "Jij hebt recht op €400" — omdat het de airline verantwoordelijk maakt en de klant als crediteur positioneert. Optimaliseer deze pagina voortdurend.

**3. Vang alle niet-converters op met de juiste stem per stadium (Schwartz: State of Awareness)**
80–90% converteert niet direct. Maar elk retargetingmoment heeft een ander bewustzijnsstadium — en daarmee een andere copy. Retargeting (Stadium 1–2): naam + exact bedrag. Cold social (Stadium 5): identificatie-frame. Email (Stadium 2): bewijs + verliesframe. Elke analyse die je gratis doet is een lead die je meerdere keren kunt benaderen — met de juiste boodschap per moment.

---

*Marketingplan VluchtVertraagd.nl — maart 2026 · Versie 1.0*
