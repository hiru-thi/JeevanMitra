// Rows visible to the signed-in role. A farmer only ever sees their own
// farm_id (once real auth supplies one); vet and gov see the whole herd,
// since this project's dataset is a single small demo farm.
export function visibleRows(rows, role, farmId) {
  if (role === 'farmer' && farmId) return rows.filter((r) => r.farm_id === farmId)
  return rows
}

// One row per animal_id: prefers a "daily" (most recent) reading when one
// exists, otherwise the latest monthly row.
export function latestPerAnimal(rows, daily) {
  const m = new Map()
  rows.forEach((r) => {
    const existing = m.get(r.animal_id)
    if (!existing || r.recorded_at >= existing.recorded_at) m.set(r.animal_id, r)
  })
  return [...m.values()].map((r) => {
    const d = daily[r.animal_id]
    return d && d.length ? d[d.length - 1] : r
  })
}

export function months(rows) {
  return [...new Set(rows.map((r) => r.recorded_at.slice(0, 7)))].sort()
}

export function monthLabel(ym, lang) {
  return new Intl.DateTimeFormat({ en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' }[lang], { month: 'short' }).format(
    new Date(ym + '-15')
  )
}

export function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
}

export function telHref(number) {
  return 'tel:' + String(number || '').replace(/[^+\d]/g, '')
}
