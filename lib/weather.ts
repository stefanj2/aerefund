import { AIRPORTS } from '@/lib/airports'

export type WeatherData = {
  conditions: string     // 'clear' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'wind' | 'unknown'
  temperature: number | null
  windSpeed: number | null   // km/h
  windGust: number | null    // km/h
  precipitation: number | null  // mm
  visibility: number | null    // meters (not always available)
  isExtreme: boolean       // true if conditions could qualify as extraordinary
  summary: string          // Dutch human-readable summary
  source: string
}

/**
 * Fetch historical weather at an airport using Open-Meteo Archive API (free, no key).
 * Returns null on any failure — this is a non-blocking enrichment.
 */
export async function getWeatherAtAirport(
  iata: string,
  date: string,          // YYYY-MM-DD
  arrivalTimeUtc?: string // ISO datetime
): Promise<WeatherData | null> {
  try {
    const airport = AIRPORTS[iata.toUpperCase()]
    if (!airport) return null

    const url = new URL('https://archive-api.open-meteo.com/v1/archive')
    url.searchParams.set('latitude', String(airport.lat))
    url.searchParams.set('longitude', String(airport.lon))
    url.searchParams.set('start_date', date)
    url.searchParams.set('end_date', date)
    url.searchParams.set(
      'hourly',
      'temperature_2m,precipitation,rain,snowfall,windspeed_10m,windgusts_10m,weathercode'
    )
    url.searchParams.set('timezone', 'UTC')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(url.toString(), { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) return null

    const json = await res.json()
    const hourly = json?.hourly
    if (!hourly || !Array.isArray(hourly.time) || hourly.time.length === 0) return null

    // Determine which hour index to use
    let hourIndex: number
    if (arrivalTimeUtc) {
      hourIndex = findClosestHour(hourly.time, arrivalTimeUtc)
    } else {
      // Use worst weather hour (highest weathercode)
      hourIndex = findWorstWeatherHour(hourly.weathercode)
    }

    const weathercode: number = hourly.weathercode?.[hourIndex] ?? -1
    const temperature: number | null = hourly.temperature_2m?.[hourIndex] ?? null
    const windSpeed: number | null = hourly.windspeed_10m?.[hourIndex] ?? null
    const windGust: number | null = hourly.windgusts_10m?.[hourIndex] ?? null
    const precipitation: number | null = hourly.precipitation?.[hourIndex] ?? null
    const snowfall: number | null = hourly.snowfall?.[hourIndex] ?? null

    const conditions = mapWeatherCode(weathercode)

    const isExtreme = determineExtreme(conditions, windGust, snowfall, weathercode)

    const summary = buildDutchSummary(conditions, temperature, windSpeed, windGust, precipitation)

    return {
      conditions,
      temperature,
      windSpeed,
      windGust,
      precipitation,
      visibility: null, // Open-Meteo Archive does not provide visibility
      isExtreme,
      summary,
      source: 'open-meteo',
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findClosestHour(times: string[], arrivalTimeUtc: string): number {
  const target = new Date(arrivalTimeUtc).getTime()
  let bestIdx = 0
  let bestDiff = Infinity
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - target)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIdx = i
    }
  }
  return bestIdx
}

function findWorstWeatherHour(weathercodes: number[]): number {
  let bestIdx = 0
  let bestCode = -1
  for (let i = 0; i < weathercodes.length; i++) {
    if ((weathercodes[i] ?? -1) > bestCode) {
      bestCode = weathercodes[i] ?? -1
      bestIdx = i
    }
  }
  return bestIdx
}

/**
 * Map WMO weather codes to simplified condition strings.
 * https://open-meteo.com/en/docs (WMO code table)
 */
function mapWeatherCode(code: number): string {
  if (code >= 95) return 'thunderstorm'
  if (code >= 85) return 'snow'
  if (code >= 80) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 51 && code <= 67) return 'rain'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 0 && code <= 3) return 'clear'
  return 'unknown'
}

function determineExtreme(
  conditions: string,
  windGust: number | null,
  snowfall: number | null,
  weathercode: number
): boolean {
  // Wind gusts above 100 km/h
  if (windGust !== null && windGust > 100) return true
  // Heavy snowfall (>10mm/hour equivalent)
  if (snowfall !== null && snowfall > 10) return true
  // Thunderstorm (WMO 95-99)
  if (weathercode >= 95) return true
  // Heavy fog — we can't check visibility (not available), but WMO 48 = depositing rime fog
  if (weathercode === 48) return true
  return false
}

function buildDutchSummary(
  conditions: string,
  temperature: number | null,
  windSpeed: number | null,
  windGust: number | null,
  precipitation: number | null
): string {
  const parts: string[] = []

  // Main condition
  switch (conditions) {
    case 'clear':        parts.push('Helder weer'); break
    case 'rain':         parts.push('Regen'); break
    case 'thunderstorm': parts.push('Onweer'); break
    case 'snow':         parts.push('Sneeuw'); break
    case 'fog':          parts.push('Mist'); break
    case 'wind':         parts.push('Wind'); break
    default:             parts.push('Onbekend weer'); break
  }

  // Temperature
  if (temperature !== null) {
    parts.push(`${Math.round(temperature)}\u00B0C`)
  }

  // Wind
  if (windSpeed !== null) {
    let windStr = `wind ${Math.round(windSpeed)} km/u`
    if (windGust !== null && windGust > windSpeed + 10) {
      windStr += ` (vlagen ${Math.round(windGust)} km/u)`
    }
    parts.push(windStr)
  }

  // Precipitation
  if (precipitation !== null && precipitation > 0) {
    parts.push(`${precipitation.toFixed(1)} mm neerslag`)
  }

  return parts.join(', ')
}
