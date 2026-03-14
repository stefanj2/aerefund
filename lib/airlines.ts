export type AirlineConfig = {
  name: string
  fullName: string
  avgPaymentWeeks: number
  successRate: number
  claimDifficulty: 'easy' | 'medium' | 'hard'
  difficultyNote: string
  iataPrefix: string
  color: string
  reputationNote?: string
  claimTips?: string[]
  claimsEmail?: string
}

export const AIRLINES: Record<string, AirlineConfig> = {

  // ── Nederland & België ────────────────────────────────────────────────────
  KL: {
    name: 'KLM',
    fullName: 'KLM Royal Dutch Airlines',
    avgPaymentWeeks: 7,
    successRate: 88,
    claimDifficulty: 'medium',
    difficultyNote:
      'KLM erkent geldige claims doorgaans, maar communiceert traag en gebruikt vertragingstactieken. Professionele indiening verhoogt slagingskans aanzienlijk.',
    iataPrefix: 'KL',
    color: '#009BDE',
    claimsEmail: 'customercare@klm.com',
    reputationNote:
      'KLM staat bekend als een van de klantvriendelijkere grote Europese luchtvaartmaatschappijen, maar dat betekent niet dat ze vrijwillig betalen. In 2023 weigerde KLM bij meer dan 40% van de initiële claims — waarvan het overgrote deel bij formele herbeoordeling alsnog werd uitbetaald. KLM beroept zich regelmatig op "buitengewone omstandigheden" zoals slecht weer of ATC-stakingen, ook in gevallen waar dit juridisch niet houdbaar is. Bij technische problemen — de meest voorkomende oorzaak — is dit verweer bijna nooit geldig.',
    claimTips: [
      'Technisch mankement = jouw recht. KLM brengt technische problemen soms als "buitengewoon" naar voren, maar rechtbanken oordelen consequent anders. Laat je niet afschepen.',
      'Bewaar alle communicatie. KLM communiceert via meerdere kanalen en ontkent soms ontvangst van eerdere berichten. Screenshots en e-mailbewijzen zijn essentieel bij een formele claim.',
      'Formele toon werkt. KLM reageert sneller en positiever op een juridisch geformuleerde claimbrief dan op een klacht via de klantenservice of hun app.',
    ],
  },
  FR: {
    name: 'Ryanair',
    fullName: 'Ryanair',
    avgPaymentWeeks: 12,
    successRate: 74,
    claimDifficulty: 'hard',
    difficultyNote:
      'Ryanair staat bekend als één van de moeilijkste airlines voor compensatieclaims. Zij wijzen standaard bijna alle claims af en vereisen vaak een rechtszaak. Onze juristen kennen hun tactieken precies.',
    iataPrefix: 'FR',
    color: '#073590',
    claimsEmail: 'customerservice@ryanair.com',
    reputationNote:
      'Ryanair is door consumentenorganisaties en rechtbanken in heel Europa meerdere malen veroordeeld voor het onterecht weigeren van EC 261-compensatie. Toch blijft hun standaardstrategie: eerst afwijzen, dan pas betalen als de druk groot genoeg is. In 2022 oordeelde de Ierse luchtvaartautoriteit dat Ryanair structureel passagiers misleidde over hun rechten. Voor Nederlandstalige passagiers is de communicatie extra moeizaam — Ryanair stuurt standaardafwijzingen in het Engels en telt erop dat de meeste reizigers daarna opgeven.',
    claimTips: [
      'Dien altijd eerst in via het Ryanair-claimformulier. Dit is een verplichte voorwaarde voordat juridische stappen mogelijk zijn. Bewaar de bevestigingsmail zorgvuldig.',
      'Een afwijzing is bijna standaard. Ryanair wijst meer dan 80% van de directe claims af — ook geldige. Beschouw een afwijzing als een standaardstap in het proces, niet als het einde.',
      'Vermeld altijd het exacte aankomsttijdstip. EC 261 telt aankomstvertraging (deur open), niet vertrekvertraging. Bij Ryanair is dit onderscheid cruciaal omdat zij soms iets vroeger landen dan gepland na een late start.',
    ],
  },
  HV: {
    name: 'Transavia',
    fullName: 'Transavia',
    avgPaymentWeeks: 6,
    successRate: 91,
    claimDifficulty: 'easy',
    difficultyNote:
      'Transavia verwerkt claims relatief vlot en betaalt vrijwel altijd bij geldige vertraging. Een sterke zaak voor jou.',
    iataPrefix: 'HV',
    color: '#00A651',
    claimsEmail: 'klantenservice@transavia.com',
    reputationNote:
      'Transavia heeft van de Nederlandse luchtvaartmaatschappijen de beste reputatie als het gaat om EC 261-afhandeling. Als dochtermaatschappij van de Air France-KLM groep volgt Transavia redelijk gestructureerde procedures. Toch worden claims niet altijd spontaan uitbetaald: bij twijfelgevallen — zoals vertraging door late aankomst van het inkomende toestel — proberen ze soms het "cascade effect" als buitengewone omstandigheid op te voeren, wat juridisch onjuist is.',
    claimTips: [
      'Vertraging door "late inkomst vliegtuig" is geen buitengewone omstandigheid. Transavia gebruikt dit soms als verweer, maar operationele planning valt volledig onder de eigen verantwoordelijkheid van de airline.',
      'Claim binnen 3 jaar. Transavia hanteert de Nederlandse verjaringstermijn. Vergeet je een vlucht van vorig jaar? Die kom je nog steeds voor in aanmerking.',
      'Groepsreizen via reisorganisaties. Boekte je via TUI of een andere touroperator? De claim loopt via Transavia als uitvoerende carrier, niet via de reisorganisator.',
    ],
  },
  U2: {
    name: 'easyJet',
    fullName: 'easyJet',
    avgPaymentWeeks: 9,
    successRate: 82,
    claimDifficulty: 'medium',
    difficultyNote:
      'easyJet heeft een gestructureerd claimproces maar hanteert soms buitengewone omstandigheden als verweer. Wij weten wanneer dat verweer niet opgaat.',
    iataPrefix: 'U2',
    color: '#FF6600',
    claimsEmail: 'euzteam@easyjet.com',
    reputationNote:
      'easyJet heeft relatief transparante procedures en een eigen online claimportaal, wat het voor passagiers makkelijker lijkt dan het is. In de praktijk wijst easyJet veel claims af met een beroep op "buitengewone omstandigheden" — een categorie die ze ruimer interpreteren dan de wet toestaat. Na de COVID-jaren kampte easyJet met forse operationele problemen en een stroom aan compensatieclaims, wat leidde tot langere doorlooptijden en hardere afwijzingspolitiek.',
    claimTips: [
      'easyJet\'s claimportaal is een eerste stap, geen eindoordeel. Een afwijzing via hun eigen systeem heeft geen juridische waarde — daarna volgt het échte claimproces.',
      'Let op vluchtnummerwijzigingen. easyJet boekt soms passagiers om naar een andere vlucht met een ander nummer. Dit telt alsnog als annulering van de originele vlucht.',
      'Staking van eigen personeel valt niet onder buitengewone omstandigheden. easyJet probeerde dit verweer te gebruiken na stakingen van eigen cabinepersoneel — maar Europese rechtbanken wezen dit af.',
    ],
  },
  CD: {
    name: 'Corendon',
    fullName: 'Corendon Airlines',
    avgPaymentWeeks: 10,
    successRate: 79,
    claimDifficulty: 'medium',
    difficultyNote:
      'Corendon reageert wisselend op directe claims. Met professionele begeleiding stijgt de slagingskans significant.',
    iataPrefix: 'CD',
    color: '#E31837',
    claimsEmail: 'customercare@corendon.com',
    reputationNote:
      'Corendon is een Nederlands-Turks chartermaatschappij dat vluchten uitvoert voor reisorganisaties én rechtstreeks verkoopt. Hun claimafhandeling is inconsistent: soms wordt snel betaald, soms volgt een reeks afwijzingen. Een complicerende factor is dat Corendon-vluchten regelmatig ingeboekt zijn via een touroperator, waardoor passagiers niet altijd weten dat Corendon de uitvoerende carrier is — en dus bij wie ze moeten claimen.',
    claimTips: [
      'Claim bij de uitvoerende carrier, niet de touroperator. Boekte je via Corendon Holidays of een reisbureau? De EC 261-claim dien je altijd in bij Corendon Airlines als uitvoerder.',
      'Corendon vliegt ook als "Atlasglobal" of met gecharterd materieel. Controleer het vliegtuigregistratienummer bij twijfel — de naam op het vliegtuig is leidend voor de claim.',
      'Chartervertragingen worden soms als "pakketnummer" afgedaan. Dat is onjuist — EC 261 geldt los van of je een pakketreis hebt geboekt.',
    ],
  },
  TB: {
    name: 'TUI fly',
    fullName: 'TUI fly Nederland',
    avgPaymentWeeks: 8,
    successRate: 85,
    claimDifficulty: 'medium',
    difficultyNote:
      'TUI fly werkt mee bij duidelijke gevallen maar probeert technische gronden in te roepen. Onze aanpak doorziet dat snel.',
    iataPrefix: 'TB',
    color: '#E87722',
    claimsEmail: 'klantenservice@tui.nl',
    reputationNote:
      'TUI fly Nederland is de vliegpoot van TUI Reizen en verzorgt veelal chartervluchten naar vakantiebestemmingen. De reputatie voor claimafhandeling is redelijk — beter dan Ryanair of Wizz Air, slechter dan Transavia. Het grootste struikelblok is de verweving met TUI als reisorganisatie: passagiers krijgen soms te horen dat hun klacht "via de reisorganisatie" moet lopen, terwijl EC 261-claims altijd rechtstreeks bij de airline ingediend worden.',
    claimTips: [
      'TUI als reisorganisator ≠ TUI fly als airline. Jouw EC 261-claim is altijd gericht aan TUI fly (IATA-code TB), ook al boekte je het als onderdeel van een TUI-pakketreis.',
      'Vakantievertragingen op de heenvlucht tellen ook. Veel mensen claimen alleen de terugvlucht. Maar ook een heenvlucht met meer dan 3 uur vertraging geeft recht op compensatie.',
      'TUI gebruikt soms "slot restricties" op drukke luchthavens als verweer. Dit wordt door rechtbanken zelden als geldig buitengewone omstandigheid beschouwd als de vertraging door eigen planning ontstond.',
    ],
  },
  VY: {
    name: 'Vueling',
    fullName: 'Vueling Airlines',
    avgPaymentWeeks: 11,
    successRate: 77,
    claimDifficulty: 'hard',
    difficultyNote:
      'Vueling opereert vanuit Spanje en communiceert traag met Nederlandse passagiers. Persistentie en juridische kennis zijn vereist.',
    iataPrefix: 'VY',
    color: '#FFD700',
    claimsEmail: 'customercare@vueling.com',
    reputationNote:
      'Vueling Airlines, onderdeel van de IAG-groep (British Airways, Iberia), staat in Spanje bekend als een van de meest vertraagde lowcost-carriers. De Spaanse consumenten­autoriteit AESA heeft Vueling meerdere malen beboet voor het systematisch niet naleven van EC 261-verplichtingen. Voor Nederlandse passagiers is Vueling extra lastig: communicatie verloopt traag, is grotendeels in het Spaans en het claimportaal werkt niet altijd correct.',
    claimTips: [
      'Vueling is in Spanje gevestigd — claims vallen onder Spaans toezicht. De AESA (Agencia Estatal de Seguridad Aérea) is de bevoegde autoriteit bij non-betaling. Wij kennen de juiste kanalen.',
      'Stuur de claim per e-mail én via het portaal. Vueling\'s online claimsysteem heeft regelmatig technische problemen. Bevestig altijd per e-mail (customercare@vueling.com) als back-up.',
      'Vueling beroept zich vaak op ATC (luchtverkeersleiding) storingen. Maar als andere vluchten op hetzelfde moment op dezelfde luchthaven gewoon vertrokken, dan is dit verweer ongeldig.',
    ],
  },
  LH: {
    name: 'Lufthansa',
    fullName: 'Deutsche Lufthansa AG',
    avgPaymentWeeks: 8,
    successRate: 84,
    claimDifficulty: 'medium',
    difficultyNote:
      'Lufthansa heeft een gestructureerd klachtenproces maar hanteert regelmatig buitengewone omstandigheden als verweer. Met professionele indiening is de kans op succes aanzienlijk.',
    iataPrefix: 'LH',
    color: '#05164D',
    claimsEmail: 'customerrelations@dlh.de',
    reputationNote:
      'Lufthansa, Duitslands grootste luchtvaartmaatschappij, heeft een gemengde reputatie als het gaat om EC 261-claims. Enerzijds beschikt het bedrijf over een gestructureerd klachtenproces en betaalt het bij duidelijke gevallen. Anderzijds maakten stakingen van Lufthansa-piloten (ver.di en Vereinigung Cockpit) in 2022 en 2023 duizenden vluchten onzeker — en probeerde Lufthansa die stakingen soms als "buitengewone omstandigheid" op te voeren, wat rechters verwierpen.',
    claimTips: [
      'Stakingen van eigen personeel zijn geen buitengewone omstandigheid. Lufthansa gebruikte dit verweer na pilotenacties in 2022-2023. Europese rechtbanken hebben dit consequent verworpen.',
      'Connecting flights via Frankfurt of München: let op de "eerste carrier" regel. Bij een vertraging op de verbindingsvlucht is Lufthansa verantwoordelijk als zij de hele boeking uitvoerde.',
      'Lufthansa Miles & More punten zijn geen vervanging. Soms biedt Lufthansa vouchers of miles aan als "compensatie". Dit is vrijwillig en vervangt je wettelijke recht op €250-€600 niet.',
    ],
  },
  AF: {
    name: 'Air France',
    fullName: 'Air France',
    avgPaymentWeeks: 10,
    successRate: 80,
    claimDifficulty: 'medium',
    difficultyNote:
      'Air France verwerkt claims vanuit Parijs en communiceert traag met buitenlandse passagiers. Een formele claimbrief in het Frans verhoogt de kans op snelle afhandeling.',
    iataPrefix: 'AF',
    color: '#002157',
    claimsEmail: 'customer.care@airfrance.fr',
    reputationNote:
      'Air France, onderdeel van de Air France-KLM groep, heeft een notoire reputatie voor trage claimafhandeling. De airline verwerkt klachten vanuit haar hoofdkantoor in Parijs, wat voor Nederlandse passagiers leidt tot taal- en communicatiebarrières. In de praktijk worden claims die in het Frans worden ingediend significant sneller verwerkt. De Franse luchtvaartautoriteit DGAC ontvangt jaarlijks duizenden klachten over Air France-claims — een teken dat de airline niet spontaan betaalt.',
    claimTips: [
      'Frans werkt beter. Air France behandelt Franstalige claims aantoonbaar sneller. Wij dienen claims in op de juridisch juiste toon die ook bij de interne procedures van Air France aansluit.',
      'Air France Flying Blue miles zijn geen compensatie. Na een vertraging biedt Air France soms bonusmiles aan. Die vervangen je wettelijke recht op €250-€600 niet — tenzij jij akkoord gaat.',
      'Air France en KLM delen vluchten via codeshare. Vloog je op een AF-vluchtnummer maar werd de vlucht uitgevoerd door KLM (of andersom)? De claim richt je aan de uitvoerende carrier, niet de marketing carrier.',
    ],
  },
  BA: {
    name: 'British Airways',
    fullName: 'British Airways',
    avgPaymentWeeks: 9,
    successRate: 83,
    claimDifficulty: 'medium',
    difficultyNote:
      'British Airways valt onder UK261 (identiek aan EC 261/2004) en heeft een redelijk claimproces. Zij gebruiken soms technische mankementen als verweer, maar dat is zelden een geldige grond.',
    iataPrefix: 'BA',
    color: '#2B5FA5',
    claimsEmail: 'customerrelations@ba.com',
    reputationNote:
      'British Airways valt na de Brexit onder UK261, de Britse equivalent van EC 261/2004 — qua vergoedingsbedragen en rechten vrijwel identiek. BA heeft een eigen online claimportaal en betaalt bij duidelijke gevallen doorgaans netjes. De keerzijde: bij vluchten die vertrokken zijn voor de Brexit (vóór 1 januari 2021) gold nog EC 261, bij vluchten erna UK261. Beide geven recht op dezelfde bedragen. BA kampt soms met langere doorlooptijden bij piekperiodes of grote operationele verstoringen.',
    claimTips: [
      'UK261 = dezelfde bedragen als EC 261. Vloog je op BA vanuit Amsterdam? Dan geldt EC 261 (Europees recht). Vloog je vanuit Londen naar Amsterdam? Dan geldt UK261 — maar de bedragen (€250/€400/€600) zijn identiek.',
      'BA Executive Club Avios zijn geen vervanging. British Airways biedt soms Avios (frequent flyer punten) als "compensatie". Dit is vrijwillig en vervangt je wettelijk recht niet.',
      'Heathrow slot-vertragingen: niet automatisch buitengewoon. BA beroept zich op Heathrow-slots als reden voor vertraging. Dit is zelden een geldige buitengewone omstandigheid als de vertraging door BA\'s eigen planning ontstond.',
    ],
  },
  W6: {
    name: 'Wizz Air',
    fullName: 'Wizz Air Hungary',
    avgPaymentWeeks: 14,
    successRate: 71,
    claimDifficulty: 'hard',
    difficultyNote:
      'Wizz Air staat bekend als één van de lastigste airlines — zij wijzen vrijwel alle directe claims af. Onze juridische aanpak is specifiek op hun weigeringstactieken afgestemd.',
    iataPrefix: 'W6',
    color: '#C6007E',
    claimsEmail: 'legalnotices@wizzair.com',
    reputationNote:
      'Wizz Air is door de Britse luchtvaartautoriteit CAA meerdere malen publiekelijk aangesproken op het systematisch niet betalen van compensatie. In 2022 concludeerde de CAA dat Wizz Air de slechtste betaalreputatie van alle grote Europese lowcost-carriers had. Hun standaardstrategie: weigeren, vertragen en hopen dat passagiers afhaken. Wizz Air probeert ook actief passagiers te ontmoedigen door te stellen dat claims "alleen via hun app" ingediend kunnen worden — wat juridisch irrelevant is.',
    claimTips: [
      'Wizz Air\'s "WIZZ Credit" aanbod weigeren. Na een klacht biedt Wizz Air soms WIZZ Credits (tegoed voor toekomstige vluchten) aan als "compensatie". Door dit te accepteren kun je je wettelijke recht verliezen. Weiger altijd — tenzij de waarde hoger is dan je wettelijke aanspraak.',
      'Je hoeft niet via de Wizz Air app te claimen. Wizz Air beweert dat claims alleen via hun app geldig zijn. Dit is onjuist. Een formele claimbrief of e-mail is volledig rechtsgeldig.',
      'Wizz Air opereert vanuit Hongarije (W6) en de UK (W9). Zorg dat je de juiste entiteit aanspreekt — wij regelen dit voor je zodat je claim niet tussen wal en schip valt.',
    ],
  },
  DY: {
    name: 'Norwegian',
    fullName: 'Norwegian Air Shuttle',
    avgPaymentWeeks: 10,
    successRate: 78,
    claimDifficulty: 'medium',
    difficultyNote:
      'Norwegian verwerkt claims redelijk maar heeft de afgelopen jaren veel operationele problemen gehad. De kans op compensatie is goed bij duidelijke gevallen.',
    iataPrefix: 'DY',
    color: '#D81939',
    claimsEmail: 'customerrelations@norwegian.no',
    reputationNote:
      'Norwegian heeft de afgelopen jaren een turbulente periode doorgemaakt: faillissement van dochtermaatschappijen, vlootinkrimping en reorganisatie. Dit heeft het claimproces ernstig vertraagd. De Noorse consumentenautoriteit Luftfartstilsynet heeft Norwegian meerdere keren aangesproken op slechte claimafhandeling. Inmiddels is Norwegian gestabiliseerd als kleiner bedrijf, maar de afhandeltijden zijn nog steeds lang vergeleken met andere Scandinavische carriers.',
    claimTips: [
      'Claim bij de juiste entiteit. Norwegian opereert via meerdere juridische entiteiten (Norwegian Air Shuttle AS in Noorwegen, Norwegian Air International Ltd in Ierland). Wij zorgen dat je claim bij de juiste entiteit terechtkomt.',
      'Wees alert bij geannuleerde vluchten en herboeking. Norwegian annuleerde veel vluchten tijdens de reorganisatie. Bij annulering heb je recht op volledige terugbetaling óf herboeking — plus compensatie bij annulering korter dan 14 dagen van tevoren.',
      'Norwegian\'s lange wachttijden zijn geen wettelijke reden tot vertraging van uitbetaling. Als Norwegian na 8 weken nog niet heeft betaald, kan een formele sommatie de zaak versnellen.',
    ],
  },
  SN: {
    name: 'Brussels Airlines',
    fullName: 'Brussels Airlines',
    avgPaymentWeeks: 9,
    successRate: 82,
    claimDifficulty: 'medium',
    difficultyNote:
      'Brussels Airlines (onderdeel van Lufthansa Group) heeft een gestructureerd claimproces en betaalt bij geldige gevallen doorgaans zonder grote problemen.',
    iataPrefix: 'SN',
    color: '#ED1C24',
    claimsEmail: 'customercare@brusselsairlines.com',
    reputationNote:
      'Brussels Airlines, onderdeel van de Lufthansa Group en nationale carrier van België, heeft een bovengemiddeld claimproces voor een middelgrote Europese airline. Claims worden verwerkt via het Lufthansa Group-systeem, wat een zekere structuur biedt. Het nadeel is dat Brussels Airlines soms verstoppingen kent wanneer ook Lufthansa, Austrian en Swiss tegelijkertijd grote verstoringen hebben — ze delen immers back-officesystemen.',
    claimTips: [
      'Brussels Airlines deelt systemen met Lufthansa Group. Claims voor Brussels Airlines-vluchten lopen via Lufthansa\'s klachteninfrastructuur. Een formele juridische toon werkt het beste.',
      'Brussel-Zaventem is een knooppuntluchthaven met veel ATC-vertragingen. Brussels Airlines beroept zich hier regelmatig op, maar ATC-vertragingen door onderbezetting of slechte planning zijn niet automatisch buitengewoon.',
      'Belgische klachteninstantie: DGLV. Als Brussels Airlines niet reageert, kun je de Belgische luchtvaartautoriteit DGLV inschakelen. Dit versnelt de afhandeling aanzienlijk.',
    ],
  },
  LS: {
    name: 'Jet2',
    fullName: 'Jet2.com',
    avgPaymentWeeks: 8,
    successRate: 85,
    claimDifficulty: 'easy',
    difficultyNote:
      'Jet2 valt onder UK261 en heeft relatief goede klantenservice. Geldige claims worden doorgaans vlot verwerkt.',
    iataPrefix: 'LS',
    color: '#FF6600',
    reputationNote:
      'Jet2 is een Britse lowcost-carrier die populair is voor vakantievluchten vanuit het VK. De airline staat bekend om goede klantenservice en een relatief probleemloze claimafhandeling onder UK261. Jet2 biedt vrijwel altijd vakantievluchten gecombineerd met accommodatie aan, wat soms verwarrend is: de vluchtvertraging valt onder UK261, de vakantieaccommodatie onder pakketreiswetgeving — twee aparte claims.',
    claimTips: [
      'UK261 geldt voor alle Jet2-vluchten vanuit EU-luchthavens. Vloog je vanuit Amsterdam of een andere EU-luchthaven met Jet2? Dan geldt EC 261, met dezelfde bedragen als UK261.',
      'Schei pakketreis en vluchtvorderingen. Jet2 verkoopt vaak combi-vakanties. De vliegtuigvertraging is een EC/UK261-claim bij Jet2; klachten over hotel of busvervoer vallen onder de Pakketreiswet.',
      'Jet2 heeft een online claimportaal dat goed werkt. Dien de claim in via hun systeem als eerste stap — bij afwijzing volgt een formele juridische aanpak.',
    ],
  },
  WA: {
    name: 'KLM Cityhopper',
    fullName: 'KLM Cityhopper',
    avgPaymentWeeks: 7,
    successRate: 87,
    claimDifficulty: 'medium',
    difficultyNote:
      'KLM Cityhopper valt onder het KLM-beleid en verwerkt claims redelijk. Vertraging op korte routes wordt soms bestempeld als buitengewone omstandigheid.',
    iataPrefix: 'WA',
    color: '#009BDE',
    claimsEmail: 'customercare@klm.com',
    reputationNote:
      'KLM Cityhopper is de regionale dochtermaatschappij van KLM die korte- en middellange-afstandsvluchten uitvoert, voornamelijk vanuit Amsterdam Schiphol. Cityhopper vliegt met Embraer-jets op Europese bestemmingen. Juridisch is KLM Cityhopper een zelfstandige entiteit, maar claims worden samen met KLM-claims verwerkt. De claimafhandeling is vergelijkbaar met KLM zelf — redelijk maar niet vanzelfsprekend.',
    claimTips: [
      'KLM Cityhopper vs KLM mainline: zelfde claimproces. Claim bij KLM Royal Dutch Airlines, ook als de vlucht door Cityhopper werd uitgevoerd — zij verwerken dit intern samen.',
      'Korte routes, korte vertragingsdrempel. Voor vluchten onder 1.500 km geldt een compensatie van €250 bij meer dan 3 uur vertraging. Cityhopper vliegt vrijwel uitsluitend op routes in deze categorie.',
      'Schiphol-vertragingen door drukte zijn niet automatisch buitengewoon. KLM Cityhopper beroept zich soms op gate- of slot-problemen op Schiphol. Als dit een structureel planningsprobleem is, is het geen geldige uitzondering.',
    ],
  },

  // ── Ierland ───────────────────────────────────────────────────────────────
  EI: {
    name: 'Aer Lingus',
    fullName: 'Aer Lingus',
    avgPaymentWeeks: 9,
    successRate: 82,
    claimDifficulty: 'medium',
    difficultyNote:
      'Aer Lingus (IAG-groep) heeft een gestructureerd claimproces maar is traag bij communicatie. Professionele indiening verhoogt de kans op tijdige betaling.',
    iataPrefix: 'EI',
    color: '#006837',
    claimsEmail: 'customercare@aerlingus.com',
    reputationNote:
      'Aer Lingus, de Ierse nationale carrier en onderdeel van IAG (British Airways, Iberia, Vueling), heeft een redelijke reputatie voor claimafhandeling. De airline verwerkt claims via Dublin en communiceert doorgaans in het Engels. Een complicerende factor: Aer Lingus biedt veel transatlantische vluchten via Dublin aan, waarbij passagiers vanuit Europa overstappen. Bij deze routes is het cruciaal welk deel van de reis vertraging veroorzaakte en wie de uitvoerende carrier was.',
    claimTips: [
      'Transatlantische vluchten via Dublin: claim bij Aer Lingus. Voor EU-vertrekkende vluchten geldt EC 261 voor het hele traject als Aer Lingus de uitvoerende carrier is op de gehele boeking.',
      'Aer Lingus valt na de Brexit nog steeds onder EC 261 voor vluchten vertrekkend vanuit EU-landen. Vanuit Dublin naar Amsterdam geldt UK261, vanuit Amsterdam naar Dublin geldt EC 261.',
      'IAG-groepsvoordeel: Aer Lingus deelt back-officesystemen met BA en Iberia. Een formele claimbrief werkt beter dan het online klachtenformulier vanwege de interne escalatieroutes.',
    ],
  },

  // ── Duitsland ─────────────────────────────────────────────────────────────
  EW: {
    name: 'Eurowings',
    fullName: 'Eurowings',
    avgPaymentWeeks: 10,
    successRate: 78,
    claimDifficulty: 'medium',
    difficultyNote:
      'Eurowings (Lufthansa-groep) wijst veel claims initieel af met verwijs naar technische problemen. Een formele claimbrief doorbreekt dat patroon doorgaans.',
    iataPrefix: 'EW',
    color: '#8B0000',
    claimsEmail: 'customercare@eurowings.com',
    reputationNote:
      'Eurowings, de lowcost-dochter van Lufthansa, staat in Duitsland bekend om structureel slechte punctualiteit én een stroef claimproces. De Lufthansa-groep heeft Eurowings meerdere malen moeten herstructureren, wat leidde tot vlootproblemen en afgeschafte vluchten. De Schlichtungsstelle Luftverkehr (SL), de Duitse luchtvaartgeschillencommissie, ontvangt jaarlijks meer klachten over Eurowings dan over welke andere Duitse carrier.',
    claimTips: [
      'Eurowings wijst initieel bijna alles af — dat is standaard. De eerste afwijzing is een drempeltactiek. Een formele juridische claimbrief met verwijzing naar EC 261 artikelen leidt in de meeste gevallen alsnog tot uitbetaling.',
      'Technische problemen zijn bijna nooit buitengewoon. Eurowings beroept zich regelmatig op "onverwachte technische mankementen". Dit verweer is alleen geldig bij werkelijk onvoorzienbare defecten, niet bij regulier onderhoud.',
      'Escalatie via SL of Luftfahrtbundesamt. Als Eurowings weigert, is de Schlichtungsstelle Luftverkehr een effectieve escalatieoptie — Eurowings is verplicht mee te werken.',
    ],
  },
  '4U': {
    name: 'Eurowings (4U)',
    fullName: 'Eurowings Discover',
    avgPaymentWeeks: 11,
    successRate: 76,
    claimDifficulty: 'medium',
    difficultyNote:
      'Eurowings Discover (voormalig Condor/Thomas Cook) heeft een vergelijkbaar claimproces als Eurowings. Geduld en persistentie zijn vereist.',
    iataPrefix: '4U',
    color: '#8B0000',
    claimsEmail: 'customercare@eurowings.com',
    reputationNote:
      'Eurowings Discover (IATA-code 4U) is de vakantievluchtdochter van de Lufthansa Group, voortgekomen uit het voormalige Condor en Thomas Cook-vliegtuigen. De airline richt zich op langeafstandsvakantievluchten. Het claimproces lijkt op dat van Eurowings maar kent langere doorlooptijden door de complexere routes en kleinere operationele schaal.',
    claimTips: [
      'Eurowings Discover vs Eurowings: verschillende entiteiten. Ondanks de gelijke naam zijn dit aparte bedrijven met aparte klachtenafdelingen. Wij zorgen dat de claim bij de juiste entiteit terechtkomt.',
      'Lange afstandsvluchten = hogere compensatie. Eurowings Discover vliegt voornamelijk op routes boven 3.500 km (Canarische Eilanden, Caribisch gebied). Bij meer dan 3 uur vertraging heb je recht op €600 per persoon.',
      'Vakantievlucht via touroperator? Claim bij de uitvoerende carrier. Boekte je via een reisorganisatie die Eurowings Discover inzet? De EC 261-claim richt je aan 4U, niet de touroperator.',
    ],
  },
  DE: {
    name: 'Condor',
    fullName: 'Condor Flugdienst',
    avgPaymentWeeks: 11,
    successRate: 77,
    claimDifficulty: 'medium',
    difficultyNote:
      'Condor is een Duits chartermaatschappij met een traag claimproces. Zij reageren beter op formele juridische correspondentie dan op directe verzoeken.',
    iataPrefix: 'DE',
    color: '#F5A623',
    claimsEmail: 'info@condor.com',
    reputationNote:
      'Condor is een van de oudste Duitse vakantieluchtvaartmaatschappijen en heeft een bewogen geschiedenis: bijna-faillissement in 2019 (na de ondergang van Thomas Cook), reddingspakket van de Duitse overheid, en uiteindelijke verkoop aan een private investeerder. Het claimproces is traag en bureaucratisch — Condor heeft niet de schaalgrootte van Lufthansa om claims snel te verwerken. Directe klachten via de klantenservice worden zelden snel opgelost.',
    claimTips: [
      'Condor vliegt veel op vakantiebestemmingen buiten Europa. Let op: EC 261 geldt voor alle vluchten vertrekkend vanuit de EU, én voor EU-carriers die vanuit niet-EU-landen naar de EU vliegen.',
      'Formele correspondentie werkt. Condor reageert aantoonbaar sneller op formele juridische claimdocumenten dan op klantenservicemails. Een aangetekende brief of e-mail met juridische onderbouwing is de meest effectieve aanpak.',
      'Condor\'s eigen "claimformulier" op de website is geen garantie. Het invullen van hun online formulier start het proces maar leidt niet automatisch tot uitbetaling. Volg altijd op met formele correspondentie.',
    ],
  },
  X3: {
    name: 'TUIfly',
    fullName: 'TUIfly (Duitsland)',
    avgPaymentWeeks: 9,
    successRate: 82,
    claimDifficulty: 'medium',
    difficultyNote:
      'TUIfly Duitsland heeft vergelijkbaar beleid als TUI fly Nederland. Bij duidelijke vertragingen wordt doorgaans betaald na formele indiening.',
    iataPrefix: 'X3',
    color: '#E87722',
    claimsEmail: 'feedback@tuifly.com',
    reputationNote:
      'TUIfly (X3) is de Duitse tak van TUI Group en verzorgt vakantievluchten vanuit Duitsland, Oostenrijk en Zwitserland. Het claimproces is vergelijkbaar met TUI fly Nederland maar wordt apart verwerkt vanuit Hamburg. TUIfly heeft relatief veel vluchten naar de Canarische Eilanden, Egypte en Turkije — bestemmingen met regelmatig weer- en luchtverkeersgerelateerde vertragingen die soms onterecht als buitengewoon worden opgevoerd.',
    claimTips: [
      'TUIfly Duitsland (X3) vs TUI fly Nederland (TB): aparte entiteiten. Vloog je vanuit een Duits luchthaven? Dan claim je bij X3. Vanuit Nederland bij TB. Wij kennen het verschil.',
      'Weer als verweer: niet altijd geldig. TUIfly beroept zich regelmatig op "slecht weer" als reden voor vertraging. Maar als de vertraging door een cascade-effect (eerder vertraagd vliegtuig) ontstond, is weer geen geldige grond.',
      'Hoge compensatie op TUI-vakantieroutes. Vluchten naar Egypte, de Canarische Eilanden of de Dominicaanse Republiek vallen in de categorie boven 3.500 km: €600 compensatie per persoon.',
    ],
  },

  // ── Spanje ────────────────────────────────────────────────────────────────
  IB: {
    name: 'Iberia',
    fullName: 'Iberia Líneas Aéreas',
    avgPaymentWeeks: 11,
    successRate: 79,
    claimDifficulty: 'medium',
    difficultyNote:
      'Iberia (IAG-groep) communiceert traag in het Engels en wijst claims soms onterecht af. Wij kennen de Spaanse EC 261-procedures en sturen gerichte sommaties.',
    iataPrefix: 'IB',
    color: '#C60B1E',
    claimsEmail: 'customerservice@iberia.com',
    reputationNote:
      'Iberia, de Spaanse nationale carrier en onderdeel van IAG, heeft een gemengde reputatie voor EC 261-claims. Enerzijds is de claiminfrastructuur als grote IAG-carrier beter dan die van kleinere Spaanse airlines. Anderzijds wordt Iberia jaarlijks door de Spaanse AESA-autoriteit beboet voor structurele overtredingen van passagiersrechten. De airline communiceert voornamelijk in het Spaans en Engels, en buitenlandse claims worden trager verwerkt.',
    claimTips: [
      'AESA is de bevoegde Spaanse autoriteit. Als Iberia niet betaalt, is de Agencia Estatal de Seguridad Aérea (AESA) in Madrid de instantie voor escalatie. Wij kennen de procedures.',
      'Iberia Express (I2) is een aparte entiteit. Vliegt je vlucht onder vluchtnummer I2 in plaats van IB? Dan is Iberia Express de uitvoerende carrier — ook al leek het een Iberia-boeking.',
      'Madrid-Barajas ATC-problemen: niet altijd buitengewoon. Iberia beroept zich regelmatig op ATC-vertragingen op Barajas. Als andere vluchten op hetzelfde tijdstip gewoon vertrokken, is dit verweer onhoudbaar.',
    ],
  },
  UX: {
    name: 'Air Europa',
    fullName: 'Air Europa',
    avgPaymentWeeks: 13,
    successRate: 73,
    claimDifficulty: 'hard',
    difficultyNote:
      'Air Europa reageert traag en heeft financiële problemen gehad. Claims vereisen doorgaans meerdere sommaties voor uitbetaling.',
    iataPrefix: 'UX',
    color: '#003B8E',
    claimsEmail: 'customerservice@aireuropa.com',
    reputationNote:
      'Air Europa is een Spaanse middelgrote carrier die bekendstaat om financiële problemen en een van de slechtste claimreputaties van Europa. In 2020 vroeg de airline staatssteun aan na de coronacrisis, en plannen voor overname door IAG strandden meerdere malen. De AESA-autoriteit heeft Air Europa herhaaldelijk beboet. Passagiers moeten rekening houden met lange doorlooptijden — soms meer dan een jaar zonder formele druk.',
    claimTips: [
      'Meerdere sommaties zijn de norm bij Air Europa. Verwacht niet dat één claimbrief voldoende is. Air Europa betaalt doorgaans pas na herhaalde formele aanmaningen of dreigement van rechtsgang.',
      'Air Europa via IB-codeshare: let op wie de uitvoerende carrier is. Boekte je bij Iberia maar werd de vlucht door Air Europa uitgevoerd? Dan claim je bij Air Europa (UX), niet Iberia.',
      'Financiële instabiliteit is geen juridische uitzondering. Air Europa\'s financiële situatie geeft jou niet minder recht op compensatie. EC 261-plichten gelden altijd, ongeacht de financiële gezondheid van de airline.',
    ],
  },
  V7: {
    name: 'Volotea',
    fullName: 'Volotea',
    avgPaymentWeeks: 12,
    successRate: 74,
    claimDifficulty: 'hard',
    difficultyNote:
      'Volotea is een Spaans-Italiaanse lowcost die claims structureel weigert. Een formele juridische aanpak is vrijwel altijd noodzakelijk.',
    iataPrefix: 'V7',
    color: '#FF6B00',
    claimsEmail: 'customers@volotea.com',
    reputationNote:
      'Volotea is een lowcost-carrier gericht op regionale vluchten binnen Zuid-Europa, opgericht door voormalige Vueling-oprichters. De airline is relatief klein maar heeft een ongunstige reputatie voor passagiersrechten. Volotea weigert structureel directe claims en communiceert traag, ook via hun klantenportal. De ENAC (Italiaanse luchtvaartautoriteit) en AESA (Spaans) hebben Volotea meerdere malen voor het gerecht gesleept.',
    claimTips: [
      'Volotea is in Spanje geregistreerd maar vliegt veel vanuit Italië. De bevoegde autoriteit is AESA (Spanje) voor vluchten vanuit Spanje, ENAC (Italië) voor vluchten vanuit Italië.',
      'Weiger de "reiskrediet"-compensatie. Volotea biedt soms credits voor toekomstige vluchten aan in plaats van geldelijke compensatie. Dit is juridisch geen volwaardig alternatief tenzij jij hier expliciet mee akkoord gaat.',
      'Volotea\'s vluchten zijn relatief kort. De meeste Volotea-routes zijn onder 1.500 km (€250 compensatie) of 1.500-3.500 km (€400). Controleer altijd de afstand voor je claim.',
    ],
  },
  YW: {
    name: 'Air Nostrum',
    fullName: 'Air Nostrum (Iberia Regional)',
    avgPaymentWeeks: 12,
    successRate: 75,
    claimDifficulty: 'hard',
    difficultyNote:
      'Air Nostrum opereert als regionale partner van Iberia en volgt hun trage claimproces. Persistentie is vereist.',
    iataPrefix: 'YW',
    color: '#C60B1E',
    claimsEmail: 'atencionalcliente@airnostrum.es',
    reputationNote:
      'Air Nostrum is de Spaanse regionale carrier die vluchten uitvoert als "Iberia Regional". De airline gebruikt Iberia-vluchtnummers (IB-prefix) maar is een aparte juridische entiteit. Dit veroorzaakt regelmatig verwarring bij passagiers: ze claimen bij Iberia, terwijl de uitvoerende carrier Air Nostrum is. Het claimproces is traag en communiceert weinig proactief met niet-Spaanstalige passagiers.',
    claimTips: [
      'Vloog je op een IB-vluchtnummer maar uitgevoerd door Air Nostrum? Dan claim je bij Air Nostrum (YW), niet bij Iberia. Check altijd wie de uitvoerende carrier was op je boardingpass.',
      'Air Nostrum opereert voornamelijk op routes binnen Spanje en kortere Europese routes. Compensatie bedraagt €250 (onder 1.500 km) of €400 (1.500-3.500 km).',
      'Spaans als voertaal versnelt de afhandeling. Air Nostrum is sterk georiënteerd op Spaanse interne markt. Een claimbrief in het Spaans met verwijzing naar nationale wetgeving werkt beter.',
    ],
  },

  // ── Italië ────────────────────────────────────────────────────────────────
  AZ: {
    name: 'ITA Airways',
    fullName: 'ITA Airways (voorheen Alitalia)',
    avgPaymentWeeks: 14,
    successRate: 70,
    claimDifficulty: 'hard',
    difficultyNote:
      'ITA Airways (opvolger van het failliete Alitalia) heeft een notoir traag en bureaucratisch claimproces. Italiaanse juridische procedures zijn soms nodig.',
    iataPrefix: 'AZ',
    color: '#009246',
    claimsEmail: 'customerrelations@ita-airways.com',
    reputationNote:
      'ITA Airways is de nieuwe Italiaanse nationale carrier die in 2021 het failliete Alitalia overnam. De airline startte met een nieuw begin maar erfde deels de slechte cultuur rondom passagiersrechten. Claims voor vluchten die door het oude Alitalia werden uitgevoerd zijn juridisch complex omdat Alitalia failliet is — maar ITA Airways-vluchten (vanaf oktober 2021) vallen volledig onder EC 261. Inmiddels onderdeel van Lufthansa Group, wat de claiminfrastructuur op termijn kan verbeteren.',
    claimTips: [
      'Alitalia vs ITA Airways: cruciaal onderscheid. Claims voor vluchten vóór oktober 2021 (Alitalia) zijn complex door het faillissement. Vluchten ná oktober 2021 door ITA Airways zijn gewone EC 261-claims.',
      'ITA Airways is nu onderdeel van Lufthansa Group. Dit verandert de claimroutes op termijn. Voorlopig verwerkt ITA nog grotendeels zelfstandig, maar de Lufthansa-procedures worden langzaam geïntegreerd.',
      'ENAC is de Italiaanse klachtenautoriteit. Als ITA Airways niet reageert, is de Ente Nazionale per l\'Aviazione Civile (ENAC) bevoegd. Wij regelen de escalatie in de juiste taal en toon.',
    ],
  },

  // ── Portugal ──────────────────────────────────────────────────────────────
  TP: {
    name: 'TAP Air Portugal',
    fullName: 'TAP Air Portugal',
    avgPaymentWeeks: 13,
    successRate: 72,
    claimDifficulty: 'hard',
    difficultyNote:
      'TAP staat bekend om trage claimafhandeling en veel weigeringen op basis van technische mankementen. Wij kennen hun standaard verweren en weten hoe we dit doorbreken.',
    iataPrefix: 'TP',
    color: '#003E7E',
    claimsEmail: 'feedback@tap.pt',
    reputationNote:
      'TAP Air Portugal heeft een van de slechtste EC 261-reputaties van de grote Europese carriers. De Portugese luchtvaartautoriteit ANAC en Europese consumentenorganisaties plaatsen TAP consequent onderaan in lijstjes van claimvriendelijkheid. TAP verwerkt claims traag vanuit Lissabon, gebruikt technische problemen als standaardverweer en communiceert slecht met niet-Portugese passagiers. Het feit dat TAP deels staatsbezit is, maakt de politieke druk voor verbetering groter, maar de praktijk blijft achter.',
    claimTips: [
      'TAP\'s "technisch probleem" verweer is bijna nooit geldig. TAP beroept zich structureel op technische mankementen. Europese rechters oordelen dat reguliere technische problemen onder de normale luchtvaartrisico\'s vallen en geen buitengewone omstandigheid zijn.',
      'ANAC (Portugal) en INAC zijn de bevoegde instanties. Als TAP niet betaalt, is de Autoridade Nacional de Aviação Civil het escalatiepunt. Alternatieven zijn de Nederlandse ILT of de Europese geschillencommissie.',
      'TAP Miles&Go punten zijn geen wettelijke compensatie. TAP biedt soms bonuspunten aan als schikking. Accepteer dit niet automatisch — je wettelijk recht op €250-€600 cash is sterker.',
    ],
  },

  // ── Oostenrijk & Zwitserland ──────────────────────────────────────────────
  OS: {
    name: 'Austrian Airlines',
    fullName: 'Austrian Airlines',
    avgPaymentWeeks: 8,
    successRate: 84,
    claimDifficulty: 'medium',
    difficultyNote:
      'Austrian Airlines (Lufthansa-groep) heeft een gestructureerd claimproces. Zij betalen doorgaans bij geldige gevallen, maar de initiële reactie is traag.',
    iataPrefix: 'OS',
    color: '#ED2224',
    claimsEmail: 'customerrelations@austrian.com',
    reputationNote:
      'Austrian Airlines, onderdeel van de Lufthansa Group, heeft de reputatie van een degelijke middelgrote carrier met een bovengemiddeld claimproces. Wenen-Schwechat is een relatief kleine hub, waardoor operationele verstoringen minder frequent zijn dan op Amsterdam, Frankfurt of Londen. Toch probeert Austrian soms cascade-vertragingen (een eerder vertraagd vliegtuig) als buitengewone omstandigheid op te voeren — wat juridisch onjuist is.',
    claimTips: [
      'Cascade-vertragingen zijn Austrian\'s meest gebruikte verweer. "Het inkomende vliegtuig was te laat" is géén buitengewone omstandigheid — dat is een normale operationele situatie die Austrian zelf moet managen.',
      'Austrian Airlines deelt het Lufthansa Group-klachtensysteem. Gebruik de formele correspondentiekanalen (e-mail of aangetekende brief) voor de snelste reactie — niet de chat of telefonische klantenservice.',
      'Wenen als doorverbindingshub: "hele traject" telt. Vloog je via Wenen door naar een andere bestemming? Bij vertraging telt de eindbestemming voor de compensatieberekening, niet de tussenstop.',
    ],
  },
  LX: {
    name: 'Swiss',
    fullName: 'Swiss International Air Lines',
    avgPaymentWeeks: 9,
    successRate: 83,
    claimDifficulty: 'medium',
    difficultyNote:
      'Swiss (Lufthansa-groep) valt niet onder EC 261 voor vluchten buiten de EU, maar wel voor EU-vertrekkende vluchten. Zij verwerken claims methodisch maar traag.',
    iataPrefix: 'LX',
    color: '#E50000',
    claimsEmail: 'customerrelations@swiss.com',
    reputationNote:
      'Swiss International Air Lines, ook onderdeel van Lufthansa Group, heeft een solide reputatie als premium carrier. Zwitserland maakt geen deel uit van de EU of EEA, maar vluchten die vertrekken vanuit EU-luchthavens vallen volledig onder EC 261. Swiss verwerkt claims via Zürich en staat bekend om een methodische aanpak — traag maar uiteindelijk eerlijk bij geldige claims.',
    claimTips: [
      'Zürich is geen EU-luchthaven. Vloog je van Amsterdam naar Zürich met Swiss? EC 261 geldt (vertrek vanuit EU). Vloog je van Zürich naar Amsterdam? EC 261 geldt ook, want Swiss is een EU-carrier... Nee: Swiss is een Zwitserse carrier. Van Zürich naar EU geldt EC 261 NIET voor Swiss. Van EU naar Zürich wél.',
      'Swiss biedt Miles & More als compensatie aan. Dit is een vrijwillig aanbod van Lufthansa Group en vervangt jouw wettelijke cashrecht niet. Weiger het tenzij de waarde aantoonbaar hoger is.',
      'Zurich-vertragingen door winterweer: gedeeltelijk buitengewoon. Swiss beroept zich op Zürichs sneeuwweer. Sneeuw is soms wél een geldige buitengewone omstandigheid — maar niet altijd. Wij beoordelen je specifieke geval.',
    ],
  },

  // ── Scandinavië & Noord-Europa ────────────────────────────────────────────
  SK: {
    name: 'SAS',
    fullName: 'Scandinavian Airlines',
    avgPaymentWeeks: 10,
    successRate: 80,
    claimDifficulty: 'medium',
    difficultyNote:
      'SAS heeft doorlopende herstructurering gehad maar verwerkt EC 261-claims redelijk. Formele indiening werkt beter dan directe klachten.',
    iataPrefix: 'SK',
    color: '#003082',
    claimsEmail: 'customerrelations@sas.se',
    reputationNote:
      'SAS (Scandinavian Airlines) ging in 2022 door een Chapter 11 herstructureringsprocedure in de VS na financiële problemen. De airline is inmiddels gereorganiseerd en onderdeel geworden van de SkyTeam-alliantie (Air France-KLM). Pilotenstakingen in 2022 veroorzaakten duizenden gecancelde vluchten. Belangrijk: stakingen van eigen piloten gelden volgens Europese rechters NIET als buitengewone omstandigheid — SAS is dus verantwoordelijk voor die compensatie.',
    claimTips: [
      'De SAS-pilotenstaak van 2022: jouw recht bestaat nog. Vluchten die tijdens de pilotenstaak gecanceld werden, geven recht op compensatie. SAS probeerde dit te vermijden, maar rechters oordeelden anders.',
      'SAS opereert via Denemarken, Noorwegen én Zweden. De bevoegde nationale autoriteit hangt af van de luchthaven van vertrek — dit beïnvloedt de escalatieroute bij non-betaling.',
      'SAS EuroBonus punten zijn geen compensatie. Net als bij andere airlines: miles/punten als aangeboden compensatie vervangen je wettelijk recht op €250-€600 niet.',
    ],
  },
  AY: {
    name: 'Finnair',
    fullName: 'Finnair',
    avgPaymentWeeks: 9,
    successRate: 83,
    claimDifficulty: 'medium',
    difficultyNote:
      'Finnair heeft een professioneel claimproces en betaalt bij duidelijke gevallen doorgaans binnen de termijn. Wij zorgen dat de claim formeel waterdicht is.',
    iataPrefix: 'AY',
    color: '#003580',
    claimsEmail: 'customerservice@finnair.com',
    reputationNote:
      'Finnair, de Finse nationale carrier, heeft een van de betere reputaties onder Europese airlines voor EC 261-naleving. De airline opereert vanuit Helsinki als doorverbindingshub naar Azië en heeft een vrij gestructureerd claimproces. Na de sluiting van het Russische luchtruim (2022) moest Finnair veel Aziatische routes omleggen via langere trajecten, wat tot extra vertragingen leidde. Claims hiervoor zijn in principe valid.',
    claimTips: [
      'Helsinki als Aziatische doorverbindingshub: lange routes = hoge compensatie. Veel Finnair-vluchten gaan via Helsinki naar Japan, Korea of China — routes boven 3.500 km waar €600 compensatie per persoon van toepassing is.',
      'Omleiding via Russisch luchtruim: niet automatisch buitengewoon. De sluiting van het Russische luchtruim was een politieke beslissing, maar Finnair was een van de weinige carriers die hier zwaar door geraakt werd. De aansprakelijkheid hangt af van de specifieke omstandigheid.',
      'Finnair Plus punten als compensatie: weiger dit. Finnair biedt soms loyaliteitspunten aan als schikking. Dit vervangen je EC 261-rechten niet.',
    ],
  },
  D8: {
    name: 'Norwegian (D8)',
    fullName: 'Norwegian Air International',
    avgPaymentWeeks: 11,
    successRate: 76,
    claimDifficulty: 'medium',
    difficultyNote:
      'Norwegian Air International (Ierse entiteit) hanteert vergelijkbaar beleid als DY. Wij weten welke entiteit aangeschreven moet worden voor de beste kans op succes.',
    iataPrefix: 'D8',
    color: '#D81939',
    claimsEmail: 'customerrelations@norwegian.no',
    reputationNote:
      'Norwegian Air International (D8) is de Ierse zustermaatschappij van Norwegian Air Shuttle (DY). Beide opereren onder de Norwegian-brand maar zijn aparte juridische entiteiten. D8 voert met name vluchten uit vanuit luchthavens buiten Noorwegen. Het claimproces is identiek aan DY maar vereist dat de claim bij de correcte Ierse entiteit wordt ingediend — een veel voorkomende fout van passagiers die direct bij DY in Noorwegen claimen.',
    claimTips: [
      'D8 of DY: check het vluchtnummer. Als je vluchtnummer begint met DY, is het Norwegian Air Shuttle (Noors). Begint het met D8, dan is het Norwegian Air International (Iers). Wij bepalen altijd de juiste entiteit.',
      'Zelfde merk, andere rechten. Beide entiteiten vallen onder EC 261 voor EU-vertrekkende vluchten, maar de juridische aansprakelijkheid verschilt per vlucht. Wij zorgen dat de claim correct wordt ingediend.',
      'Norwegian\'s app-claim is geen verplichting. Net als bij Ryanair suggereert Norwegian dat claims alleen via hun app ingediend kunnen worden. Dit is onjuist — een formele claimbrief is volledig rechtsgeldig.',
    ],
  },
  FI: {
    name: 'Icelandair',
    fullName: 'Icelandair',
    avgPaymentWeeks: 10,
    successRate: 80,
    claimDifficulty: 'medium',
    difficultyNote:
      'Icelandair valt als EEA-carrier onder EC 261 en heeft een redelijk claimproces. Weersgerelateerde vertragingen worden soms onterecht als buitengewone omstandigheid opgevoerd.',
    iataPrefix: 'FI',
    color: '#003876',
    claimsEmail: 'customercare@icelandair.is',
    reputationNote:
      'Icelandair is de nationale carrier van IJsland, dat lid is van de EEA (maar niet de EU). Dit betekent dat Icelandair volledig onder EC 261 valt. IJsland staat bekend om onvoorspellig weer en vulkaanactiviteit, wat Icelandair regelmatig als verweer gebruikt voor vertragingen. Echter: vulkanische as is alleen een geldige buitengewone omstandigheid als het daadwerkelijk een concrete bedreiging vormde voor de vlucht — niet elke IJslandse vulkaanactiviteit kwalificeert.',
    claimTips: [
      'Vulkaanuitbarstingen zijn zelden een geldige uitzondering. Icelandair beroept zich soms op vulkaanactiviteit. Dit is alleen geldig als luchtruimsluiting officieel was afgekondigd door de bevoegde autoriteit — niet bij preventieve maatregelen.',
      'Reykjavik als doorgangshub voor Noord-Amerika: hoge compensatie. Icelandair vliegt veel via Keflavík naar de VS en Canada. Routes boven 3.500 km buiten de EU geven recht op €600 per persoon.',
      'IJslands weer vs operationele problemen. Icelandair onderscheidt "force majeure" en reguliere operationele vertragingen. Wij analyseren of het opgegeven weersverweer in jouw specifieke geval houdbaar is.',
    ],
  },

  // ── Oost-Europa ───────────────────────────────────────────────────────────
  LO: {
    name: 'LOT Polish Airlines',
    fullName: 'LOT Polish Airlines',
    avgPaymentWeeks: 11,
    successRate: 77,
    claimDifficulty: 'medium',
    difficultyNote:
      'LOT heeft een bureaucratisch claimproces en communiceert traag buiten Polen. Een formele claimbrief met juridische onderbouwing versnelt het proces aanzienlijk.',
    iataPrefix: 'LO',
    color: '#005CA9',
    claimsEmail: 'contact@lot.com',
    reputationNote:
      'LOT Polish Airlines is de nationale carrier van Polen en een van de grotere Oost-Europese airlines. Het claimproces is bureaucratisch en sterk gericht op de Poolse markt — Engels-talige correspondentie leidt tot langere reactietijden. De Poolse luchtvaartautoriteit ULC heeft LOT meerdere malen moeten aanspreken op niet-naleving van EC 261. Claims voor vluchten via Warschau (LOT\'s hub) worden doorgaans sneller verwerkt dan voor overige routes.',
    claimTips: [
      'LOT communiceert trager in het Engels. Een formele claimbrief in professioneel Engels (geen automatische vertaling) wordt sneller verwerkt dan een informeel klantenserviceverzoek.',
      'Warschau Chopin als hub: connecting flights. Veel LOT-vluchten verbinden via Warschau. Bij vertraging op de aankomstbestemming telt de totale vertraging ten opzichte van de eindbestemming.',
      'LOT SmartWings miles zijn geen compensatie. Net als andere airlines biedt LOT soms bonusmiles aan. Dit vervangt jouw wettelijk recht op €250-€600 niet.',
    ],
  },
  BT: {
    name: 'airBaltic',
    fullName: 'Air Baltic Corporation',
    avgPaymentWeeks: 11,
    successRate: 76,
    claimDifficulty: 'medium',
    difficultyNote:
      'airBaltic reageert traag op directe claims maar betaalt doorgaans na formele juridische correspondentie. Geduld en een goede dossieropbouw zijn essentieel.',
    iataPrefix: 'BT',
    color: '#37A000',
    claimsEmail: 'customer.service@airbaltic.com',
    reputationNote:
      'airBaltic is de nationale carrier van Letland en een van de kleinere Europese luchtvaartmaatschappijen. De airline is volledig in handen van de Letse overheid en heeft een vrij goede punctualiteitsreputatie. Het claimproces is echter traag voor niet-Baltische passagiers: de klachtenafdeling in Riga heeft beperkte capaciteit voor Engelstalige correspondentie. Claims worden wel betaald, maar geduld en formele aanpak zijn essentieel.',
    claimTips: [
      'airBaltic vliegt veel op Riga als hub. Vertragingen op verbindingsvluchten via Riga zijn EC 261-claims als je de eindbestemming meer dan 3 uur te laat bereikte.',
      'Riga is een relatief kleine luchthaven — ATC-vertragingen zijn hier zelden als buitengewoon aan te merken. airBaltic beroept zich hier soms onterecht op.',
      'Letse klachtenautoriteit als escalatie. Als airBaltic niet reageert, is de Directoraat-Generaal Civiele Luchtvaart van Letland (CAA Latvia) de bevoegde instantie voor escalatie.',
    ],
  },
  RO: {
    name: 'TAROM',
    fullName: 'TAROM Romanian Air Transport',
    avgPaymentWeeks: 13,
    successRate: 72,
    claimDifficulty: 'hard',
    difficultyNote:
      'TAROM heeft een trage en bureaucratische claimafhandeling. Roemeense klachteninstanties zijn soms noodzakelijk voor uitbetaling.',
    iataPrefix: 'RO',
    color: '#003087',
    claimsEmail: 'customerrelations@tarom.ro',
    reputationNote:
      'TAROM is de Roemeense nationale carrier en heeft een van de traagste claimprocessen in Europa. De airline is grotendeels staatsbezit en kent een sterk bureaucratische organisatiecultuur. Buitenlandse claims worden laag geprioriteerd. De Roemeense luchtvaartautoriteit RCAA heeft beperkte handhavingscapaciteit, waardoor TAROM weinig druk voelt om EC 261-verplichtingen actief na te leven.',
    claimTips: [
      'TAROM reageert nauwelijks op directe claims. Stuur nooit alleen een klachtenmail — gebruik altijd een formele juridische claimbrief met expliciete verwijzing naar EC 261 en aankondiging van verdere stappen.',
      'Roemeense RCAA als escalatie: mogelijk maar traag. De Autoritatea Aeronautică Civilă Română (RCAA) kan worden ingeschakeld. In de praktijk is een rechtstreekse juridische sommatie effectiever.',
      'TAROM-vluchten hebben veel vertragingen op Boekarest-Otopeni. De luchthaven heeft beperkte capaciteit. Wij analyseren of de vertraging aan TAROM zelf toe te rekenen is.',
    ],
  },
  OK: {
    name: 'Czech Airlines',
    fullName: 'Czech Airlines',
    avgPaymentWeeks: 12,
    successRate: 74,
    claimDifficulty: 'hard',
    difficultyNote:
      'Czech Airlines communiceert traag en wijst claims soms onterecht af. Persistentie en formele juridische stappen zijn nodig.',
    iataPrefix: 'OK',
    color: '#003087',
    claimsEmail: 'customerrelations@czechairlines.com',
    reputationNote:
      'Czech Airlines (ČSA) is de Tsjechische nationale carrier die al jaren kampt met financiële problemen en vlootinkrimping. De airline richt zich steeds meer op regionale routes vanuit Praag. Het claimproces is bureaucratisch en communiceert slecht met niet-Tsjechische passagiers. Veel claims worden bij eerste indiening afgewezen met standaardbrieven — een formele juridische aanpak is vrijwel altijd vereist.',
    claimTips: [
      'Tsjechische luchtvaartautoriteit CAA CZ als escalatie. Als Czech Airlines niet betaalt, is de Úřad pro civilní letectví (CAA) in Praag de bevoegde autoriteit. Wij regelen de escalatie.',
      'Czech Airlines opereert in samenwerking met Korean Air (SkyTeam). Let op welke carrier de vlucht feitelijk uitvoerde bij gecodeshare vluchten — de uitvoerende carrier is aansprakelijk.',
      'Praag-Václav Havel heeft goede infrastructuur — technische vertragingen door luchthavenproblemen zijn hier zelden geldig als buitengewone omstandigheid.',
    ],
  },
  OU: {
    name: 'Croatia Airlines',
    fullName: 'Croatia Airlines',
    avgPaymentWeeks: 12,
    successRate: 75,
    claimDifficulty: 'hard',
    difficultyNote:
      'Croatia Airlines heeft een traag claimproces en beperkte capaciteit voor internationale correspondentie. Formele indiening in het Engels is noodzakelijk.',
    iataPrefix: 'OU',
    color: '#E4002B',
    claimsEmail: 'customerrelations@croatiaairlines.hr',
    reputationNote:
      'Croatia Airlines is de kleine nationale carrier van Kroatië (EU-lid sinds 2013) en heeft een beperkte vloot en operationele schaal. De airline heeft weinig capaciteit voor claimafhandeling buiten Kroatië en communiceert slecht in buitenlandse talen. Croatia Airlines vliegt voornamelijk op toeristische routes naar Zagreb en Dubrovnik, wat in de zomer tot piekvertragingen leidt.',
    claimTips: [
      'Kroatische CCAA als klachtenautoriteit. De Croatian Civil Aviation Agency (CCAA) in Zagreb is de bevoegde instantie als Croatia Airlines niet reageert. Wij kennen de procedure.',
      'Zomerpiekvertragingen op toeristische routes zijn niet automatisch buitengewoon. Hoge drukte op Dubrovnik of Split is geen geldige reden — dat is een structureel planningsprobleem.',
      'Croatia Airlines werkt samen met Lufthansa (Star Alliance). Bij codeshare-vluchten via Frankfurt of andere Lufthansa-hubs: de uitvoerende carrier is verantwoordelijk, niet de marketingcarrier.',
    ],
  },
  FB: {
    name: 'Bulgaria Air',
    fullName: 'Bulgaria Air',
    avgPaymentWeeks: 13,
    successRate: 72,
    claimDifficulty: 'hard',
    difficultyNote:
      'Bulgaria Air heeft een trage claimafhandeling. Bulgaarse klachteninstanties zijn soms noodzakelijk voor uitbetaling.',
    iataPrefix: 'FB',
    color: '#006DB7',
    claimsEmail: 'customerservice@air.bg',
    reputationNote:
      'Bulgaria Air is de nationale carrier van Bulgarije en heeft een van de kleinste operaties van de Europese nationale airlines. Claimafhandeling is traag en communiceert nauwelijks in andere talen dan Bulgaars en Engels. De Bulgaarse CAA heeft beperkte handhavingscapaciteit. Directe claims worden zelden spontaan gehonoreerd — formele juridische stappen zijn vrijwel standaard nodig.',
    claimTips: [
      'Bulgaria Air vliegt voornamelijk op Sofia als hub. Bij verbindingsvluchten via Sofia telt de vertraging op de eindbestemming voor EC 261.',
      'Bulgaarse CAA als escalatie. De Civil Aviation Administration of Bulgaria kan worden ingeschakeld, maar de doorlooptijden zijn lang. Een directe juridische sommatie is effectiever.',
      'Sofia-luchthaven kampt met beperkte infrastructuur. Vertragingen door gate- of baan-problemen op Sofia Airport zijn niet automatisch buitengewoon als dit structurele planningsproblemen zijn.',
    ],
  },
  OV: {
    name: 'SAS Connect',
    fullName: 'SAS Connect (voorheen Estonian Air)',
    avgPaymentWeeks: 11,
    successRate: 77,
    claimDifficulty: 'medium',
    difficultyNote:
      'SAS Connect opereert als regionale partner van SAS. Claimafhandeling volgt SAS-beleid.',
    iataPrefix: 'OV',
    color: '#003082',
    claimsEmail: 'customerrelations@sas.se',
    reputationNote:
      'SAS Connect is de regionale dochtermaatschappij van SAS die kortere routes verzorgt. De carrier is voortgekomen uit de overname en herstructurering van meerdere Scandinavische regionale luchtvaartmaatschappijen. Claimafhandeling loopt via SAS-systemen en is redelijk gestructureerd. Het onderscheid tussen SAS en SAS Connect is voor passagiers niet altijd duidelijk — wij zorgen dat de claim bij de juiste entiteit terechtkomt.',
    claimTips: [
      'SAS Connect vs SAS: zelfde rechten, andere entiteit. EC 261-claims voor OV-vluchten gaan direct naar SAS Connect, maar de SAS-klachteninfrastructuur wordt gebruikt. Wij regelen dit correct.',
      'Regionale routes zijn korter — compensatie is €250. De meeste SAS Connect-vluchten vallen in de categorie onder 1.500 km. Dit geeft recht op €250 bij meer dan 3 uur vertraging.',
      'Skandinavische wintervertragingen: niet altijd buitengewoon. SAS Connect beroept zich op nordic winterweer. Alleen bij officieel afgekonderde luchthavensluiting is dit een geldig verweer.',
    ],
  },
  TE: {
    name: 'Lithuanian Airlines',
    fullName: 'Lithuanian Airlines',
    avgPaymentWeeks: 12,
    successRate: 73,
    claimDifficulty: 'hard',
    difficultyNote:
      'Lithuanian Airlines heeft beperkte capaciteit voor internationale claims. Formele indiening is noodzakelijk.',
    iataPrefix: 'TE',
    color: '#FFB800',
    claimsEmail: 'info@smallplanet.aero',
    reputationNote:
      'Lithuanian Airlines (Small Planet Airlines Lithuania) heeft een bewogen geschiedenis met faillissement in 2018. De huidige activiteiten zijn beperkt. Voor historische claims (vluchten vóór het faillissement) is de juridische situatie complex. Voor eventuele huidige vluchten van airlines die de TE-code gebruiken gelden de normale EC 261-rechten, maar de carrier heeft beperkte claiminfrastructuur.',
    claimTips: [
      'Historische TE-claims: check of de carrier nog actief is. Small Planet Airlines (TE) is in 2018 failliet gegaan. Claims voor vluchten erna vallen onder de opvolgentiteit.',
      'Litouwse CAA als bevoegde instantie. De Civil Aviation Administration of Lithuania (CAA LT) in Vilnius behandelt klachten over in Litouwen geregistreerde carriers.',
      'Kleine regionale carriers zijn extra kwetsbaar. Zorg dat je de claim snel indient — bij financiële problemen van een kleine carrier wordt uitbetaling aanzienlijk moeilijker.',
    ],
  },
  KM: {
    name: 'Air Malta',
    fullName: 'Air Malta / KM Malta Airlines',
    avgPaymentWeeks: 11,
    successRate: 76,
    claimDifficulty: 'medium',
    difficultyNote:
      'Air Malta (geherstructureerd als KM Malta Airlines) verwerkt claims redelijk. Wij zorgen dat de claim bij de juiste entiteit terechtkomt.',
    iataPrefix: 'KM',
    color: '#CC0000',
    claimsEmail: 'customercare@kmmalta.com',
    reputationNote:
      'Air Malta is in 2023 opgeheven en vervangen door KM Malta Airlines, een nieuwe Maltese nationale carrier met dezelfde IATA-code. KM Malta Airlines is kleiner dan zijn voorganger en richt zich op toeristische routes naar Malta. Claims voor vluchten van het oude Air Malta zijn juridisch complex. Claims voor KM Malta Airlines-vluchten (na 2023) vallen volledig onder EC 261.',
    claimTips: [
      'Air Malta vs KM Malta Airlines: cruciaal onderscheid. Vloog je vóór 2023? Dan gaat de claim mogelijk naar het failliete Air Malta — een complex juridisch traject. Na 2023 claim je bij KM Malta Airlines.',
      'Malta is een kleine EU-eilandstaat — luchthavenproblemen door drukte zijn niet buitengewoon. Malta Airport heeft beperkte capaciteit in de zomer, maar structurele drukte kwalificeert niet als force majeure.',
      'Maltese MCCAA als klachteninstantie. De Malta Competition and Consumer Affairs Authority behandelt klachten over KM Malta Airlines bij non-betaling.',
    ],
  },

  // ── Griekenland ───────────────────────────────────────────────────────────
  A3: {
    name: 'Aegean Airlines',
    fullName: 'Aegean Airlines',
    avgPaymentWeeks: 11,
    successRate: 77,
    claimDifficulty: 'medium',
    difficultyNote:
      'Aegean Airlines communiceert voornamelijk in het Grieks en hanteert trage procedures voor buitenlandse passagiers. Formele indiening in het Engels werkt doorgaans.',
    iataPrefix: 'A3',
    color: '#003580',
    claimsEmail: 'customerrelations@aegeanair.com',
    reputationNote:
      'Aegean Airlines is de grootste Griekse carrier en lid van Star Alliance. De airline heeft een redelijk punctualiteitsrecord maar kampt met trage claimafhandeling voor niet-Griekse passagiers. Griekse eilanden zijn populaire toeristische bestemmingen, wat in de zomer leidt tot piekvertragingen op Athene en eilandluchthavens. De Griekse luchtvaartautoriteit HAA handhaaft EC 261 en is effectief bij escalatie.',
    claimTips: [
      'Griekse HAA als escalatie. De Hellenic Civil Aviation Authority (HAA) in Athene is de bevoegde instantie voor EC 261-klachten over Aegean. Wij kennen de procedure voor escalatie.',
      'Athene als doorverbindingshub. Aegean vliegt veel via Athene naar Griekse eilanden. Bij vertraging op de eindbestemming telt het totale traject voor de compensatieberekening.',
      'Zomerpiekvertragingen op eilandluchthavens: niet automatisch buitengewoon. Samos, Rhodos, Mykonos — deze luchthavens zijn klein maar de vertragingen zijn structureel en niet "buitengewoon".',
    ],
  },

  // ── Luxemburg ─────────────────────────────────────────────────────────────
  LG: {
    name: 'Luxair',
    fullName: 'Luxair',
    avgPaymentWeeks: 8,
    successRate: 85,
    claimDifficulty: 'easy',
    difficultyNote:
      'Luxair is een kleine nationale carrier met een professioneel claimproces. Geldige claims worden doorgaans snel afgehandeld.',
    iataPrefix: 'LG',
    color: '#003087',
    claimsEmail: 'info@luxair.lu',
    reputationNote:
      'Luxair is de nationale carrier van Luxemburg en een van de kleinere maar meest punctuele Europese airlines. De airline opereert voornamelijk op kortere Europese routes en heeft een professioneel claimproces. Als nationale carrier van het Groothertogdom — een van de rijkste landen ter wereld — heeft Luxair weinig reden om claims te ontwijken: de reputatieschade weegt zwaarder dan de claimkosten.',
    claimTips: [
      'Luxair verwerkt claims relatief snel. Eerste indiening via hun online formulier leidt bij Luxair vaker dan bij andere airlines tot directe afhandeling zonder formele escalatie.',
      'Luxemburg-Findel Airport is compact en efficiënt. Vertragingen hier zijn zelden te wijten aan luchthavenoorzaken — Luxair draagt doorgaans zelf de verantwoordelijkheid.',
      'Korte routes = €250 compensatie. Luxair vliegt voornamelijk op routes onder 1.500 km. Bij meer dan 3 uur vertraging heb je recht op €250 per persoon.',
    ],
  },

  // ── Turkije (niet-EU, geldt bij EU-vertrek) ───────────────────────────────
  TK: {
    name: 'Turkish Airlines',
    fullName: 'Turkish Airlines',
    avgPaymentWeeks: 14,
    successRate: 70,
    claimDifficulty: 'hard',
    difficultyNote:
      'Turkish Airlines valt onder EC 261 alleen voor vluchten vertrekkend uit EU-luchthavens. Zij wijzen directe claims structureel af en vereisen formele juridische stappen.',
    iataPrefix: 'TK',
    color: '#C70A0C',
    claimsEmail: 'customerrelations@thy.com',
    reputationNote:
      'Turkish Airlines is een van de grootste luchtvaartmaatschappijen ter wereld maar heeft een slechte reputatie voor EC 261-naleving. De airline is gevestigd in Turkije (geen EU-lid) en valt uitsluitend onder EC 261 voor vluchten die vertrekken vanuit EU-luchthavens. Bij vluchten van Istanbul naar Amsterdam is EC 261 dus NIET van toepassing (Turkse carrier, vertrek buiten EU). Bij Amsterdam naar Istanbul WEL. Turkish Airlines wijst directe claims structureel af en vereist bijna altijd juridische escalatie.',
    claimTips: [
      'EC 261 geldt alleen bij vertrek vanuit de EU. Vloog je van Amsterdam (of een andere EU-luchthaven) met Turkish Airlines? Dan heb je EC 261-rechten. Vloog je vanuit Istanbul? Niet.',
      'Turkish Airlines Miles&Smiles punten zijn geen compensatie. Turkish Airlines biedt na klachten soms bonusmiles aan. Dit vervangt jouw wettelijke recht op €250-€600 contant niet.',
      'Istanbul Airport ATC is druk maar niet buitengewoon. Turkish Airlines beroept zich op Istanbuls drukte. Voor EU-vertrekkende vluchten gelden EC 261-plichten ongeacht wat er op Istanbul Airport speelt.',
    ],
  },
  PC: {
    name: 'Pegasus Airlines',
    fullName: 'Pegasus Airlines',
    avgPaymentWeeks: 14,
    successRate: 69,
    claimDifficulty: 'hard',
    difficultyNote:
      'Pegasus (Turkse LCC) heeft een notoir traag claimproces voor Europese passagiers. Wij kennen de juridische route voor Turkse carriers.',
    iataPrefix: 'PC',
    color: '#FF6B00',
    claimsEmail: 'customercare@flypgs.com',
    reputationNote:
      'Pegasus Airlines is een Turkse lowcost-carrier die populair is voor vluchten naar Turkije en het Midden-Oosten. Net als Turkish Airlines valt Pegasus uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. De claiminfrastructuur voor Europese passagiers is minimaal: de klantenservice communiceert traag en weigert bijna altijd bij directe indiening. Formele juridische stappen zijn vrijwel altijd noodzakelijk.',
    claimTips: [
      'EC 261 geldt alleen bij EU-vertrek. Pegasus vliegt veel van Amsterdam, Rotterdam, Brussel naar Istanbul en Ankara. Vertrek vanuit deze EU-steden = EC 261-rechten.',
      'Pegasus hanteert een kleine lettertjes-beleid. In hun algemene voorwaarden proberen ze passagiersrechten te beperken. Dit heeft echter geen juridische geldigheid — EC 261 heeft voorrang op vervoersvoorwaarden.',
      'Turkse DGCA is geen optie voor EC 261-claims. De Turkse luchtvaartautoriteit handhaaft geen Europese wetgeving. Bij non-betaling is escalatie via de Nederlandse ILT of een rechtbank de enige weg.',
    ],
  },
  XQ: {
    name: 'SunExpress',
    fullName: 'SunExpress',
    avgPaymentWeeks: 12,
    successRate: 73,
    claimDifficulty: 'hard',
    difficultyNote:
      'SunExpress (joint venture Lufthansa/Turkish Airlines) valt bij EU-vertrek onder EC 261. Claims vereisen persistentie en formele juridische correspondentie.',
    iataPrefix: 'XQ',
    color: '#FF6600',
    claimsEmail: 'customerrelations@sunexpress.com',
    reputationNote:
      'SunExpress is een joint venture van Lufthansa en Turkish Airlines, geregistreerd in Turkije en gericht op vakantievluchten naar Turkse bestemmingen. Als Turkse carrier valt SunExpress uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. De Lufthansa-connectie biedt enige structuur, maar de claimafhandeling is aanzienlijk slechter dan Lufthansa zelf.',
    claimTips: [
      'SunExpress is geen Europese carrier. Ondanks de Lufthansa-connectie is SunExpress een Turkse maatschappij. EC 261 geldt alleen bij EU-vertrek — niet voor vluchten vanuit Antalya of Bodrum.',
      'Vakantiebestemmingen in Turkije: hoge compensatie mogelijk. Vluchten van Amsterdam naar Antalya zijn doorgaans boven 1.500 km (€400) — check de exacte afstand voor jouw route.',
      'Escaleer via de luchthaven van vertrek. Bij een SunExpress-vlucht die vertrok vanuit Amsterdam geldt de Nederlandse ILT als toezichthouder. Wij kennen de escalatieroute.',
    ],
  },

  // ── Golf & Midden-Oosten (geldt bij EU-vertrek) ───────────────────────────
  EK: {
    name: 'Emirates',
    fullName: 'Emirates',
    avgPaymentWeeks: 16,
    successRate: 67,
    claimDifficulty: 'hard',
    difficultyNote:
      'Emirates valt onder EC 261 uitsluitend voor vluchten vertrekkend uit EU-luchthavens. Zij wijzen bijna alle claims initieel af en vereisen juridische escalatie.',
    iataPrefix: 'EK',
    color: '#C60C30',
    claimsEmail: 'customersupport@emirates.com',
    reputationNote:
      `Emirates, 's werelds grootste internationale luchtvaartmaatschappij, valt uitsluitend onder EC 261 voor vluchten die vertrekken vanuit EU-luchthavens. Bij vluchten vanuit Dubai naar Amsterdam geldt EC 261 dus NIET. De airline wijst Europese compensatieclaims bij directe indiening structureel af en verwijst passagiers naar haar eigen "klachtenbehandeling" in Dubai — wat juridisch irrelevant is als EC 261 van toepassing is.`,
    claimTips: [
      'EC 261 geldt alleen bij EU-vertrek. Vloog je van Amsterdam of een andere EU-luchthaven met Emirates? Dan heb je volledige EC 261-rechten. Vanuit Dubai naar Amsterdam? Niet.',
      'Emirates Skywards miles zijn geen compensatie. Emirates biedt soms bonusmiles of vouchers aan na klachten. Dit vervangt jouw wettelijk recht op €250-€600 contant volledig niet.',
      'Dubai Airport als hub is niet relevant voor EC 261. Emirates beroept zich op Dubais drukte en ATC als verweer — maar voor EU-vertrekkende vluchten is dit geen geldige buitengewone omstandigheid.',
    ],
  },
  QR: {
    name: 'Qatar Airways',
    fullName: 'Qatar Airways',
    avgPaymentWeeks: 14,
    successRate: 71,
    claimDifficulty: 'hard',
    difficultyNote:
      'Qatar Airways valt bij EU-vertrek onder EC 261. Zij communiceren via hun klantendienst in Doha en zijn traag bij internationale claims.',
    iataPrefix: 'QR',
    color: '#5C0632',
    claimsEmail: 'customercare@qatarairways.com',
    reputationNote:
      'Qatar Airways is een van de meest geprezen airlines ter wereld voor service, maar heeft een gemengde reputatie voor EC 261-naleving. De airline valt uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. Qatar Airways communiceert vanuit Doha en heeft een klachtenafdeling die bij grote operationele verstoringen (zoals de Golf-blokkade in 2017-2021) moeilijk bereikbaar was.',
    claimTips: [
      'EC 261 bij EU-vertrek: volledige rechten. Vloog je van Amsterdam, Parijs of een andere EU-luchthaven via Doha met Qatar Airways? Dan gelden je volledige EC 261-rechten, inclusief €250-€600 compensatie.',
      'Qatar Airways Privilege Club punten zijn geen compensatie. Weiger punten als aangeboden schikking tenzij de waarde hoger is dan jouw wettelijke aanspraak.',
      'Doha als verbindingshub bij extreme hitte. Qatar Airways beroept zich soms op extreme hitte op Hamad International Airport. Dit is zelden een geldige buitengewone omstandigheid — het is een structureel klimatologisch gegeven, geen onverwachte gebeurtenis.',
    ],
  },
  EY: {
    name: 'Etihad Airways',
    fullName: 'Etihad Airways',
    avgPaymentWeeks: 15,
    successRate: 68,
    claimDifficulty: 'hard',
    difficultyNote:
      'Etihad valt bij EU-vertrek onder EC 261. Claims worden routinematig afgewezen en vereisen formele juridische correspondentie en soms escalatie.',
    iataPrefix: 'EY',
    color: '#BD8B13',
    claimsEmail: 'customerservice@etihad.com',
    reputationNote:
      'Etihad Airways, de nationale carrier van de UAE vanuit Abu Dhabi, heeft net als Emirates een slechte reputatie voor EC 261-naleving. De airline heeft de afgelopen jaren flink gesneden in routes en personeel na grote financiële verliezen. Dit heeft de klachtenafhandeling niet verbeterd. Etihad wijst directe EC 261-claims bijna altijd af bij eerste indiening.',
    claimTips: [
      'EC 261 geldt alleen voor EU-vertrekkende vluchten met Etihad. Van Amsterdam naar Abu Dhabi: EC 261 van toepassing. Van Abu Dhabi naar Amsterdam: niet.',
      'Etihad Guest miles als compensatieaanbod: weiger dit. Etihad biedt soms bonusmiles aan als schikking. Dit vervangt je wettelijk recht niet — tenzij je expliciet instemt met een hogere waarde.',
      'Formele juridische toon is essentieel bij Etihad. Informele klachten leiden nergens toe. Een formele claimbrief met verwijzing naar specifieke EC 261-artikelen en aankondiging van juridische stappen is de enige effectieve aanpak.',
    ],
  },
  FZ: {
    name: 'flydubai',
    fullName: 'flydubai',
    avgPaymentWeeks: 14,
    successRate: 69,
    claimDifficulty: 'hard',
    difficultyNote:
      'flydubai (partner van Emirates) valt bij EU-vertrek onder EC 261. Zij verwerken EU-claims traag en vereisen formele juridische stappen.',
    iataPrefix: 'FZ',
    color: '#E51937',
    claimsEmail: 'customer.relations@flydubai.com',
    reputationNote:
      'flydubai is de lowcost-dochter van Emirates en richt zich op routes vanuit Dubai naar bestemmingen in Europa, het Midden-Oosten en Azië. Als UAE-carrier valt flydubai uitsluitend onder EC 261 voor EU-vertrekkende vluchten. De claiminfrastructuur voor Europese passagiers is minimaal — flydubai is primair op de UAE-markt gericht en geeft weinig prioriteit aan buitenlandse EC 261-claims.',
    claimTips: [
      'flydubai codeshare met Emirates: check wie de uitvoerende carrier is. Soms worden flydubai-vluchten verkocht als Emirates-vlucht of andersom. De uitvoerende carrier (op boardingpass) is aansprakelijk.',
      'EC 261 geldt alleen bij EU-vertrek met flydubai. Vluchten van Amsterdam, Brussel of Amsterdam-vertrekkende routes naar Dubai vallen onder EC 261.',
      'flydubai\'s klachtenportal werkt slecht voor EU-claims. Gebruik altijd schriftelijke formele correspondentie als aanvulling op een online ingediende claim.',
    ],
  },
  G9: {
    name: 'Air Arabia',
    fullName: 'Air Arabia',
    avgPaymentWeeks: 14,
    successRate: 68,
    claimDifficulty: 'hard',
    difficultyNote:
      'Air Arabia (LCC vanuit Sharjah/Marokko) valt bij EU-vertrek onder EC 261. Claims vereisen persistentie en zijn juridisch complex.',
    iataPrefix: 'G9',
    color: '#E31837',
    claimsEmail: 'customercare@airarabia.com',
    reputationNote:
      'Air Arabia is een lowcost-carrier vanuit Sharjah (UAE) en Marokko. De airline valt uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. Air Arabia heeft een minimale klachteninfrastructuur voor Europese passagiers en communiceert primair in het Arabisch en Engels. De claimafhandeling voor EU-passagiers is notoir traag.',
    claimTips: [
      'EC 261 bij EU-vertrek. Air Arabia vliegt vanuit luchthavens als Amsterdam en Brussel naar Sharjah en Marokko. Voor deze EU-vertrekkende vluchten gelden volledige EC 261-rechten.',
      'Air Arabia Maroc (3O) is een aparte entiteit. Air Arabia heeft een Marokkaanse dochtermaatschappij. Check altijd welke entiteit de vlucht uitvoerde — de aansprakelijkheid verschilt.',
      'Formele schriftelijke claim is essentieel. Air Arabia reageert niet op informele klachten. Een formele juridische claimbrief met aankondiging van escalatie is de meest effectieve aanpak.',
    ],
  },

  // ── Wizz Air UK ───────────────────────────────────────────────────────────
  W9: {
    name: 'Wizz Air UK',
    fullName: 'Wizz Air UK',
    avgPaymentWeeks: 14,
    successRate: 71,
    claimDifficulty: 'hard',
    difficultyNote:
      'Wizz Air UK (Britse entiteit) valt onder UK261 en heeft dezelfde weigeringstactieken als Wizz Air. Onze aanpak is specifiek op beide entiteiten afgestemd.',
    iataPrefix: 'W9',
    color: '#C6007E',
    claimsEmail: 'legalnotices@wizzair.com',
    reputationNote:
      'Wizz Air UK is de Britse entiteit van Wizz Air, opgericht na de Brexit zodat Wizz Air vluchten binnen het VK en naar EU-landen kon blijven uitvoeren. De airline hanteert exact dezelfde weigeringstactieken als Wizz Air Hungary (W6): standaard afwijzen, WIZZ Credits aanbieden als afleidingsmanoeuvre, en hopen dat passagiers opgeven. De Britse CAA heeft Wizz Air UK meerdere malen als slechte betaler aangewezen.',
    claimTips: [
      'W9 (UK) of W6 (Hongarije): check het vliegtuigregistratienummer. Als het vliegtuig op de grond een G-registratie had (Brits), is het W9. Had het een HA-registratie (Hongaars), dan is het W6.',
      'UK261 = identieke rechten als EC 261. Voor vluchten vertrekkend vanuit EU-luchthavens met Wizz Air UK geldt EC 261. Vanuit Britse luchthavens geldt UK261 — maar de bedragen zijn gelijk.',
      'WIZZ Credits weigeren. Net als W6 biedt Wizz Air UK reistegoeden aan. Accepteer nooit WIZZ Credits als compensatie — je hebt recht op cash.',
    ],
  },

  // ── TUI UK ────────────────────────────────────────────────────────────────
  BY: {
    name: 'TUI Airways',
    fullName: 'TUI Airways (UK)',
    avgPaymentWeeks: 9,
    successRate: 83,
    claimDifficulty: 'medium',
    difficultyNote:
      'TUI Airways UK valt onder UK261 en heeft vergelijkbaar beleid als TUI fly Nederland. Geldige claims worden doorgaans afgehandeld na formele indiening.',
    iataPrefix: 'BY',
    color: '#E87722',
    claimsEmail: 'customercare@tui.co.uk',
    reputationNote:
      'TUI Airways (BY) is de Britse tak van TUI Group en valt na de Brexit onder UK261 — wat qua vergoedingen en rechten identiek is aan EC 261. De airline voert voornamelijk vakantievluchten uit vanuit Britse luchthavens. Voor Nederlandse passagiers die een TUI-pakketreis boeken en met TUI Airways vliegen: als het vertrek vanuit Amsterdam is, geldt EC 261. Vertrekt het vanuit een Britse luchthaven, geldt UK261.',
    claimTips: [
      'UK261 bij Brits vertrek, EC 261 bij EU-vertrek. TUI Airways vliegt ook vanuit Nederlandse en Belgische luchthavens. Vertrek vanuit Amsterdam = EC 261, vertrek vanuit Manchester = UK261. Rechten zijn gelijk.',
      'TUI als reisorganisator vs TUI Airways als carrier. Klachten over het hotel of de vakantie zelf gaan naar TUI Reizen. EC/UK261-claims gaan naar TUI Airways (BY) als uitvoerende carrier.',
      'Vakantievluchten naar verre bestemmingen: €600 compensatie mogelijk. TUI Airways vliegt op de Canarische Eilanden, Caraïben en andere langeafstandsroutes. Routes boven 3.500 km geven recht op €600 per persoon.',
    ],
  },

  // ── Lauda / Ryanair Group ─────────────────────────────────────────────────
  OE: {
    name: 'Lauda Europe',
    fullName: 'Lauda Europe',
    avgPaymentWeeks: 13,
    successRate: 72,
    claimDifficulty: 'hard',
    difficultyNote:
      'Lauda Europe (Ryanair-groep, Oostenrijkse entiteit) hanteert dezelfde weigeringstactieken als Ryanair. Formele juridische stappen zijn vrijwel altijd nodig.',
    iataPrefix: 'OE',
    color: '#FF3C00',
    claimsEmail: 'customerservice@ryanair.com',
    reputationNote:
      'Lauda Europe is de Oostenrijkse dochtermaatschappij van Ryanair, voortgekomen uit de overname van Laudamotion (eerder Air Berlin-vluchten). De airline gebruikt Ryanair-systemen en heeft exact dezelfde claimweigeringstactieken. Passagiers die denken bij Lauda te claimen terwijl ze feitelijk op een Ryanair-boeking vlogen, ondervinden verwarring over welke entiteit aansprakelijk is.',
    claimTips: [
      'Lauda Europe hanteert Ryanair\'s weigeringstactieken. Verwacht standaard afwijzingen. Net als bij Ryanair is de eerste afwijzing een drempeltactiek — formele juridische stappen zijn vrijwel altijd de vervolgstap.',
      'Check of je bij Lauda of Ryanair boekte. Als je boekte via Ryanair.com maar de vlucht werd uitgevoerd door Lauda (OE-vluchtnummer), is Lauda de uitvoerende carrier voor EC 261.',
      'Oostenrijkse Austro Control als escalatie. Bij non-betaling door Lauda Europe is de Oostenrijkse luchtvaartautoriteit Austro Control de bevoegde instantie, niet de Nederlandse ILT.',
    ],
  },

  // ── Servië / voormalig Joegoslavië ────────────────────────────────────────
  JU: {
    name: 'Air Serbia',
    fullName: 'Air Serbia',
    avgPaymentWeeks: 13,
    successRate: 72,
    claimDifficulty: 'hard',
    difficultyNote:
      'Air Serbia valt bij EU-vertrek onder EC 261. Zij communiceren traag en vereisen formele correspondentie voor uitbetaling.',
    iataPrefix: 'JU',
    color: '#003087',
    claimsEmail: 'customerrelations@airserbia.com',
    reputationNote:
      'Air Serbia is de nationale carrier van Servië, een niet-EU land. De airline valt uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. Claims verlopen via Belgrado en de communicatie met niet-Servische passagiers is traag. Air Serbia is deels eigendom van Etihad Airways, wat de claiminfrastructuur enigszins verbeterd heeft maar de eigenlijke betaalbereidheid niet significant verhoogd.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. Air Serbia vliegt vanuit Amsterdam, Brussel en andere EU-steden naar Belgrado. Voor deze vluchten gelden EC 261-rechten.',
      'Etihad-connectie verandert niets aan jouw rechten. Air Serbia is deels in handen van Etihad, maar voor EC 261-claims ben je altijd aangewezen op de uitvoerende carrier — Air Serbia zelf.',
      'Belgrado-Nikola Tesla Airport: vertragingen zijn hier frequent bij slechte weersomstandigheden. Echter: alleen bij officieel afgekonderde luchthavensluiting is dit een geldig buitengewoon verweer.',
    ],
  },

  // ── Marokko (geldt bij EU-vertrek) ────────────────────────────────────────
  AT: {
    name: 'Royal Air Maroc',
    fullName: 'Royal Air Maroc',
    avgPaymentWeeks: 14,
    successRate: 68,
    claimDifficulty: 'hard',
    difficultyNote:
      'Royal Air Maroc valt bij EU-vertrek onder EC 261. Claims verlopen traag via Casablanca en vereisen formele juridische stappen.',
    iataPrefix: 'AT',
    color: '#CC0000',
    claimsEmail: 'customerrelations@royalairmaroc.com',
    reputationNote:
      'Royal Air Maroc is de Marokkaanse nationale carrier en valt uitsluitend onder EC 261 voor vluchten vertrekkend vanuit EU-luchthavens. De airline communiceert vanuit Casablanca en geeft weinig prioriteit aan EU-passagiersrechten. Marokko heeft een associatieakkoord met de EU maar is geen lid — EC 261 geldt dus alleen bij EU-vertrek. Claims worden vrijwel nooit spontaan gehonoreerd.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. Amsterdam of Brussel naar Casablanca: EC 261-rechten gelden. Casablanca naar Amsterdam: Royal Air Maroc is een niet-EU carrier, dus EC 261 geldt NIET.',
      'Formele juridische aanpak is noodzakelijk. Royal Air Maroc reageert niet op informele klachten. Een formele claimbrief met verwijzing naar EC 261 en aankondiging van escalatie is de enige effectieve route.',
      'ILT als bevoegde autoriteit bij EU-vertrek. Als de vlucht vanuit Nederland vertrok, is de Inspectie Leefomgeving en Transport (ILT) bevoegd om een klacht bij in te dienen over Royal Air Maroc.',
    ],
  },

  // ── Egypte (geldt bij EU-vertrek) ────────────────────────────────────────
  MS: {
    name: 'EgyptAir',
    fullName: 'EgyptAir',
    avgPaymentWeeks: 16,
    successRate: 63,
    claimDifficulty: 'hard',
    difficultyNote:
      'EgyptAir valt bij EU-vertrek onder EC 261. Zij hebben een traag en bureaucratisch claimproces. Escalatie via rechter of geschillencommissie is vaak noodzakelijk.',
    iataPrefix: 'MS',
    color: '#007A3D',
    claimsEmail: 'customerrelations@egyptair.com',
    reputationNote:
      'EgyptAir is de Egyptische staatluchtvaartmaatschappij en heeft een van de slechtste EC 261-reputaties. De airline valt uitsluitend onder EC 261 voor EU-vertrekkende vluchten. De claiminfrastructuur voor Europese passagiers is minimaal: correspondentie gaat via Caïro in het Arabisch en Engels, reactietijden zijn extreem lang. Staatsbedrijfsbureaucratie maakt directe claims vrijwel kansloos zonder formele juridische druk.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. EgyptAir vliegt vanuit Amsterdam, Brussel, Frankfurt en andere EU-steden naar Caïro. Alleen voor deze EU-vertrekkende vluchten gelden EC 261-rechten.',
      'Meerdere maanden wachttijd is geen verrassing bij EgyptAir. Plan juridische escalatie in na 8 weken zonder reactie — niet na de gebruikelijke 6 weken.',
      'Nederlandse rechter is een optie. Als EgyptAir niet betaalt op een vlucht vanuit Amsterdam, kun je EgyptAir dagvaarden voor de Nederlandse rechter — Europese vonnissen zijn afdwingbaar in Egypte via internationale verdragen.',
    ],
  },

  // ── India (geldt bij EU-vertrek) ─────────────────────────────────────────
  AI: {
    name: 'Air India',
    fullName: 'Air India',
    avgPaymentWeeks: 16,
    successRate: 64,
    claimDifficulty: 'hard',
    difficultyNote:
      'Air India valt bij EU-vertrek onder EC 261. Hun Europese claimafdeling is onderbemand en traag. Formele juridische escalatie is vrijwel altijd nodig.',
    iataPrefix: 'AI',
    color: '#C41E3A',
    claimsEmail: 'customerrelations@airindia.in',
    reputationNote:
      'Air India is recent geprivatiseerd (overgenomen door Tata Group in 2022) en ondergaat een grote transformatie. De privaat eigenaar investeert fors in vloot en service, maar de claiminfrastructuur voor Europese passagiers loopt achter. Air India valt uitsluitend onder EC 261 voor EU-vertrekkende vluchten (Amsterdam, Londen, Frankfurt naar India). De historische staatsbureaucratie werkt door in het claimproces.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. Air India vliegt vanuit Amsterdam naar Delhi en Mumbai. Voor deze EU-vertrekkende vluchten gelden EC 261-rechten. Van Delhi naar Amsterdam: niet.',
      'Tata-overName verbetert service maar niet direct het claimproces. Air India is gerenoveerd qua vloot en branding, maar de backoffice voor EC 261-claims loopt achter bij de rest van de transformatie.',
      'Lange vluchten naar India: hoge compensatie. Routes van Amsterdam naar Delhi zijn ruim boven 3.500 km. Bij meer dan 3 uur vertraging heb je recht op €600 per persoon.',
    ],
  },

  // ── Ethiopië (geldt bij EU-vertrek) ──────────────────────────────────────
  ET: {
    name: 'Ethiopian Airlines',
    fullName: 'Ethiopian Airlines',
    avgPaymentWeeks: 16,
    successRate: 62,
    claimDifficulty: 'hard',
    difficultyNote:
      'Ethiopian Airlines valt bij EU-vertrek onder EC 261. Claims verlopen via Addis Abeba en zijn complex. Wij kennen de juridische route voor Afrikaanse carriers.',
    iataPrefix: 'ET',
    color: '#009A44',
    claimsEmail: 'customercare@ethiopianairlines.com',
    reputationNote:
      'Ethiopian Airlines is de grootste airline van Afrika en staat bekend om ambitieuze expansie en relatief goede service — maar de EC 261-naleving laat te wensen over. De airline valt uitsluitend onder EC 261 voor EU-vertrekkende vluchten. Correspondentie verloopt via Addis Abeba en heeft extreem lange reactietijden. Ethiopian Airlines beroept zich vaak op technische problemen, maar het is lastig dit te verifiëren zonder interne vliegtuigdocumentatie.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. Ethiopian vliegt vanuit Amsterdam, Brussel, Frankfurt en Parijs naar Addis Abeba en verder naar Oost-Afrika en Azië. Voor EU-vertrekkende vluchten gelden EC 261-rechten.',
      'Doorverbinding via Addis Abeba: let op wie de carrier is. Bij een doorreis via Addis Abeba naar Nairobi of Johannesburg: als Ethiopian de gehele boeking uitvoerde, is het volledige traject relevant voor compensatie.',
      'Lange wachttijden: juridische escalatie na 8 weken. Ethiopian reageert zelden binnen 6 weken. Plan formele juridische stappen in als onderdeel van het standaardproces, niet als laatste redmiddel.',
    ],
  },

  // ── Kenya (geldt bij EU-vertrek) ─────────────────────────────────────────
  KQ: {
    name: 'Kenya Airways',
    fullName: 'Kenya Airways',
    avgPaymentWeeks: 16,
    successRate: 61,
    claimDifficulty: 'hard',
    difficultyNote:
      'Kenya Airways valt bij EU-vertrek onder EC 261. Claimafhandeling verloopt traag via Nairobi en vereist juridische escalatie.',
    iataPrefix: 'KQ',
    color: '#CC0000',
    claimsEmail: 'customercare@kenya-airways.com',
    reputationNote:
      'Kenya Airways is de nationale carrier van Kenia en lid van SkyTeam (Air France-KLM). De airline valt uitsluitend onder EC 261 voor EU-vertrekkende vluchten. Kenya Airways heeft een slechte punctualiteitsreputatie en een vrijwel niet-bestaande EC 261-claiminfrastructuur voor Europese passagiers. Claims verlopen via Nairobi met reactietijden van maanden. De SkyTeam-connectie helpt niet bij claimafhandeling — dat blijft de verantwoordelijkheid van Kenya Airways zelf.',
    claimTips: [
      'EC 261 alleen bij EU-vertrek. Kenya Airways vliegt vanuit Amsterdam naar Nairobi. Voor vluchten die vanuit Amsterdam vertrekken gelden volledige EC 261-rechten.',
      'Amsterdam-Nairobi is boven 3.500 km: €600 compensatie. Bij meer dan 3 uur vertraging op aankomst in Nairobi heb je recht op €600 per persoon — een van de hoogste compensatiebedragen.',
      'SkyTeam-lidmaatschap helpt niet bij claims. Kenya Airways is lid van SkyTeam maar alle claims gaan direct naar Kenya Airways, niet via Air France of KLM.',
    ],
  },
}

