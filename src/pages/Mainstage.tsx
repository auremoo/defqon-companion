import { useEffect, useState } from 'react'
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
  2021: 'At-home',
  2020: 'COVID-19',
}

const ALL_YEARS = Array.from({ length: 24 }, (_, i) => 2026 - i)

const SPOTIFY_PLAYLIST = '5QcgH0Zzv7i8ZrnNNvVU9V'

interface Anthem { year: number; artist: string; title: string; note?: string }

const ANTHEMS_NL: Anthem[] = [
  { year: 2025, artist: 'Vertile',                                    title: 'Where Legends Rise' },
  { year: 2024, artist: 'Sound Rush',                                 title: 'Power of the Tribe' },
  { year: 2023, artist: 'Sub Zero Project',                           title: 'Path of the Warrior' },
  { year: 2022, artist: 'D-Block & S-te-Fan',                         title: 'Primal Energy' },
  { year: 2021, artist: 'D-Block & S-te-Fan',                         title: 'Primal Energy', note: 'At-home' },
  { year: 2019, artist: 'Phuture Noize, KELTEK, Sefa',                title: 'One Tribe' },
  { year: 2018, artist: 'Project One',                                 title: 'Maximum Force' },
  { year: 2017, artist: 'Frequencerz',                                 title: 'Victory Forever' },
  { year: 2016, artist: 'Bass Modulators',                             title: 'Dragonblood' },
  { year: 2015, artist: 'Ran-D',                                       title: 'No Guts No Glory' },
  { year: 2014, artist: 'Coone',                                       title: 'Survival of the Fittest' },
  { year: 2013, artist: 'Frontliner',                                  title: 'Weekend Warriors' },
  { year: 2012, artist: 'Headhunterz, Wildstylez, Noisecontrollers',  title: 'World of Madness' },
  { year: 2011, artist: 'Noisecontrollers',                            title: 'Unite' },
  { year: 2010, artist: 'Wildstylez',                                  title: 'No Time To Waste' },
  { year: 2009, artist: 'Headhunterz',                                 title: 'Scrap Attack' },
  { year: 2008, artist: 'Luna & Deepack',                              title: 'Biological Insanity' },
  { year: 2007, artist: 'Brennan Heart',                               title: 'Get Wasted' },
  { year: 2006, artist: 'Showtek',                                     title: 'The Colour of the Harder Styles' },
  { year: 2005, artist: 'The Prophet',                                 title: 'Emergency Call' },
  { year: 2004, artist: 'Tuneboy',                                     title: 'Demolition' },
  { year: 2003, artist: 'DHHD',                                        title: '30 Minutes' },
]

const ANTHEMS_AU: Anthem[] = [
  { year: 2018, artist: 'Coone',                                title: 'Dedicated to the Core' },
  { year: 2017, artist: 'D-Block & S-te-Fan',                   title: 'Eye of The Storm' },
  { year: 2016, artist: 'Audiofreq, Code Black, Toneshifterz', title: 'Dragonblood' },
  { year: 2015, artist: 'Frontliner & Dillytek feat. 360',      title: 'No Guts No Glory' },
  { year: 2014, artist: 'Code Black',                           title: 'Unleash The Beast' },
  { year: 2013, artist: 'Brennan Heart',                        title: 'Scrap The System' },
  { year: 2012, artist: 'Wildstylez',                           title: 'True Rebel Freedom' },
  { year: 2011, artist: 'Toneshifterz',                         title: 'Psychedelic Wasteland' },
  { year: 2010, artist: 'Headhunterz',                          title: 'Save Your Scrap for Victory' },
  { year: 2009, artist: 'Zany',                                 title: 'Maximum Force' },
]

const ANTHEMS_CL: Anthem[] = [
  { year: 2016, artist: 'Frontliner', title: 'Dragonblood' },
  { year: 2015, artist: 'Wildstylez', title: 'Unleash The Beast' },
]

