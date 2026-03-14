import { getSupabase } from './supabase'
import { calculateCompensation } from './compensation'
import { getFlightRecords } from './airline-page-data'
import type { FlightData } from './types'
import type { FlightRecord } from './airline-page-data'

// ── Store a real delay when a user looks up a qualifying flight ───────────────

export async function storePublicDelay(flight: FlightData): Promise<void> {
  if (
    !flight.found ||
    !flight.iataPrefix ||
    !flight.origin ||
    !flight.destination ||
    !flight.flightNumber ||
    !flight.date ||
    (flight.delayMinutes ?? 0) < 180
  ) return

  const db = getSupabase()
  if (!db) return

  const compensation = flight.distanceKm
    ? calculateCompensation(flight.distanceKm, flight.delayMinutes, 'vertraagd', true).amountPerPerson
    : 250

  const delayMin = flight.delayMinutes!
  const hours    = Math.floor(delayMin / 60)
  const mins     = delayMin % 60
  const delayLabel = mins > 0 ? `${hours}u ${mins}m` : `${hours}u`

  // Upsert — same flight on same date is only stored once
  await db.from('public_delays').upsert({
    iata:          flight.iataPrefix.toUpperCase(),
    flight_number: flight.flightNumber,
    origin:        flight.origin,
    destination:   flight.destination,
    route:         `${flight.origin} → ${flight.destination}`,
    delay_minutes: delayMin,
    delay_label:   delayLabel,
    compensation,
    flight_date:   flight.date,
  }, { onConflict: 'flight_number,flight_date', ignoreDuplicates: false })
}

// ── Read recent delays for an airline page ────────────────────────────────────

export async function getAirlineDelays(iata: string): Promise<FlightRecord[]> {
  const db = getSupabase()

  if (db) {
    try {
      const { data, error } = await db
        .from('public_delays')
        .select('flight_number, route, delay_label, compensation, flight_date')
        .eq('iata', iata.toUpperCase())
        .order('flight_date', { ascending: false })
        .limit(6)

      if (!error && data && data.length >= 3) {
        return data.map(row => ({
          date:         formatDate(row.flight_date),
          flightNumber: row.flight_number,
          route:        row.route,
          delay:        row.delay_label,
          compensation: row.compensation,
        }))
      }
    } catch {
      // fall through to hardcoded fallback
    }
  }

  // Fallback to hardcoded sample data
  return getFlightRecords(iata)
}

// ── Cleanup old records (called from cron) ────────────────────────────────────

export async function pruneOldDelays(): Promise<number> {
  const db = getSupabase()
  if (!db) return 0

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)

  const { count, error } = await db
    .from('public_delays')
    .delete({ count: 'exact' })
    .lt('flight_date', cutoff.toISOString().split('T')[0])

  if (error) return 0
  return count ?? 0
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}
