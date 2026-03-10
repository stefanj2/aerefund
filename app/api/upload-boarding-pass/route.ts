import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const db = getSupabase()
    if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const token = formData.get('token') as string | null

    if (!file || !token) {
      return NextResponse.json({ error: 'Bestand en token zijn verplicht' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Bestand is te groot (max 10 MB)' }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Alleen PDF, JPG of PNG toegestaan' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const path = `${token.toUpperCase()}/${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error } = await db.storage
      .from('boardingpasses')
      .upload(path, bytes, { contentType: file.type, upsert: true })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'Upload mislukt: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, path })
  } catch (err) {
    console.error('upload-boarding-pass error:', err)
    return NextResponse.json({ error: 'Onverwachte fout' }, { status: 500 })
  }
}
