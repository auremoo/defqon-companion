import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { SpotifyIcon } from '../components/Icons'
import { artists } from '../data/artists'

const PERSONAL_PLAYLIST = '5tkWlvbjzTTCMKVrcaEHpQ'

const qdancePlaylists = [
  { id: '7J8tAF2T73Fp11duGEyiVP', nameKey: 'music.defqon2026' },
  { id: '1T6A1HStOvZlTtbizIQWtA', nameKey: 'music.powerHour' },
  { id: '2LVvgP7VJN5xAkmPdl5J4q', nameKey: 'music.hardstyle2026' },
  { id: '1WUINwPFeTJwTnUVE3TOzl', nameKey: 'music.rawHardstyle' },
  { id: '54J4amTEwP9iHXLtGqv1Vj', nameKey: 'music.classics' },
  { id: '4e1fOtfsuPlPay96YOonmF', nameKey: 'music.hardcore2026' },
  { id: '2PKz1xHbTIfohZ0UhK0lJV', nameKey: 'music.warriorWorkout' },
  { id: '2jJg7rVmh4JcZwbWaf9hjX', nameKey: 'music.top40' },
  { id: '1pRbBtxQySnKaYh9kA5bwb', nameKey: 'music.qlimax' },
]

function PlaylistsView() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
          {t('music.getHyped')}
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${PERSONAL_PLAYLIST}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            style={{ border: 'none' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
          />
        </div>
      </div>

      <div>
        <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
          {t('music.qdancePlaylists')}
        </h2>
        <div className="space-y-2">
          {qdancePlaylists.map((pl) => (
            <a
              key={pl.id}
              href={`https://open.spotify.com/playlist/${pl.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-[#1DB954]/30 hover:bg-surface-alt"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]/10">
                <SpotifyIcon size={16} className="text-[#1DB954]" />
              </div>
              <span className="flex-1 text-sm font-medium text-text-primary">{t(pl.nameKey)}</span>
              <span className="text-xs text-text-muted">&rarr;</span>
            </a>
          ))}
        </div>
      </div>

      <a
        href="https://open.spotify.com/user/q_dance_"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-[#1DB954]/20 bg-[#1DB954]/5 py-3 text-xs font-semibold uppercase tracking-wider text-[#1DB954] transition-colors hover:bg-[#1DB954]/10"
      >
        <SpotifyIcon size={14} />
        {t('music.allQdancePlaylists')}
      </a>
    </div>
  )
}

function ArtistsView() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {artists.map((artist) => {
        const isOpen = expanded === artist.id
        return (
          <div key={artist.id} className="overflow-hidden rounded-xl border border-border bg-surface-card">
            <button
              onClick={() => setExpanded(isOpen ? null : artist.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-text-primary">{artist.name}</h3>
                <p className="text-xs text-text-muted">{artist.subgenre} &middot; {artist.country}</p>
              </div>
              <span className={`text-lg transition-transform duration-200 ${isOpen ? 'text-accent' : 'text-text-muted'}`}>
                {isOpen ? '\u25be' : '\u25b8'}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                {artist.realName && (
                  <p className="text-xs text-text-muted">{artist.realName}</p>
                )}
                <p className="text-sm leading-relaxed text-text-secondary">{artist.bio}</p>
                <div className="rounded-lg bg-surface-alt p-3">
                  <p className="text-xs text-text-secondary">{artist.fact}</p>
                </div>

                {artist.ghostStories && (
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <h4 className="defqon-heading mb-1 text-xs text-accent">{t('music.ghostStories')}</h4>
                    <p className="text-xs leading-relaxed text-text-secondary">{artist.ghostStories}</p>
                  </div>
                )}

                {artist.spotify && (
                  <a
                    href={artist.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#1DB954]/10 px-3 py-2 text-xs font-medium text-[#1DB954] transition-colors hover:bg-[#1DB954]/20"
                  >
                    <SpotifyIcon size={14} />
                    {t('music.listenOnSpotify')}
                  </a>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Music() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'playlists' | 'artists'>('playlists')

  useEffect(() => { document.title = 'Music \u2014 Defqon Companion' }, [])

  const headerContent = (
    <div className="mt-3 flex rounded-lg bg-black/30 p-0.5">
      <button
        onClick={() => setTab('playlists')}
        className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          tab === 'playlists' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {t('music.playlistsTab')}
      </button>
      <button
        onClick={() => setTab('artists')}
        className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          tab === 'artists' ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
        }`}
      >
        {t('music.artistsTab')} ({artists.length})
      </button>
    </div>
  )

  return (
    <PageShell title={t('music.title')} subtitle={t('music.subtitle')} headerContent={headerContent}>
      <div className="mx-auto w-full max-w-md">
        {tab === 'playlists' ? <PlaylistsView /> : <ArtistsView />}
      </div>
    </PageShell>
  )
}
