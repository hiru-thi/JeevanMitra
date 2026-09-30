import { t } from '../i18n'
import LangSwitch from './LangSwitch'

export default function Splash({ lang, setLang, onContinue }) {
  return (
    <div
      className="splash"
      style={{
        background:
          'linear-gradient(180deg, rgba(87,91,89,.38) 0%, rgba(67,71,69,.56) 55%, rgba(37,42,39,.84) 100%), url(/herd.jpg) center 45%/cover'
      }}
    >
      <div style={{ position: 'absolute', top: 22, right: 26 }}>
        <LangSwitch lang={lang} onChange={setLang} />
      </div>
      <div className="in">
        <h1>JeevanMitra</h1>
        <p>{t(lang, 'sub')}</p>
        <button className="btn" onClick={onContinue}>
          {t(lang, 'enter')}
        </button>
      </div>
    </div>
  )
}
