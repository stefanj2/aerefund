export type FlightType = 'vertraagd' | 'geannuleerd' | 'geweigerd' | 'downgrade'

// Annuleringsmelding — art. 5(1)(c) matrix
// gt14days  : ≥14 dagen → nooit compensatie
// d7_13_ok  : 7-13 dagen, adequaat alternatief aangeboden → geen compensatie
// d7_13_bad : 7-13 dagen, geen/slecht alternatief → wél compensatie
// lt7_ok    : <7 dagen, adequaat alternatief → geen compensatie
// lt7_bad   : <7 dagen, geen/slecht alternatief → wél compensatie
// no_notice : dag zelf of geen melding → altijd compensatie
// lt14days  : legacy — behandeld als lt7_bad (meest gunstig voor passagier)
export type CancellationNotice =
  | 'gt14days'
  | 'd7_13_ok'
  | 'd7_13_bad'
  | 'lt7_ok'
  | 'lt7_bad'
  | 'no_notice'
  | 'lt14days'   // legacy backwards-compat

// Oorzaak van vertraging/annulering
// weather       : slecht weer → force majeure (art. 5(3))
// atc-strike    : ATC-staking → force majeure
// airline-strike: staking airlinepersoneel → NIET force majeure (CJEU C-195/17)
// ripple        : late inbound aircraft / rotatievertraging → NIET force majeure (CJEU)
// technical     : technisch defect → NIET force majeure (CJEU C-549/07)
// unknown       : onbekend → claim loopt door
export type CauseType =
  | 'weather'
  | 'atc-strike'
  | 'airline-strike'
  | 'ripple'
  | 'technical'
  | 'unknown'
  | 'force'      // legacy backwards-compat → behandeld als weather

export type RouteSearchParams = {
  origin: string       // IATA, e.g. "AMS"
  destination: string  // IATA, e.g. "BKK"
  date: string         // YYYY-MM-DD
  type: FlightType
  via?: string         // legacy single stopover (kept for backwards compat)
  viaAirports?: string[] // multiple stopovers (new)
  // Extra eligibility refiners (set on /selecteer)
  cancellationNotice?: CancellationNotice
  causeType?: CauseType
  singleBooking?: 'single' | 'separate'  // connecting flights: one booking or separate tickets?
  ticketPriceEur?: number                // downgrade claims: paid ticket price in EUR
  stopover?: 'yes' | 'no'               // had je een tussenstop?
}

export type RouteFlightOption = {
  flightNumber: string
  airline: string
  iataPrefix: string
  departureLocal: string | null  // "HH:MM"
  arrivalLocal: string | null    // "HH:MM"
  origin: string
  destination: string
  distanceKm: number | null
  status: string | null
  delayMinutes: number | null
}

export type ClaimDifficulty = 'easy' | 'medium' | 'hard'

export type FlightData = {
  flightNumber: string
  date: string
  type: FlightType
  airline: string | null
  iataPrefix: string | null
  origin: string | null
  destination: string | null
  scheduledDeparture: string | null
  scheduledArrival: string | null
  actualArrival: string | null
  delayMinutes: number | null
  distanceKm: number | null
  found: boolean
}

export type ClaimData = {
  flight: FlightData
  compensationPerPerson: number
  totalCompensation: number
  passengers: number
  firstName: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
  iban: string
  agreedToTerms: boolean
  coPassengers: CoPassenger[]
  boardingPassUrl: string | null
}

export type CoPassenger = {
  firstName: string
  lastName: string
  email: string
}
