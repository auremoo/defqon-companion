import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { PaletteIcon, BookIcon, ChecklistIcon, CalendarIcon, HistoryIcon, SparklesIcon, GridIcon, CloudSunIcon, BrainIcon, WalletIcon, YouTubeIcon, ExternalLinkIcon } from '../components/Icons'
import PageShell from '../components/PageShell'
import { festival } from '../data/festival'

// Q-dance YouTube channel RSS via CORS proxy
const QDANCE_RSS = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCmT5a_E68D5y7_e8eSBCPtg')

interface VideoItem {
  id: string
  title: string
  published: string
  link: string
  thumbnail?: string
}

function parseRSS(xml: string): VideoItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const entries = Array.from(doc.querySelectorAll('entry'))
  return entries.slice(0, 5).map((entry) => {
    const videoId = entry.querySelector('videoId')?.textContent ?? ''
    return {
      id: videoId,
      title: entry.querySelector('title')?.textContent ?? '',
      published: entry.querySelector('published')?.textContent ?? '',
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : undefined,
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

function NewsWidget() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch(QDANCE_RSS)
      .then((r) => r.text())
      .then((xml) => {
        const items = parseRSS(xml)
        if (items.length === 0) throw new Error('empty')
        setVideos(items)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-card" />
        ))}
      </div>
    )
  }

  if (failed || videos.length === 0) {
    return (
      <a
        href="https://www.youtube.com/@qdance"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-border-hover"
      >
        <div className="flex items-center gap-3">
          <YouTubeIcon size={20} className="text-red-500" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Q-dance on YouTube</p>
            <p className="text-xs text-text-muted">Latest sets, news & aftermovies</p>
          </div>
        </div>
        <ExternalLinkIcon size={14} className="text-text-muted" />
      </a>
    )
  }

  return (
    <div className="space-y-2">
      {videos.map((v) => (
        <a
          key={v.id}
          href={v.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-2 transition-colors hover:border-border-hover"
        >
          {v.thumbnail && (
            <img
              src={v.thumbnail}
              alt=""
              className="h-12 w-20 shrink-0 rounded-lg object-cover bg-surface-alt"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-xs font-medium leading-snug text-text-primary">{v.title}</p>
            <p className="mt-0.5 text-[10px] text-text-muted">{timeAgo(v.published)}</p>
          </div>
          <YouTubeIcon size={14} className="shrink-0 text-red-500" />
        </a>
      ))}
      <a
        href="https://www.youtube.com/@qdance"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-text-muted underline-offset-2 hover:underline"
      >
        More on YouTube <ExternalLinkIcon size={11} />
      </a>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()

  useEffect(() => { document.title = 'Defqon Companion — Your Festival Guide' }, [])

  const headerContent = (
    <>
      <div className="mt-2 text-center">
        <div className="mx-auto mb-4 w-16">
          <img src={import.meta.env.BASE_URL + 'icon-512.png'} alt="Defqon.1" className="w-full rounded-xl" />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-surface-card/80 p-5 text-center backdrop-blur-sm">
        <p className="defqon-heading text-xs tracking-widest text-accent">
          {festival.name} {festival.year}
        </p>
        <p className="mt-2 text-xl font-bold italic text-text-primary">
          &ldquo;{t('home.theme')}&rdquo;
        </p>
        <div className="mx-auto mt-3 accent-line" />
        <p className="mt-3 text-sm text-text-secondary">{t('home.dates')}</p>
        <p className="text-xs text-text-muted">{t('home.location')}</p>
      </div>

      <div className="mt-6">
        <CountdownTimer />
      </div>
    </>
  )

  return (
    <PageShell title={t('home.title')} subtitle={t('home.subtitle')} headerContent={headerContent}>
      <div className="mx-auto w-full max-w-md space-y-6">

        {/* Quick links — original */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('home.quickLinks')}
          </h2>
          <div className="grid gap-2.5">
            {[
              { to: '/colors', Icon: PaletteIcon, label: t('home.exploreColors') },
              { to: '/timetable', Icon: CalendarIcon, label: 'Timetable' },
              { to: '/guide', Icon: BookIcon, label: t('home.readGuide') },
              { to: '/checklist', Icon: ChecklistIcon, label: t('home.prepChecklist') },
              { to: '/my-editions', Icon: HistoryIcon, label: t('home.myEditions') },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-border-hover hover:bg-surface-alt"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <link.Icon size={18} />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide text-text-primary">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* New features */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            New Features
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { to: '/discover', Icon: SparklesIcon, label: 'Discover', desc: 'For You picks', color: '#e040a0' },
              { to: '/quiz', Icon: BrainIcon, label: 'Quiz', desc: 'Test your knowledge', color: '#4a00e0' },
              { to: '/bingo', Icon: GridIcon, label: 'Bingo', desc: 'Festival bingo card', color: '#d4a20a' },
              { to: '/weather', Icon: CloudSunIcon, label: 'Weather', desc: 'Biddinghuizen forecast', color: '#1d3557' },
              { to: '/budget', Icon: WalletIcon, label: 'Budget', desc: 'Track your spending', color: '#16a34a' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-surface-card p-4 transition-all hover:border-border-hover hover:bg-surface-alt"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: link.color + '26', color: link.color }}
                >
                  <link.Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{link.label}</p>
                  <p className="text-[11px] text-text-muted">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Q-dance news */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="defqon-heading text-xs tracking-widest text-text-muted">Q-dance Latest</h2>
            <a
              href="https://www.defqon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary"
            >
              defqon.com <ExternalLinkIcon size={11} />
            </a>
          </div>
          <NewsWidget />
        </div>

        {/* Official links */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">Official Links</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Defqon.1 Website', url: 'https://www.defqon.com', emoji: '🌐' },
              { label: 'Buy Tickets', url: 'https://www.defqon.com/en/tickets', emoji: '🎟️' },
              { label: 'Official Lineup', url: 'https://www.defqon.com/en/lineup', emoji: '🎤' },
              { label: 'Q-dance App', url: 'https://apps.apple.com/app/q-dance/id450147288', emoji: '📱' },
            ].map(({ label, url, emoji }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-border-hover"
              >
                <span className="text-base">{emoji}</span>
                <span className="text-xs font-medium text-text-secondary">{label}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  )
}
