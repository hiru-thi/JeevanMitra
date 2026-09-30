import { t, paramLabel } from '../i18n'
import { score, cat, fmt, RISK_COLORS } from '../lib/risk'
import FollowUpSwitch from './FollowUpSwitch'

export default function AnimalTable({ lang, role, animals, onOpen, isolatedCowIds = [], onToggleIsolation, titleKey }) {
  const rows = animals.map((r) => ({ r, s: score(r) })).sort((a, b) => b.s - a.s)
  const showFarm = role === 'vet'
  const showIsolationSwitch = role === 'farmer'

  return (
    <section>
      <div className="sh">
        <h3>{t(lang, titleKey || (role === 'vet' ? 'riskCows' : 'allc'))}</h3>
        <span className="tag">{animals.length}</span>
      </div>
      <div className="card tw">
        {!rows.length && <p className="empty-state">{t(lang, 'riskEmpty')}</p>}
        {!!rows.length && (
        <table>
          <thead>
            <tr>
              <th>{t(lang, 'animal')}</th>
              {showFarm && <th>{t(lang, 'farm')}</th>}
              <th>{t(lang, 'breed')}</th>
              <th>{t(lang, 'age')}</th>
              <th>{t(lang, 'lact')}</th>
              <th>{paramLabel(lang, 'milk_conductivity')}</th>
              <th>{t(lang, 'scc')}</th>
              <th>{paramLabel(lang, 'udder_temperature')}</th>
              <th>{paramLabel(lang, 'milk_yield')}</th>
              <th>{t(lang, 'score')}</th>
              <th>{t(lang, 'risk')}</th>
              {showIsolationSwitch && <th>{t(lang, 'isolateColumn')}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ r, s }) => {
              const c = cat(s)
              return (
                <tr
                  key={r.animal_id}
                  className="row"
                  onClick={(event) => {
                    if (event.target.closest('a, button, input, label, select')) return
                    onOpen(r.animal_id)
                  }}
                >
                  <td>
                    <b>{r.animal_id}</b>
                  </td>
                  {showFarm && <td>{r.farm_id}</td>}
                  <td>{r.breed || '–'}</td>
                  <td>{r.age ?? '–'}</td>
                  <td>{r.lactation ?? '–'}</td>
                  <td>{fmt('milk_conductivity', r.milk_conductivity)}</td>
                  <td>{r.scc == null ? '–' : Math.round(r.scc)}</td>
                  <td>{fmt('udder_temperature', r.udder_temperature)}</td>
                  <td>{fmt('milk_yield', r.milk_yield)}</td>
                  <td>
                    <span className="bar">
                      <i style={{ width: s + '%', background: RISK_COLORS[c] }} />
                    </span>
                    {s.toFixed(0)}
                  </td>
                  <td>
                    <span className="chip" style={{ background: RISK_COLORS[c] }}>
                      {t(lang, 'r' + c)}
                    </span>
                  </td>
                  {showIsolationSwitch && (
                    <td>
                      <FollowUpSwitch
                        className="table-switch"
                        checked={isolatedCowIds.includes(r.animal_id)}
                        label={`${t(lang, isolatedCowIds.includes(r.animal_id) ? 'releaseCow' : 'isolateCow')} ${r.animal_id}`}
                        onLabel=""
                        offLabel=""
                        onChange={() => onToggleIsolation(r.animal_id)}
                      />
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        )}
      </div>
    </section>
  )
}
