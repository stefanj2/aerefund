import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import Script from 'next/script'
import GAPageView from '@/components/GAPageView'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aerefund.com'),
  title: {
    default: 'Aerefund — Haal je vluchtcompensatie op',
    template: '%s — Aerefund.com',
  },
  description:
    'Controleer gratis of je recht hebt op tot €600 compensatie voor een vertraagde of geannuleerde vlucht. Wij dienen de claim voor je in. Geen win, geen fee.',
  keywords: 'vluchtvertraging, compensatie, EC 261/2004, vluchtclaim, vliegtuig vertraging, vlucht geannuleerd, vluchtcompensatie',
  alternates: {
    canonical: 'https://aerefund.com',
  },
  openGraph: {
    title: 'Aerefund — Tot €600 compensatie voor jouw vertraagde vlucht',
    description:
      'Controleer gratis of je recht hebt op compensatie. Gemiddeld €400 per passagier. Wij regelen alles.',
    type: 'website',
    locale: 'nl_NL',
    url: 'https://aerefund.com',
    siteName: 'Aerefund',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Aerefund — Vluchtcompensatie' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aerefund — Tot €600 compensatie voor jouw vertraagde vlucht',
    description: 'Controleer gratis of je recht hebt op compensatie. Wij regelen alles.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1VBKEHCXN5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1VBKEHCXN5');
        `}</Script>
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">{`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track','PageView');
            `}</Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img height="1" width="1" style={{display:'none'}}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className="min-h-screen antialiased">
        <GAPageView />
        {children}
      </body>
    </html>
  )
}
