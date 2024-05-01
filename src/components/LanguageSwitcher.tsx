
import FaIcon from '@/components/FaIcon';
import { useTranslation } from 'react-i18next';

export type TLang = 'pl' | 'en'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const changeLanguageHandler = (lang: TLang) => i18n.changeLanguage(lang)

  return <div className="language-switcher">
    <FaIcon icon="globe" />
    <button onClick={() => changeLanguageHandler('pl')} className={i18n.language === 'pl' ? 'active' : ''}>PL</button>
    <button onClick={() => changeLanguageHandler('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
  </div>
}
