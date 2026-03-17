import { test, expect, chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'https://aerefund.com'

// Realistic vv_result that would be written by /laden
const MOCK_RESULT = {
  flight: {
    flightNumber: 'KL1021',
    date: '2025-08-15',
    type: 'vertraagd',
    airline: 'KLM Royal Dutch Airlines',
    iataPrefix: 'KL',
    origin: 'AMS',
    destination: 'LHR',
    scheduledDeparture: '07:20',
    scheduledArrival: '08:00',
    actualArrival: null,
    delayMinutes: 240,
    distanceKm: 371,
    found: true,
  },
  compensation: { eligible: true, amountPerPerson: 250, distanceKm: 371, reason: 'Vlucht van 371 km (korter dan 1.500 km)' },
}

const MOCK_CLAIM = { ...MOCK_RESULT, passengers: 2 }

const MOCK_SUBMITTED = {
  ...MOCK_RESULT,
  passengers: 2,
  firstName: 'Jan',
  lastName: 'de Vries',
  email: 'jan@example.nl',
  phone: '0612345678',
  address: 'Keizersgracht 1',
  postalCode: '1234 AB',
  city: 'Amsterdam',
  iban: 'NL00ABCD0123456789',
  coPassengers: [{ firstName: 'Lisa', lastName: 'de Vries', email: 'lisa@example.nl' }],
  boardingPassFile: null,
  agreedToTerms: true,
  submittedAt: new Date().toISOString(),
}

// ─── 1. LANDING ─────────────────────────────────────────────────────────────
test('Landing — laadt zonder fouten', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(BASE)
  await expect(page.locator('h1')).toBeVisible()
  await expect(page).toHaveTitle(/Vlucht/i)
  expect(errors).toHaveLength(0)
})

test('Landing — hero form velden aanwezig', async ({ page }) => {
  await page.goto(BASE)
  // Origin airport combobox
  await expect(page.locator('input[placeholder*="luchthaven"], input[placeholder*="Amsterdam"], input[placeholder*="vertrek"]').first()).toBeVisible()
})

// ─── 2. ROUTE SEARCH API ─────────────────────────────────────────────────────
test('API route-search — geeft vluchten terug voor AMS→LHR', async ({ request }) => {
  // Use a date 5 days ago to stay within AeroDataBox historical data window
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const res = await request.get(`${BASE}/api/route-search?origin=AMS&destination=LHR&date=${fiveDaysAgo}`)
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(Array.isArray(json)).toBe(true)
  // Verify structure if results are present (external API quota may vary)
  if (json.length > 0) {
    expect(json[0]).toHaveProperty('flightNumber')
    expect(json[0]).toHaveProperty('iataPrefix')
    expect(json[0]).toHaveProperty('departureLocal')
  }
})

test('API route-search — geeft [] bij ontbrekende params', async ({ request }) => {
  const res = await request.get(`${BASE}/api/route-search?origin=AMS`)
  expect(res.status()).toBe(400)
})

test('API flight — geeft found:false voor onbekende vlucht', async ({ request }) => {
  const res = await request.get(`${BASE}/api/flight?flight=XX9999&date=2025-01-01&type=vertraagd`)
  expect(res.status()).toBe(200)
  const json = await res.json()
  expect(json.found).toBe(false)
})

// ─── 3. SELECTEER ───────────────────────────────────────────────────────────
test('Selecteer — redirect naar / zonder sessionStorage', async ({ page }) => {
  await page.goto(`${BASE}/selecteer`)
  await page.waitForURL('**/')
  await expect(page).toHaveURL(BASE + '/')
})

