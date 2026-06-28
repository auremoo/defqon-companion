import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeIcon, TentIcon, MusicIcon, NewspaperIcon, MoreIcon } from './Icons'

const navItems = [
  { to: '/',         Icon: HomeIcon,      labelKey: 'nav.home' },
  { to: '/festival', Icon: TentIcon,      labelKey: 'nav.festival' },
  { to: '/music',    Icon: MusicIcon,     labelKey: 'nav.music' },
  { to: '/news',     Icon: NewspaperIcon, labelKey: 'nav.news' },
  { to: '/more',     Icon: MoreIcon,      labelKey: 'nav.more' },
]

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#111111]/95 backdrop-blur-md md:left-1/2 md:right-auto md:w-[430px] md:-translate-x-1/2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto flex" style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
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
  )
}
