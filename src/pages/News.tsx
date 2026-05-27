import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { YouTubeIcon, ExternalLinkIcon, NewspaperIcon } from '../components/Icons'
import PageShell from '../components/PageShell'

const CACHED_VIDEOS_URL = `${import.meta.env.BASE_URL}data/qdance-news.json`
const CACHED_ARTICLES_URL = `${import.meta.env.BASE_URL}data/hardstyle-news.json`
const QDANCE_RSS = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCAEwCfBRlB3jIY9whEfSP5Q')

interface VideoItem {
  type: 'video'
  id: string
  title: string
  published: string
  link: string
  thumbnail: string | null
}

interface ArticleItem {
  type: 'article'
  title: string
  link: string
  image: string | null
  date: string | null
  category: string
}

type FeedItem = VideoItem | ArticleItem
type Filter = 'all' | 'defqon' | 'sets' | 'aftermovie'

function categorize(title: string, category?: string): Filter {
  const t = title.toLowerCase()
  const c = (category ?? '').toLowerCase()
  if (t.includes('defqon') || c.includes('defqon')) return 'defqon'
  if (t.includes('aftermovie') || t.includes('recap') || t.includes('after movie')) return 'aftermovie'
  if (t.includes(' set') || t.includes('liveset') || t.includes('live at') || t.includes('mainstage')) return 'sets'
  return 'all'
}

function itemDate(item: FeedItem): number {
  const d = item.type === 'video' ? item.published : item.date
  return d ? new Date(d).getTime() : 0
}

function timeAgo(isoDate: string | null): string {
  if (!isoDate) return ''
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function parseRSS(xml: string): VideoItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  return Array.from(doc.querySelectorAll('entry')).map((entry) => {
    const videoId = entry.querySelector('videoId')?.textContent ?? ''
    return {
      type: 'video' as const,
      id: videoId,
      title: entry.querySelector('title')?.textContent ?? '',
      published: entry.querySelector('published')?.textContent ?? '',
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null,
    }
  }).filter((v) => v.id)
}

export default function News() {
  const { t } = useTranslation()
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    document.title = 'News — Defqon Companion'

    const loadVideos = fetch(CACHED_VIDEOS_URL)
      .then((r) => r.json())
      .then((data: { videos?: Omit<VideoItem, 'type'>[] }) => {
        if (data.videos && data.videos.length > 0) {
          return data.videos.map((v) => ({ ...v, type: 'video' as const }))
        }
        throw new Error('empty cache')
      })
      .catch(() =>
        fetch(QDANCE_RSS).then((r) => r.text()).then(parseRSS)
      )
      .catch((): VideoItem[] => [])

    const loadArticles = fetch(CACHED_ARTICLES_URL)
      .then((r) => r.json())
      .then((data: { articles?: Omit<ArticleItem, 'type'>[] }) =>
        (data.articles ?? []).map((a) => ({ ...a, type: 'article' as const }))
      )
      .catch((): ArticleItem[] => [])

    Promise.all([loadVideos, loadArticles]).then(([videos, articles]) => {
      const merged: FeedItem[] = [...videos, ...articles].sort((a, b) => itemDate(b) - itemDate(a))
      setFeed(merged)
      setLoading(false)
    })
  }, [])

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('news.filterAll') },
    { key: 'defqon', label: 'Defqon' },
    { key: 'sets', label: t('news.filterSets') },
    { key: 'aftermovie', label: t('news.filterAfterMovies') },
  ]

  const getCategory = (item: FeedItem) =>
    categorize(item.title, item.type === 'article' ? item.category : undefined)

  const filtered = filter === 'all' ? feed : feed.filter((item) => getCategory(item) === filter)

  return (
    <PageShell title={t('news.title')} subtitle={t('news.subtitle')}>
      {/* Filter pills */}
      {!loading && feed.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map(({ key, label }) => {
            const count = key === 'all' ? feed.length : feed.filter((item) => getCategory(item) === key).length
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

      {/* Skeleton */}
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

      {/* Feed */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-muted">{t('news.noResults')}</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((item, i) => {
                const isVideo = item.type === 'video'
                const thumb = isVideo ? item.thumbnail : item.image
                const date = isVideo ? item.published : item.date
                const tag = getCategory(item)

                return (
                  <a
                    key={isVideo ? item.id : item.link + i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-border-hover"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="h-16 w-28 shrink-0 rounded-lg object-cover bg-surface-alt"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg bg-surface-alt">
                        {isVideo
                          ? <YouTubeIcon size={20} className="text-red-500" />
                          : <NewspaperIcon size={20} className="text-text-muted" />
                        }
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium leading-snug text-text-primary">{item.title}</p>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {isVideo
                          ? <YouTubeIcon size={11} className="shrink-0 text-red-500" />
                          : <NewspaperIcon size={11} className="shrink-0 text-text-muted" />
                        }
                        <span className="text-[10px] text-text-muted">
                          {isVideo ? 'Q-dance' : 'hardstyle.com'}
                        </span>
                        {date && (
                          <span className="text-[10px] text-text-muted">{timeAgo(date)}</span>
                        )}
                        {tag !== 'all' && (
                          <span className="rounded-full bg-surface-alt px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                            {tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}

          <div className="mt-4 flex flex-col items-center gap-2">
            <a
              href="https://www.youtube.com/@qdance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-1 text-xs text-text-muted underline-offset-2 hover:underline"
            >
              {t('news.moreOnYouTube')} <ExternalLinkIcon size={11} />
            </a>
            <a
              href="https://hardstyle.com/en/news"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-1 text-xs text-text-muted underline-offset-2 hover:underline"
            >
              {t('news.moreOnHardstyle')} <ExternalLinkIcon size={11} />
            </a>
          </div>
        </>
      )}
    </PageShell>
  )
}
