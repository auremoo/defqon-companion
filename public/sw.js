const BASE = '/defqon-companion/'

// All populated at build time by scripts/inject-sw-precache.mjs.
// VERSION is a hash of the precached content, so a deploy that only refreshes
// data files leaves this file byte-identical and does not reinstall the worker.
const VERSION = 'dev'
const PRECACHE_URLS = []
// Chunks only some users need (the Firestore SDK, for signed-in users): precached
// only when this browser has already fetched an earlier build of the same chunk.
const OPTIONAL_URLS = []
const WARM_URLS = []

// Unbuilt worker (npm run dev): stay inert, caching would serve stale modules.
const ENABLED = PRECACHE_URLS.length > 0

// The origin is shared with other GitHub Pages projects: only ever touch our own caches.
const CACHE_PREFIX = 'defqon-companion-'
const PRECACHE = `${CACHE_PREFIX}precache-${VERSION}`
const RUNTIME = `${CACHE_PREFIX}runtime`

const NAVIGATION_TIMEOUT_MS = 3000
const PHOTO_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

self.addEventListener('install', (event) => {
  if (!ENABLED) {
    self.skipWaiting()
    return
  }
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

async function precache() {
  const cache = await caches.open(PRECACHE)
  const wanted = await filterAsync(OPTIONAL_URLS, hasEarlierBuild)
  await Promise.all(
    [...PRECACHE_URLS, ...wanted].map(async (url) => {
      const hashed = url.startsWith(BASE + 'assets/')
      if (hashed) {
        // Content-hashed files never change: reuse the copy a previous version
        // already downloaded instead of fetching it again.
        const existing = await caches.match(url)
        if (existing) return cache.put(url, existing)
      }
      // Everything else must bypass the HTTP cache, or a stale index.html could
      // be stored next to chunks it does not reference.
      const response = await fetch(new Request(url, { cache: hashed ? 'default' : 'reload' }))
      if (!response.ok) throw new Error(`Precache failed for ${url}: ${response.status}`)
      return cache.put(url, response)
    })
  )

  // Best effort: have the data files available offline before their page is first opened.
  const runtime = await caches.open(RUNTIME)
  await Promise.allSettled(
    WARM_URLS.map(async (url) => {
      const response = await fetch(url)
      if (response.ok) await runtime.put(url, response)
    })
  )
}

// "/assets/name-<hash>.js" → true when any of our caches holds "/assets/name-*".
async function hasEarlierBuild(url) {
  const stem = url.slice(0, url.lastIndexOf('-') + 1)
  for (const name of await caches.keys()) {
    if (!name.startsWith(CACHE_PREFIX)) continue
    const requests = await (await caches.open(name)).keys()
    if (requests.some((request) => new URL(request.url).pathname.startsWith(stem))) return true
  }
  return false
}

async function filterAsync(items, predicate) {
  const keep = await Promise.all(items.map(predicate))
  return items.filter((_, i) => keep[i])
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== PRECACHE && key !== RUNTIME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (!ENABLED) return

  const { request } = event
  if (request.method !== 'GET') return

  // Third-party requests (Firestore, YouTube thumbnails, weather API…) are left to the browser.
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event))
  } else if (url.pathname.startsWith(BASE + 'assets/')) {
    event.respondWith(cacheFirst(event))
  } else if (url.pathname.startsWith(BASE + 'mainstages/')) {
    event.respondWith(staleWhileRevalidate(event, PHOTO_MAX_AGE_MS))
  } else {
    event.respondWith(staleWhileRevalidate(event, 0))
  }
})

// HTML: network-first so new deploys are picked up, but never wait more than a
// few seconds on a congested network when the precached shell can be shown.
async function handleNavigation(event) {
  const network = fetch(event.request)
  let timer
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), NAVIGATION_TIMEOUT_MS)
  })

  try {
    const response = await Promise.race([network, timeout])
    if (response) return response
  } catch {
    // offline — fall through to the shell
  } finally {
    clearTimeout(timer)
  }

  network.catch(() => {}) // may still be pending or rejected; avoid an unhandled rejection
  return (await caches.match(BASE)) || network
}

// Content-hashed build output: immutable, so the cache is always right.
async function cacheFirst(event) {
  return (await caches.match(event.request)) || fetchAndCache(event)
}

// Serve the cached copy immediately and refresh it in the background.
// With maxAgeMs > 0, copies younger than that are served without revalidating.
async function staleWhileRevalidate(event, maxAgeMs) {
  const cached = await caches.match(event.request)
  if (!cached) return fetchAndCache(event)

  if (!isFresh(cached, maxAgeMs)) {
    fetchAndCache(event).catch(() => {}) // offline: keep serving the cached copy
  }
  return cached
}

function isFresh(response, maxAgeMs) {
  if (!maxAgeMs) return false
  const date = Date.parse(response.headers.get('date') || '')
  return Number.isFinite(date) && Date.now() - date < maxAgeMs
}

function fetchAndCache(event) {
  let stored
  const response = fetch(event.request).then((res) => {
    if (res.ok) {
      // Clone before the body is handed to the page — a consumed body cannot be cloned.
      const copy = res.clone()
      stored = caches
        .open(RUNTIME)
        .then((cache) => cache.put(event.request, copy))
        .catch(() => {}) // quota exceeded, partial response…
    }
    return res
  })
  // Keep the worker alive until the cache write has finished.
  event.waitUntil(response.then(() => stored, () => {}))
  return response
}
