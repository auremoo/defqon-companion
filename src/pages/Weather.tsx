import { useState, useEffect } from 'react'
import { ExternalLinkIcon } from '../components/Icons'
import PageShell from '../components/PageShell'

// Biddinghuizen, Netherlands coordinates
const LAT = 52.4508
const LON = 5.7181

// WMO weather code → emoji + label
function decodeWeather(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear sky' }
  if (code === 1) return { emoji: '🌤️', label: 'Mainly clear' }
  if (code === 2) return { emoji: '⛅', label: 'Partly cloudy' }
  if (code === 3) return { emoji: '☁️', label: 'Overcast' }
  if (code <= 48) return { emoji: '🌫️', label: 'Foggy' }
  if (code <= 55) return { emoji: '🌦️', label: 'Light drizzle' }
  if (code <= 65) return { emoji: '🌧️', label: 'Rain' }
  if (code <= 75) return { emoji: '❄️', label: 'Snow' }
  if (code <= 82) return { emoji: '🌨️', label: 'Rain showers' }
  if (code <= 99) return { emoji: '⛈️', label: 'Thunderstorm' }
  return { emoji: '🌡️', label: 'Unknown' }
}

interface DayForecast {
  date: string
  label: string
  weatherCode: number
  tempMax: number
  tempMin: number
  rainProbability: number
  windspeed?: number
}

interface CurrentWeather {
  temp: number
  weatherCode: number
  windspeed: number
}

// Historical averages for Biddinghuizen, late June
const historicalNorms: DayForecast[] = [
  { date: '2026-06-25', label: 'Thursday', weatherCode: 2, tempMax: 20, tempMin: 13, rainProbability: 40 },
  { date: '2026-06-26', label: 'Friday', weatherCode: 1, tempMax: 21, tempMin: 13, rainProbability: 35 },
  { date: '2026-06-27', label: 'Saturday', weatherCode: 2, tempMax: 22, tempMin: 14, rainProbability: 42 },
  { date: '2026-06-28', label: 'Sunday', weatherCode: 3, tempMax: 19, tempMin: 12, rainProbability: 50 },
]

const festivalDates = ['2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28']

// Days until forecast is available (Open-Meteo gives 16 days)
function daysUntilForecast(): number {
  const today = new Date()
  const forecastStart = new Date('2026-06-09') // 16 days before Jun 25
  return Math.max(0, Math.ceil((forecastStart.getTime() - today.getTime()) / 86_400_000))
}

function rainAdvice(maxProb: number): string {
  if (maxProb >= 60) return 'High rain chance — pack a rain poncho, definitely.'
  if (maxProb >= 40) return 'Some rain possible — bring a light jacket or poncho just in case.'
  return 'Low rain risk — sunscreen is your priority!'
}

