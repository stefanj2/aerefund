import { AIRPORTS, type Airport } from './airports'

// ── Per destination airport — specific overrides ───────────────────────────
const VIA_BY_DEST: Record<string, string[]> = {
  // ── Southeast Asia ──────────────────────────────────────────────────────
  BKK: ['DXB', 'DOH', 'AUH', 'IST', 'SIN', 'KUL', 'HKG'],
  HKT: ['DXB', 'DOH', 'AUH', 'BKK', 'SIN', 'KUL'],
  DPS: ['SIN', 'KUL', 'DXB', 'DOH', 'BKK', 'HKG'],          // Bali
  SIN: ['DXB', 'DOH', 'AUH', 'IST', 'BKK', 'HKG', 'KUL'],
  KUL: ['DXB', 'DOH', 'AUH', 'IST', 'SIN', 'BKK', 'HKG'],

  // ── East Asia ────────────────────────────────────────────────────────────
  NRT: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'ICN', 'HKG', 'SIN'],  // Tokyo Narita
  ICN: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'HKG', 'SIN'],          // Seoul
  HKG: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'IST', 'SIN'],
  PEK: ['FRA', 'CDG', 'LHR', 'DXB', 'DOH', 'IST', 'ICN'],           // Beijing
  PVG: ['FRA', 'CDG', 'LHR', 'DXB', 'DOH', 'ICN', 'HKG'],           // Shanghai

  // ── South Asia ───────────────────────────────────────────────────────────
  DEL: ['DXB', 'DOH', 'AUH', 'IST', 'FRA', 'LHR'],                  // New Delhi
  BOM: ['DXB', 'DOH', 'AUH', 'IST', 'SIN', 'LHR'],                  // Mumbai
  CMB: ['DXB', 'DOH', 'AUH', 'SIN', 'KUL', 'IST'],                  // Colombo

  // ── Middle East ──────────────────────────────────────────────────────────
  DXB: ['IST', 'FRA', 'LHR', 'CDG', 'DOH', 'MUC'],
  DOH: ['IST', 'FRA', 'LHR', 'CDG', 'DXB', 'MUC'],
  AUH: ['IST', 'FRA', 'LHR', 'CDG', 'DXB', 'DOH'],
  TLV: ['IST', 'FRA', 'LHR', 'CDG', 'ZRH', 'VIE', 'DXB'],          // Tel Aviv
  AMM: ['IST', 'FRA', 'LHR', 'CDG', 'DXB', 'DOH'],                  // Amman
  RUH: ['IST', 'DXB', 'DOH', 'FRA', 'LHR', 'CDG'],                  // Riyad

  // ── Africa — North ───────────────────────────────────────────────────────
  CAI: ['IST', 'DXB', 'DOH', 'CDG', 'FRA', 'LHR'],                  // Cairo
  CMN: ['CDG', 'MAD', 'FRA', 'IST', 'LHR'],                          // Casablanca
  RAK: ['CDG', 'MAD', 'FRA', 'CMN'],                                  // Marrakech
  TUN: ['CDG', 'FRA', 'IST', 'MAD', 'CMN'],                          // Tunis
  HRG: ['IST', 'DXB', 'DOH', 'CAI', 'CDG', 'FRA'],                  // Hurghada
  SSH: ['IST', 'DXB', 'DOH', 'CAI', 'CDG', 'FRA'],                  // Sharm el-Sheikh

  // ── Africa — East & Southern ─────────────────────────────────────────────
  NBO: ['DXB', 'DOH', 'IST', 'CDG', 'FRA', 'LHR'],                  // Nairobi
  JNB: ['DXB', 'DOH', 'IST', 'CDG', 'FRA', 'NBO', 'LHR'],          // Johannesburg

  // ── Americas — North ─────────────────────────────────────────────────────
  JFK: ['LHR', 'CDG', 'FRA', 'DUB', 'BRU', 'ZRH', 'ICN'],
  EWR: ['LHR', 'CDG', 'FRA', 'DUB', 'BRU'],
  ORD: ['LHR', 'CDG', 'FRA', 'DUB', 'JFK'],                          // Chicago
  MIA: ['LHR', 'CDG', 'FRA', 'JFK', 'ORD', 'DUB'],
  IAH: ['LHR', 'CDG', 'FRA', 'JFK', 'MIA'],                          // Houston
  LAX: ['LHR', 'CDG', 'FRA', 'JFK', 'ICN', 'SFO'],
  SFO: ['LHR', 'CDG', 'FRA', 'JFK', 'ICN', 'LAX'],
  YYZ: ['LHR', 'CDG', 'FRA', 'DUB', 'JFK', 'ORD'],                  // Toronto
  YVR: ['LHR', 'CDG', 'FRA', 'ICN', 'JFK', 'ORD'],                  // Vancouver

  // ── Americas — Caribbean ─────────────────────────────────────────────────
  CUR: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],                          // Curaçao
  AUA: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],                          // Aruba
  PUJ: ['MIA', 'JFK', 'FRA', 'CDG'],                                  // Punta Cana
  CUN: ['MIA', 'JFK', 'FRA', 'CDG', 'ORD'],                          // Cancún
  HAV: ['MIA', 'CDG', 'FRA', 'BOG'],                                  // Havana

  // ── Americas — South ─────────────────────────────────────────────────────
  GRU: ['FRA', 'CDG', 'LHR', 'MIA', 'JFK', 'LIS'],                  // São Paulo
  EZE: ['FRA', 'CDG', 'LHR', 'MIA', 'GRU', 'SCL'],                  // Buenos Aires
  BOG: ['MIA', 'JFK', 'FRA', 'CDG', 'GRU'],                          // Bogotá

  // ── Spain — Canary Islands ───────────────────────────────────────────────
  TFS: ['MAD', 'BCN', 'LIS', 'LPA'],                                  // Tenerife South
  TFN: ['MAD', 'BCN', 'LIS', 'LPA'],                                  // Tenerife North
  LPA: ['MAD', 'BCN', 'LIS', 'TFS'],                                  // Gran Canaria
  FUE: ['MAD', 'BCN', 'LIS', 'LPA'],                                  // Fuerteventura
  ACE: ['MAD', 'BCN', 'LIS', 'LPA'],                                  // Lanzarote

  // ── Greece — Islands (often via Athens) ─────────────────────────────────
  HER: ['ATH', 'IST', 'LHR', 'CDG', 'FRA'],                          // Kreta Heraklion
  RHO: ['ATH', 'IST', 'FRA', 'CDG'],                                  // Rhodos
  CFU: ['ATH', 'IST', 'VIE'],                                         // Corfu
  JMK: ['ATH'],                                                        // Mykonos
  ZTH: ['ATH'],                                                        // Zakynthos
  JSI: ['ATH'],                                                        // Skiathos
  SKG: ['ATH', 'IST', 'FRA', 'CDG'],                                  // Thessaloniki

  // ── Turkey ───────────────────────────────────────────────────────────────
  AYT: ['IST', 'SAW', 'FRA', 'CDG'],                                  // Antalya
  DLM: ['IST', 'SAW'],                                                 // Dalaman
  BJV: ['IST', 'SAW'],                                                 // Bodrum
  ADB: ['IST', 'SAW', 'FRA'],                                          // Izmir

  // ── Portugal ─────────────────────────────────────────────────────────────
  FAO: ['LIS', 'MAD', 'CDG', 'FRA'],                                  // Faro
  OPO: ['LIS', 'MAD', 'CDG', 'LHR'],                                  // Porto

  // ── Oceania ──────────────────────────────────────────────────────────────
  SYD: ['SIN', 'DXB', 'HKG', 'KUL', 'DOH', 'ICN'],
  MEL: ['SIN', 'DXB', 'HKG', 'KUL', 'DOH'],
  AKL: ['SIN', 'DXB', 'HKG', 'SYD', 'DOH'],                         // Auckland
}