function AnthemRow({ a }: { a: Anthem }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5 border-b border-border/40 last:border-0">
      <span className="w-9 shrink-0 font-mono text-[10px] text-text-muted">{a.year}</span>
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-text-primary">{a.title}</span>
        <span className="mx-1 text-text-muted/40 text-[10px]">·</span>
        <span className="text-[10px] text-text-muted">{a.artist}</span>
      </div>
      {a.note && (
        <span className="shrink-0 rounded px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-text-muted bg-surface-alt">
          {a.note}
        </span>
      )}
    </div>
  )
}

type Tab = 'aftermovies' | 'anthems'

export default function Mainstage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('aftermovies')
  const themeByYear = new Map(editionMetas.map((m) => [m.year, m.theme]))

  useEffect(() => { document.title = t('mainstage.title') + ' — Defqon Companion' }, [t])

  return (
    <PageShell title={t('mainstage.title')} subtitle={tab === 'aftermovies' ? t('mainstage.subtitleAfter') : t('mainstage.subtitleAnthems')}>
      <div className="mx-auto w-full max-w-md">

        {/* Tab bar */}
        <div className="mb-4 flex rounded-xl border border-border bg-surface-card overflow-hidden">
          {(['aftermovies', 'anthems'] as Tab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === t_ ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {t_ === 'aftermovies' ? t('mainstage.tabAfter') : t('mainstage.tabAnthems')}
            </button>
          ))}
        </div>

        {/* ── Aftermovies grid ─────────────────────────────── */}
        {tab === 'aftermovies' && (
          <>
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
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 backdrop-blur-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-2">
                        <p className="font-mono text-sm font-black leading-none text-white">{year}</p>
                        {theme && <p className="mt-0.5 line-clamp-1 text-[9px] italic leading-snug text-white/65">{theme}</p>}
                      </div>
                    </a>
                  )
                }

                return (
                  <div
                    key={year}
                    className={`relative flex aspect-video items-center justify-center rounded-xl border p-3 text-center ${
                      cancelNote ? 'border-red-900/30 bg-red-950/10' : 'border-border bg-surface-card'
                    }`}
                  >
                    <div>
                      <p className={`font-mono text-sm font-black ${cancelNote ? 'text-red-400/50' : 'text-text-muted'}`}>{year}</p>
                      {theme && <p className="mt-0.5 line-clamp-2 text-[8px] italic leading-snug text-text-muted/60">{theme}</p>}
                      <p className={`mt-1.5 text-[8px] leading-tight ${cancelNote ? 'text-red-400/40' : 'text-text-muted/40'}`}>
                        {cancelNote ?? t('mainstage.noVideo')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 pb-2 text-center text-[10px] text-text-muted/50">{t('mainstage.credit')}</p>
          </>
        )}

        {/* ── Anthems ──────────────────────────────────────── */}
        {tab === 'anthems' && (
          <div className="space-y-4 pb-4">

            {/* Spotify playlist embed */}
            <div className="overflow-hidden rounded-xl">
              <iframe
                src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Defqon.1 Anthems playlist"
                className="rounded-xl"
              />
            </div>

            {/* NL */}
            <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-surface-alt px-4 py-2">
                <span className="text-base">🇳🇱</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Pays-Bas</p>
              </div>
              <div className="px-4 py-1">
                {ANTHEMS_NL.map((a) => <AnthemRow key={`${a.year}-${a.note}`} a={a} />)}
              </div>
            </div>

            {/* AU */}
            <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-surface-alt px-4 py-2">
                <span className="text-base">🇦🇺</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Australie</p>
              </div>
              <div className="px-4 py-1">
                {ANTHEMS_AU.map((a) => <AnthemRow key={a.year} a={a} />)}
              </div>
            </div>

            {/* CL */}
            <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-surface-alt px-4 py-2">
                <span className="text-base">🇨🇱</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Chili</p>
              </div>
              <div className="px-4 py-1">
                {ANTHEMS_CL.map((a) => <AnthemRow key={a.year} a={a} />)}
              </div>
            </div>

          </div>
        )}
      </div>
    </PageShell>
  )
}
