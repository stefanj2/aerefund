import Link from 'next/link'

export default function SiteNav() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#fff',
      borderBottom: '1px solid #e8edf5',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      <div className="container-wide" style={{
        display: 'flex', alignItems: 'center',
        height: '64px', gap: '0',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '2rem', flexShrink: 0 }}>
          <div style={{ height: '40px', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-aerefund.png" alt="Aerefund" style={{ height: '90px', marginTop: '-25px', width: 'auto', display: 'block' }} />
          </div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Link href="/passagiersrechten" className="nav-link">Passagiersrechten</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
          <Link href="/over-ons" className="nav-link">Over ons</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* CTA */}
        <Link href="/#form" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--blue)', color: '#fff',
          fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem',
          padding: '0.5625rem 1.375rem',
          borderRadius: '6px',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          Check compensatie
        </Link>

      </div>
    </header>
  )
}
