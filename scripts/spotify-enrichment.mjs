#!/usr/bin/env node
// Fetches Spotify data for all artists in src/data/artists.ts
// Writes to public/data/spotify-enrichment.json
// Requires: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET env vars

import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  process.exit(1)
}

// Extract Spotify artist IDs from artists.ts via regex
const artistsTs = readFileSync('src/data/artists.ts', 'utf-8')
const urlRegex = /spotify:\s*['"]https:\/\/open\.spotify\.com\/artist\/([A-Za-z0-9]+)['"]/g
const artistEntries = [...artistsTs.matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?spotify:\s*['"]https:\/\/open\.spotify\.com\/artist\/([A-Za-z0-9]+)['"]/g)]
  .map(([, appId, spotifyId]) => ({ appId, spotifyId }))

console.log(`Found ${artistEntries.length} artists with Spotify links`)

// Client credentials token
const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
  },
  body: 'grant_type=client_credentials',
})
const { access_token } = await tokenRes.json()

const result = {}

for (const { appId, spotifyId } of artistEntries) {
  try {
    const [artistRes, tracksRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(`https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?market=NL`, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ])

    const artist = await artistRes.json()
    const tracksData = await tracksRes.json()

    result[appId] = {
      image: artist.images?.[0]?.url ?? null,
      followers: artist.followers?.total ?? 0,
      popularity: artist.popularity ?? 0,
      topTracks: (tracksData.tracks ?? []).slice(0, 3).map((t) => ({
        id: t.id,
        name: t.name,
        previewUrl: t.preview_url ?? null,
        albumImage: t.album?.images?.[1]?.url ?? null,
        spotifyUrl: t.external_urls?.spotify ?? null,
      })),
    }
    console.log(`✓ ${artist.name}`)
  } catch (e) {
    console.warn(`✗ ${appId}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 120)) // Spotify rate limit
}

mkdirSync('public/data', { recursive: true })
writeFileSync(
  'public/data/spotify-enrichment.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), artists: result }, null, 2)
)

console.log(`\nDone — ${Object.keys(result).length} artists enriched`)
