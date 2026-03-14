'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

// ── Types ────────────────────────────────────────────────────────────────────

type Note = {
  id: string
  timestamp: string
  type: 'status_change' | 'note'
  text: string
  prev_status?: string
  new_status?: string
}

type CoPassenger = { firstName: string; lastName: string; email: string }

type Claim = {
  token: string
  status: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  iban: string | null
  passengers: number | null
  co_passengers: CoPassenger[] | null
  boarding_pass_filename: string | null
  id_copy_filename: string | null
  flight_data: {
    flightNumber?: string
    airline?: string
    iataPrefix?: string
    origin?: string
    destination?: string
    date?: string
    type?: string
    delayMinutes?: number
    distanceKm?: number
    scheduledDeparture?: string | null
    actualArrival?: string | null
    found?: boolean
  } | null
  compensation: { amountPerPerson?: number; eligible?: boolean; reason?: string } | null
  notes: Note[] | null
  admin_notes: string | null
  invoice_number: string | null
  created_at: string
  submitted_at: string | null
  updated_at: string | null
  payout_status: string | null
  payout_amount: number | null
  payout_net_amount: number | null
  payout_received_at: string | null
  payout_sent_at: string | null
  airline_emails: AirlineEmailEntry[] | null
}

type AirlineEmailEntry = {
  id: string
  received_at: string
  from: string
  subject: string
  body_text: string
  source: 'manual' | 'webhook'
}

// ── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  result_viewed:     { label: 'Bekeken',               color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
  submitted:         { label: 'Ingediend',             color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  invoice_sent:      { label: 'Factuur verstuurd',     color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  invoice_paid:      { label: 'Factuur betaald',       color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  claim_filed:       { label: 'Claim ingediend',       color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  in_progress:       { label: 'In behandeling',        color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  won:               { label: 'Gewonnen',               color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  compensation_paid: { label: 'Uitbetaald',            color: '#047857', bg: '#D1FAE5', border: '#6EE7B7' },
  rejected:          { label: 'Afgewezen',             color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  appeal_filed:      { label: 'Bezwaar ingediend',     color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  closed:            { label: 'Gesloten',              color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
}

const STATUS_ORDER = [
  'submitted', 'invoice_sent', 'invoice_paid', 'claim_filed', 'in_progress', 'won', 'compensation_paid',
]

const ALL_STATUSES = Object.keys(STATUS_CONFIG).filter(s => s !== 'result_viewed')

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.3rem 0.75rem', borderRadius: '20px',
      fontSize: '0.75rem', fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}

function Card({ children, title, noPad }: { children: React.ReactNode; title?: string; noPad?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden',
      marginBottom: '1rem',
    }}>
      {title && (
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6' }}>
          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#111827', fontFamily: 'var(--font-sora)' }}>
            {title}
          </h3>
        </div>
      )}
      <div style={noPad ? {} : { padding: '1.125rem 1.25rem' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.6rem' }}>
      <span style={{ fontSize: '0.8rem', color: '#9CA3AF', flexShrink: 0, lineHeight: 1.5 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'monospace' : undefined, lineHeight: 1.5 }}>
        {value || '—'}
      </span>
    </div>
  )
}

function fmt(n: number) { return `€${Math.round(n).toLocaleString('nl-NL')}` }

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtDateTime(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Payout ───────────────────────────────────────────────────────────────────

const PAYOUT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:                { label: 'Wacht op uitbetaling airline', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  received_from_airline:  { label: 'Ontvangen van airline',        color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  forwarded_to_customer:  { label: 'Doorgestort naar klant',       color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  failed:                 { label: 'Fout bij uitbetaling',         color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
}

function PayoutSection({ claim, token, onSave }: { claim: Claim; token: string; onSave: () => void }) {
  const [payoutStatus, setPayoutStatus] = useState(claim.payout_status ?? 'pending')
  const [grossAmount, setGrossAmount] = useState(claim.payout_amount != null ? String(claim.payout_amount) : '')
  const [netAmount, setNetAmount] = useState(claim.payout_net_amount != null ? String(claim.payout_net_amount) : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [netOverride, setNetOverride] = useState(false)

  function recalcNet(gross: string) {
    const g = parseFloat(gross)
    if (!isNaN(g) && g > 0) {
      const net = Math.max(0, g - 42 - g * 0.10)
      setNetAmount(net.toFixed(2))
    } else {
      setNetAmount('')
    }
  }

  function handleGrossChange(val: string) {
    setGrossAmount(val)
    if (!netOverride) recalcNet(val)
  }

  async function handleSave() {
    setSaving(true)
    const body: Record<string, unknown> = { payout_status: payoutStatus }
    if (grossAmount) body.payout_amount = parseFloat(grossAmount)
    if (netAmount)   body.payout_net_amount = parseFloat(netAmount)
    if (payoutStatus === 'received_from_airline' && claim.payout_received_at == null) {
      body.payout_received_at = new Date().toISOString()
    }
    if (payoutStatus === 'forwarded_to_customer' && claim.payout_sent_at == null) {
      body.payout_sent_at = new Date().toISOString()
    }
    const res = await fetch(`/api/admin/claims/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      onSave()
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const cfg = PAYOUT_STATUS_CONFIG[payoutStatus] ?? PAYOUT_STATUS_CONFIG.pending

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden',
      marginBottom: '1rem',
    }}>
      <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#111827', fontFamily: 'var(--font-sora)' }}>
          Uitbetaling bijhouden
        </h3>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0.25rem 0.625rem', borderRadius: '20px',
          fontSize: '0.72rem', fontWeight: 700,
          color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.border}`,
        }}>
          {cfg.label}
        </span>
      </div>
      <div style={{ padding: '1.125rem 1.25rem' }}>

        {/* IBAN reminder */}
        {claim.iban && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '0.625rem 0.875rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1" y="4" width="12" height="8" rx="1.5" stroke="#1D4ED8" strokeWidth="1.4" />
              <path d="M4 4V3a3 3 0 0 1 6 0v1" stroke="#1D4ED8" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
              {claim.iban}
            </span>
          </div>
        )}

        {/* Payout status */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Status uitbetaling
          </label>
          <select
            value={payoutStatus}
            onChange={e => setPayoutStatus(e.target.value)}
            style={{
              width: '100%', padding: '0.5625rem 0.75rem',
              borderRadius: '8px', border: '1.5px solid #E5E7EB',
              fontSize: '0.875rem', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
            }}
          >
            {Object.entries(PAYOUT_STATUS_CONFIG).map(([val, c]) => (
              <option key={val} value={val}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Gross amount */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Bruto ontvangen van airline (€)
          </label>
          <input
            type="number" step="0.01" min="0"
            value={grossAmount}
            onChange={e => handleGrossChange(e.target.value)}
            placeholder="bijv. 250.00"
            style={{
              width: '100%', padding: '0.5625rem 0.75rem',
              borderRadius: '8px', border: '1.5px solid #E5E7EB',
              fontSize: '0.875rem', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Net amount */}
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Netto naar klant (€){' '}
            <span style={{ fontSize: '0.65rem', fontWeight: 400, color: '#9CA3AF' }}>
              {netOverride ? '(handmatig)' : '(auto: bruto − €42 − 10%)'}
            </span>
          </label>
          <input
            type="number" step="0.01" min="0"
            value={netAmount}
            onChange={e => { setNetAmount(e.target.value); setNetOverride(true) }}
            placeholder="bijv. 183.00"
            style={{
              width: '100%', padding: '0.5625rem 0.75rem',
              borderRadius: '8px', border: `1.5px solid ${netOverride ? '#F59E0B' : '#E5E7EB'}`,
              fontSize: '0.875rem', background: netOverride ? '#FFFBEB' : '#F9FAFB', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {netOverride && (
            <button
              onClick={() => { setNetOverride(false); recalcNet(grossAmount) }}
              style={{ fontSize: '0.72rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.25rem', padding: 0 }}
            >
              ↺ Herstel auto-berekening
            </button>
          )}
        </div>

        {/* Timestamps */}
        {(claim.payout_received_at || claim.payout_sent_at) && (
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.75rem', lineHeight: 1.8 }}>
            {claim.payout_received_at && <div>Ontvangen: {fmtDateTime(claim.payout_received_at)}</div>}
            {claim.payout_sent_at && <div>Doorgestort: {fmtDateTime(claim.payout_sent_at)}</div>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: '0.625rem',
              borderRadius: '8px', border: 'none',
              background: saving ? '#E5E7EB' : saved ? '#059669' : '#1D4ED8',
              color: saving ? '#9CA3AF' : '#fff',
              fontWeight: 700, fontSize: '0.875rem',
              cursor: saving ? 'default' : 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-sora)',
            }}
          >
            {saving ? 'Opslaan…' : saved ? '✓ Opgeslagen' : 'Opslaan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stepper ──────────────────────────────────────────────────────────────────

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const idx = STATUS_ORDER.indexOf(currentStatus)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {STATUS_ORDER.map((s, i) => {
        const cfg = STATUS_CONFIG[s]
        const done = idx >= i
        const active = idx === i
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
              minWidth: '72px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: done ? cfg.color : '#E5E7EB',
                border: `2px solid ${done ? cfg.color : '#E5E7EB'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? `0 0 0 3px ${cfg.bg}` : 'none',
                transition: 'all 0.2s',
              }}>
                {done && i < idx ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: done ? '#fff' : '#D1D5DB' }} />
                )}
              </div>
              <span style={{
                fontSize: '0.62rem', fontWeight: active ? 700 : 400,
                color: active ? cfg.color : done ? '#6B7280' : '#D1D5DB',
                textAlign: 'center', lineHeight: 1.3, maxWidth: '68px',
              }}>
                {cfg.label}
              </span>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <div style={{
                height: '2px', width: '20px', flexShrink: 0, marginBottom: '20px',
                background: i < idx ? STATUS_CONFIG[STATUS_ORDER[i + 1]]?.color ?? '#E5E7EB' : '#E5E7EB',
                transition: 'background 0.2s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ClaimDetailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Status update form
  const [newStatus, setNewStatus] = useState('')
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Claimbrief
  const [letterSending, setLetterSending] = useState(false)
  const [letterResult, setLetterResult] = useState<{ ok: boolean; msg: string; sentTo?: string } | null>(null)

  // Resend aanvullen email
  const [aanvullenSending, setAanvullenSending] = useState(false)
  const [aanvullenResult, setAanvullenResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // Airline emails — manual entry form
  const [emailFrom, setEmailFrom] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch(`/api/admin/claims/${token}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => { if (data) setClaim(data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!newStatus && !noteText.trim()) return
    setSaving(true)
    setSaveMsg('')

    const body: Record<string, string> = {}
    if (newStatus) body.status = newStatus
    if (noteText.trim()) body.note = noteText.trim()

    const res = await fetch(`/api/admin/claims/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setNoteText('')
      setNewStatus('')
      setSaveMsg('Opgeslagen!')
      load()
      setTimeout(() => setSaveMsg(''), 2500)
    } else {
      setSaveMsg('Fout bij opslaan.')
    }
    setSaving(false)
  }

  async function handleSendLetter() {
    setLetterSending(true)
    setLetterResult(null)
    try {
      const res = await fetch('/api/admin/send-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setLetterResult({ ok: true, msg: 'Claimbrief verstuurd!', sentTo: data.sentTo })
        load()
      } else {
        setLetterResult({ ok: false, msg: data.error ?? 'Versturen mislukt.' })
      }
    } catch {
      setLetterResult({ ok: false, msg: 'Netwerk fout bij versturen.' })
    }
    setLetterSending(false)
  }

  async function handleResendAanvullen() {
    setAanvullenSending(true)
    setAanvullenResult(null)
    try {
      const res = await fetch('/api/admin/resend-aanvullen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAanvullenResult({ ok: true, msg: `Email verstuurd naar ${data.sentTo}` })
      } else {
        setAanvullenResult({ ok: false, msg: data.error ?? 'Versturen mislukt.' })
      }
    } catch {
      setAanvullenResult({ ok: false, msg: 'Netwerk fout bij versturen.' })
    }
    setAanvullenSending(false)
  }

  async function handleAddEmail() {
    if (!emailBody.trim()) return
    setEmailSaving(true)
    setEmailMsg('')
    const res = await fetch(`/api/admin/claims/${token}/airline-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: emailFrom, subject: emailSubject, body_text: emailBody }),
    })
    if (res.ok) {
      setEmailFrom('')
      setEmailSubject('')
      setEmailBody('')
      setEmailMsg('Opgeslagen!')
      load()
      setTimeout(() => setEmailMsg(''), 2500)
    } else {
      setEmailMsg('Opslaan mislukt.')
    }
    setEmailSaving(false)
  }

  async function handleDeleteEmail(id: string) {
    await fetch(`/api/admin/claims/${token}/airline-email`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#9CA3AF', fontSize: '0.875rem' }}>
      Laden…
    </div>
  )

  if (notFound || !claim) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
      Claim niet gevonden.
    </div>
  )

  const flight = claim.flight_data
  const comp = claim.compensation
  const totalAmount = (comp?.amountPerPerson ?? 0) * (claim.passengers ?? 1)
  const notes = (claim.notes ?? []).slice().reverse()
  const airlinePrefix = flight?.iataPrefix ?? flight?.flightNumber?.replace(/\d.*$/, '')

  return (
    <div style={{ padding: '1.75rem 2rem 3rem', maxWidth: '1100px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => router.push('/admin/claims')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.375rem 0.75rem', borderRadius: '8px',
            background: '#fff', border: '1.5px solid #E5E7EB',
            fontSize: '0.8rem', fontWeight: 500, color: '#6B7280',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Claims
        </button>

        <code style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', background: '#F3F4F6', padding: '0.3rem 0.6rem', borderRadius: '6px', letterSpacing: '0.05em' }}>
          {claim.token}
        </code>

        <StatusBadge status={claim.status} />

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
          Ingediend: {fmtDateTime(claim.submitted_at)}
        </span>
      </div>

      {/* Flight summary header */}
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
        padding: '1.25rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        {/* Airline logo */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden',
          border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#F9FAFB', flexShrink: 0,
        }}>
          {airlinePrefix ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://www.gstatic.com/flights/airline_logos/70px/${airlinePrefix}.png`}
              alt={flight?.airline ?? airlinePrefix}
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
              onError={e => {
                const el = e.currentTarget
                el.style.display = 'none'
                const parent = el.parentElement
                if (parent) parent.innerHTML = `<span style="font-size:0.7rem;font-weight:700;color:#374151">${airlinePrefix}</span>`
              }}
            />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2h0A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" fill="#9CA3AF" />
            </svg>
          )}
        </div>

        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-sora)', marginBottom: '0.25rem' }}>
            {flight?.flightNumber ?? '—'} &nbsp;·&nbsp; {flight?.airline ?? 'Onbekende airline'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {flight?.origin && flight?.destination && (
              <span>{flight.origin} → {flight.destination}</span>
            )}
            {flight?.date && <span>{fmtDate(flight.date)}</span>}
            {(flight?.delayMinutes ?? 0) > 0 && (
              <span style={{ color: '#DC2626', fontWeight: 600 }}>+{flight!.delayMinutes} min vertraging</span>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-sora)' }}>
            {fmt(totalAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
            {claim.passengers ?? 1} passagier{(claim.passengers ?? 1) !== 1 ? 's' : ''} × {fmt(comp?.amountPerPerson ?? 0)}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.125rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <StatusStepper currentStatus={claim.status} />
        {['rejected', 'appeal_filed', 'closed'].includes(claim.status) && (
          <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 500, marginTop: '-0.5rem' }}>
            Status: {STATUS_CONFIG[claim.status]?.label} — niet op de standaard tijdlijn.
          </div>
        )}
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.25rem', alignItems: 'start' }}>

        {/* LEFT — Info */}
        <div>

          {/* Customer */}
          <Card title="Klantgegevens">
            <Row label="Naam" value={[claim.first_name, claim.last_name].filter(Boolean).join(' ')} />
            <Row label="Email" value={claim.email} />
            <Row label="Telefoon" value={claim.phone} />
            <Row label="Adres" value={claim.address} />
            <Row label="Postcode / Stad" value={[claim.postal_code, claim.city].filter(Boolean).join(' ')} />
            {claim.iban && <Row label="IBAN" value={claim.iban} mono />}
          </Card>

          {/* Flight data */}
          <Card title="Vluchtgegevens">
            <Row label="Vluchtnummer" value={flight?.flightNumber} />
            <Row label="Datum" value={fmtDate(flight?.date)} />
            <Row label="Type" value={flight?.type} />
            <Row label="Vertrek (gepland)" value={flight?.scheduledDeparture ?? undefined} />
            <Row label="Aankomst (werkelijk)" value={flight?.actualArrival ?? undefined} />
            <Row label="Vertraging" value={(flight?.delayMinutes ?? 0) > 0 ? `${flight!.delayMinutes} minuten` : 'Onbekend'} />
            <Row label="Afstand" value={flight?.distanceKm ? `${Math.round(flight.distanceKm).toLocaleString('nl-NL')} km` : undefined} />
            <Row label="Gevonden in DB" value={flight?.found === true ? 'Ja' : flight?.found === false ? 'Nee' : '—'} />
            <Row label="Compensatie reden" value={comp?.reason} />
          </Card>

          {/* Co-passengers */}
          {(claim.co_passengers?.length ?? 0) > 0 && (
            <Card title={`Medereizgers (${claim.co_passengers!.length})`}>
              {claim.co_passengers!.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < claim.co_passengers!.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                    {p.firstName} {p.lastName}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{p.email || '—'}</span>
                </div>
              ))}
            </Card>
          )}

          {/* Documents */}
          <Card title="Documenten">
            {claim.boarding_pass_filename ? (
              <BoardingPassDownload token={token} filename={claim.boarding_pass_filename} />
            ) : (
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>Geen boardingpass geüpload.</p>
            )}
            {claim.id_copy_filename ? (
              <div style={{ marginTop: claim.boarding_pass_filename ? '0.625rem' : 0 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.375rem' }}>ID-kopie</p>
                <IdCopyDownload token={token} filename={claim.id_copy_filename} />
              </div>
            ) : (
              <p style={{ margin: claim.boarding_pass_filename ? '0.5rem 0 0' : '0', fontSize: '0.875rem', color: '#9CA3AF' }}>Geen ID-kopie geüpload.</p>
            )}
          </Card>

          {/* Airline emails */}
          <Card title={`Airline-reacties${(claim.airline_emails?.length ?? 0) > 0 ? ` (${claim.airline_emails!.length})` : ''}`} noPad>

            {/* Received emails list */}
            {(claim.airline_emails?.length ?? 0) === 0 ? (
              <p style={{ margin: 0, padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                Nog geen reacties ontvangen.
              </p>
            ) : (
              <div style={{ borderBottom: '1px solid #F3F4F6' }}>
                {[...(claim.airline_emails ?? [])].reverse().map((em, i) => (
                  <div key={em.id} style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: i < (claim.airline_emails!.length - 1) ? '1px solid #F9FAFB' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          {em.source === 'webhook' ? (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '0.1rem 0.45rem' }}>
                              auto
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '0.1rem 0.45rem' }}>
                              handmatig
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{fmtDateTime(em.received_at)}</span>
                        </div>
                        <p style={{ margin: '0 0 0.125rem', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {em.from}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {em.subject}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                        <button
                          onClick={() => setExpandedEmailId(expandedEmailId === em.id ? null : em.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          {expandedEmailId === em.id ? 'Sluiten' : 'Lezen'}
                        </button>
                        <button
                          onClick={() => handleDeleteEmail(em.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#FCA5A5' }}
                          title="Verwijderen"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 3h8M5 3V2h2v1M4 3v6h4V3H4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {expandedEmailId === em.id && (
                      <div style={{
                        marginTop: '0.75rem', padding: '0.75rem',
                        background: '#F9FAFB', borderRadius: '6px',
                        fontSize: '0.8rem', color: '#374151',
                        whiteSpace: 'pre-wrap', lineHeight: 1.65,
                        maxHeight: '300px', overflowY: 'auto',
                        fontFamily: 'monospace',
                      }}>
                        {em.body_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add email form */}
            <div style={{ padding: '1rem 1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Reactie toevoegen
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  value={emailFrom}
                  onChange={e => setEmailFrom(e.target.value)}
                  placeholder="Van (e-mailadres airline)"
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
                    borderRadius: '8px', border: '1.5px solid #E5E7EB',
                    fontSize: '0.8125rem', background: '#F9FAFB', outline: 'none',
                  }}
                />
                <input
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Onderwerp"
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
                    borderRadius: '8px', border: '1.5px solid #E5E7EB',
                    fontSize: '0.8125rem', background: '#F9FAFB', outline: 'none',
                  }}
                />
                <textarea
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder="Plak hier de volledige e-mailtekst van de airline…"
                  rows={4}
                  style={{
                    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
                    borderRadius: '8px', border: '1.5px solid #E5E7EB',
                    fontSize: '0.8125rem', background: '#F9FAFB', outline: 'none',
                    resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={handleAddEmail}
                    disabled={emailSaving || !emailBody.trim()}
                    style={{
                      flex: 1, padding: '0.5rem',
                      borderRadius: '8px', border: 'none',
                      background: emailSaving || !emailBody.trim() ? '#E5E7EB' : '#374151',
                      color: emailSaving || !emailBody.trim() ? '#9CA3AF' : '#fff',
                      fontWeight: 700, fontSize: '0.8125rem',
                      cursor: emailSaving || !emailBody.trim() ? 'default' : 'pointer',
                      fontFamily: 'var(--font-sora)',
                    }}
                  >
                    {emailSaving ? 'Opslaan…' : 'Reactie opslaan'}
                  </button>
                  {emailMsg && (
                    <span style={{ fontSize: '0.78rem', color: emailMsg.includes('mislukt') ? '#DC2626' : '#059669', fontWeight: 500 }}>
                      {emailMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT — Actions + Log */}
        <div>

          {/* Claimbrief */}
          <Card title="Claimbrief versturen">
            <p style={{ margin: '0 0 0.875rem', fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
              Verstuurt een formele cessie-claimbrief (art. 3:94 BW) per e-mail naar de airline. Status wordt automatisch bijgewerkt naar &ldquo;Claim ingediend&rdquo;.
            </p>
            {claim.status === 'claim_filed' && !letterResult && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px',
                padding: '0.625rem 0.875rem', marginBottom: '0.875rem',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" stroke="#7C3AED" strokeWidth="1.4" />
                  <path d="M7 4v3.5l2 1.5" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: 500 }}>
                  Al eerder ingediend — opnieuw versturen is mogelijk.
                </span>
              </div>
            )}
            <button
              onClick={handleSendLetter}
              disabled={letterSending}
              style={{
                width: '100%', padding: '0.625rem',
                borderRadius: '8px', border: 'none',
                background: letterSending ? '#E5E7EB' : '#0D1B2A',
                color: letterSending ? '#9CA3AF' : '#fff',
                fontWeight: 700, fontSize: '0.875rem',
                cursor: letterSending ? 'default' : 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-sora)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {!letterSending && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 2.5l11 4.5-11 4.5V9l7-2-7-2V2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              )}
              {letterSending ? 'Versturen…' : 'Verstuur claimbrief'}
            </button>
            {letterResult && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                background: letterResult.ok ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${letterResult.ok ? '#A7F3D0' : '#FECACA'}`,
              }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: letterResult.ok ? '#059669' : '#DC2626' }}>
                  {letterResult.msg}
                </p>
                {letterResult.sentTo && (
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6B7280' }}>
                    Verstuurd naar: {letterResult.sentTo}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Status update */}
          <Card title="Status wijzigen">
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
                Nieuwe status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                style={{
                  width: '100%', padding: '0.5625rem 0.75rem',
                  borderRadius: '8px', border: '1.5px solid #E5E7EB',
                  fontSize: '0.875rem', color: newStatus ? '#111827' : '#9CA3AF',
                  background: '#F9FAFB', outline: 'none', boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="">— Selecteer status —</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s} disabled={s === claim.status}>
                    {STATUS_CONFIG[s]?.label ?? s}{s === claim.status ? ' (huidig)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
                Notitie (optioneel)
              </label>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Interne aantekening bij deze statuswijziging…"
                rows={3}
                style={{
                  width: '100%', padding: '0.5625rem 0.75rem',
                  borderRadius: '8px', border: '1.5px solid #E5E7EB',
                  fontSize: '0.8125rem', color: '#111827',
                  background: '#F9FAFB', outline: 'none',
                  resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleSave}
                disabled={saving || (!newStatus && !noteText.trim())}
                style={{
                  flex: 1, padding: '0.625rem',
                  borderRadius: '8px', border: 'none',
                  background: saving || (!newStatus && !noteText.trim()) ? '#E5E7EB' : '#1D4ED8',
                  color: saving || (!newStatus && !noteText.trim()) ? '#9CA3AF' : '#fff',
                  fontWeight: 700, fontSize: '0.875rem',
                  cursor: saving || (!newStatus && !noteText.trim()) ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-sora)',
                }}
              >
                {saving ? 'Opslaan…' : 'Opslaan'}
              </button>
              {saveMsg && (
                <span style={{ fontSize: '0.8rem', color: saveMsg.includes('Fout') ? '#DC2626' : '#059669', fontWeight: 500 }}>
                  {saveMsg}
                </span>
              )}
            </div>
          </Card>

          {/* Payout tracking — only when won or compensation_paid */}
          {(claim.status === 'won' || claim.status === 'compensation_paid') && (
            <PayoutSection claim={claim} token={token} onSave={load} />
          )}

          {/* Invoice number */}
          <Card title="Factuurnummer">
            <InvoiceField token={token} initial={claim.invoice_number} onSave={load} />
          </Card>

          {/* Resend aanvullen email */}
          <Card title="Documenten herinnering">
            <p style={{ margin: '0 0 0.875rem', fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
              Stuurt opnieuw de herinnering voor IBAN, boardingpass en ID-kopie naar de klant.
            </p>
            <button
              onClick={handleResendAanvullen}
              disabled={aanvullenSending || !claim.email}
              style={{
                width: '100%', padding: '0.625rem',
                borderRadius: '8px', border: 'none',
                background: aanvullenSending || !claim.email ? '#E5E7EB' : '#374151',
                color: aanvullenSending || !claim.email ? '#9CA3AF' : '#fff',
                fontWeight: 700, fontSize: '0.875rem',
                cursor: aanvullenSending || !claim.email ? 'default' : 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-sora)',
              }}
            >
              {aanvullenSending ? 'Versturen…' : 'Herinner documenten'}
            </button>
            {!claim.email && (
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: '#DC2626' }}>
                Geen e-mailadres bekend.
              </p>
            )}
            {aanvullenResult && (
              <div style={{
                marginTop: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: '8px',
                background: aanvullenResult.ok ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${aanvullenResult.ok ? '#A7F3D0' : '#FECACA'}`,
              }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: aanvullenResult.ok ? '#059669' : '#DC2626' }}>
                  {aanvullenResult.msg}
                </p>
              </div>
            )}
          </Card>

          {/* Activity log */}
          <Card title={`Activiteiten (${notes.length})`} noPad>
            {notes.length === 0 ? (
              <p style={{ margin: 0, padding: '1rem 1.25rem', fontSize: '0.8125rem', color: '#9CA3AF' }}>
                Nog geen activiteit.
              </p>
            ) : (
              <div>
                {notes.map((note, i) => (
                  <div key={note.id} style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: i < notes.length - 1 ? '1px solid #F9FAFB' : 'none',
                    display: 'flex', gap: '0.75rem',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: note.type === 'status_change' ? '#EFF6FF' : '#F5F3FF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {note.type === 'status_change' ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M1 9V2h10v7H7l-3 2V9H1z" stroke="#7C3AED" strokeWidth="1.3" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.2rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
                        {note.text}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>
                        {fmtDateTime(note.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  )
}

// ── Boarding pass download component ─────────────────────────────────────────

function BoardingPassDownload({ token, filename }: { token: string; filename: string }) {
  const [loading, setLoading] = useState(false)
  const isStoragePath = filename.includes('/')

  async function download() {
    if (!isStoragePath) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/boarding-pass/${token}`)
      if (res.ok) {
        const { url } = await res.json()
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
        <path d="M4 2h7l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 2v4h4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {filename.split('/').pop() ?? filename}
      </span>
      {isStoragePath && (
        <button
          onClick={download}
          disabled={loading}
          style={{
            padding: '0.375rem 0.75rem', borderRadius: '7px',
            border: '1.5px solid #E5E7EB', background: loading ? '#F3F4F6' : '#fff',
            fontSize: '0.8rem', fontWeight: 600, color: '#1D4ED8',
            cursor: loading ? 'default' : 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #ddd', borderTopColor: '#1D4ED8', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 2v6M3.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 10.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          Download
        </button>
      )}
    </div>
  )
}

// ── ID copy download component ────────────────────────────────────────────────

function IdCopyDownload({ token, filename }: { token: string; filename: string }) {
  const [loading, setLoading] = useState(false)
  const isStoragePath = filename.includes('/')

  async function download() {
    if (!isStoragePath) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/id-copy/${token}`)
      if (res.ok) {
        const { url } = await res.json()
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
        <rect x="2" y="2" width="14" height="11" rx="2" stroke="#6B7280" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="6" cy="7" r="1.5" stroke="#6B7280" strokeWidth="1.2" />
        <path d="M9 6h4M9 8.5h3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {filename.split('/').pop() ?? filename}
      </span>
      {isStoragePath && (
        <button
          onClick={download}
          disabled={loading}
          style={{
            padding: '0.375rem 0.75rem', borderRadius: '7px',
            border: '1.5px solid #E5E7EB', background: loading ? '#F3F4F6' : '#fff',
            fontSize: '0.8rem', fontWeight: 600, color: '#1D4ED8',
            cursor: loading ? 'default' : 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #ddd', borderTopColor: '#1D4ED8', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 2v6M3.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 10.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          Download
        </button>
      )}
    </div>
  )
}

// ── Invoice field component ───────────────────────────────────────────────────

function InvoiceField({ token, initial, onSave }: { token: string; initial: string | null; onSave: () => void }) {
  const [value, setValue] = useState(initial ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/claims/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_number: value }),
    })
    setSaving(false)
    setSaved(true)
    onSave()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="bijv. FAC-2024-001"
        style={{
          flex: 1, padding: '0.5rem 0.625rem',
          borderRadius: '7px', border: '1.5px solid #E5E7EB',
          fontSize: '0.8125rem', color: '#111827',
          background: '#F9FAFB', outline: 'none',
        }}
      />
      <button
        onClick={save}
        disabled={saving}
        style={{
          padding: '0.5rem 0.875rem',
          borderRadius: '7px', border: 'none',
          background: saved ? '#059669' : '#1D4ED8',
          color: '#fff', fontWeight: 600,
          fontSize: '0.8rem', cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        {saving ? '…' : saved ? '✓' : 'Opslaan'}
      </button>
    </div>
  )
}