export const FALLBACK_AIRLINE: AirlineConfig = {
  name: 'de airline',
  fullName: 'de airline',
  avgPaymentWeeks: 10,
  successRate: 80,
  claimDifficulty: 'medium',
  difficultyNote:
    'Veel airlines proberen compensatie te omzeilen. Met professionele ondersteuning is de kans op succes aanzienlijk hoger.',
  iataPrefix: '',
  color: '#0D1B2A',
}

export function getAirlineConfig(iataPrefix: string): AirlineConfig {
  const prefix = iataPrefix.toUpperCase()
  return AIRLINES[prefix] ?? FALLBACK_AIRLINE
}

export function getAirlinePrefixFromFlightNumber(flightNumber: string): string {
  const match = flightNumber.toUpperCase().match(/^([A-Z]{2})\d+/)
  if (match) return match[1]
  const numMatch = flightNumber.toUpperCase().match(/^([A-Z]{1})\d+/)
  if (numMatch) return numMatch[1]
  return ''
}

// ── EU/EEA carrier detectie ──────────────────────────────────────────────────
// EC 261/2004 art. 3(1)(b): bij vertrek buiten EU naar EU geldt de verordening
// ALLEEN als de uitvoerende maatschappij EU/EEA-geregistreerd is.
// UK261 is identiek van toepassing op Britse maatschappijen.

