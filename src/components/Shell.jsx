import { t } from '../i18n'
import LangSwitch from './LangSwitch'

export default function Shell({ lang, setLang, role, view, title, ambientTemperature, onNav, onBack, onSignOut, children }) {
  return (
    <div className="app">
      <main>
        <div className="top">
          <div className="top-heading">
            <span className="app-brand">{t(lang, 'app')}</span>
            <div className="page-heading">
            {view !== 'ov' && (
              <button className="back" onClick={onBack} aria-label={t(lang, 'back')}>
                &lt;&lt;&lt;
              </button>
            )}
            {view !== 'cow' && <h1>{title}</h1>}
            </div>
          </div>
          <div className="top-right">
            <div className="top-meta">
              <span className="tag">{t(lang, role)}</span>
              <LangSwitch lang={lang} onChange={setLang} short />
            </div>
            <div className="top-actions">
              <button className={`header-stat ${view !== 'st' ? 'on' : ''}`} onClick={() => onNav('ov')} aria-pressed={view !== 'st'}>
                {t(lang, 'overview')}
              </button>
              {(role === 'farmer' || role === 'gov') && (
                <button className={`header-stat ${view === 'st' ? 'on' : ''}`} onClick={() => onNav('st')} aria-pressed={view === 'st'}>
                  {t(lang, 'stats')}
                </button>
              )}
              <button className={`header-stat ${view === 'ap' ? 'on' : ''}`} onClick={() => onNav('ap')} aria-pressed={view === 'ap'}>
                {t(lang, 'appointments')}
              </button>
              <div className="ambient-reading" aria-label={`${t(lang, 'ambient')}: ${ambientTemperature == null ? 'unavailable' : ambientTemperature.toFixed(1) + ' °C'}`}>
                <span>{t(lang, 'ambient')}</span>
                <b>{ambientTemperature == null ? '–' : ambientTemperature.toFixed(1)} °C</b>
              </div>
              <button className="header-signout" onClick={onSignOut}>{t(lang, 'out')}</button>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
