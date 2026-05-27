import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { SpotifyIcon, ExternalLinkIcon } from '../components/Icons'
import { artists } from '../data/artists'

const CHARTS_URL   = `${import.meta.env.BASE_URL}data/hardstyle-charts.json`
const RELEASES_URL = `${import.meta.env.BASE_URL}data/hardstyle-releases.json`

interface ChartTrack {
  position: number
  id: string
  title: string
  artist: string
  mix: string
  label: string
  image: string
  link: string
  lastWeek: string
  peak: string
  weeksOnChart: string
}

interface Release {
  id: string
  title: string
  artist: string
  mix: string
  image: string
  link: string
}

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

function ChartsView() {
  const { t } = useTranslation()
  const [tracks, setTracks] = useState<ChartTrack[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(CHARTS_URL).then(r => r.json()).catch(() => ({ tracks: [] })),
      fetch(RELEASES_URL).then(r => r.json()).catch(() => ({ releases: [] })),
    ]).then(([c, r]) => {
      setTracks(c.tracks ?? [])
      setReleases(r.releases ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-border bg-surface-card p-3">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-surface-alt" />
            <div className="flex-1 space-y-1.5 py-1">
              <div className="h-3 animate-pulse rounded bg-surface-alt" />
              <div className="h-2.5 w-2/3 animate-pulse rounded bg-surface-alt" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top 100 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="defqon-heading text-xs tracking-widest text-text-muted">{t('music.top100')}</h2>
          <a href="https://hardstyle.com/en/charts" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary">
            hardstyle.com <ExternalLinkIcon size={10} />
          </a>
        </div>
        <div className="space-y-1.5">
          {tracks.slice(0, 50).map((track) => (
            <a key={track.id} href={track.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-2.5 transition-colors hover:border-border-hover">
              <span className="w-6 shrink-0 text-center text-xs font-bold text-text-muted">
                {track.position}
              </span>
              <img src={track.image} alt="" loading="lazy"
                className="h-10 w-10 shrink-0 rounded-md object-cover bg-surface-alt" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-text-primary">{track.artist}</p>
                <p className="truncate text-[11px] text-text-muted">{track.title}</p>
              </div>
              {track.peak !== '-' && (
                <div className="shrink-0 text-right">
                  <p className="text-[9px] text-text-muted">Peak</p>
                  <p className="text-xs font-bold text-accent">#{track.peak}</p>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Latest Releases */}
      {releases.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="defqon-heading text-xs tracking-widest text-text-muted">{t('music.latestReleases')}</h2>
            <a href="https://hardstyle.com/en/music" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary">
              <ExternalLinkIcon size={10} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {releases.slice(0, 10).map((r) => (
              <a key={r.id} href={r.link} target="_blank" rel="noopener noreferrer"
                className="flex flex-col rounded-xl border border-border bg-surface-card overflow-hidden transition-colors hover:border-border-hover">
                <img src={r.image} alt="" loading="lazy"
                  className="aspect-square w-full object-cover bg-surface-alt" />
                <div className="p-2">
                  <p className="truncate text-[11px] font-semibold text-text-primary">{r.title}</p>
                  <p className="truncate text-[10px] text-text-muted">{r.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
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
                <p className="text-sm leading-relaxed text-text-secondary">{t(`music.artists.${artist.id}.bio`)}</p>
                <div className="rounded-lg bg-surface-alt p-3">
                  <p className="text-xs text-text-secondary">{t(`music.artists.${artist.id}.fact`)}</p>
                </div>

                {artist.hasGhostStories && (
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <h4 className="defqon-heading mb-1 text-xs text-accent">{t('music.ghostStories')}</h4>
                    <p className="text-xs leading-relaxed text-text-secondary">{t(`music.artists.${artist.id}.ghostStories`)}</p>
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
  const [tab, setTab] = useState<'playlists' | 'charts' | 'artists'>('charts')

  useEffect(() => { document.title = 'Music \u2014 Defqon Companion' }, [])

  const tabs = [
    { key: 'charts' as const, label: t('music.chartsTab') },
    { key: 'playlists' as const, label: t('music.playlistsTab') },
    { key: 'artists' as const, label: t('music.artistsTab') },
  ]

  const headerContent = (
    <div className="mt-3 flex rounded-lg bg-black/30 p-0.5">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            tab === key ? 'bg-accent text-text-primary' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <PageShell title={t('music.title')} subtitle={t('music.subtitle')} headerContent={headerContent}>
      <div className="mx-auto w-full max-w-md">
        {tab === 'charts' && <ChartsView />}
        {tab === 'playlists' && <PlaylistsView />}
        {tab === 'artists' && <ArtistsView />}
      </div>
    </PageShell>
  )
}
