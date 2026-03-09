import type { FlightData, RouteFlightOption, RouteSearchParams } from './types'

/**
 * Client-side lookup — calls our own server-side proxy (/api/flight)
 * so API keys are never exposed to the browser.
 */
export async function lookupFlight(
  flightNumber: string,
  date: string,
  type: FlightData['type']
): Promise<FlightData> {
  const params = new URLSearchParams({ flight: flightNumber, date, type })

  const res = await fetch(`/api/flight?${params}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)

  return res.json() as Promise<FlightData>
}

/**
 * Client-side route search — calls /api/route-search
 */
export async function searchFlightsByRoute(
  params: Pick<RouteSearchParams, 'origin' | 'destination' | 'date'>
): Promise<RouteFlightOption[]> {
  const qs = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
  })
  const res = await fetch(`/api/route-search?${qs}`)
  if (!res.ok) return []
  return res.json() as Promise<RouteFlightOption[]>
}
