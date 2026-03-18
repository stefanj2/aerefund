import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export const runtime = 'nodejs'
const FROM   = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

function abandonedEmail(params: {
  firstName: string
  flightNumber: string
  airlineName: string
  amountPerPerson: number
  passengers: number
  token: string
}): string {
  const { firstName, flightNumber, airlineName, amountPerPerson, passengers, token } = params
  const total = amountPerPerson * passengers
  const totalFormatted = `€${total.toLocaleString('nl-NL')}`
  const resumeUrl = `https://aerefund.com/doorgaan?token=${token}`

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,30,61,0.08);">

      <!-- Header -->
      <tr><td style="background:#0f1e3d;padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><span style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.01em;">Aerefund</span></td>
          <td align="right"><span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.08em;text-transform:uppercase;">Claim hervatten</span></td>
        </tr></table>
      </td></tr>

      <!-- Hero -->
      <tr><td style="padding:40px 40px 28px;text-align:center;">
        <div style="width:56px;height:56px;background:#FFF7ED;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <span style="font-size:28px;">✈️</span>
        </div>
        <h1 style="margin:0 0 10px;font-size:24px;font-weight:800;color:#0f1e3d;letter-spacing:-0.02em;">
          ${firstName}, je claim wacht nog op je
        </h1>
        <p style="margin:0;font-size:15px;color:#4b5e82;line-height:1.6;max-width:420px;display:inline-block;">
          Je bent gestart met een claim voor vlucht <strong style="color:#0f1e3d;">${flightNumber}</strong>.
          ${airlineName} is jou nog <strong style="color:#0f1e3d;">${totalFormatted}</strong> schuldig — vul je gegevens af en wij halen het op.
        </p>
      </td></tr>

      <!-- Amount highlight -->
      <tr><td style="padding:0 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f1e3d,#1a3560);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:24px 28px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;">Jouw compensatierecht</p>
            <p style="margin:0;font-size:42px;font-weight:900;color:#fff;letter-spacing:-0.03em;">${totalFormatted}</p>
            ${passengers > 1 ? `<p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">${passengers} passagiers × €${amountPerPerson}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 40px 32px;text-align:center;">
        <a href="${resumeUrl}" style="display:inline-block;background:#FF6B2B;color:#fff;font-weight:800;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;">
          Claim nu afronden →
        </a>
        <p style="margin:14px 0 0;font-size:12px;color:#9CA3AF;">
          Of ga naar <a href="${resumeUrl}" style="color:#1a56db;text-decoration:none;">aerefund.com/doorgaan</a>
          en vul code <strong style="letter-spacing:0.08em;color:#374151;">${token}</strong> in
        </p>
      </td></tr>

      <!-- Steps -->
      <tr><td style="padding:0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border-radius:12px;border:1px solid #e8edf8;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.08em;">Wat nog nodig is</p>
            ${[
              ['Jouw naam en emailadres', '2 minuten'],
              ['Adresgegevens', '1 minuut'],
              ['Akkoord met voorwaarden', '30 seconden'],
            ].map(([label, time]) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="width:24px;vertical-align:top;padding-top:2px;">
                  <div style="width:16px;height:16px;background:#22C55E;border-radius:50%;text-align:center;line-height:16px;font-size:10px;color:#fff;font-weight:700;">✓</div>
                </td>
                <td style="padding-left:10px;font-size:13px;color:#0f1e3d;font-weight:500;">${label}</td>
                <td style="text-align:right;font-size:12px;color:#9CA3AF;">${time}</td>
              </tr>
            </table>`).join('')}
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f6fb;padding:22px 40px;border-top:1px solid #dde5f4;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;color:#8fa3be;">
          Vragen? Mail naar <a href="mailto:claim@aerefund.com" style="color:#1a56db;text-decoration:none;">claim@aerefund.com</a>
        </p>
        <p style="margin:0;font-size:11px;color:#b0bfd4;">
          © 2026 Aerefund.com · Je ontvangt dit omdat je een claim bent gestart ·
          <a href="https://aerefund.com/privacy" style="color:#b0bfd4;text-decoration:none;">Privacy</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const fourHoursAgo  = new Date(Date.now() - 4  * 60 * 60 * 1000).toISOString()
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  // Find abandoned claims: result_viewed OR claim_started (email filled in step 1 of form),
  // email known, 4–48h old, not yet emailed, not submitted
  const { data: abandoned, error } = await db
    .from('claims')
    .select('token, first_name, email, flight_data, compensation, passengers')
    .in('status', ['result_viewed', 'claim_started'])
    .not('email', 'is', null)
    .is('abandoned_email_sent_at', null)
    .is('submitted_at', null)
    .lt('updated_at', fourHoursAgo)
    .gt('updated_at', fortyEightHoursAgo)

  if (error) {
    console.error('Abandoned funnel query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!abandoned || abandoned.length === 0) {
    return NextResponse.json({ sent: 0, message: 'Geen verlaten claims gevonden.' })
  }

  let sent = 0
  const errors: string[] = []

  for (const claim of abandoned) {
    try {
      const flightData = claim.flight_data as Record<string, string | number> ?? {}
      const compensation = claim.compensation as { amountPerPerson?: number } ?? {}
      const flightNumber = (flightData.flightNumber as string) ?? 'je vlucht'
      const iataPrefix   = (flightData.iataPrefix as string) ?? ''
      const airlineName  = (flightData.airline as string) ?? iataPrefix ?? 'de airline'
      const amountPerPerson = compensation.amountPerPerson ?? 250
      const passengers   = claim.passengers ?? 1
      const firstName    = claim.first_name ?? 'reizigers'

      // Send email
      const { error: emailError } = await resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: claim.email,
        subject: `${firstName}, je claim voor vlucht ${flightNumber} wacht nog op je`,
        html: abandonedEmail({ firstName, flightNumber, airlineName, amountPerPerson, passengers, token: claim.token }),
      })

      if (emailError) {
        errors.push(`${claim.token}: ${emailError.message}`)
        continue
      }

      // Mark as sent
      await db
        .from('claims')
        .update({ abandoned_email_sent_at: new Date().toISOString() })
        .eq('token', claim.token)

      sent++
    } catch (err) {
      errors.push(`${claim.token}: ${String(err)}`)
    }
  }

  console.log(`Abandoned funnel: ${sent} emails sent, ${errors.length} errors`)
  return NextResponse.json({ sent, errors: errors.length > 0 ? errors : undefined })
}
