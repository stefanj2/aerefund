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

  // Extra columns may not exist before migrations are run — query separately
  let hasIdCopy = false
  let hasCancellationNotice = false
  let hasDenialNotice = false
  const { data: extraData, error: extraErr } = await db
    .from('claims')
    .select('id_copy_filename, cancellation_notice_filename, denial_notice_filename')
    .eq('token', token)
    .single()
  if (!extraErr) {
    const extra = extraData as Record<string, unknown>
    hasIdCopy = !!extra?.id_copy_filename
    hasCancellationNotice = !!extra?.cancellation_notice_filename
    hasDenialNotice = !!extra?.denial_notice_filename
  }

  // Determine claim type and build dynamic required documents list
  const claimType = (data.flight_data as Record<string, unknown>)?.type as string ?? 'vertraagd'

  const baseDocs = [
    { id: 'iban', label: 'IBAN-rekeningnummer', hint: 'Waarop wij het nettobedrag overmaken', done: !!data.iban, isFile: false },
    { id: 'boarding_pass', label: 'Boardingpass of boekingsbevestiging', hint: 'Bewijs dat je op de vlucht zat', done: !!data.boarding_pass_filename, isFile: true },
    { id: 'id_copy', label: 'Kopie identiteitsbewijs', hint: 'Paspoort of rijbewijs', done: hasIdCopy, isFile: true },
  ]

  const extraDocs: typeof baseDocs = []
  if (claimType === 'geannuleerd') {
    extraDocs.push({ id: 'cancellation_notice', label: 'Annuleringsbevestiging', hint: 'Email of SMS van de airline over de annulering', done: hasCancellationNotice, isFile: true })
  }
  if (claimType === 'geweigerd') {
    extraDocs.push({ id: 'denial_notice', label: 'Bewijs instapweigering', hint: 'Document van de gate agent of airline', done: hasDenialNotice, isFile: true })
  }

  const requiredDocuments = [...baseDocs, ...extraDocs]

  return NextResponse.json({
    found: true,
    firstName: data.first_name,
    flight: data.flight_data,
    hasIban: !!data.iban,
    hasBoardingPass: !!data.boarding_pass_filename,
    hasIdCopy,
    claimType,
    requiredDocuments,
  })
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const token              = fd.get('token')                as string | null
    const iban               = fd.get('iban')                 as string | null
    const bpFile             = fd.get('boarding_pass')        as File   | null
    const idFile             = fd.get('id_copy')              as File   | null
    const cancellationFile   = fd.get('cancellation_notice')  as File   | null
    const denialFile         = fd.get('denial_notice')        as File   | null

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

    // Upload cancellation notice to Supabase Storage
    if (cancellationFile && cancellationFile.size > 0) {
      const ext = cancellationFile.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const path = `${token}/cancellation-notice.${ext}`
      const buf = Buffer.from(await cancellationFile.arrayBuffer())
      const { error: uploadErr } = await db.storage.from('boarding-passes').upload(path, buf, {
        contentType: cancellationFile.type || 'application/octet-stream',
        upsert: true,
      })
      if (!uploadErr) {
        const { error: updateErr } = await db
          .from('claims')
          .update({ cancellation_notice_filename: path, updated_at: new Date().toISOString() })
          .eq('token', token)
        if (updateErr) console.error('cancellation_notice_filename update error (migration needed?):', updateErr)
      }
    }

    // Upload denial notice to Supabase Storage
    if (denialFile && denialFile.size > 0) {
      const ext = denialFile.name.split('.').pop()?.toLowerCase() ?? 'bin'
      const path = `${token}/denial-notice.${ext}`
      const buf = Buffer.from(await denialFile.arrayBuffer())
      const { error: uploadErr } = await db.storage.from('boarding-passes').upload(path, buf, {
        contentType: denialFile.type || 'application/octet-stream',
        upsert: true,
      })
      if (!uploadErr) {
        const { error: updateErr } = await db
          .from('claims')
          .update({ denial_notice_filename: path, updated_at: new Date().toISOString() })
          .eq('token', token)
        if (updateErr) console.error('denial_notice_filename update error (migration needed?):', updateErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('aanvullen POST error:', err)
    return NextResponse.json({ success: false, error: 'Onverwachte fout' }, { status: 500 })
  }
}
