import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM  = process.env.FROM_EMAIL  ?? 'onboarding@resend.dev'
const ADMIN = process.env.ADMIN_EMAIL ?? 'info@aerefund.nl'
const AEREFUND_IBAN = process.env.AEREFUND_IBAN ?? ''

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00').toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function generateInvoiceNumber(token: string) {
  return `AREF-${new Date().getFullYear()}-${token}`
}

function customerEmail(data: ClaimPayload): string {
  const totalAmount = data.compensation.amountPerPerson * data.passengers
  const amountFormatted = `€${totalAmount.toLocaleString('nl-NL')}`

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,30,61,0.08);">

      <!-- Header -->
      <tr><td style="background:#0f1e3d;padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.01em;">Aerefund</span>
            </td>
            <td align="right">
              <span style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.08em;text-transform:uppercase;">Claimbevestiging</span>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Hero -->
      <tr><td style="padding:40px 40px 24px;text-align:center;">
        <div style="width:56px;height:56px;background:rgba(21,128,61,0.1);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
          <span style="font-size:26px;">✓</span>
        </div>
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0f1e3d;letter-spacing:-0.02em;">Je claim is ingediend!</h1>
        <p style="margin:0;font-size:15px;color:#4b5e82;line-height:1.6;">
          We gaan direct aan de slag met jouw claim voor vlucht <strong style="color:#0f1e3d;">${data.flight.flightNumber}</strong>.
        </p>
      </td></tr>

      <!-- Flight details -->
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.08em;">Claimdetails</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ['Vlucht', data.flight.flightNumber],
                ['Datum', formatDate(data.flight.date)],
                ['Route', data.flight.origin && data.flight.destination ? `${data.flight.origin} → ${data.flight.destination}` : '—'],
                ['Passagiers', String(data.passengers)],
                ['Verwachte compensatie', amountFormatted],
              ].map(([k, v]) => `
              <tr>
                <td style="padding:5px 0;font-size:13px;color:#8fa3be;width:160px;">${k}</td>
                <td style="padding:5px 0;font-size:13px;font-weight:600;color:#0f1e3d;">${v}</td>
              </tr>`).join('')}
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Invoice notice -->
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1.5px solid rgba(224,113,26,0.25);border-radius:12px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#92400e;">Factuur van €42 volgt apart</p>
            <p style="margin:0;font-size:13px;color:#b45309;line-height:1.5;">
              Je ontvangt een aparte factuur per email. Betaling binnen 14 dagen na factuurdatum. Bij succesvolle uitbetaling rekenen we ook 10% commissie.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- What's next -->
      <tr><td style="padding:0 40px 32px;">
        <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0f1e3d;">Wat gebeurt er nu?</p>
        ${[
          ['1', 'Wij sturen een formele claimbrief naar ' + (data.flight.airline ?? 'de airline'), 'Binnen 2 werkdagen'],
          ['2', 'De airline heeft wettelijk 6-8 weken om te reageren', 'Wij houden je op de hoogte'],
          ['3', 'Uitbetaling gaat rechtstreeks naar jou', 'Je ontvangt een melding van ons'],
        ].map(([num, label, sub]) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="width:32px;vertical-align:top;">
              <div style="width:24px;height:24px;background:#1a56db;border-radius:50%;text-align:center;line-height:24px;font-size:11px;font-weight:700;color:#fff;">${num}</div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#0f1e3d;">${label}</p>
              <p style="margin:2px 0 0;font-size:12px;color:#8fa3be;">${sub}</p>
            </td>
          </tr>
        </table>`).join('')}
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f6fb;padding:24px 40px;border-top:1px solid #dde5f4;">
        <p style="margin:0 0 6px;font-size:12px;color:#8fa3be;">Vragen? Stuur een email naar <a href="mailto:claim@aerefund.com" style="color:#1a56db;text-decoration:none;">claim@aerefund.com</a></p>
        <p style="margin:0;font-size:11px;color:#b0bfd4;">© 2026 Aerefund.com · <a href="https://aerefund.com/privacy" style="color:#b0bfd4;">Privacy</a> · <a href="https://aerefund.com/algemene-voorwaarden" style="color:#b0bfd4;">Voorwaarden</a></p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

function invoiceEmail(data: ClaimPayload, invoiceNumber: string): string {
  const issueDate = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const dueDateObj = new Date()
  dueDateObj.setDate(dueDateObj.getDate() + 14)
  const dueDate = dueDateObj.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const ibanDisplay = AEREFUND_IBAN || 'Wordt per email bevestigd'

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
          <td align="right"><span style="font-size:22px;font-weight:800;color:rgba(255,255,255,0.9);letter-spacing:-0.02em;">FACTUUR</span></td>
        </tr></table>
      </td></tr>

      <!-- Invoice meta + From/To -->
      <tr><td style="padding:32px 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:top;width:50%;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.08em;">Van</p>
            <p style="margin:0;font-size:13px;color:#0f1e3d;line-height:1.7;">
              <strong>GoodbyeGuru</strong><br>
              Keurenplein 24<br>
              1069 CD Amsterdam<br>
              KvK: 67332706
            </p>
          </td>
          <td style="vertical-align:top;" align="right">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:3px 0;font-size:12px;color:#8fa3be;">Factuurnummer</td>
                <td style="padding:3px 0 3px 20px;font-size:13px;font-weight:700;color:#0f1e3d;" align="right">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-size:12px;color:#8fa3be;">Factuurdatum</td>
                <td style="padding:3px 0 3px 20px;font-size:13px;color:#0f1e3d;" align="right">${issueDate}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-size:12px;color:#dc2626;">Vervaldatum</td>
                <td style="padding:3px 0 3px 20px;font-size:13px;font-weight:700;color:#dc2626;" align="right">${dueDate}</td>
              </tr>
            </table>
          </td>
        </tr></table>
      </td></tr>

      <!-- Bill to -->
      <tr><td style="padding:0 40px 24px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.08em;">Aan</p>
        <p style="margin:0;font-size:13px;color:#0f1e3d;line-height:1.7;">
          <strong>${data.firstName} ${data.lastName}</strong><br>
          ${data.address}<br>
          ${data.postalCode} ${data.city}
        </p>
      </td></tr>

      <!-- Line items -->
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1.5px solid #e8edf8;">
          <tr style="background:#f4f6fb;">
            <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.06em;">Omschrijving</td>
            <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.06em;" align="right">Excl. BTW</td>
            <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.06em;" align="right">BTW 21%</td>
            <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#8fa3be;text-transform:uppercase;letter-spacing:0.06em;" align="right">Incl. BTW</td>
          </tr>
          <tr style="background:#fff;border-top:1px solid #e8edf8;">
            <td style="padding:16px 16px;font-size:13px;color:#0f1e3d;">
              Behandeling vluchtscompensatieclaim EC 261/2004<br>
              <span style="font-size:12px;color:#8fa3be;">Vlucht ${data.flight.flightNumber} · ${formatDate(data.flight.date)}</span>
            </td>
            <td style="padding:16px 16px;font-size:13px;color:#374151;" align="right">€&nbsp;34,71</td>
            <td style="padding:16px 16px;font-size:13px;color:#374151;" align="right">€&nbsp;7,29</td>
            <td style="padding:16px 16px;font-size:13px;font-weight:700;color:#0f1e3d;" align="right">€&nbsp;42,00</td>
          </tr>
          <tr style="background:#0f1e3d;">
            <td colspan="3" style="padding:14px 16px;font-size:13px;font-weight:700;color:rgba(255,255,255,0.65);">Totaal te betalen (incl. BTW)</td>
            <td style="padding:14px 16px;font-size:17px;font-weight:800;color:#fff;" align="right">€&nbsp;42,00</td>
          </tr>
        </table>
      </td></tr>

      <!-- Payment instructions -->
      <tr><td style="padding:0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1e3a8a;">Betaalinstructies</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:12px;color:#4b5e82;width:120px;">IBAN</td>
                <td style="padding:4px 0;font-size:12px;font-weight:700;color:#0f1e3d;">${ibanDisplay}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:12px;color:#4b5e82;">Ten name van</td>
                <td style="padding:4px 0;font-size:12px;font-weight:600;color:#0f1e3d;">GoodbyeGuru</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:12px;color:#4b5e82;">Kenmerk</td>
                <td style="padding:4px 0;font-size:12px;font-weight:700;color:#0f1e3d;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:12px;color:#4b5e82;">Bedrag</td>
                <td style="padding:4px 0;font-size:12px;font-weight:700;color:#0f1e3d;">€ 42,00</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:12px;color:#dc2626;">Uiterlijk</td>
                <td style="padding:4px 0;font-size:12px;font-weight:700;color:#dc2626;">${dueDate}</td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f4f6fb;padding:22px 40px;border-top:1px solid #dde5f4;">
        <p style="margin:0 0 4px;font-size:12px;color:#8fa3be;">Vragen? Mail naar <a href="mailto:claim@aerefund.com" style="color:#1a56db;text-decoration:none;">claim@aerefund.com</a></p>
        <p style="margin:0;font-size:11px;color:#b0bfd4;">© 2026 Aerefund.com · GoodbyeGuru · KvK 67332706 · <a href="https://aerefund.com/privacy" style="color:#b0bfd4;">Privacy</a> · <a href="https://aerefund.com/algemene-voorwaarden" style="color:#b0bfd4;">Voorwaarden</a></p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`
}

function adminEmail(data: ClaimPayload): string {
  const totalAmount = data.compensation.amountPerPerson * data.passengers
  const rows = [
    ['Vlucht', data.flight.flightNumber],
    ['Datum', formatDate(data.flight.date)],
    ['Route', data.flight.origin && data.flight.destination ? `${data.flight.origin} → ${data.flight.destination}` : '—'],
    ['Airline', data.flight.airline ?? '—'],
    ['Passagiers', String(data.passengers)],
    ['Compensatie p.p.', `€${data.compensation.amountPerPerson}`],
    ['Totale compensatie', `€${totalAmount}`],
    ['', ''],
    ['Naam', `${data.firstName} ${data.lastName}`],
    ['Email', data.customerEmail],
    ['Telefoon', data.phone || '—'],
    ['Adres', `${data.address}, ${data.postalCode} ${data.city}`],
    ['IBAN', data.iban || '—'],
    ['', ''],
    ['Boardingpass', data.boardingPassFileName || 'Niet meegestuurd'],
    ['Medereizgers', data.coPassengers.length > 0
      ? data.coPassengers.map(p => `${p.firstName} ${p.lastName} (${p.email || '—'})`).join(', ')
      : 'Geen'],
    ['Ingediend op', new Date(data.submittedAt).toLocaleString('nl-NL')],
  ]

  return `<!DOCTYPE html>
<html lang="nl">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f6fb;padding:32px 16px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <div style="background:#0f1e3d;padding:20px 28px;">
    <h1 style="margin:0;font-size:18px;color:#fff;font-weight:700;">🆕 Nieuwe claim binnengelopen</h1>
    <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.55);">${data.flight.flightNumber} — ${data.firstName} ${data.lastName}</p>
  </div>
  <div style="padding:24px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${rows.map(([k, v]) => k ? `
      <tr style="border-bottom:1px solid #f0f4fa;">
        <td style="padding:8px 0;font-size:13px;color:#8fa3be;width:160px;vertical-align:top;">${k}</td>
        <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0f1e3d;">${v}</td>
      </tr>` : '<tr><td colspan="2" style="padding:4px 0;"></td></tr>').join('')}
    </table>
  </div>
  <div style="background:#f8faff;padding:16px 28px;border-top:1px solid #dde5f4;">
    <p style="margin:0;font-size:12px;color:#8fa3be;">Factuur is automatisch verstuurd naar <strong>${data.customerEmail}</strong></p>
  </div>
</div>
</body></html>`
}

type CoPassenger = { firstName: string; lastName: string; email: string }

type ClaimPayload = {
  token?: string
  flight: {
    flightNumber: string
    date: string
    origin?: string
    destination?: string
    airline?: string
    iataPrefix?: string
  }
  compensation: { amountPerPerson: number; eligible: boolean; reason: string }
  passengers: number
  firstName: string
  lastName: string
  customerEmail: string
  phone: string
  address: string
  postalCode: string
  city: string
  iban: string
  coPassengers: CoPassenger[]
  boardingPassFileName: string | null
  submittedAt: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ClaimPayload

    const token = body.token ?? null
    const invoiceNumber = generateInvoiceNumber(token ?? Math.random().toString(36).substring(2, 8).toUpperCase())

    // Save to Supabase (fire-and-forget)
    const db = getSupabase()
    if (db && token) {
      db.from('claims').update({
        status: 'submitted',
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.customerEmail,
        phone: body.phone || null,
        address: body.address,
        postal_code: body.postalCode,
        city: body.city,
        iban: body.iban || null,
        co_passengers: body.coPassengers,
        boarding_pass_filename: body.boardingPassFileName,
        invoice_number: invoiceNumber,
        submitted_at: body.submittedAt,
        updated_at: new Date().toISOString(),
      }).eq('token', token).then(({ error }) => {
        if (error) console.error('Supabase submit update error:', error)
      })
    } else if (db) {
      db.from('claims').insert({
        token: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: 'submitted',
        flight_data: body.flight,
        compensation: body.compensation,
        passengers: body.passengers,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.customerEmail,
        phone: body.phone || null,
        address: body.address,
        postal_code: body.postalCode,
        city: body.city,
        iban: body.iban || null,
        co_passengers: body.coPassengers,
        boarding_pass_filename: body.boardingPassFileName,
        invoice_number: invoiceNumber,
        submitted_at: body.submittedAt,
      }).then(({ error }) => {
        if (error) console.error('Supabase fresh insert error:', error)
      })
    }

    // Send confirmation + invoice + admin notification in parallel
    const [customerResult, invoiceResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: body.customerEmail,
        subject: `Claim ingediend voor vlucht ${body.flight.flightNumber} — Aerefund`,
        html: customerEmail(body),
      }),
      resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: body.customerEmail,
        replyTo: `claim@aerefund.com`,
        subject: `Factuur ${invoiceNumber} — Aerefund`,
        html: invoiceEmail(body, invoiceNumber),
      }),
      resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: ADMIN,
        replyTo: body.customerEmail,
        subject: `Nieuwe claim: ${body.flight.flightNumber} — ${body.firstName} ${body.lastName}`,
        html: adminEmail(body),
      }),
    ])

    if (customerResult.error || invoiceResult.error || adminResult.error) {
      console.error('Resend errors:', customerResult.error, invoiceResult.error, adminResult.error)
      return NextResponse.json({ success: false, error: 'Email verzenden mislukt' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('submit-claim error:', err)
    return NextResponse.json({ success: false, error: 'Onverwachte fout' }, { status: 500 })
  }
}
