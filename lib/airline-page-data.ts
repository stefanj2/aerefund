import { AIRLINES, AirlineConfig } from './airlines'

// ── Types ─────────────────────────────────────────────────────────────────────

export type FlightRecord = {
  date: string
  flightNumber: string
  route: string
  delay: string
  compensation: number
}

export type FAQ = {
  q: string
  a: string
}

// ── Slug helpers ──────────────────────────────────────────────────────────────

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// Build bidirectional slug ↔ iata maps at module-init time
const _slugToIata: Record<string, string> = {}
const _iataToSlug: Record<string, string> = {}

for (const [iata, config] of Object.entries(AIRLINES)) {
  let base = nameToSlug(config.name)
  let slug = base
  let attempt = 0
  while (_slugToIata[slug] && _slugToIata[slug] !== iata) {
    attempt++
    slug = `${base}-${attempt}`
  }
  _slugToIata[slug] = iata
  _iataToSlug[iata] = slug
}

export const SLUG_TO_IATA: Record<string, string> = _slugToIata
export const IATA_TO_SLUG: Record<string, string> = _iataToSlug

export function getIataFromSlug(slug: string): string | undefined {
  return SLUG_TO_IATA[slug]
}

export function getSlugFromIata(iata: string): string {
  return IATA_TO_SLUG[iata.toUpperCase()] ?? nameToSlug(iata)
}

// ── Hardcoded sample flight data (top 12 airlines) ────────────────────────────

