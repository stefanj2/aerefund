import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { AIRLINES } from '@/lib/airlines'
import { resend } from '@/lib/resend'
import { generateConsentPdf, type ConsentClaim } from '@/lib/consent-pdf'

export const runtime = 'nodejs'
const FROM = 'claim@aerefund.com'

type Note = {
  id: string
  timestamp: string
  type: 'status_change' | 'note'
  text: string
  prev_status?: string
  new_status?: string
}

type CoPassenger = { firstName?: string; lastName?: string; email?: string }

function claimTypeText(type: string | undefined, delayMinutes: number): { grond: string; reden: string } {
  switch (type) {
    case 'cancelled':
      return {
        grond: 'annulering van de vlucht',
        reden: 'Op grond van <strong>Verordening (EG) 261/2004, artikel 5</strong> hebben de passagiers recht op compensatie wegens annulering van bovengenoemde vlucht.',
      }
    case 'denied':
      return {
        grond: 'instapweigering (denied boarding)',
        reden: 'Op grond van <strong>Verordening (EG) 261/2004, artikel 4</strong> hebben de passagiers recht op compensatie wegens instapweigering op bovengenoemde vlucht.',
      }
    default:
      return {
        grond: `vertraging van meer dan 3 uur bij aankomst (${Math.round(delayMinutes / 60 * 10) / 10} uur)`,
        reden: 'Op grond van <strong>Verordening (EG) 261/2004, artikel 7</strong> hebben de passagiers recht op compensatie wegens een vertraging van meer dan 3 uur bij aankomst op de eindbestemming.',
      }
  }
}

