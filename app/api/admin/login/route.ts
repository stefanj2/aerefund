import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD?.trim()

    if (!expected || password.trim() !== expected) {
      return NextResponse.json({ error: 'Ongeldig wachtwoord' }, { status: 401 })
    }

    const token = Buffer.from(expected).toString('base64')
    const res = NextResponse.json({ success: true })
    res.cookies.set('aerefund_admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })
  }
}
