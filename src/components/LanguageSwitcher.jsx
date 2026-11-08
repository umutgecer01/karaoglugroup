import { Languages } from 'lucide-react';
import { languages } from '../utils/i18n.js';

export default function LanguageSwitcher({ language, setLanguage, ariaLabel = 'Language' }) {
  return <label className="language-trigger">
    <Languages size={17} aria-hidden="true" />
    <select className="language-select" value={language} aria-label={ariaLabel} onChange={event => setLanguage(event.target.value)}>
      {languages.map(item => <option key={item.code} value={item.code} lang={item.code}>{item.label} — {item.name}</option>)}
    </select>
  </label>;
}
