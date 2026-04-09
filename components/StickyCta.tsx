'use client'

import { useEffect, useState } from 'react'

export default function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      // Show sticky CTA once user has scrolled past ~80% of the viewport height
      // (i.e. when the hero is mostly out of view)
      const threshold = window.innerHeight * 0.8
      setVisible(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`sticky-cta-bar${visible ? ' visible' : ''}`}>
      <a href="#form" className="btn-primary" style={{ fontSize: '0.9rem' }}>
        Check compensatie →
      </a>
    </div>
  )
}
