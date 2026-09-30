export default function CategoryChart({ labels, values, type = 'line', color = 'var(--ac)' }) {
  const w = 560,
    h = 170,
    p = 28
  const max = Math.max(...values)
  const min = type === 'bar' ? 0 : Math.min(...values)
  const range = max - min || 1
  const bw = (w - 2 * p) / values.length
  const x = (i) => p + bw * i + bw / 2
  const y = (v) => h - p - ((v - min) / range) * (h - 2 * p)

  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <line x1={p} x2={w - p} y1={h - p} y2={h - p} stroke="var(--ln)" />
      {type === 'bar'
        ? values.map((v, i) => (
            <g key={i}>
              <rect x={x(i) - bw * 0.32} y={y(v)} width={bw * 0.64} height={h - p - y(v)} rx={2} fill={color} />
              <text x={x(i)} y={y(v) - 4} textAnchor="middle">
                {v}
              </text>
            </g>
          ))
        : (
            <>
              <path
                d={`M${values.map((v, i) => `${x(i)},${y(v)}`).join('L')}L${x(values.length - 1)},${h - p}L${x(0)},${h - p}Z`}
                fill={color}
                opacity={0.12}
              />
              <path d={'M' + values.map((v, i) => `${x(i)},${y(v)}`).join('L')} fill="none" stroke={color} strokeWidth={2.2} />
              {values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3} fill={color} />
              ))}
              <text x={p} y={12}>{max.toFixed(1)}</text>
              <text x={p} y={h - p - 4}>{min.toFixed(1)}</text>
            </>
          )}
      {labels.map((l, i) => (
        <text key={'l' + i} x={x(i)} y={h - 10} textAnchor="middle">
          {l}
        </text>
      ))}
    </svg>
  )
}
