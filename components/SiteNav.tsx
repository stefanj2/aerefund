'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/vliegtuigmaatschappijen', label: 'Airlines' },
  { href: '/passagiersrechten', label: 'Passagiersrechten' },
  { href: '/faq', label: 'FAQ' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact' },
  { href: '/mijn-claim', label: 'Mijn Claim' },
]

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on click outside the slide-in panel
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setMenuOpen(false)
    }
  }

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

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }} className="hide-tablet">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link href="/#form" className="hide-tablet" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--blue)', color: '#fff',
          fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: '0.875rem',
          padding: '0.5625rem 1.375rem',
          borderRadius: '6px',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          Check compensatie
        </Link>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu openen"
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '0.5rem',
          }}
          className="show-mobile"
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '1px' }} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.4)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Slide-in panel */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          width: '280px',
          maxWidth: '85vw',
          background: 'rgba(13,27,42,0.95)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.25rem' }}>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Menu sluiten"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.5rem',
                lineHeight: 1,
                padding: '4px 8px',
              }}
            >
              &#x2715;
            </button>
          </div>

          {/* Mobile nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile CTA */}
          <div style={{ padding: '1.5rem' }}>
            <Link
              href="/#form"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FF6B2B',
                color: '#fff',
                fontFamily: 'var(--font-sora)',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.875rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                width: '100%',
                textAlign: 'center',
              }}
            >
              Check compensatie
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
