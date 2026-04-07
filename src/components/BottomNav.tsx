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

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="liquid-glass mx-4 mb-3 rounded-[22px] px-1"
        style={{
          paddingLeft: `max(4px, env(safe-area-inset-left, 0px))`,
          paddingRight: `max(4px, env(safe-area-inset-right, 0px))`,
        }}
      >
        <div className="mx-auto flex max-w-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative z-[1] flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/35 hover:text-white/60'
                }${isActive ? ' liquid-glass-active' : ''}`
              }
            >
              <item.Icon size={20} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
