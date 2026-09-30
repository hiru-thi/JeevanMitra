import { useState } from 'react'
import { t, paramLabel } from '../i18n'
import { PARAMS, score, cat, fmt } from '../lib/risk'
import { months, monthLabel, avg } from '../lib/helpers'
import CategoryChart from './CategoryChart'

export default function MonthlyStats({ lang, rows }) {
  const [param, setParam] = useState('milk_conductivity')
  const ms = months(rows)
  const byMonth = (m) => rows.filter((r) => r.recorded_at.startsWith(m))
  const values = ms.map((m) => avg(byMonth(m).map((r) => r[param])))
  const highCounts = ms.map((m) => byMonth(m).filter((r) => cat(score(r)) === 3).length)
  const change = values.length ? values[values.length - 1] - values[0] : 0
  const labels = ms.map((m) => monthLabel(m, lang))

  return (
    <div className="stack">
      <div className="tools">
        <label>{t(lang, 'param')}</label>
        <select value={param} onChange={(e) => setParam(e.target.value)}>
          {PARAMS.map((p) => (
            <option key={p.key} value={p.key}>
              {paramLabel(lang, p.key)}
            </option>
          ))}
        </select>
      </div>
      <div className="kpis k3">
        <div className="card k">
          <div className="v">{fmt(param, values[values.length - 1])}</div>
          <div className="l">
            {t(lang, 'last')} · {PARAMS.find((p) => p.key === param)?.unit}
          </div>
        </div>
        <div className="card k">
          <div className="v">
            {change > 0 ? '+' : ''}
            {fmt(param, change)}
          </div>
          <div className="l">{t(lang, 'chg')}</div>
        </div>
        <div className="card k">
          <div className="v">{highCounts[highCounts.length - 1] || 0}</div>
          <div className="l">{t(lang, 'high')}</div>
        </div>
      </div>
      <div className="stats-dashboard">
        <div className="card stats-panel stats-panel-wide">
          <h3>{paramLabel(lang, param)} · {t(lang, 'trend')}</h3>
          <CategoryChart labels={labels} values={values.map((v) => +v.toFixed(2))} type="line" color="var(--ac)" />
        </div>
        <div className="card stats-panel">
          <h3>{t(lang, 'highByMonth')}</h3>
          <CategoryChart labels={labels} values={highCounts} type="bar" color="var(--r3)" />
        </div>
      </div>
    </div>
  )
}
