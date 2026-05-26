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

export default function MyEditions() {
  const { t } = useTranslation()
  const { user, configured } = useAuth()
  const [editionHistories, setEditionHistories] = useState<EditionHistory[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null)
  const [savedSets, setSavedSets] = useState<SavedSet[]>([])
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

  const loadEditionSets = async (year: number) => {
    setSelectedYear(year)
    const ed = await loadEdition(year)
    setSelectedEdition(ed)

    if (!db || !user) {
      try {
        const local = JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]')
        setSavedSets(local.map((id: string) => ({ set_id: id, attended: false })))
      } catch { setSavedSets([]) }
      return
    }

    const snaps = await getDocs(query(
      collection(db, 'timetable_entries'),
      where('user_id', '==', user.uid),
      where('edition_year', '==', year)
    ))
    setSavedSets(snaps.docs.map((d) => ({ set_id: d.data().set_id as string, attended: d.data().attended as boolean ?? false })))

    const history = editionHistories.find((h) => h.edition_year === year)
    setNotes(history?.notes || '')
    setRating(history?.rating || null)
  }

  const saveEditionNotes = async () => {
    if (!db || !user || !selectedYear) return
    setSaving(true)
    const docId = `${user.uid}_${selectedYear}`
    await setDoc(doc(db, 'user_editions', docId), {
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

  const selectedSetsData: Set[] = selectedEdition
    ? selectedEdition.lineup
        .filter((s) => savedSets.some((ss) => ss.set_id === s.id))
        .sort((a, b) => {
          const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
          return dayOrder || a.startTime.localeCompare(b.startTime)
        })
    : []

  return (
    <PageShell title={t('myEditions.title')} subtitle={t('myEditions.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-4">
        {editionMetas.map((ed) => {
          const history = editionHistories.find((h) => h.edition_year === ed.year)
          const isSelected = selectedYear === ed.year
          const localSets = (() => {
            try { return JSON.parse(localStorage.getItem(`defqon-timetable-${ed.year}`) || '[]').length }
            catch { return 0 }
          })()

          return (
            <div key={ed.year}>
              <button
                onClick={() => isSelected ? setSelectedYear(null) : loadEditionSets(ed.year)}
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
                      {localSets > 0 ? `${localSets} sets` : ed.isCurrent ? t('myEditions.current') : ''}
                    </p>
                  </div>
                </div>
              </button>

              {isSelected && (
                <div className="mt-2 space-y-3 rounded-xl border border-border bg-surface-card p-4">
                  {selectedSetsData.length > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                        {selectedSetsData.length} {t('myEditions.setsSaved')}
                      </p>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {selectedSetsData.map((set) => (
                          <div key={set.id} className="flex items-center gap-2 rounded-lg bg-surface-alt p-2">
                            <div className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs text-text-primary">{set.artist}</p>
                              <p className="text-[10px] text-text-muted">{set.stage} &middot; {t(`timetable.days.${set.day}`)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">{t('myEditions.noSets')}</p>
                  )}

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
              )}
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
