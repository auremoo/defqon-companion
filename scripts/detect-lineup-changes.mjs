#!/usr/bin/env node
// Checks the Defqon.1 programme page for changes.
// Stores a SHA256 hash in .github/lineup-hash.txt.
// Opens a GitHub issue if content changed since last run.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { createHash } from 'crypto'

const PAGE_URL = 'https://www.defqon.nl/en/programme'
const HASH_FILE = '.github/lineup-hash.txt'

const res = await fetch(PAGE_URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})

if (!res.ok) {
  console.error(`Failed to fetch programme page: ${res.status}`)
  process.exit(1)
}

const html = await res.text()

// Hash only the relevant part to avoid noise from ads/analytics
const relevantContent = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html
const hash = createHash('sha256').update(relevantContent).digest('hex')

mkdirSync('.github', { recursive: true })
const prevHash = existsSync(HASH_FILE) ? readFileSync(HASH_FILE, 'utf-8').trim() : null

writeFileSync(HASH_FILE, hash)

if (!prevHash) {
  console.log('First run — hash stored, no comparison possible yet')
  process.exit(0)
}

if (prevHash === hash) {
  console.log('No changes detected')
  process.exit(0)
}

console.log('Change detected!')

const token = process.env.GITHUB_TOKEN
const repo = process.env.GITHUB_REPOSITORY

if (!token || !repo) {
  console.warn('GITHUB_TOKEN or GITHUB_REPOSITORY not set — skipping issue creation')
  process.exit(0)
}

// Ensure the label exists
await fetch(`https://api.github.com/repos/${repo}/labels`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'lineup-update', color: 'd93f0b', description: 'Defqon lineup page changed' }),
}).catch(() => {}) // Ignore if label already exists

const issueRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '🎵 Defqon.1 programme page changed',
    body: [
      `The [Defqon.1 programme page](${PAGE_URL}) has changed since the last check.`,
      '',
      'Please review and update `src/data/lineup.ts` if needed.',
      '',
      `_Detected at ${new Date().toISOString()}_`,
    ].join('\n'),
    labels: ['lineup-update'],
  }),
})

if (issueRes.ok) {
  const issue = await issueRes.json()
  console.log(`Issue created: ${issue.html_url}`)
} else {
  console.warn('Failed to create issue:', await issueRes.text())
}
