import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { colors, type DefqonColor } from '../data/colors'
import LanguageToggle from '../components/LanguageToggle'

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
    <div
      className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition-all"
    >
      {/* Header bar with color */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderLeft: `4px solid ${color.hex}` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span className="text-2xl">{color.emoji}</span>
          <div>
            <h3 className="font-bold text-white">{color.name}</h3>
            <p className="text-xs text-gray-400">{color.styleKey}</p>
          </div>
        </button>
        <button
          onClick={onToggleFavorite}
          className="ml-2 rounded-lg p-2 text-lg transition-colors hover:bg-gray-800"
          title={isFavorite ? t('colors.unfavorite') : t('colors.favorite')}
        >
          {isFavorite ? '\u2764\ufe0f' : '\ud83e\ude76'}
        </button>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-3">
          <p className="text-sm text-gray-300">{color.shortDesc}</p>
          <p className="text-sm text-gray-400">{color.longDesc}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-gray-800/50 p-2">
              <span className="text-gray-500">{t('colors.bpm')}</span>
              <p className="font-medium text-white">{color.bpm}</p>
            </div>
            <div className="rounded-lg bg-gray-800/50 p-2">
              <span className="text-gray-500">{t('colors.vibe')}</span>
              <p className="font-medium text-white">{color.vibe}</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">{t('colors.artists')}</p>
            <div className="flex flex-wrap gap-1.5">
              {color.artists.map((a) => (
                <span key={a} className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Playlist links */}
          <div className="flex gap-2 pt-1">
            {color.spotify && (
              <a
                href={color.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-green-900/30 py-2 text-center text-xs font-medium text-green-400 transition-colors hover:bg-green-900/50"
              >
                {t('colors.listenOnSpotify')}
              </a>
            )}
            {color.youtube && (
              <a
                href={color.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-red-900/30 py-2 text-center text-xs font-medium text-red-400 transition-colors hover:bg-red-900/50"
              >
                {t('colors.watchOnYouTube')}
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
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('colors.title')}</h1>
        <p className="mt-1 text-sm text-gray-400">{t('colors.subtitle')}</p>
      </header>

      <div className="mx-auto w-full max-w-md space-y-3">
        {favoriteColors.length > 0 && (
          <>
            <h2 className="text-xs font-medium uppercase tracking-wider text-defqon-red">
              {t('colors.favorites')}
            </h2>
            {favoriteColors.map((c) => (
              <ColorCard
                key={c.id}
                color={c}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(c.id)}
              />
            ))}
            <h2 className="pt-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              {t('colors.allColors')}
            </h2>
          </>
        )}
        {otherColors.map((c) => (
          <ColorCard
            key={c.id}
            color={c}
            isFavorite={false}
            onToggleFavorite={() => toggleFavorite(c.id)}
          />
        ))}
      </div>
    </div>
  )
}