test('Selecteer — laadt correct met vv_route_search', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))

  await page.goto(BASE)
  await page.evaluate(() => {
    sessionStorage.setItem('vv_route_search', JSON.stringify({
      origin: 'AMS', destination: 'LHR', date: '2026-02-06', type: 'vertraagd',
    }))
  })
  // /selecteer redirects to /selecteer/type; tussenstop question is on /selecteer/details
  await page.goto(`${BASE}/selecteer/details`)

  // Should show AMS → LHR hero strip
  await expect(page.locator('text=AMS').first()).toBeVisible()
  await expect(page.locator('text=LHR').first()).toBeVisible()
  // Stopover question should appear (label says "Had je een tussenstop?")
  await expect(page.locator('text=tussenstop').first()).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('Selecteer — "Nee" toont vluchtlijst na datum', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate(() => {
    sessionStorage.setItem('vv_route_search', JSON.stringify({
      origin: 'AMS', destination: 'LHR', date: '2026-02-06', type: 'vertraagd',
    }))
  })
  // Tussenstop question is on /selecteer/details
  await page.goto(`${BASE}/selecteer/details`)

  // Click "Nee, directe vlucht"
  await page.locator('text=Nee, directe vlucht').click()
  // "Zoek mijn vlucht" button should be enabled
  await expect(page.locator('button:has-text("Zoek mijn vlucht")')).toBeVisible()
})

test('Selecteer — "Ja" toont tussenstop combobox', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate(() => {
    sessionStorage.setItem('vv_route_search', JSON.stringify({
      origin: 'AMS', destination: 'BKK', date: '2026-02-06', type: 'vertraagd',
    }))
  })
  // Tussenstop question is on /selecteer/details
  await page.goto(`${BASE}/selecteer/details`)
  // Button label changed to "Ja, met overstap"
  await page.locator('text=Ja, met overstap').click()
  // Combobox for via airport should appear
  await expect(page.locator('text=Via welke luchthaven')).toBeVisible()
})

// ─── 4. LADEN ───────────────────────────────────────────────────────────────
test('Laden — redirect naar / zonder vv_search', async ({ page }) => {
  await page.goto(`${BASE}/laden`)
  await page.waitForURL('**/')
  await expect(page).toHaveURL(BASE + '/')
})

test('Laden — animatie-stappen zichtbaar met prefetchedFlight', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))

  await page.goto(BASE)
  await page.evaluate((result) => {
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: 'KL1021',
      date: '2026-02-06',
      type: 'vertraagd',
      prefetchedFlight: result.flight,
    }))
  }, MOCK_RESULT)

  await page.goto(`${BASE}/laden`)
  await expect(page.locator('text=Vluchtdata ophalen')).toBeVisible()
  await expect(page.locator('text=EC 261')).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('Laden — doorsturen naar /uitkomst na animatie (prefetched)', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((result) => {
    sessionStorage.setItem('vv_search', JSON.stringify({
      flightNumber: 'KL1021',
      date: '2026-02-06',
      type: 'vertraagd',
      prefetchedFlight: result.flight,
    }))
  }, MOCK_RESULT)

  await page.goto(`${BASE}/laden`)
  // Wait for redirect to /uitkomst (animation takes ~4s + 2.2s redirect)
  await page.waitForURL('**/uitkomst', { timeout: 12000 })
  await expect(page).toHaveURL(/uitkomst/)
})

// ─── 5. UITKOMST ────────────────────────────────────────────────────────────
test('Uitkomst — redirect naar / zonder vv_result', async ({ page }) => {
  await page.goto(`${BASE}/uitkomst`)
  await page.waitForURL('**/')
  await expect(page).toHaveURL(BASE + '/')
})

test('Uitkomst — toont airline, bedrag en CTA', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))

  await page.goto(BASE)
  await page.evaluate((result) => {
    sessionStorage.setItem('vv_result', JSON.stringify(result))
  }, MOCK_RESULT)

  await page.goto(`${BASE}/uitkomst`)

  // KLM naam zichtbaar
  await expect(page.locator('text=KLM').first()).toBeVisible()
  // Bedrag zichtbaar (€250 per persoon)
  await expect(page.locator('text=250').first()).toBeVisible()
  // CTA knop
  await expect(page.locator('button:has-text("Claim")').first()).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('Uitkomst — passagiersselector updatet totaalbedrag', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((result) => {
    sessionStorage.setItem('vv_result', JSON.stringify(result))
  }, MOCK_RESULT)
  await page.goto(`${BASE}/uitkomst`)

  // Initial: €250
  await expect(page.locator('text=250').first()).toBeVisible()

  // Click + om naar 2 passagiers
  const plusBtn = page.locator('button').filter({ hasText: '+' }).first()
  await plusBtn.click()

  // Now should show €500
  await expect(page.locator('text=500').first()).toBeVisible({ timeout: 2000 })
})

