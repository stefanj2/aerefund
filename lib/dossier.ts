import JSZip from 'jszip'
import { getSupabase } from '@/lib/supabase'

/**
 * Build a complete claim dossier as a ZIP file.
 * Includes claim overview, timeline, airline correspondence, and all uploaded documents.
 */
export async function buildDossierZip(token: string): Promise<Buffer> {
  const db = getSupabase()
  if (!db) throw new Error('Database niet geconfigureerd')

  // 1. Fetch full claim
  const { data: claim, error } = await db
    .from('claims')
    .select('*')
    .eq('token', token.toUpperCase())
    .single()

  if (error || !claim) throw new Error('Claim niet gevonden')

  const zip = new JSZip()

  // 2. claim-overzicht.json — full claim data excluding internal fields
  const {
    ip_address: _ip,
    user_agent: _ua,
    ...publicClaim
  } = claim as Record<string, unknown>
  zip.file('claim-overzicht.json', JSON.stringify(publicClaim, null, 2))

  // 3. tijdlijn.json — notes array
  const notes = (claim.notes as unknown[]) ?? []
  zip.file('tijdlijn.json', JSON.stringify(notes, null, 2))

  // 4. email-correspondentie.json — airline emails
  const airlineEmails = (claim.airline_emails as unknown[]) ?? []
  zip.file('email-correspondentie.json', JSON.stringify(airlineEmails, null, 2))

  // 5. Download and add files from Supabase Storage
  const storageFiles: { zipName: string; bucket: string; pathPrefix: string }[] = [
    { zipName: 'akkoordverklaring.pdf', bucket: 'consent-pdfs', pathPrefix: `${token.toUpperCase()}/` },
    { zipName: 'boardingpass', bucket: 'boarding-passes', pathPrefix: `${token.toUpperCase()}/boarding-pass` },
    { zipName: 'id-kopie', bucket: 'boarding-passes', pathPrefix: `${token.toUpperCase()}/id-copy` },
    { zipName: 'annuleringsbevestiging', bucket: 'boarding-passes', pathPrefix: `${token.toUpperCase()}/cancellation-notice` },
    { zipName: 'instapweigering', bucket: 'boarding-passes', pathPrefix: `${token.toUpperCase()}/denial-notice` },
  ]

  for (const sf of storageFiles) {
    try {
      if (sf.zipName === 'akkoordverklaring.pdf') {
        // Direct download — known filename pattern
        const { data: listData } = await db.storage.from(sf.bucket).list(token.toUpperCase())
        const file = listData?.find(f => f.name.startsWith('akkoordverklaring') || f.name.startsWith('consent'))
        if (file) {
          const { data } = await db.storage.from(sf.bucket).download(`${token.toUpperCase()}/${file.name}`)
          if (data) {
            const buffer = Buffer.from(await data.arrayBuffer())
            zip.file(`akkoordverklaring.pdf`, buffer)
          }
        }
      } else {
        // List files matching prefix, download first match
        const { data: listData } = await db.storage.from(sf.bucket).list(token.toUpperCase())
        const prefix = sf.pathPrefix.split('/').pop() ?? ''
        const file = listData?.find(f => f.name.startsWith(prefix))
        if (file) {
          const ext = file.name.includes('.') ? '.' + file.name.split('.').pop() : ''
          const { data } = await db.storage.from(sf.bucket).download(`${token.toUpperCase()}/${file.name}`)
          if (data) {
            const buffer = Buffer.from(await data.arrayBuffer())
            zip.file(`${sf.zipName}${ext}`, buffer)
          }
        }
      }
    } catch {
      // Missing files should not break the ZIP — skip silently
    }
  }

  // 6. Generate and return as nodebuffer
  const buf = await zip.generateAsync({ type: 'nodebuffer' })
  return Buffer.from(buf)
}
