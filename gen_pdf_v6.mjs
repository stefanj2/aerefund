import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib'
import { createHmac } from 'crypto'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const claim = JSON.parse(readFileSync('/tmp/claim_eevweb.json', 'utf8'))

async function generateConsentPdf(claim) {
  const doc  = await PDFDocument.create()
  const page = doc.addPage(PageSizes.A4)
  const { width, height } = page.getSize()

  const fBold   = await doc.embedFont(StandardFonts.HelveticaBold)
  const fNormal = await doc.embedFont(StandardFonts.Helvetica)
  const fMono   = await doc.embedFont(StandardFonts.Courier)
  const fTimes  = await doc.embedFont(StandardFonts.TimesRoman)

  const navy    = rgb(0.051, 0.106, 0.165)
  const orange  = rgb(1, 0.416, 0.169)
  const white   = rgb(1, 1, 1)
  const black   = rgb(0.08, 0.08, 0.08)
  const gray    = rgb(0.48, 0.48, 0.48)
  const lgray   = rgb(0.88, 0.88, 0.88)
  const xlgray  = rgb(0.96, 0.96, 0.96)
  const seal    = rgb(0.93, 0.96, 1.0)
  const sealBdr = rgb(0.70, 0.80, 0.96)
  const green   = rgb(0.13, 0.60, 0.27)
  const greenBg = rgb(0.90, 0.97, 0.92)
  const offW    = rgb(0.978, 0.980, 0.985)
  const blueHL  = rgb(0.45, 0.60, 0.82)
  const lightBl = rgb(0.75, 0.86, 0.96)

  const margin = 52, cw = width - margin * 2

  // ── Data ───────────────────────────────────────────────────────────────
  const token       = (claim.token ?? '').trim()
  const firstName   = (claim.first_name ?? '').trim()
  const lastName    = (claim.last_name  ?? '').trim()
  const email       = (claim.email ?? '').trim()
  const submittedAt = claim.submitted_at ?? ''
  const flight      = claim.flight_data ?? {}
  const flightNum   = (flight.flightNumber ?? '').trim()
  const flightDate  = (flight.date ?? '').trim()
  const origin      = (flight.origin ?? '').trim()
  const destination = (flight.destination ?? '').trim()
  const airline     = (flight.airline ?? '').trim()
  const claimType   = flight.type ?? 'delay'
  const ipAddress   = claim.ip_address ?? null
  const address     = (claim.address ?? '').trim()
  const postalCode  = (claim.postal_code ?? '').trim()
  const city        = (claim.city ?? '').trim()
  const phone       = (claim.phone ?? '').trim()

  const typeLabel = claimType === 'cancelled' || claimType === 'geannuleerd' ? 'Annulering'
    : claimType === 'denied' ? 'Instapweigering' : 'Vertraging'
  const submittedFmt = submittedAt
    ? new Date(submittedAt).toLocaleString('nl-NL', { dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Amsterdam' })
    : '-'
  const submittedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString('nl-NL', { dateStyle: 'long', timeZone: 'Europe/Amsterdam' })
    : '-'
  const addrLine = [address, [postalCode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || '-'
  const fullName = `${firstName} ${lastName}`.trim() || '-'

  // ── Wrap helper ────────────────────────────────────────────────────────
  function wrap(str, x, y0, opts) {
    const font  = opts.font  ?? fNormal
    const size  = opts.size  ?? 9
    const color = opts.color ?? black
    const lh    = opts.lh    ?? size + 3.5
    let line = '', y = y0
    for (const w of str.split(' ')) {
      const t = line ? `${line} ${w}` : w
      if (line && font.widthOfTextAtSize(t, size) > opts.maxW) {
        page.drawText(line, { x, y, size, font, color }); y -= lh; line = w
      } else line = t
    }
    if (line) { page.drawText(line, { x, y, size, font, color }); y -= lh }
    return y
  }

  // ─────────────────────────────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────────────────────────────
  const hH = 88
  page.drawRectangle({ x: 0, y: height - hH, width, height: hH, color: white })

  // Orange top bar
  page.drawRectangle({ x: 0, y: height - 5, width, height: 5, color: orange })

  // Logo
  const logoPng = readFileSync(join(process.cwd(), 'public', 'logo-aerefund.png'))
  const logoImg = await doc.embedPng(logoPng)
  const logoH = 50, logoW = Math.round(logoH * (1408 / 768))
  page.drawImage(logoImg, { x: margin, y: height - 5 - 14 - logoH, width: logoW, height: logoH })

  // Right side: company letterhead
  const rCol = width - margin
  const rLines = [
    { text: 'Aerefund', font: fBold, size: 9, color: navy },
    { text: 'Keurenplein 24, 1069 CD Amsterdam', font: fNormal, size: 7.5, color: gray },
    { text: 'KvK 67332706', font: fNormal, size: 7.5, color: gray },
    { text: 'claim@aerefund.com  |  aerefund.com', font: fNormal, size: 7.5, color: gray },
  ]
  let ry = height - 5 - 14
  for (const l of rLines) {
    const tw = l.font.widthOfTextAtSize(l.text, l.size)
    page.drawText(l.text, { x: rCol - tw, y: ry, size: l.size, font: l.font, color: l.color })
    ry -= 12
  }

  // "JURIDISCH DOCUMENT" badge — navy pill top-right corner
  const badge = 'JURIDISCH DOCUMENT'
  const bw = fBold.widthOfTextAtSize(badge, 7) + 20
  const bh = 18, bx = width - margin - bw, by = height - 5 - hH + 10
  page.drawRectangle({ x: bx, y: by, width: bw, height: bh, color: navy })
  // Orange left accent on badge
  page.drawRectangle({ x: bx, y: by, width: 3, height: bh, color: orange })
  page.drawText(badge, { x: bx + 11, y: by + 5, size: 7, font: fBold, color: white })

  // Thin navy bottom border on header
  page.drawRectangle({ x: 0, y: height - hH, width, height: 1.5, color: navy })

  // ─────────────────────────────────────────────────────────────────────
  // TITLE SECTION
  // ─────────────────────────────────────────────────────────────────────
  let y = height - hH - 20

  page.drawText('AKKOORDVERKLARING VORDERINGSOVERDRACHT', {
    x: margin, y, size: 14, font: fBold, color: navy,
  })
  y -= 14
  page.drawText('Proof of Consent  |  Cessie ex art. 3:94 BW  |  EC 261/2004', {
    x: margin, y, size: 8.5, font: fNormal, color: gray,
  })
  y -= 7
  // Orange accent under title, full cw
  page.drawRectangle({ x: margin, y, width: cw, height: 2, color: orange })
  y -= 16

  // ─────────────────────────────────────────────────────────────────────
  // REFERENCE BANNER (navy)
  // ─────────────────────────────────────────────────────────────────────
  const bH = 42, col = cw / 3
  page.drawRectangle({ x: margin, y: y - bH, width: cw, height: bH, color: navy })

  // Subtle column dividers
  for (const cx of [margin + col, margin + col * 2]) {
    page.drawLine({ start: { x: cx, y: y - 6 }, end: { x: cx, y: y - bH + 6 },
      thickness: 0.5, color: rgb(0.15, 0.26, 0.44) })
  }

  // Col 1: ref
  page.drawText('REFERENTIENUMMER', { x: margin + 12, y: y - 12, size: 6, font: fBold, color: blueHL })
  page.drawText(token || '-',        { x: margin + 12, y: y - 29, size: 15, font: fBold, color: white })

  // Col 2: flight
  page.drawText('VLUCHT',         { x: margin + col + 12, y: y - 12, size: 6, font: fBold, color: blueHL })
  page.drawText(flightNum || '-', { x: margin + col + 12, y: y - 29, size: 13, font: fBold, color: white })

  // Col 3: date
  page.drawText('INGEDIEND OP',     { x: margin + col * 2 + 12, y: y - 12, size: 6,   font: fBold,   color: blueHL })
  page.drawText(submittedDate,      { x: margin + col * 2 + 12, y: y - 27, size: 8.5, font: fNormal, color: lightBl })

  y -= bH + 18

  // ─────────────────────────────────────────────────────────────────────
  // SECTION HEADER helper — elegant: orange bar + navy text + rule
  // ─────────────────────────────────────────────────────────────────────
  function sectionHeader(label) {
    page.drawRectangle({ x: margin, y: y - 12, width: 3, height: 14, color: orange })
    page.drawText(label, { x: margin + 9, y: y - 9, size: 8.5, font: fBold, color: navy })
    y -= 12
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y },
      thickness: 0.5, color: lgray })
    y -= 8
  }

  // ─────────────────────────────────────────────────────────────────────
  // CLAIMGEGEVENS TABLE — clean, no alternating bg, just lines
  // ─────────────────────────────────────────────────────────────────────
  sectionHeader('CLAIMGEGEVENS')

  const rows = [
    ['Naam passagier',    fullName],
    ['E-mailadres',       email || '-'],
    ['Telefoon',          phone || '-'],
    ['Adres',             addrLine],
    ['Vluchtnummer',      flightNum || '-'],
    ['Airline',           airline || '-'],
    ['Route',             origin && destination ? `${origin} > ${destination}` : '-'],
    ['Vluchtdatum',       flightDate || '-'],
    ['Type claim',        typeLabel],
    ['IP-adres indiener', ipAddress ?? '-'],
  ]

  const rH = 14, split = margin + 145
  for (let i = 0; i < rows.length; i++) {
    const [lbl, val] = rows[i]
    const bot = y - (i + 1) * rH
    // Subtle stripe on even rows
    if (i % 2 === 0) page.drawRectangle({ x: margin, y: bot, width: cw, height: rH, color: xlgray })
    page.drawText(lbl, { x: margin + 6, y: bot + 3.5, size: 7.5, font: fBold,   color: gray })
    page.drawText(val, { x: split + 6,  y: bot + 3.5, size: 7.5, font: fNormal, color: black })
  }
  const tH = rows.length * rH
  // Draw outer border + column divider on top
  page.drawRectangle({ x: margin, y: y - tH, width: cw, height: tH, color: white, borderColor: lgray, borderWidth: 0.7 })
  for (let i = 0; i < rows.length; i++) {
    const [lbl, val] = rows[i]
    const bot = y - (i + 1) * rH
    if (i % 2 === 0) page.drawRectangle({ x: margin, y: bot, width: cw, height: rH, color: xlgray })
    page.drawText(lbl, { x: margin + 6, y: bot + 3.5, size: 7.5, font: fBold,   color: gray })
    page.drawText(val, { x: split + 6,  y: bot + 3.5, size: 7.5, font: fNormal, color: black })
    if (i < rows.length - 1) page.drawLine({ start:{x:margin,y:bot}, end:{x:width-margin,y:bot}, thickness:0.3, color:lgray })
    page.drawLine({ start:{x:split,y:bot+rH}, end:{x:split,y:bot}, thickness:0.3, color:lgray })
  }

  y -= tH + 16

  // ─────────────────────────────────────────────────────────────────────
  // AKKOORDVERKLARINGEN — checkbox style
  // ─────────────────────────────────────────────────────────────────────
  sectionHeader('AKKOORDVERKLARINGEN')

  const consents = [
    {
      title: '1. Vorderingsoverdracht en opdrachtverlening',
      body:  `De passagier heeft Aerefund opdracht gegeven de compensatieclaim in te dienen bij ${airline || 'de luchtvaartmaatschappij'} op grond van EC 261/2004, en draagt het vorderingsrecht over aan Aerefund (cessie ex art. 3:94 BW). De passagier stemt in met de algemene voorwaarden en privacyverklaring van Aerefund. Aerefund int de compensatie als eigen schuldeiser en betaalt het nettobedrag terug na aftrek van de servicenota van EUR 42 en 10% commissie.`,
    },
    {
      title: '2. Afstand herroepingsrecht',
      body:  'De passagier doet uitdrukkelijk afstand van het herroepingsrecht, omdat Aerefund direct na indiening start met de behandeling van de claim.',
    },
  ]

  for (const c of consents) {
    const cbSize = 12
    const cbX    = margin + 8
    const topPad = 9, titleRowH = 14, gap = 5, botPad = 8
    const bodyX  = margin + 8
    const bodyMaxW = cw - 16

    let line = '', lines = 1
    for (const w of c.body.split(' ')) {
      const t = line ? `${line} ${w}` : w
      if (line && fNormal.widthOfTextAtSize(t, 8.5) > bodyMaxW) { lines++; line = w } else line = t
    }
    const boxH = topPad + titleRowH + gap + lines * 12 + botPad

    page.drawRectangle({ x: margin, y: y - boxH, width: cw, height: boxH, color: greenBg, borderColor: rgb(0.6, 0.85, 0.65), borderWidth: 0.6 })

    // Checkbox: top of checkbox at y - topPad
    const cbY = y - topPad - cbSize
    page.drawRectangle({ x: cbX, y: cbY, width: cbSize, height: cbSize, color: green })
    page.drawText('v', { x: cbX + 2.5, y: cbY + 2.5, size: 8, font: fBold, color: white })

    // Title: vertically centered with checkbox
    page.drawText(c.title, { x: cbX + cbSize + 6, y: cbY + 3, size: 8.5, font: fBold, color: navy })

    // Body: starts below title row, full width
    wrap(c.body, bodyX, y - topPad - titleRowH - gap, { font: fNormal, size: 8.5, color: black, maxW: bodyMaxW, lh: 12 })
    y -= boxH + 5
  }

  y -= 6

  // ─────────────────────────────────────────────────────────────────────
  // VERKLARING
  // ─────────────────────────────────────────────────────────────────────
  sectionHeader('VERKLARING')

  const declText = `Door het indienen van de claim via aerefund.com op ${submittedFmt} heeft de passagier bovenstaande akkoordverklaringen digitaal bevestigd. De indiening geldt als een rechtsgeldig elektronisch akkoord conform art. 6:227a BW. Dit document is automatisch gegenereerd door het Aerefund-platform en dient als bewijs van toestemming.`
  let dLine = ''; const dLines = []
  for (const w of declText.split(' ')) {
    const t = dLine ? `${dLine} ${w}` : w
    if (dLine && fNormal.widthOfTextAtSize(t, 8.5) > cw - 18) { dLines.push(dLine); dLine = w } else dLine = t
  }
  if (dLine) dLines.push(dLine)
  const dBoxH = dLines.length * 12 + 14
  page.drawRectangle({ x: margin, y: y - dBoxH, width: cw, height: dBoxH, color: offW, borderColor: lgray, borderWidth: 0.6 })
  // Orange left bar on declaration
  page.drawRectangle({ x: margin, y: y - dBoxH, width: 3, height: dBoxH, color: orange })
  let dy = y - 9
  for (const l of dLines) {
    page.drawText(l, { x: margin + 10, y: dy, size: 8.5, font: fNormal, color: black })
    dy -= 12
  }
  y -= dBoxH + 14

  // ─────────────────────────────────────────────────────────────────────
  // DIGITAAL ZEGEL
  // ─────────────────────────────────────────────────────────────────────
  sectionHeader('DIGITAAL ZEGEL')

  const secret = '6ae85a19e282716412078bc2191e8302183794c22633ff8e1a3cde1a2d96facf'
  const canonical = [token, fullName, email, submittedAt, ipAddress ?? '', flightNum, flightDate].join('|')
  const signature = createHmac('sha256', secret).update(canonical).digest('hex')

  const sH = 60, lc = margin + 10, vc = margin + 120, lh = 12
  page.drawRectangle({ x: margin, y: y - sH, width: cw, height: sH, color: seal, borderColor: sealBdr, borderWidth: 0.7 })
  page.drawRectangle({ x: margin, y: y - sH, width: 3,  height: sH, color: orange })

  let sy = y - 11
  page.drawText('Algoritme',           { x: lc, y: sy, size: 7.5, font: fBold,   color: gray })
  page.drawText('HMAC-SHA256',         { x: vc, y: sy, size: 8,   font: fBold,   color: navy }); sy -= lh
  page.drawText('Sleutel-ID',          { x: lc, y: sy, size: 7.5, font: fBold,   color: gray })
  page.drawText('aerefund-consent-v1', { x: vc, y: sy, size: 7.5, font: fNormal, color: black }); sy -= lh
  page.drawText('Handtekening',        { x: lc, y: sy, size: 7.5, font: fBold,   color: gray })
  page.drawText(signature.slice(0,32), { x: vc, y: sy, size: 7,   font: fMono,   color: rgb(0.12,0.22,0.52) }); sy -= 10
  page.drawText(signature.slice(32),   { x: vc, y: sy, size: 7,   font: fMono,   color: rgb(0.12,0.22,0.52) }); sy -= lh
  page.drawText('Verificatie',         { x: lc, y: sy, size: 7.5, font: fBold,   color: gray })
  page.drawText('claim@aerefund.com o.v.v. referentienummer', { x: vc, y: sy, size: 7.5, font: fNormal, color: black })

  // ─────────────────────────────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────────────────────────────
  const fY = 36, cx = width / 2
  page.drawLine({ start:{x:margin,y:fY+22}, end:{x:width-margin,y:fY+22}, thickness:1.2, color:navy })
  page.drawLine({ start:{x:margin,y:fY+20}, end:{x:width-margin,y:fY+20}, thickness:0.3, color:lgray })

  const f1 = 'Aerefund.com  |  Keurenplein 24, 1069 CD Amsterdam  |  KvK 67332706'
  const f2 = `Referentie: ${token}  |  Gegenereerd op ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`
  page.drawText(f1, { x: cx - fNormal.widthOfTextAtSize(f1,7)/2, y: fY+10, size:7, font:fNormal, color:gray })
  page.drawText(f2, { x: cx - fNormal.widthOfTextAtSize(f2,7)/2, y: fY-1,  size:7, font:fNormal, color:rgb(0.60,0.60,0.60) })

  return Buffer.from(await doc.save())
}

const pdf = await generateConsentPdf(claim)
writeFileSync('/tmp/akkoordverklaring-v6.pdf', pdf)
console.log('Klaar: /tmp/akkoordverklaring-v6.pdf')
