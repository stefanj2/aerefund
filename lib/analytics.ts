// GA4 event tracking utility
// Usage: trackEvent('claim_submitted', { airline: 'KL', amount: 400 })

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined | unknown[]>

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

function trackFunnelEvent(event: string, payload: Record<string, unknown>) {
  fetch('/api/track-funnel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...payload }),
  }).catch(() => {})
}

// ── Funnel events ──────────────────────────────────────────────────────────

export function trackFunnelStart(claimType: string) {
  trackEvent('funnel_start', { claim_type: claimType })
  trackFunnelEvent('funnel_start', { claim_type: claimType })
}

export function trackTypeSelected(claimType: string) {
  trackEvent('type_selected', { claim_type: claimType })
  trackFunnelEvent('type_selected', { claim_type: claimType })
}

export function trackDetailsComplete(params: {
  claimType: string
  hasStopover: boolean
  date: string
}) {
  trackEvent('details_complete', {
    claim_type:   params.claimType,
    has_stopover: params.hasStopover,
    flight_date:  params.date,
  })
  trackFunnelEvent('details_complete', { claim_type: params.claimType })
}

export function trackFlightSelected(params: {
  flightNumber: string
  airline: string
  iataPrefix: string
  claimType: string
  isManual: boolean
}) {
  trackEvent('flight_selected', {
    flight_number: params.flightNumber,
    airline:       params.airline,
    iata_prefix:   params.iataPrefix,
    claim_type:    params.claimType,
    is_manual:     params.isManual,
  })
  trackFunnelEvent('flight_selected', {
    claim_type:  params.claimType,
    iata_prefix: params.iataPrefix,
    is_manual:   params.isManual,
  })
}

export function trackResultViewed(params: {
  eligible: boolean
  amountPerPerson: number
  airline: string
  iataPrefix: string
  claimType: string
  distanceKm: number | null
}) {
  trackEvent(params.eligible ? 'result_eligible' : 'result_ineligible', {
    amount_per_person: params.amountPerPerson,
    airline:           params.airline,
    iata_prefix:       params.iataPrefix,
    claim_type:        params.claimType,
    distance_km:       params.distanceKm,
  })
  trackFunnelEvent(params.eligible ? 'result_eligible' : 'result_ineligible', {
    claim_type:        params.claimType,
    iata_prefix:       params.iataPrefix,
    amount_per_person: params.amountPerPerson,
  })
}

export function trackClaimStarted(params: {
  totalAmount: number
  amountPerPerson: number
  passengers: number
  airline: string
  iataPrefix: string
}) {
  trackEvent('claim_started', {
    total_amount:      params.totalAmount,
    amount_per_person: params.amountPerPerson,
    passengers:        params.passengers,
    airline:           params.airline,
    iata_prefix:       params.iataPrefix,
  })
  trackFunnelEvent('claim_started', {
    iata_prefix:       params.iataPrefix,
    amount_per_person: params.amountPerPerson,
  })
}

export function trackFormStepComplete(step: 1 | 2 | 3) {
  trackEvent('form_step_complete', { step })
}

// Conversion event — GA4 uses 'purchase' for monetary conversions
export function trackClaimSubmitted(params: {
  token: string | null
  totalAmount: number
  airline: string
  iataPrefix: string
  claimType: string
  passengers: number
}) {
  // Standard GA4 conversion event
  trackEvent('purchase', {
    transaction_id: params.token ?? undefined,
    value:          42,          // fixed fee = our revenue
    currency:       'EUR',
    items: [{
      item_name:     `Claim ${params.iataPrefix} – ${params.claimType}`,
      item_category: params.iataPrefix,
      item_category2: params.claimType,
      price:         42,
      quantity:      1,
    }],
  })

  // Custom event with more detail
  trackEvent('claim_submitted', {
    transaction_id:    params.token ?? undefined,
    total_amount:      params.totalAmount,
    airline:           params.airline,
    iata_prefix:       params.iataPrefix,
    claim_type:        params.claimType,
    passengers:        params.passengers,
    fixed_fee:         42,
  })
}
