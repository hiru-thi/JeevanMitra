import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { cat, score } from '../lib/risk'
import { analyzeRiskSignals } from './RiskExplanation'

const STORAGE_KEY = 'bovinemitra-vet-assessments'
const FIELDS = [
  ['clinical_observation', 'Clinical observation', 'textarea'],
  ['udder_observation', 'Udder observation', 'textarea'],
  ['milk_observation', 'Milk observation', 'textarea'],
  ['temperature_observation', 'Temperature observation', 'input'],
  ['pain_swelling_observation', 'Pain / swelling observation', 'textarea'],
  ['preliminary_assessment', 'Preliminary assessment', 'input'],
  ['treatment', 'Treatment', 'input'],
  ['medication', 'Medication', 'input'],
  ['dosage', 'Dosage', 'input'],
  ['notes', 'Notes', 'textarea'],
  ['follow_up_date', 'Follow-up date', 'date']
]

function readLocal(animalId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const records = all[animalId] || []
    return records[records.length - 1] || null
  } catch {
    return null
  }
}

export default function VetAssessment({ animal, history }) {
  const [form, setForm] = useState({})
  const [record, setRecord] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const riskScore = score(animal)
  const riskLabel = ['No risk', 'Low', 'Moderate', 'High'][cat(riskScore)]
  const signals = analyzeRiskSignals(history, animal)
  const clinical = record?.assessment || form

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (supabase) {
        const { data, error } = await supabase
          .from('vet_assessments')
          .select('*')
          .eq('animal_id', animal.animal_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (cancelled) return
        if (!error && data) {
          const loaded = { ...data, assessment: data.assessment || {} }
          setRecord(loaded)
          setForm(loaded.assessment)
        } else {
          setRecord(readLocal(animal.animal_id))
        }
      } else {
        const saved = readLocal(animal.animal_id)
        setRecord(saved)
        setForm(saved?.assessment || {})
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [animal.animal_id])

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const assessment = { ...form }
    const entry = {
      animal_id: animal.animal_id,
      farm_id: animal.farm_id,
      ai_risk_score: Number(riskScore.toFixed(1)),
      ai_risk_category: riskLabel,
      assessment,
      created_at: new Date().toISOString()
    }

    if (supabase) {
      const { data: auth } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('vet_assessments')
        .insert({ ...entry, vet_id: auth?.user?.id || null })
        .select('*')
        .single()
      if (error) {
        setMessage(`Could not save the assessment: ${error.message}`)
        setSaving(false)
        return
      }
      setRecord(data)
    } else {
      try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        all[animal.animal_id] = [...(all[animal.animal_id] || []), entry]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
        setRecord(entry)
      } catch {
        setMessage('Could not save this assessment in browser storage.')
        setSaving(false)
        return
      }
    }
    setMessage('Clinical outcome saved.')
    setSaving(false)
  }

  return (
    <section className="vet-workflow">
      <div className="card assessment-card">
        <div className="feature-heading">
          <div>
            <h3>Vet clinical assessment</h3>
            <p>Record the examination and clinical outcome separately from the AI prediction.</p>
          </div>
          {record?.created_at && <span className="tag">Last saved {new Date(record.created_at).toLocaleDateString()}</span>}
        </div>
        <form onSubmit={save}>
          <div className="assessment-fields">
            {FIELDS.map(([key, label, type]) => (
              <label className={type === 'textarea' ? 'assessment-field wide' : 'assessment-field'} key={key}>
                <span>{label}</span>
                {type === 'textarea' ? (
                  <textarea rows="2" value={form[key] || ''} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
                ) : (
                  <input type={type} value={form[key] || ''} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
                )}
              </label>
            ))}
          </div>
          <div className="assessment-actions">
            <button className="btn" type="submit" disabled={saving || loading}>
              {saving ? 'Saving…' : 'Save clinical outcome'}
            </button>
            <span role="status">{message}</span>
          </div>
        </form>
      </div>

      <div className="card comparison-card">
        <div className="feature-heading">
          <div>
            <h3>AI prediction vs veterinarian</h3>
            <p>Model output and clinical findings are stored as separate evidence.</p>
          </div>
          <span className="tag">AI prediction is not a diagnosis</span>
        </div>
        {loading ? (
          <p className="empty-state">Loading saved assessment…</p>
        ) : (
          <div className="comparison-table">
            <div className="comparison-head"><b>BovineGuard AI</b><b>Veterinarian</b></div>
            <div><span>Risk decision</span><span>{riskLabel} predicted · {riskScore.toFixed(0)}/100</span><span>{clinical.preliminary_assessment || 'Not recorded'}</span></div>
            <div><span>SCC trend</span><span>{signals[0].direction} {signals[0].severity}</span><span>{clinical.udder_observation || 'Examination not recorded'}</span></div>
            <div><span>Conductivity trend</span><span>{signals[1].direction} {signals[1].severity}</span><span>{clinical.milk_observation || 'Milk observation not recorded'}</span></div>
            <div><span>Udder temperature</span><span>{signals[2].direction} {signals[2].severity}</span><span>{clinical.temperature_observation || 'Temperature not confirmed'}</span></div>
            <div><span>Clinical decision</span><span>Prediction only</span><span>{clinical.treatment || clinical.preliminary_assessment || 'Not recorded'}</span></div>
          </div>
        )}
      </div>
    </section>
  )
}