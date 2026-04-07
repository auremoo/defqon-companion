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

### UI design system

- **Liquid Glass** — The bottom navigation uses a frosted glass effect (`backdrop-filter: blur + saturate + brightness`) with animated prismatic shimmer and specular highlights. CSS-only implementation in `src/index.css` (`.liquid-glass` classes). Active items have a breathing red glow pill and dot indicator.

### Offline strategy

- Service worker uses **stale-while-revalidate**: serves cached content immediately, fetches updates in background.
- All static assets cached on first visit.
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
