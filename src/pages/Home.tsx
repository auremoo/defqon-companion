import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { PaletteIcon, BookIcon, ChecklistIcon, CalendarIcon, HistoryIcon, YouTubeIcon, ExternalLinkIcon } from '../components/Icons'
import PageShell from '../components/PageShell'
import { festival, attendanceHistory } from '../data/festival'
import { lineup } from '../data/lineup'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Cached by GitHub Action daily — falls back to live RSS if empty
const CACHED_NEWS_URL = `${import.meta.env.BASE_URL}data/qdance-news.json`
const QDANCE_RSS = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCAEwCfBRlB3jIY9whEfSP5Q')

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

function GoingWidget() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const year = festival.year
  const lsKey = `defqon-going-${year}`
  const [going, setGoing] = useState(() => localStorage.getItem(lsKey) === 'true')

  // Festival is "past" once it ends — for cancelled editions use the cancellation date
  const effectiveEnd = festival.cancelled && festival.cancelledDate
    ? new Date(festival.cancelledDate + 'T23:59:59+02:00')
    : new Date(festival.endDate)
  const isPast = new Date() > effectiveEnd

  useEffect(() => {
    if (!db || !user) return
    getDoc(doc(db, 'user_editions', `${user.uid}_${year}`))
      .then((snap) => {
        const attended = snap.exists() && snap.data().attended_festival === true
        if (attended) {
          localStorage.setItem(lsKey, 'true')
          setGoing(true)
        } else if (snap.exists()) {
          localStorage.removeItem(lsKey)
          setGoing(false)
        }
      })
      .catch(() => {})
  }, [user, year, lsKey])

  const confirm = async () => {
    localStorage.setItem(lsKey, 'true')
    setGoing(true)
    if (db && user) {
      try {
        await setDoc(doc(db, 'user_editions', `${user.uid}_${year}`), {
          user_id: user.uid,
          edition_year: year,
          attended_festival: true,
          notes: null,
          rating: null,
        }, { merge: true })
      } catch {}
    }
  }

  const undo = async () => {
    localStorage.removeItem(lsKey)
    setGoing(false)
    if (db && user) {
      try {
        await setDoc(doc(db, 'user_editions', `${user.uid}_${year}`), {
          attended_festival: false,
        }, { merge: true })
      } catch {}
    }
  }

  if (isPast) {
    const isGathering = !!festival.cancelled
    return going ? (
      <div className="rounded-xl border border-green-800/50 bg-green-900/15 p-4 text-center">
        <p className="text-base font-bold text-green-400">
          {isGathering ? t('home.gatheringConfirmed') : t('home.attendedConfirmed')} 🤘
        </p>
        <p className="mt-0.5 text-xs text-text-muted">{t('home.attendedYear', { year })}</p>
        <button onClick={undo} className="mt-2 text-[10px] text-text-muted underline underline-offset-2 hover:text-text-secondary">
          {t('home.attendedUndo')}
        </button>
      </div>
    ) : (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
        <p className="text-sm font-bold text-text-primary">
          {isGathering ? t('home.gatheringTitle') : t('home.attendedTitle', { year })}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {isGathering ? t('home.gatheringSubtitle') : t('home.attendedSubtitle', { year })}
        </p>
        <button onClick={confirm} className="mt-3 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-accent/80">
          {isGathering ? t('home.gatheringConfirm') : t('home.attendedConfirm')} 🤘
        </button>
      </div>
    )
  }

  return going ? (
    <div className="rounded-xl border border-green-800/50 bg-green-900/15 p-4 text-center">
      <p className="text-base font-bold text-green-400">{t('home.goingConfirmed')} 🤘</p>
      <p className="mt-0.5 text-xs text-text-muted">{t('home.goingDate')}</p>
      <button onClick={undo} className="mt-2 text-[10px] text-text-muted underline underline-offset-2 hover:text-text-secondary">
        {t('home.goingUndo')}
      </button>
    </div>
  ) : (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
      <p className="text-sm font-bold text-text-primary">{t('home.goingTitle')}</p>
      <p className="mt-0.5 text-xs text-text-muted">{t('home.goingSubtitle', { year })}</p>
      <button onClick={confirm} className="mt-3 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-accent/80">
        {t('home.goingConfirm')} 🤘
      </button>
    </div>
  )
}