const SAMPLE_FLIGHTS: Record<string, FlightRecord[]> = {
  KL: [
    { date: '12 jan 2026', flightNumber: 'KL1231', route: 'AMS → BCN', delay: '4u 10min', compensation: 400 },
    { date: '28 dec 2025', flightNumber: 'KL1073', route: 'AMS → LHR', delay: '3u 45min', compensation: 250 },
    { date: '15 dec 2025', flightNumber: 'KL1575', route: 'AMS → FCO', delay: '5u 20min', compensation: 400 },
    { date: '3 nov 2025',  flightNumber: 'KL1693', route: 'AMS → MAD', delay: '3u 55min', compensation: 400 },
    { date: '19 okt 2025', flightNumber: 'KL1487', route: 'AMS → CDG', delay: '4u 30min', compensation: 250 },
  ],
  FR: [
    { date: '8 jan 2026',  flightNumber: 'FR5082', route: 'EIN → BCN', delay: '3u 30min', compensation: 400 },
    { date: '22 dec 2025', flightNumber: 'FR3218', route: 'AMS → STN', delay: '6u 15min', compensation: 250 },
    { date: '11 nov 2025', flightNumber: 'FR6743', route: 'RTM → MAD', delay: '4u 50min', compensation: 400 },
    { date: '29 okt 2025', flightNumber: 'FR7156', route: 'EIN → AGP', delay: '3u 10min', compensation: 400 },
    { date: '14 sep 2025', flightNumber: 'FR2984', route: 'AMS → BGY', delay: '5u 40min', compensation: 400 },
  ],
  HV: [
    { date: '14 jan 2026', flightNumber: 'HV5624', route: 'AMS → AGP', delay: '4u 25min', compensation: 400 },
    { date: '30 dec 2025', flightNumber: 'HV6812', route: 'RTM → BCN', delay: '3u 15min', compensation: 400 },
    { date: '18 nov 2025', flightNumber: 'HV5472', route: 'AMS → PMI', delay: '5u 55min', compensation: 400 },
    { date: '5 okt 2025',  flightNumber: 'HV5318', route: 'AMS → ALC', delay: '6u 10min', compensation: 400 },
    { date: '22 sep 2025', flightNumber: 'HV6904', route: 'AMS → SSH', delay: '4u 45min', compensation: 400 },
  ],
  U2: [
    { date: '9 jan 2026',  flightNumber: 'U24841', route: 'AMS → LGW', delay: '3u 50min', compensation: 250 },
    { date: '26 dec 2025', flightNumber: 'U24215', route: 'AMS → BCN', delay: '4u 35min', compensation: 400 },
    { date: '13 nov 2025', flightNumber: 'U43672', route: 'AMS → CDG', delay: '3u 20min', compensation: 250 },
    { date: '1 okt 2025',  flightNumber: 'U46128', route: 'AMS → NCE', delay: '5u 05min', compensation: 400 },
    { date: '17 sep 2025', flightNumber: 'U44893', route: 'AMS → LYS', delay: '3u 40min', compensation: 400 },
  ],
  TB: [
    { date: '17 jan 2026', flightNumber: 'TB1822', route: 'AMS → AYT', delay: '4u 15min', compensation: 400 },
    { date: '3 jan 2026',  flightNumber: 'TB1904', route: 'AMS → PMI', delay: '5u 30min', compensation: 400 },
    { date: '21 dec 2025', flightNumber: 'TB2163', route: 'AMS → HRG', delay: '3u 55min', compensation: 400 },
    { date: '8 nov 2025',  flightNumber: 'TB2547', route: 'AMS → TFS', delay: '6u 20min', compensation: 400 },
    { date: '24 sep 2025', flightNumber: 'TB2814', route: 'AMS → DXB', delay: '4u 40min', compensation: 600 },
  ],
  CD: [
    { date: '11 jan 2026', flightNumber: 'CD8431', route: 'AMS → AYT', delay: '5u 10min', compensation: 400 },
    { date: '27 dec 2025', flightNumber: 'CD8752', route: 'AMS → HRG', delay: '4u 25min', compensation: 400 },
    { date: '15 nov 2025', flightNumber: 'CD9012', route: 'AMS → AGP', delay: '3u 35min', compensation: 400 },
    { date: '3 okt 2025',  flightNumber: 'CD8623', route: 'AMS → LCA', delay: '5u 50min', compensation: 400 },
    { date: '19 sep 2025', flightNumber: 'CD9178', route: 'AMS → TFS', delay: '4u 05min', compensation: 400 },
  ],
  W6: [
    { date: '16 jan 2026', flightNumber: 'W63102', route: 'AMS → BUD', delay: '3u 25min', compensation: 250 },
    { date: '2 jan 2026',  flightNumber: 'W64567', route: 'AMS → WAW', delay: '4u 50min', compensation: 250 },
    { date: '20 dec 2025', flightNumber: 'W65891', route: 'AMS → KTW', delay: '3u 40min', compensation: 250 },
    { date: '7 nov 2025',  flightNumber: 'W62743', route: 'AMS → CLJ', delay: '6u 15min', compensation: 250 },
    { date: '23 sep 2025', flightNumber: 'W68134', route: 'AMS → WMI', delay: '5u 05min', compensation: 250 },
  ],
  LH: [
    { date: '13 jan 2026', flightNumber: 'LH994',  route: 'AMS → FRA', delay: '4u 10min', compensation: 250 },
    { date: '29 dec 2025', flightNumber: 'LH2474', route: 'AMS → MUC', delay: '3u 30min', compensation: 250 },
    { date: '16 nov 2025', flightNumber: 'LH2286', route: 'AMS → ZRH', delay: '5u 45min', compensation: 250 },
    { date: '4 okt 2025',  flightNumber: 'LH2190', route: 'AMS → VIE', delay: '3u 55min', compensation: 250 },
    { date: '20 sep 2025', flightNumber: 'LH2182', route: 'AMS → HAM', delay: '4u 20min', compensation: 250 },
  ],
  AF: [
    { date: '15 jan 2026', flightNumber: 'AF1240', route: 'AMS → CDG', delay: '4u 35min', compensation: 250 },
    { date: '31 dec 2025', flightNumber: 'AF1544', route: 'AMS → NCE', delay: '5u 10min', compensation: 400 },
    { date: '18 nov 2025', flightNumber: 'AF1316', route: 'CDG → AMS', delay: '3u 45min', compensation: 250 },
    { date: '6 okt 2025',  flightNumber: 'AF1148', route: 'AMS → LYS', delay: '4u 00min', compensation: 400 },
    { date: '22 aug 2025', flightNumber: 'AF1636', route: 'AMS → MRS', delay: '3u 25min', compensation: 400 },
  ],
  BA: [
    { date: '10 jan 2026', flightNumber: 'BA432',  route: 'AMS → LHR', delay: '3u 55min', compensation: 250 },
    { date: '25 dec 2025', flightNumber: 'BA4556', route: 'AMS → LHR', delay: '5u 20min', compensation: 250 },
    { date: '12 nov 2025', flightNumber: 'BA4534', route: 'LHR → AMS', delay: '4u 10min', compensation: 250 },
    { date: '30 sep 2025', flightNumber: 'BA4522', route: 'AMS → LGW', delay: '3u 30min', compensation: 250 },
    { date: '16 aug 2025', flightNumber: 'BA4540', route: 'AMS → LCY', delay: '4u 45min', compensation: 250 },
  ],
  DY: [
    { date: '7 jan 2026',  flightNumber: 'DY5212', route: 'AMS → OSL', delay: '4u 20min', compensation: 250 },
    { date: '23 dec 2025', flightNumber: 'DY4034', route: 'AMS → CPH', delay: '3u 35min', compensation: 250 },
    { date: '10 nov 2025', flightNumber: 'DY5846', route: 'OSL → AMS', delay: '5u 15min', compensation: 250 },
    { date: '28 sep 2025', flightNumber: 'DY4198', route: 'AMS → ARN', delay: '4u 50min', compensation: 250 },
    { date: '14 aug 2025', flightNumber: 'DY7312', route: 'AMS → BCN', delay: '3u 10min', compensation: 400 },
  ],
  VY: [
    { date: '5 jan 2026',  flightNumber: 'VY8716', route: 'AMS → BCN', delay: '4u 30min', compensation: 400 },
    { date: '21 dec 2025', flightNumber: 'VY8732', route: 'AMS → MAD', delay: '5u 15min', compensation: 400 },
    { date: '9 nov 2025',  flightNumber: 'VY8724', route: 'BCN → AMS', delay: '3u 50min', compensation: 400 },
    { date: '27 sep 2025', flightNumber: 'VY8718', route: 'AMS → VLC', delay: '6u 05min', compensation: 400 },
    { date: '13 aug 2025', flightNumber: 'VY8740', route: 'AMS → SVQ', delay: '4u 25min', compensation: 400 },
  ],
}

