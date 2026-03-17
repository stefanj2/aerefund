import { NextRequest, NextResponse } from 'next/server'
import { haversineDistance } from '@/lib/airports'
import { getAirlinePrefixFromFlightNumber, getAirlineConfig } from '@/lib/airlines'
import { storePublicDelay } from '@/lib/airline-delays'
import type { FlightData } from '@/lib/types'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// Demo / test flights — return realistic mock data to test the full funnel
// without needing real historical API data.
// ---------------------------------------------------------------------------
const DEMO_FLIGHTS: Record<string, Omit<FlightData, 'flightNumber' | 'date' | 'type'>> = {
  // KLM AMS→BCN — 4h15m delay → €400 per person (1849 km)
  'KL1234': {
    airline: 'KLM Royal Dutch Airlines', iataPrefix: 'KL',
    origin: 'AMS', destination: 'BCN',
    scheduledDeparture: '2024-06-15T08:30:00Z',
    scheduledArrival:   '2024-06-15T11:00:00Z',
    actualArrival:      '2024-06-15T15:15:00Z',
    delayMinutes: 255, distanceKm: 1849, found: true,
  },
  // Ryanair EIN→MAD — 3h30m delay → €400 per person (1862 km)
  'FR5678': {
    airline: 'Ryanair', iataPrefix: 'FR',
    origin: 'EIN', destination: 'MAD',
    scheduledDeparture: '2024-07-20T06:00:00Z',
    scheduledArrival:   '2024-07-20T09:20:00Z',
    actualArrival:      '2024-07-20T12:50:00Z',
    delayMinutes: 210, distanceKm: 1862, found: true,
  },
  // Transavia AMS→PMI — 4h delay → €400 per person (1720 km)
  'HV9999': {
    airline: 'Transavia', iataPrefix: 'HV',
    origin: 'AMS', destination: 'PMI',
    scheduledDeparture: '2024-08-10T10:00:00Z',
    scheduledArrival:   '2024-08-10T13:30:00Z',
    actualArrival:      '2024-08-10T17:30:00Z',
    delayMinutes: 240, distanceKm: 1720, found: true,
  },
  // KLM AMS→JFK — 4h delay → €600 per person (5857 km)
  'KL0605': {
    airline: 'KLM Royal Dutch Airlines', iataPrefix: 'KL',
    origin: 'AMS', destination: 'JFK',
    scheduledDeparture: '2024-09-05T10:15:00Z',
    scheduledArrival:   '2024-09-05T12:30:00Z',
    actualArrival:      '2024-09-05T16:30:00Z',
    delayMinutes: 240, distanceKm: 5857, found: true,
  },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const flightNumber = searchParams.get('flight')?.toUpperCase().replace(/\s/g, '') ?? ''
  const date = searchParams.get('date') ?? ''
  const type = (searchParams.get('type') ?? 'vertraagd') as FlightData['type']

  if (!flightNumber || !date) {
    return NextResponse.json({ error: 'Missing flight or date' }, { status: 400 })
  }

  // Return demo data for test flight numbers
  if (DEMO_FLIGHTS[flightNumber]) {
    return NextResponse.json({ flightNumber, date, type, ...DEMO_FLIGHTS[flightNumber] })
  }

  const prefix = getAirlinePrefixFromFlightNumber(flightNumber)

  // Try AeroDataBox first (best historical coverage, via API.Market)
  const aeroResult = await tryAeroDataBox(flightNumber, date, type, prefix)
  if (aeroResult) {
    storePublicDelay(aeroResult) // fire-and-forget — never blocks response
    return NextResponse.json(aeroResult)
  }

  // Try AviationStack
  const avResult = await tryAviationStack(flightNumber, date, type, prefix)
  if (avResult) {
    storePublicDelay(avResult)
    return NextResponse.json(avResult)
  }

  // Fallback: airline info from prefix only
  return NextResponse.json(buildFallback(flightNumber, date, type, prefix))
}