export default function Weather() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [festivalForecast, setFestivalForecast] = useState<DayForecast[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const daysLeft = daysUntilForecast()
  const forecastAvailable = daysLeft === 0

  useEffect(() => {
    document.title = 'Weather — Defqon Companion'
    fetchWeather()
  }, [])

  async function fetchWeather() {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,weathercode,windspeed_10m` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max` +
        `&timezone=Europe%2FAmsterdam` +
        `&forecast_days=16`

      const res = await fetch(url)
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()

      setCurrent({
        temp: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weathercode,
        windspeed: Math.round(data.current.windspeed_10m),
      })

      // Try to extract festival dates from forecast
      const dailyDates: string[] = data.daily.time
      const forecastMap: Record<string, DayForecast> = {}
      dailyDates.forEach((date: string, i: number) => {
        forecastMap[date] = {
          date,
          label: '',
          weatherCode: data.daily.weathercode[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          rainProbability: data.daily.precipitation_probability_max[i] ?? 0,
          windspeed: Math.round(data.daily.windspeed_10m_max?.[i] ?? 0),
        }
      })

      const labels = ['Thursday', 'Friday', 'Saturday', 'Sunday']
      const found = festivalDates.map((d, i) => {
        const fc = forecastMap[d]
        return fc ? { ...fc, label: labels[i] } : null
      }).filter(Boolean) as DayForecast[]

      setFestivalForecast(found.length > 0 ? found : null)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const displayForecast = festivalForecast ?? historicalNorms
  const isRealForecast = festivalForecast !== null && festivalForecast.length > 0
  const maxRain = Math.max(...displayForecast.map((d) => d.rainProbability))

  return (
    <PageShell
      title="Weather"
      subtitle="Biddinghuizen forecast & festival prep"
    >
      <div className="mx-auto w-full max-w-md space-y-4 pb-4">

        {/* Current weather */}
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-muted">Now in Biddinghuizen</p>
          {loading && <p className="text-sm text-text-muted">Loading...</p>}
          {error && !loading && (
            <p className="text-sm text-text-muted">Could not load live data. Check your connection.</p>
          )}
          {current && !loading && (
            <div className="flex items-center gap-4">
              <span className="text-4xl">{decodeWeather(current.weatherCode).emoji}</span>
              <div>
                <p className="text-2xl font-bold text-text-primary">{current.temp}°C</p>
                <p className="text-sm text-text-secondary">{decodeWeather(current.weatherCode).label}</p>
                <p className="text-xs text-text-muted">Wind {current.windspeed} km/h</p>
              </div>
            </div>
          )}
        </div>

        {/* Festival forecast banner */}
        {!isRealForecast && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
            <p className="text-xs font-medium text-accent">
              {forecastAvailable
                ? 'Festival forecast should be available — check again soon.'
                : `Festival forecast unlocks in ~${daysLeft} days (around June 9)`}
            </p>
            <p className="mt-0.5 text-[11px] text-text-muted">
              Showing historical averages for late June in Biddinghuizen.
            </p>
          </div>
        )}
        {isRealForecast && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
            <p className="text-xs font-medium text-green-400">Live forecast — updated daily</p>
          </div>
        )}

        {/* Festival days forecast */}
        <div>
          <h2 className="defqon-heading mb-2 text-xs tracking-widest text-text-muted">
            {isRealForecast ? 'Festival Forecast (June 25–28)' : 'Historical Averages (June 25–28)'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {displayForecast.map((day) => {
              const w = decodeWeather(day.weatherCode)
              return (
                <div key={day.date} className="rounded-xl border border-border bg-surface-card p-3">
                  <p className="text-xs font-semibold text-text-primary">{day.label}</p>
                  <p className="text-[11px] text-text-muted">Jun {day.date.slice(8)}</p>
                  <div className="my-2 text-2xl">{w.emoji}</div>
                  <p className="text-xs font-medium text-text-secondary">{w.label}</p>
                  <p className="mt-1 text-sm font-bold text-text-primary">
                    {day.tempMax}° / {day.tempMin}°C
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-alt">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${day.rainProbability}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted">{day.rainProbability}%</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-text-muted">rain chance</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Advice */}
        <div className="rounded-xl border border-border bg-surface-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">Pack advice</p>
          <p className="text-sm text-text-secondary">{rainAdvice(maxRain)}</p>
          <ul className="mt-3 space-y-1.5">
            {maxRain >= 40 && (
              <li className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="mt-0.5 text-base">🧥</span>
                Rain poncho / waterproof jacket — don't rely on a tent dash
              </li>
            )}
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="mt-0.5 text-base">🕶️</span>
              Sunscreen even on cloudy days — UV reflects off crowds
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="mt-0.5 text-base">👟</span>
              Comfortable waterproof shoes — field terrain after rain
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="mt-0.5 text-base">🌡️</span>
              Evenings drop to ~12–14°C — bring a light layer for the endshow
            </li>
          </ul>
        </div>

        {/* Official weather links */}
        <div>
          <h2 className="defqon-heading mb-2 text-xs tracking-widest text-text-muted">External Forecasts</h2>
          <div className="space-y-2">
            {[
              { label: 'Buienradar (NL)', url: 'https://www.buienradar.nl/weer/biddinghuizen/nl/2756521', desc: 'Dutch rain radar — best for hourly precision' },
              { label: 'Weather.com', url: 'https://weather.com/weather/tenday/l/Biddinghuizen+Flevoland+Netherlands', desc: '10-day forecast for Biddinghuizen' },
              { label: 'Windy.com', url: 'https://www.windy.com/52.450/5.718?52.411,5.708,10', desc: 'Wind & rain map — great for festival planning' },
            ].map(({ label, url, desc }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-3 transition-colors hover:border-border-hover"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
                <ExternalLinkIcon size={15} className="shrink-0 text-text-muted" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
