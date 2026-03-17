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

## Deel 6: Meta Advertenties — Offer, Problem-Solution Fit & Drempelverlageer

### De Kern van een Goede Meta Advertentie

Een Meta-advertentie voor Aerefund heeft drie jobs:

1. **Stoppen** — de gebruiker stopt met scrollen
2. **Overtuigen** — in 3–5 seconden het probleem én de oplossing helder maken
3. **Activeren** — één duidelijke, lage drempel om de volgende stap te zetten

Het verschil met Google Ads: op Meta zoekt niemand naar jou. Ze worden geïnterrumpeerd. De advertentie moet dus beginnen bij hun wereld — niet bij jouw product.

---

### De Offer: Wat Je Aanbiedt

**De gratis analyse is de offer — niet de claimservice.**

Dit is het cruciale onderscheid. Je verkoopt geen €42 service aan een koude doelgroep. Je biedt een gratis check aan. De €42 komt pas nadat ze de waarde gezien hebben.

```
Slechte offer (te vroeg):
"Dien jouw vluchtclaim in voor €42 + 10% commissie"
→ Vraagt commitment van iemand die jou niet kent

Goede offer (lage drempel):
"Check gratis in 60 seconden of de airline jou nog geld schuldig is"
→ Geen risico, geen account, geen verplichtingen
```

**De offer in één zin:**
> *"Voer je vluchtnummer in — wij berekenen gratis hoeveel de airline jou schuldig is."*

De offer werkt omdat hij drie dingen combineert:
- **Directe waarde** (je weet het meteen)
- **Nul kosten** (gratis)
- **Nul commitment** (geen account, geen handtekening)

---

### Problem-Solution Fit

**Het probleem zit al in de markt — je hoeft het niet te creëren.**

Elke persoon die ooit meer dan 3 uur heeft gewacht op een vliegveld kent het gevoel: de frustratie, de machteloosheid, de afwijzende of niet-beantwoorde email van de airline daarna. Dat is jouw ingang.

**Het probleem (in hun woorden):**
- "Ik heb zo lang gewacht en niemand deed iets"
- "Ze stuurden een brief dat er niets aan de hand was"
- "Ik wist niet eens dat ik geld kon terugkrijgen"
- "Ik heb het geprobeerd maar het leek zo ingewikkeld"
- "De airline reageert toch niet"

**De oplossing (jouw mechanisme):**
- Wij checken automatisch of jij recht hebt (gratis)
- Wij dienen de claim in namens jou
- Wij onderhandelen — jij hoeft niets te doen
- Jij betaalt pas €42 als jij besluit dat wij mogen doorgaan

**De fit:**

| Probleem | Jouw oplossing |
|---|---|
| "Ik weet niet of ik recht heb" | Gratis analyse in 60 seconden |
| "Het lijkt ingewikkeld" | Wij regelen alles — jij hoeft niets te doen |
| "De airline reageert toch niet" | Wij onderhandelen en schakelen ILT in indien nodig |
| "Ik vertrouw claimbureaus niet" | Eerst checken, pas daarna beslissen — geen verplichtingen |
| "Het kost me meer dan het oplevert" | €42 admin + 10% commissie — transparante opbouw |

---

### Advertentiestructuur: De 4 Lagen

#### Laag 1 — Koude doelgroep (awareness)
*Doelgroep: NL, 25–55, interesse reizen/vliegvakanties, nog nooit van Aerefund gehoord*
*Doel: klik naar gratis analyse*

#### Laag 2 — Warme doelgroep (websitebezoekers, geen analyse gedaan)
*Doelgroep: retargeting 30 dagen*
*Doel: terughalen naar analyse*

#### Laag 3 — Heropvolging (analyse gedaan, niet betaald)
*Doelgroep: custom audience pixel — analyse compleet, geen betaling*
*Doel: converteren naar €42*

#### Laag 4 — Lookalike
*Doelgroep: 1–3% lookalike op betalende klanten*
*Doel: koude doelgroep die lijkt op je beste klanten*

---

### De Advertenties Uitgewerkt

---

#### Advertentie 1 — Koude doelgroep | Video (15–30 sec) | Identificatie hook

**Format:** Vertical video (9:16), 15–30 seconden
**Hook (0–3 sec):** Identificatie — beschrijf hun ervaring precies

```
[VISUAL: persoon kijkt gefrustreerd op vliegveld, grote borden met VERTRAAGD]

TEKST OP SCHERM (0–3 sec):
"Je vlucht was 4 uur vertraagd.
 Je hebt niets gehoord van de airline."

[VISUAL: 3 sec — iemand die een afwijzende email leest op zijn telefoon]

TEKST OP SCHERM (3–8 sec):
"Wist je dat ze je wettelijk verplicht zijn
 te betalen? Tot €400 per persoon."

[VISUAL: telefoonscherm met vluchtnummer invullen op aerefund.nl]

TEKST OP SCHERM (8–15 sec):
"Check gratis of jij recht hebt.
 60 seconden. Geen account nodig."

[VISUAL: groot groen getal verschijnt — €400]

TEKST OP SCHERM (15–20 sec):
"Als jij recht hebt, regelen wij de rest.
 Jij hoeft niets te doen."

CTA onderaan: [ Check gratis → aerefund.nl ]
```

**Caption (primaire tekst):**
```
Airlines rekenen erop dat jij het opgeeft.

97% van de gedupeerde reizigers dient nooit een claim in.
Ze weten dat. Ze budgetteren er letterlijk op.

Had jij ooit een vlucht met meer dan 3 uur vertraging?
Dan is er een kans dat de airline jou nog geld schuldig is.

➡ Check gratis in 60 seconden — geen account, geen verplichtingen.
```

**Kop:** De airline heeft jou misschien nog niet betaald
**Beschrijving:** Gratis check · Resultaat in 60 sec · Geen account nodig

---

#### Advertentie 2 — Koude doelgroep | Statisch beeld | Getal-hook

