# Defqon Companion — Specifications

## 1. Context & Positioning

- Mobile-first web companion app for the Defqon.1 / hardstyle festival.
- Complements the official app (map, timetable, tickets, radio) with useful, short, non-redundant features.
- Target audience: first-time Defqon visitors, hardstyle fans, people preparing for the festival.

## 2. Core Features

### 2.1. Colors of Defqon.1 Guide

- One page per color (RED, BLUE, BLACK, YELLOW, INDIGO, MAGENTA, SILVER, GOLD, PURPLE).
- Each color includes:
  - Title + emoji + style name (e.g., RED = Euphoric Hardstyle)
  - 1–2 sentence summary
  - Longer description (2–3 sentences)
  - Famous artist examples
  - Spotify/YouTube playlist links
  - Audience type, vibe, typical BPM
- Mark colors as "favorite" — favorites appear at the top.

### 2.2. Discover Hardstyle Guide

- Mini-guide for beginners:
  - What is hardstyle?
  - Difference between euphoric, raw, frenchcore, hardcore, etc.
  - Basic vocabulary (kick, breakdown, screeches, etc.)
  - Introduction to Defqon.1 and Q-dance
- Displayed as readable cards/sections (5–10 min read).

### 2.3. History of Defqon.1

- Origin of the name (DEFCON military reference)
- Why the number "1"
- The color system explained
- Brand identity overview
- Integrated as a tab within the Guide page.

### 2.4. Festival Checklist

- Customizable "Ready for Defqon?" checklist:
  - Ticket / invitation
  - ID / passport
  - Charger, power bank
  - Tent / sleeping bag / mattress (if camping)
  - Sunscreen, clothes, sneakers, earplugs, etc.
- Each item can be checked, added, or removed.
- Progress bar showing completion.
- Persisted locally (localStorage).

### 2.5. Social Timetable (Priority Feature)

An interactive timetable with social features, distinct from the official app's basic timetable.

#### Core functionality:
- **Personal timetable**: users can browse the lineup by day/stage and add sets to their personal schedule.
- **Friend system**: add friends by username, accept/decline friend requests.
- **Social sync**: see which friends are attending which sets. Visual indicators show friend overlap.
- **Shared planning**: view a friend's full timetable to coordinate meetups.
- **Conflict detection**: warn when two saved sets overlap in time.

#### Technical requirements:
- Requires user authentication (email/password or social login).
- Backend database for user profiles, friendships, and timetable entries.
- Real-time updates when friends modify their timetable.
- Lineup data managed as static data initially, updateable via admin or database.

#### What this is NOT:
- Not a replacement for the official timetable (no official data feed).
- Not a chat system.
- Lineup data is community-sourced or manually entered until official data is available.

### 2.6. Mini Radio Companion

- Shortcuts to ready-made Spotify/YouTube playlists:
  - "Road trip to the festival" playlist
  - "Pre-festival warm-up" playlist
  - "Running / sports" hardstyle playlist
- Each playlist: name, image, short description, "Open on Spotify" / "Play on YouTube" button.

### 2.7. Reminders & Notifications (V2)

- Simple notification examples:
  - "Reminder: 1 week before Defqon, check your checklist"
  - "3 days before: discover the RED stage / your favorite color"
  - "Today is the day!"
  - "After the festival: leave a note / review"
- No spam: 1–2 notifications per week maximum.
- Deferred to V2 (requires push notification service).

### 2.8. Offline Mode

- Store locally (browser / PWA):
  - Checklist
  - Colors guide (text + Spotify links)
  - Mini guide for "no network" situations
- No network required for basic info on-site.

## 3. Mobile-First Design

- Very simple interface, designed for smartphones.
- 5 main screens:
  - Home (summary + countdown)
  - Colors (all colors)
  - Guide (history + discovery text)
  - Timetable (social timetable)
  - Checklist (preparation)
- Bottom tab navigation with **liquid glass** design — floating frosted pill with backdrop blur, animated prismatic shimmer, and specular highlights.
- Subtle animations (shimmer, breathing glow on active items), minimal scrolling, no complex forms.
- Dark theme (matches festival aesthetic).

## 4. What the App Does NOT Do

- Does not replace the official Defqon app:
  - No interactive map
  - No official timetable data feed
  - No ticketing
  - No official set comments/chat
- Focuses on:
  - Hardstyle culture
  - Music discovery
  - Festival preparation
  - Social timetable coordination
  - Useful reminders and info

## 5. Data Storage

- **Client-side** (localStorage / PWA):
  - Favorite colors
  - Checked checklist items
  - Preferred playlists
  - Language preference
- **Server-side** (Supabase):
  - User profiles (auth)
  - Friend relationships
  - Personal timetable entries
  - Lineup data
- No mandatory account for basic features (colors, guide, checklist).
- Account required only for social timetable features.

## 6. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| i18n | react-i18next (EN default + FR) |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Offline | Service Worker |
| Storage | localStorage + Supabase |

## 7. Development Phases

- **Phase 1** ✅: Home + Colors + History/Guide + Checklist + PWA
- **Phase 2** (current): Social Timetable + Auth + Database
- **Phase 3**: Playlists / Radio companion
- **Phase 4**: Push notifications
- **Future**: Advanced social features, admin panel, official data integration
