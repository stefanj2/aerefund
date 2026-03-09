import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
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
  title: 'Aerefund — Haal je vluchtcompensatie op',
  description:
    'Controleer gratis of je recht hebt op tot €600 compensatie voor een vertraagde of geannuleerde vlucht. Wij dienen de claim voor je in. Geen win, geen fee.',
  keywords: 'vluchtvertraging, compensatie, EC 261/2004, vluchtclaim, vliegtuig vertraging',
  openGraph: {
    title: 'Aerefund — Tot €600 compensatie voor jouw vertraagde vlucht',
    description:
      'Controleer gratis of je recht hebt op compensatie. Gemiddeld €400 per passagier. Wij regelen alles.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
