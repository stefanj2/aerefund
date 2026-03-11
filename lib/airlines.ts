export type AirlineConfig = {
  name: string
  fullName: string
  avgPaymentWeeks: number
  successRate: number
  claimDifficulty: 'easy' | 'medium' | 'hard'
  difficultyNote: string
  iataPrefix: string
  color: string
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
  },

  // ── Servia / voormalig Joegoslavië ────────────────────────────────────────
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
