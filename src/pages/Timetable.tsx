import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { UsersIcon } from '../components/Icons'
import PageShell from '../components/PageShell'
import { days, stageColors, type Day, type Stage, type Set } from '../data/lineup'
import { editions, getCurrentEdition, type Edition } from '../data/editions'

// ─── Local storage fallback for non-authenticated users ───
function getLocalSavedSets(year: number): string[] {
  try { return JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]') } catch { return [] }
}

// ─── Friends panel ───
function FriendsPanel({ onClose, editionYear }: { onClose: () => void; editionYear: number }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [friends, setFriends] = useState<{ id: string; friendUserId: string; username: string; display_name: string | null; status: string; isRequester: boolean }[]>([])
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([])
  const [buddyIds, setBuddyIds] = useState<string[]>([])

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
          friendUserId: friendData.id,
          username: friendData.username,
          display_name: friendData.display_name,
          status: f.status as string,
          isRequester,
        }
      }))
    }

    // Load edition buddies
    const { data: buddies } = await supabase
      .from('edition_buddies')
      .select('friend_id')
      .eq('user_id', user.id)
      .eq('edition_year', editionYear)
    if (buddies) setBuddyIds(buddies.map((b) => b.friend_id))
  }, [user, editionYear])

  useEffect(() => { loadFriends() }, [loadFriends])

  const toggleBuddy = async (friendUserId: string) => {
    if (!supabase || !user) return
    const isBuddy = buddyIds.includes(friendUserId)
    if (isBuddy) {
      await supabase.from('edition_buddies').delete().eq('user_id', user.id).eq('friend_id', friendUserId).eq('edition_year', editionYear)
      setBuddyIds((prev) => prev.filter((id) => id !== friendUserId))
    } else {
      await supabase.from('edition_buddies').insert({ user_id: user.id, friend_id: friendUserId, edition_year: editionYear })
      setBuddyIds((prev) => [...prev, friendUserId])
    }
  }

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
        className="w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 sm:rounded-2xl"
        style={{ maxHeight: 'calc(100dvh - 60px)', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
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

        {/* Accepted friends with buddy toggle */}
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
                    <span className="text-sm text-text-secondary">{f.display_name || f.username}</span>
                  </div>
                  <button onClick={() => removeFriend(f.id)} className="text-xs text-gray-500 hover:text-red-400">{t('timetable.remove')}</button>
                </div>
              )
            })}
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
  const { user, configured } = useAuth()
  const [edition, setEdition] = useState<Edition>(getCurrentEdition)
  const [activeDay, setActiveDay] = useState<Day>('friday')
  const [activeStage, setActiveStage] = useState<Stage | 'ALL'>('ALL')
  const [savedSets, setSavedSets] = useState<string[]>(() => getLocalSavedSets(edition.year))
  const [friendSets, setFriendSets] = useState<Record<string, string[]>>({})
  const [showFriends, setShowFriends] = useState(false)
  const [viewMode, setViewMode] = useState<'timetable' | 'my-schedule'>('timetable')

  // Load saved sets from Supabase filtered by edition year
  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('timetable_entries')
      .select('set_id')
      .eq('user_id', user.id)
      .eq('edition_year', edition.year)
      .then(({ data }) => {
        if (data) setSavedSets(data.map((d) => d.set_id))
      })
  }, [user, edition.year])

  // Load friends' sets
  useEffect(() => {
    if (!supabase || !user) return

    async function loadFriendSets() {
      // Get edition buddies only (friends marked as "going together" this year)
      const { data: buddies } = await supabase!
        .from('edition_buddies')
        .select('friend_id')
        .eq('user_id', user!.id)
        .eq('edition_year', edition.year)

      if (!buddies?.length) {
        setFriendSets({})
        return
      }

      const buddyIds = buddies.map((b) => b.friend_id)

      // Get their timetable entries for current edition
      const { data: entries } = await supabase!
        .from('timetable_entries')
        .select('user_id, set_id')
        .in('user_id', buddyIds)
        .eq('edition_year', edition.year)

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
  }, [user, edition.year])

  // Persist to localStorage per edition (fallback)
  useEffect(() => {
    localStorage.setItem(`defqon-timetable-${edition.year}`, JSON.stringify(savedSets))
  }, [savedSets, edition.year])

  const toggleSet = async (setId: string) => {
    const isSaved = savedSets.includes(setId)

    if (isSaved) {
      setSavedSets((prev) => prev.filter((id) => id !== setId))
      if (supabase && user) {
        await supabase.from('timetable_entries').delete().eq('user_id', user.id).eq('set_id', setId).eq('edition_year', edition.year)
      }
    } else {
      setSavedSets((prev) => [...prev, setId])
      if (supabase && user) {
        await supabase.from('timetable_entries').insert({ user_id: user.id, set_id: setId, edition_year: edition.year })
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

  const headerContent = (
    <>
      {/* Edition + Friends row */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {editions.map((ed) => (
            <button
              key={ed.year}
              onClick={() => { setEdition(ed); setActiveDay('friday'); setActiveStage('ALL') }}
              className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                edition.year === ed.year
                  ? 'bg-accent text-text-primary'
                  : 'bg-white/5 text-text-muted hover:text-text-primary'
              }`}
            >
              {ed.year}
            </button>
          ))}
        </div>
        {configured && user && (
          <button
            onClick={() => setShowFriends(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
          >
            <UsersIcon size={13} /> {t('timetable.friends')}
          </button>
        )}
      </div>

      {/* Theme for archive editions */}
      {!edition.isCurrent && (
        <p className="mt-2 text-xs italic text-text-secondary">&ldquo;{edition.theme}&rdquo; &middot; {t('timetable.archive')}</p>
      )}

      {/* View toggle — integrated in header */}
      <div className="mt-3 flex rounded-lg bg-black/30 p-0.5">
        <button
          onClick={() => setViewMode('timetable')}
          className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            viewMode === 'timetable' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {t('timetable.fullLineup')}
        </button>
        <button
          onClick={() => setViewMode('my-schedule')}
          className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            viewMode === 'my-schedule' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {t('timetable.mySchedule')} ({savedSets.length})
        </button>
      </div>
    </>
  )

  return (
    <PageShell title={t('timetable.title')} subtitle={t('timetable.subtitle')} headerContent={headerContent}>
      {viewMode === 'timetable' ? (
        <>
          {/* Day tabs — card style */}
          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {days.map((day) => (
              <button
                key={day.key}
                onClick={() => { setActiveDay(day.key); setActiveStage('ALL') }}
                className={`rounded-lg py-2.5 text-center transition-colors ${
                  activeDay === day.key
                    ? 'bg-accent text-text-primary'
                    : 'bg-surface-card border border-border text-text-muted hover:text-text-primary'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider">
                  {t(`timetable.days.${day.key}`).slice(0, 3)}
                </span>
                <span className="block text-[9px] text-text-muted mt-0.5">{day.date.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Stage chips — compact colored dots */}
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
                    <h3 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
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

      {showFriends && <FriendsPanel onClose={() => setShowFriends(false)} editionYear={edition.year} />}
    </PageShell>
  )
}
