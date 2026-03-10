import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

// One-time setup: creates the boardingpasses storage bucket.
// Protected by admin cookie (proxy.ts handles auth).
// Visit /api/admin/setup-storage from the browser once after deploying.

export async function POST() {
  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Database niet geconfigureerd' }, { status: 503 })

  // Check if bucket already exists
  const { data: buckets, error: listError } = await db.storage.listBuckets()
  if (listError) {
    return NextResponse.json({ error: 'Kon buckets niet ophalen: ' + listError.message }, { status: 500 })
  }

  const exists = buckets?.some(b => b.name === 'boardingpasses')
  if (exists) {
    return NextResponse.json({ success: true, message: 'Bucket bestaat al — niets te doen.' })
  }

  const { error } = await db.storage.createBucket('boardingpasses', {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  })

  if (error) {
    return NextResponse.json({ error: 'Aanmaken mislukt: ' + error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Bucket "boardingpasses" aangemaakt!' })
}

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Storage Setup — Aerefund Admin</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0D1B2A; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; }
    .card { background: #fff; color: #111; border-radius: 16px; padding: 2rem; max-width: 480px; width: 100%; box-shadow: 0 8px 40px rgba(0,0,0,0.3); }
    h1 { font-size: 1.25rem; font-weight: 800; margin: 0 0 0.5rem; color: #0D1B2A; }
    p { font-size: 0.875rem; color: #6B7280; line-height: 1.6; margin: 0 0 1.25rem; }
    button { width: 100%; padding: 0.75rem; background: #1D4ED8; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    button:hover { background: #1e40af; }
    button:disabled { background: #93C5FD; cursor: default; }
    #result { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; display: none; }
    .success { background: #ECFDF5; border: 1px solid #A7F3D0; color: #047857; }
    .error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }
    a.btn { display: block; text-align: center; margin-top: 0.75rem; padding: 0.625rem; border-radius: 8px; background: #ECFDF5; border: 1.5px solid #A7F3D0; color: #047857; font-weight: 600; font-size: 0.875rem; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Storage Setup</h1>
    <p>Dit maakt de <code>boardingpasses</code> bucket aan in Supabase Storage. Boardingpasses van klanten worden hier opgeslagen (privé, max 10 MB).</p>
    <button id="btn" onclick="runSetup()">Bucket aanmaken →</button>
    <div id="result"></div>
  </div>
  <script>
    async function runSetup() {
      const btn = document.getElementById('btn');
      const result = document.getElementById('result');
      btn.disabled = true;
      btn.textContent = 'Bezig…';
      result.style.display = 'none';
      try {
        const res = await fetch('/api/admin/setup-storage', { method: 'POST' });
        const data = await res.json();
        result.style.display = 'block';
        if (data.success) {
          result.className = 'success';
          result.innerHTML = '✓ ' + data.message + '<a href="/admin/overview" class="btn">Ga naar het admin paneel →</a>';
        } else {
          result.className = 'error';
          result.textContent = data.error || 'Onbekende fout.';
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
