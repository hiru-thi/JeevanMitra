import { LANGS } from '../i18n'

const LABEL = { en: 'English', ta: 'தமிழ்', hi: 'हिन्दी' }
const SHORT = { en: 'EN', ta: 'த', hi: 'हि' }

export default function LangSwitch({ lang, onChange, short = false }) {
  return (
    <div className="lang">
      {LANGS.map((l) => (
        <button key={l} className={lang === l ? 'on' : ''} onClick={() => onChange(l)}>
          {short ? SHORT[l] : LABEL[l]}
        </button>
      ))}
    </div>
  )
}
