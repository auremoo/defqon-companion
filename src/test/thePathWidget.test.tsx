import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Firestore is mocked so the test controls exactly when getDoc settles.
const getDoc = vi.fn()
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: (...args: unknown[]) => getDoc(...args),
  setDoc: vi.fn(),
}))
vi.mock('../lib/firebase', () => ({ db: {}, auth: {}, isFirebaseConfigured: true }))

const authState = { user: { uid: 'u1' }, configured: true, loading: false }
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => authState }))

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import ThePathWidget from '../components/ThePathWidget'

function deferred<T>() {
  let resolve!: (v: T) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

describe('ThePathWidget', () => {
  beforeEach(() => {
    getDoc.mockReset()
    authState.loading = false
  })

  it('does not offer "set up" while the document is still loading', async () => {
    const d = deferred<{ exists: () => boolean; data: () => unknown }>()
    getDoc.mockReturnValue(d.promise)

    render(<ThePathWidget />)

    // The regression: a pending fetch used to render exactly like "no data yet".
    expect(screen.queryByText('path.setup')).not.toBeInTheDocument()
    expect(screen.queryByText('path.empty')).not.toBeInTheDocument()

    d.resolve({
      exists: () => true,
      data: () => ({ rank: 4, rankTitle: 'Warrior', xp: 5000, xpNextRank: 9999, badges: { orange: 1, gold: 2, silver: 3, bronze: 4 } }),
    })

    await waitFor(() => expect(screen.getByText(/Rank 4/)).toBeInTheDocument())
    expect(screen.getByText('path.update')).toBeInTheDocument()
  })

  it('shows the empty state only once the fetch confirms there is no document', async () => {
    getDoc.mockResolvedValue({ exists: () => false, data: () => undefined })

    render(<ThePathWidget />)

    await waitFor(() => expect(screen.getByText('path.empty')).toBeInTheDocument())
    expect(screen.getByText('path.setup')).toBeInTheDocument()
  })

  it('surfaces an error with a retry action when the fetch rejects', async () => {
    getDoc.mockRejectedValue(new Error('unavailable'))

    render(<ThePathWidget />)

    await waitFor(() => expect(screen.getByText('path.loadError')).toBeInTheDocument())
    expect(screen.getByText('path.retry')).toBeInTheDocument()
    expect(screen.queryByText('path.setup')).not.toBeInTheDocument()
  })

  it('renders the placeholder, not an empty slot, while auth is still resolving', () => {
    authState.loading = true
    getDoc.mockReturnValue(new Promise(() => {}))

    const { container } = render(<ThePathWidget />)

    expect(screen.getByText('path.label')).toBeInTheDocument()
    expect(screen.queryByText('path.setup')).not.toBeInTheDocument()
    expect(container.querySelector('.animate-pulse')).not.toBeNull()
  })
})
