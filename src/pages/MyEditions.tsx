import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore'
import PageShell from '../components/PageShell'
import { editionMetas, loadEdition, type Edition } from '../data/editions'
import { stageColors, days, type Set } from '../data/lineup'

interface EditionHistory {
  edition_year: number
  attended_festival: boolean
  notes: string | null
  rating: number | null
}

interface SavedSet {
  set_id: string
  attended: boolean
}

type ActiveTab = 'sets' | 'lineup'

export default function MyEditions() {
  const { t } = useTranslation()
  const { user, configured } = useAuth()
  const [editionHistories, setEditionHistories] = useState<EditionHistory[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null)
  const [savedSets, setSavedSets] = useState<SavedSet[]>([])
  const [activeTab, setActiveTab] = useState<ActiveTab>('lineup')
  const [notes, setNotes] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { document.title = 'My Editions — Defqon Companion' }, [])

  useEffect(() => {
    if (!db || !user) return
    getDocs(query(collection(db, 'user_editions'), where('user_id', '==', user.uid))).then((snaps) => {
      setEditionHistories(snaps.docs.map((d) => d.data() as EditionHistory))
    })
  }, [user])

  const loadEditionData = async (year: number) => {
    setSelectedYear(year)
    const ed = await loadEdition(year)
    setSelectedEdition(ed)

    let sets: SavedSet[] = []
    if (!db || !user) {
      try {
        const local = JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]')
        sets = local.map((id: string) => ({ set_id: id, attended: false }))
      } catch { sets = [] }
    } else {
      const snaps = await getDocs(query(
        collection(db, 'timetable_entries'),
        where('user_id', '==', user.uid),
        where('edition_year', '==', year)
      ))
      sets = snaps.docs.map((d) => ({ set_id: d.data().set_id as string, attended: d.data().attended as boolean ?? false }))
    }

    setSavedSets(sets)
    setActiveTab(sets.length > 0 ? 'sets' : 'lineup')

    const history = editionHistories.find((h) => h.edition_year === year)
    setNotes(history?.notes || '')
    setRating(history?.rating || null)
  }

  const saveEditionNotes = async () => {
    if (!db || !user || !selectedYear) return
    setSaving(true)
    await setDoc(doc(db, 'user_editions', `${user.uid}_${selectedYear}`), {
      user_id: user.uid,
      edition_year: selectedYear,
      attended_festival: true,
      notes: notes || null,
      rating,
    })
    const snaps = await getDocs(query(collection(db, 'user_editions'), where('user_id', '==', user.uid)))
    setEditionHistories(snaps.docs.map((d) => d.data() as EditionHistory))
    setSaving(false)
  }

  const savedSetsData: Set[] = selectedEdition
    ? selectedEdition.lineup
        .filter((s) => savedSets.some((ss) => ss.set_id === s.id))
        .sort((a, b) => {
          const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
          return dayOrder || a.startTime.localeCompare(b.startTime)
        })
    : []

  const lineupByDay = selectedEdition
    ? days
        .map((d) => ({
          day: d,
          sets: selectedEdition.lineup
            .filter((s) => s.day === d.key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime)),
        }))
        .filter((g) => g.sets.length > 0)
    : []

  return (
    <PageShell title={t('myEditions.title')} subtitle={t('myEditions.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-4">
        {editionMetas.map((ed) => {
          const history = editionHistories.find((h) => h.edition_year === ed.year)
          const isSelected = selectedYear === ed.year
          const localSetCount = (() => {
            try { return JSON.parse(localStorage.getItem(`defqon-timetable-${ed.year}`) || '[]').length }
            catch { return 0 }
          })()

          return (
            <div key={ed.year}>
              <button
                onClick={() => isSelected ? setSelectedYear(null) : loadEditionData(ed.year)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border bg-surface-card hover:border-border-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="defqon-heading text-lg text-text-primary">{ed.year}</h3>
                    <p className="text-sm italic text-text-secondary">&ldquo;{ed.theme}&rdquo;</p>
                  </div>
                  <div className="text-right">
                    {history?.rating && (
                      <p className="text-sm text-defqon-gold">{'★'.repeat(history.rating)}{'☆'.repeat(5 - history.rating)}</p>
                    )}
                    <p className="text-xs text-text-muted">
                      {localSetCount > 0 ? `${localSetCount} sets` : ed.isCurrent ? t('myEditions.current') : ''}
                    </p>
                  </div>
                </div>
              </button>

              {isSelected && selectedEdition && (
                <div className="mt-2 rounded-xl border border-border bg-surface-card">
                  {/* Tab switcher */}
                  <div className="flex border-b border-border">
                    <button
                      onClick={() => setActiveTab('lineup')}
                      className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        activeTab === 'lineup' ? 'text-accent border-b-2 border-accent -mb-px' : 'text-text-muted'
                      }`}
                    >
                      {t('myEditions.tabLineup')}
                    </button>
                    <button
                      onClick={() => setActiveTab('sets')}
                      className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        activeTab === 'sets' ? 'text-accent border-b-2 border-accent -mb-px' : 'text-text-muted'
                      }`}
                    >
                      {t('myEditions.tabMySets')}
                      {savedSetsData.length > 0 && (
                        <span className="ml-1 opacity-60">({savedSetsData.length})</span>
                      )}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Full lineup tab */}
                    {activeTab === 'lineup' && (
                      <div className="space-y-4">
                        {lineupByDay.map(({ day, sets }) => (
                          <div key={day.key}>
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                              {t(`timetable.days.${day.key}`)}
                            </p>
                            <div className="space-y-0.5 max-h-64 overflow-y-auto">
                              {sets.map((set) => (
                                <div key={set.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                                  <div
                                    className="h-5 w-1 shrink-0 rounded-full"
                                    style={{ backgroundColor: stageColors[set.stage] }}
                                  />
                                  <span className="w-11 shrink-0 text-[10px] tabular-nums text-text-muted">{set.startTime}</span>
                                  <span className="min-w-0 flex-1 truncate text-xs text-text-primary">{set.artist}</span>
                                  <span
                                    className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white"
                                    style={{ backgroundColor: stageColors[set.stage] + 'cc' }}
                                  >
                                    {set.stage}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        {lineupByDay.length === 0 && (
                          <p className="text-sm text-text-muted">{t('myEditions.noLineup')}</p>
                        )}
                      </div>
                    )}

                    {/* My sets tab */}
                    {activeTab === 'sets' && (
                      <div>
                        {savedSetsData.length > 0 ? (
                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {savedSetsData.map((set) => (
                              <div key={set.id} className="flex items-center gap-2 rounded-lg bg-surface-alt p-2">
                                <div className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-xs text-text-primary">{set.artist}</p>
                                  <p className="text-[10px] text-text-muted">{set.stage} · {t(`timetable.days.${set.day}`)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-text-muted">{t('myEditions.noSets')}</p>
                        )}
                      </div>
                    )}

                    {/* Notes & rating (logged in only) */}
                    {configured && user && (
                      <div className="space-y-3 border-t border-border pt-3">
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">{t('myEditions.rating')}</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(rating === star ? null : star)}
                                className={`text-2xl transition-colors ${star <= (rating || 0) ? 'text-defqon-gold' : 'text-text-muted'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">{t('myEditions.notes')}</p>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('myEditions.notesPlaceholder')}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50 resize-none"
                          />
                        </div>
                        <button
                          onClick={saveEditionNotes}
                          disabled={saving}
                          className="w-full rounded-lg bg-accent py-2 text-xs font-semibold uppercase tracking-wider text-text-primary disabled:opacity-50"
                        >
                          {saving ? '...' : t('myEditions.save')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
