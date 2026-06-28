import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SparklesIcon, BrainIcon, GridIcon, HistoryIcon, BookIcon } from '../components/Icons'
import PageShell from '../components/PageShell'

const features = [
  { to: '/discover',    Icon: SparklesIcon, titleKey: 'discover.title',    subtitleKey: 'discover.subtitle',    color: '#e040a0' },
  { to: '/guide',       Icon: BookIcon,     titleKey: 'guide.title',       subtitleKey: 'guide.subtitle',       color: '#4a90d9' },
  { to: '/quiz',        Icon: BrainIcon,    titleKey: 'quiz.title',        subtitleKey: 'quiz.subtitle',        color: '#7c3aed' },
  { to: '/bingo',       Icon: GridIcon,     titleKey: 'bingo.title',       subtitleKey: 'bingo.subtitle',       color: '#d4a20a' },
  { to: '/my-editions', Icon: HistoryIcon,  titleKey: 'myEditions.title',  subtitleKey: 'myEditions.subtitle',  color: '#6b7280' },
]

export default function More() {
  const { t } = useTranslation()

  useEffect(() => { document.title = t('more.title') + ' — Defqon Companion' }, [t])

  return (
    <PageShell title={t('more.title')} subtitle={t('more.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-2">
        {features.map(({ to, Icon, titleKey, subtitleKey, color }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-border-hover hover:bg-surface-alt"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: color + '26', color }}
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary">{t(titleKey)}</p>
              <p className="text-xs text-text-muted">{t(subtitleKey)}</p>
            </div>
            <span className="text-text-muted">›</span>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
