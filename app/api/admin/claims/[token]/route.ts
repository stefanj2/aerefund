import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

type Note = {
  id: string
  timestamp: string
  type: 'status_change' | 'note'
  text: string
  prev_status?: string
  new_status?: string
}

const STATUS_LABELS: Record<string, string> = {
  result_viewed: 'Bekeken',
  submitted: 'Ingediend',
  invoice_sent: 'Factuur verstuurd',
  invoice_paid: 'Factuur betaald',
  claim_filed: 'Claim ingediend bij airline',
  in_progress: 'In behandeling',
  won: 'Gewonnen',
  compensation_paid: 'Uitbetaald',
  rejected: 'Afgewezen',
  appeal_filed: 'Bezwaar ingediend',
  closed: 'Gesloten',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { data, error } = await db
    .from('claims')
    .select('*')
    .eq('token', token.toUpperCase())
    .single()

  if (error || !data) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const body = await req.json()
  const { status: newStatus, note, ...otherFields } = body

  // Get current claim for existing notes + status
  const { data: current } = await db
    .from('claims')
    .select('status, notes')
    .eq('token', token.toUpperCase())
    .single()

  const existingNotes: Note[] = (current?.notes as Note[]) ?? []
  const newNotes: Note[] = []

  // Auto-log status change
  if (newStatus && newStatus !== current?.status) {
    newNotes.push({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: 'status_change',
      text: `Status gewijzigd: "${STATUS_LABELS[current?.status] ?? current?.status}" → "${STATUS_LABELS[newStatus] ?? newStatus}"`,
      prev_status: current?.status,
      new_status: newStatus,
    })
  }

  // Add manual note
  if (note?.trim()) {
    newNotes.push({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: 'note',
      text: note.trim(),
    })
  }

  const updateData: Record<string, unknown> = {
    ...otherFields,
    notes: [...existingNotes, ...newNotes],
    updated_at: new Date().toISOString(),
  }
  if (newStatus) updateData.status = newStatus

  const { error } = await db
    .from('claims')
    .update(updateData)
    .eq('token', token.toUpperCase())

  if (error) {
    // If notes/invoice_number column doesn't exist yet (migration not run),
    // retry with just the status update so the admin panel still works.
    const isMissingColumn = error.message?.includes('column') && error.message?.includes('does not exist')
    if (isMissingColumn) {
      const fallback: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (newStatus) fallback.status = newStatus
      const { error: e2 } = await db.from('claims').update(fallback).eq('token', token.toUpperCase())
      if (e2) return NextResponse.json({ error: e2.message, migration_needed: true }, { status: 500 })
      return NextResponse.json({ success: true, migration_needed: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