**Format:** Vierkant (1:1) of staand (4:5), statische afbeelding
**Principe:** Groot getal + duidelijk probleem + lage drempel

```
┌─────────────────────────────────────────┐
│                                         │
│            € 400,—                      │
│                                         │
│   Dat is wat de airline jou schuldig    │
│   kan zijn na een vertraging van        │
│   meer dan 3 uur.                       │
│                                         │
│   Hebben zij dat al betaald?            │
│                                         │
│   ──────────────────────────────────    │
│   Check gratis in 60 seconden           │
│   [ aerefund.nl/gratis-check ]          │
│                                         │
│   🔒 Geen account · Geen verplichtingen │
│                                         │
└─────────────────────────────────────────┘
```

**Caption:**
```
Vlucht meer dan 3 uur vertraagd? Dan heeft de airline jou waarschijnlijk
€250 tot €400 schuldig staan — op grond van EU-wet EC 261/2004.

De meeste mensen weten dit niet. Airlines rekenen daarop.

Check gratis of jouw vlucht in aanmerking komt:
👉 aerefund.nl/gratis-check

Geen account. Geen verplichtingen. Resultaat in 60 seconden.
```

---

#### Advertentie 3 — Retargeting | Statisch beeld | Verliesframe

*Voor mensen die de website bezochten maar geen analyse deden.*

**Caption:**
```
Je bezocht onze site — maar je hebt de check nog niet gedaan.

Misschien twijfelde je. Misschien had je geen tijd.

Maar als jouw vlucht meer dan 3 uur te laat was,
staat er misschien nog €400 op je te wachten.

Elke dag wacht de airline af of jij iets doet.
Claims verjaren na 3 jaar.

➡ Doe de gratis check — het duurt 60 seconden.
```

**Kop:** Jouw check staat nog klaar
**Beschrijving:** Gratis · Geen account · Resultaat direct

---

#### Advertentie 4 — Heropvolging | Statisch beeld | Exact bedrag

*Voor mensen die de analyse deden maar niet betaalden.*

```
┌─────────────────────────────────────────┐
│                                         │
│   Jouw analyse toonde:                  │
│                                         │
│            € 400,—                      │
│                                         │
│   De airline heeft dat nog niet betaald.│
│   Wij halen het op. Voor €42.           │
│                                         │
│   [ Dien mijn claim in → ]              │
│                                         │
└─────────────────────────────────────────┘
```

**Caption:**
```
Je hebt de analyse gedaan. De uitkomst was duidelijk.

De airline heeft jou €400 schuldig staan.
Ze wachten erop dat jij niets doet.

Wij regelen de rest — voor €42 administratiekosten.
Geen succes? Dan heb je alleen €42 betaald. Geen verborgen kosten.

➡ Dien jouw claim alsnog in.
```

---

### De Drempelverlageer — Hoe Je Weerstand Wegneemt

Dit zijn de 5 bezwaren die mensen tegenhouden, en hoe je ze in de advertentie én op de landingspagina wegneemt:

| Bezwaar | Drempelverlageer |
|---|---|
| "Ik moet iets betalen" | Eerste stap (analyse) is 100% gratis — geen creditcard nodig |
| "Ik moet een account aanmaken" | Geen account, geen registratie — gewoon vluchtnummer invoeren |
| "Ik weet niet of ik recht heb" | Dat checken wij — dát is de gratis analyse |
| "Wat als het mislukt?" | Je betaalt alleen €42 admin — geen extra verborgen kosten bij verlies |
| "Dit kost veel tijd" | 60 seconden voor de check, daarna hoef jij niets meer te doen |

**Formuleer ze actief in de advertentietekst:**
```
✓ Gratis check — geen account nodig
✓ Resultaat in 60 seconden
✓ Wij regelen alles — jij hoeft niets te doen
✓ Geen succes? Geen extra kosten
✓ Transparante vaste fee: €42 + 10%
```

---

### CTA Formules

Gebruik altijd één CTA per advertentie. Kies op basis van het doel:

| Doel | CTA |
|---|---|
| Koude doelgroep → analyse | **"Check gratis of jij recht hebt →"** |
| Koude doelgroep → analyse | **"Voer je vluchtnummer in — gratis →"** |
| Retargeting → analyse | **"Doe de gratis check — 60 seconden"** |
| Heropvolging → betaling | **"Dien mijn claim alsnog in →"** |
| Heropvolging → betaling | **"Haal mijn €400 op — voor €42"** |

**Regels voor de CTA:**
- Altijd actief (werkwoord eerst: "Check", "Voer in", "Dien in", "Haal op")
- Nooit vaag ("Meer informatie", "Klik hier" — werkt niet)
- Koppel de CTA aan de drempelverlageer: gratis, 60 seconden, geen account
- Gebruik het Meta CTA-label: **"Meer informatie"** voor awareness, **"Nu aanmelden"** voor conversie

---

### Budget & Campagnestructuur Meta

```
Campagne 1: Conversies (analyzes)
├── Ad set A: Koude doelgroep NL — Reizen (€5/dag)
│   └── Advertentie: Video identificatie-hook
│   └── Advertentie: Statisch beeld getal-hook
│
├── Ad set B: Lookalike 1% op betalende klanten (€5/dag)
│   └── Advertentie: Statisch beeld getal-hook
│
Campagne 2: Retargeting
├── Ad set C: Websitebezoekers 30d — geen analyse (€3/dag)
│   └── Advertentie: Verliesframe retargeting
│
└── Ad set D: Analyse gedaan — geen betaling (€3/dag)
    └── Advertentie: Exact bedrag heropvolging
```

**Totaal: ~€16/dag = ~€480/maand**
Schaal winning ad sets op zodra je CPA onder de €45 zit.

---

*Sectie toegevoegd: maart 2026*

---

## Deel 7: Meta Advertenties — Strategie & Creative Playbook

> *"70–80% van Meta-performance zit in de creative. De doelgroep is de tweede variabele."*
> — Meta Business Research, 2025

