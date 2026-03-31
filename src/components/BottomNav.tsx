import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const navItems = [
  { to: '/', icon: '\u2302', labelKey: 'nav.home' },
  { to: '/colors', icon: '\ud83c\udfa8', labelKey: 'nav.colors' },
  { to: '/timetable', icon: '\ud83d\udcc5', labelKey: 'nav.timetable' },
  { to: '/guide', icon: '\ud83d\udcd6', labelKey: 'nav.guide' },
  { to: '/checklist', icon: '\u2705', labelKey: 'nav.checklist' },
]

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive ? 'text-defqon-red' : 'text-gray-400 hover:text-gray-200'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
