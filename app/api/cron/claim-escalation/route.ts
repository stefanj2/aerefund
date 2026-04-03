import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { getAirlineConfig, getAirlinePrefixFromFlightNumber } from '@/lib/airlines'

export const runtime = 'nodejs'

const FROM       = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'info@aerefund.com'
const LOGO_URL   = 'https://aerefund.com/logo-aerefund.png'

type Note = {
  id: string
  timestamp: string
  type: 'status_change' | 'note'
  text: string
  prev_status?: string
  new_status?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
}

function addNote(existing: Note[] | null, text: string): Note[] {
  const notes: Note[] = Array.isArray(existing) ? existing : []
  return [...notes, {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: 'note' as const,
    text,
  }]
}

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Airline reminder email templates ─────────────────────────────────────────

function airlineReminderHtml(p: {
  flightNumber: string
  flightDate: string
  passengerName: string
  token: string
  airlineName: string
  origin: string
  destination: string
  compensation: string
}, reminderType: 1 | 2 | 3): { subject: string; html: string; text: string } {
  const subject =
    reminderType === 1 ? `Herinnering compensatieverzoek — ${p.flightNumber}` :
    reminderType === 2 ? `Tweede aanmaning — ${p.flightNumber}` :
                         `Laatste sommatie — ${p.flightNumber}`

  const refLine = `Ons kenmerk: ${p.token} | Vlucht: ${p.flightNumber} | Datum: ${p.flightDate}`

  const bodyContent =
    reminderType === 1 ? `
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Geachte heer/mevrouw,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Op ${formatDate(p.flightDate)} hebben wij namens onze cli&euml;nt, ${p.passengerName}, een compensatieverzoek ingediend
        met betrekking tot vlucht <strong>${p.flightNumber}</strong> (${p.origin} &rarr; ${p.destination}).
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        De wettelijke reactietermijn van 14 dagen is inmiddels verstreken zonder dat wij een inhoudelijke reactie hebben ontvangen.
        Wij verzoeken u vriendelijk doch dringend om binnen <strong>14 dagen</strong> alsnog inhoudelijk te reageren op ons compensatieverzoek
        van <strong>${p.compensation}</strong>, conform Verordening (EG) nr. 261/2004.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Bij uitblijven van een reactie zullen wij genoodzaakt zijn verdere stappen te ondernemen.
      </p>`
    : reminderType === 2 ? `
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Geachte heer/mevrouw,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Dit is onze <strong>tweede aanmaning</strong> inzake het compensatieverzoek voor vlucht <strong>${p.flightNumber}</strong>
        (${p.origin} &rarr; ${p.destination}) d.d. ${formatDate(p.flightDate)}, namens ${p.passengerName}.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Op grond van <strong>artikel 7 van Verordening (EG) nr. 261/2004</strong> heeft onze cli&euml;nt recht op een compensatie van
        <strong>${p.compensation}</strong>. Ondanks eerdere correspondentie hebben wij tot op heden geen inhoudelijke reactie ontvangen.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Wij sommeren u om binnen <strong>14 dagen</strong> na dagtekening van dit bericht over te gaan tot betaling, dan wel een gemotiveerde
        afwijzing te verstrekken. Bij het uitblijven hiervan zullen wij de zaak voorleggen aan de <strong>Inspectie Leefomgeving en Transport (ILT)</strong>
        en/of een gerechtelijke procedure starten.
      </p>`
    : `
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Geachte heer/mevrouw,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Dit betreft onze <strong>laatste sommatie</strong> inzake het openstaande compensatieverzoek voor vlucht
        <strong>${p.flightNumber}</strong> (${p.origin} &rarr; ${p.destination}) d.d. ${formatDate(p.flightDate)}, namens ${p.passengerName}.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Ondanks herhaalde verzoeken hebben wij geen inhoudelijke reactie of betaling ontvangen. Op grond van
        <strong>Verordening (EG) nr. 261/2004, artikel 7</strong> is onze cli&euml;nt gerechtigd tot een compensatie van
        <strong>${p.compensation}</strong>.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Wij stellen u hierbij formeel in gebreke en delen u mede dat wij bij het uitblijven van betaling of een gemotiveerde
        afwijzing binnen <strong>14 dagen</strong> de zaak zullen voorleggen aan de
        <strong>Geschillencommissie Luchtvaart</strong> dan wel een gerechtelijke procedure zullen starten bij de bevoegde rechtbank.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;">
        Alle kosten die hieruit voortvloeien, inclusief griffierechten, buitengerechtelijke incassokosten en wettelijke rente,
        zullen op ${p.airlineName} worden verhaald.
      </p>`

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <h2 style="color:#111827;margin-top:0;font-size:18px;">${subject}</h2>

    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#6b7280;">
      ${refLine}
    </div>

    ${bodyContent}

    <p style="color:#374151;font-size:15px;line-height:1.7;">
      Hoogachtend,<br>
      <strong>Aerefund</strong><br>
      <span style="font-size:13px;color:#6b7280;">Keurenplein 24, 1069 CD Amsterdam<br>
      KvK 67332706 | claim@aerefund.com</span>
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:16px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;color:#9ca3af;font-size:12px;">
    <p style="margin:0;">Dit bericht is verzonden namens onze cli&euml;nt op basis van een ondertekende volmacht.</p>
  </div>
</div>
</body>
</html>`

  const text = [
    subject,
    '',
    refLine,
    '',
    'Geachte heer/mevrouw,',
    '',
    reminderType === 1
      ? `Op ${p.flightDate} hebben wij een compensatieverzoek ingediend voor vlucht ${p.flightNumber} namens ${p.passengerName}. De reactietermijn van 14 dagen is verstreken. Wij verzoeken u binnen 14 dagen inhoudelijk te reageren.`
      : reminderType === 2
      ? `Dit is onze tweede aanmaning inzake vlucht ${p.flightNumber}. Op grond van art. 7 Verordening (EG) nr. 261/2004 verzoeken wij u binnen 14 dagen tot betaling van ${p.compensation} over te gaan. Bij uitblijven volgen juridische stappen.`
      : `Laatste sommatie inzake vlucht ${p.flightNumber}. Bij uitblijven van betaling of reactie binnen 14 dagen leggen wij de zaak voor aan de Geschillencommissie Luchtvaart of de bevoegde rechtbank. Alle kosten worden op u verhaald.`,
    '',
    'Hoogachtend,',
    'Aerefund',
    'Keurenplein 24, 1069 CD Amsterdam',
    'KvK 67332706 | claim@aerefund.com',
  ].join('\n')

  return { subject, html, text }
}

// ─── Cron handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  const now = new Date()
  let remindersSent = 0
  let verjaringWarnings = 0
  const errors: string[] = []

  // ─── Part 1: Airline escalation reminders ─────────────────────────────────

  const { data: escalationClaims, error: escErr } = await db
    .from('claims')
    .select(`
      token, first_name, last_name, email, flight_data, compensation,
      claim_filed_at, notes,
      airline_reminder_1_sent_at,
      airline_reminder_2_sent_at,
      airline_reminder_3_sent_at
    `)
    .eq('status', 'claim_filed')
    .not('claim_filed_at', 'is', null)

  if (escErr) {
    console.error('Claim escalation query error:', escErr)
    return NextResponse.json({ error: escErr.message }, { status: 500 })
  }

  for (const claim of escalationClaims ?? []) {
    try {
      const days = daysSince(claim.claim_filed_at)
      const flightData = (claim.flight_data ?? {}) as Record<string, string>
      const flightNumber = flightData.flightNumber ?? ''
      const iataPrefix = flightData.iataPrefix ?? getAirlinePrefixFromFlightNumber(flightNumber)
      const airlineConfig = getAirlineConfig(iataPrefix)

      if (!airlineConfig.claimsEmail) {
        errors.push(`${claim.token}: geen claimsEmail voor ${iataPrefix}`)
        continue
      }

      // Determine which reminder to send
      let reminderType: 1 | 2 | 3 | null = null
      if (days >= 60 && !claim.airline_reminder_3_sent_at) {
        reminderType = 3
      } else if (days >= 30 && !claim.airline_reminder_2_sent_at) {
        reminderType = 2
      } else if (days >= 14 && !claim.airline_reminder_1_sent_at) {
        reminderType = 1
      }

      if (!reminderType) continue

      const passengerName = `${claim.first_name ?? ''} ${claim.last_name ?? ''}`.trim() || 'de passagier'
      const compensation = claim.compensation
        ? `€${typeof claim.compensation === 'number' ? claim.compensation : claim.compensation}`
        : 'de wettelijke compensatie'
      const origin = flightData.origin ?? ''
      const destination = flightData.destination ?? ''
      const flightDate = flightData.date ?? ''

      const { subject, html, text } = airlineReminderHtml({
        flightNumber,
        flightDate,
        passengerName,
        token: claim.token,
        airlineName: airlineConfig.fullName,
        origin,
        destination,
        compensation,
      }, reminderType)

      // Send reminder to airline
      const { error: emailError } = await resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: airlineConfig.claimsEmail,
        replyTo: `claim+${claim.token}@aerefund.com`,
        subject,
        html,
        text,
        headers: {
          'X-Entity-Ref-ID': `${claim.token}-airline-reminder-${reminderType}`,
        },
        tags: [
          { name: 'type', value: `airline_reminder_${reminderType}` },
        ],
      })

      if (emailError) {
        errors.push(`${claim.token} (r${reminderType}): ${emailError.message}`)
        continue
      }

      // Update claim with sent timestamp and note
      const updateField =
        reminderType === 1 ? 'airline_reminder_1_sent_at' :
        reminderType === 2 ? 'airline_reminder_2_sent_at' :
                             'airline_reminder_3_sent_at'

      const noteText =
        reminderType === 1 ? `Eerste herinnering verstuurd naar ${airlineConfig.claimsEmail}` :
        reminderType === 2 ? `Tweede aanmaning verstuurd naar ${airlineConfig.claimsEmail}` :
                             `Laatste sommatie verstuurd naar ${airlineConfig.claimsEmail}`

      await db
        .from('claims')
        .update({
          [updateField]: now.toISOString(),
          notes: addNote(claim.notes as Note[] | null, noteText),
          updated_at: now.toISOString(),
        })
        .eq('token', claim.token)

      // For reminder 3, also notify admin to escalate
      if (reminderType === 3) {
        await resend.emails.send({
          from: `Aerefund <${FROM}>`,
          to: ADMIN_EMAIL,
          subject: `Escalatie vereist — claim ${claim.token} (${flightNumber})`,
          html: `<p>De laatste sommatie voor claim <strong>${claim.token}</strong> (vlucht ${flightNumber}, ${airlineConfig.fullName}) is verstuurd.</p>
<p>Er is 60 dagen na de claimbrief geen reactie of betaling ontvangen. Onderneem actie:</p>
<ul>
<li>Dien klacht in bij de Geschillencommissie Luchtvaart</li>
<li>Of start gerechtelijke procedure</li>
</ul>
<p><a href="https://aerefund.com/admin/claims/${claim.token}">Bekijk dossier &rarr;</a></p>`,
          text: `Escalatie vereist — claim ${claim.token} (${flightNumber})\n\nDe laatste sommatie is verstuurd na 60 dagen zonder reactie.\nBekijk: https://aerefund.com/admin/claims/${claim.token}`,
        })
      }

      remindersSent++
    } catch (err) {
      errors.push(`${claim.token}: ${String(err)}`)
    }
  }

  // ─── Part 2: Verjaring check (statute of limitations) ────────────────────

  const { data: allActiveClaims, error: verErr } = await db
    .from('claims')
    .select('token, flight_data, verjaring_warned_at')
    .not('status', 'in', '("closed","won","compensation_paid")')

  if (verErr) {
    console.error('Verjaring query error:', verErr)
    // Don't fail the whole job, just log
    errors.push(`verjaring query: ${verErr.message}`)
  }

  for (const claim of allActiveClaims ?? []) {
    try {
      if (claim.verjaring_warned_at) continue

      const flightData = (claim.flight_data ?? {}) as Record<string, string>
      const flightDate = flightData.date
      if (!flightDate) continue

      const flightDateObj = new Date(flightDate)
      if (isNaN(flightDateObj.getTime())) continue

      // NL default verjaring: 3 years from flight date
      const verjaringDate = new Date(flightDateObj)
      verjaringDate.setFullYear(verjaringDate.getFullYear() + 3)

      const msRemaining = verjaringDate.getTime() - now.getTime()
      const daysRemaining = msRemaining / (1000 * 60 * 60 * 24)

      // Warn if less than 6 months (≈183 days) remaining
      if (daysRemaining > 0 && daysRemaining < 183) {
        const flightNumber = flightData.flightNumber ?? 'onbekend'

        await resend.emails.send({
          from: `Aerefund <${FROM}>`,
          to: ADMIN_EMAIL,
          subject: `Verjaring nadert — claim ${claim.token} (${flightNumber})`,
          html: `<p><strong>Let op:</strong> de verjaringstermijn voor claim <strong>${claim.token}</strong> (vlucht ${flightNumber}) nadert.</p>
<p>Vluchtdatum: ${formatDate(flightDate)}<br>
Verjaringsdatum: <strong>${formatDate(verjaringDate)}</strong><br>
Resterend: <strong>${Math.floor(daysRemaining)} dagen</strong></p>
<p>Onderneem tijdig actie om de verjaring te stuiten.</p>
<p><a href="https://aerefund.com/admin/claims/${claim.token}">Bekijk dossier &rarr;</a></p>`,
          text: `Verjaring nadert — claim ${claim.token} (${flightNumber})\nVluchtdatum: ${flightDate}\nVerjaringsdatum: ${formatDate(verjaringDate)}\nResterend: ${Math.floor(daysRemaining)} dagen\nBekijk: https://aerefund.com/admin/claims/${claim.token}`,
        })

        await db
          .from('claims')
          .update({ verjaring_warned_at: now.toISOString() })
          .eq('token', claim.token)

        verjaringWarnings++
      }
    } catch (err) {
      errors.push(`verjaring ${claim.token}: ${String(err)}`)
    }
  }

  console.log(`Claim escalation: ${remindersSent} reminders sent, ${verjaringWarnings} verjaring warnings, ${errors.length} errors`)
  return NextResponse.json({
    reminders_sent: remindersSent,
    verjaring_warnings: verjaringWarnings,
    errors: errors.length > 0 ? errors : undefined,
  })
}