test('Uitkomst — CTA stuurt door naar /formulier', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((result) => {
    sessionStorage.setItem('vv_result', JSON.stringify(result))
  }, MOCK_RESULT)
  await page.goto(`${BASE}/uitkomst`)

  await page.locator('button:has-text("Claim")').first().click()
  await page.waitForURL('**/formulier', { timeout: 5000 })
  await expect(page).toHaveURL(/formulier/)
})

test('Uitkomst — niet-eligible toont reden en terug-knop', async ({ page }) => {
  const notEligible = {
    ...MOCK_RESULT,
    compensation: { eligible: false, amountPerPerson: 0, distanceKm: 371, reason: 'Vlucht was 45 minuten vertraagd' },
  }
  await page.goto(BASE)
  await page.evaluate((r) => sessionStorage.setItem('vv_result', JSON.stringify(r)), notEligible)
  await page.goto(`${BASE}/uitkomst`)

  // Heading: "Waarschijnlijk geen recht op compensatie"
  await expect(page.locator('text=geen recht op compensatie').first()).toBeVisible()
  await expect(page.locator('text=45 minuten')).toBeVisible()
})

// ─── 6. FORMULIER ───────────────────────────────────────────────────────────
test('Formulier — redirect naar / zonder vv_claim', async ({ page }) => {
  await page.goto(`${BASE}/formulier`)
  await page.waitForURL('**/')
  await expect(page).toHaveURL(BASE + '/')
})

test('Formulier — stap 1 validatie werkt', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))

  await page.goto(BASE)
  await page.evaluate((claim) => {
    sessionStorage.setItem('vv_claim', JSON.stringify(claim))
  }, MOCK_CLAIM)
  await page.goto(`${BASE}/formulier`)

  // Stap 1 velden zichtbaar
  await expect(page.getByRole('heading', { name: 'Jouw gegevens' })).toBeVisible()

  // Klik Doorgaan zonder invullen → validatiefouten
  await page.locator('button:has-text("Doorgaan")').first().click()
  await expect(page.locator('text=verplicht').first()).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('Formulier — volledig doorlopen naar stap 3', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((claim) => {
    sessionStorage.setItem('vv_claim', JSON.stringify(claim))
  }, MOCK_CLAIM)
  await page.goto(`${BASE}/formulier`)

  // Stap 1 invullen (inclusief verplicht telefoonnummer)
  await page.fill('input[placeholder="Jan"]', 'Jan')
  await page.fill('input[placeholder="de Vries"]', 'de Vries')
  await page.fill('input[placeholder="jan@email.nl"]', 'jan@test.nl')
  await page.fill('input[placeholder="+31 6 12345678"]', '0612345678')
  await page.fill('input[placeholder="Keizersgracht 1"]', 'Teststraat 1')
  await page.fill('input[placeholder="1234 AB"]', '1234 AB')
  await page.fill('input[placeholder="Amsterdam"]', 'Amsterdam')
  await page.locator('button:has-text("Doorgaan")').first().click()

  // Stap 2 — medereiziger (1 medepassagier)
  await expect(page.getByRole('heading', { name: 'Medereizgers' })).toBeVisible()
  await page.locator('button:has-text("Doorgaan")').first().click()

  // Stap 3 — indienen (heading: "Controleer en indien")
  await expect(page.getByRole('heading', { name: 'Controleer en indien' })).toBeVisible()
  await expect(page.locator('text=Overzicht claim')).toBeVisible()
})

