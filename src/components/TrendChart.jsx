function fmtDate(d, lang) {
  return new Intl.DateTimeFormat({ en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' }[lang], {
    day: 'numeric',
    month: 'short'
  }).format(new Date(d))
}

// series: [{ v: number[], c: color, ax?: 0|1, n: legend label }]
// markIndex: draws a dashed "inflection" line at that day index.
export default function TrendChart({ lang, dates, series, markIndex = -1, markLabel = '' }) {
  const w = 620,
    h = 260,
    L = 44,
    T = 18,
    B = 30
  const hasAx1 = series.some((s) => s.ax)
  const R = hasAx1 ? 44 : 16
  const n = Math.max(dates.length - 1, 1)

  const rangeFor = (ax) => {
    const vals = series.filter((s) => (s.ax || 0) === ax).flatMap((s) => s.v)
    if (!vals.length) return null
    const lo = Math.min(...vals),
      hi = Math.max(...vals),
      pad = (hi - lo) * 0.15 || 1
    return [lo - pad, hi + pad]
  }
  const RG = [rangeFor(0), rangeFor(1)]
  const x = (i) => L + ((w - L - R) * i) / n
  const y = (v, ax) => T + (h - T - B) * (1 - (v - RG[ax][0]) / (RG[ax][1] - RG[ax][0]))

  const gridLines = []
  for (let k = 0; k <= 4; k++) {
    const gy = T + ((h - T - B) * k) / 4
    gridLines.push(<line key={'g' + k} x1={L} x2={w - R} y1={gy} y2={gy} stroke="var(--ln)" strokeDasharray="3 4" />)
    ;[0, 1].forEach((ax) => {
      if (RG[ax]) {
        const v = RG[ax][1] - ((RG[ax][1] - RG[ax][0]) * k) / 4
        gridLines.push(
          <text key={'t' + ax + k} x={ax ? w - R + 6 : L - 6} y={gy + 3} textAnchor={ax ? 'start' : 'end'}>
            {v.toFixed(v < 60 ? 1 : 0)}
          </text>
        )
      }
    })
  }

  const dateLabels = dates.map((d, i) =>
    i % 4 === 0 ? (
      <text key={'d' + i} x={x(i)} y={h - 8} textAnchor="middle">
        {fmtDate(d, lang)}
      </text>
    ) : null
  )

  return (
    <>
      <svg viewBox={`0 0 ${w} ${h}`}>
        {gridLines}
        {dateLabels}
        {series.map((s, si) => (
          <path
            key={si}
            d={'M' + s.v.map((v, i) => `${x(i)},${y(v, s.ax || 0)}`).join('L')}
            fill="none"
            stroke={s.c}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        ))}
        {markIndex >= 0 && (
          <>
            <line x1={x(markIndex)} x2={x(markIndex)} y1={T} y2={h - B} stroke="var(--r2)" strokeDasharray="4 4" />
            <text x={x(markIndex)} y={T - 6} textAnchor="middle">
              {markLabel}
            </text>
          </>
        )}
      </svg>
      <div className="lg">
        {series.map((s, i) => (
          <span key={i}>
            <i style={{ background: s.c }} />
            {s.n}
          </span>
        ))}
      </div>
    </>
  )
}
