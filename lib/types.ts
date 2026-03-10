export type FlightType = 'vertraagd' | 'geannuleerd' | 'geweigerd'

export type CancellationNotice = 'lt14days' | 'gt14days'
export type CauseType = 'force' | 'technical' | 'unknown'

export type RouteSearchParams = {
  origin: string       // IATA, e.g. "AMS"
  destination: string  // IATA, e.g. "BKK"
  date: string         // YYYY-MM-DD
  type: FlightType
  via?: string         // legacy single stopover (kept for backwards compat)
  viaAirports?: string[] // multiple stopovers (new)
  // Extra eligibility refiners (set on /selecteer)
  cancellationNotice?: CancellationNotice  // geannuleerd only
  causeType?: CauseType                    // vertraagd + geannuleerd
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
