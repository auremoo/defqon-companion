import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { colors, type DefqonColor } from '../data/colors'
import { HeartIcon, SettingsIcon, SpotifyIcon, YouTubeIcon, AppleMusicIcon, DeezerIcon, SoundCloudIcon } from '../components/Icons'

function getStoredFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem('defqon-favorites') || '[]')
  } catch {
    return []
  }
}

function ColorCard({ color, isFavorite, onToggleFavorite }: {
  color: DefqonColor
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-card transition-all">
      {/* Header bar with color */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderLeft: `4px solid ${color.hex}` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <div>
            <h3 className="font-bold text-text-primary">{color.name}</h3>
            <p className="text-xs text-text-secondary">{color.styleKey}</p>
          </div>
        </button>
        <button
          onClick={onToggleFavorite}
          className="ml-2 rounded-lg p-2 transition-colors hover:bg-surface-alt"
          title={isFavorite ? t('colors.unfavorite') : t('colors.favorite')}
        >
          <HeartIcon size={18} filled={isFavorite} className={isFavorite ? 'text-accent' : 'text-text-muted'} />
        </button>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="border-t border-border p-4 space-y-3">
          <p className="text-sm text-text-secondary">{color.shortDesc}</p>
          <p className="text-sm text-text-muted">{color.longDesc}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-alt p-2">
              <span className="text-text-muted">{t('colors.bpm')}</span>
              <p className="font-medium text-text-primary">{color.bpm}</p>
            </div>
            <div className="rounded-lg bg-surface-alt p-2">
              <span className="text-text-muted">{t('colors.vibe')}</span>
              <p className="font-medium text-text-primary">{color.vibe}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-text-muted">{t('colors.artists')}</p>
            <div className="flex flex-wrap gap-1.5">
              {color.artists.map((a) => (
                <span key={a} className="rounded-full bg-surface-alt px-2.5 py-1 text-xs text-text-secondary">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Multi-platform links */}
          <div className="flex flex-wrap gap-2 pt-1">
            {color.spotify && (
              <a href={color.spotify} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#1DB954]/10 px-3 py-2 text-xs font-medium text-[#1DB954] transition-colors hover:bg-[#1DB954]/20">
                <SpotifyIcon size={14} /> {t('colors.listenOnSpotify')}
              </a>
            )}
            {color.youtube && (
              <a href={color.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#FF0000]/10 px-3 py-2 text-xs font-medium text-[#FF0000] transition-colors hover:bg-[#FF0000]/20">
                <YouTubeIcon size={14} /> {t('colors.watchOnYouTube')}
              </a>
            )}
            {color.apple && (
              <a href={color.apple} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#FC3C44]/10 px-3 py-2 text-xs font-medium text-[#FC3C44] transition-colors hover:bg-[#FC3C44]/20">
                <AppleMusicIcon size={14} /> {t('colors.listenOnApple')}
              </a>
            )}
            {color.deezer && (
              <a href={color.deezer} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#A238FF]/10 px-3 py-2 text-xs font-medium text-[#A238FF] transition-colors hover:bg-[#A238FF]/20">
                <DeezerIcon size={14} /> {t('colors.listenOnDeezer')}
              </a>
            )}
            {color.soundcloud && (
              <a href={color.soundcloud} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#FF5500]/10 px-3 py-2 text-xs font-medium text-[#FF5500] transition-colors hover:bg-[#FF5500]/20">
                <SoundCloudIcon size={14} /> {t('colors.listenOnSoundCloud')}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Colors() {
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites)

  useEffect(() => {
    localStorage.setItem('defqon-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const favoriteColors = colors.filter((c) => favorites.includes(c.id))
  const otherColors = colors.filter((c) => !favorites.includes(c.id))

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-8">
      <header className="mb-6">
        <div className="mb-2 flex justify-end">
          <Link to="/settings" className="rounded-lg p-2 text-text-muted transition-colors hover:text-text-primary">
            <SettingsIcon size={20} />
          </Link>
        </div>
        <h1 className="defqon-heading text-2xl font-bold sm:text-3xl text-text-primary">{t('colors.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('colors.subtitle')}</p>
      </header>

      <div className="mx-auto w-full max-w-md space-y-3">
        {favoriteColors.length > 0 && (
          <>
            <h2 className="defqon-heading text-xs font-medium uppercase tracking-wider text-accent">
              {t('colors.favorites')}
            </h2>
            {favoriteColors.map((c) => (
              <ColorCard key={c.id} color={c} isFavorite={true} onToggleFavorite={() => toggleFavorite(c.id)} />
            ))}
            <h2 className="defqon-heading pt-2 text-xs font-medium uppercase tracking-wider text-text-muted">
              {t('colors.allColors')}
            </h2>
          </>
        )}
        {otherColors.map((c) => (
          <ColorCard key={c.id} color={c} isFavorite={false} onToggleFavorite={() => toggleFavorite(c.id)} />
        ))}
      </div>
    </div>
  )
}
