import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell'
import { editionMetas } from '../data/editions'

// Verified against Q-dance official YouTube channel, July 2026
const AFTERMOVIES: Record<number, string> = {
  2025: 'XG1JsGvgj9U',
  2024: 'kDlTSynqMTs',
  2023: 'ajTMOR7Ke_I',
  2022: 'fH_F_OMJulg',
  2019: 'mfwgLE1sh34',
  2017: 'deczX5l5xio',
  2016: 'tarY3Z0yTZw',
  2015: 'uHL2JPi3ZUE',
  2014: 'mwjMQTs2HfQ',
  2013: 'spsDPnmBmdY',
  2011: 'naZRtXbRi8E',
  2010: 'wI_A76sSeAc',
  2009: 'aUMk4aOzVA4',
  2008: 'lp5Fo-u9pc8',
  2007: 'Qr3B0G_0nAM',
}

const CANCELLED: Record<number, string> = {
  2026: 'Code Rouge',
  2021: 'COVID-19',
  2020: 'COVID-19',
}

const ALL_YEARS = Array.from({ length: 24 }, (_, i) => 2026 - i)

export default function Mainstage() {
  const { t } = useTranslation()
  const themeByYear = new Map(editionMetas.map((m) => [m.year, m.theme]))

  useEffect(() => { document.title = t('mainstage.title') + ' — Defqon Companion' }, [t])

  return (
    <PageShell title={t('mainstage.title')} subtitle={t('mainstage.subtitle')}>
      <div className="mx-auto w-full max-w-md">
        <div className="grid grid-cols-2 gap-2">
          {ALL_YEARS.map((year) => {
            const videoId = AFTERMOVIES[year]
            const theme = themeByYear.get(year)
            const cancelNote = CANCELLED[year]

            if (videoId) {
              return (
                <a
                  key={year}
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-border bg-black"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt={`Defqon.1 ${year} aftermovie`}
                    className="aspect-video w-full object-cover opacity-85 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 backdrop-blur-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  {/* Year + theme */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-2">
                    <p className="font-mono text-sm font-black leading-none text-white">{year}</p>
                    {theme && (
                      <p className="mt-0.5 line-clamp-1 text-[9px] italic leading-snug text-white/65">{theme}</p>
                    )}
                  </div>
                </a>
              )
            }

            // No video — cancelled or no aftermovie on YouTube
            return (
              <div
                key={year}
                className={`relative flex aspect-video items-center justify-center rounded-xl border p-3 text-center ${
                  cancelNote ? 'border-red-900/30 bg-red-950/10' : 'border-border bg-surface-card'
                }`}
              >
                <div>
                  <p className={`font-mono text-sm font-black ${cancelNote ? 'text-red-400/50' : 'text-text-muted'}`}>
                    {year}
                  </p>
                  {theme && (
                    <p className="mt-0.5 line-clamp-2 text-[8px] italic leading-snug text-text-muted/60">{theme}</p>
                  )}
                  <p className={`mt-1.5 text-[8px] leading-tight ${cancelNote ? 'text-red-400/40' : 'text-text-muted/40'}`}>
                    {cancelNote ?? t('mainstage.noVideo')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-4 pb-2 text-center text-[10px] text-text-muted/50">
          {t('mainstage.credit')}
        </p>
      </div>
    </PageShell>
  )
}
