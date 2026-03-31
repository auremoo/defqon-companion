import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { festival } from '../data/festival'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft | 'live' | 'past' {
  const now = new Date().getTime()
  const start = new Date(festival.startDate).getTime()
  const end = new Date(festival.endDate).getTime()

  if (now >= start && now <= end) return 'live'
  if (now > end) return 'past'

  const diff = start - now
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft | 'live' | 'past'>(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (timeLeft === 'live') {
    return (
      <div className="rounded-xl border border-accent bg-accent-glow p-6 text-center">
        <p className="text-2xl font-bold text-accent animate-pulse">
          {t('home.countdown.live')}
        </p>
      </div>
    )
  }

  if (timeLeft === 'past') {
    return (
      <div className="rounded-xl bg-surface-card p-6 text-center">
        <p className="text-xl text-text-secondary">{t('home.countdown.past')}</p>
      </div>
    )
  }

  const blocks = [
    { value: timeLeft.days, label: t('home.countdown.days') },
    { value: timeLeft.hours, label: t('home.countdown.hours') },
    { value: timeLeft.minutes, label: t('home.countdown.minutes') },
    { value: timeLeft.seconds, label: t('home.countdown.seconds') },
  ]

  return (
    <div>
      <h2 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
        {t('home.countdown.title')}
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {blocks.map((b) => (
          <div key={b.label} className="rounded-xl bg-surface-card border border-border p-3 text-center">
            <div className="text-2xl font-bold text-text-primary sm:text-3xl">
              {String(b.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-xs text-text-muted">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