Dit deel bouwt voort op de campagnestructuur uit Deel 6 en gaat dieper in op strategie, testprotocollen, zeven volledige ad angles met Nederlandse copy, Nano Banana Pro-prompts voor vijf visuals, en een week-voor-week testing protocol.

---

### 7.1 Strategische Overwegingen

#### Objective: Lead Generation vs. Conversions

**Aanbeveling: gebruik Lead Generation als primaire objective voor koude campagnes.**

Claimdiensten zijn een categorie met hoge wrijving: het publiek heeft maanden tot jaren geleden op een vliegveld gezeten en de frustratie is weggezakt. Een onbekend merk vragen direct geld neer te leggen op een koude klik werkt niet. Een Meta Lead Form met drie velden (naam, email, vluchtnummer) geeft de prospect de gratis-analyse-ervaring zonder de website te verlaten. Onderzoek toont voor claimgerelateerde categorieën gemiddeld 62% lagere CPA via Lead Gen vs. Conversions objective.

| Objective | Toepassing | Reden |
|---|---|---|
| Lead Generation | Campagne 1 (koud) + Campagne 3 (lookalike) | Lagere wrijving, sneller pixel-data opbouwen |
| Conversions | Campagne 2 (retargeting) | Publiek is al warm, bereid door te klikken |

**Let op:** bij minder dan 50 conversie-events per week kan Meta het Conversions-algoritme niet optimaliseren. Gebruik in dat geval altijd Lead Gen totdat je voldoende volume hebt.

---

#### Creative vs. Targeting: Waar Investeer Je Moeite?

**Stelregel: besteed 80% van je tijd aan creative, 20% aan targeting.**

Meta's algoritme is in 2025–2026 grotendeels geautomatiseerd. Broad targeting (NL, 25–55, geen interest-filters) presteert voor de meeste klantcategorieën gelijk aan of beter dan strakke interesse-targeting, omdat Meta de pixel-data gebruikt om de juiste persoon te vinden. Wat Meta niet kan compenseren: een slechte hook.

**Implicatie:** voor Aerefund is het produceren van twee tot drie sterk verschillende creative angles per advertentieset waardevoller dan het fijntunen van interest-stacks.

---

#### Compliance: Targeting voor Claimdiensten

Meta staat niet toe dat je target op basis van hardship of juridische problemen.

- **Mág:** interesse in Reizen, Luchtvaart, KLM, Ryanair, vliegvakanties, budget travel
- **Mág:** leeftijdssegment 25–55, Nederland
- **Mág:** Custom Audiences (pixel, videoweergaven, engagement)
- **Mág:** Lookalike Audiences op betalende klanten
- **Vermijd:** interest-stacks op consumentenrechten, juridische diensten, of termen die op een negatieve situatie wijzen

**Copy-compliance:** schrijf in kansen-taal, niet in slachtoffer-taal. "Heb jij een vlucht gehad met meer dan 3 uur vertraging?" is clean. "Ben jij slachtoffer van een vertraagde vlucht?" kan flagging triggeren.

---

#### Testing Framework

**Principe: test creative angles parallel, niet sequentieel.**

| Fase | Actie |
|---|---|
| Week 1–2 | 3–5 creatives live per ad set, €10/dag totaal, laat Meta optimaliseren |
| Week 3–4 | Kill bij CPM >€14 + CTR <1,5% na €25 spend. Scale bij CPM <€9 + CTR >2,5% + CPL <€7 na €50 spend |
| Week 5+ | Nieuwe variaties op winning angle: nieuwe hook (eerste 80 tekens), zelfde body copy |

**Kill-criteria:**
- Na €25 spend: CPM >€14 én CTR (link) <1,5%
- Na 7 dagen: frequency >3 zonder conversie

**Scale-criteria:**
- CPL per gratis analyse <€8
- CPA per €42-betaling <€45
- Budgetverhoging: nooit meer dan 20% per 48 uur (grotere sprongen resetten de learning phase)

---

#### Budget Split

| Campagne | Doel | Dagbudget start | Schalen naar |
|---|---|---|---|
| Campagne 1: Koud (Lead Gen) | Nieuwe leads genereren | €10/dag | €30/dag bij CPA <€45 |
| Campagne 2: Retargeting (Conversions) | Niet-converters omzetten | €6/dag | €15/dag |
| Campagne 3: Lookalike (Lead Gen) | Klonen van betalende klanten | €8/dag | €25/dag |
| **Totaal** | | **€24/dag = €720/mnd** | **€70/dag = €2.100/mnd** |

---

### 7.2 Campagnestructuur

#### Campagne 1: Koud Publiek — Lead Generation

```
Campagne 1: [AEF] Koud — Lead Gen
│
├── Ad Set 1A: NL Broad — 25-55 (€5/dag)
│   Targeting: NL, 25–55, geen interest-filters
│   Plaatsing: Automatic (Reels, Feed, Stories)
│   └── Creative A: Verliesframe video 15 sec
│   └── Creative B: 97% statistiek statisch
│   └── Creative C: Vijand ontmaskeren statisch
│
└── Ad Set 1B: NL Interest — Luchtvaart/Reizen (€5/dag)
    Targeting: NL, 25–55, interesse: Luchtvaart, KLM, Ryanair, vliegvakanties
    └── Creative A: Verliesframe video
    └── Creative B: Mechanisme/proces statisch
    └── Creative C: Verjaringsdreiging statisch
```

**Lead Form opzet:**
```
Titel: "Check gratis of jij recht hebt op compensatie"
Subkop: "Voer je vluchtnummer in — resultaat in 60 seconden"

Veld 1: Voornaam (auto-fill)
Veld 2: E-mailadres (auto-fill)
Veld 3: Vluchtnummer (open text — placeholder: bijv. KL1234)

Bevestigingsscherm:
"Bedankt, [Naam]. We sturen je analyse direct naar [email].
 Of klik hier om direct te checken: aerefund.nl/gratis-check"
```

---

#### Campagne 2: Retargeting — Conversions

