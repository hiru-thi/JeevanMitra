// The 18 sensor/derived parameters the farm hardware and software report.
// `group` controls which section of the cow-detail page a parameter lands in.
export const PARAMS = [
  { key: 'activity', unit: 'steps/h', group: 'behaviour' },
  { key: 'posture', unit: '% lying', group: 'behaviour' },
  { key: 'rumination', unit: 'min/h', group: 'behaviour' },
  { key: 'skin_temperature', unit: '°C', group: 'thermal' },
  { key: 'udder_temperature', unit: '°C', group: 'thermal' },
  { key: 'thermal_asymmetry', unit: '°C', group: 'thermal' },
  { key: 'milk_yield', unit: 'L/day', group: 'milk' },
  { key: 'milk_flow', unit: 'L/min', group: 'milk' },
  { key: 'milk_conductivity', unit: 'mS/cm', group: 'milk' },
  { key: 'milk_temperature', unit: '°C', group: 'milk' },
  { key: 'milk_ph', unit: '', group: 'milk' },
  { key: 'activity_change', unit: '%', group: 'deviation' },
  { key: 'rumination_change', unit: '%', group: 'deviation' },
  { key: 'temperature_deviation', unit: '°C', group: 'deviation' },
  { key: 'yield_change', unit: '%', group: 'deviation' },
  { key: 'conductivity_change', unit: '%', group: 'deviation' },
  { key: 'pH_deviation', unit: '', group: 'deviation' },
  { key: 'historical_trend', unit: 'idx', group: 'trend' }
]

export const GROUPS = ['behaviour', 'thermal', 'milk', 'deviation', 'trend']

// The handful of numbers a person glances at first. Kept deliberately short —
// everything else lives in the full parameter breakdown further down the page.
export const KEY_CARD_KEYS = ['udder_temperature', 'scc', 'milk_conductivity', 'milk_yield']

export function fmt(key, value) {
  if (value == null || Number.isNaN(value)) return '–'
  const digits = /ph/i.test(key) ? 2 : key === 'scc' ? 0 : 1
  return Number(value).toFixed(digits)
}

// Composite 0–100 risk score built from the parameters most predictive of
// subclinical mastitis: rising conductivity, falling yield, falling
// rumination, udder thermal asymmetry, and milk pH drift.
export function score(r) {
  const v =
    100 *
    (0.28 * (r.conductivity_change ?? 0) / 24 +
      0.2 * -(r.yield_change ?? 0) / 22 +
      0.17 * -(r.rumination_change ?? 0) / 28 +
      0.2 * (r.thermal_asymmetry ?? 0) / 1.6 +
      0.15 * (r.pH_deviation ?? 0) / 0.35)
  return Math.max(0, Math.min(100, v))
}

export function cat(s) {
  if (s < 20) return 0 // no risk
  if (s < 40) return 1 // low
  if (s < 65) return 2 // moderate
  return 3 // high
}

export const RISK_COLORS = ['var(--r0)', 'var(--r1)', 'var(--r2)', 'var(--r3)']

// Picks the parameter most responsible for an elevated score, to drive the
// one-line recommended action on the cow-detail page.
export function leadingFactor(r) {
  const candidates = [
    [(r.conductivity_change ?? 0) / 24, 'conductivity'],
    [(r.thermal_asymmetry ?? 0) / 1.6, 'temperature'],
    [-(r.yield_change ?? 0) / 22, 'yield']
  ]
  candidates.sort((a, b) => b[0] - a[0])
  return candidates[0][1]
}
