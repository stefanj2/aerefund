// Shared consent PDF generator — extracted from send-letter/route.ts
import { createHmac } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'
import { PDFDocument, PDFPage, StandardFonts, rgb, PageSizes } from 'pdf-lib'

export type ConsentClaim = {
  token: string
  first_name: string
  last_name: string
  email: string
  submitted_at: string
  flight_data: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  address?: string
  postal_code?: string
  city?: string
  phone?: string
}

export async function generateConsentPdf(claim: ConsentClaim): Promise<Buffer> {
  const doc = await PDFDocument.create()

  // ── Shared assets ──────────────────────────────────────────────────────
  const fontBold   = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontNormal = await doc.embedFont(StandardFonts.Helvetica)
  const fontMono   = await doc.embedFont(StandardFonts.Courier)

  let logoImg: Awaited<ReturnType<typeof doc.embedPng>> | null = null
  try {
    const logoPng = readFileSync(join(process.cwd(), 'public', 'logo-aerefund.png'))
    logoImg = await doc.embedPng(logoPng)
  } catch (err) {
    console.warn('consent-pdf: could not load logo, skipping:', (err as Error).message)
  }

  // ── Extract claim data ─────────────────────────────────────────────────
  const token       = (claim.token       ?? '').trim()
  const firstName   = (claim.first_name  ?? '').trim()
  const lastName    = (claim.last_name   ?? '').trim()
  const email       = (claim.email       ?? '').trim()
  const submittedAt = claim.submitted_at ?? ''
  const flight      = (claim.flight_data ?? {}) as Record<string, unknown>
  const flightNum   = ((flight.flightNumber as string) ?? '').trim()
  const flightDate  = ((flight.date        as string) ?? '').trim()
  const origin      = ((flight.origin      as string) ?? '').trim()
  const destination = ((flight.destination as string) ?? '').trim()
  const airline     = ((flight.airline     as string) ?? '').trim()
  const claimType   = (flight.type         as string) ?? 'delay'
  const ipAddress   = claim.ip_address    ?? null
  const userAgent   = claim.user_agent    ?? null
  const address     = (claim.address      ?? '').trim()
  const postalCode  = (claim.postal_code  ?? '').trim()
  const city        = (claim.city         ?? '').trim()
  const phone       = (claim.phone        ?? '').trim()
  const addressLine = [address, [postalCode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || '-'
  const fullName    = `${firstName} ${lastName}`.trim() || '-'

  // ── HMAC signature ─────────────────────────────────────────────────────
  const signingSecret = process.env.CONSENT_SIGNING_SECRET ?? (() => {
    console.warn('CONSENT_SIGNING_SECRET not set — using dev fallback')
    return 'aerefund-dev-secret-do-not-use-in-production'
  })()
  const canonical = [token, fullName, email, submittedAt, ipAddress ?? '', flightNum, flightDate].join('|')
  const signature = createHmac('sha256', signingSecret).update(canonical).digest('hex')

  // ── Draw one page in a given language ──────────────────────────────────
  function drawPage(page: PDFPage, lang: 'nl' | 'en'): void {
    const { width, height } = page.getSize()
    const isEN = lang === 'en'

    const navy    = rgb(0.051, 0.106, 0.165)
    const orange  = rgb(1,     0.416, 0.169)
    const white   = rgb(1,     1,     1)
    const black   = rgb(0.08,  0.08,  0.08)
    const gray    = rgb(0.48,  0.48,  0.48)
    const lgray   = rgb(0.88,  0.88,  0.88)
    const xlgray  = rgb(0.955, 0.955, 0.955)
    const sealBg  = rgb(0.93,  0.96,  1.0)
    const sealBdr = rgb(0.70,  0.80,  0.96)
    const green   = rgb(0.13,  0.60,  0.27)
    const greenBg = rgb(0.90,  0.97,  0.92)
    const offW    = rgb(0.978, 0.980, 0.985)
    const blueHL  = rgb(0.45,  0.60,  0.82)
    const lightBl = rgb(0.75,  0.86,  0.96)

    const margin = 52, cw = width - margin * 2
    const locale = isEN ? 'en-GB' : 'nl-NL'

    const submittedFormatted = submittedAt
      ? new Date(submittedAt).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Amsterdam' })
      : '-'
    const submittedDate = submittedAt
      ? new Date(submittedAt).toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'Europe/Amsterdam' })
      : '-'
    const typeLabel = isEN
      ? (claimType === 'cancelled' || claimType === 'geannuleerd' ? 'Cancellation' : claimType === 'denied' ? 'Denied Boarding' : 'Delay')
      : (claimType === 'cancelled' || claimType === 'geannuleerd' ? 'Annulering'   : claimType === 'denied' ? 'Instapweigering' : 'Vertraging')

    // ── Helpers ────────────────────────────────────────────────────────
    function drawWrapped(
      str: string, x: number, startY: number,
      opts: { font?: typeof fontBold; size?: number; color?: ReturnType<typeof rgb>; maxWidth: number; lineH?: number },
    ): number {
      const font  = opts.font  ?? fontNormal
      const size  = opts.size  ?? 9
      const color = opts.color ?? black
      const lh    = opts.lineH ?? size + 3
      let line = '', curY = startY
      for (const word of str.split(' ')) {
        const test = line ? `${line} ${word}` : word
        if (line && font.widthOfTextAtSize(test, size) > opts.maxWidth) {
          page.drawText(line, { x, y: curY, size, font, color }); curY -= lh; line = word
        } else line = test
      }
      if (line) { page.drawText(line, { x, y: curY, size, font, color }); curY -= lh }
      return curY
    }

    let y = 0
    function sectionHeader(label: string): void {
      page.drawRectangle({ x: margin, y: y - 12, width: 3, height: 14, color: orange })
      page.drawText(label, { x: margin + 9, y: y - 9, size: 8.5, font: fontBold, color: navy })
      y -= 12
      page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lgray })
      y -= 8
    }

    // ── HEADER ──────────────────────────────────────────────────────────
    const hH = 88
    page.drawRectangle({ x: 0, y: height - hH, width, height: hH, color: white })
    page.drawRectangle({ x: 0, y: height - 5,  width, height: 5,  color: orange })

    if (logoImg) {
      const logoH = 50, logoW = Math.round(logoH * (1408 / 768))
      page.drawImage(logoImg, { x: margin, y: height - 5 - 14 - logoH, width: logoW, height: logoH })
    }

    const rCol = width - margin
    const rLines = [
      { text: 'Aerefund',                            font: fontBold,   size: 9,   color: navy },
      { text: 'Keurenplein 24, 1069 CD Amsterdam',   font: fontNormal, size: 7.5, color: gray },
      { text: 'KvK 67332706',                        font: fontNormal, size: 7.5, color: gray },
      { text: 'claim@aerefund.com  |  aerefund.com', font: fontNormal, size: 7.5, color: gray },
    ] as const
    let ry = height - 5 - 14
    for (const l of rLines) {
      page.drawText(l.text, { x: rCol - l.font.widthOfTextAtSize(l.text, l.size), y: ry, size: l.size, font: l.font, color: l.color })
      ry -= 12
    }

    const badge = isEN ? 'LEGAL DOCUMENT' : 'JURIDISCH DOCUMENT'
    const bw = fontBold.widthOfTextAtSize(badge, 7) + 20
    const bh = 18, bx = width - margin - bw, by = height - 5 - hH + 10
    page.drawRectangle({ x: bx, y: by, width: bw, height: bh, color: navy })
    page.drawRectangle({ x: bx, y: by, width: 3,  height: bh, color: orange })
    page.drawText(badge, { x: bx + 11, y: by + 5, size: 7, font: fontBold, color: white })
    page.drawRectangle({ x: 0, y: height - hH, width, height: 1.5, color: navy })

    // ── TITLE ────────────────────────────────────────────────────────────
    y = height - hH - 20
    const docTitle    = isEN ? 'CONSENT DECLARATION  —  ASSIGNMENT OF RIGHTS' : 'AKKOORDVERKLARING VORDERINGSOVERDRACHT'
    const docSubtitle = isEN ? 'Proof of Consent  |  Assignment of Rights  |  EC 261/2004'
                              : 'Proof of Consent  |  Cessie ex art. 3:94 BW  |  EC 261/2004'
    page.drawText(docTitle,    { x: margin, y,      size: 13,  font: fontBold,   color: navy })
    page.drawText(docSubtitle, { x: margin, y: y - 14, size: 8.5, font: fontNormal, color: gray })
    page.drawRectangle({ x: margin, y: y - 21, width: cw, height: 2, color: orange })
    y -= 37

    // ── REFERENCE BANNER ─────────────────────────────────────────────────
    const bH = 42, col = cw / 3
    page.drawRectangle({ x: margin, y: y - bH, width: cw, height: bH, color: navy })
    for (const cx of [margin + col, margin + col * 2]) {
      page.drawLine({ start: { x: cx, y: y - 6 }, end: { x: cx, y: y - bH + 6 }, thickness: 0.5, color: rgb(0.15, 0.26, 0.44) })
    }
    page.drawText(isEN ? 'REFERENCE NUMBER' : 'REFERENTIENUMMER', { x: margin + 12,           y: y - 12, size: 6, font: fontBold,   color: blueHL })
    page.drawText(token || '-',                                    { x: margin + 12,           y: y - 29, size: 15, font: fontBold,  color: white })
    page.drawText(isEN ? 'FLIGHT' : 'VLUCHT',                     { x: margin + col + 12,     y: y - 12, size: 6, font: fontBold,   color: blueHL })
    page.drawText(flightNum || '-',                                { x: margin + col + 12,     y: y - 29, size: 13, font: fontBold,  color: white })
    page.drawText(isEN ? 'SUBMITTED ON' : 'INGEDIEND OP',         { x: margin + col * 2 + 12, y: y - 12, size: 6, font: fontBold,   color: blueHL })
    page.drawText(submittedDate,                                   { x: margin + col * 2 + 12, y: y - 27, size: 8.5, font: fontNormal, color: lightBl })
    y -= bH + 18

    // ── CLAIM DATA TABLE ──────────────────────────────────────────────────
    sectionHeader(isEN ? 'CLAIM DETAILS' : 'CLAIMGEGEVENS')

    // Truncate user agent for display (max ~80 chars)
    const uaDisplay = userAgent
      ? (userAgent.length > 80 ? userAgent.slice(0, 77) + '...' : userAgent)
      : '-'

    const tableRows: [string, string][] = isEN ? [
      ['Passenger name',       fullName],
      ['Email address',        email || '-'],
      ['Phone',                phone || '-'],
      ['Address',              addressLine],
      ['Flight number',        flightNum || '-'],
      ['Airline',              airline || '-'],
      ['Route',                origin && destination ? `${origin} > ${destination}` : '-'],
      ['Flight date',          flightDate || '-'],
      ['Claim type',           typeLabel],
      ['Submitter IP address', ipAddress ?? '-'],
      ['User agent',           uaDisplay],
    ] : [
      ['Naam passagier',    fullName],
      ['E-mailadres',       email || '-'],
      ['Telefoon',          phone || '-'],
      ['Adres',             addressLine],
      ['Vluchtnummer',      flightNum || '-'],
      ['Airline',           airline || '-'],
      ['Route',             origin && destination ? `${origin} > ${destination}` : '-'],
      ['Vluchtdatum',       flightDate || '-'],
      ['Type claim',        typeLabel],
      ['IP-adres indiener', ipAddress ?? '-'],
      ['User agent',        uaDisplay],
    ]

    const rH = 14, tH = tableRows.length * rH, split = margin + 148
    page.drawRectangle({ x: margin, y: y - tH, width: cw, height: tH, color: white, borderColor: lgray, borderWidth: 0.7 })
    for (let i = 0; i < tableRows.length; i++) {
      const [lbl, val] = tableRows[i]
      const bot = y - (i + 1) * rH
      if (i % 2 === 0) page.drawRectangle({ x: margin, y: bot, width: cw, height: rH, color: xlgray })
      page.drawText(lbl, { x: margin + 6, y: bot + 3.5, size: 7.5, font: fontBold,   color: gray })
      page.drawText(val, { x: split + 6,  y: bot + 3.5, size: 7.5, font: fontNormal, color: black })
      if (i < tableRows.length - 1) page.drawLine({ start: { x: margin, y: bot }, end: { x: width - margin, y: bot }, thickness: 0.3, color: lgray })
      page.drawLine({ start: { x: split, y: bot + rH }, end: { x: split, y: bot }, thickness: 0.3, color: lgray })
    }
    y -= tH + 16

    // ── CONSENT STATEMENTS ───────────────────────────────────────────────
    sectionHeader(isEN ? 'DECLARATIONS OF CONSENT' : 'AKKOORDVERKLARINGEN')

    const consentItems = isEN ? [
      {
        title: '1. Assignment of Rights and Instruction to Act',
        body:  `The passenger has instructed Aerefund to submit the compensation claim against ${airline || 'the airline'} under EC 261/2004, and transfers the right of claim to Aerefund (assignment pursuant to art. 3:94 Dutch Civil Code). The passenger agrees to the general terms and conditions and privacy policy of Aerefund. Aerefund collects the compensation as the rightful creditor and pays the net amount after deducting the service fee of EUR 42 and a 25% commission.`,
      },
      {
        title: '2. Waiver of Right of Withdrawal',
        body:  'The passenger explicitly waives the right of withdrawal, as Aerefund commences processing the claim immediately after submission.',
      },
    ] : [
      {
        title: '1. Vorderingsoverdracht en opdrachtverlening',
        body:  `De passagier heeft Aerefund opdracht gegeven de compensatieclaim in te dienen bij ${airline || 'de luchtvaartmaatschappij'} op grond van EC 261/2004, en draagt het vorderingsrecht over aan Aerefund (cessie ex art. 3:94 BW). De passagier stemt in met de algemene voorwaarden en privacyverklaring van Aerefund. Aerefund int de compensatie als eigen schuldeiser en betaalt het nettobedrag terug na aftrek van de servicenota van EUR 42 en 25% commissie.`,
      },
      {
        title: '2. Afstand herroepingsrecht',
        body:  'De passagier doet uitdrukkelijk afstand van het herroepingsrecht, omdat Aerefund direct na indiening start met de behandeling van de claim.',
      },
    ]

    for (const c of consentItems) {
      const cbSize = 12, cbX = margin + 8
      const topPad = 9, titleRowH = 14, gap = 5, botPad = 8
      const bodyMaxW = cw - 16
      let line = '', lines = 1
      for (const w of c.body.split(' ')) {
        const t = line ? `${line} ${w}` : w
        if (line && fontNormal.widthOfTextAtSize(t, 8.5) > bodyMaxW) { lines++; line = w } else line = t
      }
      const boxH = topPad + titleRowH + gap + lines * 12 + botPad
      page.drawRectangle({ x: margin, y: y - boxH, width: cw, height: boxH, color: greenBg, borderColor: rgb(0.6, 0.85, 0.65), borderWidth: 0.6 })
      const cbY = y - topPad - cbSize
      page.drawRectangle({ x: cbX, y: cbY, width: cbSize, height: cbSize, color: green })
      page.drawText('v', { x: cbX + 2.5, y: cbY + 2.5, size: 8, font: fontBold, color: white })
      page.drawText(c.title, { x: cbX + cbSize + 6, y: cbY + 3, size: 8.5, font: fontBold, color: navy })
      drawWrapped(c.body, margin + 8, y - topPad - titleRowH - gap, { font: fontNormal, size: 8.5, color: black, maxWidth: bodyMaxW, lineH: 12 })
      y -= boxH + 5
    }
    y -= 6

    // ── DECLARATION ──────────────────────────────────────────────────────
    sectionHeader(isEN ? 'DECLARATION' : 'VERKLARING')

    const declText = isEN
      ? `By submitting the claim via aerefund.com on ${submittedFormatted}, the passenger has digitally confirmed the above declarations of consent. The submission constitutes a legally valid electronic agreement pursuant to art. 6:227a Dutch Civil Code. This document has been automatically generated by the Aerefund platform and serves as proof of consent.`
      : `Door het indienen van de claim via aerefund.com op ${submittedFormatted} heeft de passagier bovenstaande akkoordverklaringen digitaal bevestigd. De indiening geldt als een rechtsgeldig elektronisch akkoord conform art. 6:227a BW. Dit document is automatisch gegenereerd door het Aerefund-platform en dient als bewijs van toestemming.`
    let dLine = ''; const dLines: string[] = []
    for (const w of declText.split(' ')) {
      const t = dLine ? `${dLine} ${w}` : w
      if (dLine && fontNormal.widthOfTextAtSize(t, 8.5) > cw - 18) { dLines.push(dLine); dLine = w } else dLine = t
    }
    if (dLine) dLines.push(dLine)
    const dBoxH = dLines.length * 12 + 14
    page.drawRectangle({ x: margin, y: y - dBoxH, width: cw, height: dBoxH, color: offW, borderColor: lgray, borderWidth: 0.6 })
    page.drawRectangle({ x: margin, y: y - dBoxH, width: 3,  height: dBoxH, color: orange })
    let dy = y - 9
    for (const l of dLines) { page.drawText(l, { x: margin + 10, y: dy, size: 8.5, font: fontNormal, color: black }); dy -= 12 }
    y -= dBoxH + 14

    // ── DIGITAL SEAL ─────────────────────────────────────────────────────
    sectionHeader(isEN ? 'DIGITAL SEAL' : 'DIGITAAL ZEGEL')

    const sH = 60, lc = margin + 10, vc = margin + 120, slH = 12
    page.drawRectangle({ x: margin, y: y - sH, width: cw, height: sH, color: sealBg, borderColor: sealBdr, borderWidth: 0.7 })
    page.drawRectangle({ x: margin, y: y - sH, width: 3,  height: sH, color: orange })
    let sy = y - 11
    page.drawText(isEN ? 'Algorithm'    : 'Algoritme',    { x: lc, y: sy, size: 7.5, font: fontBold,   color: gray })
    page.drawText('HMAC-SHA256',                           { x: vc, y: sy, size: 8,   font: fontBold,   color: navy }); sy -= slH
    page.drawText(isEN ? 'Key ID'       : 'Sleutel-ID',   { x: lc, y: sy, size: 7.5, font: fontBold,   color: gray })
    page.drawText('aerefund-consent-v1',                   { x: vc, y: sy, size: 7.5, font: fontNormal, color: black }); sy -= slH
    page.drawText(isEN ? 'Signature'    : 'Handtekening', { x: lc, y: sy, size: 7.5, font: fontBold,   color: gray })
    page.drawText(signature.slice(0, 32), { x: vc, y: sy, size: 7, font: fontMono, color: rgb(0.12, 0.22, 0.52) }); sy -= 10
    page.drawText(signature.slice(32),    { x: vc, y: sy, size: 7, font: fontMono, color: rgb(0.12, 0.22, 0.52) }); sy -= slH
    page.drawText(isEN ? 'Verification' : 'Verificatie',  { x: lc, y: sy, size: 7.5, font: fontBold,   color: gray })
    page.drawText(isEN ? 'claim@aerefund.com quoting reference number' : 'claim@aerefund.com o.v.v. referentienummer',
      { x: vc, y: sy, size: 7.5, font: fontNormal, color: black })

    // ── FOOTER ───────────────────────────────────────────────────────────
    const fY = 36, cx = width / 2
    page.drawLine({ start: { x: margin, y: fY + 22 }, end: { x: width - margin, y: fY + 22 }, thickness: 1.2, color: navy })
    page.drawLine({ start: { x: margin, y: fY + 20 }, end: { x: width - margin, y: fY + 20 }, thickness: 0.3, color: lgray })
    const f1 = 'Aerefund.com  |  Keurenplein 24, 1069 CD Amsterdam  |  KvK 67332706'
    const f2 = `Ref: ${token}  |  ${isEN ? 'Generated on' : 'Gegenereerd op'} ${new Date().toLocaleString(locale, { timeZone: 'Europe/Amsterdam' })}`
    page.drawText(f1, { x: cx - fontNormal.widthOfTextAtSize(f1, 7) / 2, y: fY + 10, size: 7, font: fontNormal, color: gray })
    page.drawText(f2, { x: cx - fontNormal.widthOfTextAtSize(f2, 7) / 2, y: fY - 1,  size: 7, font: fontNormal, color: rgb(0.60, 0.60, 0.60) })
  }

  drawPage(doc.addPage(PageSizes.A4), 'en')
  drawPage(doc.addPage(PageSizes.A4), 'nl')

  return Buffer.from(await doc.save())
}
