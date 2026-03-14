import { NextRequest, NextResponse } from 'next/server'
import { pruneOldDelays } from '@/lib/airline-delays'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deleted = await pruneOldDelays()
  return NextResponse.json({ deleted, message: `${deleted} records ouder dan 90 dagen verwijderd.` })
}
