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
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const err = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, username)

    setLoading(false)
    if (err) setError(err)
    else onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-white">
          {mode === 'login' ? t('auth.login') : t('auth.signup')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder={t('auth.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-defqon-red/50"
            />
          )}
          <input
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-defqon-red/50"
          />
          <input
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-defqon-red/50"
          />

          {error && (
            <p className="rounded-lg bg-red-900/30 p-2 text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-defqon-red py-2.5 text-sm font-medium text-white transition-colors hover:bg-defqon-red/80 disabled:opacity-50"
          >
            {loading ? '...' : mode === 'login' ? t('auth.login') : t('auth.signup')}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
          className="mt-3 w-full text-center text-xs text-gray-400 hover:text-white"
        >
          {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
        </button>
      </div>
    </div>
  )
}