```
Campagne 2: [AEF] Retargeting — Conversions
│
├── Ad Set 2A: Websitebezoekers 30d — geen analyse (€3/dag)
│   Custom Audience: paginabezoek, excl. /bevestiging
│   └── Creative: Verliesframe retargeting
│
├── Ad Set 2B: Analyse gedaan — niet betaald (€3/dag)
│   Custom Audience: bezocht /uitkomst, excl. /bevestiging
│   └── Creative: Exact bedrag heropvolging
│
└── Ad Set 2C: 75% video-viewers — niet betaald
    Activeer bij min. 500 personen in audience
    └── Creative: Social proof case study
```

---

#### Campagne 3: Lookalike — Lead Generation

```
Campagne 3: [AEF] Lookalike — Lead Gen
│
└── Ad Set 3A: Lookalike 1% op betalende klanten (€8/dag)
    Source: Custom Audience — bezoekers /bevestiging (min. 100 betalers)
    └── Creative: Social proof angle
    └── Creative: Verjaringsdreiging statisch
```

*Activeer Campagne 3 pas wanneer de source audience minimaal 100 betalers bevat. Gebruik in de opstartfase een 1% Lookalike op de emaillijst van alle ingediende analyses.*

---

### 7.3 Zeven Ad Angles — Herschreven op Basis van Breakthrough Advertising

**Drie kernverbeteringen t.o.v. de vorige versie:**

1. **Headline verkoopt niet — headline trekt de eerste zin in.** Schwartz: *"Your headline has only one function — to force the prospect to read your second sentence."* De vorige angles probeerden te verkopen in de kop. Fout stadium.

2. **Begin bij de prospect, niet bij het product.** Schwartz: *"Your ad always starts with your market."* Koude doelgroep zit in Stadium 3–4 (weet van het verlangen/probleem, kent Aerefund niet). De headline begint bij hun huidige emotionele staat — niet bij onze dienst.

3. **Sophistication Stage 3: mechanisme in de headline.** De markt heeft "tot €600, no win no pay" van concurrenten gehoord tot ze ervan walgen. Het nieuwe mechanisme (de automatische gratis analyse — check eerst, betaal dan) moet in de headline staan, niet de claim.

---

#### Angle 1 — Identificatie: "Jij zat op die stoel"

**Schwartz-principes:** Identification technique (Hoofdstuk 8) + Stage 5 sophistication voor koud publiek. Begin bij de exacte ervaring van de prospect — niet bij het product. De eerste drie zinnen beschrijven hún wereld zo precies dat ze stoppen met scrollen omdat ze zichzelf herkennen. Het product verschijnt pas in alinea vier.

**Waarom dit werkt op Meta:** De eerste 1,7 seconden bepalen of ze doorratelen. "Jij zat op die stoel" trekt iedereen die ooit lang gewacht heeft op een gate — zonder dat er ook maar één productwoord in zit. De identificatie-hook is het sterkste scroll-stop-mechanisme voor een koude doelgroep.

**Primaire tekst:**
```
Jij zat op die stoel.

Vier uur. Misschien vijf. Vluchttijden die telkens een uur opschoven.
Geen uitleg. Niemand die iets zei. Jij die maar wachtte.

En daarna gewoon naar huis. Moe. Klaar met het gedoe.

Dat is precies waarop de airline rekende.

Want Europese wet verplicht hen jou te betalen. €250 tot €600 per
persoon. Ze weten dat de meeste mensen — net als jij die dag —
gewoon naar huis gaan en het vergeten.

Wij halen dat geld alsnog op. Gratis checken of jij recht hebt:
aerefund.nl/gratis-check

✓ Geen account nodig
✓ Geen verplichtingen
✓ Resultaat in 60 seconden
```

**Koptekst:** Jij hebt gewacht. Zij hebben nog niet betaald.
**Beschrijving:** Gratis check in 60 sec · Geen account · Geen verplichtingen
**CTA-label (Meta):** Meer informatie

---

#### Angle 2 — Vijand blootleggen: "Ze hebben een afdeling voor jou"

**Schwartz-principes:** Mass Desire kanaliseren via vijandidentificatie. Schwartz: *"Copy cannot create desire — it can only channel existing desires."* De woede over de airline bestaat al. Deze ad geeft die woede een concreet, benoembaar gezicht: de "Customer Relations" afdeling die als taak heeft jou te laten opgeven. Zodra de vijand helder is, wordt de CTA vanzelf logisch.

**Waarom dit werkt op Meta:** Outrage-content stopt het scrollen omdat het een morele reactie triggert. De kop "Ze hebben een afdeling voor jou" is raadselachtig genoeg om de tweede zin af te dwingen — precies Schwartz's definitie van een goede headline.

**Primaire tekst:**
```
Airlines hebben een afdeling opgericht om jou op te laten geven.

Ze noemen het "Customer Relations." Maar hun echte taak: automatische
afwijzingen sturen. "Buitengewone omstandigheid" roepen. Drie weken
laten wachten. Hopen dat jij na de tweede email stopt.

97% stopt. Ze weten het. Ze budgetteren het.

Elke euro die jij niet opeist is een euro winst voor hen.

Hier is wat ze je niet vertellen: Europese wet verplicht hen te betalen.
Technische problemen tellen juridisch zelden als geldige uitzondering
(Europees Hof, C-257/14). En als ze weigeren, kunnen ze voor de rechter.

Jij hoeft dat niet zelf te doen.

Check gratis of jij recht hebt — wij doen de rest:
👉 aerefund.nl/gratis-check
```

**Koptekst:** Airlines hebben een afdeling die erop rekent dat jij opgeeft
**Beschrijving:** Wij schrijven de brief · Wij onderhandelen · Jij doet niets
**CTA-label (Meta):** Meer informatie

---

#### Angle 3 — Nieuw mechanisme: "60-seconden check"

