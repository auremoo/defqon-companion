import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { SettingsIcon, PaletteIcon, BookIcon, ChecklistIcon } from '../components/Icons'
import { festival } from '../data/festival'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-6">
      <header className="mb-8 text-center">
        <div className="mb-2 flex justify-end">
          <Link
            to="/settings"
            className="rounded-lg p-2 text-text-muted transition-colors hover:text-text-primary"
          >
            <SettingsIcon size={20} />
          </Link>
        </div>
        {/* Logo */}
        <div className="mx-auto mb-4 w-20">
          <img src={import.meta.env.BASE_URL + 'icon-512.png'} alt="Defqon.1" className="w-full rounded-2xl" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-text-primary">
          {t('home.title')}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t('home.subtitle')}</p>
      </header>

      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Festival info */}
        <div className="rounded-2xl border border-border bg-surface-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {festival.name} {festival.year}
          </p>
          <p className="mt-1 text-lg font-semibold italic text-text-primary">
            &ldquo;{t('home.theme')}&rdquo;
          </p>
          <p className="mt-2 text-sm text-text-secondary">{t('home.dates')}</p>
          <p className="text-sm text-text-muted">{t('home.location')}</p>
        </div>

        {/* Countdown */}
        <CountdownTimer />

        {/* Quick links */}
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-muted">
            {t('home.quickLinks')}
          </h2>
          <div className="grid gap-3">
            <Link
              to="/colors"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-hover hover:bg-surface-alt"
            >
              <PaletteIcon size={22} className="text-accent" />
              <span className="font-medium text-text-primary">{t('home.exploreColors')}</span>
            </Link>
            <Link
              to="/guide"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-hover hover:bg-surface-alt"
            >
              <BookIcon size={22} className="text-accent" />
              <span className="font-medium text-text-primary">{t('home.readGuide')}</span>
            </Link>
            <Link
              to="/checklist"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-hover hover:bg-surface-alt"
            >
              <ChecklistIcon size={22} className="text-accent" />
              <span className="font-medium text-text-primary">{t('home.prepChecklist')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
