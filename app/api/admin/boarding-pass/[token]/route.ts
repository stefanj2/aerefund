import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const { data: claim, error: claimError } = await db
    .from('claims')
    .select('boarding_pass_filename')
    .eq('token', token.toUpperCase())
    .single()

  if (claimError || !claim) {
    return NextResponse.json({ error: 'Claim niet gevonden' }, { status: 404 })
  }

  const filePath = claim.boarding_pass_filename
  if (!filePath || !filePath.includes('/')) {
    return NextResponse.json({ error: 'Geen boardingpass beschikbaar in opslag' }, { status: 404 })
  }

  const { data: signedData, error: signedError } = await db.storage
    .from('boardingpasses')
    .createSignedUrl(filePath, 3600)

  if (signedError || !signedData) {
    console.error('Signed URL error:', signedError)
    return NextResponse.json({ error: 'Kon geen download link aanmaken' }, { status: 500 })
  }

  return NextResponse.json({ url: signedData.signedUrl })
}
