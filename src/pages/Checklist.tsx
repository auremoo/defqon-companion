import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { defaultChecklist, type ChecklistItem } from '../data/festival'
import PageShell from '../components/PageShell'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'

interface FirestoreChecklist {
  checkedIds: string[]
  customItems: ChecklistItem[]
}

// Always rebuild from current defaultChecklist so that new default items
// always appear, regardless of what was cached in localStorage or Firestore.
function buildFromCache(checkedIds: string[], customItems: ChecklistItem[]): ChecklistItem[] {
  const base = defaultChecklist.map((item) => ({
    ...item,
    checked: checkedIds.includes(item.id),
  }))
  const migratedCustoms = customItems
    .filter((i) => i.custom)
    .map((item) => ({
      ...item,
      category: (item.category === 'comfort' ? 'autre' : item.category) as ChecklistItem['category'],
      checked: checkedIds.includes(item.id),
    }))
  return [...base, ...migratedCustoms]
}

function getStoredChecklist(): ChecklistItem[] {
  try {
    const stored = localStorage.getItem('defqon-checklist')
    if (stored) {
      const storedItems: ChecklistItem[] = JSON.parse(stored)
      const checkedIds = storedItems.filter((i) => i.checked).map((i) => i.id)
      const customItems = storedItems.filter((i) => i.custom)
      return buildFromCache(checkedIds, customItems)
    }
  } catch { /* ignore */ }
  return defaultChecklist.map((item) => ({ ...item }))
}

export default function Checklist() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState<ChecklistItem[]>(getStoredChecklist)
  const [newItem, setNewItem] = useState('')
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => { document.title = 'Festival Checklist — Defqon Companion' }, [])

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('defqon-checklist', JSON.stringify(items))
  }, [items])

  // Sync FROM Firestore when user logs in
  useEffect(() => {
    if (!db || !user) return
    getDoc(doc(db, 'user_checklist', user.uid))
      .then((snap) => {
        if (!snap.exists()) return
        const data = snap.data() as FirestoreChecklist
        setItems(buildFromCache(data.checkedIds ?? [], data.customItems ?? []))
      })
      .catch(() => { /* keep localStorage state */ })
  }, [user])

  // Debounced sync TO Firestore on every items change
  useEffect(() => {
    if (!db || !user) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    setSyncStatus('saving')
    syncTimer.current = setTimeout(async () => {
      const checkedIds = items.filter((i) => i.checked).map((i) => i.id)
      const customItems = items.filter((i) => i.custom)
      try {
        await setDoc(doc(db!, 'user_checklist', user.uid), { checkedIds, customItems })
        setSyncStatus('saved')
        setTimeout(() => setSyncStatus('idle'), 2000)
      } catch (e) {
        console.error('[Checklist] Firestore sync failed:', e)
        setSyncStatus('error')
      }
    }, 1000)
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [items, user])

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const addItem = () => {
    const text = newItem.trim()
    if (!text) return
    const id = `custom-${Date.now()}`
    setItems((prev) => [...prev, { id, category: 'autre', labelKey: '', label: text, checked: false, custom: true }])
    setNewItem('')
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const resetAll = () => {
    setItems(defaultChecklist.map((item) => ({ ...item })))
  }

  const checkedCount = items.filter((i) => i.checked).length
  const categories = ['bracelet', 'essentials', 'camping', 'vetements', 'hygiene', 'comfort', 'autre'] as const

  const syncLabel = user
    ? syncStatus === 'saving' ? '⏳ Sync…'
    : syncStatus === 'saved'  ? '✓ Synchronisé'
    : syncStatus === 'error'  ? '⚠ Erreur sync'
    : null
    : null

  const progressSection = (
    <>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted">{t('checklist.progress', { checked: checkedCount, total: items.length })}</span>
        {syncLabel && (
          <span className={`text-[10px] ${syncStatus === 'error' ? 'text-red-400' : 'text-text-muted'}`}>
            {syncLabel}
          </span>
        )}
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
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
                      {'✓'}
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
                        {'✕'}
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
