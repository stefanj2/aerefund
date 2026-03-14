/**
 * POST /api/admin/setup-delays-table
 * One-time endpoint: creates the public_delays table if it doesn't exist.
 * Protected by the admin cookie middleware (same as all /api/admin/* routes).
 */
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MIGRATION_SQL = `
create table if not exists public_delays (
  id           bigserial primary key,
  iata         text        not null,
  flight_number text       not null,
  origin       text        not null,
  destination  text        not null,
  route        text        not null,
  delay_minutes integer    not null,
  delay_label  text        not null,
  compensation integer     not null,
  flight_date  date        not null,
  created_at   timestamptz not null default now()
);

create unique index if not exists public_delays_unique
  on public_delays (flight_number, flight_date);

create index if not exists public_delays_iata_date
  on public_delays (iata, flight_date desc);
`.trim()

export async function POST() {
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_KEY?.trim()

  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase niet geconfigureerd' }, { status: 503 })
  }

  // Try Supabase pg-meta API (available on some plans)
  const res = await fetch(`${url}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'apikey': key,
    },
    body: JSON.stringify({ query: MIGRATION_SQL }),
  })

  if (res.ok) {
    return NextResponse.json({ success: true, message: 'Tabel aangemaakt!' })
  }

  // pg/query not available — return the SQL for manual execution
  const editorUrl = `https://supabase.com/dashboard/project/${url.replace('https://', '').replace('.supabase.co', '')}/sql/new`

  return NextResponse.json({
    success: false,
    message: 'Automatische tabelcreatie niet mogelijk via de REST API. Voer de SQL handmatig uit in de Supabase SQL Editor.',
    sql: MIGRATION_SQL,
    editor_url: editorUrl,
    seed_url: '/api/admin/seed-delays',
  })
}

export async function GET() {
  const url = process.env.SUPABASE_URL?.trim()
  const editorUrl = url
    ? `https://supabase.com/dashboard/project/${url.replace('https://', '').replace('.supabase.co', '')}/sql/new`
    : 'https://supabase.com/dashboard'

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Setup: public_delays tabel — Aerefund Admin</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0D1B2A; color: #fff; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; margin: 0; padding: 2rem 1rem; box-sizing: border-box; }
    .card { background: #152030; border: 1px solid #1f3148; border-radius: 16px; padding: 2rem; max-width: 680px; width: 100%; }
    h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; color: #fff; }
    p { font-size: 0.875rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin: 0 0 1.25rem; }
    pre { background: #0D1B2A; border: 1px solid #1f3148; border-radius: 8px; padding: 1rem; font-size: 0.75rem; overflow-x: auto; margin: 0 0 1.25rem; white-space: pre-wrap; color: #86efac; line-height: 1.5; }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; transition: all 0.15s; }
    .btn-primary { background: #FF6B2B; color: #fff; }
    .btn-primary:hover { background: #e85a1f; }
    .btn-secondary { background: rgba(255,255,255,0.08); color: #fff; margin-right: 0.5rem; }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }
    .steps { counter-reset: steps; list-style: none; padding: 0; margin: 0 0 1.25rem; }
    .steps li { counter-increment: steps; display: flex; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.875rem; color: rgba(255,255,255,0.7); }
    .steps li::before { content: counter(steps); min-width: 24px; height: 24px; background: rgba(255,107,43,0.2); color: #FF6B2B; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
    .result { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; display: none; }
    .success { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
    .error { background: rgba(255,107,43,0.12); border: 1px solid rgba(255,107,43,0.3); color: #fca5a5; }
    .divider { border: none; border-top: 1px solid #1f3148; margin: 1.5rem 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Setup: public_delays tabel</h1>
    <p>Deze éénmalige setup maakt de <code>public_delays</code> tabel aan in Supabase. Vluchtvertragingen worden automatisch opgeslagen wanneer gebruikers echte vertraagde vluchten opzoeken via de funnel.</p>

    <hr class="divider">
    <p style="margin-bottom:0.5rem"><strong>Stap 1: SQL uitvoeren in Supabase</strong></p>
    <p>Kopieer de SQL hieronder en plak het in de <a href="${editorUrl}" target="_blank" style="color:#FF6B2B">Supabase SQL Editor →</a></p>
    <pre id="migration-sql">create table if not exists public_delays (
  id           bigserial primary key,
  iata         text        not null,
  flight_number text       not null,
  origin       text        not null,
  destination  text        not null,
  route        text        not null,
  delay_minutes integer    not null,
  delay_label  text        not null,
  compensation integer     not null,
  flight_date  date        not null,
  created_at   timestamptz not null default now()
);

create unique index if not exists public_delays_unique
  on public_delays (flight_number, flight_date);

create index if not exists public_delays_iata_date
  on public_delays (iata, flight_date desc);</pre>

    <a href="${editorUrl}" target="_blank" class="btn btn-secondary">Open Supabase SQL Editor →</a>
    <button onclick="copySql()" class="btn btn-secondary" id="copy-btn">Kopieer SQL</button>

    <hr class="divider">
    <p style="margin-bottom:0.5rem"><strong>Stap 2: Seed-data invoegen</strong></p>
    <p>Na het aanmaken van de tabel, klik hier om 60+ realistische vertragingsrecords in te voegen als startdata:</p>
    <button onclick="runSeed()" class="btn btn-primary" id="seed-btn">Seed-data invoegen →</button>
    <div id="result" class="result"></div>
  </div>
  <script>
    function copySql() {
      const sql = document.getElementById('migration-sql').textContent;
      navigator.clipboard.writeText(sql).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = '✓ Gekopieerd!';
        setTimeout(() => btn.textContent = 'Kopieer SQL', 2000);
      });
    }
    async function runSeed() {
      const btn = document.getElementById('seed-btn');
      const result = document.getElementById('result');
      btn.disabled = true;
      btn.textContent = 'Bezig…';
      result.style.display = 'none';
      try {
        const res = await fetch('/api/admin/seed-delays', { method: 'POST' });
        const data = await res.json();
        result.style.display = 'block';
        if (data.inserted !== undefined || data.total !== undefined) {
          result.className = 'result success';
          result.textContent = '✓ Seed-data ingevoegd! ' + (data.inserted ?? 0) + ' van de ' + (data.total ?? 0) + ' records nieuw ingevoegd.';
        } else {
          result.className = 'result error';
          result.textContent = 'Fout: ' + (data.error || JSON.stringify(data));
          btn.disabled = false;
          btn.textContent = 'Opnieuw proberen';
        }
      } catch (e) {
        result.style.display = 'block';
        result.className = 'result error';
        result.textContent = 'Verbindingsfout: ' + e.message;
        btn.disabled = false;
        btn.textContent = 'Opnieuw proberen';
      }
    }
  </script>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