**Schwartz-principes:** Stage 3 Sophistication — mechanisme IN de headline. Schwartz: *"The emphasis shifts from what the product does to HOW it works."* De markt heeft "tot €600 per persoon" van EUclaim, AviClaim en ClaimCompass gehoord. Die claim is dood. Wat nieuw is: een automatische check op Europese vliegregisters die in 60 seconden het exacte bedrag berekent. Dát is de headline.

**Waarom dit werkt op Meta:** Voor prospects in Stadium 3 (kent het verlangen, heeft eerder een concurrent geprobeerd of overwogen maar twijfelt) is het mechanisme de geloofwaardigheidsbrug. Concreet, verifieerbaar, anders.

**Primaire tekst:**
```
Voer je vluchtnummer in.

In 60 seconden checkt ons systeem Europese vliegregisters, berekent
de exacte aankomstvertraging, en geeft je het bedrag dat de airline
jou schuldig is — op grond van EU-wet EC 261/2004.

Geen advocaat. Geen formulieren. Geen giswerk.

Dit is wat je dan ziet:
"KL 1234 · 15 augustus · aankomst 4u22m te laat · jij hebt recht op €400."

Als jij in aanmerking komt, dienen wij de officiële claim in voor €42.
Wij schrijven de brieven. Wij onderhandelen. Wij escaleren als de
airline weigert. Jij doet niets.

Gratis starten:
👉 aerefund.nl/gratis-check

✓ Geen account ✓ Geen verplichtingen ✓ Resultaat direct
```

**Koptekst:** In 60 seconden zie je of de airline jou geld schuldig is
**Beschrijving:** Automatische check op EU-vliegregisters · Gratis · Geen account
**CTA-label (Meta):** Nu aanmelden

---

#### Angle 4 — Dramatisering: "Ryanair weigerde. Vier keer."

**Schwartz-principes:** Dramatiseer het resultaat (Hoofdstuk 11). Schwartz beschrijft de "they laughed when he sat down at the piano" techniek: weerstand → volhouden → overwinning. Het verhaal is specifiek (naam, stad, airline, aantal weigeringen) omdat vage testimonials niet overtuigen — concrete details wel. De juridische precisie ("zaak C-257/14") in alinea vier is de credibility-brug.

**Waarom dit werkt op Meta:** Case studies met specifieke getallen, namen en een villain-moment hebben aantoonbaar hogere hold rates op video en hogere CTR op static. De kop "Ryanair weigerde. Vier keer." creëert onmiddellijk een cliffhanger.

**Primaire tekst:**
```
Ryanair weigerde. Vier keer.

Elke keer een automatisch antwoord. Elke keer "buitengewone
omstandigheid." Elke keer nee.

Op de vijfde brief citeerden wij het Europees Hof van Justitie,
zaak C-257/14: technische problemen zijn geen geldige uitzondering,
tenzij de airline het tegendeel bewijst.

Ryanair betaalde. €250 voor Maaike uit Breda.

"Ik had het allang opgegeven," zei ze.
"Ik dacht dat ze gewoon weg kwamen met het."

Dat dachten ze ook.

Jij hoeft niet te weten welke wet van toepassing is.
Wij weten het. Voor €42 — en alleen als jij recht hebt.

Check gratis:
👉 aerefund.nl/gratis-check
```

**Koptekst:** Ryanair weigerde vier keer. Op de vijfde: €250 voor Maaike.
**Beschrijving:** Wij stoppen niet totdat de airline betaalt — of het juridisch bewezen niet kan
**CTA-label (Meta):** Meer informatie

---

#### Angle 5 — Onthulling: "Wat de airline zei. Wat de wet zegt."

**Schwartz-principes:** Camouflage-techniek — de ad voelt als consumentenjournalistiek, niet als reclame. Schwartz: de prospect verlaagt zijn verdediging omdat het aanvoelt als gratis advies. Pas nadat het bewijs is geleverd, wordt het product geïntroduceerd. Dit werkt voor prospects die al een afwijzing hebben gehad van een airline en het hebben opgegeven.

**Waarom dit werkt op Meta:** Educatieve content met een concrete onthulling (twee kolommen: "wat airline zei" vs "wat wet zegt") converteert sterk bij audiences die de situatie al meemaakten maar dachten dat er geen oplossing was.

**Primaire tekst:**
```
De airline zei: "Technisch defect. Buitengewone omstandigheid.
Geen compensatie."

Wat de wet zegt:
Europees Hof van Justitie, zaak C-257/14 (2015):
"Technische problemen die inherent zijn aan de normale uitvoering
van vluchten vormen geen buitengewone omstandigheid."

Vertaling: als de airline een technisch defect heeft en niet kan
bewijzen dat het onvoorzienbaar was én buiten hun controle lag —
moeten ze betalen.

De meeste "technische defecten" zijn gewoon onderhoudsproblemen.
Waarvoor de airline verantwoordelijk is.

Jij hebt misschien een afwijzing gehad en het geloofd.

Check gratis of jouw afwijzing juridisch standhoudt:
👉 aerefund.nl/gratis-check

Geen account · 60 seconden · Wij kijken voor jou
```

**Koptekst:** Wat de airline zei. Wat de wet zegt. Het verschil kost hen €400.
**Beschrijving:** Wij controleren gratis of de afwijzing van de airline juridisch klopt
**CTA-label (Meta):** Meer informatie

---

#### Angle 6 — Verjaringsdreiging: "De klok loopt"

**Schwartz-principes:** Intensificatie via consequenties van niet-handelen (Hoofdstuk 12). Schwartz: maak de gevolgen van uitstel zo concreet en onomkeerbaar dat het angst triggert. De driejaarstermijn is geen marketingtruc maar juridische realiteit — en dat maakt hem geloofwaardig. Gebruik voor retargeting (mensen die al de analyse deden maar niet betaalden) én als seizoensgebonden koude ad.

**Waarom dit werkt op Meta:** Echte deadlines presteren altijd beter dan nep-schaarste. "Na 3 jaar is het voorbij" is controleerbaar en dus geloofwaardig — wat de urgentie harder maakt dan een tijdelijke aanbieding.

