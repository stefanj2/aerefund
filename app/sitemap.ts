import { MetadataRoute } from 'next'
import { IATA_TO_SLUG } from '@/lib/airline-page-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aerefund.com'
  const now = new Date()

  const airlinePages: MetadataRoute.Sitemap = Object.values(IATA_TO_SLUG).map((slug) => ({
    url: `${base}/airlines/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: base,                                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/faq`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/passagiersrechten`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/over-ons`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/algemene-voorwaarden`,      lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...airlinePages,
  ]
}
