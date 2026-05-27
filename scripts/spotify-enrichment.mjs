#!/usr/bin/env node
// Fetches Spotify data for all artists in src/data/artists.ts
// Searches by artist name (more reliable than stored URLs which may be stale)
// Writes to public/data/spotify-enrichment.json

import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  process.exit(1)
}

// Extract artist { id, name } pairs from artists.ts — one object block at a time
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
  console.error('Failed to get Spotify token:', tokenData)
  process.exit(1)
}
const { access_token } = tokenData

const result = {}

for (const { appId, name } of artistEntries) {
  try {
    // Search by name — more reliable than stored IDs
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const searchData = await searchRes.json()
    const artist = searchData.artists?.items?.[0]

    if (!artist) {
      console.warn(`✗ ${name}: not found on Spotify`)
      continue
    }

    // Search returns SimplifiedArtistObject — fetch full object + top tracks separately
    const [fullRes, tracksRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=NL`, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ])
    const full = await fullRes.json()
    const tracksData = await tracksRes.json()

    if (full.error) {
      console.warn(`✗ ${name} artist endpoint error: ${full.error.status} ${full.error.message}`)
      continue
    }
    if (tracksData.error) {
      console.warn(`  top-tracks error for ${name}: ${tracksData.error.status} ${tracksData.error.message}`)
    }

    result[appId] = {
      spotifyId: artist.id,
      image: full.images?.[0]?.url ?? null,
      followers: full.followers?.total ?? 0,
      popularity: full.popularity ?? 0,
      topTracks: (tracksData.tracks ?? []).slice(0, 3).map((t) => ({
        id: t.id,
        name: t.name,
        previewUrl: t.preview_url ?? null,
        albumImage: t.album?.images?.[1]?.url ?? null,
        spotifyUrl: t.external_urls?.spotify ?? null,
      })),
    }
    console.log(`✓ ${name} (${full.followers?.total?.toLocaleString()} followers)`)
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
