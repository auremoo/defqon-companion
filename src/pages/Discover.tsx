import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { SparklesIcon, CalendarIcon, PaletteIcon } from '../components/Icons'
import { colors } from '../data/colors'
import { artists } from '../data/artists'
import { stageColors, type Stage } from '../data/lineup'
import { getCurrentEdition } from '../data/editions'

const colorToStage: Record<string, Stage> = {
  red: 'RED', blue: 'BLUE', black: 'BLACK', yellow: 'YELLOW',
  indigo: 'INDIGO', magenta: 'MAGENTA', silver: 'SILVER',
  gold: 'GOLD', uv: 'UV', pink: 'PINK',
}

function getStoredFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem('defqon-favorites') || '[]') } catch { return [] }
}

function getSavedSets(year: number): string[] {
  try { return JSON.parse(localStorage.getItem(`defqon-timetable-${year}`) || '[]') } catch { return [] }
}

function stageFromId(id: string): Stage | null {
  const parts = id.split('-')
  if (parts.length < 3) return null
  return parts[1] as Stage
}

interface Recommendation {
  artist: string
  stage: Stage
  day: string
  startTime: string
  endTime: string
  setId: string
  reason: string
  reasonType: 'favorite-color' | 'saved-stage' | 'discovery'
}

export default function Discover() {
  const { t } = useTranslation()
  const edition = useMemo(() => getCurrentEdition(), [])
  const [favorites, setFavorites] = useState<string[]>([])
  const [savedSets, setSavedSets] = useState<string[]>([])

  useEffect(() => {
    document.title = 'Discover — Defqon Companion'
    setFavorites(getStoredFavorites())
    setSavedSets(getSavedSets(edition.year))
  }, [edition.year])

  const { recommendations, profile, hasData } = useMemo(() => {
    const stageCounts: Record<string, number> = {}
    for (const id of savedSets) {
      const stage = stageFromId(id)
      if (stage) stageCounts[stage] = (stageCounts[stage] || 0) + 1
    }
    for (const colorId of favorites) {
      const stage = colorToStage[colorId]
      if (stage) stageCounts[stage] = (stageCounts[stage] || 0) + 3
    }

    const topStages = Object.entries(stageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([stage]) => stage as Stage)

    const hasData = favorites.length > 0 || savedSets.length > 0

    const savedArtistNames = new Set(
      savedSets.map((id) => {
        const set = edition.lineup.find((s) => s.id === id)
        return set?.artist?.toLowerCase() ?? ''
      })
    )

    const recs: Recommendation[] = []
    const seen = new Set<string>()

    for (const stage of topStages) {
      const stageSets = edition.lineup
        .filter((s) => s.stage === stage && !savedSets.includes(s.id))
        .slice(0, 3)

      const color = colors.find((c) => colorToStage[c.id] === stage)
      const reason = favorites.includes(color?.id ?? '')
        ? t('discover.favoriteStageReason', { stage })
        : t('discover.similarReason', { subgenre: stageCounts[stage] > 1 ? `${stageCounts[stage]} sets` : stage })

      for (const set of stageSets) {
        if (!seen.has(set.id)) {
          seen.add(set.id)
          recs.push({
            artist: set.artist,
            stage: set.stage,
            day: set.day,
            startTime: set.startTime,
            endTime: set.endTime,
            setId: set.id,
            reason,
            reasonType: favorites.includes(color?.id ?? '') ? 'favorite-color' : 'saved-stage',
          })
        }
      }
    }

    const knownArtists = artists.filter((a) => !savedArtistNames.has(a.name.toLowerCase()))
    for (const artist of knownArtists.slice(0, 5)) {
      const setInLineup = edition.lineup.find(
        (s) => s.artist.toLowerCase().includes(artist.name.toLowerCase()) && !savedSets.includes(s.id)
      )
      if (setInLineup && !seen.has(setInLineup.id)) {
        seen.add(setInLineup.id)
        recs.push({
          artist: setInLineup.artist,
          stage: setInLineup.stage,
          day: setInLineup.day,
          startTime: setInLineup.startTime,
          endTime: setInLineup.endTime,
          setId: setInLineup.id,
          reason: hasData
            ? t('discover.similarReason', { subgenre: artist.subgenre })
            : t('discover.fanFavourite'),
          reasonType: 'discovery',
        })
      }
    }

    return { recommendations: recs.slice(0, 12), profile: topStages, hasData }
  }, [favorites, savedSets, edition, t])

  const dayLabel = (day: string) => day.charAt(0).toUpperCase() + day.slice(1)

  return (
    <PageShell title={t('discover.title')} subtitle={t('discover.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-5 pb-4">
        {/* Taste profile */}
        {profile.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-card p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">{t('discover.stageProfile')}</p>
            <div className="flex flex-wrap gap-2">
              {profile.map((stage) => (
                <span
                  key={stage}
                  className="rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: stageColors[stage] }}
                >
                  {stage}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-muted">
              {t('discover.basedOn', { favorites: favorites.length, saved: savedSets.length })}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!hasData && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <SparklesIcon size={28} className="mx-auto mb-3 text-accent" />
            <p className="text-sm font-medium text-text-primary">{t('discover.buildProfile')}</p>
            <p className="mt-1 text-xs text-text-muted">{t('discover.buildProfileDesc')}</p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/colors" className="flex items-center gap-1.5 rounded-lg bg-surface-alt px-3 py-2 text-xs font-medium text-text-secondary">
                <PaletteIcon size={14} /> {t('nav.colors')}
              </Link>
              <Link to="/timetable" className="flex items-center gap-1.5 rounded-lg bg-surface-alt px-3 py-2 text-xs font-medium text-text-secondary">
                <CalendarIcon size={14} /> {t('nav.timetable')}
              </Link>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="defqon-heading text-xs tracking-widest text-text-muted">
              {hasData ? t('discover.recommended') : t('discover.popular')}
            </h2>
            {recommendations.map((rec) => (
              <div
                key={rec.setId}
                className="overflow-hidden rounded-xl border border-border bg-surface-card"
                style={{ borderLeft: `4px solid ${stageColors[rec.stage]}` }}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{rec.artist}</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {dayLabel(rec.day)} · {rec.startTime}–{rec.endTime} · {rec.stage}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                      style={{ backgroundColor: stageColors[rec.stage] }}
                    >
                      {rec.stage}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <SparklesIcon size={11} className="shrink-0 text-accent" />
                    <p className="text-[11px] text-text-muted italic">{rec.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA to timetable */}
        {recommendations.length > 0 && (
          <Link
            to="/timetable"
            className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 py-3 text-sm font-semibold text-accent"
          >
            <CalendarIcon size={16} />
            {t('discover.openTimetable')}
          </Link>
        )}
      </div>
    </PageShell>
  )
}
