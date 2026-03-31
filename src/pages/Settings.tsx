import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChevronRightIcon } from '../components/Icons'
import { useState } from 'react'
import AuthModal from '../components/AuthModal'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

const musicPlatforms = [
  { id: 'spotify', label: 'Spotify' },
  { id: 'apple', label: 'Apple Music' },
  { id: 'deezer', label: 'Deezer' },
  { id: 'youtube', label: 'YouTube Music' },
  { id: 'soundcloud', label: 'SoundCloud' },
]

function getPreferredPlatform(): string {
  return localStorage.getItem('defqon-music-platform') || 'spotify'
}

export default function Settings() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, profile, configured, signOut, updateProfile } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [platform, setPlatform] = useState(getPreferredPlatform)
  const [defqonUsername, setDefqonUsername] = useState(profile?.defqon_username || '')
  const [saving, setSaving] = useState(false)

  const changePlatform = (id: string) => {
    setPlatform(id)
    localStorage.setItem('defqon-music-platform', id)
  }

  return (
    <div className="flex flex-1 flex-col px-4 pb-24 pt-8">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="mb-2 text-sm text-text-muted hover:text-text-primary">
          &larr; {t('settings.back')}
        </button>
        <h1 className="defqon-heading text-2xl font-bold sm:text-3xl text-text-primary">{t('settings.title')}</h1>
      </header>

      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Account */}
        <section>
          <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('settings.account')}
          </h2>
          <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
            {configured && user && profile ? (
              <>
                <div className="p-4">
                  <p className="text-sm font-medium text-text-primary">{profile.display_name || profile.username}</p>
                  <p className="text-xs text-text-muted">@{profile.username}</p>
                  <p className="mt-1 text-xs text-text-muted">{user.email}</p>
                </div>
                <button
                  onClick={signOut}
                  className="w-full border-t border-border p-3 text-sm text-defqon-red transition-colors hover:bg-accent-glow"
                >
                  {t('settings.signOut')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex w-full items-center justify-between p-4 text-sm transition-colors hover:bg-surface-alt"
              >
                <span className="text-text-primary">{t('settings.signIn')}</span>
                <ChevronRightIcon size={16} className="text-text-muted" />
              </button>
            )}
          </div>
        </section>

        {/* Defqon profile — only when logged in */}
        {configured && user && profile && (
          <section>
            <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
              {t('settings.defqonProfile')}
            </h2>
            <div className="rounded-2xl border border-border bg-surface-card overflow-hidden divide-y divide-border">
              {/* Defqon username */}
              <div className="p-4">
                <label className="mb-1 block text-xs text-text-muted">{t('settings.defqonUsername')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={defqonUsername}
                    onChange={(e) => setDefqonUsername(e.target.value)}
                    placeholder={t('settings.defqonUsernamePlaceholder')}
                    className="flex-1 rounded-lg border border-border bg-surface-alt px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50"
                  />
                  <button
                    onClick={async () => { setSaving(true); await updateProfile({ defqon_username: defqonUsername || null }); setSaving(false) }}
                    disabled={saving}
                    className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold uppercase text-text-primary disabled:opacity-50"
                  >
                    {saving ? '...' : t('settings.save')}
                  </button>
                </div>
              </div>
              {/* Dediqated toggle */}
              <button
                onClick={() => updateProfile({ is_dediqated: !profile.is_dediqated })}
                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-surface-alt"
              >
                <div>
                  <span className="text-sm text-text-primary">{t('settings.dediqated')}</span>
                  <p className="text-xs text-text-muted">{t('settings.dediqatedDesc')}</p>
                </div>
                <div className={`h-6 w-10 rounded-full transition-colors ${profile.is_dediqated ? 'bg-defqon-gold' : 'bg-surface-elevated'}`}>
                  <div className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${profile.is_dediqated ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Language */}
        <section>
          <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('settings.language')}
          </h2>
          <div className="rounded-2xl border border-border bg-surface-card overflow-hidden divide-y divide-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`flex w-full items-center justify-between p-4 text-sm transition-colors hover:bg-surface-alt ${
                  i18n.language.startsWith(lang.code) ? 'text-accent' : 'text-text-primary'
                }`}
              >
                <span>{lang.label}</span>
                {i18n.language.startsWith(lang.code) && <span className="text-accent">&#10003;</span>}
              </button>
            ))}
          </div>
        </section>

        {/* Music platform */}
        <section>
          <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('settings.musicPlatform')}
          </h2>
          <div className="rounded-2xl border border-border bg-surface-card overflow-hidden divide-y divide-border">
            {musicPlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => changePlatform(p.id)}
                className={`flex w-full items-center justify-between p-4 text-sm transition-colors hover:bg-surface-alt ${
                  platform === p.id ? 'text-accent' : 'text-text-primary'
                }`}
              >
                <span>{p.label}</span>
                {platform === p.id && <span className="text-accent">&#10003;</span>}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted">{t('settings.musicPlatformDesc')}</p>
        </section>

        {/* Official links */}
        <section>
          <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('settings.officialLinks')}
          </h2>
          <div className="rounded-2xl border border-border bg-surface-card overflow-hidden divide-y divide-border">
            <a href="https://www.q-dance.com/l/defqon1-2026" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 text-sm text-text-primary transition-colors hover:bg-surface-alt">
              <span>{t('settings.defqonWebsite')}</span>
              <span className="text-text-muted">&rarr;</span>
            </a>
            <a href="https://www.q-dance.com/l/defqon1-2026-tickets" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 text-sm text-text-primary transition-colors hover:bg-surface-alt">
              <span>{t('settings.defqonTickets')}</span>
              <span className="text-text-muted">&rarr;</span>
            </a>
            <a href="https://apps.apple.com/app/q-dance/id410976210" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 text-sm text-text-primary transition-colors hover:bg-surface-alt">
              <span>{t('settings.defqonApp')} (iOS)</span>
              <span className="text-text-muted">&rarr;</span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.qdance.qdance" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 text-sm text-text-primary transition-colors hover:bg-surface-alt">
              <span>{t('settings.defqonApp')} (Android)</span>
              <span className="text-text-muted">&rarr;</span>
            </a>
          </div>
        </section>

        {/* App info */}
        <section>
          <h2 className="defqon-heading mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            {t('settings.about')}
          </h2>
          <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-1">
            <p className="text-sm text-text-primary">Defqon Companion v1.0</p>
            <p className="text-xs text-text-muted">{t('settings.disclaimer')}</p>
          </div>
        </section>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
