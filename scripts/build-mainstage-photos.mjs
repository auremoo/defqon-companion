#!/usr/bin/env node
// Optimizes mainstage photos and generates the manifest read by the Photos tab
// of the MainStage page (src/pages/Mainstage.tsx).
//
// Drop your source photos in photos-src/mainstages/, either way:
//
//   photos-src/mainstages/2024.jpg          <- one photo for the edition
//   photos-src/mainstages/2024/red.jpg      <- or a folder of photos per edition
//
// Any JPEG / PNG / WebP / TIFF, any size. Then run:
//
//   npm run photos
//
// Output:
//   public/mainstages/<year>/<slug>.webp        full-size (max 1600px wide)
//   public/mainstages/<year>/<slug>-thumb.webp  grid thumbnail (max 640px wide)
//   public/data/mainstage-photos.json           manifest consumed by the app
//
// Sources stay out of git (see .gitignore) — only the optimized output is committed.

import { readdir, mkdir, writeFile, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const SRC_DIR = 'photos-src/mainstages'
const OUT_DIR = 'public/mainstages'
const MANIFEST = 'public/data/mainstage-photos.json'

const FULL_WIDTH = 1600
const THUMB_WIDTH = 640
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// "IMG_1234.jpg" or "2024.jpg" -> no caption ; "red-stage-endshow.jpg" -> "Red stage endshow"
function captionFrom(name) {
  const base = path.parse(name).name
  if (/^(img|dsc|dscn|p|photo|image)?[-_ ]?\d+$/i.test(base)) return undefined
  const words = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!words) return undefined
  return words.charAt(0).toUpperCase() + words.slice(1)
}

if (!existsSync(SRC_DIR)) {
  console.error(`Source folder not found: ${SRC_DIR}`)
  process.exit(1)
}

// Collect sources as year -> [absolute file paths], from both layouts.
const entries = await readdir(SRC_DIR, { withFileTypes: true })
const sources = new Map()

function add(year, file) {
  if (!sources.has(year)) sources.set(year, [])
  sources.get(year).push(file)
}

for (const entry of entries) {
  const ext = path.extname(entry.name).toLowerCase()

  if (entry.isFile() && EXTS.has(ext)) {
    const year = Number(path.parse(entry.name).name)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      console.warn(`Skipping ${entry.name} — a flat file must be named <year>${ext}`)
      continue
    }
    add(year, path.join(SRC_DIR, entry.name))
    continue
  }

  if (entry.isDirectory() && /^\d{4}$/.test(entry.name)) {
    const dir = path.join(SRC_DIR, entry.name)
    const files = (await readdir(dir, { withFileTypes: true }))
      .filter((f) => f.isFile() && EXTS.has(path.extname(f.name).toLowerCase()))
      .map((f) => path.join(dir, f.name))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    for (const f of files) add(Number(entry.name), f)
  }
}

if (sources.size === 0) {
  console.warn(`No photos found in ${SRC_DIR}/ — nothing to do.`)
}

// Rebuild from scratch so removed sources don't leave orphans behind.
await rm(OUT_DIR, { recursive: true, force: true })

const years = []
let total = 0

for (const year of [...sources.keys()].sort((a, b) => b - a)) {
  const files = sources.get(year)
  const outYearDir = path.join(OUT_DIR, String(year))
  await mkdir(outYearDir, { recursive: true })

  const photos = []
  const usedSlugs = new Set()

  for (const input of files) {
    const name = path.basename(input)
    const baseSlug = slugify(path.parse(name).name) || 'photo'
    let slug = baseSlug
    let n = 2
    while (usedSlugs.has(slug)) slug = `${baseSlug}-${n++}`
    usedSlugs.add(slug)

    const image = sharp(input).rotate() // honour EXIF orientation
    const source = await image.metadata()

    const fullName = `${slug}.webp`
    const thumbName = `${slug}-thumb.webp`

    const full = await image
      .clone()
      .resize({ width: FULL_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(outYearDir, fullName))

    await image
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(path.join(outYearDir, thumbName))

    photos.push({
      src: `mainstages/${year}/${fullName}`,
      thumb: `mainstages/${year}/${thumbName}`,
      width: full.width,
      height: full.height,
      caption: captionFrom(name),
    })
    total++
    console.log(`  ${year}  ${name} (${source.width}x${source.height}) -> ${fullName} (${full.width}x${full.height})`)
  }

  years.push({ year, photos })
}

await writeFile(
  MANIFEST,
  JSON.stringify({ generatedAt: new Date().toISOString(), years }, null, 2) + '\n'
)

console.log(`\n${total} photo(s) across ${years.length} edition(s) -> ${MANIFEST}`)