const EU_EEA_GB_AIRLINE_PREFIXES = new Set([
  // Nederland
  'KL', 'HV', 'CD', 'TB', 'WA',
  // VK (GB — UK261 = identiek)
  'BA', 'U2', 'VS', 'BY', 'MT', 'TOM', 'ZB', 'LS',
  // Duitsland
  'LH', 'EW', '4U', 'DE', 'X3',
  // Frankrijk
  'AF', 'TO', 'SS', 'SE',
  // Spanje
  'IB', 'VY', 'UX', 'V7', 'YW',
  // Italië
  'AZ', 'XZ', 'FC',
  // Ierland
  'FR', 'EI',
  // Portugal
  'TP', 'NI',
  // België
  'SN',
  // Oostenrijk
  'OS',
  // Griekenland
  'A3', 'OA',
  // Hongarije
  'W6',
  // Polen
  'LO',
  // Tsjechië
  'OK',
  // Roemenië
  'RO',
  // Kroatië
  'OU',
  // Zweden
  'SK',
  // Finland
  'AY',
  // Denemarken (SAS)
  // Noorwegen (EEA)
  'DY', 'D8', 'IBK',
  // IJsland (EEA)
  'FI',
  // Bulgarije
  'FB',
  // Litouwen
  'TE',
  // Letland
  'BT',
  // Estland
  'OV',
  // Malta
  'KM',
  // Cyprus
  'CY',
  // Slowakije
  'OM',
  // Slovenië
  'JP',
])

