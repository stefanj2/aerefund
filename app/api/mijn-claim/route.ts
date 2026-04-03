import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

type Note = {
  id: string
  timestamp: string
  type: 'status_change' | 'note'
  text: string
  prev_status?: string
  new_status?: string
}

const STATUS_LABELS: Record<string, string> = {
  result_viewed: 'Resultaat bekeken',
  submitted: 'Ingediend',
  invoice_sent: 'Factuur verstuurd',
  invoice_paid: 'Factuur betaald',
  claim_filed: 'Claim ingediend bij airline',
  in_progress: 'In behandeling',
  won: 'Claim gewonnen',
  compensation_paid: 'Compensatie uitbetaald',
  rejected: 'Afgewezen door airline',
  appeal_filed: 'Bezwaar ingediend',
  closed: 'Afgesloten',
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')?.toUpperCase().replace(/\s/g, '')
  if (!token) return NextResponse.json({ found: false })

  const db = getSupabase()
  if (!db) return NextResponse.json({ found: false })

  const { data, error } = await db
    .from('claims')
    .select(
      'token, status, first_name, flight_data, compensation, passengers, ' +
      'notes, iban, boarding_pass_filename, consent_pdf_filename, ' +
      'payout_status, payout_amount, payout_net_amount, payout_sent_at, ' +
      'created_at, updated_at'
    )
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ found: false })

  // Cast to Record to avoid strict Supabase typing issues with optional columns
  const d = data as unknown as Record<string, unknown>

  // Check id_copy_filename separately (may not exist pre-migration)
  let hasIdCopy = false
  const { data: idData, error: idErr } = await db
    .from('claims')
    .select('id_copy_filename')
    .eq('token', token)
    .single()
  if (!idErr) hasIdCopy = !!(idData as Record<string, unknown>)?.id_copy_filename

  // Build timeline from status_change notes
  const notes: Note[] = (d.notes as Note[]) ?? []
  const timeline = notes
    .filter((n) => n.type === 'status_change')
    .map((n) => ({
      date: n.timestamp,
      label: n.new_status ? (STATUS_LABELS[n.new_status] ?? n.new_status) : n.text,
    }))

  // Extract flight info safely
  const fd = d.flight_data as Record<string, unknown> | null
  const comp = d.compensation as Record<string, unknown> | null

  return NextResponse.json({
    found: true,
    token: d.token,
    status: d.status ?? 'submitted',
    statusLabel: STATUS_LABELS[d.status as string] ?? (d.status as string) ?? 'Onbekend',
    firstName: d.first_name ?? null,
    flight: {
      flightNumber: fd?.flightNumber ?? fd?.flight_number ?? null,
      airline: fd?.airline ?? fd?.iataPrefix ?? null,
      date: fd?.date ?? null,
      origin: fd?.origin ?? fd?.departureAirport ?? null,
      destination: fd?.destination ?? fd?.arrivalAirport ?? null,
      type: fd?.type ?? null,
    },
    compensation: {
      amountPerPerson: comp?.amountPerPerson ?? comp?.amount ?? null,
      eligible: comp?.eligible ?? null,
      reason: comp?.reason ?? null,
    },
    passengers: d.passengers ?? 1,
    timeline,
    documents: {
      hasIban: !!d.iban,
      hasBoardingPass: !!d.boarding_pass_filename,
      hasIdCopy,
      hasConsentPdf: !!d.consent_pdf_filename,
    },
    payout: {
      status: d.payout_status ?? 'pending',
      amount: (d.payout_net_amount ?? d.payout_amount) ?? null,
      sentAt: d.payout_sent_at ?? null,
    },
    aanvullenUrl: `/aanvullen?token=${d.token}`,
  })
}
