import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import {
  collection, doc, getDocs, setDoc, deleteDoc, query, where,
  onSnapshot, getDoc,
} from 'firebase/firestore'
import { UsersIcon, FlameIcon, SnowflakeIcon } from '../components/Icons'
import PageShell from '../components/PageShell'
import LiveMode from '../components/LiveMode'
import GridTimetable from '../components/GridTimetable'
import { days, stageColors, type Day, type Stage, type Set } from '../data/lineup'
import { editionMetas, getCurrentEdition, loadEdition, type Edition } from '../data/editions'

type VoteType = 'fire' | 'cold'

function getLocalVotes(year: number): Record<string, VoteType> {
  try { return JSON.parse(localStorage.getItem(`defqon-votes-${year}`) || '{}') } catch { return {} }
}

function saveLocalVotes(year: number, votes: Record<string, VoteType>) {
  localStorage.setItem(`defqon-votes-${year}`, JSON.stringify(votes))
}

function getLocalSavedSets(year: number): string[] {
  try { return JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]') } catch { return [] }
}

// ─── Friends panel ───
function FriendsPanel({ onClose, editionYear, onViewSchedule }: {
  onClose: () => void
  editionYear: number
  onViewSchedule: (friendId: string, friendName: string) => void
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [friends, setFriends] = useState<{ id: string; friendUserId: string; username: string; display_name: string | null; status: string; isRequester: boolean }[]>([])
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([])
  const [buddyIds, setBuddyIds] = useState<string[]>([])

  const loadFriends = useCallback(async () => {
    if (!db || !user) return

    const [asRequester, asAddressee] = await Promise.all([
      getDocs(query(collection(db, 'friendships'), where('requester_id', '==', user.uid))),
      getDocs(query(collection(db, 'friendships'), where('addressee_id', '==', user.uid))),
    ])

    const all = [...asRequester.docs, ...asAddressee.docs]
    const enriched = await Promise.all(all.map(async (snap) => {
      const data = snap.data()
      const isRequester = data.requester_id === user.uid
      const friendUid = isRequester ? data.addressee_id : data.requester_id
      const profileSnap = await getDoc(doc(db!, 'users', friendUid))
      const profile = profileSnap.data() as { username: string; display_name: string | null } | undefined
      return {
        id: snap.id,
        friendUserId: friendUid,
        username: profile?.username ?? friendUid,
        display_name: profile?.display_name ?? null,
        status: data.status as string,
        isRequester,
      }
    }))
    setFriends(enriched)

    // Load edition buddies
    const buddySnaps = await getDocs(
      query(collection(db, 'edition_buddies'),
        where('user_id', '==', user.uid),
        where('edition_year', '==', editionYear))
    )
    setBuddyIds(buddySnaps.docs.map((d) => d.data().friend_id as string))
  }, [user, editionYear])

  useEffect(() => { loadFriends() }, [loadFriends])

  const toggleBuddy = async (friendUserId: string) => {
    if (!db || !user) return
    const docId = `${user.uid}_${friendUserId}_${editionYear}`
    const isBuddy = buddyIds.includes(friendUserId)
    if (isBuddy) {
      await deleteDoc(doc(db, 'edition_buddies', docId))
      setBuddyIds((prev) => prev.filter((id) => id !== friendUserId))
    } else {
      await setDoc(doc(db, 'edition_buddies', docId), { user_id: user.uid, friend_id: friendUserId, edition_year: editionYear })
      setBuddyIds((prev) => [...prev, friendUserId])
    }
  }

  const searchUsers = async () => {
    if (!db || !searchQuery.trim()) return
    // Firestore ne supporte pas ILIKE — on charge par username exact (insensible à la casse côté client)
    const snaps = await getDocs(query(
      collection(db, 'users'),
      where('username', '>=', searchQuery.toLowerCase()),
      where('username', '<=', searchQuery.toLowerCase() + '')
    ))
    setSearchResults(
      snaps.docs
        .filter((d) => d.id !== user?.uid)
        .map((d) => ({ id: d.id, username: d.data().username as string }))
        .slice(0, 10)
    )
  }

  const sendRequest = async (friendId: string) => {
    if (!db || !user) return
    const docId = [user.uid, friendId].sort().join('_')
    await setDoc(doc(db, 'friendships', docId), { requester_id: user.uid, addressee_id: friendId, status: 'pending' })
    setSearchResults([])
    setSearchQuery('')
    loadFriends()
  }

  const acceptRequest = async (friendshipId: string) => {
    if (!db) return
    await setDoc(doc(db, 'friendships', friendshipId), { status: 'accepted' }, { merge: true })
    loadFriends()
  }

  const removeFriend = async (friendshipId: string) => {
    if (!db) return
    await deleteDoc(doc(db, 'friendships', friendshipId))
    loadFriends()
  }

  const pending = friends.filter((f) => f.status === 'pending' && !f.isRequester)
  const accepted = friends.filter((f) => f.status === 'accepted')
  const sent = friends.filter((f) => f.status === 'pending' && f.isRequester)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 sm:rounded-2xl"
        style={{ maxHeight: 'calc(100dvh - 60px)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold text-text-primary">{t('timetable.friends')}</h2>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
            placeholder={t('timetable.searchFriends')}
            className="flex-1 rounded-xl border border-border-hover bg-surface-alt px-3 py-2 text-sm text-text-primary placeholder-gray-500 outline-none focus:border-accent/50"
          />
          <button onClick={searchUsers} className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-text-primary">
            {t('timetable.search')}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mb-4 space-y-2">
            {searchResults.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg bg-surface-alt p-2">
                <span className="text-sm text-text-secondary">@{u.username}</span>
                <button onClick={() => sendRequest(u.id)} className="text-xs text-accent hover:text-text-primary">
                  {t('timetable.addFriend')}
                </button>
              </div>
            ))}
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-medium uppercase text-yellow-400">{t('timetable.pendingRequests')}</h3>
            {pending.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-alt p-2 mb-1">
                <span className="text-sm text-text-secondary">@{f.username}</span>
                <div className="flex gap-2">
                  <button onClick={() => acceptRequest(f.id)} className="text-xs text-green-400 hover:text-text-primary">{t('timetable.accept')}</button>
                  <button onClick={() => removeFriend(f.id)} className="text-xs text-red-400 hover:text-text-primary">{t('timetable.decline')}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {accepted.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-medium uppercase text-text-muted">{t('timetable.yourFriends')}</h3>
            {accepted.map((f) => {
              const isBuddy = buddyIds.includes(f.friendUserId)
              return (
                <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-alt p-2 mb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBuddy(f.friendUserId)}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                        isBuddy ? 'bg-green-900/40 text-green-400' : 'bg-surface-card text-text-muted'
                      }`}
                      title={isBuddy ? t('timetable.buddyActive') : t('timetable.buddyInactive')}
                    >
                      {isBuddy ? t('timetable.goingTogether') : editionYear.toString()}
                    </button>
                    <button
                      onClick={() => { onViewSchedule(f.friendUserId, f.display_name || f.username); onClose() }}
                      className="text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      {f.display_name || f.username}
                    </button>
                  </div>
                  <button onClick={() => removeFriend(f.id)} className="text-xs text-gray-500 hover:text-red-400">{t('timetable.remove')}</button>
                </div>
              )
            })}
          </div>
        )}

        {sent.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">{t('timetable.sentRequests')}</h3>
            {sent.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-alt p-2 mb-1">
                <span className="text-sm text-text-muted">@{f.username}</span>
                <span className="text-xs text-gray-600">{t('timetable.waiting')}</span>
              </div>
            ))}
          </div>
        )}

        {accepted.length === 0 && pending.length === 0 && sent.length === 0 && (
          <p className="text-sm text-gray-500">{t('timetable.noFriends')}</p>
        )}
      </div>
    </div>
  )
}

// ─── Set Card ───
function SetCard({ set, saved, friendCount, vote, onToggle, onVote }: {
  set: Set
  saved: boolean
  friendCount: number
  vote?: VoteType
  onToggle: () => void
  onVote: (type: VoteType) => void
}) {
  const { t } = useTranslation()

  return (
    <div className={`rounded-xl border transition-colors ${saved ? 'border-accent/50 bg-accent/10' : 'border-border bg-surface-card'}`}>
      <div className="flex items-center gap-3 p-3">
        <div className="h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{set.artist}</p>
          <p className="text-xs text-text-muted">
            {set.startTime} – {set.endTime}
            {set.special && <span className="ml-1.5 text-accent">({set.special})</span>}
          </p>
        </div>
        {friendCount > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300" title={t('timetable.friendsGoing')}>
            {friendCount} <UsersIcon size={12} />
          </span>
        )}
        <button
          onClick={onToggle}
          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            saved
              ? 'bg-accent/20 text-accent hover:bg-accent/30'
              : 'bg-surface-alt text-text-muted hover:bg-surface-card hover:text-text-primary'
          }`}
        >
          {saved ? '✓' : '+'}
        </button>
      </div>
      {saved && (
        <div className="flex items-center gap-1.5 border-t border-white/5 px-3 py-1.5">
          <span className="mr-auto text-[10px] text-text-muted">{t('timetable.rateSet')} :</span>
          <button
            onClick={() => onVote('fire')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
              vote === 'fire' ? 'bg-orange-500/30 text-orange-400' : 'bg-surface-alt text-text-muted hover:bg-orange-500/20 hover:text-orange-400'
            }`}
          >
            <FlameIcon size={12} /> Fire
          </button>
          <button
            onClick={() => onVote('cold')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
              vote === 'cold' ? 'bg-blue-500/30 text-blue-400' : 'bg-surface-alt text-text-muted hover:bg-blue-500/20 hover:text-blue-400'
            }`}
          >
            <SnowflakeIcon size={12} /> Cold
          </button>
        </div>
      )}
    </div>
  )
}

const TIMETABLE_CACHE_URL = `${import.meta.env.BASE_URL}data/timetable-2026.json`

// ─── Main Timetable Page ───
export default function Timetable() {
  const { t } = useTranslation()
  const { user, configured } = useAuth()
  const [edition, setEdition] = useState<Edition>(getCurrentEdition)
  const [officialTimetableLoaded, setOfficialTimetableLoaded] = useState(false)
  const [activeDay, setActiveDay] = useState<Day>('friday')
  const [activeStage, setActiveStage] = useState<Stage | 'ALL'>('ALL')
  const [savedSets, setSavedSets] = useState<string[]>(() => getLocalSavedSets(getCurrentEdition().year))
  const [friendSets, setFriendSets] = useState<Record<string, string[]>>({})
  const [showFriends, setShowFriends] = useState(false)
  const [viewMode, setViewMode] = useState<'timetable' | 'my-schedule' | 'friends'>('timetable')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewingBuddy, setViewingBuddy] = useState<{ id: string; name: string } | null>(null)
  const [buddySetIds, setBuddySetIds] = useState<string[]>([])
  const [votes, setVotes] = useState<Record<string, VoteType>>(() => getLocalVotes(getCurrentEdition().year))
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list')

  useEffect(() => { document.title = 'Timetable — Defqon Companion' }, [])

  // Try to load official timetable cache for 2026
  useEffect(() => {
    if (edition.year !== 2026 || officialTimetableLoaded) return
    fetch(TIMETABLE_CACHE_URL)
      .then((r) => r.json())
      .then((data: { sets?: import('../data/lineup').Set[] }) => {
        if (data.sets && data.sets.length > 0) {
          setEdition((prev) => ({ ...prev, lineup: data.sets! }))
          setOfficialTimetableLoaded(true)
        }
      })
      .catch(() => { /* keep static data */ })
  }, [edition.year, officialTimetableLoaded])

  useEffect(() => {
    setVotes(getLocalVotes(edition.year))
  }, [edition.year])

  const voteSet = useCallback((setId: string, type: VoteType) => {
    setVotes((prev) => {
      const next = { ...prev }
      if (next[setId] === type) delete next[setId]
      else next[setId] = type
      saveLocalVotes(edition.year, next)
      return next
    })
  }, [edition.year])

  // Charger les sets sauvegardés depuis Firestore
  useEffect(() => {
    if (!db || !user) return
    getDocs(query(
      collection(db, 'timetable_entries'),
      where('user_id', '==', user.uid),
      where('edition_year', '==', edition.year)
    )).then((snaps) => {
      if (!snaps.empty) setSavedSets(snaps.docs.map((d) => d.data().set_id as string))
    })
  }, [user, edition.year])

  // Écouter en temps réel les sets des buddies
  useEffect(() => {
    if (!db || !user) return

    let unsubscribe: (() => void) | undefined

    async function subscribeBuddySets() {
      const buddySnaps = await getDocs(query(
        collection(db!, 'edition_buddies'),
        where('user_id', '==', user!.uid),
        where('edition_year', '==', edition.year)
      ))
      const buddyIds = buddySnaps.docs.map((d) => d.data().friend_id as string)

      if (!buddyIds.length) {
        setFriendSets({})
        return
      }

      // onSnapshot sur les entries des buddies
      unsubscribe = onSnapshot(
        query(
          collection(db!, 'timetable_entries'),
          where('user_id', 'in', buddyIds),
          where('edition_year', '==', edition.year)
        ),
        (snap) => {
          const grouped: Record<string, string[]> = {}
          snap.docs.forEach((d) => {
            const { set_id, user_id } = d.data() as { set_id: string; user_id: string }
            if (!grouped[set_id]) grouped[set_id] = []
            grouped[set_id].push(user_id)
          })
          setFriendSets(grouped)
        }
      )
    }

    subscribeBuddySets()
    return () => unsubscribe?.()
  }, [user, edition.year])

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem(`defqon-timetable-${edition.year}`, JSON.stringify(savedSets))
  }, [savedSets, edition.year])

  const toggleSet = async (setId: string) => {
    const isSaved = savedSets.includes(setId)
    if (isSaved) {
      setSavedSets((prev) => prev.filter((id) => id !== setId))
      if (db && user) {
        await deleteDoc(doc(db, 'timetable_entries', `${user.uid}_${edition.year}_${setId}`))
      }
    } else {
      setSavedSets((prev) => [...prev, setId])
      if (db && user) {
        await setDoc(doc(db, 'timetable_entries', `${user.uid}_${edition.year}_${setId}`), {
          user_id: user.uid,
          set_id: setId,
          edition_year: edition.year,
        })
      }
    }
  }

  const viewBuddySchedule = async (friendId: string, friendName: string) => {
    setViewingBuddy({ id: friendId, name: friendName })
    if (db) {
      const snaps = await getDocs(query(
        collection(db, 'timetable_entries'),
        where('user_id', '==', friendId),
        where('edition_year', '==', edition.year)
      ))
      setBuddySetIds(snaps.docs.map((d) => d.data().set_id as string))
    }
  }

  const shareUrl = useMemo(() => {
    if (savedSets.length === 0) return ''
    const ids = savedSets.map((id) => id.split('-').at(-1)).join(',')
    return `${window.location.origin}${import.meta.env.BASE_URL}#/timetable?y=${edition.year}&s=${ids}`
  }, [savedSets, edition.year])

  const sharePlanning = async () => {
    const text = t('timetable.shareText', { count: savedSets.length, year: edition.year })
    if (navigator.share) {
      await navigator.share({ title: `Defqon.1 ${edition.year}`, text, url: shareUrl })
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
      alert(t('timetable.linkCopied'))
    }
  }

  const getConflicts = (): Set[][] => {
    const saved = edition.lineup.filter((s) => savedSets.includes(s.id))
    const conflicts: Set[][] = []
    for (let i = 0; i < saved.length; i++) {
      for (let j = i + 1; j < saved.length; j++) {
        const a = saved[i], b = saved[j]
        if (a.day === b.day && a.stage !== b.stage && a.startTime < b.endTime && b.startTime < a.endTime) {
          conflicts.push([a, b])
        }
      }
    }
    return conflicts
  }

  const filteredSets = edition.lineup
    .filter((s) => s.day === activeDay)
    .filter((s) => activeStage === 'ALL' || s.stage === activeStage)
    .filter((s) => !searchQuery || s.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const searchResults = searchQuery.length >= 2
    ? edition.lineup
        .filter((s) => s.artist.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
          const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
          return dayOrder || a.startTime.localeCompare(b.startTime)
        })
    : null

  const buddySets = viewingBuddy
    ? edition.lineup.filter((s) => buddySetIds.includes(s.id)).sort((a, b) => {
        const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
        return dayOrder || a.startTime.localeCompare(b.startTime)
      })
    : []

  const mySets = edition.lineup
    .filter((s) => savedSets.includes(s.id))
    .sort((a, b) => {
      const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
      return dayOrder || a.startTime.localeCompare(b.startTime)
    })

  const friendsViewSets = edition.lineup
    .filter((s) => friendSets[s.id]?.length > 0)
    .sort((a, b) => {
      const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
      return dayOrder || a.startTime.localeCompare(b.startTime)
    })

  const conflicts = getConflicts()
  const stages = edition.stagesPerDay[activeDay]

  const headerContent = (
    <>
      <div className="mt-3 flex gap-1.5">
        {editionMetas.map((em) => (
          <button
            key={em.year}
            onClick={async () => {
              const ed = await loadEdition(em.year)
              setEdition(ed); setActiveDay('friday'); setActiveStage('ALL')
              if (!ed.isCurrent && viewMode === 'my-schedule') setViewMode('timetable')
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
              edition.year === em.year ? 'bg-accent text-text-primary' : 'bg-white/5 text-text-muted hover:text-text-primary'
            }`}
          >
            {em.year}
          </button>
        ))}
      </div>

      {!edition.isCurrent && (
        <p className="mt-2 text-xs italic text-text-secondary">&ldquo;{edition.theme}&rdquo; &middot; {t('timetable.archive')}</p>
      )}

      <div className="mt-3 flex rounded-lg bg-black/30 p-0.5">
        <button
          onClick={() => setViewMode('timetable')}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            viewMode === 'timetable' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {t('timetable.fullLineup')}
        </button>
        {edition.isCurrent && (
          <button
            onClick={() => setViewMode('my-schedule')}
            className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              viewMode === 'my-schedule' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t('timetable.mySchedule')} ({savedSets.length})
          </button>
        )}
        {configured && user && (
          <button
            onClick={() => setViewMode('friends')}
            className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              viewMode === 'friends' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t('timetable.friendsTab')}
          </button>
        )}
      </div>
    </>
  )

  return (
    <PageShell title={t('timetable.title')} subtitle={t('timetable.subtitle')} headerContent={headerContent}>
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('timetable.searchArtist')}
          className="w-full rounded-xl border border-border bg-surface-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50"
        />
      </div>

      <p className="mb-3 flex items-start gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-text-muted">
        <span className="mt-0.5 shrink-0">ℹ️</span>
        {t('timetable.officialAppNotice')}
      </p>

      {edition.isCurrent && (
        <LiveMode edition={edition} friendSets={friendSets} savedSets={savedSets} />
      )}

      {searchResults ? (
        <div className="mx-auto w-full max-w-md">
          <p className="mb-2 text-xs text-text-muted">{searchResults.length} {t('timetable.searchResultCount')}</p>
          <div className="space-y-2">
            {searchResults.map((set) => (
              <SetCard key={set.id} set={set} saved={savedSets.includes(set.id)} friendCount={friendSets[set.id]?.length || 0} vote={votes[set.id]} onToggle={() => toggleSet(set.id)} onVote={(type) => voteSet(set.id, type)} />
            ))}
          </div>
        </div>
      ) : viewMode === 'timetable' ? (
        <>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex-1 grid grid-cols-4 gap-1.5">
              {days.map((day) => (
                <button
                  key={day.key}
                  onClick={() => { setActiveDay(day.key); setActiveStage('ALL') }}
                  className={`rounded-lg py-2.5 text-center transition-colors ${
                    activeDay === day.key ? 'bg-accent text-text-primary' : 'bg-surface-card border border-border text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider">{t(`timetable.days.${day.key}`).slice(0, 3)}</span>
                  <span className="block text-[9px] text-text-muted mt-0.5">{day.date.split(' ')[1]}</span>
                </button>
              ))}
            </div>
            <div className="flex rounded-lg border border-border bg-surface-card">
              <button
                onClick={() => setLayoutMode('list')}
                title="List view"
                className={`px-2.5 py-2 text-xs transition-colors rounded-l-lg ${layoutMode === 'list' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
              >
                ☰
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                title="Grid view"
                className={`px-2.5 py-2 text-xs transition-colors rounded-r-lg border-l border-border ${layoutMode === 'grid' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
              >
                ⊞
              </button>
            </div>
          </div>

          {layoutMode === 'grid' ? (
            <GridTimetable
              sets={edition.lineup.filter((s) => s.day === activeDay)}
              stages={stages}
              savedSets={savedSets}
              friendSets={friendSets}
              onToggle={toggleSet}
            />
          ) : (
            <>
              <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveStage('ALL')}
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeStage === 'ALL' ? 'bg-text-primary text-surface' : 'bg-surface-card text-text-muted hover:text-text-primary'
                  }`}
                >
                  {t('timetable.allStages')}
                </button>
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setActiveStage(stage)}
                    className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    style={{
                      backgroundColor: activeStage === stage ? stageColors[stage] : 'var(--color-surface-card)',
                      color: activeStage === stage ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stageColors[stage] }} />
                    {stage}
                  </button>
                ))}
              </div>

              <div className="mx-auto w-full max-w-md space-y-2">
                {filteredSets.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">{t('timetable.noSets')}</p>
                ) : (
                  filteredSets.map((set) => (
                    <SetCard key={set.id} set={set} saved={savedSets.includes(set.id)} friendCount={friendSets[set.id]?.length || 0} vote={votes[set.id]} onToggle={() => toggleSet(set.id)} onVote={(type) => voteSet(set.id, type)} />
                  ))
                )}
              </div>
            </>
          )}
        </>
      ) : viewMode === 'my-schedule' ? (
        <div className="mx-auto w-full max-w-md">
          {savedSets.length > 0 && (
            <button
              onClick={sharePlanning}
              className="mb-3 w-full rounded-xl border border-border bg-surface-card py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              {t('timetable.sharePlanning')}
            </button>
          )}

          {conflicts.length > 0 && (
            <div className="mb-4 rounded-xl border border-yellow-700/50 bg-yellow-900/20 p-3">
              <p className="mb-1 text-xs font-medium text-yellow-400">{t('timetable.conflicts')}</p>
              {conflicts.map(([a, b], i) => (
                <p key={i} className="text-xs text-yellow-300/80">
                  {a.artist} ({a.stage} {a.startTime}) {'↔'} {b.artist} ({b.stage} {b.startTime})
                </p>
              ))}
            </div>
          )}

          {mySets.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">{t('timetable.emptySchedule')}</p>
          ) : (
            <div className="space-y-4">
              {days.map((day) => {
                const daySets = mySets.filter((s) => s.day === day.key)
                if (daySets.length === 0) return null
                return (
                  <div key={day.key}>
                    <h3 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                      {t(`timetable.days.${day.key}`)} — {day.date}
                    </h3>
                    <div className="space-y-2">
                      {daySets.map((set) => (
                        <SetCard key={set.id} set={set} saved={true} friendCount={friendSets[set.id]?.length || 0} vote={votes[set.id]} onToggle={() => toggleSet(set.id)} onVote={(type) => voteSet(set.id, type)} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : viewMode === 'friends' ? (
        <div className="mx-auto w-full max-w-md">
          {configured && user && (
            <button
              onClick={() => setShowFriends(true)}
              className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-card py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              <UsersIcon size={13} /> {t('timetable.friends')}
            </button>
          )}
          {friendsViewSets.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-muted">{t('timetable.noFriendSets')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {days.map((day) => {
                const daySets = friendsViewSets.filter((s) => s.day === day.key)
                if (daySets.length === 0) return null
                return (
                  <div key={day.key}>
                    <h3 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                      {t(`timetable.days.${day.key}`)} — {day.date}
                    </h3>
                    <div className="space-y-2">
                      {daySets.map((set) => {
                        const isMine = savedSets.includes(set.id)
                        return (
                          <div
                            key={set.id}
                            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${isMine ? 'border-accent/30 bg-accent/5' : 'border-border bg-surface-card'}`}
                          >
                            <div className="h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-text-primary">{set.artist}</p>
                              <p className="text-xs text-text-muted">{set.stage} &middot; {set.startTime} – {set.endTime}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300">
                                {friendSets[set.id].length} <UsersIcon size={11} />
                              </span>
                              {isMine && <span className="text-[9px] font-bold uppercase tracking-wider text-accent">{t('timetable.youToo')}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {showFriends && <FriendsPanel onClose={() => setShowFriends(false)} editionYear={edition.year} onViewSchedule={viewBuddySchedule} />}

      {viewingBuddy && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={() => setViewingBuddy(null)}>
          <div
            className="w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 sm:rounded-2xl"
            style={{ maxHeight: 'calc(100dvh - 60px)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="defqon-heading text-lg text-text-primary">{viewingBuddy.name}</h2>
              <button onClick={() => setViewingBuddy(null)} className="text-sm text-text-muted hover:text-text-primary">&times;</button>
            </div>
            <p className="mb-3 text-xs text-text-muted">{buddySets.length} {t('timetable.setsPlanned')}</p>
            {buddySets.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">{t('timetable.emptyBuddySchedule')}</p>
            ) : (
              <div className="space-y-4">
                {days.map((day) => {
                  const daySets = buddySets.filter((s) => s.day === day.key)
                  if (daySets.length === 0) return null
                  return (
                    <div key={day.key}>
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">{t(`timetable.days.${day.key}`)}</h3>
                      <div className="space-y-1.5">
                        {daySets.map((set) => {
                          const isMine = savedSets.includes(set.id)
                          return (
                            <div key={set.id} className={`flex items-center gap-2 rounded-lg p-2.5 ${isMine ? 'bg-accent/10' : 'bg-surface-alt'}`}>
                              <div className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: stageColors[set.stage] }} />
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm text-text-primary">{set.artist}</p>
                                <p className="text-[10px] text-text-muted">{set.stage} &middot; {set.startTime}</p>
                              </div>
                              {isMine && <span className="text-[9px] font-bold uppercase text-accent">{t('timetable.youToo')}</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  )
}
