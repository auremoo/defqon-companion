import { useState, useEffect, useCallback } from 'react'
import PageShell from '../components/PageShell'
import { WalletIcon, PlusIcon, XIcon } from '../components/Icons'

interface BudgetCategory {
  id: string
  label: string
  emoji: string
  planned: number
  spent: number
  color: string
}

const defaultCategories: BudgetCategory[] = [
  { id: 'ticket', label: 'Tickets & Entry', emoji: '🎟️', planned: 0, spent: 0, color: '#e63946' },
  { id: 'travel', label: 'Travel & Transport', emoji: '🚌', planned: 0, spent: 0, color: '#4a00e0' },
  { id: 'camping', label: 'Camping Gear', emoji: '⛺', planned: 0, spent: 0, color: '#16a34a' },
  { id: 'food', label: 'Food & Drinks', emoji: '🍔', planned: 0, spent: 0, color: '#f4a261' },
  { id: 'merch', label: 'Merchandise', emoji: '👕', planned: 0, spent: 0, color: '#e040a0' },
  { id: 'other', label: 'Other', emoji: '💼', planned: 0, spent: 0, color: '#a8a8a8' },
]

function loadBudget(): BudgetCategory[] {
  try {
    const raw = localStorage.getItem('defqon-budget-2026')
    if (!raw) return defaultCategories
    const saved: BudgetCategory[] = JSON.parse(raw)
    // Merge with defaults so new categories appear
    return defaultCategories.map((def) => {
      const found = saved.find((s) => s.id === def.id)
      return found ? { ...def, planned: found.planned, spent: found.spent } : def
    })
  } catch {
    return defaultCategories
  }
}

function saveBudget(cats: BudgetCategory[]) {
  localStorage.setItem('defqon-budget-2026', JSON.stringify(cats))
}

export default function Budget() {
  const [categories, setCategories] = useState<BudgetCategory[]>(loadBudget)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ planned: '', spent: '' })

  useEffect(() => { document.title = 'Budget — Defqon Companion' }, [])

  const totalPlanned = categories.reduce((s, c) => s + c.planned, 0)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const remaining = totalPlanned - totalSpent

  const startEdit = (cat: BudgetCategory) => {
    setEditing(cat.id)
    setEditValues({
      planned: cat.planned > 0 ? String(cat.planned) : '',
      spent: cat.spent > 0 ? String(cat.spent) : '',
    })
  }

  const saveEdit = useCallback(() => {
    if (!editing) return
    setCategories((prev) => {
      const next = prev.map((c) =>
        c.id === editing
          ? {
              ...c,
              planned: parseFloat(editValues.planned) || 0,
              spent: parseFloat(editValues.spent) || 0,
            }
          : c
      )
      saveBudget(next)
      return next
    })
    setEditing(null)
  }, [editing, editValues])

  const reset = () => {
    const fresh = defaultCategories.map((c) => ({ ...c, planned: 0, spent: 0 }))
    setCategories(fresh)
    saveBudget(fresh)
    setEditing(null)
  }

  const tips = [
    'Festival water refill stations are free — bring a reusable bottle.',
    'Pre-buy drinks tokens online to skip queues and save ~10%.',
    'Official merch sells out fast — buy early on Friday.',
    'Camping supermarket runs are cheaper than festival food.',
    'Rideshare from major cities cuts travel cost significantly.',
  ]

  return (
    <PageShell
      title="Festival Budget"
      subtitle="Track your Defqon.1 2026 spending"
    >
      <div className="mx-auto w-full max-w-md space-y-4 pb-4">

        {/* Summary card */}
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-text-muted">Planned</p>
              <p className="text-lg font-bold text-text-primary">€{totalPlanned.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Spent</p>
              <p className={`text-lg font-bold ${totalSpent > totalPlanned && totalPlanned > 0 ? 'text-red-400' : 'text-text-primary'}`}>
                €{totalSpent.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Remaining</p>
              <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {remaining < 0 ? '-' : ''}€{Math.abs(remaining).toFixed(0)}
              </p>
            </div>
          </div>

          {totalPlanned > 0 && (
            <div className="mt-3">
              <div className="h-2 overflow-hidden rounded-full bg-surface-alt">
                <div
                  className={`h-full rounded-full transition-all ${totalSpent > totalPlanned ? 'bg-red-500' : 'bg-accent'}`}
                  style={{ width: `${Math.min(100, (totalSpent / totalPlanned) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[11px] text-text-muted">
                {Math.round((totalSpent / totalPlanned) * 100)}% of budget used
              </p>
            </div>
          )}
        </div>

        {/* Category rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="defqon-heading text-xs tracking-widest text-text-muted">Categories</h2>
            <button
              onClick={reset}
              className="text-[11px] text-text-muted underline underline-offset-2"
            >
              Reset all
            </button>
          </div>

          {categories.map((cat) => {
            const pct = cat.planned > 0 ? Math.min(100, (cat.spent / cat.planned) * 100) : 0
            const over = cat.spent > cat.planned && cat.planned > 0

            return (
              <div
                key={cat.id}
                className="overflow-hidden rounded-xl border border-border bg-surface-card"
                style={{ borderLeft: `3px solid ${cat.color}` }}
              >
                {editing === cat.id ? (
                  <div className="p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-base">{cat.emoji}</span>
                      <span className="text-sm font-semibold text-text-primary">{cat.label}</span>
                      <button onClick={() => setEditing(null)} className="ml-auto text-text-muted">
                        <XIcon size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-text-muted">Planned (€)</label>
                        <input
                          type="number"
                          min="0"
                          value={editValues.planned}
                          onChange={(e) => setEditValues((v) => ({ ...v, planned: e.target.value }))}
                          placeholder="0"
                          className="mt-1 w-full rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-sm text-text-primary outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-text-muted">Spent (€)</label>
                        <input
                          type="number"
                          min="0"
                          value={editValues.spent}
                          onChange={(e) => setEditValues((v) => ({ ...v, spent: e.target.value }))}
                          placeholder="0"
                          className="mt-1 w-full rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-sm text-text-primary outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={saveEdit}
                      className="mt-2 w-full rounded-lg bg-accent py-2 text-xs font-bold text-white"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex w-full items-center gap-3 p-3 text-left"
                    onClick={() => startEdit(cat)}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{cat.label}</p>
                        <p className={`text-sm font-semibold ${over ? 'text-red-400' : 'text-text-primary'}`}>
                          {cat.planned > 0
                            ? `€${cat.spent} / €${cat.planned}`
                            : cat.spent > 0
                            ? `€${cat.spent} spent`
                            : 'Tap to set'}
                        </p>
                      </div>
                      {cat.planned > 0 && (
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-alt">
                          <div
                            className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-accent/70'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <PlusIcon size={16} className="shrink-0 text-text-muted" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Tips */}
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <WalletIcon size={16} className="text-accent" />
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Money-saving tips</p>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 shrink-0 text-accent">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  )
}
