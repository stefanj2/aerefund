import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aerefund.com'
  const now = new Date()

  return [
    { url: base,                                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/uitkomst`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/algemene-voorwaarden`,      lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
