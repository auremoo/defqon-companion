#!/usr/bin/env node
// Fetches Q-dance YouTube RSS and caches it to public/data/qdance-news.json
// No secrets needed — YouTube RSS is public

import { writeFileSync, mkdirSync } from 'fs'

const RSS_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCmT5a_E68D5y7_e8eSBCPtg'

const res = await fetch(RSS_URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})

if (!res.ok) {
  console.error(`Failed to fetch RSS: ${res.status}`)
  process.exit(1)
}

const xml = await res.text()

// YouTube RSS format is stable — regex parsing is safe here
const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
  .slice(0, 10)
  .map(([, entry]) => {
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? ''
    const rawTitle = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? ''
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
    return {
      id: videoId,
      title: rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'"),
      published,
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null,
    }
  })
  .filter((v) => v.id)

mkdirSync('public/data', { recursive: true })
writeFileSync(
  'public/data/qdance-news.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), videos }, null, 2)
)

console.log(`Cached ${videos.length} videos`)
