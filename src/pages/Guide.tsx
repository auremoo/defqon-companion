import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { HistoryIcon, MusicIcon, BookIcon, ChecklistIcon, ChevronRightIcon } from '../components/Icons'
import { stageColors } from '../data/lineup'

type Stage = keyof typeof stageColors

const extraColors: Record<string, string> = {
  ORANGE: '#f97316',
  GREEN: '#22c55e',
  PURPLE: '#a855f7',
  DNBSTAGE: '#ec4899',
}

function stageColor(name: string): string {
  return stageColors[name as Stage] ?? extraColors[name] ?? '#888'
}

function LogoCard() {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent">{t('guide.history.logoTitle')}</p>
      <p className="text-sm leading-relaxed text-text-secondary">{t('guide.history.logoDefcon')}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t('guide.history.logoQ')}</p>
    </div>
  )
}

function HistoryContent() {
  const { t } = useTranslation()
  const cards = [
    { title: t('guide.history.originTitle'), body: t('guide.history.originText') },
    { title: t('guide.history.whyOneTitle'), body: t('guide.history.whyOneText') },
    { title: t('guide.history.colorsTitle'), body: t('guide.history.colorsText') },
    { title: t('guide.history.brandTitle'), body: t('guide.history.brandText') },
  ]
  return (
    <div className="space-y-3">
      <LogoCard />
      {cards.map(({ title, body }) => (
        <div key={title} className="rounded-xl bg-surface-alt p-4">
          <p className="mb-1.5 text-xs font-bold text-text-primary">{title}</p>
          <p className="text-xs leading-relaxed text-text-muted">{body}</p>
        </div>
      ))}
    </div>
  )
}

const SUBGENRES = ['euphoric', 'raw', 'extraRaw', 'hardcore', 'frenchcore', 'uptempo', 'terror', 'industrial', 'classic', 'earlyRave', 'hardTrance', 'hardTechno', 'dnb', 'happyHardcore'] as const

function HardstyleContent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-surface-alt p-4">
        <p className="text-sm leading-relaxed text-text-secondary">{t('guide.hardstyle.text')}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">150–160 BPM</span>
          <span className="text-xs text-text-muted">base range</span>
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('guide.hardstyle.subgenres')}</p>

      <div className="space-y-2">
        {SUBGENRES.map((sg) => {
          const raw = t(`guide.hardstyle.${sg}`)
          const [termPart, ...rest] = raw.split(' — ')
          const description = rest.join(' — ')
          const stageMatch = termPart.match(/\(([A-Z]+)\)/)
          const stageName = stageMatch?.[1] ?? ''
          const color = stageName ? stageColor(stageName) : '#888'
          const termClean = termPart.replace(/\s*\([A-Z]+\)/, '').trim()

          return (
            <div key={sg} className="flex gap-3 rounded-xl bg-surface-alt p-3">
              <div className="mt-1 h-4 w-1 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-text-primary">{termClean}</span>
                  {stageName && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white"
                      style={{ backgroundColor: color + 'cc' }}
                    >
                      {stageName}
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-text-muted">{description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TERMS = ['kick', 'reverseBass', 'breakdown', 'climax', 'screeches', 'antiClimactic', 'bpm', 'gabber', 'shuffle', 'anthem', 'endshow', 'powerHour', 'set', 'qdance', 'hardBass'] as const

function VocabularyContent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-1.5">
      {TERMS.map((term) => {
        const raw = t(`guide.vocabulary.${term}`)
        const [termName, ...rest] = raw.split(' — ')
        const definition = rest.join(' — ')
        return (
          <div key={term} className="rounded-xl bg-surface-alt px-4 py-3">
            <p className="text-xs font-bold text-accent">{termName}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">{definition}</p>
          </div>
        )
      })}
    </div>
  )
}

const PRACTICAL = [
  { key: 'gettingThere', emoji: '🚌' },
  { key: 'camping',      emoji: '⛺' },
  { key: 'whatToBring',  emoji: '🎒' },
  { key: 'rules',        emoji: '📋' },
  { key: 'tips',         emoji: '💡' },
  { key: 'weather',      emoji: '🌤️' },
] as const

function PracticalContent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      {PRACTICAL.map(({ key, emoji }) => (
        <div key={key} className="flex gap-3 rounded-xl bg-surface-alt p-4">
          <span className="mt-0.5 shrink-0 text-xl leading-none">{emoji}</span>
          <div>
            <p className="text-xs font-bold text-text-primary">{t(`guide.practical.${key}Title`)}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{t(`guide.practical.${key}Text`)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

type SectionKey = 'history' | 'hardstyle' | 'vocabulary' | 'practical'

const SECTIONS: { key: SectionKey; labelKey: string; Icon: React.FC<{ size?: number; className?: string }>; color: string; Content: React.FC }[] = [
  { key: 'history',    labelKey: 'guide.history.title',    Icon: HistoryIcon,   color: '#e040a0', Content: HistoryContent },
  { key: 'hardstyle',  labelKey: 'guide.hardstyle.title',  Icon: MusicIcon,     color: '#ef4444', Content: HardstyleContent },
  { key: 'vocabulary', labelKey: 'guide.vocabulary.title', Icon: BookIcon,      color: '#4a90d9', Content: VocabularyContent },
  { key: 'practical',  labelKey: 'guide.practical.title',  Icon: ChecklistIcon, color: '#16a34a', Content: PracticalContent },
]

export default function Guide() {
  const { t } = useTranslation()
  const [openSection, setOpenSection] = useState<SectionKey | null>(null)

  useEffect(() => { document.title = 'Discover Hardstyle — Defqon Companion' }, [])

  return (
    <PageShell title={t('guide.title')} subtitle={t('guide.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-2 pb-4">
        {SECTIONS.map(({ key, labelKey, Icon, color, Content }) => {
          const isOpen = openSection === key
          return (
            <div key={key} className="overflow-hidden rounded-xl border border-border bg-surface-card">
              <button
                onClick={() => setOpenSection(isOpen ? null : key)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-alt"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: color + '26', color }}
                >
                  <Icon size={20} />
                </div>
                <span className={`flex-1 text-sm font-bold ${isOpen ? 'text-accent' : 'text-text-primary'}`}>
                  {t(labelKey)}
                </span>
                <ChevronRightIcon
                  size={16}
                  className={`shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="px-4 pb-4">
                    <Content />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
