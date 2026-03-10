// EC 261/2004 compensation calculation — volledig conform de verordening
import { AIRPORTS } from '@/lib/airports'
import type { CancellationNotice, CauseType } from '@/lib/types'

export type CompensationResult = {
  eligible: boolean
  amountPerPerson: number
  reason: string
  distanceKm: number | null
}

// ── EU / EEA scope ────────────────────────────────────────────────────────────
// EC 261/2004 is van toepassing op vluchten vanuit EU/EEA, én op vluchten
// naar EU/EEA indien uitgevoerd door een EU/EEA-maatschappij.
// GB is opgenomen: UK261 heeft identieke regels (post-Brexit).
const EU_COVERED_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
  'HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK',
  'SI','ES','SE',
  'IS','LI','NO', // EEA
  'GB',           // UK261 — identieke regels als EC 261
])

export function isEuAirport(iata: string): boolean {
  if (!iata) return false
  const airport = AIRPORTS[iata.toUpperCase()]
  return airport ? EU_COVERED_COUNTRIES.has(airport.country) : false
}

export function isIntraEuRoute(originIata: string, destIata: string): boolean {
  return isEuAirport(originIata) && isEuAirport(destIata)
}

// ── Opties voor de berekening ─────────────────────────────────────────────────
export type CompensationOpts = {
  origin?: string                        // IATA-code vertrekpunt
  destination?: string                   // IATA-code eindbestemming
  carrierIsEu?: boolean                  // Is de maatschappij EU/EEA?
  cancellationNotice?: CancellationNotice
  causeType?: CauseType
}

// ── Hoofdfunctie ──────────────────────────────────────────────────────────────
export function calculateCompensation(
  distanceKm: number | null,
  delayMinutes: number | null,
  flightType: 'vertraagd' | 'geannuleerd' | 'geweigerd',
  flightFound: boolean = false,
  opts: CompensationOpts = {}
): CompensationResult {
  const { origin, destination, carrierIsEu, cancellationNotice, causeType } = opts

  // 1. EU-scopecheck (art. 3) ─────────────────────────────────────────────────
  if (origin && destination) {
    const originEu = isEuAirport(origin)
    const destEu   = isEuAirport(destination)

    if (!originEu && !destEu) {
      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: 'Vlucht valt niet onder EC 261/2004 — geen EU/EEA-vertrek en geen EU/EEA-bestemming',
      }
    }

    // Vlucht buiten EU naar EU: alleen EU/EEA-maatschappijen zijn gebonden
    if (!originEu && destEu && carrierIsEu === false) {
      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: 'Vlucht valt niet onder EC 261/2004 — vertrek buiten EU/EEA door niet-EU maatschappij',
      }
    }
  }

  // 2. Buitengewone omstandigheid (art. 5(3)) ────────────────────────────────
  // Weersomstandigheden en ATC-staking zijn force majeure → geen vergoeding.
  // Technische defecten en airline-stakingen zijn GEEN buitengewone omstandigheid
  // (CJEU Wallentin-Hermann C-549/07; CJEU Krüsemann C-195/17).
  if (causeType === 'force') {
    return {
      eligible: false,
      amountPerPerson: 0,
      distanceKm,
      reason: 'Buitengewone omstandigheid (weersomstandigheden of ATC-staking) — airline is vrijgesteld onder EC 261/2004 art. 5(3)',
    }
  }

  // 3. Annulering: aankondigingstermijn (art. 5(1)(c)) ──────────────────────
  if (flightType === 'geannuleerd') {
    if (cancellationNotice === 'gt14days') {
      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: 'Annulering ≥ 14 dagen van tevoren gemeld — geen compensatierecht (EC 261/2004 art. 5(1)(c))',
      }
    }
    const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
    return buildEligible(distanceKm, flightType, intraEu)
  }

  // 4. Instapweigering (art. 4) — altijd in aanmerking ──────────────────────
  if (flightType === 'geweigerd') {
    const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
    return buildEligible(distanceKm, flightType, intraEu)
  }

  // 5. Vertraging: drempel > 3 uur aankomstvertraging (art. 6 + Sturgeon) ───
  // Alleen niet-in-aanmerking als we betrouwbare API-data hebben én < 3 uur.
  if (flightFound && delayMinutes !== null) {
    if (delayMinutes <= 180) {
      const hrs  = Math.floor(delayMinutes / 60)
      const mins = delayMinutes % 60
      const label =
        delayMinutes <= 0   ? 'op tijd of vroeg geland' :
        hrs > 0             ? `${hrs}u ${mins}min aankomstvertraging` :
                              `${delayMinutes} minuten aankomstvertraging`
      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: `Vlucht had ${label} — EC 261/2004 geldt pas bij meer dan 3 uur aankomstvertraging`,
      }
    }
  }

  const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
  return buildEligible(distanceKm, flightType, intraEu)
}

// ── Hulpfunctie: bouw eligible-resultaat ──────────────────────────────────────
function buildEligible(
  distanceKm: number | null,
  flightType: string,
  intraEu: boolean,
): CompensationResult {
  const typeLabel =
    flightType === 'geannuleerd' ? 'Geannuleerde vlucht' :
    flightType === 'geweigerd'   ? 'Instapweigering' :
    null

  if (distanceKm === null) {
    return { eligible: true, amountPerPerson: 400, distanceKm: null, reason: typeLabel ?? 'Geschatte compensatie (afstand onbekend)' }
  }

  // Band (a): < 1.500 km → €250
  if (distanceKm < 1500) {
    return { eligible: true, amountPerPerson: 250, distanceKm, reason: typeLabel ?? `Vlucht van ${distanceKm} km (korter dan 1.500 km)` }
  }

  // Band (b): 1.500–3.500 km → €400
  //           én alle intra-EU/EEA vluchten boven 1.500 km → €400 (art. 7(1)(b))
  if (distanceKm <= 3500 || intraEu) {
    const note = (distanceKm > 3500 && intraEu)
      ? `Intra-EU/EEA vlucht van ${distanceKm} km — maximaal €400 (EC 261/2004 art. 7(1)(b))`
      : typeLabel ?? `Vlucht van ${distanceKm} km (1.500–3.500 km)`
    return { eligible: true, amountPerPerson: 400, distanceKm, reason: note }
  }

  // Band (c): > 3.500 km, niet intra-EU → €600
  return { eligible: true, amountPerPerson: 600, distanceKm, reason: typeLabel ?? `Vlucht van ${distanceKm} km (meer dan 3.500 km, buiten EU/EEA)` }
}

export function formatAmount(amount: number): string {
  return `€${amount.toLocaleString('nl-NL')}`
}
