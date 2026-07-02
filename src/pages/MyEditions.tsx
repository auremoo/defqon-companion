import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore'
import PageShell from '../components/PageShell'
import { editionMetas, loadEdition, type Edition } from '../data/editions'
import { stageColors, days, type Set } from '../data/lineup'
import { XIcon } from '../components/Icons'

interface EditionHistory {
  edition_year: number
  attended_festival: boolean
  notes: string | null
  rating: number | null
  bracelet_uid?: string | null
}

interface SavedSet {
  set_id: string
}

type ActiveTab = 'sets' | 'lineup'
type NfcState = 'idle' | 'scanning'

function isAttendedLocally(year: number): boolean {
  return localStorage.getItem(`defqon-going-${year}`) === 'true'
}

const LS_HISTORIES = 'defqon-edition-histories'

function loadHistoriesFromCache(): EditionHistory[] {
  try { return JSON.parse(localStorage.getItem(LS_HISTORIES) || '[]') } catch { return [] }
}

function saveHistoriesToCache(h: EditionHistory[]) {
  try { localStorage.setItem(LS_HISTORIES, JSON.stringify(h)) } catch {}
}

const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window

export default function MyEditions() {
  const { t } = useTranslation()
  const { user, configured } = useAuth()
  const [editionHistories, setEditionHistories] = useState<EditionHistory[]>(loadHistoriesFromCache)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null)
  const [savedSets, setSavedSets] = useState<SavedSet[]>([])
  const [activeTab, setActiveTab] = useState<ActiveTab>('lineup')
  const [attended, setAttended] = useState(false)
  const [notes, setNotes] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [braceletUid, setBraceletUid] = useState<string | null>(null)
  const [braceletInput, setBraceletInput] = useState('')
  const [nfcState, setNfcState] = useState<NfcState>('idle')
  const nfcAbortRef = useRef<AbortController | null>(null)

  useEffect(() => { document.title = 'My Editions — Defqon Companion' }, [])
  useEffect(() => () => { nfcAbortRef.current?.abort() }, [])

  useEffect(() => {
    if (!db || !user) return
    getDocs(query(collection(db, 'user_editions'), where('user_id', '==', user.uid))).then((snaps) => {
      const data = snaps.docs.map((d) => d.data() as EditionHistory)
      setEditionHistories(data)
      saveHistoriesToCache(data)
    })
  }, [user])

  const loadEditionData = async (year: number) => {
    nfcAbortRef.current?.abort()
    setNfcState('idle')
    setSelectedYear(year)
    setShowClearConfirm(false)
    setSaveStatus('idle')
    setBraceletInput('')
    const ed = await loadEdition(year)
    setSelectedEdition(ed)

    let sets: SavedSet[] = []
    if (!db || !user) {
      try {
        const local = JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]')
        sets = local.map((id: string) => ({ set_id: id }))
      } catch { sets = [] }
    } else {
      const snaps = await getDocs(query(
        collection(db, 'timetable_entries'),
        where('user_id', '==', user.uid),
        where('edition_year', '==', year)
      ))
      sets = snaps.docs.map((d) => ({ set_id: d.data().set_id as string }))
    }
    setSavedSets(sets)
    setActiveTab(sets.length > 0 ? 'sets' : 'lineup')

    const history = editionHistories.find((h) => h.edition_year === year)
    const att = history?.attended_festival === true || isAttendedLocally(year)
    setAttended(att)
    setNotes(history?.notes || '')
    setRating(history?.rating || null)
    setBraceletUid(history?.bracelet_uid || null)
  }

  const updateHistories = (updater: (prev: EditionHistory[]) => EditionHistory[]) => {
    setEditionHistories((prev) => {
      const next = updater(prev)
      saveHistoriesToCache(next)
      return next
    })
  }

  const removeSet = async (setId: string) => {
    if (!selectedYear) return
    setSavedSets((prev) => prev.filter((s) => s.set_id !== setId))
    try {
      const key = `defqon-timetable-${selectedYear}`
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as string[]
      localStorage.setItem(key, JSON.stringify(existing.filter((id) => id !== setId)))
    } catch {}
    if (db && user) {
      try { await deleteDoc(doc(db, 'timetable_entries', `${user.uid}_${selectedYear}_${setId}`)) } catch {}
    }
  }

  const clearAllSets = async () => {
    if (!selectedYear) return
    setSavedSets([])
    setShowClearConfirm(false)
    try { localStorage.removeItem(`defqon-timetable-${selectedYear}`) } catch {}
    if (db && user) {
      try {
        const snaps = await getDocs(query(
          collection(db, 'timetable_entries'),
          where('user_id', '==', user.uid),
          where('edition_year', '==', selectedYear)
        ))
        await Promise.all(snaps.docs.map((d) => deleteDoc(d.ref)))
      } catch {}
    }
  }

  const clearAttendance = async () => {
    if (!selectedYear) return
    localStorage.removeItem(`defqon-going-${selectedYear}`)
    setAttended(false)
    updateHistories((prev) =>
      prev.map((h) => h.edition_year === selectedYear ? { ...h, attended_festival: false } : h)
    )
    if (db && user) {
      try {
        await setDoc(doc(db, 'user_editions', `${user.uid}_${selectedYear}`), { attended_festival: false }, { merge: true })
      } catch {}
    }
  }

  const saveEditionNotes = async () => {
    if (!db || !user || !selectedYear) return
    setSaveStatus('saving')
    try {
      await setDoc(doc(db, 'user_editions', `${user.uid}_${selectedYear}`), {
        user_id: user.uid,
        edition_year: selectedYear,
        attended_festival: true,
        notes: notes || null,
        rating,
        bracelet_uid: braceletUid ?? null,
      }, { merge: true })
      localStorage.setItem(`defqon-going-${selectedYear}`, 'true')
      setAttended(true)
      updateHistories((prev) => {
        const exists = prev.find((h) => h.edition_year === selectedYear!)
        if (exists) return prev.map((h) => h.edition_year === selectedYear! ? { ...h, notes: notes || null, rating, attended_festival: true, bracelet_uid: braceletUid } : h)
        return [...prev, { edition_year: selectedYear!, attended_festival: true, notes: notes || null, rating, bracelet_uid: braceletUid }]
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const linkBracelet = async (uid: string) => {
    setBraceletUid(uid)
    setBraceletInput('')
    setNfcState('idle')
    updateHistories((prev) => {
      const exists = prev.find((h) => h.edition_year === selectedYear!)
      if (exists) return prev.map((h) => h.edition_year === selectedYear! ? { ...h, bracelet_uid: uid } : h)
      return [...prev, { edition_year: selectedYear!, attended_festival: false, notes: null, rating: null, bracelet_uid: uid }]
    })
    if (db && user && selectedYear) {
      try {
        await setDoc(doc(db, 'user_editions', `${user.uid}_${selectedYear}`), {
          user_id: user.uid,
          edition_year: selectedYear,
          bracelet_uid: uid,
        }, { merge: true })
      } catch {}
    }
  }

  const unlinkBracelet = async () => {
    setBraceletUid(null)
    updateHistories((prev) =>
      prev.map((h) => h.edition_year === selectedYear! ? { ...h, bracelet_uid: null } : h)
    )
    if (db && user && selectedYear) {
      try {
        await setDoc(doc(db, 'user_editions', `${user.uid}_${selectedYear}`), { bracelet_uid: null }, { merge: true })
      } catch {}
    }
  }

  const scanBracelet = async () => {
    setNfcState('scanning')
    nfcAbortRef.current?.abort()
    nfcAbortRef.current = new AbortController()
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reader = new (window as any).NDEFReader()
      await reader.scan({ signal: nfcAbortRef.current.signal })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onreading = (event: any) => {
        nfcAbortRef.current?.abort()
        const uid = String(event.serialNumber).toUpperCase().replace(/:/g, '')
        linkBracelet(uid)
      }
      reader.onerror = () => setNfcState('idle')
    } catch {
      setNfcState('idle')
    }
  }

  const cancelScan = () => {
    nfcAbortRef.current?.abort()
    setNfcState('idle')
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
          sets: selectedEdition.lineup.filter((s) => s.day === d.key).sort((a, b) => a.startTime.localeCompare(b.startTime)),
        }))
        .filter((g) => g.sets.length > 0)
    : []

  return (
    <PageShell title={t('myEditions.title')} subtitle={t('myEditions.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-4">
        {editionMetas.map((ed) => {
          const history = editionHistories.find((h) => h.edition_year === ed.year)
          const wasAttended = history?.attended_festival === true || isAttendedLocally(ed.year)
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
                  <div className="text-right space-y-1">
                    {wasAttended && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-400">{t('myEditions.attended')}</p>
                    )}
                    {history?.bracelet_uid && (
                      <p className="text-[10px] text-text-muted">⬡ {t('myEditions.braceletLinked')}</p>
                    )}
                    {history?.rating && (
                      <p className="text-xs text-defqon-gold">{'★'.repeat(history.rating)}{'☆'.repeat(5 - history.rating)}</p>
                    )}
                    {localSetCount > 0 && (
                      <p className="text-xs text-text-muted">{localSetCount} sets</p>
                    )}
                    {!wasAttended && !localSetCount && ed.isCurrent && (
                      <p className="text-xs text-text-muted">{t('myEditions.current')}</p>
                    )}
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
                      {savedSetsData.length > 0 && <span className="ml-1 opacity-60">({savedSetsData.length})</span>}
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
                            <div className="space-y-0.5 max-h-60 overflow-y-auto">
                              {sets.map((set) => (
                                <div key={set.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                                  <div className="h-5 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                                  <span className="w-11 shrink-0 text-[10px] tabular-nums text-text-muted">{set.startTime}</span>
                                  <span className="min-w-0 flex-1 truncate text-xs text-text-primary">{set.artist}</span>
                                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: stageColors[set.stage] + 'cc' }}>
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
                      <div className="space-y-2">
                        {savedSetsData.length > 0 ? (
                          <>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {savedSetsData.map((set) => (
                                <div key={set.id} className="flex items-center gap-2 rounded-lg bg-surface-alt p-2">
                                  <div className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="truncate text-xs text-text-primary">{set.artist}</p>
                                    <p className="text-[10px] text-text-muted">{set.stage} · {t(`timetable.days.${set.day}`)}</p>
                                  </div>
                                  <button
                                    onClick={() => removeSet(set.id)}
                                    className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                                  >
                                    <XIcon size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            {showClearConfirm ? (
                              <div className="rounded-lg border border-red-800/40 bg-red-900/10 p-3 text-center space-y-2">
                                <p className="text-xs text-text-secondary">{t('myEditions.clearConfirm', { count: savedSetsData.length })}</p>
                                <div className="flex gap-2">
                                  <button onClick={() => setShowClearConfirm(false)} className="flex-1 rounded-lg bg-surface-alt py-1.5 text-xs text-text-muted">
                                    {t('myEditions.cancel')}
                                  </button>
                                  <button onClick={clearAllSets} className="flex-1 rounded-lg bg-red-500/20 py-1.5 text-xs font-semibold text-red-400">
                                    {t('myEditions.confirmClear')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowClearConfirm(true)}
                                className="w-full text-center text-[11px] text-text-muted underline-offset-2 hover:text-red-400 hover:underline"
                              >
                                {t('myEditions.clearAllSets')}
                              </button>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-text-muted">{t('myEditions.noSets')}</p>
                        )}
                      </div>
                    )}

                    {/* Attendance status */}
                    {attended && (
                      <div className="flex items-center justify-between rounded-lg border border-green-800/30 bg-green-900/10 px-3 py-2">
                        <p className="text-xs text-green-400">{t('myEditions.markedAttended')}</p>
                        <button
                          onClick={clearAttendance}
                          className="text-[11px] text-text-muted underline-offset-2 hover:text-red-400 hover:underline"
                        >
                          {t('myEditions.markNotAttended')}
                        </button>
                      </div>
                    )}

                    {/* Notes, rating & bracelet (logged in only) */}
                    {configured && user && (
                      <div className="space-y-3 border-t border-border pt-3">

                        {/* Bracelet NFC */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                            {t('myEditions.braceletTitle')}
                          </p>
                          {braceletUid ? (
                            <div className="flex items-center justify-between rounded-lg border border-green-800/30 bg-green-900/10 px-3 py-2">
                              <div>
                                <p className="text-xs font-semibold text-green-400">⬡ {t('myEditions.braceletLinked')}</p>
                                <p className="mt-0.5 font-mono text-[10px] text-text-muted">{braceletUid}</p>
                              </div>
                              <button
                                onClick={unlinkBracelet}
                                className="text-[11px] text-text-muted underline-offset-2 hover:text-red-400 hover:underline"
                              >
                                {t('myEditions.braceletUnlink')}
                              </button>
                            </div>
                          ) : nfcState === 'scanning' ? (
                            <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-3 text-center space-y-2">
                              <p className="animate-pulse text-xs text-accent">{t('myEditions.braceletScanning')}</p>
                              <button onClick={cancelScan} className="text-[11px] text-text-muted hover:text-red-400 hover:underline underline-offset-2">
                                {t('myEditions.cancel')}
                              </button>
                            </div>
                          ) : nfcSupported ? (
                            <div className="space-y-1.5">
                              <button
                                onClick={scanBracelet}
                                className="w-full rounded-lg border border-border bg-surface-alt py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
                              >
                                {t('myEditions.braceletScan')}
                              </button>
                              <p className="text-center text-[10px] text-text-muted">{t('myEditions.braceletNfcNote')}</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-[11px] text-text-muted">{t('myEditions.braceletIosNote')}</p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={braceletInput}
                                  onChange={(e) => setBraceletInput(e.target.value.toUpperCase())}
                                  placeholder={t('myEditions.braceletManualPlaceholder')}
                                  maxLength={24}
                                  className="flex-1 rounded-lg border border-border bg-surface-alt px-3 py-2 font-mono text-xs text-text-primary placeholder-text-muted outline-none focus:border-accent/50"
                                />
                                <button
                                  onClick={() => braceletInput.trim() && linkBracelet(braceletInput.trim())}
                                  disabled={!braceletInput.trim()}
                                  className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-text-primary disabled:opacity-40"
                                >
                                  {t('myEditions.braceletSave')}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Rating */}
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

                        {/* Notes */}
                        <div>
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">{t('myEditions.notes')}</p>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('myEditions.notesPlaceholder')}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50"
                          />
                        </div>

                        {saveStatus === 'error' && (
                          <p className="rounded-lg border border-red-800/40 bg-red-900/15 px-3 py-2 text-xs text-red-400">
                            {t('myEditions.saveError')}
                          </p>
                        )}
                        <button
                          onClick={saveEditionNotes}
                          disabled={saveStatus === 'saving'}
                          className={`w-full rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                            saveStatus === 'success'
                              ? 'bg-green-600 text-white'
                              : 'bg-accent text-text-primary'
                          }`}
                        >
                          {saveStatus === 'saving' ? '…' : saveStatus === 'success' ? '✓ ' + t('myEditions.saved') : t('myEditions.save')}
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
