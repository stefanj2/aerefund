import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Cache for 1 hour — revalidated on next request after expiry
export const revalidate = 3600

export async function GET() {
  const db = getSupabase()
  if (!db) {
    return NextResponse.json({ count: null, formatted: '5.000+' })
  }

  try {
    const { count, error } = await db
      .from('claims')
      .select('*', { count: 'exact', head: true })
      .not('status', 'eq', 'result_viewed') // Only count claims that progressed past view

    if (error || count === null) {
      return NextResponse.json({ count: null, formatted: '5.000+' })
    }

    // Show at least 5000 (early social proof floor)
    const display = Math.max(count, 5000)
    const formatted = display >= 1000
      ? `${Math.floor(display / 100) * 100}+`
      : `${display}+`

    return NextResponse.json({ count, formatted })
  } catch {
    return NextResponse.json({ count: null, formatted: '5.000+' })
  }
}
