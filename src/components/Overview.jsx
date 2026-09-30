import { useState } from 'react'
import { t } from '../i18n'
import { score, cat } from '../lib/risk'
import { avg } from '../lib/helpers'
import PriorityList from './PriorityList'
import AnimalTable from './AnimalTable'
import Appointments from './Appointments'
import FollowUpSwitch from './FollowUpSwitch'

export default function Overview({ lang, role, animals, onOpen, onBookSlot, onOpenAppointments }) {
  const isolationKey = 'jeevanmitra-isolated-cows:farmer'
  const [isolatedCowIds, setIsolatedCowIds] = useState(() => {
    try {
      const saved = localStorage.getItem(isolationKey) ?? localStorage.getItem(`jeevanmitra-followups:${role}`) ?? '[]'
      return JSON.parse(saved)
    } catch {
      return []
    }
  })
  const dashboardAnimals = role === 'vet' ? animals.filter((animal) => cat(score(animal)) === 3) : animals
  const isolatedCows = role === 'farmer' ? animals.filter((animal) => isolatedCowIds.includes(animal.animal_id)) : []
  const tableAnimals = role === 'farmer'
    ? animals.filter((animal) => !isolatedCowIds.includes(animal.animal_id))
    : dashboardAnimals
  const attentionAnimals = animals
  const scores = animals.map(score)
  const high = scores.filter((s) => cat(s) === 3).length
  const atRisk = scores.filter((s) => cat(s) >= 2).length
  const moderate = scores.filter((s) => cat(s) === 2).length
  const low = scores.filter((s) => cat(s) === 1).length
  const kpis = role === 'farmer'
    ? [[animals.length, 'herd'], [high, 'high'], [moderate, 'r2'], [low, 'r1']]
    : [[animals.length, 'herd'], [high, 'high'], [atRisk, 'atrisk'], [avg(scores).toFixed(0), 'avg']]

  function toggleIsolation(animalId) {
    setIsolatedCowIds((current) => {
      const next = current.includes(animalId)
        ? current.filter((id) => id !== animalId)
        : [...current, animalId]
      try {
        localStorage.setItem(isolationKey, JSON.stringify(next))
      } catch {
        // Keep the current session usable when browser storage is unavailable.
      }
      return next
    })
  }

  return (
    <div className="stack">
      <div className="kpis">
        {kpis.map(([v, l], i) => (
          <div key={l} className="card k">
            <div className="v" style={i === 1 && high ? { color: 'var(--r3)' } : undefined}>
              {v}
            </div>
            <div className="l">{t(lang, l)}</div>
          </div>
        ))}
      </div>
      <PriorityList lang={lang} role={role} animals={attentionAnimals} onOpen={onOpen} onBookSlot={onBookSlot} />
      {role === 'farmer' && (
        <Appointments compact lang={lang} role={role} animals={animals} onOpenAppointments={onOpenAppointments} />
      )}
      <AnimalTable
        lang={lang}
        role={role}
        animals={tableAnimals}
        onOpen={onOpen}
        isolatedCowIds={isolatedCowIds}
        onToggleIsolation={toggleIsolation}
      />
      {role === 'farmer' && isolatedCows.length > 0 && (
        <AnimalTable
          lang={lang}
          role={role}
          animals={isolatedCows}
          titleKey="isolatedCows"
          onOpen={onOpen}
          isolatedCowIds={isolatedCowIds}
          onToggleIsolation={toggleIsolation}
        />
      )}
    </div>
  )
}
