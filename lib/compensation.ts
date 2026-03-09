// EC 261/2004 compensation calculation
// Threshold: > 3 hours (180 min) arrival delay

export type CompensationResult = {
  eligible: boolean
  amountPerPerson: number
  reason: string
  distanceKm: number | null
}

export function calculateCompensation(
  distanceKm: number | null,
  delayMinutes: number | null,
  flightType: 'vertraagd' | 'geannuleerd' | 'geweigerd',
  flightFound: boolean = false
): CompensationResult {
  // Cancellations and overbooking are always eligible under EC 261
  if (flightType === 'geannuleerd' || flightType === 'geweigerd') {
    return buildEligible(distanceKm, flightType)
  }

  // Delay: only mark NOT eligible when we have verified API data showing < 3 hours
  if (flightType === 'vertraagd' && flightFound && delayMinutes !== null) {
    if (delayMinutes <= 180) {
      const hrs = Math.floor(delayMinutes / 60)
      const mins = delayMinutes % 60
      const delayLabel =
        delayMinutes <= 0
          ? 'op tijd of vroeg geland'
          : hrs > 0
          ? `${hrs}u ${mins}min vertraagd`
          : `${delayMinutes} minuten vertraagd`

      return {
        eligible: false,
        amountPerPerson: 0,
        distanceKm,
        reason: `Vlucht was ${delayLabel} — EC 261/2004 geldt pas bij meer dan 3 uur aankomstvertraging`,
      }
    }
  }

  // Eligible — calculate amount based on distance
  return buildEligible(distanceKm, flightType)
}

function buildEligible(
  distanceKm: number | null,
  flightType: string
): CompensationResult {
  const typeLabel =
    flightType === 'geannuleerd'
      ? 'Geannuleerde vlucht'
      : flightType === 'geweigerd'
      ? 'Instapweigering'
      : null

  if (distanceKm === null) {
    return {
      eligible: true,
      amountPerPerson: 400,
      distanceKm: null,
      reason: typeLabel ?? 'Geschatte compensatie (afstand onbekend)',
    }
  }

  if (distanceKm < 1500) {
    return {
      eligible: true,
      amountPerPerson: 250,
      distanceKm,
      reason: typeLabel ?? `Vlucht van ${distanceKm} km (korter dan 1.500 km)`,
    }
  }

  if (distanceKm <= 3500) {
    return {
      eligible: true,
      amountPerPerson: 400,
      distanceKm,
      reason: typeLabel ?? `Vlucht van ${distanceKm} km (1.500–3.500 km)`,
    }
  }

  return {
    eligible: true,
    amountPerPerson: 600,
    distanceKm,
    reason: typeLabel ?? `Vlucht van ${distanceKm} km (meer dan 3.500 km)`,
  }
}

export function formatAmount(amount: number): string {
  return `€${amount.toLocaleString('nl-NL')}`
}
