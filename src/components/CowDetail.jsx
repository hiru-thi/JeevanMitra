import { t, paramLabel } from '../i18n'
import { PARAMS, GROUPS, KEY_CARD_KEYS, score, cat, fmt, leadingFactor, RISK_COLORS } from '../lib/risk'
import { telHref, avg } from '../lib/helpers'
import Gauge from './Gauge'
import TrendChart from './TrendChart'
import TrendAnalysis from './TrendAnalysis'
import RiskExplanation from './RiskExplanation'
import VetAssessment from './VetAssessment'

const REC_KEY = { conductivity: 'rConductivity', temperature: 'rTemperature', yield: 'rYield' }

// Which gauge shape each key-card metric uses. `reverse` = a falling value
// is the concern (yield dropping), everything else rising is the concern.
const GAUGE_CFG = {
  udder_temperature: { lo: 34, hi: 38, okMax: 35.8, watchMax: 36.5 },
  scc: { lo: 0, hi: 500, okMax: 200, watchMax: 400 },
  milk_conductivity: { lo: 4.5, hi: 7, okMax: 5.5, watchMax: 6.2 },
  milk_yield: { lo: -30, hi: 10, okMax: -8, watchMax: -16, reverse: true, field: 'yield_change' }
}

const KEY_UNIT = { udder_temperature: '°C', scc: '×10³/mL', milk_conductivity: 'mS/cm', milk_yield: 'L' }

export default function CowDetail({ lang, role, animal, history, onCallVet, onBookSlot }) {
  const s = score(animal)
  const c = cat(s)
  const dates = history.map((r) => r.recorded_at)
  const baseline = avg(history.slice(0, 7).map((r) => r.udder_temperature))
  const inflectionIdx = history.findIndex((r, i) => i > 7 && r.udder_temperature - baseline > 0.6)
  const recKey = c < 2 ? 'rOk' : REC_KEY[leadingFactor(animal)]

  const callInfo =
    role === 'farmer'
      ? { label: t(lang, 'call'), name: animal.vet_name, phone: animal.vet_phone }
      : role === 'vet'
      ? { label: t(lang, 'callf'), name: animal.owner_name, phone: animal.owner_phone }
      : null

  return (
    <div className="stack">
      <div className="card head">
        <div>
          <h1 className="big">{animal.animal_id}</h1>
          <div className="meta">
            <span>
              {t(lang, 'breed')}: {animal.breed || '–'}
            </span>
            <span>
              {t(lang, 'age')}: {animal.age ?? '–'} {t(lang, 'yrs')}
            </span>
            <span>
              {t(lang, 'lact')}: {animal.lactation ?? '–'}
            </span>
            <span>
              {animal.farm_id} · {animal.district}
            </span>
          </div>
        </div>
        <span className="pill" style={{ background: RISK_COLORS[c] }}>
          {t(lang, 'r' + c)} · {s.toFixed(0)}
        </span>
      </div>

      {c >= 2 && (
        <div className="card alert" style={{ borderColor: RISK_COLORS[c] }}>
          <div>
            <b>{t(lang, 'alertT')}</b>
            <p>
              {t(lang, c === 3 ? 'alertH' : 'alertB')} {t(lang, recKey)}
            </p>
          </div>
          {callInfo && (
            <div className="alert-actions">
              <a className="btn" href={telHref(callInfo.phone)} onClick={onCallVet}>
                ☎ {callInfo.label}
                {callInfo.name ? ' · ' + callInfo.name : ''}
              </a>
              {role === 'farmer' && (
                <button className="btn secondary" onClick={() => onBookSlot(animal.animal_id)}>Book slot</button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="kpis">
        {KEY_CARD_KEYS.map((key) => {
          const g = GAUGE_CFG[key]
          const value = animal[g.field || key]
          return (
            <div key={key} className="card kc">
              <div className="l">{key === 'scc' ? t(lang, 'scc') : paramLabel(lang, key)}</div>
              <div className="v">
                {fmt(key, animal[key])} <small>{KEY_UNIT[key]}</small>
              </div>
              <Gauge lang={lang} value={value} lo={g.lo} hi={g.hi} okMax={g.okMax} watchMax={g.watchMax} reverse={g.reverse} />
            </div>
          )
        })}
      </div>

      {role === 'vet' && (
        <>
          <TrendAnalysis lang={lang} history={history} />
          <RiskExplanation history={history} animal={animal} />
          <VetAssessment animal={animal} history={history} />
        </>
      )}

      <div className="cols2">
        <div className="card">
          <h3>{t(lang, 'ch1')}</h3>
          <TrendChart
            lang={lang}
            dates={dates}
            series={[
              { v: history.map((r) => r.milk_yield), c: 'var(--ac)', ax: 0, n: paramLabel(lang, 'milk_yield') + ' (L)' },
              { v: history.map((r) => r.scc || 0), c: 'var(--r3)', ax: 1, n: t(lang, 'scc') }
            ]}
          />
        </div>
        <div className="card">
          <h3>{t(lang, 'ch2')}</h3>
          <TrendChart
            lang={lang}
            dates={dates}
            series={[
              { v: history.map((r) => r.skin_temperature), c: 'var(--r1)', n: paramLabel(lang, 'skin_temperature') },
              { v: history.map((r) => r.udder_temperature), c: 'var(--r2)', n: paramLabel(lang, 'udder_temperature') }
            ]}
            markIndex={inflectionIdx}
            markLabel={t(lang, 'infl')}
          />
        </div>
      </div>

      <div className="card">
        <h3>{t(lang, 'params')}</h3>
        <div className="pg">
          {GROUPS.map((g) => (
            <div key={g} className="grp">
              <h3>{t(lang, g)}</h3>
              {PARAMS.filter((p) => p.group === g).map((p) => (
                <div key={p.key} className="kv">
                  <span>{paramLabel(lang, p.key)}</span>
                  <span>
                    <b>{fmt(p.key, animal[p.key])}</b> <u>{p.unit}</u>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="rec">
          <b>{t(lang, 'rec')}</b>
          <br />
          {t(lang, recKey)}
        </div>
      </div>
    </div>
  )
}
