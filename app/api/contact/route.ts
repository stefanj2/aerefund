import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.FROM_EMAIL  ?? 'onboarding@resend.dev'
const ADMIN  = process.env.ADMIN_EMAIL ?? 'info@aerefund.com'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Vul alle verplichte velden in.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: `Aerefund Contact <${FROM}>`,
      to: ADMIN,
      replyTo: email,
      subject: `Contactformulier: ${subject || 'Geen onderwerp'} — ${name}`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:#0f1e3d;padding:20px 28px;">
            <h2 style="margin:0;color:#fff;font-size:16px;font-weight:700;">Nieuw contactbericht</h2>
          </div>
          <div style="padding:24px 28px;">
            <table cellpadding="0" cellspacing="0" style="width:100%">
              <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:100px;">Naam</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827;">${name}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#111827;">${email}</td></tr>
              <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Onderwerp</td><td style="padding:6px 0;font-size:13px;color:#111827;">${subject || '—'}</td></tr>
            </table>
            <hr style="margin:16px 0;border:none;border-top:1px solid #f3f4f6;" />
            <p style="font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Contact email error:', error)
      return NextResponse.json({ error: 'Verzenden mislukt.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Onverwachte fout.' }, { status: 500 })
  }
}
