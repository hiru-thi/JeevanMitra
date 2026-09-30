import { useMemo, useState } from 'react'
import { paramLabel } from '../i18n'
import TrendChart from './TrendChart'

const METRICS = [
  { group: 'Milk', key: 'milk_yield', color: 'var(--ac)' },
  { group: 'Milk', key: 'scc', color: 'var(--r3)' },
  { group: 'Milk', key: 'milk_conductivity', color: '#2878a0' },
  { group: 'Milk', key: 'milk_temperature', color: '#ad7431' },
  { group: 'Milk', key: 'milk_ph', color: '#80623f' },
  { group: 'Animal', key: 'skin_temperature', label: 'Body temperature', color: '#b54e70' },
  { group: 'Animal', key: 'udder_temperature', color: 'var(--r2)' },
  { group: 'Animal', key: 'activity', color: '#468c78' },
  { group: 'Animal', key: 'rumination', color: '#5872a0' },
  { group: 'Animal', key: 'posture', label: 'Sleep / rest', color: '#7a6a9b' },
  { group: 'Environment', key: 'ambient_temperature', label: 'Ambient temperature', color: '#ce6845' },
  { group: 'Environment', key: 'humidity', label: 'Humidity', color: '#458c9b' }
]

const PERIODS = [7, 14, 30]
const GROUPS = ['Milk', 'Animal', 'Environment']
const INITIAL_SELECTION = ['scc', 'milk_conductivity', 'milk_yield', 'udder_temperature', 'rumination']

export default function TrendAnalysis({ lang, history }) {
  const [period, setPeriod] = useState(30)
  const [group, setGroup] = useState('Milk')
  const [selected, setSelected] = useState(INITIAL_SELECTION)
  const data = useMemo(() => [...history].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at)), [history])
  const visible = data.slice(-period)
  const metrics = METRICS.filter((metric) => metric.group === group)
  const series = selected
    .map((key) => {
      const metric = METRICS.find((item) => item.key === key)
      if (!metric) return null
      const values = visible.map((row) => Number(row[metric.key]))
      const first = values.find((value) => Number.isFinite(value) && value !== 0)
      if (first == null || values.some((value) => !Number.isFinite(value))) return null
      return {
        v: values.map((value) => +(100 * value / first).toFixed(2)),
        c: metric.color,
        n: metric.label || paramLabel(lang, metric.key)
      }
    })
    .filter(Boolean)

  function toggleMetric(metric) {
    if (!visible.some((row) => row[metric.key] != null)) return
    setSelected((current) =>
      current.includes(metric.key) ? current.filter((key) => key !== metric.key) : [...current, metric.key]
    )
  }

  return (
    <section className="card trend-analysis">
      <div className="feature-heading">
        <div>
          <h3>Trend analysis</h3>
          <p>Compare simultaneous sensor changes. Each series is indexed to its first reading (100%).</p>
        </div>
        <div className="segmented" aria-label="Trend period">
          {PERIODS.map((days) => (
            <button key={days} className={period === days ? 'on' : ''} onClick={() => setPeriod(days)}>
              {days} days
            </button>
          ))}
        </div>
      </div>
      <div className="trend-controls">
        <div className="segmented" aria-label="Sensor group">
          {GROUPS.map((name) => (
            <button key={name} className={group === name ? 'on' : ''} onClick={() => setGroup(name)}>
              {name}
            </button>
          ))}
        </div>
        <div className="metric-toggles">
          {metrics.map((metric) => {
            const available = visible.some((row) => row[metric.key] != null)
            const active = selected.includes(metric.key)
            return (
              <button
                key={metric.key}
                className={`metric-toggle ${active ? 'on' : ''}`}
                disabled={!available}
                onClick={() => toggleMetric(metric)}
                title={
                  metric.key === 'posture'
                    ? 'Posture (% lying) used as a rest proxy'
                    : available
                    ? 'Toggle this series'
                    : 'No readings available'
                }
              >
                <i style={{ background: metric.color }} />
                {metric.label || paramLabel(lang, metric.key)}
                {!available && <small>Unavailable</small>}
              </button>
            )
          })}
        </div>
      </div>
      {series.length ? (
        <TrendChart lang={lang} dates={visible.map((row) => row.recorded_at)} series={series} />
      ) : (
        <p className="empty-state">Select available readings to compare their trends.</p>
      )}
    </section>
  )
}