import { useState } from 'react'
import { t } from '../i18n'
import LangSwitch from './LangSwitch'
import { supabase, PROFILES_TABLE } from '../supabaseClient'

const ROLES = ['farmer', 'vet', 'gov']

export default function Login({ lang, setLang, onLogin }) {
  const [pick, setPick] = useState('farmer')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setError('')
    if (!supabase) {
      // Demo mode: no backend configured, so the picked role is trusted directly.
      onLogin({ role: pick, farmId: null })
      return
    }
    setBusy(true)
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (authErr || !data?.user) {
      setBusy(false)
      setError(t(lang, 'signInFail'))
      return
    }
    const { data: profile } = await supabase
      .from(PROFILES_TABLE)
      .select('role, farm_id')
      .eq('id', data.user.id)
      .maybeSingle()
    setBusy(false)
    onLogin({ role: profile?.role || pick, farmId: profile?.farm_id || null })
  }

  return (
    <div
      className="login"
      style={{
        background:
          'linear-gradient(180deg, rgba(75,80,77,.58) 0%, rgba(65,70,67,.52) 40%, rgba(37,42,39,.84) 100%), url(/herd.jpg) center 42%/cover'
      }}
    >
      <div className="lbrand">JeevanMitra</div>
      <div style={{ position: 'absolute', top: 22, right: 26 }}>
        <LangSwitch lang={lang} onChange={setLang} />
      </div>
      <div className="lcard">
        <h2>{t(lang, 'role')}</h2>
        <div className="roles">
          {ROLES.map((k) => (
            <button key={k} className={`role ${pick === k ? 'on' : ''}`} onClick={() => setPick(k)}>
              <b>{t(lang, k)}</b>
              <span>{pick === k ? '●' : '○'}</span>
            </button>
          ))}
        </div>
        <label className="fld">
          <span>{t(lang, 'email')}</span>
          <input autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="fld">
          <span>{t(lang, 'pass')}</span>
          <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        {error && <div className="lang-msg" style={{ color: '#ffb4a6' }}>{error}</div>}
        {!supabase && <div className="lang-msg">Demo mode — connect Supabase for real sign-in.</div>}
        <button className="btn" onClick={submit} disabled={busy}>
          {t(lang, 'enter')}
        </button>
      </div>
    </div>
  )
}
