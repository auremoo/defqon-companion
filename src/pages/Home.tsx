import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { SettingsIcon, PaletteIcon, BookIcon, ChecklistIcon, CalendarIcon } from '../components/Icons'
import { festival } from '../data/festival'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Hero section */}
      <div className="noise-bg relative overflow-hidden bg-gradient-to-b from-accent/10 via-surface to-surface px-4 pb-8 pt-6">
        <div className="relative z-10">
          <div className="flex justify-end">
            <Link to="/settings" className="rounded-lg p-2 text-text-muted transition-colors hover:text-text-primary">
              <SettingsIcon size={20} />
            </Link>
          </div>

          {/* Logo + Title */}
          <div className="mt-2 text-center">
            <div className="mx-auto mb-4 w-16">
              <img src={import.meta.env.BASE_URL + 'icon-512.png'} alt="Defqon.1" className="w-full rounded-xl" />
            </div>
            <h1 className="defqon-heading text-3xl sm:text-4xl text-text-primary">
              {t('home.title')}
            </h1>
            <p className="mt-2 text-sm text-text-secondary">{t('home.subtitle')}</p>
          </div>

          {/* Festival info card */}
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-surface-card/80 p-5 text-center backdrop-blur-sm">
            <p className="defqon-heading text-xs tracking-widest text-accent">
              {festival.name} {festival.year}
            </p>
            <p className="mt-2 text-xl font-bold italic text-text-primary">
              &ldquo;{t('home.theme')}&rdquo;
            </p>
            <div className="mx-auto mt-3 accent-line" />
            <p className="mt-3 text-sm text-text-secondary">{t('home.dates')}</p>
            <p className="text-xs text-text-muted">{t('home.location')}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-md space-y-6 px-4 pt-6">
        {/* Countdown */}
        <CountdownTimer />

        {/* Quick links */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('home.quickLinks')}
          </h2>
          <div className="grid gap-2.5">
            {[
              { to: '/colors', Icon: PaletteIcon, label: t('home.exploreColors') },
              { to: '/timetable', Icon: CalendarIcon, label: 'Timetable' },
              { to: '/guide', Icon: BookIcon, label: t('home.readGuide') },
              { to: '/checklist', Icon: ChecklistIcon, label: t('home.prepChecklist') },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-border-hover hover:bg-surface-alt"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <link.Icon size={18} />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide text-text-primary">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
