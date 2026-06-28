import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface PathData {
  rank: number
  rankTitle: string
  xp: number
  xpNextRank: number
  badges: { orange: number; gold: number; silver: number; bronze: number }
}

const MILESTONES = [
  { xp: 4000,  label: 'Warrior',  rank: 2 },
  { xp: 9999,  label: null,       rank: 3 },
]

const BADGE_COLORS = {
  orange: '#f97316',
  gold:   '#f59e0b',
  silver: '#9ca3af',
  bronze: '#c47c4a',
}

const DEFAULT_FORM: PathData = {
  rank: 1,
  rankTitle: '',
  xp: 0,
  xpNextRank: 9999,
  badges: { orange: 0, gold: 0, silver: 0, bronze: 0 },
}

function fmtXP(n: number) {
  return n.toLocaleString('fr-FR').replace(/ /g, ' ')
}

export default function ThePathWidget() {
  const { t } = useTranslation()
  const { user, configured } = useAuth()
  const [pathData, setPathData] = useState<PathData | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<PathData>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)

  useEffect(() => {
    if (!db || !user) return
    getDoc(doc(db, 'user_paths', user.uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data() as PathData
        setPathData(d)
        setForm(d)
      }
    })
  }, [user])

  if (!user || !configured) return null

  const openEdit = () => {
    setForm(pathData ?? DEFAULT_FORM)
    setEditing(true)
  }

  const cancel = () => setEditing(false)

  const save = async () => {
    if (!db || !user) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'user_paths', user.uid), form)
      setPathData({ ...form })
      setEditing(false)
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 2500)
    } catch {}
    setSaving(false)
  }

  const pct = pathData && pathData.xpNextRank > 0
    ? Math.min(100, (pathData.xp / pathData.xpNextRank) * 100)
    : 0

  return (
    <div className="overflow-hidden rounded-xl border border-red-900/40 bg-surface-card">
      {/* Gradient header */}
      <div className="bg-gradient-to-br from-red-950/70 via-red-900/20 to-black/40 px-4 pb-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              {t('path.label')}
            </p>
            {pathData ? (
              <p className="mt-0.5 text-base font-black uppercase tracking-wide text-text-primary">
                Rank {pathData.rank}
                {pathData.rankTitle ? ` · ${pathData.rankTitle}` : ''}
              </p>
            ) : (
              <p className="mt-0.5 text-sm text-text-muted">{t('path.empty')}</p>
            )}
          </div>
          {!editing && (
            <button
              onClick={openEdit}
              className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-primary"
            >
              {pathData ? t('path.update') : t('path.setup')}
            </button>
          )}
        </div>

        {/* Stats — display mode */}
        {pathData && !editing && (
          <>
            <div className="mt-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-black text-text-primary">{fmtXP(pathData.xp)} XP</span>
                <span className="text-[10px] text-text-muted">{fmtXP(pathData.xpNextRank)} XP</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/50">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-0.5 text-right text-[9px] text-text-muted">
                {Math.round(pct)}% {t('path.toNextRank')}
              </p>
              {(() => {
                const next = MILESTONES.find((m) => pathData.xp < m.xp)
                if (!next) return null
                const remaining = next.xp - pathData.xp
                return (
                  <p className="mt-1 text-[9px] text-text-muted">
                    {t('path.nextMilestone')}{' '}
                    <span className="font-semibold text-red-400">
                      {next.label
                        ? `Rank ${next.rank} · ${next.label}`
                        : `Rank ${next.rank} · ${t('path.rank3Choice')}`}
                    </span>
                    {' '}— {fmtXP(remaining)} XP
                  </p>
                )
              })()}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {(['orange', 'gold', 'silver', 'bronze'] as const).map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-black"
                    style={{ backgroundColor: BADGE_COLORS[color] + '30', color: BADGE_COLORS[color] }}
                  >
                    ◆
                  </div>
                  <span className="text-sm font-bold text-text-primary">{pathData.badges[color]}</span>
                  <span className="text-[9px] capitalize text-text-muted">{t(`path.badge.${color}`)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t('path.rank')}
              </label>
              <input
                type="number" min={1}
                value={form.rank}
                onChange={(e) => setForm((f) => ({ ...f, rank: Math.max(1, Number(e.target.value)) }))}
                className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t('path.rankTitle')}
              </label>
              <input
                type="text"
                value={form.rankTitle}
                onChange={(e) => setForm((f) => ({ ...f, rankTitle: e.target.value }))}
                placeholder="Warrior"
                className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t('path.totalXP')}
              </label>
              <input
                type="number" min={0}
                value={form.xp}
                onChange={(e) => setForm((f) => ({ ...f, xp: Math.max(0, Number(e.target.value)) }))}
                className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {t('path.nextRankXP')}
              </label>
              <input
                type="number" min={1}
                value={form.xpNextRank}
                onChange={(e) => setForm((f) => ({ ...f, xpNextRank: Math.max(1, Number(e.target.value)) }))}
                className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary outline-none focus:border-accent/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {t('path.badges')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['orange', 'gold', 'silver', 'bronze'] as const).map((color) => (
                <div key={color} className="flex flex-col items-center gap-1.5">
                  <span className="text-base font-black" style={{ color: BADGE_COLORS[color] }}>◆</span>
                  <input
                    type="number" min={0}
                    value={form.badges[color]}
                    onChange={(e) => setForm((f) => ({
                      ...f,
                      badges: { ...f.badges, [color]: Math.max(0, Number(e.target.value)) },
                    }))}
                    className="w-full rounded-lg border border-border bg-surface-alt px-1 py-1.5 text-center text-xs text-text-primary outline-none focus:border-accent/50"
                  />
                  <span className="text-[9px] capitalize text-text-muted">{t(`path.badge.${color}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={cancel}
              className="flex-1 rounded-lg bg-surface-alt py-2 text-xs font-semibold text-text-muted"
            >
              {t('path.cancel')}
            </button>
            <button
              onClick={save}
              disabled={saving}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                saveOk ? 'bg-green-600 text-white' : 'bg-accent text-text-primary'
              }`}
            >
              {saving ? '…' : saveOk ? `✓ ${t('path.saved')}` : t('path.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