function buildClaimbrief(claim: Record<string, unknown>) {
  const flight = (claim.flight_data ?? {}) as Record<string, unknown>
  const comp   = (claim.compensation ?? {}) as Record<string, unknown>

  const airlineName  = (flight.airline      as string) ?? 'de luchtvaartmaatschappij'
  const flightNumber = (flight.flightNumber as string) ?? 'onbekend'
  const flightDate   = (flight.date         as string) ?? 'onbekend'
  const origin       = (flight.origin       as string) ?? '?'
  const destination  = (flight.destination  as string) ?? '?'
  const delayMinutes = (flight.delayMinutes as number) ?? 0
  const delayHours   = Math.round((delayMinutes / 60) * 10) / 10
  const claimType    = (flight.type         as string) ?? 'delay'

  const amountPP    = (comp.amountPerPerson as number) ?? 250
  const passengers  = (claim.passengers     as number) ?? 1
  const totalAmount = amountPP * passengers

  const firstName   = (claim.first_name  as string) ?? ''
  const lastName    = (claim.last_name   as string) ?? ''
  const fullName    = `${firstName} ${lastName}`.trim()
  const address     = (claim.address     as string) ?? ''
  const postalCode  = (claim.postal_code as string) ?? ''
  const city        = (claim.city        as string) ?? ''
  const token       = (claim.token       as string) ?? ''

  const coPassengers: CoPassenger[] = Array.isArray(claim.co_passengers)
    ? (claim.co_passengers as CoPassenger[])
    : []

  // All passenger names (main + co-passengers)
  const allPassengerNames = [
    fullName,
    ...coPassengers
      .map(p => `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim())
      .filter(n => n.length > 0),
  ]

  const { grond, reden } = claimTypeText(claimType, delayMinutes)

  const claimDate = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const aerefundIban = process.env.AEREFUND_IBAN ?? '[IBAN AEREFUND]'

  const subject = `Claimbrief EC 261/2004 — Vlucht ${flightNumber} d.d. ${flightDate} — Ref: ${token}`

  // Plain text
  const cedentLine = allPassengerNames.length > 1
    ? `de passagiers ${allPassengerNames.join(', ')}`
    : `de heer/mevrouw ${fullName}`

  const text = [
    'AEREFUND.NL / GOODBYEGURU BV',
    'Keurenplein 24, 1069 CD Amsterdam',
    'KvK: 67332706',
    'claim@aerefund.com',
    '',
    ...(address || postalCode || city ? [
      `Passagier: ${fullName}`,
      ...(address ? [address] : []),
      ...((postalCode || city) ? [`${postalCode} ${city}`.trim()] : []),
      '',
    ] : []),
    `Datum: ${claimDate}`,
    `Referentie: ${token}`,
    '',
    `Aan: ${airlineName}`,
    `Betreft: Vorderingsoverdracht (cessie) en formele claimbrief op grond van Verordening (EG) 261/2004`,
    `Vlucht: ${flightNumber} | ${origin} → ${destination} | ${flightDate}`,
    '',
    'Geachte heer/mevrouw,',
    '',
    `Aerefund.nl (GoodbyeGuru BV, hierna "Aerefund") deelt u mede dat zij als cessionaris de vordering van ${cedentLine} (hierna "cedent(en)") op uw maatschappij heeft overgenomen op grond van artikel 3:94 Burgerlijk Wetboek. De overdracht is geschied door middel van een elektronische akte, waarbij de cedent(en) via het Aerefund-platform uitdrukkelijk hebben ingestemd met de vorderingsoverdracht. Aerefund is met ingang van de datum van cessie de rechthebbende en verzoekt u betaling uitsluitend aan Aerefund te verrichten.`,
    '',
    'VLUCHTGEGEVENS',
    `Vluchtnummer:   ${flightNumber}`,
    `Route:          ${origin} → ${destination}`,
    `Geplande datum: ${flightDate}`,
    ...(delayMinutes > 0 ? [`Vertraging:     ${delayMinutes} minuten (${delayHours} uur)`] : []),
    '',
    'PASSAGIERS',
    ...allPassengerNames.map((n, i) => `  ${i + 1}. ${n}`),
    '',
    'VORDERING',
    `Grondslag: ${grond}`,
    `Op grond van Verordening (EG) 261/2004 hebben de passagiers recht op compensatie wegens bovenstaande ${grond}.`,
    '',
    `Compensatie per passagier: €${amountPP}`,
    `Aantal passagiers:         ${passengers}`,
    `Totaalbedrag vordering:    €${totalAmount}`,
    '',
    `Wij verzoeken u vriendelijk doch dringend het totaalbedrag van €${totalAmount} binnen 14 dagen na dagtekening van deze brief over te maken op:`,
    '',
    `  Rekeninghouder: GoodbyeGuru BV (Aerefund.nl)`,
    `  IBAN:           ${aerefundIban}`,
    `  O.v.v.:         ${token} / ${flightNumber}`,
    '',
    'Mocht u van mening zijn dat er sprake is van buitengewone omstandigheden als bedoeld in artikel 5 lid 3 van Verordening (EG) 261/2004, verzoeken wij u dit schriftelijk en met bewijs te onderbouwen binnen dezelfde termijn.',
    '',
    'Bij niet-tijdige betaling behouden wij ons het recht voor verdere (juridische) stappen te ondernemen, waaronder inschakeling van de toezichthouder (ILT) en/of gerechtelijke incasso.',
    '',
    'Met vriendelijke groet,',
    '',
    'Aerefund.nl — GoodbyeGuru BV',
    'claim@aerefund.com',
  ].join('\n')

  // HTML
  const passengerAddressBlock = (address || postalCode || city) ? `
<div style="margin-bottom: 20px; padding: 12px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 12px; color: #555;">
  <strong>${fullName}</strong><br>
  ${address ? `${address}<br>` : ''}
  ${(postalCode || city) ? `${postalCode} ${city}`.trim() : ''}
</div>` : ''

  const passengerListHtml = allPassengerNames.length > 1
    ? `<ul style="margin: 8px 0 0; padding-left: 20px; font-size: 13px;">${allPassengerNames.map(n => `<li>${n}</li>`).join('')}</ul>`
    : `<p style="margin: 4px 0 0; font-size: 13px;">${fullName}</p>`

  const cedentHtml = allPassengerNames.length > 1
    ? `de passagiers <strong>${allPassengerNames.join(', ')}</strong>`
    : `de heer/mevrouw <strong>${fullName}</strong>`

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Georgia, serif; font-size: 14px; line-height: 1.8; color: #1a1a1a; max-width: 680px; margin: 0 auto; padding: 40px 24px; }
  .header { border-bottom: 3px solid #0D1B2A; padding-bottom: 20px; margin-bottom: 28px; }
  .logo { font-family: Arial, sans-serif; font-size: 20px; font-weight: 900; color: #0D1B2A; letter-spacing: -0.5px; }
  .logo span { color: #FF6B2B; }
  .meta { font-size: 11px; color: #777; margin-top: 4px; }
  .label { font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 0.06em; }
  h2 { font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; color: #0D1B2A; margin: 24px 0 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
  table.data { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table.data td { padding: 4px 8px; font-size: 13px; vertical-align: top; }
  table.data td:first-child { color: #777; width: 200px; }
  .highlight { background: #F0F4FF; border: 1px solid #C7D7FC; border-radius: 6px; padding: 14px 18px; margin: 18px 0; }
  .amount { font-size: 22px; font-weight: 700; color: #0D1B2A; }
  .iban-box { background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 6px; padding: 14px 18px; margin: 14px 0; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.9; }
  .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #999; }
  p { margin: 0 0 14px; }
</style>
</head>
<body>

<div class="header">
  <div class="logo">Aere<span>fund</span>.nl</div>
  <div class="meta">GoodbyeGuru BV &bull; Keurenplein 24, 1069 CD Amsterdam &bull; KvK 67332706 &bull; claim@aerefund.com</div>
</div>

${passengerAddressBlock}

<p>
  <span class="label">Datum</span><br><strong>${claimDate}</strong>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <span class="label">Referentie</span><br><code>${token}</code>
</p>

<p><span class="label">Aan</span><br><strong>${airlineName}</strong></p>

<p>
  <strong>Betreft: Vorderingsoverdracht (cessie) en formele claimbrief op grond van Verordening (EG) 261/2004</strong><br>
  Vlucht ${flightNumber} &mdash; ${origin} &rarr; ${destination} &mdash; ${flightDate}
</p>

<p>Geachte heer/mevrouw,</p>

<p>Aerefund.nl (GoodbyeGuru BV, hierna &ldquo;Aerefund&rdquo;) deelt u mede dat zij als <strong>cessionaris</strong> de vordering van ${cedentHtml} (hierna &ldquo;cedent(en)&rdquo;) op uw maatschappij heeft overgenomen op grond van <strong>artikel 3:94 Burgerlijk Wetboek</strong>. De overdracht is geschied door middel van een elektronische akte, waarbij de cedent(en) via het Aerefund-platform uitdrukkelijk hebben ingestemd met de vorderingsoverdracht. Aerefund is met ingang van de datum van cessie de rechthebbende en verzoekt u betaling <strong>uitsluitend aan Aerefund</strong> te verrichten.</p>

<h2>Vluchtgegevens</h2>
<table class="data">
  <tr><td>Vluchtnummer</td><td><strong>${flightNumber}</strong></td></tr>
  <tr><td>Route</td><td>${origin} &rarr; ${destination}</td></tr>
  <tr><td>Datum</td><td>${flightDate}</td></tr>
  ${delayMinutes > 0 ? `<tr><td>Vertraging</td><td>${delayMinutes} minuten (${delayHours} uur)</td></tr>` : ''}
</table>

<h2>Passagiers</h2>
${passengerListHtml}

<h2>Vordering</h2>
${reden}

<div class="highlight">
  <table class="data" style="margin:0;">
    <tr><td>Compensatie per passagier</td><td>&euro;${amountPP}</td></tr>
    <tr><td>Aantal passagiers</td><td>${passengers}</td></tr>
    <tr><td style="padding-top:8px;"><strong>Totaalbedrag vordering</strong></td><td style="padding-top:8px;" class="amount">&euro;${totalAmount}</td></tr>
  </table>
</div>

<p>Wij verzoeken u vriendelijk doch dringend het totaalbedrag van <strong>&euro;${totalAmount}</strong> binnen <strong>14 dagen</strong> na dagtekening van deze brief over te maken op:</p>

<div class="iban-box">
  <strong>Rekeninghouder:</strong> GoodbyeGuru BV (Aerefund.nl)<br>
  <strong>IBAN:</strong> ${aerefundIban}<br>
  <strong>O.v.v.:</strong> ${token} / ${flightNumber}
</div>

<p>Mocht u van mening zijn dat er sprake is van buitengewone omstandigheden als bedoeld in artikel 5 lid 3 van Verordening (EG) 261/2004, verzoeken wij u dit schriftelijk en met bewijs te onderbouwen binnen dezelfde termijn.</p>

<p>Bij niet-tijdige betaling behouden wij ons het recht voor verdere (juridische) stappen te ondernemen, waaronder inschakeling van de toezichthouder (ILT) en/of gerechtelijke incasso.</p>

<p>Met vriendelijke groet,</p>
<p><strong>Aerefund.nl &mdash; GoodbyeGuru BV</strong><br>claim@aerefund.com</p>

<div class="footer">
  Dit bericht is verzonden namens de cedent(en) na vorderingsoverdracht conform art. 3:94 BW.
  Aerefund.nl is cessionaris en enig rechthebbende op bovengenoemde vordering.
</div>

</body>
</html>`

  return { subject, html, text }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token verplicht' }, { status: 400 })
    }

    const db = getSupabase()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database niet beschikbaar' }, { status: 500 })
    }

    // Fetch claim
    const { data: claim, error: fetchErr } = await db
      .from('claims')
      .select('*')
      .eq('token', token.toUpperCase())
      .single()

    if (fetchErr || !claim) {
      return NextResponse.json({ success: false, error: 'Claim niet gevonden' }, { status: 404 })
    }

    // Determine airline claims email
    const flight      = (claim.flight_data ?? {}) as Record<string, unknown>
    const iataPrefix  = (flight.iataPrefix  as string) ??
                        (flight.flightNumber as string ?? '').replace(/\d.*$/, '')
    const airlineConf = AIRLINES[iataPrefix]
    const toEmail     = airlineConf?.claimsEmail

    if (!toEmail) {
      return NextResponse.json(
        { success: false, error: `Geen claims e-mailadres geconfigureerd voor airline "${iataPrefix}". Voeg claimsEmail toe in lib/airlines.ts.` },
        { status: 422 }
      )
    }

    // Build the letter
    const { subject, html, text } = buildClaimbrief(claim as unknown as Record<string, unknown>)

    // Fetch attachments from Supabase Storage
    type Attachment = { filename: string; content: Buffer }
    const attachments: Attachment[] = []

    // Consent PDF — always generated
    try {
      const consentPdf = await generateConsentPdf(claim as unknown as ConsentClaim)
      attachments.push({ filename: `akkoordverklaring-${token}.pdf`, content: consentPdf })
    } catch (pdfErr) {
      console.warn('send-letter: consent PDF generation failed:', pdfErr)
    }

    const bpPath = claim.boarding_pass_filename as string | null
    if (bpPath) {
      const { data: bpData, error: bpErr } = await db.storage
        .from('boardingpasses')
        .download(bpPath)
      if (!bpErr && bpData) {
        const ext = bpPath.split('.').pop() ?? 'pdf'
        attachments.push({
          filename: `boardingpass-${token}.${ext}`,
          content:  Buffer.from(await bpData.arrayBuffer()),
        })
      } else if (bpErr) {
        console.warn('send-letter: boardingpass download failed:', bpErr.message)
      }
    }

    const idPath = (claim as Record<string, unknown>).id_copy_filename as string | null
    if (idPath) {
      const { data: idData, error: idErr } = await db.storage
        .from('boarding-passes')
        .download(idPath)
      if (!idErr && idData) {
        const ext = idPath.split('.').pop() ?? 'pdf'
        attachments.push({
          filename: `id-kopie-${token}.${ext}`,
          content:  Buffer.from(await idData.arrayBuffer()),
        })
      } else if (idErr) {
        console.warn('send-letter: id-copy download failed:', idErr.message)
      }
    }

    // Send via Resend
    const { error: sendErr } = await resend.emails.send({
      from:        FROM,
      to:          toEmail,
      cc:          'claim@aerefund.com',
      replyTo:     `claim+${(claim.token as string).toUpperCase()}@aerefund.com`,
      subject,
      html,
      text,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (sendErr) {
      console.error('send-letter Resend error:', sendErr)
      return NextResponse.json({ success: false, error: 'E-mail versturen mislukt' }, { status: 500 })
    }

    // Update claim status to claim_filed + add activity note
    const existingNotes: Note[] = (claim.notes as Note[]) ?? []
    const newNote: Note = {
      id:        crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type:      'note',
      text:      `Claimbrief verstuurd naar ${toEmail} (cessie-mededeling art. 3:94 BW).`,
    }
    const statusNote: Note = {
      id:          crypto.randomUUID(),
      timestamp:   new Date().toISOString(),
      type:        'status_change',
      text:        `Status gewijzigd: "${claim.status}" → "Claim ingediend bij airline"`,
      prev_status: claim.status as string,
      new_status:  'claim_filed',
    }

    await db.from('claims').update({
      status:     'claim_filed',
      notes:      [...existingNotes, statusNote, newNote],
      updated_at: new Date().toISOString(),
    }).eq('token', token.toUpperCase())

    return NextResponse.json({ success: true, sentTo: toEmail })
  } catch (err) {
    console.error('send-letter error:', err)
    return NextResponse.json({ success: false, error: 'Onverwachte fout' }, { status: 500 })
  }
}
