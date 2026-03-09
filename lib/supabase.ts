import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_KEY!

export const supabase = createClient(url, key)

// Token generator: 6 chars, no ambiguous characters (0/O, 1/I/L)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export function generateToken(): string {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}
