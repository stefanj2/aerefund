import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

// One-time migration endpoint — adds admin columns to the claims table.
// Protected by the same admin cookie (proxy.ts handles auth).
// Visit /api/admin/migrate once from the browser after deploying.
export async function POST() {
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  // Extract project ref and build direct SQL URL
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return NextResponse.json({ error: 'Supabase niet geconfigureerd' }, { status: 503 })

  const sql = `
    CREATE TABLE IF NOT EXISTS claims (
      id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      token                 VARCHAR(10)  UNIQUE NOT NULL,
      status                VARCHAR(50)  NOT NULL DEFAULT 'result_viewed',
      flight_data           JSONB,
      compensation          JSONB,
      passengers            INTEGER,
      first_name            VARCHAR(100),
      last_name             VARCHAR(100),
      email                 VARCHAR(255),
      phone                 VARCHAR(50),
      address               VARCHAR(255),
      postal_code           VARCHAR(20),
      city                  VARCHAR(100),
      iban                  VARCHAR(50),
      co_passengers         JSONB        DEFAULT '[]'::jsonb,
      boarding_pass_filename VARCHAR(500),
      notes                 JSONB        DEFAULT '[]'::jsonb,
      admin_notes           TEXT,
      invoice_number        VARCHAR(50),
      paid_at               TIMESTAMPTZ,
      submitted_at          TIMESTAMPTZ,
      created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
      updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now()
    );
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS notes                    JSONB        DEFAULT '[]'::jsonb;
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS admin_notes              TEXT;
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS invoice_number           VARCHAR(50);
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS paid_at                  TIMESTAMPTZ;
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS abandoned_email_sent_at  TIMESTAMPTZ;
    ALTER TABLE claims DISABLE ROW LEVEL SECURITY;
    CREATE INDEX IF NOT EXISTS claims_status_idx       ON claims(status);
    CREATE INDEX IF NOT EXISTS claims_token_idx        ON claims(token);
    CREATE INDEX IF NOT EXISTS claims_created_at_idx   ON claims(created_at DESC);
    CREATE INDEX IF NOT EXISTS claims_submitted_at_idx ON claims(submitted_at DESC NULLS LAST);
  `

  // Supabase exposes a pg/query endpoint for service-role clients
  const res = await fetch(`${url}/rest/v1/rpc/exec_admin_migration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'apikey': key,
    },
    body: JSON.stringify({ migration_sql: sql }),
  })

  if (!res.ok) {
    // Fallback: try Supabase's direct SQL endpoint (available in some projects)
    const res2 = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!res2.ok) {
      // Both approaches unavailable — return helpful instructions
      return NextResponse.json({
        success: false,
        message: 'Automatische migratie niet mogelijk. Voer de SQL hieronder handmatig uit in de Supabase SQL Editor.',
        manual_sql: sql.trim(),
        supabase_editor: `${url.replace('.supabase.co', '').replace('https://', 'https://app.supabase.com/project/')}/sql/new`,
      })
    }
  }

  return NextResponse.json({ success: true, message: 'Migratie succesvol uitgevoerd!' })
}

export async function GET() {
  // Convenience: GET returns HTML page with a button to trigger migration
  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Database Migratie — Aerefund Admin</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0D1B2A; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
    .card { background: #fff; color: #111; border-radius: 16px; padding: 2rem; max-width: 560px; width: 100%; box-shadow: 0 8px 40px rgba(0,0,0,0.3); }
    h1 { font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem; color: #0D1B2A; }
    p { font-size: 0.875rem; color: #6B7280; line-height: 1.6; margin: 0 0 1.25rem; }
    button { width: 100%; padding: 0.75rem; background: #1D4ED8; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    button:hover { background: #1e40af; }
    button:disabled { background: #93C5FD; cursor: default; }
    #result { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; display: none; }
    .success { background: #ECFDF5; border: 1px solid #A7F3D0; color: #047857; }
    .error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
    pre { background: #F3F4F6; border-radius: 8px; padding: 1rem; font-size: 0.75rem; overflow-x: auto; margin-top: 1rem; white-space: pre-wrap; color: #374151; }
    a.btn { display: block; text-align: center; margin-top: 0.75rem; padding: 0.625rem; border-radius: 8px; background: #ECFDF5; border: 1.5px solid #A7F3D0; color: #047857; font-weight: 600; font-size: 0.875rem; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Database Migratie</h1>
    <p>Dit voert de éénmalige SQL-migratie uit om nieuwe kolommen toe te voegen aan de <code>claims</code> tabel (notes, invoice_number, paid_at).</p>
    <button id="btn" onclick="runMigration()">Migratie uitvoeren →</button>
    <div id="result"></div>
  </div>
  <script>
    async function runMigration() {
      const btn = document.getElementById('btn');
      const result = document.getElementById('result');
      btn.disabled = true;
      btn.textContent = 'Bezig…';
      result.style.display = 'none';
      try {
        const res = await fetch('/api/admin/migrate', { method: 'POST' });
        const data = await res.json();
        result.style.display = 'block';
        if (data.success) {
          result.className = 'success';
          result.innerHTML = '✓ ' + data.message + '<a href="/admin/overview" class="btn">Ga naar het admin paneel →</a>';
        } else {
          result.className = 'error';
          result.innerHTML = data.message + (data.supabase_editor
            ? '<br><br>Kopieer en plak de SQL hieronder in de <a href="' + data.supabase_editor + '" target="_blank" style="color:#1D4ED8">Supabase SQL Editor</a>:<pre>' + data.manual_sql + '</pre>'
            : '');
          btn.disabled = false;
          btn.textContent = 'Opnieuw proberen';
        }
      } catch (e) {
        result.style.display = 'block';
        result.className = 'error';
        result.textContent = 'Verbindingsfout.';
        btn.disabled = false;
        btn.textContent = 'Opnieuw proberen';
      }
    }
  </script>
</body>
</html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
