import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AuthModal from '../components/AuthModal'
import { SettingsIcon, UsersIcon, HistoryIcon } from '../components/Icons'
import { days, stageColors, type Day, type Stage, type Set } from '../data/lineup'
import { editions, getCurrentEdition, type Edition } from '../data/editions'

// ─── Local storage fallback for non-authenticated users ───
function getLocalSavedSets(): string[] {
  try { return JSON.parse(localStorage.getItem('defqon-timetable') || '[]') } catch { return [] }
}

// ─── Friends panel ───
function FriendsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [friends, setFriends] = useState<{ id: string; username: string; display_name: string | null; status: string; isRequester: boolean }[]>([])
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([])

  const loadFriends = useCallback(async () => {
    if (!supabase || !user) return
    const { data } = await supabase
      .from('friendships')
      .select(`
        id, status, requester_id, addressee_id,
        requester:profiles!friendships_requester_id_fkey(id, username, display_name),
        addressee:profiles!friendships_addressee_id_fkey(id, username, display_name)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

    if (data) {
      setFriends(data.map((f: Record<string, unknown>) => {
        const isRequester = (f.requester_id as string) === user.id
        const friend = isRequester ? f.addressee : f.requester
        const friendData = friend as { id: string; username: string; display_name: string | null }
        return {
          id: f.id as string,
          username: friendData.username,
          display_name: friendData.display_name,
          status: f.status as string,
          isRequester,
        }
      }))
    }
  }, [user])

  useEffect(() => { loadFriends() }, [loadFriends])

  const searchUsers = async () => {
    if (!supabase || !searchQuery.trim()) return
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', `%${searchQuery}%`)
      .neq('id', user?.id)
      .limit(10)
    if (data) setSearchResults(data)
  }

  const sendRequest = async (friendId: string) => {
    if (!supabase || !user) return
    await supabase.from('friendships').insert({ requester_id: user.id, addressee_id: friendId })
    setSearchResults([])
    setSearchQuery('')
    loadFriends()
  }

  const acceptRequest = async (friendshipId: string) => {
    if (!supabase) return
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    loadFriends()
  }

  const removeFriend = async (friendshipId: string) => {
    if (!supabase) return
    await supabase.from('friendships').delete().eq('id', friendshipId)
    loadFriends()
  }

  const pending = friends.filter((f) => f.status === 'pending' && !f.isRequester)
  const accepted = friends.filter((f) => f.status === 'accepted')
  const sent = friends.filter((f) => f.status === 'pending' && f.isRequester)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold text-text-primary">{t('timetable.friends')}</h2>

        {/* Search */}
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

        {/* Pending requests */}
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

        {/* Accepted friends */}
        {accepted.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-medium uppercase text-text-muted">{t('timetable.yourFriends')}</h3>
            {accepted.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface-alt p-2 mb-1">
                <span className="text-sm text-text-secondary">{f.display_name || f.username}</span>
                <button onClick={() => removeFriend(f.id)} className="text-xs text-gray-500 hover:text-red-400">{t('timetable.remove')}</button>
              </div>
            ))}
          </div>
        )}

        {/* Sent requests */}
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
function SetCard({ set, saved, friendCount, onToggle }: {
  set: Set
  saved: boolean
  friendCount: number
  onToggle: () => void
}) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
        saved
          ? 'border-accent/50 bg-accent/10'
          : 'border-border bg-surface-card'
      }`}
    >
      <div
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: stageColors[set.stage] }}
      />
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
        {saved ? '\u2713' : '+'}
      </button>
    </div>
  )
}

