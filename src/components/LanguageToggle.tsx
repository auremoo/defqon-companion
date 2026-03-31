import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const toggle = () => {
    const next = i18n.language.startsWith('fr') ? 'en' : 'fr'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
    >
      {t('switchLang')}
    </button>
  )
}
