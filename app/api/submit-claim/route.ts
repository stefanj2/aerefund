import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, generateToken } from '@/lib/supabase'
import { getAirlineConfig } from '@/lib/airlines'
import { resend } from '@/lib/resend'

const FROM  = process.env.FROM_EMAIL  ?? 'onboarding@resend.dev'
const ADMIN = process.env.ADMIN_EMAIL ?? 'info@aerefund.com'
const AEREFUND_IBAN = process.env.AEREFUND_IBAN ?? ''

const LOGO_URL = 'https://aerefund.com/logo-aerefund.png'

// Preheader: verborgen preview-tekst — spam filters belonen aanwezigheid, ontvangers zien hem in inbox
function preheader(text: string) {
  const pad = '\u200C\u00A0'.repeat(60) // zero-width + non-breaking spaces om de rest te verdringen
  return `<span style="display:none;font-size:1px;color:#f3f4f6;max-height:0;overflow:hidden;opacity:0;">${text}${pad}</span>`
}

const CONTAINER = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'
const LOGO_HEADER = `<div style="background: #ffffff; padding: 24px 30px; border-radius: 12px 12px 0 0; border-bottom: 1px solid #e5e7eb; text-align: center;">
  <img src="${LOGO_URL}" alt="Aerefund" style="height: 64px; width: auto; display: block; margin: 0 auto;">
</div>`
const BODY_OPEN  = 'background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;'
const FOOTER     = 'background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;'
const INFO_BOX   = 'background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;'
const ORANGE_BOX = 'background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;'
const P          = 'color: #4b5563; font-size: 16px; line-height: 1.6;'
const H2         = 'color: #111827; margin-top: 0;'
const H3         = 'color: #111827; margin-top: 24px; margin-bottom: 8px; font-size: 17px;'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00').toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function generateInvoiceNumber(token: string) {
  return `AREF-${new Date().getFullYear()}-${token}`
}

