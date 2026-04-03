import { NextRequest, NextResponse } from 'next/server'
import { buildDossierZip } from '@/lib/dossier'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  try {
    const zip = await buildDossierZip(token)

    return new NextResponse(zip as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=dossier-${token.toUpperCase()}.zip`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
