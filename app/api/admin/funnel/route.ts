import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

// Ordered progression through the funnel (rejected/closed are side branches)
const STATUS_ORDER = [
  'result_viewed', 'submitted', 'invoice_sent', 'invoice_paid',
  'claim_filed', 'in_progress', 'won', 'compensation_paid',
]

function statusRank(status: string): number {
  return STATUS_ORDER.indexOf(status) // -1 for rejected/closed/appeal_filed
}

function countEvents(rows: { event: string }[], ...events: string[]): number {
  return rows.filter(r => events.includes(r.event)).length
}

export async function GET(req: NextRequest) {
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { searchParams } = req.nextUrl
  const days = parseInt(searchParams.get('days') ?? '0', 10) // 0 = all time

  // Build cutoff date string for Supabase filter
  const cutoffIso = days > 0
    ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    : null

  // Fetch claims and funnel_events in parallel
  let claimsQuery = db.from('claims').select('*').order('created_at', { ascending: false })
  let eventsQuery = db.from('funnel_events').select('event, created_at')

  if (cutoffIso) {
    claimsQuery = claimsQuery.gte('created_at', cutoffIso)
    eventsQuery = eventsQuery.gte('created_at', cutoffIso)
  }

  const [{ data: allClaims, error: claimsError }, { data: allEvents }] = await Promise.all([
    claimsQuery,
    eventsQuery,
  ])

  if (claimsError) return NextResponse.json({ error: claimsError.message }, { status: 500 })

  const claims = allClaims ?? []
  const events = allEvents ?? []

  // ── Top-of-funnel counts from funnel_events ──────────────────────────────
  const funnelStart      = countEvents(events, 'funnel_start')
  const typeSelected     = countEvents(events, 'type_selected')
  const detailsComplete  = countEvents(events, 'details_complete')
  const flightSelected   = countEvents(events, 'flight_selected')
  const resultViewed     = countEvents(events, 'result_eligible', 'result_ineligible')
  const claimStarted     = countEvents(events, 'claim_started')

  // ── Bottom-of-funnel counts from claims ──────────────────────────────────
  const claimSubmitted   = claims.filter(c => statusRank(c.status) >= statusRank('submitted')).length
  const won              = claims.filter(c => statusRank(c.status) >= statusRank('won')).length

  // ── Combined 8-step funnel ───────────────────────────────────────────────
  const funnel = [
    { key: 'funnel_start',      label: 'Funnel gestart',      count: funnelStart,     source: 'events' },
    { key: 'type_selected',     label: 'Type geselecteerd',   count: typeSelected,    source: 'events' },
    { key: 'details_complete',  label: 'Details ingevuld',    count: detailsComplete, source: 'events' },
    { key: 'flight_selected',   label: 'Vlucht geselecteerd', count: flightSelected,  source: 'events' },
    { key: 'result_viewed',     label: 'Resultaat bekeken',   count: resultViewed,    source: 'events' },
    { key: 'claim_started',     label: 'Claim gestart',       count: claimStarted,    source: 'events' },
    { key: 'submitted',         label: 'Claim ingediend',     count: claimSubmitted,  source: 'claims' },
    { key: 'won',               label: 'Gewonnen / uitbetaald', count: won,           source: 'claims' },
  ]

  // ── By airline ──────────────────────────────────────────────────────────
  const airlineMap: Record<string, { submitted: number; won: number; total_compensation: number }> = {}

  for (const c of claims) {
    const prefix = (c.flight_data as Record<string, string>)?.iataPrefix ?? 'Overig'
    const airline = (c.flight_data as Record<string, string>)?.airline ?? prefix
    const key = prefix || airline || 'Overig'
    if (!airlineMap[key]) airlineMap[key] = { submitted: 0, won: 0, total_compensation: 0 }
    if (statusRank(c.status) >= statusRank('submitted')) airlineMap[key].submitted++
    if (statusRank(c.status) >= statusRank('won')) {
      airlineMap[key].won++
      airlineMap[key].total_compensation += (c.compensation?.amountPerPerson ?? 0) * (c.passengers ?? 1)
    }
  }

  const by_airline = Object.entries(airlineMap)
    .map(([iata, v]) => ({ iata, ...v }))
    .sort((a, b) => b.submitted - a.submitted)

  // ── By claim type ───────────────────────────────────────────────────────
  const typeMap: Record<string, { submitted: number; won: number }> = {}

  for (const c of claims) {
    const type = (c.flight_data as Record<string, string>)?.type ?? 'Onbekend'
    if (!typeMap[type]) typeMap[type] = { submitted: 0, won: 0 }
    if (statusRank(c.status) >= statusRank('submitted')) typeMap[type].submitted++
    if (statusRank(c.status) >= statusRank('won')) typeMap[type].won++
  }

  const by_type = Object.entries(typeMap)
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.submitted - a.submitted)

  // ── Revenue ─────────────────────────────────────────────────────────────
  const invoiced_count = claims.filter(c => statusRank(c.status) >= statusRank('invoice_sent')).length
  const paid_count     = claims.filter(c => statusRank(c.status) >= statusRank('invoice_paid')).length
  const won_claims     = claims.filter(c => statusRank(c.status) >= statusRank('won'))
  const commission     = won_claims.reduce((sum, c) =>
    sum + (c.compensation?.amountPerPerson ?? 0) * (c.passengers ?? 1) * 0.25, 0)

  const revenue = {
    fees_invoiced: invoiced_count * 42,
    fees_collected: paid_count * 42,
    commission_earned: Math.round(commission),
    total_earned: paid_count * 42 + Math.round(commission),
  }

  // total = top of funnel for percentage calculations
  const total = funnelStart || claims.length

  return NextResponse.json({ total, funnel, by_airline, by_type, revenue })
}