// ─── Main Timetable Page ───
export default function Timetable() {
  const { t } = useTranslation()
  const { user, profile, configured } = useAuth()
  const [edition, setEdition] = useState<Edition>(getCurrentEdition)
  const [activeDay, setActiveDay] = useState<Day>('friday')
  const [activeStage, setActiveStage] = useState<Stage | 'ALL'>('ALL')
  const [savedSets, setSavedSets] = useState<string[]>(getLocalSavedSets)
  const [friendSets, setFriendSets] = useState<Record<string, string[]>>({})
  const [showAuth, setShowAuth] = useState(false)
  const [showFriends, setShowFriends] = useState(false)
  const [viewMode, setViewMode] = useState<'timetable' | 'my-schedule'>('timetable')

  // Load saved sets from Supabase if authenticated
  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('timetable_entries')
      .select('set_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setSavedSets(data.map((d) => d.set_id))
      })
  }, [user])

  // Load friends' sets
  useEffect(() => {
    if (!supabase || !user) return

    async function loadFriendSets() {
      // Get accepted friend IDs
      const { data: friendships } = await supabase!
        .from('friendships')
        .select('requester_id, addressee_id')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user!.id},addressee_id.eq.${user!.id}`)

      if (!friendships?.length) return

      const friendIds = friendships.map((f) =>
        f.requester_id === user!.id ? f.addressee_id : f.requester_id
      )

      // Get their timetable entries
      const { data: entries } = await supabase!
        .from('timetable_entries')
        .select('user_id, set_id')
        .in('user_id', friendIds)

      if (entries) {
        const grouped: Record<string, string[]> = {}
        entries.forEach((e) => {
          if (!grouped[e.set_id]) grouped[e.set_id] = []
          grouped[e.set_id].push(e.user_id)
        })
        setFriendSets(grouped)
      }
    }

    loadFriendSets()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('friend-timetable')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timetable_entries' }, () => {
        loadFriendSets()
      })
      .subscribe()

    return () => { supabase!.removeChannel(channel) }
  }, [user])

  // Persist to localStorage (fallback) and Supabase
  useEffect(() => {
    localStorage.setItem('defqon-timetable', JSON.stringify(savedSets))
  }, [savedSets])

  const toggleSet = async (setId: string) => {
    const isSaved = savedSets.includes(setId)

    if (isSaved) {
      setSavedSets((prev) => prev.filter((id) => id !== setId))
      if (supabase && user) {
        await supabase.from('timetable_entries').delete().eq('user_id', user.id).eq('set_id', setId)
      }
    } else {
      setSavedSets((prev) => [...prev, setId])
      if (supabase && user) {
        await supabase.from('timetable_entries').insert({ user_id: user.id, set_id: setId })
      }
    }
  }

  // Check for time conflicts in saved sets
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
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const mySets = edition.lineup
    .filter((s) => savedSets.includes(s.id))
    .sort((a, b) => {
      const dayOrder = days.findIndex((d) => d.key === a.day) - days.findIndex((d) => d.key === b.day)
      return dayOrder || a.startTime.localeCompare(b.startTime)
    })

  const conflicts = getConflicts()
  const stages = edition.stagesPerDay[activeDay]

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-8">
      <header className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {configured && user && profile ? (
              <span className="text-xs text-text-muted">@{profile.username}</span>
            ) : configured ? (
              <button onClick={() => setShowAuth(true)} className="text-xs text-accent hover:text-text-primary">
                {t('timetable.loginToSync')}
              </button>
            ) : (
              <span className="text-xs text-gray-500">{t('timetable.offlineMode')}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {configured && user && (
              <button
                onClick={() => setShowFriends(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-alt px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-card"
              >
                <UsersIcon size={14} /> {t('timetable.friends')}
              </button>
            )}
            <Link to="/settings" className="rounded-lg p-2 text-text-muted transition-colors hover:text-text-primary">
              <SettingsIcon size={20} />
            </Link>
          </div>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('timetable.title')}</h1>
        <p className="mt-1 text-sm text-text-muted">{t('timetable.subtitle')}</p>
      </header>

      {/* Edition selector */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto">
        <HistoryIcon size={14} className="shrink-0 text-text-muted" />
        {editions.map((ed) => (
          <button
            key={ed.year}
            onClick={() => { setEdition(ed); setActiveDay('friday'); setActiveStage('ALL') }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              edition.year === ed.year
                ? 'bg-accent text-text-primary'
                : 'bg-surface-alt text-text-muted hover:bg-surface-card'
            }`}
          >
            {ed.year} {ed.isCurrent && `(${t('timetable.currentEdition')})`}
          </button>
        ))}
      </div>

      {/* Edition theme banner */}
      {!edition.isCurrent && (
        <div className="mb-4 rounded-xl border border-border bg-surface-card p-3 text-center">
          <p className="text-xs text-text-muted">{t('timetable.archive')}</p>
          <p className="text-sm font-semibold text-text-primary italic">&ldquo;{edition.theme}&rdquo;</p>
        </div>
      )}

      {/* View toggle */}
      <div className="mb-4 flex rounded-xl bg-surface-alt p-1">
        <button
          onClick={() => setViewMode('timetable')}
          className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
            viewMode === 'timetable' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {t('timetable.fullLineup')}
        </button>
        <button
          onClick={() => setViewMode('my-schedule')}
          className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
            viewMode === 'my-schedule' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {t('timetable.mySchedule')} ({savedSets.length})
        </button>
      </div>

      {viewMode === 'timetable' ? (
        <>
          {/* Day selector */}
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {days.map((day) => (
              <button
                key={day.key}
                onClick={() => { setActiveDay(day.key); setActiveStage('ALL') }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeDay === day.key
                    ? 'bg-accent text-text-primary'
                    : 'bg-surface-alt text-text-muted hover:bg-surface-card'
                }`}
              >
                {t(`timetable.days.${day.key}`)}
              </button>
            ))}
          </div>

          {/* Stage filter */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveStage('ALL')}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeStage === 'ALL' ? 'bg-white text-gray-900' : 'bg-surface-alt text-text-muted hover:bg-surface-card'
              }`}
            >
              {t('timetable.allStages')}
            </button>
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeStage === stage ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                }`}
                style={activeStage === stage ? { backgroundColor: stageColors[stage] } : { backgroundColor: 'rgb(31,41,55)' }}
              >
                {stage}
              </button>
            ))}
          </div>

          {/* Sets list */}
          <div className="mx-auto w-full max-w-md space-y-2">
            {filteredSets.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">{t('timetable.noSets')}</p>
            ) : (
              filteredSets.map((set) => (
                <SetCard
                  key={set.id}
                  set={set}
                  saved={savedSets.includes(set.id)}
                  friendCount={friendSets[set.id]?.length || 0}
                  onToggle={() => toggleSet(set.id)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        /* My schedule view */
        <div className="mx-auto w-full max-w-md">
          {/* Conflicts warning */}
          {conflicts.length > 0 && (
            <div className="mb-4 rounded-xl border border-yellow-700/50 bg-yellow-900/20 p-3">
              <p className="mb-1 text-xs font-medium text-yellow-400">{t('timetable.conflicts')}</p>
              {conflicts.map(([a, b], i) => (
                <p key={i} className="text-xs text-yellow-300/80">
                  {a.artist} ({a.stage} {a.startTime}) {'\u2194'} {b.artist} ({b.stage} {b.startTime})
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
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                      {t(`timetable.days.${day.key}`)} — {day.date}
                    </h3>
                    <div className="space-y-2">
                      {daySets.map((set) => (
                        <SetCard
                          key={set.id}
                          set={set}
                          saved={true}
                          friendCount={friendSets[set.id]?.length || 0}
                          onToggle={() => toggleSet(set.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showFriends && <FriendsPanel onClose={() => setShowFriends(false)} />}
    </div>
  )
}
