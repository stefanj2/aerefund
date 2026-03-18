import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export const runtime = 'nodejs'
const FROM = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'
const LOGO_URL = 'https://aerefund.com/logo-aerefund.png'

const CONTAINER = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'
const LOGO_HEADER = `<div style="background: #ffffff; padding: 24px 30px; border-radius: 12px 12px 0 0; border-bottom: 1px solid #e5e7eb; text-align: center;"><img src="${LOGO_URL}" alt="Aerefund" style="height: 64px; width: auto; display: block; margin: 0 auto;"></div>`
const BODY_OPEN = 'background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;'
const FOOTER = 'background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;'
const ORANGE_BOX = 'background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;'
const P = 'color: #4b5563; font-size: 16px; line-height: 1.6;'
const H2 = 'color: #111827; margin-top: 0;'

function preheader(text: string) {
  const pad = '\u200C\u00A0'.repeat(60)
  return `<span style="display:none;font-size:1px;color:#f3f4f6;max-height:0;overflow:hidden;opacity:0;">${text}${pad}</span>`
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json() as { token: string }
    if (!token) return NextResponse.json({ error: 'Token vereist' }, { status: 400 })

    const db = getSupabase()
    if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

    const { data: claim, error } = await db
      .from('claims')
      .select('token, first_name, email, flight_data')
      .eq('token', token.toUpperCase())
      .single()

    if (error || !claim) {
      return NextResponse.json({ error: 'Claim niet gevonden' }, { status: 404 })
    }

    const firstName = claim.first_name ?? 'passagier'
    const customerEmail = claim.email
    if (!customerEmail) {
      return NextResponse.json({ error: 'Geen e-mailadres bekend voor deze claim' }, { status: 422 })
    }

    const flight = claim.flight_data as { flightNumber?: string; airline?: string } | null
    const flightNumber = flight?.flightNumber ?? '—'
    const airlineName = flight?.airline ?? 'de airline'
    const url = `https://aerefund.com/aanvullen?token=${encodeURIComponent(claim.token)}`

    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Herinnering: documenten uploaden — Aerefund</title>
</head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
${preheader(`Herinnering: upload je IBAN, boardingpass en identiteitsbewijs voor claim ${claim.token}.`)}
<div style="${CONTAINER}">
  ${LOGO_HEADER}
  <div style="${BODY_OPEN}">
    <h2 style="${H2}">Herinnering: nog documenten nodig</h2>
    <p style="${P}">Beste ${firstName},</p>
    <p style="${P}">
      We herinneren je eraan dat we voor jouw claim voor vlucht <strong>${flightNumber}</strong>
      bij <strong>${airlineName}</strong> nog een paar gegevens nodig hebben.
    </p>
    <div style="${ORANGE_BOX}">
      <p style="margin: 0 0 14px; color: #9a3412; font-weight: 700; font-size: 15px;">Wat hebben wij nodig?</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;"><strong style="color: #7c2d12;">1. IBAN-rekeningnummer</strong><br>Waarop wij het nettobedrag overmaken</td></tr>
        <tr><td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;"><strong style="color: #7c2d12;">2. Boardingpass of boekingsbevestiging</strong><br>Bewijs dat je op vlucht ${flightNumber} zat</td></tr>
        <tr><td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;"><strong style="color: #7c2d12;">3. Kopie identiteitsbewijs</strong><br>Paspoort of rijbewijs</td></tr>
      </table>
    </div>
    <div style="text-align: center; margin: 28px 0 8px;">
      <a href="${url}" style="display:inline-block; background:#FF6B2B; color:#fff; font-weight:700; font-size:16px; padding:14px 36px; border-radius:8px; text-decoration:none;">
        Gegevens uploaden &rarr;
      </a>
      <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">Veilig &middot; duurt minder dan 2 minuten &middot; link blijft geldig</p>
    </div>
    <p style="${P}">
      Vragen? Reply op deze email of stuur naar
      <a href="mailto:claim@aerefund.com" style="color: #FF6B2B; text-decoration: none; font-weight: 600;">claim@aerefund.com</a>.
    </p>
    <p style="${P}">Met vriendelijke groet,<br><strong>Team Aerefund</strong></p>
  </div>
  <div style="${FOOTER}">
    <p style="margin: 0; font-weight: 600; color: #374151;">Aerefund</p>
    <p style="margin: 6px 0 0;">Keurenplein 24, 1069 CD Amsterdam &middot; KvK 67332706</p>
  </div>
</div>
</body>
</html>`

    const text = [
      `Herinnering: upload je documenten voor claim ${claim.token}`,
      ``,
      `Beste ${firstName},`,
      ``,
      `We herinneren je eraan dat we voor claim ${claim.token} (vlucht ${flightNumber} bij ${airlineName}) nog nodig hebben:`,
      `1. IBAN-rekeningnummer`,
      `2. Boardingpass of boekingsbevestiging`,
      `3. Kopie identiteitsbewijs`,
      ``,
      `Upload via: ${url}`,
      ``,
      `Vragen? claim@aerefund.com`,
      ``,
      `Team Aerefund`,
    ].join('\n')

    const { error: sendError } = await resend.emails.send({
      from: `Aerefund <${FROM}>`,
      to: customerEmail,
      replyTo: 'claim@aerefund.com',
      subject: `Herinnering: documenten uploaden voor claim ${claim.token}`,
      html,
      text,
      headers: {
        'List-Unsubscribe': '<mailto:claim@aerefund.com?subject=unsubscribe>',
        'X-Entity-Ref-ID': `${claim.token}-aanvullen-reminder`,
      },
      tags: [{ name: 'type', value: 'aanvullen_reminder' }],
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return NextResponse.json({ error: 'Versturen mislukt: ' + sendError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, sentTo: customerEmail })
  } catch (err) {
    console.error('resend-aanvullen error:', err)
    return NextResponse.json({ error: 'Onverwachte fout' }, { status: 500 })
  }
}