// ── Fallback flight generator ─────────────────────────────────────────────────

const FALLBACK_ROUTES: [string, string, number][] = [
  ['AMS', 'BCN', 400], ['AMS', 'MAD', 400], ['AMS', 'FCO', 400],
  ['AMS', 'LHR', 250], ['AMS', 'CDG', 250], ['AMS', 'FRA', 250],
  ['AMS', 'PMI', 400], ['AMS', 'AGP', 400], ['AMS', 'AYT', 400],
  ['AMS', 'ALC', 400], ['AMS', 'TFS', 400], ['AMS', 'ATH', 400],
]

const FALLBACK_MONTHS = ['aug 2025', 'sep 2025', 'okt 2025', 'nov 2025', 'dec 2025', 'jan 2026']
const FALLBACK_DAYS   = [3, 7, 11, 16, 21, 25]
const FALLBACK_DELAYS = ['3u 15min', '3u 45min', '4u 10min', '4u 50min', '5u 20min', '6u 05min']

function simpleHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) & 0xffff
  return h
}

function getFallbackFlights(iata: string): FlightRecord[] {
  const h = simpleHash(iata)
  return Array.from({ length: 5 }, (_, i) => {
    const monthIdx  = (h + i * 3)   % FALLBACK_MONTHS.length
    const dayIdx    = (h + i * 7)   % FALLBACK_DAYS.length
    const routeIdx  = (h + i * 5)   % FALLBACK_ROUTES.length
    const delayIdx  = (h + i * 11)  % FALLBACK_DELAYS.length
    const num       = 1000 + ((h + i * 137) % 8999)
    const [orig, dest, comp] = FALLBACK_ROUTES[routeIdx]
    return {
      date:         `${FALLBACK_DAYS[dayIdx]} ${FALLBACK_MONTHS[monthIdx]}`,
      flightNumber: `${iata}${num}`,
      route:        `${orig} → ${dest}`,
      delay:        FALLBACK_DELAYS[delayIdx],
      compensation: comp,
    }
  })
}

export function getFlightRecords(iata: string): FlightRecord[] {
  return SAMPLE_FLIGHTS[iata.toUpperCase()] ?? getFallbackFlights(iata.toUpperCase())
}

// ── FAQ builder ───────────────────────────────────────────────────────────────

function buildFaqs(config: AirlineConfig): FAQ[] {
  const { name, avgPaymentWeeks, successRate } = config
  return [
    {
      q: `Heeft mijn vertraagde ${name} vlucht recht op compensatie?`,
      a: `Ja. Als jouw ${name} vlucht 3 uur of meer vertraagd aankwam, heb je onder EU-richtlijn EC 261/2004 recht op €250, €400 of €600 per persoon — afhankelijk van de vliegafstand. Dit geldt ook bij annulering of instapweigering. ${name} moet deze compensatie betalen, tenzij sprake is van buitengewone omstandigheden buiten hun controle.`,
    },
    {
      q: `Hoe lang duurt het voordat ${name} uitbetaalt?`,
      a: `${name} betaalt gemiddeld binnen ${avgPaymentWeeks} weken na formele indiening. Aerefund haalt voor ${name}-claims een slagingskans van ${successRate}%. Na indiening communiceren wij rechtstreeks met ${name} en houden je op de hoogte.`,
    },
    {
      q: `Wat kost het om een ${name}-claim in te dienen?`,
      a: `Je betaalt een vaste administratievergoeding van €42 ná indiening van je claim. Bij succes rekenen we aanvullend 10% commissie. Geen kosten vooraf, geen verborgen kosten. Veel goedkoper dan traditionele claimbureaus die 25–35% vragen.`,
    },
    {
      q: `Kan ik nog claimen als mijn vlucht meer dan een jaar geleden was?`,
      a: `Ja. In Nederland geldt een verjaringstermijn van 3 jaar voor EC 261-claims. Vluchten tot 3 jaar terug komen in aanmerking. Weet je niet zeker of jouw vlucht geldig is? Doe de gratis check en wij controleren het voor je.`,
    },
  ]
}

export function getAirlineFaqs(iata: string): FAQ[] {
  const config = AIRLINES[iata.toUpperCase()]
  if (!config) return []
  return buildFaqs(config)
}