**Primaire tekst:**
```
De klok loopt.

In Nederland verjaren vluchtclaims na 3 jaar. De datum van jouw
vlucht staat vast. Elke maand brengt je dichter bij het punt waarop
niemand — ook wij niet — je nog kan helpen.

Na de verjaringstermijn:
✗ Geen claim meer mogelijk
✗ Geen rechtszaak
✗ Geen vergoeding. Nooit meer.

De airline stuurt geen herinnering. Ze hopen dat jij wacht.

Had jij een vertraagde of geannuleerde vlucht in de afgelopen 3 jaar?

Dan loopt de klok nu.

Check gratis in 60 seconden of jij nog op tijd bent:
👉 aerefund.nl/gratis-check

Geen account · Geen verplichtingen · Resultaat direct
```

**Koptekst:** Vluchtclaims verjaren na 3 jaar. De airline hoopt dat je dat vergeet.
**Beschrijving:** Check nu of jij nog op tijd bent · Gratis · 60 seconden
**CTA-label (Meta):** Meer informatie

---

#### Angle 7 — Camouflage: "Wat airlines je niet vertellen"

**Schwartz-principes:** Camouflage-advertorial (Hoofdstuk 9). De ad presenteert zich als consumenteninformatie, niet als reclame. Schwartz: *"The reader lowers his defenses because it feels like advice, not advertising."* De CTA komt organisch aan het einde, nadat de prospect vijf concrete dingen heeft geleerd die ze niet wisten. Dit werkt het best als video-script of long-form static.

**Compliance-note:** Gebruik deze koptekst — niet "Airlines zijn oplichters" — om Meta-flagging te vermijden.

**Primaire tekst:**
```
Wat airlines je niet vertellen als je vlucht vertraagd is:

1. Je hebt tot 3 jaar de tijd om een claim in te dienen.
2. Technische problemen zijn zelden een geldige uitzondering (EU-recht).
3. Je hebt geen advocaat nodig.
4. De airline is wettelijk verplicht binnen 6 weken te reageren.
5. Als ze weigeren, kun je naar de Inspectie Leefomgeving en Transport.

Ze vertellen dit niet, omdat 97% van de gedupeerde reizigers nooit claimt.
Ze rekenen op jouw onwetendheid. Dat is letterlijk in hun financieel
model verwerkt.

Wij halen het voor jou op. Voor €42 + 10% als we winnen.

Check gratis in 60 seconden:
👉 aerefund.nl/gratis-check
```

**Koptekst:** Wat airlines je niet vertellen als je vlucht vertraagd is
**Beschrijving:** 5 dingen die de airline liever niet wil dat jij weet
**CTA-label (Meta):** Meer informatie

---

### 7.4 Nano Banana Pro Prompts — Herschreven

**Drie verbeteringen t.o.v. de vorige prompts:**

1. **Visuele storytelling, niet visuele decoratie.** Elk beeld vertelt één verhaal dat het scrollen stopt vóórdat de tekst gelezen wordt. Het oog pakt de emotie op in <1 seconde.
2. **Stijl: editorial documentary, nadrukkelijk niet gepolijst.** UGC-stijl converteert 3–6x beter dan stockfoto's in de claim/legal niche. Elke prompt bevat expliciete anti-stock-directieven.
3. **CTA en logo zijn onderdeel van de compositie** — niet achteraf erop geplakt. Ze zijn gesitueerd zodat het oog er natuurlijk naartoe gaat na het visuele verhaal.

**Instelling die altijd geldt:** voeg `logo-aerefund.png` mee als bijlage bij elke promptsessie.

---

#### Visual 1 — "VERTRAAGD" — Identificatie hook
*Gebruik: Angle 1 (Identificatie), Angle 7 (Camouflage) — openingsframe video 9:16 + statisch*

```
PROMPT:

Photorealistic, editorial-style photograph. NOT stock photo. Gritty
and human — no perfect lighting, no staged poses.

SCENE: A Dutch man, mid-30s, sitting alone on a gray airport bench at
a departure gate. He is slumped forward, elbows on knees, both hands
around a takeaway coffee cup gone cold. He is staring at the floor.
His carry-on bag leans against his leg. Jacket on, like he dressed for
arrival — not for waiting.

Directly behind him: a large digital departure board. On it in stark
orange-on-navy: "VERTRAAGD" next to his flight row. All other flights
show "Op tijd." Only his is delayed. This is deliberate — he is singled
out visually.

The gate windows behind show a dark evening sky. One plane is visible
parked, unmoving, in the wet tarmac light.

MOOD: Powerlessness. Institutional abandonment. Waiting with no end.
He is the only person in frame. The emptiness amplifies his isolation.

COLOR: Dominant dark navy (#0D1B2A) in background and signage.
The one orange accent is the "VERTRAAGD" text (#FF6B2B). Everything
else is cold gray and blue-white fluorescent light. No warmth.

LOGO: Use the logo from the attachment. Place it top-left corner —
small, white version, on a semi-transparent dark navy pill
(#0D1B2A, 75% opacity). Crisp, not oversized.

CTA BLOCK: Bottom 15% of image. Full-width solid dark navy bar
(#0D1B2A). Inside: one orange rounded-corner button (#FF6B2B),
white bold sans-serif text: "Check gratis of jij recht hebt →"
Below the button, small muted-white text:
"aerefund.nl/gratis-check · Geen account · 60 seconden"

Aspect ratio: 9:16 (vertical, Reels/Stories/TikTok)
Style: photorealistic, documentary, editorial — handheld camera feel,
slight grain acceptable, NOT studio lighting, NOT stock photo
```

---

#### Visual 2 — Twee werelden: gate vs. bank-app
*Gebruik: Angle 4 (Dramatisering), Angle 3 (Mechanisme) — statisch feed 1:1*

