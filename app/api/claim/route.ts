import { NextRequest, NextResponse } from 'next/server'
import { supabase, generateToken } from '@/lib/supabase'

export const runtime = 'nodejs'

// POST — create a new claim record (called from /uitkomst when result loads)
// Body: { flightData, compensation, passengers }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = generateToken()

    const { error } = await supabase.from('claims').insert({
      token,
      status: 'result_viewed',
      flight_data: body.flightData,
      compensation: body.compensation,
      passengers: body.passengers,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true, token })
  } catch (err) {
    console.error('POST /api/claim error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// PATCH — update an existing claim (called during form steps)
// Body: { token, ...fields }
export async function PATCH(req: NextRequest) {
  try {
    const { token, ...fields } = await req.json()
    if (!token) return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })

    const { error } = await supabase
      .from('claims')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('token', token)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/claim error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// GET — fetch claim by token (called from /doorgaan to resume)
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')?.toUpperCase().replace(/\s/g, '')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  return NextResponse.json(data)
}
