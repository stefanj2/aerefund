import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { buildDossierZip } from '@/lib/dossier'

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json().catch(() => ({}))
  const { legalPartnerEmail, notes: adminNotes } = body as { legalPartnerEmail?: string; notes?: string }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  // 1. Fetch claim
  const { data: claim, error } = await db
    .from('claims')
    .select('*')
    .eq('token', token.toUpperCase())
    .single()

  if (error || !claim) return NextResponse.json({ error: 'Claim niet gevonden' }, { status: 404 })

  // 2. Build dossier ZIP
  let zipBuffer: Buffer
  try {
    zipBuffer = await buildDossierZip(token)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fout bij genereren dossier'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // 3. Determine recipient
  const recipientEmail = legalPartnerEmail?.trim()
    || process.env.LEGAL_PARTNER_EMAIL
    || process.env.ADMIN_EMAIL
    || 'info@aerefund.com'

  // 4. Extract claim details for email
  const flight = (claim.flight_data ?? {}) as Record<string, unknown>
  const flightNumber = ((flight.flightNumber as string) ?? '').trim() || 'Onbekend'
  const airline = ((flight.airline as string) ?? '').trim() || 'Onbekende airline'
  const origin = ((flight.origin as string) ?? '').trim()
  const destination = ((flight.destination as string) ?? '').trim()
  const flightDate = ((flight.date as string) ?? '').trim()
  const flightType = ((flight.type as string) ?? 'delay').trim()
  const firstName = ((claim.first_name as string) ?? '').trim()
  const lastName = ((claim.last_name as string) ?? '').trim()
  const fullName = `${firstName} ${lastName}`.trim() || 'Onbekend'
  const comp = (claim.compensation ?? {}) as Record<string, unknown>
  const amountPerPerson = (comp.amountPerPerson as number) ?? 0
  const passengers = (claim.passengers as number) ?? 1
  const totalCompensation = amountPerPerson * passengers
  const claimStatus = (claim.status as string) ?? 'onbekend'

  // Timeline summary
  const existingNotes: Note[] = ((claim.notes as Note[]) ?? [])
  const timelineSummary = existingNotes.length > 0
    ? existingNotes.slice(-5).map(n =>
        `${new Date(n.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })} — ${n.text}`
      ).join('<br>')
    : 'Geen activiteiten gelogd.'

  // Type labels
  const typeLabels: Record<string, string> = {
    delay: 'Vertraging',
    cancellation: 'Annulering',
    denied_boarding: 'Instapweigering',
  }

  // 5. Send email via Resend
  const subject = `Escalatie dossier ${token.toUpperCase()} — ${flightNumber} (${airline})`
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; color: #333;">
      <h2 style="color: #0D1B2A; margin-bottom: 0.5rem;">Escalatie dossier ${token.toUpperCase()}</h2>
      <p style="color: #6B7280; margin-top: 0;">Dit dossier wordt geëscaleerd voor juridische behandeling.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151; width: 180px;">Referentie</td>
          <td style="padding: 0.5rem 0;">${token.toUpperCase()}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Passagier</td>
          <td style="padding: 0.5rem 0;">${fullName}${passengers > 1 ? ` (+${passengers - 1} medepassagier${passengers > 2 ? 's' : ''})` : ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Vlucht</td>
          <td style="padding: 0.5rem 0;">${flightNumber} — ${airline}${origin && destination ? ` (${origin} → ${destination})` : ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Datum</td>
          <td style="padding: 0.5rem 0;">${flightDate || 'Onbekend'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Type</td>
          <td style="padding: 0.5rem 0;">${typeLabels[flightType] ?? flightType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Compensatie</td>
          <td style="padding: 0.5rem 0;">&euro;${Math.round(totalCompensation).toLocaleString('nl-NL')} (${passengers}x &euro;${Math.round(amountPerPerson).toLocaleString('nl-NL')})</td>
        </tr>
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 0.5rem 0; font-weight: 600; color: #374151;">Status</td>
          <td style="padding: 0.5rem 0;">${claimStatus}</td>
        </tr>
      </table>

      <h3 style="color: #0D1B2A; margin-bottom: 0.5rem;">Recente tijdlijn</h3>
      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0.875rem; font-size: 0.875rem; line-height: 1.7; color: #374151;">
        ${timelineSummary}
      </div>

      ${adminNotes ? `
      <h3 style="color: #0D1B2A; margin-top: 1.5rem; margin-bottom: 0.5rem;">Opmerkingen bij escalatie</h3>
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 0.875rem; font-size: 0.875rem; line-height: 1.5; color: #92400E;">
        ${adminNotes.replace(/\n/g, '<br>')}
      </div>
      ` : ''}

      <p style="margin-top: 1.5rem; color: #6B7280; font-size: 0.875rem; line-height: 1.6;">
        In bijlage vindt u het volledige dossier inclusief akkoordverklaring, boardingpass, ID-kopie en correspondentiegeschiedenis.
      </p>

      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 1.5rem 0;" />
      <p style="color: #9CA3AF; font-size: 0.75rem;">
        Aerefund — GoodbyeGuru, KvK 67332706<br>
        Keurenplein 24, 1069 CD Amsterdam
      </p>
    </div>
  `

  const { error: sendError } = await resend.emails.send({
    from: FROM,
    to: recipientEmail,
    subject,
    html: htmlBody,
    attachments: [
      {
        filename: `dossier-${token.toUpperCase()}.zip`,
        content: zipBuffer.toString('base64'),
      },
    ],
  })

  if (sendError) {
    return NextResponse.json({ error: `E-mail versturen mislukt: ${sendError.message}` }, { status: 500 })
  }

  // 6. Update claim in Supabase
  const now = new Date().toISOString()
  const newNote: Note = {
    id: crypto.randomUUID(),
    timestamp: now,
    type: 'status_change',
    text: `Dossier geëscaleerd naar juridisch partner: ${recipientEmail}`,
  }

  const updatedNotes = [...existingNotes, newNote]

  const { error: updateError } = await db
    .from('claims')
    .update({
      escalated_at: now,
      escalated_to: recipientEmail,
      notes: updatedNotes,
      updated_at: now,
    })
    .eq('token', token.toUpperCase())

  if (updateError) {
    // Try without escalated columns in case migration hasn't been run
    const isMissingColumn = updateError.message?.includes('column') && updateError.message?.includes('does not exist')
    if (isMissingColumn) {
      await db
        .from('claims')
        .update({ notes: updatedNotes, updated_at: now })
        .eq('token', token.toUpperCase())
    }
  }

  return NextResponse.json({ success: true, sentTo: recipientEmail })
}