// ---------------------------------------------------------------------------
// AeroDataBox (via API.Market) — endpoint: /flights/number/{flight}/{date}
// Response docs: https://doc.aerodatabox.com/#tag/Flight-API
// ---------------------------------------------------------------------------
async function tryAeroDataBox(
  flightNumber: string,
  date: string,
  type: FlightData['type'],
  prefix: string
): Promise<FlightData | null> {
  const key = process.env.AERODATABOX_KEY
  const baseUrl = process.env.AERODATABOX_BASE_URL ?? 'https://prod.api.market/api/v1/aedbx/aerodatabox'
  if (!key) return null

  try {
    const res = await fetch(
      `${baseUrl}/flights/number/${flightNumber}/${date}`,
      {
        headers: {
          'x-api-market-key': key,
        },
        next: { revalidate: 0 },
      }
    )

    if (!res.ok) return null
    const json = await res.json()

    // API returns an array of flights (codeshares may have multiple)
    const flight = Array.isArray(json) ? json[0] : json
    if (!flight) return null

    const origin: string | null = flight.departure?.airport?.iata ?? null
    const destination: string | null = flight.arrival?.airport?.iata ?? null

    // AeroDataBox provides great-circle distance directly — use it, otherwise Haversine
    const distanceKm: number | null =
      flight.greatCircleDistance?.km != null
        ? Math.round(flight.greatCircleDistance.km)
        : origin && destination
        ? haversineDistance(origin, destination)
        : null

    const scheduledArrUtc: string | null = flight.arrival?.scheduledTime?.utc ?? null
    // revisedTime = best known arrival (gate time); runwayTime = wheels-down
    const actualArrUtc: string | null =
      flight.arrival?.revisedTime?.utc ??
      flight.arrival?.runwayTime?.utc ??
      null

    let delayMinutes: number | null = null
    if (scheduledArrUtc && actualArrUtc) {
      delayMinutes = Math.round(
        (new Date(actualArrUtc).getTime() - new Date(scheduledArrUtc).getTime()) / 60000
      )
    }

    const airlineIata: string = flight.airline?.iata ?? prefix
    const status: string = flight.status ?? ''

    // Map AeroDataBox status to whether flight is cancelled
    const isCancelled =
      status.toLowerCase().includes('cancel') ||
      type === 'geannuleerd'

    return {
      flightNumber,
      date,
      type,
      airline: flight.airline?.name ?? getAirlineConfig(airlineIata).fullName,
      iataPrefix: airlineIata,
      origin,
      destination,
      scheduledDeparture: flight.departure?.scheduledTime?.utc ?? null,
      scheduledArrival: scheduledArrUtc,
      actualArrival: isCancelled ? null : actualArrUtc,
      delayMinutes: isCancelled ? null : delayMinutes,
      distanceKm,
      found: true,
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// AviationStack — fallback
// ---------------------------------------------------------------------------
async function tryAviationStack(
  flightNumber: string,
  date: string,
  type: FlightData['type'],
  prefix: string
): Promise<FlightData | null> {
  const key = process.env.AVIATIONSTACK_KEY
  if (!key) return null

  try {
    const params = new URLSearchParams({
      access_key: key,
      flight_iata: flightNumber,
      flight_date: date,
    })

    // Free plan is HTTP only
    const base = 'http://api.aviationstack.com/v1/flights'
    const res = await fetch(`${base}?${params}`, { next: { revalidate: 0 } })
    if (!res.ok) return null

    const json = await res.json()
    if (json.error) return null

    const flight = json?.data?.[0]
    if (!flight) return null

    const origin: string | null = flight.departure?.iata ?? null
    const destination: string | null = flight.arrival?.iata ?? null
    const distanceKm =
      origin && destination ? haversineDistance(origin, destination) : null

    const scheduledArr: string | null = flight.arrival?.scheduled ?? null
    const actualArrRaw: string | null = flight.arrival?.actual ?? null
    let delayMinutes: number | null = null
    if (scheduledArr && actualArrRaw) {
      delayMinutes = Math.round(
        (new Date(actualArrRaw).getTime() - new Date(scheduledArr).getTime()) / 60000
      )
    } else if (typeof flight.arrival?.delay === 'number') {
      delayMinutes = flight.arrival.delay
    }

    const isCancelled =
      (flight.flight_status ?? '').toLowerCase().includes('cancel') ||
      type === 'geannuleerd'

    return {
      flightNumber,
      date,
      type,
      airline: flight.airline?.name ?? null,
      iataPrefix: flight.airline?.iata ?? prefix,
      origin,
      destination,
      scheduledDeparture: flight.departure?.scheduled ?? null,
      scheduledArrival: scheduledArr,
      actualArrival: isCancelled ? null : actualArrRaw,
      delayMinutes: isCancelled ? null : delayMinutes,
      distanceKm,
      found: true,
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Fallback
// ---------------------------------------------------------------------------
function buildFallback(
  flightNumber: string,
  date: string,
  type: FlightData['type'],
  prefix: string
): FlightData {
  const conf = getAirlineConfig(prefix)
  return {
    flightNumber,
    date,
    type,
    airline: conf.fullName,
    iataPrefix: prefix.toUpperCase() || null,
    origin: null,
    destination: null,
    scheduledDeparture: null,
    scheduledArrival: null,
    actualArrival: null,
    delayMinutes: null,
    distanceKm: null,
    found: false,
  }
}
