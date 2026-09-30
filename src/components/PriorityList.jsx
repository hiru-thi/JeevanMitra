import { t, paramLabel } from '../i18n'
import { score, cat, fmt, RISK_COLORS } from '../lib/risk'
import { telHref } from '../lib/helpers'

export default function PriorityList({ lang, role, animals, onOpen, onBookSlot }) {
  const high = animals
    .map((r) => ({ r, s: score(r) }))
    .filter((x) => cat(x.s) === 3)
    .sort((a, b) => b.s - a.s)

  return (
    <section>
      <div className="sh">
        <h3>{t(lang, 'prio')}</h3>
        <span className="tag">{high.length}</span>
      </div>
      {high.length ? (
        <div className="pcards">
          {high.map(({ r, s }) => (
            <div key={r.animal_id} className="card pc" style={{ borderTop: '3px solid var(--r3)' }} onClick={() => onOpen(r.animal_id)}>
              <div className="pt">
                <span>{r.animal_id}</span>
                <span className="chip" style={{ background: RISK_COLORS[3] }}>
                  {s.toFixed(0)}
                </span>
              </div>
              <div className="pm">
                {r.farm_id} · {r.district}
              </div>
              <div className="pv">
                <div>
                  <span>{paramLabel(lang, 'milk_conductivity')}</span>
                  <b>{fmt('milk_conductivity', r.milk_conductivity)}</b>
                </div>
                <div>
                  <span>{paramLabel(lang, 'udder_temperature')}</span>
                  <b>{fmt('udder_temperature', r.udder_temperature)}</b>
                </div>
                <div>
                  <span>{paramLabel(lang, 'yield_change')}</span>
                  <b>{fmt('yield_change', r.yield_change)}%</b>
                </div>
              </div>
              {role === 'farmer' && (
                <div className="pc-actions">
                  <a className="btn sm" href={telHref(r.vet_phone)} onClick={(e) => e.stopPropagation()}>
                    ☎ {t(lang, 'call')}
                  </a>
                  <button className="btn sm secondary" onClick={(e) => { e.stopPropagation(); onBookSlot(r.animal_id) }}>
                    Book slot
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ color: 'var(--mu)' }}>
          {t(lang, 'none')}
        </div>
      )}
    </section>
  )
}
