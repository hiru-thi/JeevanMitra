// Small seeded PRNG so the demo herd looks the same on every load.
function rng(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const clamp = (x, a, b) => Math.max(a, Math.min(b, x))

const BREEDS = ['Gir', 'Sahiwal', 'HF Cross', 'Jersey Cross', 'Murrah', 'Kangayam']
const OWNERS = ['Selvam K.', 'Muthu R.', 'Kavitha S.', 'Arjun P.', 'Devi M.', 'Balu T.']
const VET = 'Dr. Meenakshi R.'

// r (0..1) is the underlying "mastitis pressure" for a cow on a given day.
// Eighteen animals distributed across the three government dashboard farms.
const HERD = [
  { id: 1, r: 0.26, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 2, r: 0.30, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 3, r: 0.34, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 4, r: 0.55, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 5, r: 0.90, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 6, r: 0.95, farm_id: 'F1', farm_name: 'Coimbatore Dairy Cooperative', region: 'Coimbatore Region', district: 'Coimbatore', taluk: 'Mettupalayam' },
  { id: 7, r: 0.28, farm_id: 'F2', farm_name: 'Bhavani Valley Dairy', region: 'Erode Region', district: 'Erode', taluk: 'Bhavani' },
  { id: 8, r: 0.32, farm_id: 'F2', farm_name: 'Bhavani Valley Dairy', region: 'Erode Region', district: 'Erode', taluk: 'Bhavani' },
  { id: 9, r: 0.95, farm_id: 'F2', farm_name: 'Bhavani Valley Dairy', region: 'Erode Region', district: 'Erode', taluk: 'Bhavani' },
  { id: 10, r: 0.48, farm_id: 'F2', farm_name: 'Bhavani Valley Dairy', region: 'Erode Region', district: 'Erode', taluk: 'Bhavani' },
  { id: 11, r: 0.95, farm_id: 'F2', farm_name: 'Bhavani Valley Dairy', region: 'Erode Region', district: 'Erode', taluk: 'Bhavani' },
  { id: 12, r: 0.24, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 13, r: 0.30, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 14, r: 0.20, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 15, r: 0.24, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 16, r: 0.28, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 17, r: 0.50, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' },
  { id: 18, r: 0.95, farm_id: 'F3', farm_name: 'Salem Hills Dairy', region: 'Salem Region', district: 'Salem', taluk: 'Bhavani' }
]

function valuesFor(r, R) {
  const n = (s) => (R() - 0.5) * s
  return {
    activity: 62 - r * 18 + n(3),
    posture: 52 + r * 12 + n(3),
    rumination: 32 - r * 10 + n(1.5),
    skin_temperature: 33.2 + r * 0.8 + n(0.2),
    udder_temperature: 35 + r * 2 + n(0.2),
    thermal_asymmetry: Math.max(0, 0.2 + r * 1.4 + n(0.12)),
    milk_yield: 14 - r * 4 + n(0.7),
    milk_flow: 2.4 - r * 0.8 + n(0.15),
    milk_conductivity: 4.9 + r * 1.8 + n(0.15),
    milk_temperature: 37.2 + r * 0.6 + n(0.15),
    milk_ph: 6.65 + r * 0.35 + n(0.02),
    ambient_temperature: 28 + n(2),
    humidity: 62 + n(9),
    activity_change: -r * 26 + n(3),
    rumination_change: -r * 28 + n(3),
    temperature_deviation: r * 1.6 + n(0.12),
    yield_change: -r * 22 + n(3),
    conductivity_change: r * 24 + n(3),
    pH_deviation: Math.max(0, r * 0.35 + n(0.03)),
    historical_trend: r * 10 + n(1),
    scc: Math.max(40, 80 + r * 430 + n(25))
  }
}

// Builds the demo herd: `rows` is 12 monthly points per animal (for the
// Monthly statistics screen), `daily` is a 30-day series per animal (for the
// cow-detail charts). Both shapes match exactly what a `readings` table row
// from Supabase looks like, so the rest of the app never has to know which
// source it's reading from.
export function buildDemoData() {
  const R = rng(7)
  const rows = []
  const daily = {}

  HERD.forEach((c, i) => {
    const animal_id = 'TN-10' + c.id
    const meta = {
      animal_id,
      farm_id: c.farm_id,
      farm_name: c.farm_name,
      region: c.region,
      district: c.district,
      taluk: c.taluk,
      breed: BREEDS[i % BREEDS.length],
      age: 3 + i,
      lactation: 1 + (i % 4),
      vet_name: VET,
      vet_phone: '+910000000000',
      owner_name: OWNERS[i % OWNERS.length],
      owner_phone: '+910000000000'
    }
    for (let m = 0; m < 12; m++) {
      rows.push({
        ...meta,
        recorded_at: new Date(Date.UTC(2025, 9 + m, 15)).toISOString().slice(0, 10),
        ...valuesFor(clamp(c.r * (0.45 + (0.55 * m) / 11), 0, 1), R)
      })
    }
    daily[animal_id] = Array.from({ length: 30 }, (_, k) => ({
      ...meta,
      recorded_at: new Date(Date.UTC(2026, 7, 30 + k)).toISOString().slice(0, 10),
      ...valuesFor(clamp(c.r * (0.5 + 0.5 * clamp((k - 16) / 12, 0, 1)), 0, 1), R)
    }))
  })

  return { rows, daily }
}
