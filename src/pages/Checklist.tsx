import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultChecklist, type ChecklistItem } from '../data/festival'
import PageShell from '../components/PageShell'

function getStoredChecklist(): ChecklistItem[] {
  try {
    const stored = localStorage.getItem('defqon-checklist')
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return defaultChecklist.map((item) => ({ ...item }))
}

export default function Checklist() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ChecklistItem[]>(getStoredChecklist)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    localStorage.setItem('defqon-checklist', JSON.stringify(items))
  }, [items])

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const addItem = () => {
    const text = newItem.trim()
    if (!text) return
    const id = `custom-${Date.now()}`
    setItems((prev) => [...prev, { id, category: 'comfort', labelKey: '', label: text, checked: false, custom: true }])
    setNewItem('')
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const resetAll = () => {
    setItems(defaultChecklist.map((item) => ({ ...item })))
  }

  const checkedCount = items.filter((i) => i.checked).length
  const categories = ['essentials', 'camping', 'comfort'] as const

  const progressSection = (
    <>
      <span className="mt-3 block text-xs text-text-muted">{t('checklist.progress', { checked: checkedCount, total: items.length })}</span>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-alt">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }}
        />
      </div>
    </>
  )

  return (
    <PageShell title={t('checklist.title')} subtitle={t('checklist.subtitle')} headerContent={progressSection}>
      <div className="mx-auto w-full max-w-md space-y-6">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat)
          if (catItems.length === 0) return null
          return (
            <div key={cat}>
              <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                {t(`checklist.${cat}`)}
              </h2>
              <div className="space-y-1.5">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3"
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs transition-colors ${
                        item.checked
                          ? 'border-accent bg-accent text-text-primary'
                          : 'border-gray-600 text-transparent hover:border-gray-400'
                      }`}
                    >
                      {'\u2713'}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        item.checked ? 'text-gray-500 line-through' : 'text-gray-200'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.custom && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-600 hover:text-red-400"
                      >
                        {'\u2715'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Add custom item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={t('checklist.addItem')}
            className="flex-1 rounded-xl border border-border bg-surface-card px-4 py-2.5 text-sm text-text-primary placeholder-gray-500 outline-none focus:border-accent/50"
          />
          <button
            onClick={addItem}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-accent/80"
          >
            {t('checklist.add')}
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={resetAll}
          className="w-full rounded-xl border border-border py-2.5 text-xs text-gray-500 transition-colors hover:border-red-900 hover:text-red-400"
        >
          {t('checklist.reset')}
        </button>
      </div>
    </PageShell>
  )
}
