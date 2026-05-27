import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { YouTubeIcon, ExternalLinkIcon } from '../components/Icons'
import PageShell from '../components/PageShell'

const CACHED_NEWS_URL = `${import.meta.env.BASE_URL}data/qdance-news.json`
const QDANCE_RSS = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCmT5a_E68D5y7_e8eSBCPtg')

interface VideoItem {
  id: string
  title: string
  published: string
  link: string
  thumbnail: string | null
}

type Filter = 'all' | 'defqon' | 'sets' | 'aftermovie'

function categorize(title: string): Filter {
  const t = title.toLowerCase()
  if (t.includes('defqon')) return 'defqon'
  if (t.includes('aftermovie') || t.includes('recap') || t.includes('after movie')) return 'aftermovie'
  if (t.includes(' set') || t.includes('live at') || t.includes('liveset') || t.includes('mainstage')) return 'sets'
  return 'all'
}

function parseRSS(xml: string): VideoItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  return Array.from(doc.querySelectorAll('entry')).map((entry) => {
    const videoId = entry.querySelector('videoId')?.textContent ?? ''
    return {
      id: videoId,
      title: entry.querySelector('title')?.textContent ?? '',
      published: entry.querySelector('published')?.textContent ?? '',
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null,
    }
  }).filter((v) => v.id)
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function News() {
  const { t } = useTranslation()
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    document.title = 'News — Defqon Companion'

    fetch(CACHED_NEWS_URL)
      .then((r) => r.json())
      .then((data: { videos?: VideoItem[] }) => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos)
          return
        }
        throw new Error('empty cache')
      })
      .catch(() =>
        fetch(QDANCE_RSS)
          .then((r) => r.text())
          .then((xml) => {
            const items = parseRSS(xml)
            if (items.length === 0) throw new Error('empty')
            setVideos(items)
          })
      )
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('news.filterAll') },
    { key: 'defqon', label: 'Defqon' },
    { key: 'sets', label: t('news.filterSets') },
    { key: 'aftermovie', label: t('news.filterAfterMovies') },
  ]

  const filtered = filter === 'all'
    ? videos
    : videos.filter((v) => categorize(v.title) === filter)

  return (
    <PageShell title={t('news.title')} subtitle={t('news.subtitle')}>
      {/* Filter pills */}
      {!loading && !failed && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map(({ key, label }) => {
            const count = key === 'all' ? videos.length : videos.filter((v) => categorize(v.title) === key).length
            if (count === 0 && key !== 'all') return null
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filter === key
                    ? 'bg-accent text-text-primary'
                    : 'bg-surface-card text-text-muted hover:text-text-primary'
                }`}
              >
                {label} {count > 0 && <span className="opacity-60">({count})</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border bg-surface-card p-3">
              <div className="h-16 w-28 shrink-0 animate-pulse rounded-lg bg-surface-alt" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 animate-pulse rounded bg-surface-alt" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-surface-alt" />
                <div className="h-2 w-1/4 animate-pulse rounded bg-surface-alt" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Failed */}
      {!loading && failed && (
        <a
          href="https://www.youtube.com/@qdance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-hover"
        >
          <div className="flex items-center gap-3">
            <YouTubeIcon size={22} className="text-red-500" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Q-dance on YouTube</p>
              <p className="text-xs text-text-muted">Latest sets, news & aftermovies</p>
            </div>
          </div>
          <ExternalLinkIcon size={14} className="text-text-muted" />
        </a>
      )}

      {/* Videos */}
      {!loading && !failed && (
        <>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-muted">{t('news.noResults')}</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((v) => (
                <a
                  key={v.id}
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-border-hover"
                >
                  {v.thumbnail ? (
                    <img
                      src={v.thumbnail}
                      alt=""
                      className="h-16 w-28 shrink-0 rounded-lg object-cover bg-surface-alt"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg bg-surface-alt">
                      <YouTubeIcon size={20} className="text-red-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium leading-snug text-text-primary">{v.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <YouTubeIcon size={11} className="shrink-0 text-red-500" />
                      <span className="text-[10px] text-text-muted">{timeAgo(v.published)}</span>
                      {categorize(v.title) !== 'all' && (
                        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                          {categorize(v.title)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <a
            href="https://www.youtube.com/@qdance"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 py-2 text-xs text-text-muted underline-offset-2 hover:underline"
          >
            {t('news.moreOnYouTube')} <ExternalLinkIcon size={11} />
          </a>
        </>
      )}
    </PageShell>
  )
}
