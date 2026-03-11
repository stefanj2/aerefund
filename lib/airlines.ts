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
