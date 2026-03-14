import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

type AirlineEmail = {
  id: string
  received_at: string
  from: string
  subject: string
  body_text: string
  source: 'manual' | 'webhook'
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const body = await req.json()
  const { from, subject, body_text } = body

  if (!body_text?.trim()) {
    return NextResponse.json({ error: 'E-mailtekst verplicht' }, { status: 400 })
  }

  // Fetch existing airline_emails
  const { data: claim } = await db
    .from('claims')
    .select('airline_emails')
    .eq('token', token.toUpperCase())
    .single()

  if (!claim) return NextResponse.json({ error: 'Claim niet gevonden' }, { status: 404 })

  const existing: AirlineEmail[] = (claim.airline_emails as AirlineEmail[]) ?? []

  const newEmail: AirlineEmail = {
    id:          crypto.randomUUID(),
    received_at: new Date().toISOString(),
    from:        (from?.trim()) || 'onbekend',
    subject:     (subject?.trim()) || '(geen onderwerp)',
    body_text:   body_text.trim(),
    source:      'manual',
  }

  const { error } = await db
    .from('claims')
    .update({
      airline_emails: [...existing, newEmail],
      updated_at: new Date().toISOString(),
    })
    .eq('token', token.toUpperCase())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, email: newEmail })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id verplicht' }, { status: 400 })

  const { data: claim } = await db
    .from('claims')
    .select('airline_emails')
    .eq('token', token.toUpperCase())
    .single()

  if (!claim) return NextResponse.json({ error: 'Claim niet gevonden' }, { status: 404 })

  const existing: AirlineEmail[] = (claim.airline_emails as AirlineEmail[]) ?? []
  const filtered = existing.filter(e => e.id !== id)

  const { error } = await db
    .from('claims')
    .update({ airline_emails: filtered, updated_at: new Date().toISOString() })
    .eq('token', token.toUpperCase())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
