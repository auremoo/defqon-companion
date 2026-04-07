# Defqon Companion

Mobile-first web companion app for the **Defqon.1** hardstyle festival. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Colors Guide** — Explore all Defqon.1 stages (RED, BLUE, BLACK, etc.) with music styles, artists, BPM ranges, and playlist links. Mark favorites.
- **Social Timetable** — Browse the full Defqon.1 2026 lineup, build your personal schedule, add friends, and see who's going to which sets. Real-time sync via Supabase.
- **History & Guide** — Learn about the origin of Defqon.1, hardstyle subgenres, and festival vocabulary.
- **Festival Checklist** — Customizable packing checklist with categories (essentials, camping, comfort). Persisted locally.
- **Countdown** — Live countdown to Defqon.1 2026 (June 25-28, Biddinghuizen, Netherlands).
- **Bilingual** — English (default) and French. Auto-detects browser language.
- **Offline Ready** — Service worker caches the app for use without network.
- **PWA** — Installable on mobile devices via "Add to Home Screen".
- **Liquid Glass UI** — Floating bottom navigation with frosted glass effect, animated prismatic shimmer, and specular highlights.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on your phone or browser.

### Supabase setup (optional, for social features)

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial.sql` in the SQL Editor
3. Create `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the dev server

The app works fully without Supabase — social features (friends, timetable sync) will be disabled.

## Build

```bash
npm run build
npm run preview
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| i18n | react-i18next |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Offline | Service Worker |

## Project structure

```
src/
  components/    # Reusable UI components
  contexts/      # React contexts (Auth)
  pages/         # Route pages (Home, Colors, Guide, Timetable, Checklist)
  data/          # Static data (colors, lineup, festival config)
  lib/           # External service clients
  i18n/          # Translation files (en.json, fr.json)
public/          # Static assets, PWA manifest, service worker
docs/            # Specifications, architecture docs
supabase/        # Database migrations
```

## Roadmap

- [x] Phase 1: Home + Colors + History/Guide + Checklist + PWA
- [x] Phase 2: Social Timetable + Auth + Database
- [x] Liquid Glass UI for bottom navigation
- [ ] Phase 3: Playlists / Radio companion
- [ ] Phase 4: Push notifications
- [ ] Future: Advanced social features, admin panel