test('Formulier — datum correct getoond (geen timezone shift)', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((claim) => {
    sessionStorage.setItem('vv_claim', JSON.stringify(claim))
  }, MOCK_CLAIM) // date = '2025-08-15'
  await page.goto(`${BASE}/formulier`)

  // Navigate to step 3
  await page.fill('input[placeholder="Jan"]', 'Jan')
  await page.fill('input[placeholder="de Vries"]', 'de Vries')
  await page.fill('input[placeholder="jan@email.nl"]', 'jan@test.nl')
  await page.fill('input[placeholder="Keizersgracht 1"]', 'Teststraat 1')
  await page.fill('input[placeholder="1234 AB"]', '1234 AB')
  await page.fill('input[placeholder="Amsterdam"]', 'Amsterdam')
  await page.locator('button:has-text("Doorgaan")').first().click()
  await page.locator('button:has-text("Doorgaan")').first().click()

  // Date should be 15 augustus 2025, NOT 14 augustus
  await expect(page.locator('text=15 augustus 2025')).toBeVisible()
})

test('Formulier — submit schrijft vv_submitted en gaat naar /bevestiging', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate((claim) => {
    sessionStorage.setItem('vv_claim', JSON.stringify(claim))
  }, MOCK_CLAIM)
  await page.goto(`${BASE}/formulier`)

  await page.fill('input[placeholder="Jan"]', 'Jan')
  await page.fill('input[placeholder="de Vries"]', 'de Vries')
  // Use Resend's special test address that always succeeds without real delivery
  await page.fill('input[placeholder="jan@email.nl"]', 'testing@resend.dev')
  await page.fill('input[placeholder="+31 6 12345678"]', '0612345678')
  await page.fill('input[placeholder="Keizersgracht 1"]', 'Teststraat 1')
  await page.fill('input[placeholder="1234 AB"]', '1234 AB')
  await page.fill('input[placeholder="Amsterdam"]', 'Amsterdam')
  await page.locator('button:has-text("Doorgaan")').first().click()
  // Step 2 — medereizgers
  await page.locator('button:has-text("Doorgaan")').first().click()
  // Step 3 — check both required checkboxes
  await page.locator('text=Ik ga akkoord').click()
  await page.locator('text=Ik doe afstand').click()
  await page.locator('button:has-text("Claim indienen")').click()

  await page.waitForURL('**/bevestiging', { timeout: 15000 })
  await expect(page).toHaveURL(/bevestiging/)
})

// ─── 7. BEVESTIGING ─────────────────────────────────────────────────────────
test('Bevestiging — redirect naar / zonder vv_submitted', async ({ page }) => {
  await page.goto(`${BASE}/bevestiging`)
  await page.waitForURL('**/')
  await expect(page).toHaveURL(BASE + '/')
})

test('Bevestiging — toont naam, email, airline en tijdlijn', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))

  await page.goto(BASE)
  await page.evaluate((data) => {
    sessionStorage.setItem('vv_submitted', JSON.stringify(data))
  }, MOCK_SUBMITTED)
  await page.goto(`${BASE}/bevestiging`)

  await expect(page.locator('text=Claim ingediend, Jan!')).toBeVisible()
  await expect(page.locator('text=jan@example.nl').first()).toBeVisible()
  await expect(page.locator('text=KLM').first()).toBeVisible()
  await expect(page.locator('text=Factuur van €42').first()).toBeVisible()
  await expect(page.locator('text=Wat er nu gaat gebeuren')).toBeVisible()
  await expect(page.locator('text=WhatsApp')).toBeVisible()
  expect(errors).toHaveLength(0)
})

test('Bevestiging — kopieer referral link werkt', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto(BASE)
  await page.evaluate((data) => {
    sessionStorage.setItem('vv_submitted', JSON.stringify(data))
  }, MOCK_SUBMITTED)
  await page.goto(`${BASE}/bevestiging`)

  await page.locator('button:has-text("Kopieer")').click()
  await expect(page.locator('button:has-text("Gekopieerd")').or(page.locator('text=✓'))).toBeVisible({ timeout: 3000 })
})
