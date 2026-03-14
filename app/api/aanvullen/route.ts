import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ found: false })

  const db = getSupabase()
  if (!db) return NextResponse.json({ found: false })

  const { data, error } = await db
    .from('claims')
    .select('token, first_name, flight_data, iban, boarding_pass_filename')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ found: false })

  // id_copy_filename may not exist before the migration is run — query separately
  let hasIdCopy = false
  const { data: idData, error: idErr } = await db
    .from('claims')
    .select('id_copy_filename')
    .eq('token', token)
    .single()
  if (!idErr) hasIdCopy = !!(idData as Record<string, unknown>)?.id_copy_filename

  return NextResponse.json({
    found: true,
    firstName: data.first_name,
    flight: data.flight_data,
    hasIban: !!data.iban,
    hasBoardingPass: !!data.boarding_pass_filename,
    hasIdCopy,
  })
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const token    = fd.get('token')         as string | null
    const iban     = fd.get('iban')          as string | null
    const bpFile   = fd.get('boarding_pass') as File   | null
    const idFile   = fd.get('id_copy')       as File   | null

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token verplicht' }, { status: 400 })
    }

    const db = getSupabase()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database niet beschikbaar' }, { status: 500 })
    }

    // Upload boarding pass to Supabase Storage
    let bpPath: string | null = null
    if (bpFile && bpFile.size > 0) {
      const ext = bpFile.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const path = `${token}/boarding-pass.${ext}`
      const buf = Buffer.from(await bpFile.arrayBuffer())
      const { error } = await db.storage.from('boarding-passes').upload(path, buf, {
        contentType: bpFile.type || 'application/octet-stream',
        upsert: true,
      })
      if (!error) bpPath = path
    }

    // Upload ID copy to Supabase Storage
    let idPath: string | null = null
    if (idFile && idFile.size > 0) {
      const ext = idFile.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const path = `${token}/id-copy.${ext}`
      const buf = Buffer.from(await idFile.arrayBuffer())
      const { error } = await db.storage.from('boarding-passes').upload(path, buf, {
        contentType: idFile.type || 'application/octet-stream',
        upsert: true,
      })
      if (!error) idPath = path
    }

    // Main update: IBAN + boarding pass
    const mainUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (iban?.trim()) mainUpdate.iban = iban.trim().replace(/\s/g, '').toUpperCase()
    if (bpPath) mainUpdate.boarding_pass_filename = bpPath

    const { error: mainErr } = await db.from('claims').update(mainUpdate).eq('token', token)
    if (mainErr) {
      console.error('aanvullen main update error:', mainErr)
      return NextResponse.json({ success: false, error: 'Opslaan mislukt' }, { status: 500 })
    }

    // ID copy update — separate so a missing column (pre-migration) doesn't block IBAN/BP save
    if (idPath) {
      const { error: idErr } = await db
        .from('claims')
        .update({ id_copy_filename: idPath, updated_at: new Date().toISOString() })
        .eq('token', token)
      if (idErr) console.error('id_copy_filename update error (migration needed?):', idErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('aanvullen POST error:', err)
    return NextResponse.json({ success: false, error: 'Onverwachte fout' }, { status: 500 })
  }
}