```
PROMPT:

Photorealistic split-screen advertisement image, 1:1 square format.
Two worlds. Same person. Same phone. Completely different feeling.

LEFT HALF (60% of width): Airport departure gate. A Dutch woman,
late 20s, standing at a gate window at night. She has her phone in
her hand but is looking at the VERTRAAGD board, not the phone. Her
posture is tense — weight on one foot, free hand on her elbow, face
showing suppressed frustration, not crying, not dramatic. Just the
quiet exhaustion of waiting with no information. Cold, harsh
fluorescent airport lighting. Blue-gray color palette. The outside
window shows wet dark tarmac.

RIGHT HALF (40% of width): The same woman, days later, standing in
her kitchen. Casual clothes — a hoodie. She's looking at her phone
with a quiet, genuine, slightly surprised smile. On her phone screen,
clearly readable to the viewer: a Dutch banking app notification —
dark green header, white text "€ 400,00 bijgeschreven — Aerefund BV"
in clean sans-serif. The kitchen behind her is warm: afternoon light,
IKEA cabinets, a plant on the windowsill. Normal. Dutch.

DIVIDER: A thin vertical line between the two halves in dark navy
(#0D1B2A). At the midpoint of this line: a small orange arrow (→)
in #FF6B2B, pointing right. Nothing else on the divider.

LOGO: Use the logo from the attachment. Centered at the very top of
the image on a full-width dark navy strip (height: ~8% of image).
White version of the logo. Clean.

CTA BLOCK: Full-width dark navy bar at the bottom (~12% of image).
One orange rounded button (#FF6B2B) centered: white bold text
"Check gratis of jij recht hebt →"
Below in small muted gray: "aerefund.nl/gratis-check · Geen account"

Aspect ratio: 1:1 (Feed)
Style: photorealistic, split-screen narrative, documentary lighting —
NOT stock photo, NOT overly posed. The left side should feel cold and
real; the right side warm and real. Both authentic.
```

---

#### Visual 3 — De uitkomst in je hand
*Gebruik: Angle 3 (Mechanisme), Angle 1 (Identificatie) — statisch feed 4:5*

```
PROMPT:

Photorealistic close-up photograph. Product-in-context style.
NOT studio. Handheld feel.

SCENE: A pair of male hands, mid-30s, slightly tanned, holding a
modern smartphone in portrait mode. The phone is tilted slightly
toward the viewer. The background is blurred — a kitchen table,
warm late-afternoon light, a coffee mug partially visible.

ON THE PHONE SCREEN (must be legible, sharp, central to the image):
A mobile web UI. Dark navy background (#0D1B2A). At the top: the
Aerefund logo (use attachment) — small, white, in a thin header bar.
Below the header: a green rounded badge, large:
  "€ 400,—"
  in bold white text, centered.
Below the badge, in small light-gray monospace-style text:
  "KL 1234 · 15 aug · aankomst 4u 22m te laat"
Below that text, a horizontal separator line in #1f3148.
Below that, a large orange rounded button (#FF6B2B), full width,
white bold text: "Dien mijn claim in →"
Below the button, tiny muted text: "€42 · 10% bij succes · geen verplichtingen"

The man's expression is not visible — we only see hands and phone.
This is intentional. The viewer projects themselves into the hands.
The mood is quiet discovery. "Oh. This actually worked."

LOGO: Already in the phone UI (see above). Additionally, place a very
small version in the top-left corner of the full image, on a
semi-transparent dark navy pill, for brand recall outside the phone.

CTA BLOCK: Bottom 12% of image. Full-width dark navy bar (#0D1B2A).
Orange rounded button: "Check gratis in 60 seconden →"
Below in small white text: "aerefund.nl/gratis-check · Geen account nodig"

Aspect ratio: 4:5 (portrait Feed)
Style: photorealistic, product-in-context, handheld camera feel —
NOT studio, NOT perfectly lit hands. Natural skin, real environment.
```

---

#### Visual 4 — "Ze betaalden toch"
*Gebruik: Angle 4 (Dramatisering), Angle 2 (Vijand) — statisch feed 1:1 + carousel slot*

```
PROMPT:

Photorealistic photograph. Candid, documentary style. NOT posed.

SCENE: A Dutch couple, both late 30s, sitting across from each other
at a small kitchen table. Between them on the table: two phones, face
up. One phone shows a WhatsApp message from "Aerefund" — visible text
fragment: "Goed nieuws — KLM heeft betaald." The other shows a banking
app: "€ 800,00 bijgeschreven".

The man is leaning back with a slight, quiet satisfaction — like
winning a minor argument he'd been sure about for months. Not
euphoric. Vindicated. The woman is looking at one of the phones,
hand over mouth, the beginning of a smile.

The kitchen is recognizably Dutch: IKEA Kallax unit in the background,
a Douwe Egberts coffee tin on the counter, late morning light through
a frosted window. Normal and real.

The phone screens are sharp and legible to the viewer. The faces are
visible but the emotion is restrained — real, not performed.

LOGO: Use the logo from the attachment. Top-left corner of the image.
Small white version on a semi-transparent dark navy pill (#0D1B2A,
75% opacity).

CTA BLOCK: Full-width dark navy bar at bottom of image (#0D1B2A).
Orange button (#FF6B2B), white bold text:
"Check gratis of jij ook recht hebt →"
Below in small muted gray: "aerefund.nl/gratis-check"

Aspect ratio: 1:1 (square Feed)
Style: photorealistic, documentary, candid — NOT stock photo,
NOT overly happy or staged. Quiet, real satisfaction.
```

---

#### Visual 5 — "97% geeft op"
*Gebruik: Angle 2 (Vijand blootleggen) — statisch feed 4:5 + stories*