function NewsWidget() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // Try the GitHub Actions cache first (no CORS proxy needed)
    fetch(CACHED_NEWS_URL)
      .then((r) => r.json())
      .then((data: { videos?: VideoItem[] }) => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos.slice(0, 3))
          return
        }
        throw new Error('empty cache')
      })
      .catch(() =>
        // Fall back to live RSS via CORS proxy
        fetch(QDANCE_RSS)
          .then((r) => r.text())
          .then((xml) => {
            const items = parseRSS(xml)
            if (items.length === 0) throw new Error('empty')
            setVideos(items.slice(0, 3))
          })
      )
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
    <PageShell title={t('home.title')} headerContent={headerContent}>
      <div className="mx-auto w-full max-w-md space-y-6">

        {/* Cancellation notice */}
        {festival.cancelled && (
          <div className="rounded-xl border border-red-800/60 bg-red-900/20 p-4">
            <p className="text-sm font-bold text-red-400">⚠️ {t('home.cancelledTitle')}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">{t('home.cancelledBody')}</p>
            <a
              href="https://www.q-dance.com/l/defqon1-2026-faq"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-red-400 underline underline-offset-2 hover:text-red-300"
            >
              {t('home.cancelledFAQ')} →
            </a>
          </div>
        )}

        {/* Going widget */}
        <GoingWidget />

        {/* Key stats — artists & stages are computed from lineup data */}
        {(() => {
          const artistCount = new Set(lineup.map(s => s.artist)).size
          const stageCount = new Set(lineup.map(s => s.stage)).size
          const stats = [
            { value: String(festival.firstEditionYear), label: t('home.statFirstEdition') },
            { value: String(stageCount), label: t('home.statStages') },
            { value: String(artistCount), label: t('home.statArtists') },
            { value: `${Math.round(festival.attendance.totalEditionRecord / 1000)}K`, label: t('home.statRecordTotal', { year: festival.attendance.totalEditionRecordYear }) },
            { value: `${Math.round(festival.attendance.perDayTypical / 1000)}K`, label: t('home.statAvgDay') },
            { value: `${Math.round(festival.attendance.perDayRecord / 1000)}K`, label: t('home.statRecordDay') },
          ]
          return (
            <div className="grid grid-cols-3 gap-2">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center rounded-xl border border-border bg-surface-card py-3">
                  <span className="text-lg font-black text-accent">{value}</span>
                  <span className="mt-0.5 whitespace-pre-line text-center text-[9px] leading-tight text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Attendance history */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('home.attendanceHistory')}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
            {[...attendanceHistory].reverse().map((entry, i) => (
              <div
                key={entry.year}
                className={`flex items-center gap-3 px-3 py-2 ${i % 2 === 0 ? '' : 'bg-white/3'} ${entry.total ? 'border-l-2 border-accent' : ''}`}
              >
                <span className={`w-9 shrink-0 text-xs font-bold ${entry.cancelled ? 'text-text-muted' : 'text-text-primary'}`}>
                  {entry.year}
                </span>
                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                  {entry.cancelled ? (
                    <span className="text-[10px] text-red-400/80">{t('home.attendanceCancelled')}</span>
                  ) : entry.total ? (
                    <span className="text-xs font-semibold text-accent">
                      {(entry.total / 1000).toFixed(0)} 000 {t('home.attendanceVisitors')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-muted">{t('home.attendanceNA')}</span>
                  )}
                  {entry.note && (
                    <span className="shrink-0 text-[9px] text-text-muted truncate max-w-[140px]">{entry.note}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links — original */}
        <div>
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">
            {t('home.quickLinks')}
          </h2>
          <div className="grid gap-2.5">
            {[
              { to: '/colors', Icon: PaletteIcon, label: t('home.exploreColors') },
              { to: '/timetable', Icon: CalendarIcon, label: t('nav.timetable') },
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

        {/* More features link */}
        <Link
          to="/more"
          className="flex items-center justify-between rounded-xl border border-border bg-surface-card px-4 py-3 transition-all hover:border-border-hover hover:bg-surface-alt"
        >
          <span className="text-sm font-semibold text-text-secondary">{t('home.moreFeatures')}</span>
          <span className="text-text-muted">›</span>
        </Link>

        {/* Q-dance news */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="defqon-heading text-xs tracking-widest text-text-muted">{t('home.qdanceLatest')}</h2>
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
          <h2 className="defqon-heading mb-3 text-xs tracking-widest text-text-muted">{t('home.officialLinks')}</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t('home.officialSite'), url: 'https://www.defqon.com', emoji: '🌐' },
              { label: t('home.buyTickets'), url: 'https://www.q-dance.com/l/defqon1-2026-faq', emoji: '🎟️' },
              { label: t('home.officialLineup'), url: 'https://www.defqon.com/en/lineup', emoji: '🎤' },
              { label: t('home.qdanceApp'), url: 'https://apps.apple.com/us/app/defqon-1/id957425293', emoji: '📱' },
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