const NON_EU_AIRLINE_PREFIXES = new Set([
  // Golf
  'EK', 'FZ', 'QR', 'EY', 'WY', 'GF', 'SV',
  // Turkije (NIET EU/EEA)
  'TK', 'PC', 'XQ', '8Q',
  // Azië
  'SQ', 'CX', 'MH', 'TG', 'GA', 'PR', 'MI',
  // India
  'AI', '6E', 'IX', 'SG',
  // Japan/Korea
  'NH', 'JL', 'OZ', 'KE',
  // China
  'CA', 'MU', 'CZ', 'HU',
  // VS
  'AA', 'DL', 'UA', 'WN', 'B6', 'AS', 'F9', 'G4',
  // Canada
  'AC', 'WS', 'PD',
  // Afrika / Midden-Oosten
  'ET', 'KQ', 'MS', 'AT', 'RB', 'KL' /* catch */ ,
  // Oceanië
  'QF', 'NZ', 'JQ', 'VA',
  // Zwitserland (niet in EU/EEA voor EC 261)
  'LX',
  // Oekraïne / wit-Rusland / Rusland
  'PS', 'B2', 'SU', 'DP',
])

/**
 * Geeft terug of de maatschappij EU/EEA-geregistreerd is.
 * Returns true  → EU/EEA (altijd gebonden aan EC 261)
 * Returns false → niet-EU (buiten EU-vertrek: niet gebonden)
 * Returns undefined → onbekend (geef voordeel van de twijfel in berekening)
 */
export function isEuCarrier(iataPrefix: string): boolean | undefined {
  const p = iataPrefix.toUpperCase()
  if (EU_EEA_GB_AIRLINE_PREFIXES.has(p)) return true
  if (NON_EU_AIRLINE_PREFIXES.has(p)) return false
  return undefined
}
