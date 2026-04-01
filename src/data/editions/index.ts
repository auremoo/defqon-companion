import type { Set, Day, Stage } from '../lineup'

export interface Edition {
  year: number
  theme: string
  startDate: string
  endDate: string
  location: string
  isCurrent: boolean
  stagesPerDay: Record<Day, Stage[]>
  lineup: Set[]
}

export interface EditionMeta {
  year: number
  theme: string
  isCurrent: boolean
}

export const editionMetas: EditionMeta[] = [
  { year: 2026, theme: 'Sacred Oath', isCurrent: true },
  { year: 2025, theme: 'Where Legends Rise', isCurrent: false },
]

const cache = new Map<number, Edition>()

export async function loadEdition(year: number): Promise<Edition> {
  const cached = cache.get(year)
  if (cached) return cached

  let edition: Edition
  if (year === 2026) {
    edition = (await import('./2026')).default
  } else if (year === 2025) {
    edition = (await import('./2025')).default
  } else {
    throw new Error(`Unknown edition: ${year}`)
  }

  cache.set(year, edition)
  return edition
}

// Sync access for initial load — imports 2026 only
import e2026 from './2026'
cache.set(2026, e2026)

export const editions: Edition[] = [e2026]

export function getCurrentEdition(): Edition {
  return e2026
}