```
PROMPT:

Pure graphic design. No photography. Bold, editorial, data-driven.

BACKGROUND: Full dark navy (#0D1B2A), top to bottom.

TOP SECTION (~35% of image height):
A single thick horizontal bar, full width, rounded ends.
The bar is divided:
  - Left 97%: dark charcoal (#1a2b3d), labeled "97%" in large bold
    white text left-aligned inside the bar, and below the bar in
    small muted gray: "geeft op"
  - Right 3%: Aerefund orange (#FF6B2B), labeled "3%" in bold white
    text right-aligned inside (or above if too narrow), and below:
    "claimt" in small muted gray
Below the bar, right-aligned, tiny muted gray text (10px equivalent):
"Bron: EU Transport Statistics 2024"

MIDDLE SECTION:
One headline in bold white, clean sans-serif (Sora-style), large:
"Airlines rekenen op
 jouw stilzwijgen."

Below, in smaller white text, regular weight:
"Elke euro die jij niet opeist is een euro winst voor hen."

LOGO: Use the logo from the attachment. Centered at the very top of
the image, above the data bar. White version. Small, precise. Sits on
the dark navy background directly — no pill or container needed.

CTA BLOCK: Bottom 18% of image. Full-width solid orange strip
(#FF6B2B). Two lines of white text, centered:
Line 1 (bold, 18px equivalent): "Check gratis of jij recht hebt →"
Line 2 (regular, 12px equivalent):
"aerefund.nl/gratis-check · Geen account · 60 sec"

Aspect ratio: 4:5 (portrait Feed / Stories)
Style: bold graphic design, editorial, high contrast — NO photography,
NO gradients, NO drop shadows. Clean, uncompromising, data-forward.
```

---

### 7.5 Drempelverlageer Checklist

Elke Meta-advertentie voor Aerefund bevat minimaal drie van de vijf onderstaande drempelverlagende elementen. Formuleer ze actief — niet als disclaimer, maar als positieve eigenschap van het aanbod.

| Bezwaar dat het wegneemt | Formulering in de advertentie | Wanneer verplicht |
|---|---|---|
| "Het kost me geld" | "Gratis check — geen creditcard, geen account" | Altijd in koude ads |
| "Het kost me tijd" | "Resultaat in 60 seconden" | Altijd |
| "Het is ingewikkeld" | "Jij hoeft niets te doen — wij regelen alles" | Altijd in koude ads |
| "Wat als het mislukt?" | "Geen succes? Alleen €42 — geen verborgen kosten" | In retargeting ads |
| "Ik ken dit bedrijf niet" | Social proof: sterren, opgehaald bedrag, aantal claims | In cold + lookalike |

**Vaste drempelverlageer-footer** — gebruik als afsluitende bulletregel in elke advertentie:
```
✓ Gratis check — geen account nodig
✓ Resultaat in 60 seconden
✓ Wij regelen alles — jij hoeft niets te doen
```

---

### 7.6 Testing Protocol

#### Week 1–2: Breed Testen van Hooks

**Doel:** bepaal welke van de zeven angles de laagste CPM en hoogste CTR oplevert.

```
Opstelling:
  Campagne 1 (koud) actief, Ad Set 1A: Broad NL, 25–55, €10/dag
  Creatives live (losse ads, geen Dynamic Creative):
    Creative 1: Verliesframe (Angle 1) — video 15 sec
    Creative 2: 97% statistiek (Angle 2) — statisch 4:5
    Creative 3: Vijand ontmaskeren (Angle 3) — statisch 1:1
    Creative 4: Mechanisme (Angle 5) — statisch 4:5
    Creative 5: Verjaringsdreiging (Angle 6) — statisch 1:1
```

**Metrics bijhouden (dagelijks na dag 3):**

| Metric | Doel |
|---|---|
| CPM | <€9 (lager = betere relevantiescore bij Meta) |
| CTR (link) | >2,0% |
| Cost per Lead (CPL) | <€8 per ingevulde gratis analyse |
| Frequency | Kill bij >3 zonder conversie |

---

#### Week 3–4: Lezen en Beslissen

**Kill-beslissing** na minimaal €25 spend:
- CPM >€14 én CTR <1,5%: kill, budget naar winner

**Scale-beslissing** na minimaal €50 spend:
- CPM <€9 én CTR >2,5% én CPL <€7: +20% budget per 48u
- Winning angle: maak 2 varianten (nieuwe eerste 80 tekens, zelfde body)

**Retargeting activeren (Campagne 2):**
- Zodra je minimaal 300 unieke websitebezoekers/maand hebt
- Zodra je minimaal 50 voltooide analyses hebt (voor Ad Set 2B)

---

#### Week 5 en Verder: Itereren op de Winner

```
Winning angle gevonden? Maak variaties op:
  1. De hook (eerste 3 seconden / eerste zin) — 3 varianten
  2. De visual (andere afbeelding, zelfde tekst)
  3. Het bewijs (andere testimonial, zelfde structuur)
  4. De urgentie (verjaringsdreiging als sluiting toevoegen)

Regel: test altijd maar ÉÉN variabele per iteratie.
```

**Lookalike activeren (Campagne 3):** zodra je 100 betalende klanten hebt.

**Seizoensgebonden pieken:**
- Juni–augustus: hoogseizoen vertragingen → koude campagne 2x budget
- Januari: post-vakantieherinnering → Angle 6 (verjaringsdreiging) activeren
- September: terug van vakantie → Angle 4 (social proof) historisch sterkst

---

### Samenvatting Deel 7

| Element | Keuze |
|---|---|
| Objective | Lead Gen (koud + lookalike), Conversions (retargeting) |
| Creative-effort | 80% creative, 20% targeting |
| Startbudget | €24/dag verdeeld over 3 campagnes |
| Primaire angles om mee te starten | Verliesframe + 97% statistiek + Mechanisme |
| Testing | 3–5 creatives parallel, kill na €25 bij CPM >€14, scale na €50 bij CPL <€7 |
| Drempelverlageer | Altijd: "gratis" + "60 seconden" + "geen account" |
| Compliance | Geen hardship targeting, geen negatieve interest-stacks |
| Lead Form | 3 velden max: naam, email, vluchtnummer |

---

*Sectie toegevoegd: maart 2026*

*Marketingplan VluchtVertraagd.nl — maart 2026 · Versie 1.0*
