'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIRPORTS } from '@/lib/airports'
import AirportCombobox from '@/components/AirportCombobox'
import FunnelNav from '@/components/FunnelNav'
import FunnelSidebar from '@/components/FunnelSidebar'
import { suggestVia } from '@/lib/via-suggestions'
import { trackDetailsComplete } from '@/lib/analytics'
import type { RouteSearchParams, CancellationNotice, CauseType } from '@/lib/types'

export default function SelecteerDetailsPage() {
  const router = useRouter()
  const [params, setParams] = useState<RouteSearchParams | null>(null)

  // Tussenstop
  const [stopover, setStopover] = useState<'yes' | 'no' | null>(null)
  const [viaAirports, setViaAirports] = useState<string[]>([])
  const [addingVia, setAddingVia] = useState(false)
  const [singleBooking, setSingleBooking] = useState<'single' | 'separate' | null>(null)

  // Annulering 2-step matrix
  const [noticeWindow, setNoticeWindow] = useState<'gt14days' | 'd7_13' | 'lt7' | 'no_notice' | null>(null)
  const [alternativeAdequate, setAlternativeAdequate] = useState<boolean | null>(null)
  const [cancellationNotice, setCancellationNotice] = useState<CancellationNotice | null>(null)
  const [causeType, setCauseType] = useState<CauseType | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('vv_route_search')
    if (!raw) { router.replace('/'); return }
    const p = JSON.parse(raw) as RouteSearchParams
    if (!p.type) { router.replace('/selecteer/type'); return }
    setParams(p)
    if (p.stopover) setStopover(p.stopover)
    if (p.viaAirports) { setViaAirports(p.viaAirports); if (p.viaAirports.length > 0) setAddingVia(false) }
    if (p.singleBooking) setSingleBooking(p.singleBooking)
    if (p.cancellationNotice) {
      setCancellationNotice(p.cancellationNotice)
      // Reconstruct notice window from stored cancellationNotice
      if (p.cancellationNotice === 'gt14days') setNoticeWindow('gt14days')
      else if (p.cancellationNotice === 'no_notice') setNoticeWindow('no_notice')
      else if (p.cancellationNotice === 'd7_13_ok' || p.cancellationNotice === 'd7_13_bad') {
        setNoticeWindow('d7_13')
        setAlternativeAdequate(p.cancellationNotice === 'd7_13_ok')
      } else if (p.cancellationNotice === 'lt7_ok' || p.cancellationNotice === 'lt7_bad') {
        setNoticeWindow('lt7')
        setAlternativeAdequate(p.cancellationNotice === 'lt7_ok')
      }
    }
    if (p.causeType) setCauseType(p.causeType)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function save(patch: Partial<RouteSearchParams>) {
    setParams(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...patch }
      sessionStorage.setItem('vv_route_search', JSON.stringify(updated))
      return updated
    })
  }

  function handleStopover(val: 'yes' | 'no') {
    setStopover(val)
    setViaAirports([])
    setAddingVia(val === 'yes')
    setSingleBooking(null)
    save({ stopover: val, viaAirports: [], singleBooking: undefined })
  }

  function addVia(iata: string) {
    const next = [...viaAirports, iata]
    setViaAirports(next)
    setAddingVia(false)
    save({ viaAirports: next })
  }

  function removeVia(idx: number) {
    const next = viaAirports.filter((_, i) => i !== idx)
    setViaAirports(next)
    if (next.length === 0) setAddingVia(true)
    save({ viaAirports: next })
  }

  function handleSingleBooking(val: 'single' | 'separate') {
    setSingleBooking(val)
    save({ singleBooking: val })
  }

  function handleNoticeWindow(win: 'gt14days' | 'd7_13' | 'lt7' | 'no_notice') {
    setNoticeWindow(win)
    setAlternativeAdequate(null)
    if (win === 'gt14days') { setCancellationNotice('gt14days'); save({ cancellationNotice: 'gt14days' }) }
    else if (win === 'no_notice') { setCancellationNotice('no_notice'); save({ cancellationNotice: 'no_notice' }) }
  }

  function handleAlternativeAdequate(adequate: boolean) {
    setAlternativeAdequate(adequate)
    if (noticeWindow === 'd7_13') {
      const val = adequate ? 'd7_13_ok' : 'd7_13_bad'
      setCancellationNotice(val); save({ cancellationNotice: val })
    } else if (noticeWindow === 'lt7') {
      const val = adequate ? 'lt7_ok' : 'lt7_bad'
      setCancellationNotice(val); save({ cancellationNotice: val })
    }
  }

  function handleCauseType(val: CauseType) {
    setCauseType(val)
    save({ causeType: val })
  }

  function handleDateChange(newDate: string) {
    save({ date: newDate })
  }

  // Validation: can we proceed?
  const dateDone = !!params?.date
  const stopoverDone = stopover !== null
  const viaComplete = stopover !== 'yes' || (viaAirports.length > 0 && !addingVia)
  const noticeDone = params?.type !== 'geannuleerd' || (
    noticeWindow === 'gt14days' || noticeWindow === 'no_notice' ||
    ((noticeWindow === 'd7_13' || noticeWindow === 'lt7') && alternativeAdequate !== null)
  )
  const causeDone = params?.type !== 'geannuleerd' || causeType !== null
  const canProceed = dateDone && stopoverDone && viaComplete && noticeDone && causeDone

  const originName = params ? (AIRPORTS[params.origin]?.name ?? params.origin) : ''
  const destinationName = params ? (AIRPORTS[params.destination]?.name ?? params.destination) : ''
  const formatDate = (d: string) =>
    new Date(d + 'T12:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      <FunnelNav step={1} progress={33} />

      <div className="funnel-grid" style={{ paddingTop: '2.5rem' }}>
        <div>

          {/* Route strip */}
          {params && (
            <div className="animate-fade-up d1" style={{
              background: '#fff', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '1.25rem 1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {params.origin}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--blue-light)', borderRadius: '6px', padding: '0.25rem 0.625rem' }}>
                  <svg width="18" height="8" viewBox="0 0 24 10" fill="none">
                    <path d="M0 5h20M16 2l4 3-4 3" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-sora)', fontWeight: 900, fontSize: '2rem', color: 'var(--navy)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {params.destination}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {originName} → {destinationName}
                </span>
                {params.type && (
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px',
                    background: params.type === 'geannuleerd' ? 'var(--red-dim)' : params.type === 'geweigerd' ? 'var(--orange-dim)' : params.type === 'downgrade' ? 'rgba(139,92,246,0.1)' : 'var(--blue-light)',
                    color: params.type === 'geannuleerd' ? 'var(--red)' : params.type === 'geweigerd' ? 'var(--orange)' : params.type === 'downgrade' ? '#7c3aed' : 'var(--blue)',
                    border: `1px solid ${params.type === 'geannuleerd' ? 'rgba(220,38,38,0.2)' : params.type === 'geweigerd' ? 'rgba(249,115,22,0.2)' : params.type === 'downgrade' ? 'rgba(139,92,246,0.25)' : 'var(--blue-border)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push('/selecteer/type')}
                  >
                    {{ vertraagd: 'Vertraging', geannuleerd: 'Annulering', geweigerd: 'Instapweigering', downgrade: 'Klasseverlaging' }[params.type]}
                    {' '}✎
                  </span>
                )}
              </div>
            </div>
          )}

          <h2 style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Vluchtdetails
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            {params?.type === 'geannuleerd'
              ? 'Nog een paar korte vragen zodat we precies weten wat je recht hebt.'
              : 'Bijna klaar — één vraag nog voor we je vlucht opzoeken.'}
          </p>

          {/* Datum */}
          {params && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
                Wanneer vloog je?
              </label>
              <input
                type="date"
                value={params.date ?? ''}
                onChange={e => handleDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min={new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="input-field full-width-mobile"
                style={{ colorScheme: 'light', maxWidth: '220px' }}
              />
              {params.date && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  {formatDate(params.date)}
                </p>
              )}
            </div>
          )}

          {/* Tussenstop */}
          {params && (
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
                Had je een tussenstop?
              </p>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                {([
                  { val: 'no' as const, label: 'Nee, directe vlucht', sub: 'Ik vloog rechtstreeks van A naar B',
                    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg> },
                  { val: 'yes' as const, label: 'Ja, met overstap', sub: 'Mijn vlucht had één of meer stops',
                    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="4" cy="10" r="2" fill="currentColor" /><circle cx="10" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="10" r="2" fill="currentColor" /><path d="M6 10C7 8 8.5 6 10 6M10 6C11.5 6 13 8 14 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> },
                ]).map(opt => (
                  <button key={opt.val} type="button" onClick={() => handleStopover(opt.val)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem',
                      padding: '1rem 1.125rem', borderRadius: '12px', cursor: 'pointer',
                      border: `2px solid ${stopover === opt.val ? 'var(--blue)' : 'var(--border)'}`,
                      background: stopover === opt.val ? 'var(--blue-light)' : '#fff',
                      transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <span style={{ color: stopover === opt.val ? 'var(--blue)' : 'var(--text-muted)' }}>{opt.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: stopover === opt.val ? 'var(--blue)' : 'var(--text)' }}>
                        {opt.label}
                      </span>
                      {stopover === opt.val && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" fill="var(--blue)" />
                          <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-sub)', paddingLeft: '1.75rem' }}>{opt.sub}</span>
                  </button>
                ))}
              </div>

              {/* Via airports */}
              {stopover === 'yes' && (
                <div style={{ marginTop: '1rem' }}>
                  {viaAirports.map((iata, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '0.625rem',
                        background: 'var(--blue-light)', border: '1.5px solid var(--blue-border)',
                        borderRadius: '8px', padding: '0.625rem 1rem',
                      }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stop {idx + 1}</span>
                        <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-sora)', color: 'var(--blue)' }}>{iata}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{AIRPORTS[iata]?.name ?? iata}</span>
                      </div>
                      <button type="button" onClick={() => removeVia(idx)} style={{
                        background: 'none', border: '1.5px solid var(--border)', borderRadius: '8px',
                        padding: '0.75rem 1rem', cursor: 'pointer', color: 'var(--text-muted)',
                        fontSize: '0.8rem', fontWeight: 600, minHeight: '44px',
                      }}>
                        Verwijder
                      </button>
                    </div>
                  ))}
                  {addingVia && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>
                        {viaAirports.length === 0 ? 'Via welke luchthaven?' : `Stop ${viaAirports.length + 1}`}
                      </label>
                      <div style={{ background: '#fff', borderRadius: '8px', border: '1.5px solid var(--border)', overflow: 'visible', position: 'relative' }}>
                        <AirportCombobox
                          value=""
                          onChange={addVia}
                          placeholder="Tussenstop luchthaven (bijv. Dubai)"
                          inputStyle={{ padding: '0.8125rem 1rem' }}
                          suggestions={params && viaAirports.length === 0 ? suggestVia(params.origin, params.destination) : undefined}
                          suggestionsLabel={params && viaAirports.length === 0 ? `Logische tussenstops voor ${params.origin} → ${params.destination}` : undefined}
                        />
                      </div>
                      {viaAirports.length > 0 && (
                        <button type="button" onClick={() => setAddingVia(false)} style={{ marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0', minHeight: '44px' }}>
                          Annuleer
                        </button>
                      )}
                    </div>
                  )}
                  {!addingVia && viaAirports.length > 0 && viaAirports.length < 3 && (
                    <button type="button" onClick={() => setAddingVia(true)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem',
                      background: 'none', border: '1.5px dashed var(--border)', borderRadius: '8px',
                      padding: '0.625rem 1rem', cursor: 'pointer', color: 'var(--text-muted)',
                      fontSize: '0.8rem', fontWeight: 600, width: '100%',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Nog een tussenstop toevoegen
                    </button>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Compensatie wordt berekend op de totale reisafstand ({params?.origin} → {params?.destination}).
                  </p>
                </div>
              )}

              {/* Enkele boeking */}
              {stopover === 'yes' && viaAirports.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.625rem' }}>
                    Was dit één boeking of aparte tickets?
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {([
                      { val: 'single' as const, label: 'Eén boeking', sub: 'Alle vluchten op één reserveringsnummer', ok: true },
                      { val: 'separate' as const, label: 'Aparte tickets', sub: 'Losse boekingen voor elke vlucht', ok: false },
                    ]).map(opt => (
                      <button key={opt.val} type="button" onClick={() => handleSingleBooking(opt.val)}
                        style={{
                          flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem',
                          padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer',
                          border: `2px solid ${singleBooking === opt.val ? (opt.ok ? 'var(--green)' : 'var(--orange)') : 'var(--border)'}`,
                          background: singleBooking === opt.val ? (opt.ok ? 'var(--green-dim)' : 'rgba(249,115,22,0.07)') : '#fff',
                          transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: singleBooking === opt.val ? (opt.ok ? 'var(--green)' : 'var(--orange)') : 'var(--text)' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                  {singleBooking === 'separate' && (
                    <div style={{ marginTop: '0.625rem', padding: '0.75rem 1rem', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--orange)', margin: 0, lineHeight: 1.5 }}>
                        <strong>Let op:</strong> EC 261/2004 geldt alleen bij één boekingsreferentie. Wij controleren dit voor je.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Annuleringsmelding + oorzaak (alleen geannuleerd) */}
          {params?.type === 'geannuleerd' && (
            <>
              {/* Wanneer gemeld? */}
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
                  Wanneer werd je op de hoogte gesteld van de annulering?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {([
                    { val: 'no_notice' as const, label: 'Dag van de vlucht zelf (of niet gemeld)', sub: 'Altijd recht op compensatie', color: 'var(--blue)' },
                    { val: 'lt7' as const, label: 'Minder dan 7 dagen van tevoren', sub: 'Mogelijk recht — afhankelijk van aangeboden alternatief', color: 'var(--blue)' },
                    { val: 'd7_13' as const, label: '7 tot 13 dagen van tevoren', sub: 'Mogelijk recht — afhankelijk van aangeboden alternatief', color: 'var(--blue)' },
                    { val: 'gt14days' as const, label: '14 dagen of meer van tevoren', sub: 'Geen compensatierecht (EC 261/2004 art. 5(1)(c))', color: 'var(--red)' },
                  ]).map(opt => (
                    <button key={opt.val} type="button" onClick={() => handleNoticeWindow(opt.val)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.15rem',
                        padding: '0.875rem 1.125rem', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${noticeWindow === opt.val ? opt.color : 'var(--border)'}`,
                        background: noticeWindow === opt.val ? (opt.val === 'gt14days' ? 'rgba(220,38,38,0.05)' : 'var(--blue-light)') : '#fff',
                        transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: noticeWindow === opt.val ? opt.color : 'var(--text)' }}>{opt.label}</span>
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {(noticeWindow === 'd7_13' || noticeWindow === 'lt7') && (
                  <div style={{ marginTop: '0.875rem', padding: '1rem 1.125rem', background: 'var(--blue-light)', border: '1px solid var(--blue-border)', borderRadius: '10px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)', margin: '0 0 0.625rem' }}>
                      {noticeWindow === 'd7_13'
                        ? 'Was het aangeboden alternatief acceptabel? (max. 2u eerder vertrek + max. 4u later aankomst)'
                        : 'Was het aangeboden alternatief acceptabel? (max. 1u eerder vertrek + max. 2u later aankomst)'}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[
                        { val: false, label: 'Nee — slecht of geen alternatief', note: 'Recht op compensatie' },
                        { val: true, label: 'Ja — acceptabel alternatief', note: 'Geen compensatierecht' },
                      ].map(opt => (
                        <button key={String(opt.val)} type="button" onClick={() => handleAlternativeAdequate(opt.val)}
                          style={{
                            flex: 1, display: 'flex', flexDirection: 'column', gap: '0.1rem',
                            padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                            border: `2px solid ${alternativeAdequate === opt.val ? (opt.val ? 'var(--red)' : 'var(--green)') : 'var(--border)'}`,
                            background: alternativeAdequate === opt.val ? (opt.val ? 'rgba(220,38,38,0.05)' : 'var(--green-dim)') : '#fff',
                            transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left',
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: alternativeAdequate === opt.val ? (opt.val ? 'var(--red)' : 'var(--green)') : 'var(--text)' }}>{opt.label}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {(cancellationNotice === 'gt14days' || cancellationNotice === 'd7_13_ok' || cancellationNotice === 'lt7_ok') && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--red)', margin: 0, lineHeight: 1.5 }}>
                      <strong>Waarschijnlijk geen recht op compensatie</strong> op basis van de aankondiging. Ga toch door als je twijfelt — een jurist beoordeelt je zaak kosteloos.
                    </p>
                  </div>
                )}
              </div>

              {/* Oorzaak */}
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
                  Wat was de oorzaak van de annulering?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {([
                    { val: 'unknown' as CauseType, label: 'Ik weet het niet / geen reden opgegeven', sub: 'Meest gekozen — wij onderzoeken de oorzaak voor jou', forceMajeure: false },
                    { val: 'technical' as CauseType, label: 'Technisch defect, staking of andere reden', sub: 'Geen overmacht — jij hebt recht op compensatie', forceMajeure: false },
                    { val: 'weather' as CauseType, label: 'Extreem slecht weer of luchtverkeersstaking', sub: 'Ga toch door als je twijfelt — wij toetsen of dit echt overmacht was', forceMajeure: true },
                  ]).map(opt => (
                    <button key={opt.val} type="button" onClick={() => handleCauseType(opt.val)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.15rem',
                        padding: '0.875rem 1.125rem', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${causeType === opt.val ? (opt.forceMajeure ? 'var(--orange)' : 'var(--blue)') : 'var(--border)'}`,
                        background: causeType === opt.val ? (opt.forceMajeure ? 'rgba(249,115,22,0.07)' : 'var(--blue-light)') : '#fff',
                        transition: 'all 0.15s', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: causeType === opt.val ? (opt.forceMajeure ? 'var(--orange)' : 'var(--blue)') : 'var(--text)' }}>{opt.label}</span>
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Doorgaan button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button
              onClick={() => { if (!canProceed || !params) return; trackDetailsComplete({ claimType: params.type ?? '', hasStopover: stopover === 'yes', date: params.date ?? '' }); router.push('/selecteer/vlucht') }}
              disabled={!canProceed}
              className="btn-cta"
              style={{ opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            >
              Zoek mijn vlucht
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => router.push('/selecteer/type')} className="btn-secondary">
              ← Terug
            </button>
          </div>

        </div>
        <FunnelSidebar step={1} />
      </div>
    </div>
  )
}
