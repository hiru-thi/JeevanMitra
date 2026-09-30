import { useMemo, useState } from 'react'
import { t } from '../i18n'
import { cat, score } from '../lib/risk'
import CategoryChart from './CategoryChart'

const SCHEMES = [
  'DAHD – Strategy for Prevention & Control of Mastitis',
  'National Programme for Dairy Development (NPDD)'
]
export default function GovernmentDashboard({ lang, animals, rows, view, onOpen }) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const [taluk, setTaluk] = useState('')
  const [sort, setSort] = useState('name')
  const [isolatedCowIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('jeevanmitra-isolated-cows:farmer') || '[]'))
    } catch {
      return new Set()
    }
  })

  const farms = useMemo(() => {
    const grouped = new Map()
    animals.forEach((animal) => {
      const farmId = animal.farm_id || 'Unassigned'
      const farm = grouped.get(farmId) || {
        id: farmId,
        name: animal.farm_name || farmId,
        region: animal.region || animal.district || '',
        taluk: animal.taluk || animal.taluk_name || '',
        owners: new Set(),
        animals: [],
        health: { healthy: 0, medium: 0, high: 0 }
      }
      if (animal.owner_name) farm.owners.add(animal.owner_name)
      farm.animals.push(animal)
      const category = cat(score(animal))
      farm.health[category >= 3 ? 'high' : category === 2 ? 'medium' : 'healthy'] += 1
      grouped.set(farmId, farm)
    })
    return [...grouped.values()].map((farm) => ({
      ...farm,
      owners: [...farm.owners].join(', '),
      cowCount: farm.animals.length,
      alerts: farm.animals.filter((animal) => cat(score(animal)) >= 2).length,
      openAnimal: [...farm.animals].sort((a, b) => score(b) - score(a))[0]
    }))
  }, [animals, isolatedCowIds])

  const regions = [...new Set(farms.map((farm) => farm.region).filter(Boolean))].sort()
  const taluks = [...new Set(farms.filter((farm) => !region || farm.region === region).map((farm) => farm.taluk).filter(Boolean))].sort()
  const query = search.trim().toLocaleLowerCase()
  const filtered = farms.filter((farm) => {
    const matchesSearch = `${farm.name} ${farm.id} ${farm.owners}`.toLocaleLowerCase().includes(query)
    return matchesSearch && (!region || farm.region === region) && (!taluk || farm.taluk === taluk)
  })
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'alerts') return b.alerts - a.alerts || a.name.localeCompare(b.name)
    if (sort === 'animals') return b.cowCount - a.cowCount || a.name.localeCompare(b.name)
    return a.name.localeCompare(b.name)
  })
  const alertCount = animals.filter((animal) => cat(score(animal)) >= 2).length
  const totalCows = farms.reduce((total, farm) => total + farm.cowCount, 0)
  const riskCounts = animals.reduce((counts, animal) => {
    const category = cat(score(animal))
    counts[category >= 3 ? 'high' : category === 2 ? 'medium' : 'healthy'] += 1
    return counts
  }, { healthy: 0, medium: 0, high: 0 })
  const isolatedCount = animals.filter((animal) => isolatedCowIds.has(animal.animal_id)).length
  const monthly = useMemo(() => {
    const grouped = new Map()
    rows.forEach((row) => {
      if (!row.recorded_at || !row.animal_id) return
      const month = row.recorded_at.slice(0, 7)
      const animalsInMonth = grouped.get(month) || new Map()
      const previous = animalsInMonth.get(row.animal_id)
      if (!previous || row.recorded_at >= previous.recorded_at) animalsInMonth.set(row.animal_id, row)
      grouped.set(month, animalsInMonth)
    })
    const entries = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))
    const locale = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' }[lang]
    return {
      labels: entries.map(([month]) => new Intl.DateTimeFormat(locale, { month: 'short', year: '2-digit' }).format(new Date(`${month}-15`))),
      high: entries.map(([, monthAnimals]) => [...monthAnimals.values()].filter((animal) => cat(score(animal)) === 3).length),
      medium: entries.map(([, monthAnimals]) => [...monthAnimals.values()].filter((animal) => cat(score(animal)) === 2).length),
      healthy: entries.map(([, monthAnimals]) => [...monthAnimals.values()].filter((animal) => cat(score(animal)) < 2).length)
    }
  }, [rows, lang])

  if (view === 'st') {
    return (
      <div className="gov-dashboard">
        <div className="gov-intro"><p>{t(lang, 'govMonthlyDescription')}</p></div>
        <section className="gov-summary-grid" aria-label={t(lang, 'govMonthly')}>
          {[
            [t(lang, 'totalMonitored'), totalCows],
            [t(lang, 'infectedCows'), riskCounts.high],
            [t(lang, 'mediumRisk'), riskCounts.medium],
            [t(lang, 'healthyCows'), riskCounts.healthy],
            [t(lang, 'isolatedCount'), isolatedCount],
            [t(lang, 'predictedCases'), riskCounts.high + riskCounts.medium]
          ].map(([label, value]) => (
            <div className="card gov-kpi" key={label}>
              <span className="gov-kpi-label">{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </section>
        <section className="gov-monthly">
          <div className="gov-directory-heading"><h3>{t(lang, 'riskTrend')}</h3></div>
          {monthly.labels.length ? (
            <div className="gov-monthly-grid">
              {[
                [t(lang, 'infectedCows'), monthly.high, 'var(--r3)'],
                [t(lang, 'mediumRisk'), monthly.medium, 'var(--r2)'],
                [t(lang, 'healthyCows'), monthly.healthy, 'var(--ac)']
              ].map(([label, values, color]) => (
                <div className="card gov-monthly-panel" key={label}>
                  <h4>{label}</h4>
                  <CategoryChart labels={monthly.labels} values={values} type="bar" color={color} />
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">{t(lang, 'noMonthlyData')}</p>
          )}
        </section>
        <section className="gov-directory">
          <div className="gov-directory-heading"><h3>{t(lang, 'farmHealth')}</h3></div>
          <div className="card gov-table-wrap">
            <table className="gov-table gov-health-table">
              <thead><tr>
                <th>{t(lang, 'farm')}</th>
                <th>{t(lang, 'totalCows')}</th>
                <th>{t(lang, 'infectedCows')}</th>
                <th>{t(lang, 'mediumRisk')}</th>
                <th>{t(lang, 'healthyCows')}</th>
              </tr></thead>
              <tbody>{farms.map((farm) => (
                <tr key={farm.id}>
                  <td><b>{farm.name}</b></td>
                  <td>{farm.cowCount}</td>
                  <td>{farm.health.high}</td>
                  <td>{farm.health.medium}</td>
                  <td>{farm.health.healthy}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="gov-dashboard">
      <div className="gov-intro">
        <p>{t(lang, 'govSubtitle')}</p>
      </div>

      <section className="gov-kpis" aria-label="Government herd summary">
        <div className="card gov-kpi">
          <span className="gov-kpi-label">{t(lang, 'totalFarms')}</span>
          <b>{farms.length}</b>
        </div>
        <div className="card gov-kpi">
          <span className="gov-kpi-label">{t(lang, 'totalCows')}</span>
          <b>{totalCows}</b>
        </div>
        <div className="card gov-kpi">
          <span className="gov-kpi-label">{t(lang, 'activeAlerts')}</span>
          <b className="gov-alert-value">{alertCount}</b>
        </div>
        <div className="card gov-kpi scheme-kpi">
          <span className="gov-kpi-label">{t(lang, 'schemes')}</span>
          <b>{SCHEMES.length} {t(lang, 'active')}</b>
          <ul className="gov-scheme-list">
            {SCHEMES.map((scheme) => <li key={scheme}>{scheme}</li>)}
          </ul>
        </div>
      </section>

      <section className="gov-filters" aria-label="Farm directory filters">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t(lang, 'searchFarm')}
          aria-label={t(lang, 'searchFarm')}
        />
        <select value={region} onChange={(event) => { setRegion(event.target.value); setTaluk('') }} aria-label={t(lang, 'allRegions')}>
          <option value="">{t(lang, 'allRegions')} ({regions.length})</option>
          {regions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={taluk} onChange={(event) => setTaluk(event.target.value)} disabled={!taluks.length} aria-label={t(lang, 'allTaluks')}>
          <option value="">{t(lang, 'allTaluks')} ({taluks.length})</option>
          {taluks.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <label className="sort-control">
          <span aria-hidden="true">↕</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t(lang, 'sortFarm')}>
            <option value="name">{t(lang, 'farmAZ')}</option>
            <option value="alerts">{t(lang, 'mostAlerts')}</option>
            <option value="animals">{t(lang, 'mostCows')}</option>
          </select>
        </label>
      </section>

      <section className="gov-directory">
        <div className="gov-directory-heading">
          <h3>{t(lang, 'farmDirectory')}</h3>
          <span>{t(lang, 'showing')} {sorted.length} {t(lang, 'of')} {farms.length} {t(lang, 'farms')}</span>
        </div>
        <div className="card gov-table-wrap">
          {sorted.length ? (
            <table className="gov-table">
              <thead>
                <tr>
                  <th>{t(lang, 'farm')}</th>
                  <th>{t(lang, 'district')}</th>
                  <th>{t(lang, 'taluk')}</th>
                  <th>{t(lang, 'owner')}</th>
                  <th>{t(lang, 'totalCows')}</th>
                  <th>{t(lang, 'activeAlerts')}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((farm) => (
                  <tr className="gov-farm-row" key={farm.name} onClick={() => farm.openAnimal && onOpen(farm.openAnimal.animal_id)}>
                    <td><b>{farm.name}</b><small className="farm-id">{farm.id}</small></td>
                    <td>{farm.region || '—'}</td>
                    <td>{farm.taluk || '—'}</td>
                    <td>{farm.owners || '—'}</td>
                    <td>{farm.cowCount}</td>
                    <td><span className={farm.alerts ? 'gov-alert-count active' : 'gov-alert-count'}>{farm.alerts}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">{t(lang, 'noFarms')}</p>
          )}
        </div>
      </section>
    </div>
  )
}