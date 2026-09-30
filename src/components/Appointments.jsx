import { useEffect, useState } from 'react'
import { t } from '../i18n'
import { supabase } from '../supabaseClient'

const STORAGE_KEY = 'bovinemitra-appointments'
const SLOTS = ['09:00', '10:00', '11:30', '14:00', '15:00']
const LOCALES = { en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' }

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function appointmentDateKey(value) {
  return dateKey(new Date(value))
}

function appointmentTimeKey(value) {
  const date = new Date(value)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Appointments({ lang, role, animals, initialAnimalId = '', compact = false, onOpenAppointments, onBookSlot }) {
  const [appointments, setAppointments] = useState([])
  const [animalId, setAnimalId] = useState(initialAnimalId || animals[0]?.animal_id || '')
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const today = dateKey(new Date())

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (supabase) {
        const { data, error } = await supabase
          .from('vet_appointments')
          .select('*')
          .order('appointment_at', { ascending: true })
        if (!cancelled) {
          if (error) setMessage(`Could not load appointments: ${error.message}`)
          else setAppointments(data || [])
        }
      } else if (!cancelled) {
        setAppointments(loadLocal())
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const availableSlots = SLOTS.filter((time) => {
    const taken = appointments.some(
      (appointment) =>
        appointment.status !== 'Cancelled' &&
        appointmentDateKey(appointment.appointment_at) === date &&
        appointmentTimeKey(appointment.appointment_at) === time
    )
    const inPast = date === today && new Date(`${date}T${time}:00`) <= new Date()
    return !taken && !inPast
  })
  const visibleAppointments =
    role === 'farmer'
      ? appointments.filter((appointment) => animals.some((animal) => animal.animal_id === appointment.animal_id))
      : appointments
  const animalById = new Map(animals.map((animal) => [animal.animal_id, animal]))
  const upcomingAppointments = visibleAppointments
    .filter((appointment) => appointment.status !== 'Cancelled' && new Date(appointment.appointment_at) >= new Date())
    .sort((a, b) => a.appointment_at.localeCompare(b.appointment_at))
    .slice(0, 3)

  useEffect(() => {
    if (initialAnimalId && animals.some((animal) => animal.animal_id === initialAnimalId)) {
      setAnimalId(initialAnimalId)
    }
  }, [animals, initialAnimalId])

  async function book(event) {
    event.preventDefault()
    if (!animalId || !date || !slot) return
    setSaving(true)
    setMessage('')
    const animal = animalById.get(animalId)
    const entry = {
      animal_id: animalId,
      farm_id: animal?.farm_id || null,
      appointment_at: new Date(`${date}T${slot}:00`).toISOString(),
      reason: reason.trim(),
      status: 'Booked'
    }

    if (supabase) {
      const { data: auth } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('vet_appointments')
        .insert({ ...entry, booked_by: auth?.user?.id || null })
        .select('*')
        .single()
      if (error) {
        setMessage(`Could not book the slot: ${error.message}`)
        setSaving(false)
        return
      }
      setAppointments((current) => [...current, data].sort((a, b) => a.appointment_at.localeCompare(b.appointment_at)))
    } else {
      const booked = { ...entry, id: `${Date.now()}`, booked_by: 'demo' }
      const next = [...appointments, booked].sort((a, b) => a.appointment_at.localeCompare(b.appointment_at))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setAppointments(next)
      } catch {
        setMessage('Could not save the booking in browser storage.')
        setSaving(false)
        return
      }
    }
    setSlot('')
    setReason('')
    setMessage('Appointment booked.')
    setSaving(false)
  }

  async function cancelAppointment(appointment) {
    setSaving(true)
    setMessage('')
    if (supabase) {
      const { data: auth } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('vet_appointments')
        .update({ status: 'Cancelled' })
        .eq('id', appointment.id)
        .eq('booked_by', auth?.user?.id || '')
      if (error) {
        setMessage(t(lang, 'cancelFailed'))
        setSaving(false)
        return
      }
    }

    const next = appointments.map((item) =>
      (item.id && appointment.id ? item.id === appointment.id : item.animal_id === appointment.animal_id && item.appointment_at === appointment.appointment_at)
        ? { ...item, status: 'Cancelled' }
        : item
    )
    if (!supabase) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        setMessage(t(lang, 'cancelFailed'))
        setSaving(false)
        return
      }
    }
    setAppointments(next)
    setMessage('')
    setSaving(false)
  }

  if (compact) {
    return (
      <section className="appointment-summary">
        <div className="sh">
          <h3>Veterinary visits</h3>
          <button className="text-action" onClick={onOpenAppointments}>View all</button>
        </div>
        {loading ? (
          <p className="empty-state">Loading booked slots…</p>
        ) : upcomingAppointments.length ? (
          <div className="upcoming-list">
            {upcomingAppointments.map((appointment) => (
              <div className="upcoming-row" key={appointment.id || appointment.appointment_at + appointment.animal_id}>
                <b>{appointment.animal_id}</b>
                <span>{new Intl.DateTimeFormat(LOCALES[lang] || 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(appointment.appointment_at))}</span>
                <span className="appointment-status">{appointment.status || 'Booked'}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="upcoming-empty">
            <span>No upcoming vet visit booked.</span>
            <button className="btn sm" onClick={() => onBookSlot(animals[0]?.animal_id)}>Book a slot</button>
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="appointment-page">
      {role === 'farmer' && (
        <section className="card appointment-booking">
          <div className="feature-heading">
            <div>
              <h3>Book a veterinary appointment</h3>
              <p>Select the cow and an available visit slot.</p>
            </div>
          </div>
          <form className="booking-form" onSubmit={book}>
            <label className="booking-field">
              <span>Cow</span>
              <select value={animalId} onChange={(event) => setAnimalId(event.target.value)} required>
                {animals.map((animal) => (
                  <option key={animal.animal_id} value={animal.animal_id}>
                    {animal.animal_id} · {animal.breed || 'Animal'}
                  </option>
                ))}
              </select>
            </label>
            <label className="booking-field">
              <span>Date</span>
              <input type="date" min={today} value={date} onChange={(event) => { setDate(event.target.value); setSlot('') }} required />
            </label>
            <label className="booking-field">
              <span>Available time</span>
              <select value={slot} onChange={(event) => setSlot(event.target.value)} disabled={!date || availableSlots.length === 0} required>
                <option value="">Choose a slot</option>
                {availableSlots.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </label>
            <label className="booking-field reason-field">
              <span>Reason for visit</span>
              <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Optional" />
            </label>
            <div className="booking-submit">
              <button className="btn" type="submit" disabled={saving || loading || !animals.length}>
                {saving ? 'Booking…' : 'Book this cow'}
              </button>
              <span role="status">{message || (date && !availableSlots.length ? 'No slots available for this date.' : '')}</span>
            </div>
          </form>
        </section>
      )}

      <section className="appointment-list">
        <div className="sh">
          <h3>{role === 'vet' ? 'Booked appointments' : 'Your booked slots'}</h3>
          <span className="tag">{visibleAppointments.length}</span>
        </div>
        {loading ? (
          <div className="card empty-state">Loading appointments…</div>
        ) : visibleAppointments.length ? (
          <div className="card appointment-table-wrap">
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Cow</th>
                  {role === 'vet' && <th>Farm</th>}
                  {role === 'vet' && <th>Owner</th>}
                  <th>Date and time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {role === 'farmer' && <th>{t(lang, 'actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {visibleAppointments.map((appointment) => {
                  const animal = animalById.get(appointment.animal_id)
                  return (
                    <tr key={appointment.id || appointment.appointment_at + appointment.animal_id}>
                      <td><b>{appointment.animal_id}</b></td>
                      {role === 'vet' && <td>{appointment.farm_id || animal?.farm_id || '–'}</td>}
                      {role === 'vet' && <td>{animal?.owner_name || '–'}</td>}
                      <td>{new Intl.DateTimeFormat(LOCALES[lang] || 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(appointment.appointment_at))}</td>
                      <td>{appointment.reason || '–'}</td>
                      <td>
                        <span className={`appointment-status ${appointment.status === 'Cancelled' ? 'cancelled' : ''}`}>
                          {appointment.status === 'Cancelled' ? t(lang, 'cancelled') : appointment.status || 'Booked'}
                        </span>
                      </td>
                      {role === 'farmer' && (
                        <td>
                          {appointment.status !== 'Cancelled' && (
                            <button
                              className="btn sm cancel-appointment"
                              type="button"
                              disabled={saving}
                              onClick={() => cancelAppointment(appointment)}
                            >
                              {t(lang, 'cancel')}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card empty-state">No appointments booked yet.</div>
        )}
      </section>
    </div>
  )
}