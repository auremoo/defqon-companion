// Defqon Companion — Auteur : Aurélien Moote - Moo - 2026 — Licence MIT
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// A lazy chunk failed to load: most likely a new version was deployed while this
// tab was open and the old chunk no longer exists. Reload once to pick it up.
const CHUNK_RELOAD_KEY = 'defqon-chunk-reload'
window.addEventListener('vite:preloadError', () => {
  if (!navigator.onLine) return
  const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0)
  if (Date.now() - last < 10_000) return // already tried — let the error boundary show
  sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
  window.location.reload()
})

// Production only: under the dev server a caching worker would serve stale modules.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js')
  })
}
