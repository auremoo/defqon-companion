import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { CalendarIcon, PaletteIcon, ChecklistIcon, CloudSunIcon, WalletIcon, ChevronRightIcon } from '../components/Icons'

const secondaryFeatures = [
  { to: '/colors',    Icon: PaletteIcon,   titleKey: 'nav.colors',      descKey: 'festival.colorsDesc',    color: '#e040a0' },
  { to: '/checklist', Icon: ChecklistIcon, titleKey: 'checklist.title', descKey: 'festival.checklistDesc', color: '#16a34a' },
  { to: '/weather',   Icon: CloudSunIcon,  titleKey: 'weather.title',   descKey: 'festival.weatherDesc',   color: '#1d86c7' },
  { to: '/budget',    Icon: WalletIcon,    titleKey: 'budget.title',    descKey: 'festival.budgetDesc',    color: '#d97706' },
]

export default function Festival() {
  const { t } = useTranslation()

  useEffect(() => { document.title = 'Festival — Defqon Companion' }, [])

  return (
    <PageShell title={t('festival.hubTitle')} subtitle={t('festival.hubSubtitle')}>
      <div className="mx-auto w-full max-w-md space-y-3 pb-4">

        {/* Timetable — primary card */}
        <Link
          to="/timetable"
          className="group flex items-center gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 transition-all hover:bg-accent/15"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
            <CalendarIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-text-primary">{t('nav.timetable')}</p>
            <p className="text-xs text-text-muted">{t('festival.timetableDesc')}</p>
          </div>
          <ChevronRightIcon size={18} className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Secondary features grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {secondaryFeatures.map(({ to, Icon, titleKey, descKey, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-border-hover hover:bg-surface-alt"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: color + '26', color }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{t(titleKey)}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-text-muted">{t(descKey)}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
