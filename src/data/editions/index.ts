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

export { default as edition2025 } from './2025'
export { default as edition2026 } from './2026'

import e2025 from './2025'
import e2026 from './2026'

export const editions: Edition[] = [e2026, e2025]

export function getEdition(year: number): Edition | undefined {
  return editions.find((e) => e.year === year)
}

export function getCurrentEdition(): Edition {
  return editions.find((e) => e.isCurrent) || editions[0]
}
