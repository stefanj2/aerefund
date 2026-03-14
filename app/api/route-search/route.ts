import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { haversineDistance } from '@/lib/airports'
import { getAirlinePrefixFromFlightNumber } from '@/lib/airlines'
import type { RouteFlightOption } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const origin = searchParams.get('origin')?.toUpperCase() ?? ''
  const destination = searchParams.get('destination')?.toUpperCase() ?? ''
  const date = searchParams.get('date') ?? ''

  if (!origin || !destination || !date) {
    return NextResponse.json({ error: 'Missing origin, destination or date' }, { status: 400 })
  }

  const results = await searchDepartures(origin, destination, date)
  return NextResponse.json(results)
}

// ---------------------------------------------------------------------------
// AeroDataBox — GET /flights/airports/iata/{iata}/{from}/{to}
// ---------------------------------------------------------------------------
async function fetchSlot(url: string, key: string): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  try {
    const r = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-market-key': key,
      },
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!r.ok) {
      console.error(`[route-search] fetchSlot HTTP ${r.status} for ${url.split('?')[0]}`)
      return null
    }
    return await r.json().catch(() => null)
  } catch (e) {
    console.error(`[route-search] fetchSlot error:`, e)
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function searchDepartures(
  origin: string,
  destination: string,
  date: string
): Promise<RouteFlightOption[]> {
  noStore()
  const key = process.env.AERODATABOX_KEY
  if (!key) { console.error('[route-search] AERODATABOX_KEY not set'); return [] }

  const slots = [
    { from: `${date}T00:00`, to: `${date}T12:00` },
    { from: `${date}T12:00`, to: `${date}T23:59` },
  ]

  const departures: unknown[] = []
  let firstSlot = true

  for (const { from, to } of slots) {
    if (!firstSlot) await new Promise(r => setTimeout(r, 1200)) // respect 1 req/sec rate limit
    firstSlot = false

    const baseUrl = process.env.AERODATABOX_BASE_URL ?? 'https://prod.api.market/api/v1/aedbx/aerodatabox'
    const url =
      `${baseUrl}/flights/airports/iata/${origin}/${from}/${to}` +
      `?withLeg=false&withCancelled=false&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`

    const json = await fetchSlot(url, key)
    if (!json) continue

    const arr = Array.isArray(json)
      ? json
      : Array.isArray((json as Record<string, unknown>)?.departures)
        ? ((json as Record<string, unknown>).departures as unknown[])
        : []

    departures.push(...arr)
  }

  const results: RouteFlightOption[] = []

  for (const item of departures) {
    const f = item as Record<string, unknown>

    const movement = f.movement as Record<string, unknown> | undefined
    const movAirport = movement?.airport as Record<string, unknown> | undefined
    const arrIata = (movAirport?.iata as string)?.toUpperCase()
    if (arrIata !== destination) continue

    const flightNumber = (f.number as string)?.replace(/\s+/g, '')
    if (!flightNumber) continue

    const movTime = movement?.scheduledTime as Record<string, unknown> | undefined
    const depLocal = parseLocalTime(movTime?.local as string | null)

    const movRevised = movement?.revisedTime as Record<string, unknown> | undefined
    const scheduledStr = movTime?.local as string | null
    const revisedStr = movRevised?.local as string | null
    let delayMinutes: number | null = (movement?.delay as number | null) ?? null
    if (delayMinutes === null && scheduledStr && revisedStr) {
      const sch = parseMinutesSinceMidnight(scheduledStr)
      const rev = parseMinutesSinceMidnight(revisedStr)
      if (sch !== null && rev !== null) delayMinutes = rev - sch
    }

    const arrLocal: string | null = null

    const airline = (f.airline as Record<string, unknown>)?.name as string ?? ''
    const iataPrefix =
      ((f.airline as Record<string, unknown>)?.iata as string) ||
      getAirlinePrefixFromFlightNumber(flightNumber)

    const distanceKm = haversineDistance(origin, destination)
    const status = f.status as string | null

    results.push({
      flightNumber,
      airline,
      iataPrefix,
      departureLocal: depLocal,
      arrivalLocal: arrLocal,
      origin,
      destination,
      distanceKm,
      status,
      delayMinutes,
    })
  }

  results.sort((a, b) => (a.departureLocal ?? '').localeCompare(b.departureLocal ?? ''))
  return results
}

function parseLocalTime(raw: string | null | undefined): string | null {
  if (!raw) return null
  const match = raw.match(/(\d{2}:\d{2})/)
  return match ? match[1] : null
}

function parseMinutesSinceMidnight(raw: string | null | undefined): number | null {
  const match = raw?.match(/(\d{2}):(\d{2})/)
  if (!match) return null
  return parseInt(match[1]) * 60 + parseInt(match[2])
}
