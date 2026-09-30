import { useState } from 'react'
import { t } from './i18n'
import { supabase } from './supabaseClient'
import { useReadings } from './data/useReadings'
import { visibleRows, latestPerAnimal, avg } from './lib/helpers'
import Splash from './components/Splash'
import Login from './components/Login'
import Shell from './components/Shell'
import Overview from './components/Overview'
import MonthlyStats from './components/MonthlyStats'
import CowDetail from './components/CowDetail'
import Appointments from './components/Appointments'
import GovernmentDashboard from './components/GovernmentDashboard'

export default function App() {
  const [stage, setStage] = useState('splash') // splash | login | app
  const [lang, setLang] = useState('en')
  const [session, setSession] = useState(null) // { role, farmId }
  const [view, setView] = useState('ov') // ov | st | ap | cow
  const [selected, setSelected] = useState(null)
  const [appointmentAnimalId, setAppointmentAnimalId] = useState('')

  const { rows, daily, loading } = useReadings()

  function handleLogin(sessionInfo) {
    setSession(sessionInfo)
    setStage('app')
    setView('ov')
  }

  function handleSignOut() {
    if (supabase) supabase.auth.signOut()
    setSession(null)
    setStage('login')
  }

  function openCow(id) {
    setSelected(id)
    setView('cow')
    window.scrollTo(0, 0)
  }

  function bookSlot(animalId) {
    setAppointmentAnimalId(animalId)
    setSelected(null)
    setView('ap')
    window.scrollTo(0, 0)
  }

  if (stage === 'splash') {
    return <Splash lang={lang} setLang={setLang} onContinue={() => setStage('login')} />
  }
  if (stage === 'login' || !session) {
    return <Login lang={lang} setLang={setLang} onLogin={handleLogin} />
  }
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mu)' }}>
        Loading herd data…
      </div>
    )
  }

  const scoped = visibleRows(rows, session.role, session.farmId)
  const animals = latestPerAnimal(scoped, daily)
  const ambientValues = animals
    .map((animal) => animal.ambient_temperature)
    .filter((value) => value != null && Number.isFinite(Number(value)))
    .map(Number)
  const ambientTemperature = ambientValues.length ? avg(ambientValues) : null
  const cow = selected ? animals.find((a) => a.animal_id === selected) : null
  const history = selected ? daily[selected] || scoped.filter((r) => r.animal_id === selected) : []

  return (
    <Shell
      lang={lang}
      setLang={setLang}
      role={session.role}
      view={view}
      ambientTemperature={ambientTemperature}
      title={t(lang, view === 'st' && ['farmer', 'gov'].includes(session.role) ? 'stats' : view === 'ap' ? 'appointments' : session.role === 'gov' ? 'govDash' : 'overview')}
      onNav={(v) => {
        setView(v)
        setSelected(null)
        setAppointmentAnimalId('')
      }}
      onBack={() => {
        setView('ov')
        setSelected(null)
        setAppointmentAnimalId('')
      }}
      onSignOut={handleSignOut}
    >
      {view === 'cow' && cow ? (
        <CowDetail lang={lang} role={session.role} animal={cow} history={history} onBookSlot={bookSlot} />
      ) : view === 'st' && session.role === 'farmer' ? (
        <MonthlyStats lang={lang} rows={scoped} />
      ) : view === 'ap' ? (
        <Appointments lang={lang} role={session.role} animals={animals} initialAnimalId={appointmentAnimalId} />
      ) : session.role === 'gov' ? (
        <GovernmentDashboard lang={lang} animals={animals} rows={scoped} view={view} onOpen={openCow} />
      ) : (
        <Overview
          lang={lang}
          role={session.role}
          animals={animals}
          onOpen={openCow}
          onBookSlot={bookSlot}
          onOpenAppointments={() => setView('ap')}
        />
      )}
    </Shell>
  )
}
