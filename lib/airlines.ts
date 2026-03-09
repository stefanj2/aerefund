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
