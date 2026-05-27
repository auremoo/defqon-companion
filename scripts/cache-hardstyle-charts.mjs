#!/usr/bin/env node
// Scrapes hardstyle.com/en/charts (Hardstyle Top 100, weekly)
// Server-rendered — no headless browser needed

import { writeFileSync, mkdirSync } from 'fs'

const BASE = 'https://hardstyle.com'
const URL  = `${BASE}/en/charts`

const res = await fetch(URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})
if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1) }
const html = await res.text()

function decode(s) {
  return s.replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/&quot;/g,'"')
          .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim()
}

// Each chart entry is wrapped in class="track listView..."
const entries = []
const trackRe = /class="track listView[^"]*"\s+data-track-id="([^"]+)"([\s\S]*?)(?=class="track listView|<\/div><\/div><\/section>)/g

for (const [, id, block] of html.matchAll(trackRe)) {
  // Position: first anchor with class="number" contains "01", "02" etc.
  const posMatch  = block.match(/class="number"[^>]*>\s*(\d+)\s*<\/a>/)
  const titleMatch = block.match(/class="linkTitle trackTitle"[^>]+title="([^"]+)"/)
  const artistMatch = block.match(/class="highlight"[^>]+title="([^"]+)"/)
  const mixMatch   = block.match(/class="linkTitle"[^>]+title="([^"]+)"/)
  const labelMatch = block.match(/class="link label"[^>]*>([^<]+)<\/a>/)
  // Positions: last-week, peak, weeks (skip first "resp" item)
  const posItems   = [...block.matchAll(/<div class="item(?! resp)[^"]*">(\d+|-)<\/div>/g)].map(m => m[1])
  const slugMatch  = block.match(/href="(\/en\/tracks\/[^"]+)"/)

  if (!titleMatch) continue

  entries.push({
    position: posMatch ? parseInt(posMatch[1], 10) : entries.length + 1,
    id,
    title: decode(titleMatch[1]),
    artist: artistMatch ? decode(artistMatch[1]) : '',
    mix: mixMatch ? decode(mixMatch[1]) : '',
    label: labelMatch ? decode(labelMatch[1]).trim() : '',
    image: `${BASE}/track_image/${id}/250x250/335`,
    link: slugMatch ? `${BASE}${slugMatch[1]}` : `${BASE}/en/tracks/${id}`,
    lastWeek: posItems[0] ?? '-',
    peak: posItems[1] ?? '-',
    weeksOnChart: posItems[2] ?? '-',
  })
}

mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/hardstyle-charts.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), tracks: entries }, null, 2))
console.log(`Cached ${entries.length} chart tracks`)
