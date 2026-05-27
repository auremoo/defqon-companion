#!/usr/bin/env node
// Fetches Spotify artist images and popularity for all artists in src/data/artists.ts
// Note: top-tracks and followers require Spotify quota extension (restricted since 2024)
// Writes to public/data/spotify-enrichment.json

import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  process.exit(1)
}

// Extract artist { appId, name } pairs — one object block at a time
const artistsTs = readFileSync('src/data/artists.ts', 'utf-8')
const artistEntries = []
for (const [, block] of artistsTs.matchAll(/\{([^{}]+)\}/g)) {
  const appId = block.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1]
  const name = block.match(/\bname:\s*['"]([^'"]+)['"]/)?.[1]
  if (appId && name) artistEntries.push({ appId, name })
}

console.log(`Found ${artistEntries.length} artists`)

// Client credentials token
const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
  },
  body: 'grant_type=client_credentials',
})
const tokenData = await tokenRes.json()
if (!tokenData.access_token) {
  console.error('Failed to get Spotify token:', JSON.stringify(tokenData))
  process.exit(1)
}
const { access_token } = tokenData

const result = {}

for (const { appId, name } of artistEntries) {
  try {
    // Search to get artist ID
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const searchData = await searchRes.json()
    const found = searchData.artists?.items?.[0]

    if (!found) {
      console.warn(`✗ ${name}: not found`)
      continue
    }

    // Fetch full artist object for image + popularity
    const fullRes = await fetch(`https://api.spotify.com/v1/artists/${found.id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const full = await fullRes.json()

    if (full.error) {
      console.warn(`✗ ${name}: ${full.error.status} ${full.error.message}`)
      continue
    }

    result[appId] = {
      spotifyId: found.id,
      image: full.images?.[0]?.url ?? null,
      popularity: full.popularity ?? 0,
    }
    console.log(`✓ ${name} (popularity: ${full.popularity}, image: ${full.images?.length > 0 ? 'yes' : 'no'})`)
  } catch (e) {
    console.warn(`✗ ${name}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 120))
}

mkdirSync('public/data', { recursive: true })
writeFileSync(
  'public/data/spotify-enrichment.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), artists: result }, null, 2)
)

console.log(`\nDone — ${Object.keys(result).length}/${artistEntries.length} artists enriched`)
