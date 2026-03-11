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

export async function GET(req: NextRequest) {
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { searchParams } = req.nextUrl
  const days = parseInt(searchParams.get('days') ?? '0', 10) // 0 = all time

  const { data: all, error } = await db
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let claims = all ?? []

  // Apply period filter
  if (days > 0) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    claims = claims.filter(c => c.created_at && new Date(c.created_at) >= cutoff)
  }

  const total = claims.length

  // ── Funnel steps ────────────────────────────────────────────────────────
  const FUNNEL_STEPS = [
    { key: 'result_viewed', label: 'Resultaat bekeken' },
    { key: 'submitted',     label: 'Claim ingediend' },
    { key: 'invoice_paid',  label: 'Factuur betaald' },
    { key: 'claim_filed',   label: 'Claim verzonden' },
    { key: 'won',           label: 'Gewonnen / uitbetaald' },
  ]

  const funnel = FUNNEL_STEPS.map(step => {
    const rank = statusRank(step.key)
    const count = claims.filter(c => statusRank(c.status) >= rank).length
    return { ...step, count }
  })

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
    sum + (c.compensation?.amountPerPerson ?? 0) * (c.passengers ?? 1) * 0.10, 0)

  const revenue = {
    fees_invoiced: invoiced_count * 42,
    fees_collected: paid_count * 42,
    commission_earned: Math.round(commission),
    total_earned: paid_count * 42 + Math.round(commission),
  }

  return NextResponse.json({ total, funnel, by_airline, by_type, revenue })
}
