import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import LanguageToggle from '../components/LanguageToggle'
import { festival } from '../data/festival'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-8">
      <header className="mb-8 text-center">
        <div className="mb-2 flex justify-end">
          <LanguageToggle />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('home.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-400">{t('home.subtitle')}</p>
      </header>

      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Festival info */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-defqon-red">
            {festival.name} {festival.year}
          </p>
          <p className="mt-1 text-lg font-semibold italic text-white">
            &ldquo;{t('home.theme')}&rdquo;
          </p>
          <p className="mt-2 text-sm text-gray-400">{t('home.dates')}</p>
          <p className="text-sm text-gray-500">{t('home.location')}</p>
        </div>

        {/* Countdown */}
        <CountdownTimer />

        {/* Quick links */}
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
            {t('home.quickLinks')}
          </h2>
          <div className="grid gap-3">
            <Link
              to="/colors"
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-defqon-red/50 hover:bg-gray-800/50"
            >
              <span className="text-2xl">{'\ud83c\udfa8'}</span>
              <span className="font-medium">{t('home.exploreColors')}</span>
            </Link>
            <Link
              to="/guide"
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-defqon-red/50 hover:bg-gray-800/50"
            >
              <span className="text-2xl">{'\ud83d\udcd6'}</span>
              <span className="font-medium">{t('home.readGuide')}</span>
            </Link>
            <Link
              to="/checklist"
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-defqon-red/50 hover:bg-gray-800/50"
            >
              <span className="text-2xl">{'\u2705'}</span>
              <span className="font-medium">{t('home.prepChecklist')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
