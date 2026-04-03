// Multi-jurisdiction statute of limitations calculator (EC 261/2004)
import { AIRPORTS } from '@/lib/airports'

export type JurisdictionInfo = {
  country: string        // two-letter code
  countryName: string    // Dutch name
  limitYears: number
  expiresAt: Date
  monthsRemaining: number
  isUrgent: boolean      // < 6 months remaining
  isExpired: boolean
}

// ── Verjaringstermijnen per land ────────────────────────────────────────────
const JURISDICTION_RULES: Record<string, { years: number; name: string }> = {
  NL: { years: 3, name: 'Nederland' },
  DE: { years: 3, name: 'Duitsland' },
  FR: { years: 5, name: 'Frankrijk' },
  GB: { years: 6, name: 'Verenigd Koninkrijk' },
  BE: { years: 1, name: 'België' },
  ES: { years: 5, name: 'Spanje' },
  IT: { years: 2, name: 'Italië' },
  PT: { years: 3, name: 'Portugal' },
  AT: { years: 3, name: 'Oostenrijk' },
  IE: { years: 6, name: 'Ierland' },
  PL: { years: 1, name: 'Polen' },
  SE: { years: 3, name: 'Zweden' },
  NO: { years: 3, name: 'Noorwegen' },
  DK: { years: 3, name: 'Denemarken' },
  FI: { years: 3, name: 'Finland' },
  GR: { years: 5, name: 'Griekenland' },
  CH: { years: 2, name: 'Zwitserland' },
}

const DEFAULT_LIMIT_YEARS = 3

/**
 * Look up the two-letter country code for an IATA airport code.
 * Returns null if the airport is not in our database.
 */
export function getCountryFromIata(iata: string): string | null {
  if (!iata) return null
  const airport = AIRPORTS[iata.toUpperCase()]
  return airport?.country ?? null
}

/**
 * Calculate statute of limitations info based on departure airport jurisdiction.
 *
 * @param originIata  IATA code of the departure airport
 * @param flightDate  Flight date as ISO string (YYYY-MM-DD)
 */
export function getStatuteOfLimitations(originIata: string, flightDate: string): JurisdictionInfo {
  const country = getCountryFromIata(originIata)
  const rule = country ? JURISDICTION_RULES[country] : undefined

  const limitYears  = rule?.years ?? DEFAULT_LIMIT_YEARS
  const countryName = rule?.name  ?? 'Onbekend'
  const countryCode = country     ?? 'XX'

  // Calculate expiry: flightDate + limitYears
  const flight = new Date(flightDate)
  const expiresAt = new Date(flight)
  expiresAt.setFullYear(expiresAt.getFullYear() + limitYears)

  // Calculate months remaining from today
  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()
  const monthsRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44))

  return {
    country: countryCode,
    countryName,
    limitYears,
    expiresAt,
    monthsRemaining: Math.max(monthsRemaining, 0),
    isUrgent: monthsRemaining > 0 && monthsRemaining < 6,
    isExpired: diffMs <= 0,
  }
}
