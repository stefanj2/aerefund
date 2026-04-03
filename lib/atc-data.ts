import { AIRPORTS } from '@/lib/airports'

// ---------------------------------------------------------------------------
// ATC strike / disruption detection
// Uses a curated database of known ATC events (strikes, system failures, etc.)
// Major ATC strikes are well-documented public events — this is a practical
// approach that avoids needing institutional Eurocontrol access.
// ---------------------------------------------------------------------------

export type AtcData = {
  hasStrike: boolean
  hasDisruption: boolean
  reason: string | null
  affectedCountry: string | null
  summary: string
  source: string
  confidence: 'high' | 'medium' | 'low'
}

type AtcEvent = {
  country: string        // two-letter code
  startDate: string      // YYYY-MM-DD
  endDate: string        // YYYY-MM-DD
  reason: string
  airports?: string[]    // affected airports (optional, if empty = whole country)
}

const KNOWN_ATC_EVENTS: AtcEvent[] = [
  // 2023
  { country: 'FR', startDate: '2023-03-07', endDate: '2023-03-08', reason: 'ATC-staking Frankrijk (pensioenprotesten)' },
  { country: 'FR', startDate: '2023-06-06', endDate: '2023-06-06', reason: 'ATC-staking Frankrijk (SNCTA)' },
  { country: 'FR', startDate: '2023-09-16', endDate: '2023-09-16', reason: 'ATC-staking Frankrijk' },
  { country: 'GB', startDate: '2023-08-28', endDate: '2023-08-28', reason: 'NATS systeemstoring UK', airports: ['EGLL', 'EGKK', 'EGSS', 'EGGW'] },
  { country: 'DE', startDate: '2023-03-27', endDate: '2023-03-27', reason: 'Verdi-staking luchtvaart Duitsland' },
  // 2024
  { country: 'BE', startDate: '2024-01-30', endDate: '2024-01-31', reason: 'ATC-staking België (skeyes)' },
  { country: 'IT', startDate: '2024-02-21', endDate: '2024-02-21', reason: 'ATC-staking Italië (ENAV)' },
  { country: 'GR', startDate: '2024-02-28', endDate: '2024-02-28', reason: 'Algemene staking Griekenland' },
  { country: 'FR', startDate: '2024-03-20', endDate: '2024-03-21', reason: 'ATC-staking Frankrijk (SNCTA)' },
  { country: 'FR', startDate: '2024-06-11', endDate: '2024-06-11', reason: 'ATC-staking Frankrijk' },
  // 2025
  { country: 'FR', startDate: '2025-01-09', endDate: '2025-01-09', reason: 'ATC-staking Frankrijk (SNCTA)' },
  { country: 'IT', startDate: '2025-01-10', endDate: '2025-01-10', reason: 'ATC-staking Italië' },
  { country: 'BE', startDate: '2025-02-13', endDate: '2025-02-13', reason: 'Nationale staking België' },
  // 2026
  { country: 'FR', startDate: '2026-02-06', endDate: '2026-02-06', reason: 'ATC-staking Frankrijk' },
]

/**
 * Check ATC status for a flight route on a given date.
 * Returns null on failure (non-blocking).
 */
export async function getAtcStatus(
  originIata: string,
  destinationIata: string,
  date: string
): Promise<AtcData | null> {
  try {
    const originAirport = AIRPORTS[originIata]
    const destAirport = AIRPORTS[destinationIata]

    const originCountry = originAirport?.country ?? null
    const destCountry = destAirport?.country ?? null

    if (!originCountry && !destCountry) {
      return {
        hasStrike: false,
        hasDisruption: false,
        reason: null,
        affectedCountry: null,
        summary: 'Geen ATC-verstoringen gedetecteerd',
        source: 'aerefund-atc-db',
        confidence: 'low',
      }
    }

    // Find matching events where the date falls within the event range
    // and the country matches origin or destination
    const matchingEvents = KNOWN_ATC_EVENTS.filter((event) => {
      if (date < event.startDate || date > event.endDate) return false
      return event.country === originCountry || event.country === destCountry
    })

    if (matchingEvents.length > 0) {
      const event = matchingEvents[0]
      const countryName = getCountryName(event.country)

      return {
        hasStrike: true,
        hasDisruption: true,
        reason: event.reason,
        affectedCountry: event.country,
        summary: `ATC-verstoring gedetecteerd: ${event.reason}`,
        source: 'aerefund-atc-db',
        confidence: 'high',
      }
    }

    // No match found — absence of evidence is not evidence of absence
    return {
      hasStrike: false,
      hasDisruption: false,
      reason: null,
      affectedCountry: null,
      summary: 'Geen ATC-verstoringen gedetecteerd',
      source: 'aerefund-atc-db',
      confidence: 'low',
    }
  } catch {
    return null
  }
}

/**
 * Determine if ATC data indicates a force majeure situation.
 * ATC strikes are generally recognized as extraordinary circumstances
 * under EC 261/2004, meaning the airline is NOT liable for compensation.
 */
export function isAtcForceMajeure(atcData: AtcData | null | undefined): boolean {
  return atcData?.hasStrike === true && atcData.confidence === 'high'
}

// Helper: country code → Dutch name (for summary text)
function getCountryName(code: string): string {
  const names: Record<string, string> = {
    FR: 'Frankrijk',
    DE: 'Duitsland',
    IT: 'Italië',
    ES: 'Spanje',
    GR: 'Griekenland',
    BE: 'België',
    GB: 'Verenigd Koninkrijk',
    PT: 'Portugal',
    NL: 'Nederland',
    AT: 'Oostenrijk',
  }
  return names[code] ?? code
}
