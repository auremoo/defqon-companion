import i18n, { type LanguageDetectorModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'

// Same key the i18next-browser-languagedetector package used, so a language
// chosen before it was dropped is still honoured.
const STORAGE_KEY = 'i18nextLng'

// Saved choice first, then the browser's preferred languages.
const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect() {
    const candidates: string[] = []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) candidates.push(stored)
    } catch { /* storage unavailable (private mode) */ }
    candidates.push(...(navigator.languages ?? []), navigator.language)
    return candidates.filter(Boolean)
  },
  cacheUserLanguage(lng) {
    try { localStorage.setItem(STORAGE_KEY, lng) } catch { /* ignore */ }
  },
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
