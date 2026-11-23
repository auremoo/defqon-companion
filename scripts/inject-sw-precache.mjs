#!/usr/bin/env node
// Reads the Vite build manifest and injects into dist/sw.js:
//   - PRECACHE_URLS: the app shell and every chunk, cached on install
//   - OPTIONAL_URLS: chunks cached on install only for users who already use them
//   - WARM_URLS:     the data files, fetched best-effort on install
//   - VERSION:       a hash of the precached content, used to name the cache

import { createHash } from 'crypto'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf8'))
const BASE = '/defqon-companion/'

// Unhashed files the shell needs offline. Their content feeds VERSION, since
// their URL does not change when they do.
const STATIC_FILES = ['manifest.json', 'favicon.svg', 'icon-192.png']

// The Firestore SDK is the largest chunk and only signed-in users load it:
// don't make every visitor download it in the background.
const OPTIONAL_SOURCES = ['src/lib/firebaseStore.ts']

const optionalUrls = OPTIONAL_SOURCES.map((source) => {
  const file = manifest[source]?.file
  if (!file) {
    console.error(`Optional chunk "${source}" not found in the Vite manifest`)
    process.exit(1)
  }
  return BASE + file
})

const urls = new Set([BASE, ...STATIC_FILES.map((f) => BASE + f)])

for (const entry of Object.values(manifest)) {
  if (entry.file) urls.add(BASE + entry.file)
  for (const css of entry.css ?? []) urls.add(BASE + css)
}
for (const url of optionalUrls) urls.delete(url)

const precacheUrls = [...urls].sort()

const warmUrls = existsSync('dist/data')
  ? readdirSync('dist/data')
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => `${BASE}data/${f}`)
  : []

const hash = createHash('sha256').update(JSON.stringify([precacheUrls, optionalUrls]))
for (const file of ['index.html', ...STATIC_FILES]) hash.update(readFileSync(`dist/${file}`))
const version = hash.digest('hex').slice(0, 12)

let sw = readFileSync('dist/sw.js', 'utf8')

function inject(placeholder, replacement) {
  if (!sw.includes(placeholder)) {
    console.error(`Could not find "${placeholder}" in dist/sw.js`)
    process.exit(1)
  }
  sw = sw.replace(placeholder, replacement)
}

inject(`const VERSION = 'dev'`, `const VERSION = '${version}'`)
inject('const PRECACHE_URLS = []', `const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)}`)
inject('const OPTIONAL_URLS = []', `const OPTIONAL_URLS = ${JSON.stringify(optionalUrls, null, 2)}`)
inject('const WARM_URLS = []', `const WARM_URLS = ${JSON.stringify(warmUrls, null, 2)}`)

writeFileSync('dist/sw.js', sw)
console.log(`Service worker ${version}: ${precacheUrls.length} precached URLs, ${optionalUrls.length} optional, ${warmUrls.length} warmed data files.`)
