import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { PaletteIcon, BookIcon, ChecklistIcon, CalendarIcon, HistoryIcon } from '../components/Icons'
import PageShell from '../components/PageShell'
import { festival } from '../data/festival'

export default function Home() {
  const { t } = useTranslation()

  useEffect(() => { document.title = 'Defqon Companion — Your Festival Guide' }, [])

  const headerContent = (
    <>
      {/* Logo */}
      <div className="mt-2 text-center">
        <div className="mx-auto mb-4 w-16">
          <img src={import.meta.env.BASE_URL + 'icon-512.png'} alt="Defqon.1" className="w-full rounded-xl" />
        </div>
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

      {/* Countdown */}
      <div className="mt-6">
        <CountdownTimer />
      </div>
    </>
  )

  return (
    <PageShell title={t('home.title')} subtitle={t('home.subtitle')} headerContent={headerContent}>
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Playlist */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('home.playlist')}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
            <iframe
              src="https://open.spotify.com/embed/playlist/5tkWlvbjzTTCMKVrcaEHpQ?utm_source=generator&theme=0"
              width="100%"
              height="152"
              style={{ border: 'none' }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        </div>

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
              { to: '/my-editions', Icon: HistoryIcon, label: t('home.myEditions') },
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
    </PageShell>
  )
}
