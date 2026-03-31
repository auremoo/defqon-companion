import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const { t } = useTranslation()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inputClass = 'w-full rounded-xl border border-border bg-surface-alt px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent/50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'signup' && password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setLoading(false)
      return
    }

    const err = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, username)

    setLoading(false)
    if (err) {
      setError(err)
    } else if (mode === 'signup') {
      setSuccess(t('auth.checkEmail'))
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="defqon-heading mb-1 text-xl text-text-primary">
          {mode === 'login' ? t('auth.login') : t('auth.signup')}
        </h2>
        {mode === 'signup' && (
          <p className="mb-4 text-xs text-text-muted">{t('auth.signupHint')}</p>
        )}
        {mode === 'login' && <div className="mb-4" />}

        {success ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-green-800/50 bg-green-900/20 p-4 text-center">
              <p className="text-sm font-medium text-green-400">{success}</p>
            </div>
            <button
              onClick={() => { setMode('login'); setSuccess(null) }}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-text-primary"
            >
              {t('auth.login')}
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <input
                    type="text"
                    placeholder={t('auth.username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    required
                    minLength={3}
                    maxLength={20}
                    className={inputClass}
                  />
                  <p className="mt-1 text-[10px] text-text-muted">{t('auth.usernameHint')}</p>
                </div>
              )}
              <input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass + ' pr-12'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary"
                >
                  {showPassword ? t('auth.hide') : t('auth.show')}
                </button>
              </div>
              {mode === 'signup' && (
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                />
              )}

              {error && (
                <p className="rounded-lg bg-red-900/30 p-2 text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold uppercase tracking-wider text-text-primary transition-colors hover:bg-accent-dark disabled:opacity-50"
              >
                {loading ? '...' : mode === 'login' ? t('auth.login') : t('auth.signup')}
              </button>
            </form>

            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null) }}
              className="mt-3 w-full text-center text-xs text-text-muted hover:text-text-primary"
            >
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
