import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      '25 + 5 Clock': '25 + 5 Clock',
      'Break length': 'Break length',
      'Session time': 'Session time',
      'Session': 'Session',
      'BREAK': 'BREAK',
      'Play/Stop': 'Play/Stop',
      'Reset': 'Reset to defaults',
      'Undo': 'Reset time',
      'Sound On/Off': 'Sound On/Off',
      'Language': 'Language',
    }
  },
  pl: {
    translation: {
      '25 + 5 Clock': 'Zegar 25 + 5',
      'Break length': 'Czas przerwy',
      'Session time': 'Czas sesji',
      'Session': 'Sesja',
      'BREAK': 'PRZERWA',
      'Play/Stop': 'Start/Stop',
      'Reset': 'Przywróć domyślne',
      'Undo': 'Resetuj czas',
      'Sound On/Off': 'Dźwięk wł/wył',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n
