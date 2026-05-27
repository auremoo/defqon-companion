#!/usr/bin/env node
// Scrapes hardstyle.com/en/events/update (upcoming hardstyle events)
// The /update endpoint returns the event list partial directly

import { writeFileSync, mkdirSync } from 'fs'

const BASE = 'https://hardstyle.com'
const URL  = `${BASE}/en/events/update`

const res = await fetch(URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; defqon-companion-bot/1.0)' },
})
if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1) }
const html = await res.text()

function decode(s) {
  return s.replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/&quot;/g,'"')
          .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').trim()
}

// Month → number
const MONTHS = { January:1,February:2,March:3,April:4,May:5,June:6,
                 July:7,August:8,September:9,October:10,November:11,December:12 }

const events = []
let currentMonth = null
const today = new Date()
const currentYear = today.getFullYear()

// Month section headers: <div class="normalTitle">May</div>
// Event entries: <span class="event lightColor big"><a href="...">
const monthRe = /<div class="normalTitle">(\w+)<\/div>/g
const eventBlockRe = /<span class="event[^"]*">([\s\S]*?)<\/span><span class="links">([\s\S]*?)<\/span><\/span>/g

// Split HTML into month sections
const sections = html.split(/<div class="normalTitle">(\w+)<\/div>/)
// sections: [before, monthName, content, monthName2, content2, ...]
for (let i = 1; i < sections.length; i += 2) {
  const monthName = sections[i].trim()
  const section = sections[i + 1] ?? ''
  const monthNum = MONTHS[monthName]
  if (!monthNum) continue

  // Infer year: if month < current month → next year
  const year = monthNum >= today.getMonth() + 1 ? currentYear : currentYear + 1

  for (const [, eventBody, linksBody] of section.matchAll(/<span class="event[^"]*"><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)<\/span>/g)) {
    // href is the first capture group — re-match from a cleaner pattern
    const hrefMatch   = section.match(/<a href="(\/en\/events\/[^"]+)"/)
    // Get all events in this section
    for (const [, href, body] of section.matchAll(/<a href="(\/en\/events\/[^"]+)"[^>]*>([\s\S]*?)(?=<a href="\/en\/events\/|<span class="links">)/g)) {
      const titleMatch    = body.match(/<span class="eventTitle">([^<]+)<\/span>/)
      const locationMatch = body.match(/<span class="info location">([^<]+)<\/span>/)
      const timeMatch     = body.match(/<span class="info time">([^<]+)<\/span>/)
      const dateDayMatch  = body.match(/<span class="respDate">(\d+)\s*<\/span>/)
      const imageMatch    = body.match(/data-src="([^"]+)"/)

      if (!titleMatch) continue

      const day = dateDayMatch ? parseInt(dateDayMatch[1], 10) : 1
      const dateStr = `${year}-${String(monthNum).padStart(2,'0')}-${String(day).padStart(2,'0')}`

      events.push({
        title: decode(titleMatch[1]),
        link: `${BASE}${href}`,
        image: imageMatch ? (imageMatch[1].startsWith('http') ? imageMatch[1] : `${BASE}${imageMatch[1]}`) : null,
        location: locationMatch ? decode(locationMatch[1]) : '',
        time: timeMatch ? decode(timeMatch[1]) : '',
        date: dateStr,
        month: monthName,
      })
    }
  }
}

// Deduplicate by link and sort by date
const seen = new Set()
const unique = events
  .filter(e => { if (seen.has(e.link)) return false; seen.add(e.link); return true })
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 60)

mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/hardstyle-events.json',
  JSON.stringify({ updatedAt: new Date().toISOString(), events: unique }, null, 2))
console.log(`Cached ${unique.length} events`)
