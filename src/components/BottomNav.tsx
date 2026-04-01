import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeIcon, PaletteIcon, CalendarIcon, BookIcon, MusicIcon } from './Icons'

const navItems = [
  { to: '/', Icon: HomeIcon, labelKey: 'nav.home' },
  { to: '/colors', Icon: PaletteIcon, labelKey: 'nav.colors' },
  { to: '/timetable', Icon: CalendarIcon, labelKey: 'nav.timetable' },
  { to: '/music', Icon: MusicIcon, labelKey: 'nav.music' },
  { to: '/guide', Icon: BookIcon, labelKey: 'nav.guide' },
]

const PLAYLIST_URL = 'https://open.spotify.com/playlist/5tkWlvbjzTTCMKVrcaEHpQ'

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Music ticker bar */}
      <a
        href={PLAYLIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 overflow-hidden bg-[#1DB954]/10 px-3 py-1"
      >
        <MusicIcon size={10} className="shrink-0 text-[#1DB954]" />
        <div className="flex-1 overflow-hidden">
          <p className="animate-marquee whitespace-nowrap text-[9px] font-medium text-[#1DB954]/80">
            {t('nav.nowListening')} &mdash; Defqon.1 Sacred Oath 2026 &bull; Get Hyped &bull; Hardstyle &bull; Raw &bull; Hardcore &bull; Frenchcore
          </p>
        </div>
      </a>

      {/* Nav */}
      <nav className="border-t border-white/5 bg-[#111111]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg" style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] uppercase tracking-wider transition-colors ${
                  isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              <item.Icon size={20} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
