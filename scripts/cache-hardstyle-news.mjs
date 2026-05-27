#!/usr/bin/env node
// Scrapes hardstyle.com/en/news and caches articles to public/data/hardstyle-news.json
// Server-rendered HTML — no headless browser needed

import { writeFileSync, mkdirSync } from 'fs'

const BASE_URL = 'https://hardstyle.com'
const NEWS_URL = `${BASE_URL}/en/news`

const res = await fetch(NEWS_URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})

if (!res.ok) {
  console.error(`Failed to fetch hardstyle.com/en/news: ${res.status}`)
  process.exit(1)
}

const html = await res.text()

// Parse DD.MM.YYYY to ISO date string (strip "Premium" label if present)
function parseDate(raw) {
  const clean = raw.replace(/Premium/g, '').trim()
  const m = clean.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

// Extract leading image from an anchor block: try data-src first, then srcset
function extractImage(block) {
  const dataSrc = block.match(/data-src="([^"]+)"/)
  if (dataSrc) return dataSrc[1].startsWith('http') ? dataSrc[1] : `${BASE_URL}${dataSrc[1]}`
  const srcset = block.match(/srcset="([^\s"]+)/)
  if (srcset) return srcset[1].startsWith('http') ? srcset[1] : `${BASE_URL}${srcset[1]}`
  return null
}

// Decode common HTML entities
function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[A-Za-z]+;/g, '').replace(/&#\d+;/g, '')
    .trim()
}

const articles = []

// 1. Featured highlight: <a class="newsHighlight" href="...">
for (const [, href, block] of html.matchAll(/<a class="newsHighlight" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
  const titleMatch = block.match(/<span class="bigTitle">([^<]+)<\/span>/)
  const dateMatch = block.match(/<span class="date">([^<]+)<\/span>/)
  const tagsMatch = [...block.matchAll(/<span class="tag"[^>]*>([^<]+)<\/span>/g)].map(m => m[1].replace('#', ''))
  if (!titleMatch) continue
  articles.push({
    title: decode(titleMatch[1]),
    link: href.startsWith('http') ? href : `${BASE_URL}${href}`,
    image: extractImage(block),
    date: dateMatch ? parseDate(dateMatch[1]) : null,
    category: tagsMatch.map(t => t.toLowerCase()).join(','),
  })
}

// 2. Block items: <a class="newsBlockItem" href="...">
for (const [, href, block] of html.matchAll(/<a class="newsBlockItem" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
  const titleMatch = block.match(/<span class="mediumTitle">([^<]+)<\/span>/)
  const dateMatch = block.match(/<span class="date">([^<]+)<\/span>/)
  const tagsMatch = [...block.matchAll(/<span class="tag"[^>]*>([^<]+)<\/span>/g)].map(m => m[1].replace('#', ''))
  if (!titleMatch) continue
  articles.push({
    title: decode(titleMatch[1]),
    link: href.startsWith('http') ? href : `${BASE_URL}${href}`,
    image: extractImage(block),
    date: dateMatch ? parseDate(dateMatch[1]) : null,
    category: tagsMatch.map(t => t.toLowerCase()).join(','),
  })
}

// 3. List items: <a class="newsListItem" href="..."> (text-only, no image)
for (const [, href, block] of html.matchAll(/<a class="newsListItem" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
  const titleMatch = block.match(/<span class="newsTitle[^"]*">(?:<span[^>]*>[^<]*<\/span>)?([^<]+)<\/span>/)
  const dateMatch = block.match(/<span class="date">([^<]+)<\/span>/)
  const tagsMatch = [...block.matchAll(/<span class="tag"[^>]*>([^<]+)<\/span>/g)].map(m => m[1].replace('#', ''))
  if (!titleMatch) continue
  articles.push({
    title: decode(titleMatch[1]),
    link: href.startsWith('http') ? href : `${BASE_URL}${href}`,
    image: null,
    date: dateMatch ? parseDate(dateMatch[1]) : null,
    category: tagsMatch.map(t => t.toLowerCase()).join(','),
  })
}

// Deduplicate by link
const seen = new Set()
const unique = articles.filter((a) => {
  if (seen.has(a.link)) return false
  seen.add(a.link)
  return true
}).slice(0, 30)

mkdirSync('public/data', { recursive: true })
writeFileSync(
  'public/data/hardstyle-news.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), articles: unique }, null, 2)
)

console.log(`Cached ${unique.length} articles`)
