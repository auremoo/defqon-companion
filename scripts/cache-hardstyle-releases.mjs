#!/usr/bin/env node
// Scrapes hardstyle.com/en/music/update (latest track releases)
// The /update endpoint returns the track list partial directly

import { writeFileSync, mkdirSync } from 'fs'

const BASE = 'https://hardstyle.com'
const URL  = `${BASE}/en/music/update`

const res = await fetch(URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})
if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1) }
const html = await res.text()

function decode(s) {
  return s.replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/&quot;/g,'"')
          .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim()
}

const releases = []
const trackRe = /class="track blockView[^"]*"\s+data-track-id="([^"]+)"([\s\S]*?)(?=class="track blockView|$)/g

for (const [, id, block] of html.matchAll(trackRe)) {
  const titleMatch  = block.match(/class="linkTitle trackTitle"[^>]+title="([^"]+)"/)
  const artistMatch = block.match(/class="highlight"[^>]+title="([^"]+)"/)
  const mixMatch    = block.match(/class="linkTitle"[^>]+title="([^"]+)"/)
  const slugMatch   = block.match(/href="(\/en\/tracks\/[^"]+)"/)

  if (!titleMatch) continue
  releases.push({
    id,
    title: decode(titleMatch[1]),
    artist: artistMatch ? decode(artistMatch[1]) : '',
    mix: mixMatch ? decode(mixMatch[1]) : '',
    image: `${BASE}/track_image/${id}/250x250/335`,
    link: slugMatch ? `${BASE}${slugMatch[1]}` : `${BASE}/en/tracks/${id}`,
  })
}

// Keep latest 50
const unique = releases.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i).slice(0, 50)

mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/hardstyle-releases.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), releases: unique }, null, 2))
console.log(`Cached ${unique.length} releases`)
