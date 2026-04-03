/**
 * Inbound email webhook — receives parsed emails from Resend inbound routing.
 *
 * Setup (one-time):
 * 1. In Resend dashboard → Domains → add inbound domain (e.g. reply.aerefund.com)
 * 2. Add MX record: reply.aerefund.com → feedback-smtp.eu-west-1.amazonses.com (or Resend's MX)
 * 3. In Resend → Webhooks → add this endpoint URL for "email.received" events
 * 4. Set env var RESEND_WEBHOOK_SECRET to your webhook signing secret
 *
 * The claimbrief sets replyTo = claim+{TOKEN}@aerefund.com
 * so we extract the token from the To: address first, then fall back to subject.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

const FROM        = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'info@aerefund.com'

export const runtime = 'nodejs'

// Token regex: 5-8 uppercase alphanumeric characters
const TOKEN_RE = /\b([A-Z0-9]{5,8})\b/g

type AirlineEmail = {
  id: string
  received_at: string
  from: string
  subject: string
  body_text: string
  source: 'manual' | 'webhook'
}

function extractToken(to: string | string[], subject: string, bodyText: string): string | null {
  // 1. Try claim+TOKEN@ in To: address (most reliable)
  const toAddresses = Array.isArray(to) ? to : [to]
  for (const addr of toAddresses) {
    const plusMatch = addr.match(/claim\+([A-Z0-9]{5,8})@/i)
    if (plusMatch) return plusMatch[1].toUpperCase()
  }

  // 2. Try "Ref: TOKEN" in subject
  const refMatch = subject?.match(/Ref[:\s]+([A-Z0-9]{5,8})/i)
  if (refMatch) return refMatch[1].toUpperCase()

  // 3. Try scanning body for tokens that look like claim references
  const bodyMatch = bodyText?.match(/Ref[:\s]+([A-Z0-9]{5,8})/i)
  if (bodyMatch) return bodyMatch[1].toUpperCase()

  return null
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Resend inbound webhook shape: { type: 'email.received', data: { from, to, subject, text, html, ... } }
    const data = payload?.data ?? payload

    const from       = data?.from    ?? data?.sender ?? ''
    const toRaw      = data?.to      ?? data?.recipient ?? ''
    const subject    = data?.subject ?? ''
    const bodyText   = data?.text    ?? ''

    if (!from) {
      return NextResponse.json({ error: 'Geen afzender' }, { status: 400 })
    }

    const token = extractToken(toRaw, subject, bodyText)

    if (!token) {
      console.warn('inbound-email: kon geen token extracten uit:', { to: toRaw, subject })
      // Accept the webhook (don't return error) but log it; Resend will retry on errors
      return NextResponse.json({ received: true, matched: false })
    }

    const db = getSupabase()
    if (!db) return NextResponse.json({ error: 'Database niet beschikbaar' }, { status: 500 })

    // Fetch existing airline_emails for this claim
    const { data: claim, error: fetchErr } = await db
      .from('claims')
      .select('airline_emails')
      .eq('token', token)
      .single()

    if (fetchErr || !claim) {
      console.warn('inbound-email: claim niet gevonden voor token', token)
      return NextResponse.json({ received: true, matched: false })
    }

    const existing: AirlineEmail[] = (claim.airline_emails as AirlineEmail[]) ?? []

    const newEmail: AirlineEmail = {
      id:          crypto.randomUUID(),
      received_at: new Date().toISOString(),
      from,
      subject:     subject || '(geen onderwerp)',
      body_text:   bodyText.trim() || '(geen inhoud)',
      source:      'webhook',
    }

    await db
      .from('claims')
      .update({
        airline_emails: [...existing, newEmail],
        updated_at: new Date().toISOString(),
      })
      .eq('token', token)

    console.log(`inbound-email: opgeslagen voor claim ${token} van ${from}`)

    // ─── Keyword analysis: detect airline response intent ───────────────
    const suggestion = analyzeAirlineResponse(subject, bodyText)
    if (suggestion) {
      console.log(`inbound-email: auto-detectie voor ${token}: ${suggestion}`)

      await db
        .from('claims')
        .update({
          auto_status_suggestion: suggestion,
          updated_at: new Date().toISOString(),
        })
        .eq('token', token)

      // Notify admin
      const labelMap: Record<string, string> = {
        approved_payment: 'Betaling/compensatie bevestigd',
        approved: 'Claim goedgekeurd',
        rejected_force_majeure: 'Afgewezen — buitengewone omstandigheden',
        rejected: 'Afgewezen',
        info_request: 'Aanvullende informatie gevraagd',
        counter_offer: 'Tegenaanbod/voucher',
      }

      await resend.emails.send({
        from: `Aerefund <${FROM}>`,
        to: ADMIN_EMAIL,
        subject: `Automatische detectie: claim ${token} — ${labelMap[suggestion] ?? suggestion}`,
        html: `<p>Er is een e-mail ontvangen voor claim <strong>${token}</strong> van <strong>${from}</strong>.</p>
<p>Onderwerp: <em>${subject || '(geen onderwerp)'}</em></p>
<p>Automatische classificatie: <strong>${labelMap[suggestion] ?? suggestion}</strong></p>
<p><a href="https://aerefund.com/admin/claims/${token}">Bekijk het dossier &rarr;</a></p>`,
        text: `Automatische detectie: claim ${token} — ${labelMap[suggestion] ?? suggestion}\nVan: ${from}\nOnderwerp: ${subject}\nBekijk: https://aerefund.com/admin/claims/${token}`,
      })
    }

    return NextResponse.json({ received: true, matched: true, token, suggestion: suggestion ?? undefined })
  } catch (err) {
    console.error('inbound-email webhook error:', err)
    return NextResponse.json({ error: 'Verwerking mislukt' }, { status: 500 })
  }
}

// ─── Airline response keyword analysis ──────────────────────────────────────

function analyzeAirlineResponse(subject: string, body: string): string | null {
  const text = `${subject} ${body}`.toLowerCase()

  // Approved/payment patterns (Dutch + English + German)
  if (/compensati.{0,20}(betaald|overgemaakt|uitgekeerd|paid|transferred|credited)/.test(text)) return 'approved_payment'
  if (/akkoord|goedgekeurd|approved|accepted|genehmigt/.test(text)) return 'approved'

  // Rejected patterns
  if (/buitengewone omstandigh|extraordinary circumstance|au[sß]ergew[öo]hnlich/.test(text)) return 'rejected_force_majeure'
  if (/afgewezen|rejected|denied|abgelehnt|niet.{0,10}in aanmerking/.test(text)) return 'rejected'

  // Info request
  if (/aanvullende (informatie|documenten)|additional (information|documents)|weitere (informationen|unterlagen)/.test(text)) return 'info_request'

  // Counter offer
  if (/aanbod|offer|angebot|tegemoetkoming|goodwill|voucher/.test(text)) return 'counter_offer'

  return null
}
