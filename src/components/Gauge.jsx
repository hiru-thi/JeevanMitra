import { t } from '../i18n'
import { RISK_COLORS } from '../lib/risk'

const clamp = (x, a, b) => Math.max(a, Math.min(b, x))

// Renders a three-band gauge (Normal / Watch / High) for one metric.
// `lo`/`hi` bound the visible track; `okMax`/`watchMax` mark where the
// green→amber and amber→red thresholds fall. `reverse` flips the meaning
// for metrics where a *falling* value is the concern (e.g. yield change).
export default function Gauge({ lang, value, lo, hi, okMax, watchMax, reverse = false }) {
  const pos = clamp((value - lo) / (hi - lo), 0, 1) * 100
  let level
  if (reverse) level = value > okMax ? 0 : value > watchMax ? 1 : 2
  else level = value < okMax ? 0 : value < watchMax ? 1 : 2
  const labels = reverse ? ['gh', 'gw', 'gn'].slice().reverse() : ['gn', 'gw', 'gh']
  const color = RISK_COLORS[[0, 2, 3][level]]

  return (
    <>
      <div className={`gb${reverse ? ' rev' : ''}`}>
        <i style={{ left: pos + '%' }} />
      </div>
      <div className="gf">
        <b style={{ color }}>{t(lang, ['gn', 'gw', 'gh'][level])}</b>
        <span>
          {['gn', 'gw', 'gh'].map((k) => (
            <em key={k}>{t(lang, k)}</em>
          ))}
        </span>
      </div>
    </>
  )
}
