import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { SettingsIcon } from './Icons'
import AuthModal from './AuthModal'

export default function PageHeader() {
  const { t } = useTranslation()
  const { user, profile, configured } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {configured && user && profile ? (
            <>
              <span className="text-xs text-text-muted">@{profile.username}</span>
              {profile.is_dediqated && (
                <span className="rounded-sm bg-defqon-gold/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-defqon-gold">
                  Dediqated
                </span>
              )}
            </>
          ) : configured ? (
            <button
              onClick={() => setShowAuth(true)}
              className="text-xs text-accent hover:text-text-primary"
            >
              {t('auth.loginPrompt')}
            </button>
          ) : null}
        </div>
        <Link to="/settings" className="rounded-lg p-2 text-text-muted transition-colors hover:text-text-primary">
          <SettingsIcon size={20} />
        </Link>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
