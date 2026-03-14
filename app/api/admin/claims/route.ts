import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const ALL_STATUSES = [
  'result_viewed', 'submitted', 'invoice_sent', 'invoice_paid',
  'claim_filed', 'in_progress', 'won', 'compensation_paid',
  'rejected', 'appeal_filed', 'closed',
]

const PAGE_SIZE = 25

export async function GET(req: NextRequest) {
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { searchParams } = req.nextUrl
  const statusFilter = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase().trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  // Fetch all claims for stats, then apply filters in memory
  const { data: allClaims, error } = await db
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = allClaims ?? []

  // Stats from all claims
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const stats = {
    total: all.length,
    this_week: all.filter(c => c.created_at && new Date(c.created_at) > weekAgo).length,
    awaiting_invoice: all.filter(c => c.status === 'submitted').length,
    active_at_airline: all.filter(c => ['claim_filed', 'in_progress'].includes(c.status)).length,
    won: all.filter(c => ['won', 'compensation_paid'].includes(c.status)).length,
    rejected: all.filter(c => ['rejected', 'closed'].includes(c.status)).length,
    by_status: Object.fromEntries(ALL_STATUSES.map(s => [s, all.filter(c => c.status === s).length])),
    potential_revenue: all
      .filter(c => ['submitted', 'invoice_sent', 'invoice_paid', 'claim_filed', 'in_progress', 'won', 'compensation_paid'].includes(c.status))
      .reduce((sum, c) => sum + 42 + ((c.compensation?.amountPerPerson ?? 0) * (c.passengers ?? 1) * 0.1), 0),
  }

  // Apply filters
  let filtered = [...all]

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter(c => c.status === statusFilter)
  }

  if (search) {
    filtered = filtered.filter(c =>
      c.token?.toLowerCase().includes(search) ||
      c.first_name?.toLowerCase().includes(search) ||
      c.last_name?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      (c.flight_data as Record<string, string>)?.flightNumber?.toLowerCase().includes(search)
    )
  }

  // Paginate
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const start = (clampedPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(start, start + PAGE_SIZE)

  return NextResponse.json({ claims: paginated, stats, total, page: clampedPage, totalPages, pageSize: PAGE_SIZE })
}
