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

// Extract article cards — hardstyle.com uses article elements with consistent structure
const articles = []

// Match article blocks (each news item)
const articleBlocks = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)]

for (const [, block] of articleBlocks) {
  // Extract link and title from anchor
  const linkMatch = block.match(/<a[^>]+href="([^"]+)"[^>]*>/)
  const titleMatch = block.match(/<h[23][^>]*>\s*(?:<a[^>]*>)?\s*([^<]+)\s*(?:<\/a>)?\s*<\/h[23]>/)
  const imgMatch = block.match(/<img[^>]+src="([^"]+)"/)
  const dateMatch = block.match(/<time[^>]*datetime="([^"]+)"[^>]*>/) || block.match(/datetime="([^"]+)"/)
  const categoryMatch = block.match(/\/en\/news\/([a-z-]+)\//)

  if (!linkMatch || !titleMatch) continue

  let link = linkMatch[1]
  if (link.startsWith('/')) link = `${BASE_URL}${link}`

  const title = titleMatch[1].trim().replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
  const image = imgMatch ? (imgMatch[1].startsWith('http') ? imgMatch[1] : `${BASE_URL}${imgMatch[1]}`) : null
  const date = dateMatch ? dateMatch[1] : null
  const category = categoryMatch ? categoryMatch[1] : 'news'

  if (title && link) {
    articles.push({ title, link, image, date, category })
  }
}

// Deduplicate by link, keep first 30
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
