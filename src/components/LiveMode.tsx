import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { stageColors, type Set } from '../data/lineup'
import type { Edition } from '../data/editions'
import { UsersIcon } from './Icons'

interface LiveModeProps {
  edition: Edition
  friendSets: Record<string, string[]>
  savedSets: string[]
}

function getCurrentSets(lineup: Set[]): Set[] {
  const now = new Date()
  // Map day keys to date numbers for June 2026
  const dayDates: Record<string, number> = {
    thursday: 25,
    friday: 26,
    saturday: 27,
    sunday: 28,
  }

  return lineup.filter((set) => {
    const dateNum = dayDates[set.day]
    if (!dateNum) return false

    const start = new Date(2026, 5, dateNum, parseInt(set.startTime.split(':')[0]), parseInt(set.startTime.split(':')[1]))
    const end = new Date(2026, 5, dateNum, parseInt(set.endTime.split(':')[0]), parseInt(set.endTime.split(':')[1]))

    return now >= start && now < end
  })
}

export default function LiveMode({ edition, friendSets, savedSets }: LiveModeProps) {
  const { t } = useTranslation()
  const [currentSets, setCurrentSets] = useState<Set[]>([])
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    function update() {
      const now = new Date()
      const start = new Date(edition.startDate)
      const end = new Date(edition.endDate)
      const live = now >= start && now <= end

      setIsLive(live)
      if (live) {
        setCurrentSets(getCurrentSets(edition.lineup))
      } else {
        setCurrentSets([])
      }
    }

    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [edition])

  if (!isLive) return null

  return (
    <div className="mb-4 rounded-xl border border-red-800/50 bg-red-950/30 p-4">
      {/* LIVE badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
        </span>
        <span className="text-sm font-bold uppercase tracking-widest text-red-400">
          {t('timetable.live')}
        </span>
      </div>

      {/* Now playing */}
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {t('timetable.nowPlaying')}
      </h3>

      {currentSets.length === 0 ? (
        <p className="text-sm text-text-muted">{t('timetable.noSetsNow')}</p>
      ) : (
        <div className="space-y-1.5">
          {currentSets.map((set) => {
            const isSaved = savedSets.includes(set.id)
            const friends = friendSets[set.id]
            const friendCount = friends?.length || 0

            return (
              <div
                key={set.id}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  isSaved ? 'bg-accent/15 border border-accent/30' : 'bg-white/5'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: stageColors[set.stage] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {set.artist}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {set.stage} &middot; {set.startTime} – {set.endTime}
                  </p>
                </div>
                {isSaved && (
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-accent">
                    {t('timetable.yourSet')}
                  </span>
                )}
                {friendCount > 0 && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300">
                    {friendCount} <UsersIcon size={11} />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
