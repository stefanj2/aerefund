import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, claim_type, iata_prefix, amount_per_person, is_manual } = body

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ ok: true }) // silently ignore invalid
    }

    const db = getSupabase()
    if (db) {
      await db.from('funnel_events').insert({
        event,
        claim_type:        claim_type        ?? null,
        iata_prefix:       iata_prefix       ?? null,
        amount_per_person: amount_per_person ?? null,
        is_manual:         is_manual         ?? null,
      })
    }
  } catch (err) {
    console.error('[track-funnel]', err)
  }

  return NextResponse.json({ ok: true })
}
