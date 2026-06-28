import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { GridIcon, RefreshIcon, TrophyIcon, ShareIcon } from '../components/Icons'
import { bingoItems } from '../data/bingo'
import { festival } from '../data/festival'

const GRID_SIZE = 5
const FREE_INDEX = 12
const STORAGE_KEY = `defqon-bingo-${festival.year}`

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateCard(): string[] {
  const pool = shuffle(bingoItems).slice(0, GRID_SIZE * GRID_SIZE - 1)
  const card = [...pool]
  card.splice(FREE_INDEX, 0, 'FREE')
  return card
}

function checkBingo(checked: boolean[]): boolean {
  const rows = GRID_SIZE
  const cols = GRID_SIZE
  for (let r = 0; r < rows; r++) {
    if (Array.from({ length: cols }, (_, c) => checked[r * cols + c]).every(Boolean)) return true
  }
  for (let c = 0; c < cols; c++) {
    if (Array.from({ length: rows }, (_, r) => checked[r * cols + c]).every(Boolean)) return true
  }
  if (Array.from({ length: rows }, (_, i) => checked[i * cols + i]).every(Boolean)) return true
  if (Array.from({ length: rows }, (_, i) => checked[i * cols + (cols - 1 - i)]).every(Boolean)) return true
  return false
}

function loadSaved(): { card: string[]; checked: boolean[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function Bingo() {
  const { t } = useTranslation()
  const [card, setCard] = useState<string[]>([])
  const [checked, setChecked] = useState<boolean[]>([])
  const [hasBingo, setHasBingo] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    document.title = 'Festival Bingo — Defqon Companion'
    const saved = loadSaved()
    if (saved) {
      setCard(saved.card)
      setChecked(saved.checked)
      setHasBingo(checkBingo(saved.checked))
    } else {
      const newCard = generateCard()
      const newChecked = Array(GRID_SIZE * GRID_SIZE).fill(false)
      newChecked[FREE_INDEX] = true
      setCard(newCard)
      setChecked(newChecked)
    }
  }, [])

  const save = useCallback((c: string[], ch: boolean[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ card: c, checked: ch }))
    } catch {}
  }, [])

  const toggle = (i: number) => {
    if (i === FREE_INDEX) return
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      setHasBingo(checkBingo(next))
      save(card, next)
      return next
    })
  }

  const newCard = () => {
    const c = generateCard()
    const ch = Array(GRID_SIZE * GRID_SIZE).fill(false)
    ch[FREE_INDEX] = true
    setCard(c)
    setChecked(ch)
    setHasBingo(false)
    setShowConfirm(false)
    save(c, ch)
  }

  const checkedCount = checked.filter(Boolean).length
  const totalCount = GRID_SIZE * GRID_SIZE - 1

  const shareCard = async () => {
    const text = hasBingo
      ? t('bingo.shareTextBingo', { year: festival.year, checked: checkedCount, total: totalCount })
      : t('bingo.shareTextProgress', { year: festival.year, checked: checkedCount, total: totalCount })
    if (navigator.share) {
      await navigator.share({ title: `Defqon.1 Festival Bingo`, text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  if (card.length === 0) return null

  return (
    <PageShell title={t('bingo.title')} subtitle={t('bingo.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-4 pb-4">
        {/* Stats bar */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3">
          <div>
            <p className="text-xs text-text-muted">{t('bingo.progress')}</p>
            <p className="text-sm font-bold text-text-primary">{checkedCount} / {totalCount}</p>
          </div>
          {hasBingo && (
            <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1.5">
              <TrophyIcon size={16} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">BINGO!</span>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={shareCard}
              className="flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1.5 text-xs font-medium text-text-secondary"
            >
              <ShareIcon size={13} />
              {t('bingo.share')}
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1.5 text-xs font-medium text-text-secondary"
            >
              <RefreshIcon size={13} />
              {t('bingo.newCard')}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Confirm new card modal */}
        {showConfirm && (
          <div className="rounded-xl border border-border bg-surface-card p-4 text-center">
            <GridIcon size={24} className="mx-auto mb-2 text-text-muted" />
            <p className="text-sm font-semibold text-text-primary">{t('bingo.newCardConfirm')}</p>
            <p className="mt-1 text-xs text-text-muted">{t('bingo.newCardWarning')}</p>
            <div className="mt-3 flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg bg-surface-alt px-4 py-2 text-xs font-medium text-text-secondary"
              >
                {t('bingo.cancel')}
              </button>
              <button
                onClick={newCard}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white"
              >
                {t('bingo.newCard')}
              </button>
            </div>
          </div>
        )}

        {/* Bingo grid */}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {card.map((item, i) => {
            const isFree = i === FREE_INDEX
            const isChecked = checked[i]
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                disabled={isFree}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border p-1 text-center transition-all ${
                  isFree
                    ? 'border-accent bg-accent/20 cursor-default'
                    : isChecked
                    ? 'border-accent/60 bg-accent/15 scale-95'
                    : 'border-border bg-surface-card hover:border-border-hover hover:bg-surface-alt active:scale-95'
                }`}
              >
                {isFree ? (
                  <span className="text-lg">⭐</span>
                ) : (
                  <>
                    {isChecked && (
                      <span className="mb-0.5 text-sm leading-none text-accent">✓</span>
                    )}
                    <span className={`leading-tight text-[11px] ${isChecked ? 'font-semibold text-accent' : 'text-text-secondary'}`}>
                      {item}
                    </span>
                  </>
                )}
              </button>
            )
          })}
        </div>

        {/* Tip */}
        <p className="text-center text-[11px] text-text-muted">{t('bingo.tip')}</p>
      </div>
    </PageShell>
  )
}
