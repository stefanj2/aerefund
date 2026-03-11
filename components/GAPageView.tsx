'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GAPageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: pathname })
    }
  }, [pathname])

  return null
}
