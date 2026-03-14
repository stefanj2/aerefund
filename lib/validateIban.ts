/**
 * Validates an IBAN using mod-97 checksum (ISO 13616).
 * Returns an error string, or empty string if valid.
 */
export function validateIban(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase()
  if (!clean) return ''
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(clean)) {
    return 'Geen geldig IBAN-formaat (bijv. NL91 ABNA 0417164300)'
  }

  // Rearrange: move first 4 chars to end, then replace letters with numbers (A=10, B=11, …)
  const rearranged = clean.slice(4) + clean.slice(0, 4)
  const numericStr = rearranged
    .split('')
    .map(c => (c >= 'A' && c <= 'Z') ? String(c.charCodeAt(0) - 55) : c)
    .join('')

  // Compute mod-97 in 9-digit chunks to avoid integer overflow
  let remainder = 0
  for (const chunk of numericStr.match(/.{1,9}/g) ?? []) {
    remainder = parseInt(String(remainder) + chunk, 10) % 97
  }

  if (remainder !== 1) {
    return 'IBAN-controle mislukt — controleer het rekeningnummer'
  }
  return ''
}
