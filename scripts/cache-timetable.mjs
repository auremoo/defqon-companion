#!/usr/bin/env node
// Polls Q-dance API for Defqon.1 2026 timetable.
// Once enableTimetable becomes true, transforms and caches to public/data/timetable-2026.json
// Runs daily via GitHub Actions — triggers deploy only when data actually changes.

import { writeFileSync, mkdirSync, readFileSync } from 'fs'

const API = 'https://prod.api-dev.q-dance.com/v1/events/defqon-1/editions/defqon-1-2026/timetable?locale=en-US'
const OUT = 'public/data/timetable-2026.json'

const res = await fetch(API, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})

if (!res.ok) {
  console.error(`Q-dance API error: ${res.status}`)
  process.exit(1)
}

const json = await res.json()
const edition = json?.data?.eventEdition

if (!edition?.enableTimetable || !edition?.days?.length) {
  console.log('Timetable not yet enabled — nothing to cache.')
  process.exit(0)
}

// Map day label to our Day type
const DAY_MAP = {
  'Thursday': 'thursday',
  'Friday': 'friday',
  'Saturday': 'saturday',
  'Sunday': 'sunday',
}

// Transform Q-dance API → our Set[] format
const sets = []
for (const day of edition.days) {
  const dayKey = DAY_MAP[day.label] ?? day.label?.toLowerCase()
  if (!dayKey) continue

  for (const stage of day.stages ?? []) {
    const stageName = (stage.name ?? stage.title ?? '').toUpperCase().replace(/\s+/g, '_')
    for (const act of stage.acts ?? stage.items ?? []) {
      const artistName = act.artist?.name ?? act.title ?? act.name ?? ''
      if (!artistName) continue

      sets.push({
        id: act.id ?? `${dayKey}-${stageName}-${act.startTime}`,
        artist: artistName,
        stage: stageName,
        day: dayKey,
        startTime: (act.startTime ?? '').slice(0, 5),
        endTime: (act.endTime ?? '').slice(0, 5),
        special: act.special ?? act.label ?? undefined,
      })
    }
  }
}

if (sets.length === 0) {
  console.log('API returned empty acts — skipping.')
  process.exit(0)
}

// Skip write if data hasn't changed
const payload = JSON.stringify({ updatedAt: new Date().toISOString(), sets }, null, 2)
try {
  const existing = readFileSync(OUT, 'utf8')
  const prev = JSON.parse(existing)
  if (JSON.stringify(prev.sets) === JSON.stringify(sets)) {
    console.log(`Timetable unchanged (${sets.length} acts).`)
    process.exit(0)
  }
} catch { /* file doesn't exist yet */ }

mkdirSync('public/data', { recursive: true })
writeFileSync(OUT, payload)
console.log(`Cached ${sets.length} acts from official timetable.`)
