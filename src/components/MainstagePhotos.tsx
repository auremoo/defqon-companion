import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { editionMetas } from '../data/editions'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './Icons'

const MANIFEST_URL = `${import.meta.env.BASE_URL}data/mainstage-photos.json`

export interface Photo {
  src: string
  thumb: string
  width: number
  height: number
  caption?: string
}

interface YearPhotos {
  year: number
  photos: Photo[]
}

interface Manifest {
  generatedAt: string | null
  years: YearPhotos[]
}

/** One photo plus the edition it belongs to — the flat list the lightbox walks through. */
interface Slide extends Photo {
  year: number
}

interface Props {
  /** Anthem label per year, e.g. 2024 -> "Sound Rush — Power of the Tribe". */
  anthemByYear: Map<number, string>
}

export default function MainstagePhotos({ anthemByYear }: Props) {
  const { t } = useTranslation()
  const [years, setYears] = useState<YearPhotos[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [openAt, setOpenAt] = useState<number | null>(null)

  const themeByYear = useMemo(
    () => new Map(editionMetas.map((m) => [m.year, m.theme])),
    []
  )

  useEffect(() => {
    let cancelled = false
    fetch(MANIFEST_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Manifest) => {
        if (cancelled) return
        setYears([...data.years].sort((a, b) => b.year - a.year))
      })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  const slides = useMemo<Slide[]>(
    () => (years ?? []).flatMap((y) => y.photos.map((p) => ({ ...p, year: y.year }))),
    [years]
  )

  const close = useCallback(() => setOpenAt(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) => (i === null ? null : (i + delta + slides.length) % slides.length)),
    [slides.length]
  )

  if (failed) {
    return <p className="py-8 text-center text-xs text-text-muted">{t('mainstage.photosError')}</p>
  }

  if (years === null) {
    return <p className="py-8 text-center text-xs text-text-muted">…</p>
  }

  if (slides.length === 0) {
    return <p className="py-8 text-center text-xs text-text-muted">{t('mainstage.photosEmpty')}</p>
  }

  let index = -1

  return (
    <>
      <div className="space-y-3 pb-2">
        {years.map(({ year, photos }) => {
          const theme = themeByYear.get(year)
          const anthem = anthemByYear.get(year)

          return photos.map((photo) => {
            const slideIndex = ++index
            return (
              <button
                key={photo.src}
                onClick={() => setOpenAt(slideIndex)}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-black text-left"
              >
                <img
                  src={`${import.meta.env.BASE_URL}${photo.thumb}`}
                  alt={`Defqon.1 ${year} mainstage`}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-mono text-xl font-black leading-none text-white">{year}</p>
                  {theme && <p className="mt-1 text-[11px] italic leading-snug text-white/75">{theme}</p>}
                  {anthem && <p className="mt-0.5 line-clamp-1 text-[9px] leading-snug text-white/45">{anthem}</p>}
                  {photo.caption && (
                    <p className="mt-0.5 line-clamp-1 text-[9px] leading-snug text-white/45">{photo.caption}</p>
                  )}
                </div>
              </button>
            )
          })
        })}
      </div>

      <p className="mt-4 pb-2 text-center text-[10px] text-text-muted/50">{t('mainstage.photosCredit')}</p>

      {openAt !== null && (
        <Lightbox
          slides={slides}
          index={openAt}
          theme={themeByYear.get(slides[openAt].year)}
          onClose={close}
          onStep={step}
        />
      )}
    </>
  )
}

interface LightboxProps {
  slides: Slide[]
  index: number
  theme?: string
  onClose: () => void
  onStep: (delta: number) => void
}

function Lightbox({ slides, index, theme, onClose, onStep }: LightboxProps) {
  const { t } = useTranslation()
  const slide = slides[index]
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'ArrowRight') onStep(1)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Defqon.1 ${slide.year} mainstage`}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start === null) return
        const dx = e.changedTouches[0].clientX - start
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between px-4 pt-4" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
        <div className="min-w-0">
          <p className="font-mono text-lg font-black leading-none text-white">{slide.year}</p>
          {theme && <p className="mt-1 truncate text-[11px] italic text-white/60">{theme}</p>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label={t('mainstage.photoClose')}
          className="ml-4 shrink-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <XIcon size={18} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-2 py-4">
        <img
          src={`${import.meta.env.BASE_URL}${slide.src}`}
          alt={`Defqon.1 ${slide.year} mainstage`}
          width={slide.width}
          height={slide.height}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div
        className="flex items-center justify-between gap-4 px-4 pb-6"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onStep(-1) }}
          aria-label={t('mainstage.photoPrev')}
          className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div className="min-w-0 text-center">
          {slide.caption && <p className="truncate text-[11px] text-white/70">{slide.caption}</p>}
          <p className="font-mono text-[10px] text-white/40">{index + 1} / {slides.length}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onStep(1) }}
          aria-label={t('mainstage.photoNext')}
          className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>
    </div>
  )
}
