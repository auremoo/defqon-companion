# Defqon Companion

## Project overview

Mobile-first web companion app for the Defqon.1 hardstyle festival. Complements the official app with cultural content, preparation tools, social timetable, and music discovery.

## Tech stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **i18n**: react-i18next (English default, French translation)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Offline**: Service worker (manual, stale-while-revalidate)
- **Storage**: localStorage (offline fallback) + Supabase (social features)

## Project structure

```
src/
  components/    # Reusable UI components (BottomNav, CountdownTimer, AuthModal, LanguageToggle)
  contexts/      # React contexts (AuthContext)
  pages/         # Route-level components (Home, Colors, Guide, Timetable, Checklist)
  data/          # Static data (colors, festival info, lineup, default checklist)
  lib/           # External service clients (supabase.ts)
  i18n/          # Translation files (en.json, fr.json) and i18n config
public/          # Static assets, manifest, service worker
docs/            # Project documentation (specifications, architecture)
supabase/        # Database migrations
```

## Key commands

```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Supabase setup

1. Create a Supabase project at https://supabase.com
2. Run the migration in `supabase/migrations/001_initial.sql` via the SQL Editor
3. Create `.env` with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. The app works without Supabase (offline mode) — social features require it.

## Architecture decisions

- **Supabase** for auth, friend system, and timetable sync. Chosen for speed of integration and free tier.
- **Lineup data is static** (`src/data/lineup.ts`) — sourced from web research. Can be moved to DB later.
- **Code splitting** — pages are lazy-loaded to keep initial bundle small.
- **PWA** — manual service worker (vite-plugin-pwa incompatible with Vite 8).
- **i18n** — English is the source of truth. French translations mirror structure exactly.
- **Dark theme only** — matches festival aesthetic. bg-gray-950 base.
- **Graceful degradation** — app works without Supabase config (localStorage fallback for timetable).
- **Liquid Glass UI** — bottom nav uses `.liquid-glass` CSS classes (frosted blur, shimmer animation, specular highlights). Styles in `src/index.css`.

## Conventions

- All documentation in English
- Component files: PascalCase (e.g., `CountdownTimer.tsx`)
- Data files: camelCase (e.g., `colors.ts`)
- Translations: nested JSON keys (e.g., `guide.history.originTitle`)
- Colors use `defqon-*` custom Tailwind theme tokens
- Pages use lazy imports for code splitting
