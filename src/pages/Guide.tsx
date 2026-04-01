import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5">
      <h3 className="defqon-heading mb-3 text-lg font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  )
}

function HistoryContent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Section title={t('guide.history.originTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.history.originText')}
        </p>
      </Section>
      <Section title={t('guide.history.whyOneTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.history.whyOneText')}
        </p>
      </Section>
      <Section title={t('guide.history.colorsTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.history.colorsText')}
        </p>
      </Section>
      <Section title={t('guide.history.brandTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.history.brandText')}
        </p>
      </Section>
    </div>
  )
}

function HardstyleContent() {
  const { t } = useTranslation()
  const subgenres = ['euphoric', 'raw', 'extraRaw', 'hardcore', 'frenchcore', 'uptempo', 'terror', 'industrial', 'classic', 'earlyRave', 'hardTrance', 'hardTechno', 'dnb', 'happyHardcore'] as const
  return (
    <div className="space-y-4">
      <Section title={t('guide.hardstyle.title')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.hardstyle.text')}
        </p>
      </Section>
      <Section title={t('guide.hardstyle.subgenres')}>
        <ul className="space-y-3">
          {subgenres.map((sg) => (
            <li key={sg} className="rounded-lg bg-surface-alt p-3 text-sm text-text-secondary">
              {t(`guide.hardstyle.${sg}`)}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function VocabularyContent() {
  const { t } = useTranslation()
  const terms = ['kick', 'reverseBass', 'breakdown', 'climax', 'screeches', 'antiClimactic', 'bpm', 'gabber', 'shuffle', 'anthem', 'endshow', 'powerHour', 'set', 'qdance', 'hardBass'] as const
  return (
    <div className="space-y-4">
      <Section title={t('guide.vocabulary.title')}>
        <ul className="space-y-3">
          {terms.map((term) => (
            <li key={term} className="rounded-lg bg-surface-alt p-3 text-sm text-text-secondary">
              {t(`guide.vocabulary.${term}`)}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function PracticalContent() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Section title={t('guide.practical.gettingThereTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.gettingThereText')}
        </p>
      </Section>
      <Section title={t('guide.practical.campingTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.campingText')}
        </p>
      </Section>
      <Section title={t('guide.practical.whatToBringTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.whatToBringText')}
        </p>
      </Section>
      <Section title={t('guide.practical.rulesTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.rulesText')}
        </p>
      </Section>
      <Section title={t('guide.practical.tipsTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.tipsText')}
        </p>
      </Section>
      <Section title={t('guide.practical.weatherTitle')}>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t('guide.practical.weatherText')}
        </p>
      </Section>
    </div>
  )
}

type SectionKey = 'history' | 'hardstyle' | 'vocabulary' | 'practical'

const sections: { key: SectionKey; labelKey: string; Content: React.FC }[] = [
  { key: 'history', labelKey: 'guide.history.title', Content: HistoryContent },
  { key: 'hardstyle', labelKey: 'guide.hardstyle.title', Content: HardstyleContent },
  { key: 'vocabulary', labelKey: 'guide.vocabulary.title', Content: VocabularyContent },
  { key: 'practical', labelKey: 'guide.practical.title', Content: PracticalContent },
]

export default function Guide() {
  const { t } = useTranslation()
  const [openSection, setOpenSection] = useState<SectionKey | null>(null)

  useEffect(() => { document.title = 'Discover Hardstyle — Defqon Companion' }, [])

  const toggleSection = (key: SectionKey) => {
    setOpenSection((prev) => (prev === key ? null : key))
  }

  return (
    <PageShell title={t('guide.title')} subtitle={t('guide.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-3">
        {sections.map(({ key, labelKey, Content }) => {
          const isOpen = openSection === key
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border bg-surface-card"
            >
              <button
                onClick={() => toggleSection(key)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
              >
                <span
                  className={`defqon-heading text-lg font-semibold uppercase tracking-wider ${
                    isOpen ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  {t(labelKey)}
                </span>
                <span
                  className={`text-lg transition-transform duration-200 ${
                    isOpen ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  {isOpen ? '▾' : '▸'}
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5">
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