// ── Per destination country — fallback ─────────────────────────────────────
const VIA_BY_COUNTRY: Record<string, string[]> = {
  // East Asia
  JP: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'ICN', 'HKG', 'SIN'],
  KR: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'HKG'],
  CN: ['FRA', 'CDG', 'LHR', 'DXB', 'DOH', 'ICN', 'HKG'],
  HK: ['LHR', 'CDG', 'FRA', 'DXB', 'DOH', 'SIN', 'KUL'],

  // Southeast Asia
  TH: ['DXB', 'DOH', 'AUH', 'IST', 'SIN', 'KUL', 'HKG'],
  SG: ['DXB', 'DOH', 'IST', 'BKK', 'HKG', 'KUL'],
  MY: ['DXB', 'DOH', 'IST', 'SIN', 'BKK', 'HKG'],
  ID: ['SIN', 'KUL', 'DXB', 'DOH', 'BKK', 'HKG'],
  PH: ['SIN', 'KUL', 'DXB', 'DOH', 'HKG', 'ICN'],
  VN: ['SIN', 'KUL', 'DXB', 'DOH', 'BKK', 'HKG'],
  KH: ['BKK', 'SIN', 'DXB', 'DOH', 'KUL'],
  MM: ['BKK', 'SIN', 'DXB', 'DOH', 'KUL'],

  // South Asia
  IN: ['DXB', 'DOH', 'AUH', 'IST', 'FRA', 'LHR', 'SIN'],
  LK: ['DXB', 'DOH', 'AUH', 'SIN', 'KUL', 'IST'],
  PK: ['DXB', 'DOH', 'AUH', 'IST', 'FRA'],
  BD: ['DXB', 'DOH', 'AUH', 'IST', 'SIN'],
  NP: ['DXB', 'DOH', 'IST', 'DEL'],

  // Middle East
  AE: ['IST', 'FRA', 'LHR', 'CDG', 'DOH'],
  QA: ['IST', 'FRA', 'LHR', 'CDG', 'DXB'],
  SA: ['IST', 'DXB', 'DOH', 'FRA', 'LHR', 'CDG'],
  IL: ['IST', 'FRA', 'LHR', 'CDG', 'ZRH', 'VIE'],
  JO: ['IST', 'FRA', 'LHR', 'CDG', 'DXB', 'DOH'],
  KW: ['IST', 'FRA', 'DXB', 'DOH', 'LHR'],
  BH: ['DXB', 'DOH', 'IST', 'FRA', 'LHR'],
  OM: ['DXB', 'DOH', 'IST', 'FRA', 'LHR'],

  // Africa — North
  EG: ['IST', 'DXB', 'DOH', 'CDG', 'FRA', 'LHR'],
  MA: ['CDG', 'MAD', 'FRA', 'IST', 'LHR', 'CMN'],
  TN: ['CDG', 'FRA', 'IST', 'MAD', 'CMN'],
  LY: ['IST', 'CDG', 'FRA', 'TUN'],
  DZ: ['CDG', 'FRA', 'IST', 'MAD'],

  // Africa — West
  SN: ['CDG', 'MAD', 'FRA', 'DXB'],
  CI: ['CDG', 'MAD', 'FRA', 'IST'],
  GH: ['CDG', 'IST', 'DXB', 'FRA', 'LHR'],
  NG: ['CDG', 'IST', 'DXB', 'FRA', 'LHR'],

  // Africa — East & Southern
  KE: ['DXB', 'DOH', 'IST', 'CDG', 'FRA', 'NBO'],
  TZ: ['DXB', 'DOH', 'IST', 'NBO', 'CDG'],
  ET: ['DXB', 'DOH', 'IST', 'CDG', 'NBO'],
  ZA: ['DXB', 'DOH', 'IST', 'CDG', 'FRA', 'NBO'],
  ZW: ['DXB', 'DOH', 'IST', 'JNB', 'NBO'],
  MZ: ['DXB', 'DOH', 'JNB', 'NBO'],

  // Americas — North
  US: ['LHR', 'CDG', 'FRA', 'DUB', 'BRU', 'ZRH', 'JFK'],
  CA: ['LHR', 'CDG', 'FRA', 'DUB', 'JFK', 'ICN'],
  MX: ['MIA', 'JFK', 'FRA', 'CDG', 'LHR', 'ORD'],

  // Americas — Caribbean
  CW: ['MIA', 'JFK', 'FRA', 'CDG'],
  AW: ['MIA', 'JFK', 'FRA', 'CDG'],
  DO: ['MIA', 'JFK', 'FRA', 'CDG'],
  CU: ['MIA', 'CDG', 'FRA', 'BOG'],
  JM: ['MIA', 'JFK', 'CDG', 'FRA'],
  BB: ['MIA', 'JFK', 'CDG', 'FRA'],

  // Americas — South
  BR: ['FRA', 'CDG', 'LHR', 'MIA', 'JFK', 'LIS', 'GRU'],
  AR: ['FRA', 'CDG', 'LHR', 'MIA', 'GRU', 'BOG'],
  CO: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],
  PE: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],
  CL: ['MIA', 'JFK', 'FRA', 'CDG', 'GRU', 'BOG'],
  VE: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],
  EC: ['MIA', 'JFK', 'FRA', 'CDG', 'BOG'],

  // Oceania
  AU: ['SIN', 'DXB', 'HKG', 'KUL', 'DOH'],
  NZ: ['SIN', 'DXB', 'HKG', 'SYD', 'DOH'],

  // Europe — Scandinavia
  DK: ['CPH', 'FRA', 'LHR', 'CDG', 'ARN'],
  SE: ['ARN', 'CPH', 'FRA', 'LHR', 'CDG'],
  NO: ['OSL', 'CPH', 'FRA', 'LHR', 'CDG'],
  FI: ['HEL', 'ARN', 'FRA', 'LHR', 'CDG'],

  // Europe — Eastern
  PL: ['WAW', 'FRA', 'LHR', 'CDG', 'BER'],
  CZ: ['PRG', 'FRA', 'LHR', 'VIE', 'CDG'],
  HU: ['BUD', 'VIE', 'FRA', 'CDG', 'LHR'],
  AT: ['VIE', 'MUC', 'FRA', 'ZRH', 'CDG'],
  RS: ['BEG', 'VIE', 'IST', 'FRA', 'CDG'],
  RO: ['OTP', 'IST', 'VIE', 'FRA', 'CDG'],
  BG: ['SOF', 'IST', 'VIE', 'FRA', 'CDG'],
  LV: ['RIX', 'FRA', 'CDG', 'LHR', 'ARN'],
  EE: ['TLL', 'HEL', 'ARN', 'FRA', 'CDG'],
  LT: ['VNO', 'FRA', 'CDG', 'RIX', 'WAW'],

  // Europe — West
  CH: ['ZRH', 'GVA', 'FRA', 'CDG', 'LHR'],
  BE: ['BRU', 'CDG', 'LHR', 'FRA'],
  DE: ['FRA', 'MUC', 'BER', 'LHR', 'CDG'],
  FR: ['CDG', 'ORY', 'LHR', 'FRA', 'BRU'],
  GB: ['LHR', 'LGW', 'MAN', 'CDG', 'FRA'],
  IE: ['DUB', 'LHR', 'CDG', 'FRA'],
  ES: ['MAD', 'BCN', 'LHR', 'CDG', 'FRA'],
  IT: ['FCO', 'MXP', 'LHR', 'CDG', 'FRA'],
  GR: ['ATH', 'IST', 'FRA', 'CDG', 'LHR'],
  PT: ['LIS', 'MAD', 'CDG', 'LHR', 'FRA'],
  TR: ['IST', 'SAW', 'FRA', 'CDG', 'DXB'],
}

export function suggestVia(origin: string, destination: string): Airport[] {
  const byDest = VIA_BY_DEST[destination]
  const destAirport = AIRPORTS[destination]
  const byCountry = destAirport ? VIA_BY_COUNTRY[destAirport.country] : undefined

  const hubs = byDest ?? byCountry ?? ['DXB', 'IST', 'FRA', 'LHR', 'CDG', 'DOH', 'SIN', 'AUH']

  return hubs
    .filter(iata => iata !== origin && iata !== destination)
    .map(iata => AIRPORTS[iata])
    .filter(Boolean)
    .slice(0, 8)
}
