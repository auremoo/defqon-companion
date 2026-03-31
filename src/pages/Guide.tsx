import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../components/LanguageToggle'

type Tab = 'history' | 'hardstyle' | 'vocabulary'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5">
      <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  )
}

function HistoryTab() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Section title={t('guide.history.originTitle')}>
        <p className="text-sm leading-relaxed text-gray-300">
          {t('guide.history.originText')}
        </p>
      </Section>
      <Section title={t('guide.history.whyOneTitle')}>
        <p className="text-sm leading-relaxed text-gray-300">
          {t('guide.history.whyOneText')}
        </p>
      </Section>
      <Section title={t('guide.history.colorsTitle')}>
        <p className="text-sm leading-relaxed text-gray-300">
          {t('guide.history.colorsText')}
        </p>
      </Section>
      <Section title={t('guide.history.brandTitle')}>
        <p className="text-sm leading-relaxed text-gray-300">
          {t('guide.history.brandText')}
        </p>
      </Section>
    </div>
  )
}

function HardstyleTab() {
  const { t } = useTranslation()
  const subgenres = ['euphoric', 'raw', 'hardcore', 'frenchcore', 'classic'] as const
  return (
    <div className="space-y-4">
      <Section title={t('guide.hardstyle.title')}>
        <p className="text-sm leading-relaxed text-gray-300">
          {t('guide.hardstyle.text')}
        </p>
      </Section>
      <Section title={t('guide.hardstyle.subgenres')}>
        <ul className="space-y-3">
          {subgenres.map((sg) => (
            <li key={sg} className="rounded-lg bg-gray-800/40 p-3 text-sm text-gray-300">
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
  const terms = ['kick', 'reverseBass', 'breakdown', 'climax', 'screeches', 'qdance'] as const
  return (
    <div className="space-y-4">
      <Section title={t('guide.vocabulary.title')}>
        <ul className="space-y-3">
          {terms.map((term) => (
            <li key={term} className="rounded-lg bg-gray-800/40 p-3 text-sm text-gray-300">
              {t(`guide.vocabulary.${term}`)}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

const tabs: { key: Tab; icon: string; labelKey: string }[] = [
  { key: 'history', icon: '\ud83c\udfdb\ufe0f', labelKey: 'guide.history.title' },
  { key: 'hardstyle', icon: '\ud83c\udfb6', labelKey: 'guide.hardstyle.title' },
  { key: 'vocabulary', icon: '\ud83d\udcda', labelKey: 'guide.vocabulary.title' },
]

export default function Guide() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('history')

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-8">
      <header className="mb-6">
        <div className="mb-2 flex justify-end">
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('guide.title')}</h1>
        <p className="mt-1 text-sm text-gray-400">{t('guide.subtitle')}</p>
      </header>

      {/* Tab bar */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-defqon-red text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-md">
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'hardstyle' && <HardstyleTab />}
        {activeTab === 'vocabulary' && <VocabularyTab />}
      </div>
    </div>
  )
}
