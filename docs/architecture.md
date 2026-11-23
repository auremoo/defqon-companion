# Architecture

## Overview

Defqon Companion is a client-side React SPA designed as a PWA. It runs entirely in the browser with no backend dependency (Phase 1). The architecture supports adding an API layer in future phases.

## Current architecture (Phase 1)

```
[Browser]
  ├── React SPA (Vite build)
  ├── Service Worker (offline cache)
  └── localStorage (user data)
```

### Data flow

1. **Static data** — Colors, festival info, default checklist items are bundled in `src/data/`.
2. **User data** — Favorites and checklist state are persisted to `localStorage`.
3. **i18n** — Translations are bundled JSON files, language preference stored in `localStorage`.

### Routing

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Festival info, countdown, quick links |
| `/colors` | Colors | All Defqon.1 color/stage cards with favorites |
| `/guide` | Guide | History, hardstyle intro, vocabulary (tabbed) |
| `/checklist` | Checklist | Interactive packing checklist |

### Offline strategy

The service worker (`public/sw.js`, completed at build time by `scripts/inject-sw-precache.mjs`) picks a strategy per kind of request:

| Request | Strategy |
|---------|----------|
| Page navigation | Network-first, falling back to the precached shell when offline or after 3 s |
| `assets/*` (content-hashed build output) | Cache-first — these files never change |
| `data/*.json`, icons, manifest | **Stale-while-revalidate**: cached copy served immediately, refreshed in the background |
| `mainstages/*` photos | Stale-while-revalidate, revalidated at most once a week |
| Other origins (Firestore, YouTube, weather API) | Not intercepted |

- The app shell and every chunk are precached on first visit; data files are fetched best-effort at the same time. The Firestore chunk is precached only for browsers that have already used it (signed-in users).
- Caches are named `defqon-companion-precache-<version>` and `defqon-companion-runtime`. The version is a hash of the precached content, so a deploy that only refreshes `data/*.json` does not reinstall the worker. Old versions are deleted on activation; caches of other projects on the same origin are never touched.
- The worker is only registered in production builds and stays inert when served unbuilt by the dev server.
- User data in localStorage is always available offline.

## Future architecture (with backend)

```
[Browser]                    [Backend]
  ├── React SPA ────────────── REST API / GraphQL
  ├── Service Worker            ├── Auth (optional)
  └── localStorage              ├── Database
                                └── Push notifications
```

### Migration path

- Replace `src/data/` imports with API calls
- Add authentication layer (optional)
- Move checklist sync to server
- Add push notification service (Phase 4)
