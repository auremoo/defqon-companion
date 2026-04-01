import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { SpotifyIcon } from '../components/Icons'

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

function PlaylistLink({ id, name }: { id: string; name: string }) {
  return (
    <a
      href={`https://open.spotify.com/playlist/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-[#1DB954]/30 hover:bg-surface-alt"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]/10">
        <SpotifyIcon size={16} className="text-[#1DB954]" />
      </div>
      <span className="flex-1 text-sm font-medium text-text-primary">{name}</span>
      <span className="text-xs text-text-muted">&rarr;</span>
    </a>
  )
}

export default function Music() {
  const { t } = useTranslation()

  useEffect(() => { document.title = 'Music — Defqon Companion' }, [])

  return (
    <PageShell title={t('music.title')} subtitle={t('music.subtitle')}>
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Personal playlist embed */}
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

        {/* Q-dance playlists */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('music.qdancePlaylists')}
          </h2>
          <div className="space-y-2">
            {qdancePlaylists.map((pl) => (
              <PlaylistLink key={pl.id} id={pl.id} name={t(pl.nameKey)} />
            ))}
          </div>
        </div>

        {/* Q-dance profile link */}
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
    </PageShell>
  )
}
