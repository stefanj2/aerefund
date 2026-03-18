import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export const runtime = 'nodejs'
const FROM   = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

// ─── Timing (days between each step) ──────────────────────────────────────────
// invoice sent → reminder 1:  +3 days  (based on submitted_at)
// reminder 1   → reminder 2:  +7 days
// reminder 2   → reminder 3:  +6 days
const DAYS_TO_R1 = 3
const DAYS_R1_TO_R2 = 7
const DAYS_R2_TO_R3 = 6

const LOGO_URL = 'https://aerefund.com/logo-aerefund.png'

function daysFromNow(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function dueDateFormatted(submittedAt: Date): string {
  return daysFromNow(new Date(submittedAt), 14).toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Email templates ───────────────────────────────────────────────────────────

type ReminderParams = {
  firstName: string
  invoiceNumber: string
  flightNumber: string
  airlineName: string
  submittedAt: Date
  payUrl: string
}

function reminderEmail(p: ReminderParams, type: 1 | 2 | 3): { html: string; text: string } {
  const dueDate = dueDateFormatted(p.submittedAt)
  const pastDue = type === 3

  const subject =
    type === 1 ? `Herinnering: servicenota ${p.invoiceNumber} staat open` :
    type === 2 ? `Servicenota ${p.invoiceNumber} — vervaldatum nadert` :
                 `Laatste aanmaning: servicenota ${p.invoiceNumber}`

  const headline =
    type === 1 ? `Kleine herinnering, ${p.firstName}` :
    type === 2 ? `Vervaldatum nadert, ${p.firstName}` :
                 `Laatste aanmaning, ${p.firstName}`

  const body =
    type === 1
      ? `We hebben nog geen betaling ontvangen voor servicenota <strong>${p.invoiceNumber}</strong> (€ 42,00). Geen probleem — je kunt eenvoudig betalen via de knop hieronder.`
      : type === 2
      ? `De vervaldatum van servicenota <strong>${p.invoiceNumber}</strong> is <strong>${dueDate}</strong>. Om incasso te voorkomen vragen we je de nota voor die datum te voldoen.`
      : `Servicenota <strong>${p.invoiceNumber}</strong> is op <strong>${dueDate}</strong> verlopen. Dit is onze laatste herinnering. Neem contact op via <a href="mailto:claim@aerefund.com" style="color:#FF6B2B;text-decoration:none;">claim@aerefund.com</a> als je een betalingsregeling wilt treffen.`

  const badgeBg    = pastDue ? '#fef2f2' : type === 2 ? '#fff7ed' : '#f0fdf4'
  const badgeBorder = pastDue ? '#fecaca' : type === 2 ? '#fed7aa' : '#bbf7d0'
  const badgeColor  = pastDue ? '#dc2626' : type === 2 ? '#c2410c' : '#15803d'
  const badgeLabel  = pastDue ? 'Verlopen' : type === 2 ? 'Vervaldatum nadert' : 'Openstaand'

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:20px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px;">

  <!-- Logo -->
  <div style="background:#ffffff;padding:24px 30px;border-radius:12px 12px 0 0;border-bottom:1px solid #e5e7eb;text-align:center;">
    <img src="${LOGO_URL}" alt="Aerefund" style="height:64px;width:auto;display:block;margin:0 auto;">
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:30px;border:1px solid #e5e7eb;border-top:none;">

    <!-- Status badge -->
    <div style="display:inline-block;background:${badgeBg};border:1px solid ${badgeBorder};border-radius:99px;padding:5px 14px;margin-bottom:20px;">
      <span style="font-size:13px;font-weight:700;color:${badgeColor};">${badgeLabel}</span>
    </div>

    <h2 style="color:#111827;margin-top:0;">${headline}</h2>

    <p style="color:#4b5563;font-size:16px;line-height:1.6;">${body}</p>

    <!-- Invoice summary -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="color:#9ca3af;padding:4px 0;">Factuurnummer</td>
          <td style="color:#111827;font-weight:700;text-align:right;letter-spacing:0.04em;">${p.invoiceNumber}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;padding:4px 0;">Vlucht</td>
          <td style="color:#374151;text-align:right;">${p.flightNumber}${p.airlineName ? ` · ${p.airlineName}` : ''}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;padding:4px 0;">${pastDue ? 'Verlopen op' : 'Te voldoen voor'}</td>
          <td style="color:#374151;font-weight:600;text-align:right;">${dueDate}</td>
        </tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="color:#111827;font-weight:700;font-size:16px;padding:10px 0 4px;">Bedrag</td>
          <td style="color:#111827;font-weight:800;font-size:17px;text-align:right;padding:10px 0 4px;">€ 42,00</td>
        </tr>
      </table>
    </div>

    <!-- CTA button -->
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${p.payUrl}"
         style="display:inline-block;background:#FF6B2B;color:#fff;font-weight:700;font-size:16px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
        Betaal nu &mdash; &euro;&thinsp;42,00
      </a>
      <p style="margin:10px 0 0;font-size:12px;color:#9ca3af;">
        Veilig via bunq.me &middot; iDEAL &middot; creditcard
      </p>
    </div>

    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Vragen? Mail naar
      <a href="mailto:claim@aerefund.com" style="color:#FF6B2B;text-decoration:none;font-weight:600;">claim@aerefund.com</a>.
    </p>

    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
      Met vriendelijke groet,<br>
      <strong>Team Aerefund</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:20px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;color:#6b7280;font-size:14px;">
    <p style="margin:0;font-weight:600;color:#374151;">Aerefund</p>
    <p style="margin:6px 0 0;">Keurenplein 24, 1069 CD Amsterdam</p>
    <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">
      KvK 67332706 &middot;
      <a href="https://aerefund.com/privacy" style="color:#9ca3af;">Privacy</a> &middot;
      <a href="https://aerefund.com/algemene-voorwaarden" style="color:#9ca3af;">Voorwaarden</a>
    </p>
    <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">
      Dit is een transactionele email naar aanleiding van je ingediende compensatieclaim.
    </p>
  </div>
</div>
</body>
</html>`

  const text = [
    subject,
    '',
    `Beste ${p.firstName},`,
    '',
    type === 1
      ? `We hebben nog geen betaling ontvangen voor servicenota ${p.invoiceNumber} (€ 42,00).`
      : type === 2
      ? `De vervaldatum van servicenota ${p.invoiceNumber} is ${dueDate}. Graag voor die datum voldoen.`
      : `Servicenota ${p.invoiceNumber} is verlopen op ${dueDate}. Dit is onze laatste herinnering.`,
    '',
    `Factuurnummer : ${p.invoiceNumber}`,
    `Vlucht        : ${p.flightNumber}`,
    `Bedrag        : € 42,00`,
    `Vervaldatum   : ${dueDate}`,
    '',
    `Betaal via: ${p.payUrl}`,
    '',
    `Vragen? claim@aerefund.com`,
    '',
    `Met vriendelijke groet,`,
    `Team Aerefund`,
  ].join('\n')

  return { html, text }
}

// ─── Cron handler ──────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  // Fetch all submitted, unpaid claims that have an email address
  const { data: claims, error } = await db
    .from('claims')
    .select(`
      token, first_name, email, flight_data, invoice_number, submitted_at,
      payment_reminder_1_sent_at,
      payment_reminder_2_sent_at,
      payment_reminder_3_sent_at
    `)
    .eq('status', 'submitted')
    .neq('payment_status', 'paid')
    .not('email', 'is', null)
    .not('submitted_at', 'is', null)

  if (error) {
    console.error('Payment reminders query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!claims || claims.length === 0) {
    return NextResponse.json({ sent: 0, message: 'Geen openstaande claims gevonden.' })
  }

  const now = new Date()
  let sent = 0
  const errors: string[] = []

  for (const claim of claims) {
    try {
      const submittedAt = new Date(claim.submitted_at)
      const r1SentAt    = claim.payment_reminder_1_sent_at ? new Date(claim.payment_reminder_1_sent_at) : null
      const r2SentAt    = claim.payment_reminder_2_sent_at ? new Date(claim.payment_reminder_2_sent_at) : null
      const r3SentAt    = claim.payment_reminder_3_sent_at ? new Date(claim.payment_reminder_3_sent_at) : null

      // Determine which reminder is next, chaining relative to previous sent_at
      let reminderType: 1 | 2 | 3 | null = null
      if (!r1SentAt && now >= daysFromNow(submittedAt, DAYS_TO_R1)) {
        reminderType = 1
      } else if (r1SentAt && !r2SentAt && now >= daysFromNow(r1SentAt, DAYS_R1_TO_R2)) {
        reminderType = 2
      } else if (r2SentAt && !r3SentAt && now >= daysFromNow(r2SentAt, DAYS_R2_TO_R3)) {
        reminderType = 3
      }

      if (!reminderType) continue

      const flightData   = (claim.flight_data as Record<string, string>) ?? {}
      const flightNumber = flightData.flightNumber ?? 'je vlucht'
      const iataPrefix   = flightData.iataPrefix ?? ''
      const airlineName  = flightData.airline ?? iataPrefix ?? ''
      const invoiceNumber = claim.invoice_number ?? claim.token ?? ''
      const firstName    = claim.first_name ?? 'reizigers'

      const payUrl = `https://aerefund.com/betalen?ref=${encodeURIComponent(invoiceNumber)}&naam=${encodeURIComponent(firstName)}&vlucht=${encodeURIComponent(flightNumber)}&airline=${encodeURIComponent(airlineName)}`

      const { html, text } = reminderEmail(
        { firstName, invoiceNumber, flightNumber, airlineName, submittedAt, payUrl },
        reminderType,
      )

      const subject =
        reminderType === 1 ? `Herinnering: servicenota ${invoiceNumber} staat open` :
        reminderType === 2 ? `Servicenota ${invoiceNumber} — vervaldatum nadert` :
                             `Laatste aanmaning: servicenota ${invoiceNumber}`

      const { error: emailError } = await resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: claim.email,
        replyTo: 'claim@aerefund.com',
        subject,
        html,
        text,
        headers: {
          'List-Unsubscribe': '<mailto:claim@aerefund.com?subject=unsubscribe>',
          'X-Entity-Ref-ID': `${invoiceNumber}-reminder-${reminderType}`,
        },
        tags: [
          { name: 'type', value: `payment_reminder_${reminderType}` },
        ],
      })

      if (emailError) {
        errors.push(`${claim.token} (r${reminderType}): ${emailError.message}`)
        continue
      }

      // Record which reminder was sent
      const updateField =
        reminderType === 1 ? 'payment_reminder_1_sent_at' :
        reminderType === 2 ? 'payment_reminder_2_sent_at' :
                             'payment_reminder_3_sent_at'

      await db
        .from('claims')
        .update({ [updateField]: now.toISOString() })
        .eq('token', claim.token)

      sent++
    } catch (err) {
      errors.push(`${claim.token}: ${String(err)}`)
    }
  }

  console.log(`Payment reminders: ${sent} sent, ${errors.length} errors`)
  return NextResponse.json({ sent, errors: errors.length > 0 ? errors : undefined })
}
