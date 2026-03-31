import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeIcon, PaletteIcon, CalendarIcon, BookIcon, ChecklistIcon } from './Icons'

const navItems = [
  { to: '/', Icon: HomeIcon, labelKey: 'nav.home' },
  { to: '/colors', Icon: PaletteIcon, labelKey: 'nav.colors' },
  { to: '/timetable', Icon: CalendarIcon, labelKey: 'nav.timetable' },
  { to: '/guide', Icon: BookIcon, labelKey: 'nav.guide' },
  { to: '/checklist', Icon: ChecklistIcon, labelKey: 'nav.checklist' },
]

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0d0d12]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive ? 'text-defqon-red' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <item.Icon size={20} />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
