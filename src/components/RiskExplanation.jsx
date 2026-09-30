import { avg } from '../lib/helpers'

function mean(history, key) {
  const values = history.map((row) => row[key]).filter((value) => value != null).map(Number).filter(Number.isFinite)
  return values.length ? avg(values) : null
}

function signal(history, key, label, concern, thresholds, unit = '%') {
  const before = mean(history.slice(-14, -7), key)
  const recent = mean(history.slice(-7), key)
  if (before == null || recent == null || before === 0) {
    return { label, direction: '–', severity: 'Insufficient data', change: null }
  }
  const change = unit === '°C' ? recent - before : ((recent - before) / Math.abs(before)) * 100
  const magnitude = Math.abs(change)
  const changed = concern === 'up' ? change > thresholds.moderate : change < -thresholds.moderate
  const significant = concern === 'up' ? change >= thresholds.significant : change <= -thresholds.significant
  const direction = magnitude < thresholds.moderate ? '→' : change > 0 ? '↑' : '↓'
  return {
    label,
    direction,
    severity: significant ? 'Significant' : changed ? 'Moderate' : 'Stable',
    change,
    unit
  }
}

export function analyzeRiskSignals(history, animal) {
  return [
    signal(history, 'scc', 'SCC', 'up', { moderate: 8, significant: 20 }),
    signal(history, 'milk_conductivity', 'Conductivity', 'up', { moderate: 8, significant: 18 }),
    signal(history, 'udder_temperature', 'Udder temperature', 'up', { moderate: 0.3, significant: 0.6 }, '°C'),
    signal(history, 'milk_yield', 'Milk yield', 'down', { moderate: 6, significant: 12 }),
    signal(history, 'rumination', 'Rumination', 'down', { moderate: 8, significant: 16 }),
    {
      label: 'Previous mastitis',
      direction: '•',
      severity: animal.previous_mastitis == null ? 'Not recorded' : animal.previous_mastitis ? 'Present' : 'No history'
    }
  ]
}

export default function RiskExplanation({ history, animal }) {
  const signals = analyzeRiskSignals(history, animal)
  const changing = signals.filter((item) => item.severity === 'Significant' || item.severity === 'Moderate').length

  return (
    <section className="card risk-explanation">
      <div className="feature-heading">
        <div>
          <h3>Why is this cow at risk?</h3>
          <p>Signal changes compare the latest 7 readings with the preceding 7.</p>
        </div>
        <span className="tag">Decision support, not diagnosis</span>
      </div>
      <div className="signal-list">
        {signals.map((item) => (
          <div className="signal-row" key={item.label}>
            <b>{item.label}</b>
            <span className={`signal-direction ${item.direction === '↑' ? 'up' : item.direction === '↓' ? 'down' : ''}`}>
              {item.direction}
            </span>
            <span>{item.severity}</span>
            <small>
              {item.change == null
                ? ''
                : `${item.change > 0 ? '+' : ''}${item.change.toFixed(item.unit === '°C' ? 2 : 1)}${item.unit}`}
            </small>
          </div>
        ))}
      </div>
      <div className="pattern-note">
        <b>Risk pattern detected</b>
        <p>
          {changing >= 3
            ? 'Multiple milk-quality, temperature and behavioral indicators are changing simultaneously.'
            : changing
            ? `${changing} tracked indicator${changing === 1 ? ' is' : 's are'} changing; review the combined trend and clinical findings.`
            : 'No strong concurrent changes were detected in the available 7-day comparison.'}
        </p>
      </div>
    </section>
  )
}