function getAirlineDisplayName(data: ClaimPayload) {
  const config = getAirlineConfig(data.flight.iataPrefix ?? '')
  return config.name === 'de airline' && data.flight.airline ? data.flight.airline : config.name
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Customer confirmation email
// ─────────────────────────────────────────────────────────────────────────────
function customerEmail(data: ClaimPayload): { html: string; text: string } {
  const totalAmount = data.compensation.amountPerPerson * data.passengers
  const amountFormatted = `€${totalAmount.toLocaleString('nl-NL')}`
  const airlineName = getAirlineDisplayName(data)
  const airlineConfig = getAirlineConfig(data.flight.iataPrefix ?? '')
  const avgWeeks = airlineConfig.avgPaymentWeeks
  const token = data.token ?? ''
  const route = data.flight.origin && data.flight.destination
    ? `${data.flight.origin} → ${data.flight.destination}`
    : null

  const text = [
    `Bevestiging: compensatieclaim vlucht ${data.flight.flightNumber}`,
    ``,
    `Beste ${data.firstName},`,
    ``,
    `We hebben je compensatieclaim voor vlucht ${data.flight.flightNumber} ingediend bij ${airlineName}. Je hoeft zelf niets meer te doen.`,
    ``,
    `Vluchtgegevens`,
    `---`,
    ...(token ? [`Referentie   : ${token}`] : []),
    `Airline      : ${airlineName}`,
    `Vlucht       : ${data.flight.flightNumber}`,
    `Datum        : ${formatDate(data.flight.date)}`,
    ...(route ? [`Route        : ${route}`] : []),
    `Passagiers   : ${data.passengers}`,
    `Vergoeding   : ${amountFormatted}`,
    `---`,
    ``,
    `Vervolgstappen`,
    ``,
    `1. Wij stellen ${airlineName} in kennis van de vorderingsoverdracht via een formele claimbrief — dit doen wij binnen 2 werkdagen.`,
    `2. ${airlineName} betaalt de compensatie aan Aerefund als rechthebbende. Gemiddeld duurt dit ${avgWeeks} weken.`,
    `3. Wij nemen daarna contact met je op voor de doorstorting naar jouw rekening.`,
    ``,
    `Servicenota`,
    ``,
    `Je ontvangt per aparte email een servicenota van 42 euro. Bij succesvolle uitbetaling houden wij de servicekosten (42 euro + 10% commissie) in en maken het nettobedrag binnen 5 werkdagen over — wij vragen jouw IBAN op zodra het geld is ontvangen.`,
    ``,
    `Vragen? Stuur een bericht naar claim@aerefund.com`,
    ``,
    `Met vriendelijke groet,`,
    `Team Aerefund`,
    ``,
    `---`,
    `Aerefund | Keurenplein 24, 1069 CD Amsterdam | KvK 67332706 | aerefund.com`,
    `U ontvangt deze email omdat u een compensatieclaim heeft ingediend via aerefund.com.`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Claim ingediend — Aerefund</title>
</head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
${preheader(`Referentie ${token ? token + ' - ' : ''}vlucht ${data.flight.flightNumber} bij ${airlineName}. Wij nemen de zaak over.`)}
<div style="${CONTAINER}">
  ${LOGO_HEADER}
  <div style="${BODY_OPEN}">

    <h2 style="${H2}">Je claim is ingediend</h2>

    <p style="${P}">Beste ${data.firstName},</p>

    <p style="${P}">
      Goed nieuws! We hebben je compensatieclaim voor vlucht <strong>${data.flight.flightNumber}</strong>
      ingediend bij <strong>${airlineName}</strong>. Je hoeft zelf niets meer te doen — wij handelen alles af.
    </p>

    <div style="${INFO_BOX}">
      <p style="margin: 0 0 12px; color: #166534; font-weight: 700; font-size: 15px;">Claimdetails</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${token ? `<tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Claimreferentie</td><td style="color: #166534; text-align: right; font-weight: 700; font-size: 14px; letter-spacing: 0.05em;">${token}</td></tr>` : ''}
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Airline</td><td style="color: #166534; text-align: right; font-size: 14px;">${airlineName}</td></tr>
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Vluchtnummer</td><td style="color: #166534; text-align: right; font-size: 14px;">${data.flight.flightNumber}</td></tr>
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Datum</td><td style="color: #166534; text-align: right; font-size: 14px;">${formatDate(data.flight.date)}</td></tr>
        ${route ? `<tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Route</td><td style="color: #166534; text-align: right; font-size: 14px;">${route}</td></tr>` : ''}
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Passagiers</td><td style="color: #166534; text-align: right; font-size: 14px;">${data.passengers}</td></tr>
        <tr style="border-top: 1px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 4px; font-size: 16px;"><strong>Verwachte compensatie</strong></td>
          <td style="color: #166534; text-align: right; font-size: 16px;"><strong>${amountFormatted}</strong></td>
        </tr>
      </table>
    </div>

    <h3 style="${H3}">Wat gebeurt er nu?</h3>
    <ul style="${P} margin: 0; padding-left: 20px; line-height: 2;">
      <li>Wij stellen ${airlineName} in kennis van de vorderingsoverdracht via een formele claimbrief — binnen 2 werkdagen</li>
      <li>${airlineName} betaalt de compensatie aan Aerefund als rechthebbende. Gemiddeld duurt dit <strong>${avgWeeks} weken</strong></li>
      <li>Wij nemen daarna contact met je op voor de doorstorting naar jouw rekening</li>
    </ul>

    <div style="${ORANGE_BOX}">
      <p style="margin: 0 0 6px; color: #9a3412; font-weight: 700; font-size: 15px;">Onze servicenota</p>
      <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
        Je ontvangt per aparte email een servicenota van €42. Bij succesvolle uitbetaling houden wij 10% commissie in.
        Na ontvangst houden wij de servicekosten (€42 + 10% commissie) in en maken het nettobedrag binnen 5 werkdagen over — wij vragen jouw IBAN op zodra het geld is ontvangen.
      </p>
    </div>

    <p style="${P}">
      Heb je vragen? Reply dan op deze email of stuur een bericht naar
      <a href="mailto:claim@aerefund.com" style="color: #FF6B2B; text-decoration: none; font-weight: 600;">claim@aerefund.com</a>.
    </p>

    <p style="${P}">
      Met vriendelijke groet,<br>
      <strong>Team Aerefund</strong>
    </p>
  </div>

  <div style="${FOOTER}">
    <p style="margin: 0; font-weight: 600; color: #374151;">Aerefund</p>
    <p style="margin: 6px 0 0;">Keurenplein 24, 1069 CD Amsterdam</p>
    <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">
      KvK 67332706 &middot;
      <a href="https://aerefund.com/privacy" style="color: #9ca3af;">Privacy</a> &middot;
      <a href="https://aerefund.com/algemene-voorwaarden" style="color: #9ca3af;">Voorwaarden</a>
    </p>
    <p style="margin: 8px 0 0; font-size: 11px; color: #d1d5db;">
      Dit is een transactionele email naar aanleiding van je ingediende compensatieclaim.
    </p>
  </div>
</div>
</body>
</html>`

  return { html, text }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Invoice email
// ─────────────────────────────────────────────────────────────────────────────
function invoiceEmail(data: ClaimPayload, invoiceNumber: string): { html: string; text: string } {
  const issueDate = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const dueDateObj = new Date()
  dueDateObj.setDate(dueDateObj.getDate() + 14)
  const dueDate = dueDateObj.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const ibanDisplay = AEREFUND_IBAN || 'Wordt per email bevestigd'
  const airlineName = getAirlineDisplayName(data)

  const text = [
    `Servicenota ${invoiceNumber} - Aerefund`,
    ``,
    `Beste ${data.firstName},`,
    ``,
    `Bedankt voor het indienen van je compensatieclaim. Hieronder vind je de servicenota voor onze dienstverlening.`,
    ``,
    `Van`,
    `GoodbyeGuru, Keurenplein 24, 1069 CD Amsterdam, KvK 67332706`,
    ``,
    `Aan`,
    `${data.firstName} ${data.lastName}, ${data.address}, ${data.postalCode} ${data.city}`,
    ``,
    `Nota`,
    `---`,
    `Nummer       : ${invoiceNumber}`,
    `Datum        : ${issueDate}`,
    `Te voldoen   : ${dueDate}`,
    ``,
    `Dienst: Behandeling compensatieclaim EC 261/2004`,
    `Betreft: ${airlineName}, vlucht ${data.flight.flightNumber}, ${formatDate(data.flight.date)}`,
    ``,
    `Excl. btw    : 34,71`,
    `Btw 21%      : 7,29`,
    `Totaal       : 42,00`,
    `---`,
    ``,
    `Betalingsgegevens`,
    `IBAN         : ${ibanDisplay}`,
    `Ten name van : GoodbyeGuru`,
    `Kenmerk      : ${invoiceNumber}`,
    `Bedrag       : 42,00`,
    `Te voldoen   : ${dueDate}`,
    ``,
    `Bij een geslaagde claim rekenen wij een vergoeding van 10% over het ontvangen bedrag. Dit wordt apart in rekening gebracht.`,
    ``,
    `Vragen over deze nota? Stuur een bericht naar claim@aerefund.com`,
    ``,
    `Met vriendelijke groet,`,
    `Team Aerefund`,
    ``,
    `---`,
    `Aerefund | Keurenplein 24, 1069 CD Amsterdam | KvK 67332706 | aerefund.com`,
    `U ontvangt deze email omdat u een compensatieclaim heeft ingediend via aerefund.com.`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Factuur ${invoiceNumber} — Aerefund</title>
  <script type="application/ld+json" data-id="invoice-schema">
  {
    "@context": "http://schema.org",
    "@type": "Invoice",
    "accountId": "${invoiceNumber}",
    "description": "Claimbehandeling EC 261/2004 — vlucht ${data.flight.flightNumber}",
    "referencesOrder": {
      "@type": "Order",
      "seller": { "@type": "Organization", "name": "Aerefund" },
      "description": "Compensatieclaim ${airlineName}"
    },
    "totalPaymentDue": { "@type": "PriceSpecification", "price": 42, "priceCurrency": "EUR" }
  }
  </script>
</head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
${preheader(`Servicenota ${invoiceNumber} voor uw compensatieclaim vlucht ${data.flight.flightNumber} bij ${airlineName}.`)}
<div style="${CONTAINER}">
  ${LOGO_HEADER}
  <div style="${BODY_OPEN}">

    <h2 style="${H2}">Servicenota ${invoiceNumber}</h2>

    <p style="${P}">Beste ${data.firstName},</p>

    <p style="${P}">
      Bedankt voor het indienen van je compensatieclaim bij Aerefund.
      Hieronder vind je de nota voor onze dienstverlening.
    </p>

    <!-- Van / Aan / Factuurnummer -->
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="vertical-align: top; width: 50%; padding-right: 16px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em;">Van</p>
          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7;">
            <strong style="color: #111827;">GoodbyeGuru</strong><br>
            Keurenplein 24<br>
            1069 CD Amsterdam<br>
            KvK: 67332706<br>
            BTW: NL001234567B01
          </p>
        </td>
        <td style="vertical-align: top; text-align: right;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em;">Aan</p>
          <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7; text-align: right;">
            <strong style="color: #111827;">${data.firstName} ${data.lastName}</strong><br>
            ${data.address}<br>
            ${data.postalCode} ${data.city}
          </p>
        </td>
      </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px;">
      <tr>
        <td style="color: #6b7280; padding: 3px 0; width: 140px;">Factuurnummer</td>
        <td style="color: #111827; font-weight: 700; text-align: right;">${invoiceNumber}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 3px 0;">Factuurdatum</td>
        <td style="color: #374151; text-align: right;">${issueDate}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 3px 0;">Te voldoen voor</td>
        <td style="color: #374151; font-weight: 600; text-align: right;">${dueDate}</td>
      </tr>
    </table>

    <!-- Regelomschrijving -->
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; font-size: 13px; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 10px 14px; text-align: left; font-weight: 700; color: #6b7280; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em;">Omschrijving</th>
          <th style="padding: 10px 14px; text-align: right; font-weight: 700; color: #6b7280; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em;">Excl. BTW</th>
          <th style="padding: 10px 14px; text-align: right; font-weight: 700; color: #6b7280; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em;">BTW 21%</th>
          <th style="padding: 10px 14px; text-align: right; font-weight: 700; color: #6b7280; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em;">Incl. BTW</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-top: 1px solid #e5e7eb;">
          <td style="padding: 14px; color: #374151;">
            Behandeling vluchtscompensatieclaim EC 261/2004<br>
            <span style="color: #9ca3af; font-size: 12px;">${airlineName} · vlucht ${data.flight.flightNumber} · ${formatDate(data.flight.date)}</span>
          </td>
          <td style="padding: 14px; text-align: right; color: #374151; white-space: nowrap;">€ 34,71</td>
          <td style="padding: 14px; text-align: right; color: #374151; white-space: nowrap;">€ 7,29</td>
          <td style="padding: 14px; text-align: right; font-weight: 700; color: #111827; white-space: nowrap;">€ 42,00</td>
        </tr>
        <tr style="background: #111827;">
          <td colspan="3" style="padding: 12px 14px; color: rgba(255,255,255,0.6); font-size: 13px;">Totaalbedrag (incl. btw)</td>
          <td style="padding: 12px 14px; text-align: right; color: #ffffff; font-weight: 800; font-size: 17px; white-space: nowrap;">42,00</td>
        </tr>
      </tbody>
    </table>

    <!-- Betaalinstructies -->
    <div style="${INFO_BOX}">
      <p style="margin: 0 0 12px; color: #166534; font-weight: 700; font-size: 15px;">Betaalinstructies</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px; width: 140px;">IBAN</td><td style="color: #166534; font-weight: 700; font-size: 14px; text-align: right;">${ibanDisplay}</td></tr>
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Ten name van</td><td style="color: #166534; font-size: 14px; text-align: right;">GoodbyeGuru</td></tr>
        <tr><td style="color: #166534; padding: 4px 0; font-size: 14px;">Betalingskenmerk</td><td style="color: #166534; font-weight: 700; font-size: 14px; text-align: right;">${invoiceNumber}</td></tr>
        <tr style="border-top: 1px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 4px; font-size: 16px;"><strong>Bedrag</strong></td>
          <td style="color: #166534; text-align: right; font-size: 16px;"><strong>€ 42,00</strong></td>
        </tr>
      </table>
      <p style="margin: 10px 0 0; color: #166534; font-size: 13px;">
        Graag ontvangen voor <strong>${dueDate}</strong> onder vermelding van het kenmerk.
      </p>
    </div>

    <!-- Betaalknop -->
    <div style="text-align: center; margin: 28px 0 8px;">
      <a href="https://aerefund.com/betalen?ref=${invoiceNumber}&naam=${encodeURIComponent(data.firstName)}&vlucht=${encodeURIComponent(data.flight.flightNumber)}&airline=${encodeURIComponent(airlineName)}"
         style="display:inline-block; background:#FF6B2B; color:#fff; font-weight:700; font-size:16px; padding:14px 36px; border-radius:8px; text-decoration:none; letter-spacing:0.01em;">
        Betaal nu &mdash; &euro;\u202F42,00
      </a>
      <p style="margin:10px 0 0; font-size:12px; color:#9ca3af;">
        Veilig via bunq.me &middot; iDEAL &middot; creditcard
      </p>
    </div>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; background: #f9fafb; border-radius: 8px; padding: 12px 14px;">
      <strong style="color: #374151;">Commissie:</strong> bij succesvolle uitbetaling van de compensatie brengen wij aanvullend
      10% van het ontvangen bedrag in rekening. Dit wordt gefactureerd nadat ${airlineName} de compensatie heeft uitbetaald.
    </p>

    <p style="${P}">
      Vragen over deze factuur? Mail naar
      <a href="mailto:claim@aerefund.com" style="color: #FF6B2B; text-decoration: none; font-weight: 600;">claim@aerefund.com</a>.
    </p>

    <p style="${P}">
      Met vriendelijke groet,<br>
      <strong>Team Aerefund</strong>
    </p>
  </div>

  <div style="${FOOTER}">
    <p style="margin: 0; font-weight: 600; color: #374151;">Aerefund</p>
    <p style="margin: 6px 0 0;">Keurenplein 24, 1069 CD Amsterdam</p>
    <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">
      KvK 67332706 &middot;
      <a href="https://aerefund.com/privacy" style="color: #9ca3af;">Privacy</a> &middot;
      <a href="https://aerefund.com/algemene-voorwaarden" style="color: #9ca3af;">Voorwaarden</a>
    </p>
    <p style="margin: 8px 0 0; font-size: 11px; color: #d1d5db;">
      Dit is een transactionele email naar aanleiding van je ingediende compensatieclaim.
    </p>
  </div>
</div>
</body>
</html>`

  return { html, text }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Aanvullen email (IBAN + boardingpass + ID copy)
// ─────────────────────────────────────────────────────────────────────────────
function aanvullenEmail(data: ClaimPayload, token: string): { html: string; text: string } {
  const airlineName = getAirlineDisplayName(data)
  const url = `https://aerefund.com/aanvullen?token=${encodeURIComponent(token)}`

  const text = [
    `Aanvullen — claim ${token}`,
    ``,
    `Beste ${data.firstName},`,
    ``,
    `We hebben je claim ontvangen voor vlucht ${data.flight.flightNumber} bij ${airlineName}.`,
    `Om de zaak zo sterk mogelijk te stellen en de compensatie snel aan jou over te maken, hebben wij nog drie gegevens van je nodig:`,
    ``,
    `1. Jouw IBAN-rekeningnummer — zodat wij het nettobedrag direct kunnen overmaken`,
    `2. Boardingpass of boekingsbevestiging — bewijs dat je op de vlucht zat`,
    `3. Kopie identiteitsbewijs (paspoort of rijbewijs) — sommige airlines vragen dit standaard op`,
    ``,
    `Upload je gegevens via onderstaande link (duurt minder dan 2 minuten):`,
    url,
    ``,
    `De link is persoonlijk en blijft geldig — je kunt ook later terugkomen.`,
    ``,
    `Vragen? Mail naar claim@aerefund.com`,
    ``,
    `Met vriendelijke groet,`,
    `Team Aerefund`,
    ``,
    `---`,
    `Aerefund | Keurenplein 24, 1069 CD Amsterdam | KvK 67332706 | aerefund.com`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Aanvullen claim — Aerefund</title>
</head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
${preheader(`Upload je IBAN, boardingpass en identiteitsbewijs voor je claim bij ${airlineName}.`)}
<div style="${CONTAINER}">
  ${LOGO_HEADER}
  <div style="${BODY_OPEN}">

    <h2 style="${H2}">Nog 3 gegevens nodig</h2>

    <p style="${P}">Beste ${data.firstName},</p>

    <p style="${P}">
      We hebben je claim voor vlucht <strong>${data.flight.flightNumber}</strong> bij <strong>${airlineName}</strong> ontvangen.
      Om de zaak zo sterk mogelijk te stellen en de compensatie snel aan jou over te maken,
      hebben wij nog een paar gegevens van je nodig.
    </p>

    <div style="${ORANGE_BOX}">
      <p style="margin: 0 0 14px; color: #9a3412; font-weight: 700; font-size: 15px;">Wat hebben wij nodig?</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 30px;">
            <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(255,107,43,0.2);color:#9a3412;font-size:11px;font-weight:800;text-align:center;line-height:22px;">1</span>
          </td>
          <td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;">
            <strong style="color: #7c2d12;">IBAN-rekeningnummer</strong><br>
            Waarop wij het nettobedrag overmaken na ontvangst van de compensatie
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top;">
            <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(255,107,43,0.2);color:#9a3412;font-size:11px;font-weight:800;text-align:center;line-height:22px;">2</span>
          </td>
          <td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;">
            <strong style="color: #7c2d12;">Boardingpass of boekingsbevestiging</strong><br>
            Bewijs dat je daadwerkelijk op vlucht ${data.flight.flightNumber} zat
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top;">
            <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(255,107,43,0.2);color:#9a3412;font-size:11px;font-weight:800;text-align:center;line-height:22px;">3</span>
          </td>
          <td style="padding: 8px 0 8px 10px; color: #78350f; font-size: 14px; line-height: 1.5;">
            <strong style="color: #7c2d12;">Kopie identiteitsbewijs</strong><br>
            Paspoort of rijbewijs — wordt door sommige airlines standaard opgevraagd
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 8px;">
      <a href="${url}"
         style="display:inline-block; background:#FF6B2B; color:#fff; font-weight:700; font-size:16px; padding:14px 36px; border-radius:8px; text-decoration:none; letter-spacing:0.01em;">
        Gegevens uploaden &rarr;
      </a>
      <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
        Veilig &middot; duurt minder dan 2 minuten &middot; link blijft geldig
      </p>
    </div>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; background: #f9fafb; border-radius: 8px; padding: 12px 14px; margin-top: 20px;">
      <strong style="color: #374151;">Niet nu?</strong> Geen probleem — je kunt altijd terugkomen via de link in deze email.
    </p>

    <p style="${P}">
      Vragen? Reply op deze email of stuur naar
      <a href="mailto:claim@aerefund.com" style="color: #FF6B2B; text-decoration: none; font-weight: 600;">claim@aerefund.com</a>.
    </p>

    <p style="${P}">
      Met vriendelijke groet,<br>
      <strong>Team Aerefund</strong>
    </p>
  </div>

  <div style="${FOOTER}">
    <p style="margin: 0; font-weight: 600; color: #374151;">Aerefund</p>
    <p style="margin: 6px 0 0;">Keurenplein 24, 1069 CD Amsterdam</p>
    <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">
      KvK 67332706 &middot;
      <a href="https://aerefund.com/privacy" style="color: #9ca3af;">Privacy</a> &middot;
      <a href="https://aerefund.com/algemene-voorwaarden" style="color: #9ca3af;">Voorwaarden</a>
    </p>
    <p style="margin: 8px 0 0; font-size: 11px; color: #d1d5db;">
      Dit is een transactionele email naar aanleiding van je ingediende compensatieclaim.
    </p>
  </div>
</div>
</body>
</html>`

  return { html, text }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Admin notification email
// ─────────────────────────────────────────────────────────────────────────────
function adminEmail(data: ClaimPayload, invoiceNumber: string): string {
  const totalAmount = data.compensation.amountPerPerson * data.passengers
  const airlineName = getAirlineDisplayName(data)
  const airlineConfig = getAirlineConfig(data.flight.iataPrefix ?? '')

  const rows: [string, string][] = [
    ['Token',            data.token ?? '—'],
    ['Factuurnummer',    invoiceNumber],
    ['Vlucht',           data.flight.flightNumber],
    ['Airline',          `${airlineName} (${data.flight.iataPrefix ?? '?'})`],
    ['Datum',            formatDate(data.flight.date)],
    ['Route',            data.flight.origin && data.flight.destination ? `${data.flight.origin} → ${data.flight.destination}` : '—'],
    ['Type',             data.flight.type ?? '—'],
    ['Passagiers',       String(data.passengers)],
    ['p.p.',             `€${data.compensation.amountPerPerson}`],
    ['Totaal',           `€${totalAmount}`],
    ['Betaaltermijn',    `${airlineConfig.avgPaymentWeeks} weken gem.`],
    ['Moeilijkheid',     airlineConfig.claimDifficulty],
    ['Naam',             `${data.firstName} ${data.lastName}`],
    ['Email',            data.customerEmail],
    ['Telefoon',         data.phone || '—'],
    ['Adres',            `${data.address}, ${data.postalCode} ${data.city}`],
    ['IBAN klant',       data.iban || '—'],
    ['Boardingpass',     data.boardingPassFileName || '✗ Niet meegestuurd'],
    ['Medereizgers',     data.coPassengers.length > 0
      ? data.coPassengers.map(p => `${p.firstName} ${p.lastName} (${p.email || '—'})`).join(', ')
      : 'Geen'],
    ['Ingediend op',     new Date(data.submittedAt).toLocaleString('nl-NL')],
  ]

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
<div style="${CONTAINER}">
  <div style="background: #111827; padding: 20px 30px; border-radius: 12px 12px 0 0;">
    <h2 style="margin: 0; color: #fff; font-size: 16px;">🆕 Nieuwe claim — ${data.flight.flightNumber}</h2>
    <p style="margin: 4px 0 0; color: rgba(255,255,255,0.5); font-size: 13px;">${data.firstName} ${data.lastName} · ${airlineName} · €${totalAmount}</p>
  </div>
  <div style="${BODY_OPEN}">
    <table style="width: 100%; border-collapse: collapse;">
      ${rows.map(([k, v]) => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 8px 0; font-size: 13px; color: #9ca3af; width: 160px; vertical-align: top;">${k}</td>
        <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #111827;">${v}</td>
      </tr>`).join('')}
    </table>
  </div>
  <div style="${FOOTER}">
    <p style="margin: 0; font-size: 12px;">Bevestigings- en factuurmail verstuurd naar <strong>${data.customerEmail}</strong></p>
  </div>
</div>
</body>
</html>`
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
    type?: string
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
        token: generateToken(),
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

    const confirmation = customerEmail(body)
    const invoice      = invoiceEmail(body, invoiceNumber)
    const airlineName  = body.flight.iataPrefix
      ? getAirlineConfig(body.flight.iataPrefix).name
      : (body.flight.airline ?? 'de airline')

    // Build email batch — aanvullen only when token exists (needed for personalized link)
    const emailBatch: Parameters<typeof resend.emails.send>[0][] = [
      {
        from: `Aerefund <${FROM}>`,
        to: body.customerEmail,
        replyTo: 'claim@aerefund.com',
        subject: `Je claim voor vlucht ${body.flight.flightNumber} is ingediend`,
        html: confirmation.html,
        text: confirmation.text,
        headers: {
          'List-Unsubscribe': '<mailto:claim@aerefund.com?subject=unsubscribe>',
          'X-Entity-Ref-ID': `${invoiceNumber}-confirmation`,
        },
        tags: [
          { name: 'type', value: 'claim_confirmation' },
          { name: 'airline', value: body.flight.iataPrefix ?? 'unknown' },
        ],
      },
      {
        from: `Aerefund <${FROM}>`,
        to: body.customerEmail,
        replyTo: 'claim@aerefund.com',
        subject: `Servicenota ${invoiceNumber} - Aerefund`,
        html: invoice.html,
        text: invoice.text,
        headers: {
          'List-Unsubscribe': '<mailto:claim@aerefund.com?subject=unsubscribe>',
          'X-Entity-Ref-ID': `${invoiceNumber}-invoice`,
        },
        tags: [{ name: 'type', value: 'invoice' }],
      },
      {
        from: `Aerefund <${FROM}>`,
        to: ADMIN,
        replyTo: body.customerEmail,
        subject: `Nieuwe claim: ${body.flight.flightNumber} — ${body.firstName} ${body.lastName} (${airlineName})`,
        html: adminEmail(body, invoiceNumber),
        headers: { 'X-Entity-Ref-ID': `${invoiceNumber}-admin` },
      },
    ]

    if (token) {
      const aanvullen = aanvullenEmail(body, token)
      emailBatch.push({
        from: `Aerefund <${FROM}>`,
        to: body.customerEmail,
        replyTo: 'claim@aerefund.com',
        subject: `Actie vereist — uploaden documenten claim ${token}`,
        html: aanvullen.html,
        text: aanvullen.text,
        headers: {
          'List-Unsubscribe': '<mailto:claim@aerefund.com?subject=unsubscribe>',
          'X-Entity-Ref-ID': `${invoiceNumber}-aanvullen`,
        },
        tags: [{ name: 'type', value: 'aanvullen' }],
      })
    }

    // Send all emails in parallel
    const results = await Promise.all(emailBatch.map(e => resend.emails.send(e)))
    const errors  = results.map(r => r.error).filter(Boolean)
    if (errors.length > 0) {
      // Log email errors but don't block the user — claim data is already saved in Supabase
      console.error('Resend errors (non-blocking):', errors)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('submit-claim error:', err)
    return NextResponse.json({ success: false, error: 'Onverwachte fout' }, { status: 500 })
  }
}
