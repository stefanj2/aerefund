// EC 261/2004 compensation calculation — volledig conform de verordening
import { AIRPORTS } from '@/lib/airports'
import type { CancellationNotice, CauseType } from '@/lib/types'

export type CompensationResult = {
  eligible: boolean
  amountPerPerson: number
  reason: string
  distanceKm: number | null
  downgradePercentage?: number   // only set for downgrade type: 30 | 50 | 75
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
  ticketPriceEur?: number               // voor downgrade claims
}

// ── Force majeure check ───────────────────────────────────────────────────────
// Alleen 'weather' en 'atc-strike' zijn echte buitengewone omstandigheden.
// Airline-stakingen, rotatievertraging en technische defecten zijn GÉÉN
// force majeure (CJEU C-195/17 Krüsemann; CJEU C-549/07 Wallentin-Hermann).
function isForceMajeure(causeType?: CauseType): boolean {
  return causeType === 'weather' || causeType === 'atc-strike' || causeType === 'force'
}

// ── Annulering: kwalificeer CancellationNotice ──────────────────────────────
// Returns true als er géén compensatierecht is op basis van de aankondiging.
function cancellationNoticeBlocksCompensation(notice?: CancellationNotice): boolean {
  if (!notice) return false
  if (notice === 'gt14days') return true      // ≥14 dagen → nooit compensatie
  if (notice === 'd7_13_ok') return true      // 7-13 dagen, adequaat alternatief
  if (notice === 'lt7_ok')   return true      // <7 dagen, adequaat alternatief
  // d7_13_bad, lt7_bad, no_notice, lt14days (legacy) → wél compensatierecht
  return false
}

// ── Hoofdfunctie ──────────────────────────────────────────────────────────────
export function calculateCompensation(
  distanceKm: number | null,
  delayMinutes: number | null,
  flightType: 'vertraagd' | 'geannuleerd' | 'geweigerd' | 'downgrade' | string,
  flightFound: boolean = false,
  opts: CompensationOpts = {}
): CompensationResult {
  const { origin, destination, carrierIsEu, cancellationNotice, causeType, ticketPriceEur } = opts

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
  // Alleen slecht weer en ATC-staking zijn force majeure.
  // Airline-stakingen en technische defecten zijn GEEN buitengewone omstandigheid.
  if (isForceMajeure(causeType)) {
    return {
      eligible: false,
      amountPerPerson: 0,
      distanceKm,
      reason: 'Buitengewone omstandigheid (weersomstandigheden of ATC-staking) — airline is vrijgesteld onder EC 261/2004 art. 5(3)',
    }
  }

  // 3. Downgrade (art. 10) ────────────────────────────────────────────────────
  if (flightType === 'downgrade') {
    const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
    return buildDowngrade(distanceKm, intraEu, ticketPriceEur)
  }

  // 4. Annulering: aankondigingstermijn (art. 5(1)(c)) ──────────────────────
  if (flightType === 'geannuleerd') {
    if (cancellationNoticeBlocksCompensation(cancellationNotice)) {
      const reasonMap: Partial<Record<CancellationNotice, string>> = {
        gt14days: 'Annulering ≥ 14 dagen van tevoren gemeld — geen compensatierecht (EC 261/2004 art. 5(1)(c))',
        d7_13_ok: 'Annulering 7–13 dagen van tevoren met adequaat alternatief — geen compensatierecht (EC 261/2004 art. 5(1)(c))',
        lt7_ok:   'Annulering <7 dagen van tevoren met adequaat alternatief — geen compensatierecht (EC 261/2004 art. 5(1)(c))',
      }
      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: reasonMap[cancellationNotice!] ?? 'Geen compensatierecht op basis van annuleringsmelding',
      }
    }
    const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
    return buildEligible(distanceKm, flightType, intraEu)
  }

  // 5. Instapweigering (art. 4) — altijd in aanmerking ──────────────────────
  if (flightType === 'geweigerd') {
    const intraEu = origin && destination ? isIntraEuRoute(origin, destination) : false
    return buildEligible(distanceKm, flightType, intraEu)
  }

  // 6. Vertraging: drempel > 3 uur aankomstvertraging (art. 6 + Sturgeon) ───
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

// ── Hulpfunctie: downgrade (art. 10(2)) ───────────────────────────────────────
// Passagier in lagere klasse dan geboekt: percentage van ticketprijs.
function buildDowngrade(
  distanceKm: number | null,
  intraEu: boolean,
  ticketPriceEur?: number,
): CompensationResult {
  let pct: number
  let distLabel: string

  if (distanceKm === null) {
    pct = 50
    distLabel = 'afstand onbekend'
  } else if (distanceKm < 1500) {
    pct = 30
    distLabel = `vlucht van ${distanceKm} km`
  } else if (distanceKm <= 3500 || intraEu) {
    pct = 50
    distLabel = `vlucht van ${distanceKm} km`
  } else {
    pct = 75
    distLabel = `vlucht van ${distanceKm} km`
  }

  const amount = ticketPriceEur ? Math.round(ticketPriceEur * pct / 100) : 0
  const reason = `Downgrade — ${pct}% van ticketprijs (${distLabel}, EC 261/2004 art. 10(2))`

  return {
    eligible: true,
    amountPerPerson: amount,
    distanceKm,
    reason,
    downgradePercentage: pct,
  }
}

export function formatAmount(amount: number): string {
  return `€${amount.toLocaleString('nl-NL')}`
}
