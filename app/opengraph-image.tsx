import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aerefund — Haal je vluchtcompensatie op'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0D1B2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', left: '300px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo text */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#FF6B2B', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4L5 22h18L14 4z" fill="white" />
              <path d="M10 16h8" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Aerefund
          </span>
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: '68px', fontWeight: 900, color: '#fff',
          lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '28px',
          maxWidth: '800px', display: 'flex', flexWrap: 'wrap',
        }}>
          Tot{' '}
          <span style={{ color: '#FF6B2B', margin: '0 18px' }}>€600</span>
          {' '}compensatie voor jouw vlucht
        </div>

        {/* Sub */}
        <div style={{
          fontSize: '26px', color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.5, maxWidth: '700px', marginBottom: '52px', display: 'flex',
        }}>
          Gratis check in 2 minuten. Wij regelen alles — geen win, geen fee.
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Vertraging', 'Annulering', 'Instapweigering'].map((label) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px', padding: '10px 24px',
              fontSize: '20px', color: 'rgba(255,255,255,0.7)', fontWeight: 500,
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Right badge */}
        <div style={{
          position: 'absolute', right: '96px', top: '50%',
          transform: 'translateY(-50%)',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B2B, #e85a1f)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(255,107,43,0.4)',
        }}>
          <span style={{ fontSize: '52px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>€600</span>
          <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.8)', marginTop: '6px', fontWeight: 500 }}>per passagier</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
