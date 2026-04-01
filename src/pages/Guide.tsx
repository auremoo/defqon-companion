import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'

type Tab = 'history' | 'hardstyle' | 'vocabulary' | 'practical'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5">
      <h3 className="defqon-heading mb-3 text-lg font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  )
}

function HistoryTab() {
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

function HardstyleTab() {
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

function VocabularyTab() {
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

function PracticalTab() {
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

const tabs: { key: Tab; labelKey: string }[] = [
  { key: 'history', labelKey: 'guide.history.title' },
  { key: 'hardstyle', labelKey: 'guide.hardstyle.title' },
  { key: 'vocabulary', labelKey: 'guide.vocabulary.title' },
  { key: 'practical', labelKey: 'guide.practical.title' },
]

export default function Guide() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('history')

  useEffect(() => { document.title = 'Discover Hardstyle — Defqon Companion' }, [])

  const tabBar = (
    <div className="mt-4 flex gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
            activeTab === tab.key
              ? 'bg-accent text-text-primary'
              : 'bg-surface-alt text-text-muted hover:bg-surface-card hover:text-text-primary'
          }`}
        >
          <span>{t(tab.labelKey)}</span>
        </button>
      ))}
    </div>
  )

  return (
    <PageShell title={t('guide.title')} subtitle={t('guide.subtitle')} headerContent={tabBar}>
      <div className="mx-auto w-full max-w-md">
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'hardstyle' && <HardstyleTab />}
        {activeTab === 'vocabulary' && <VocabularyTab />}
        {activeTab === 'practical' && <PracticalTab />}
      </div>
    </PageShell>
  )
}
