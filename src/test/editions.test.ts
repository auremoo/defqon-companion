import { describe, it, expect } from 'vitest'
import { editionMetas, getCurrentEdition, loadEdition } from '../data/editions'

describe('Editions', () => {
  it('has edition metadata', () => {
    expect(editionMetas.length).toBeGreaterThanOrEqual(2)
  })

  it('each meta has required fields', () => {
    for (const meta of editionMetas) {
      expect(meta.year).toBeGreaterThan(2020)
      expect(meta.theme).toBeTruthy()
      expect(typeof meta.isCurrent).toBe('boolean')
    }
  })

  it('has exactly one current edition', () => {
    const current = editionMetas.filter((e) => e.isCurrent)
    expect(current).toHaveLength(1)
  })

  it('getCurrentEdition returns the current edition', () => {
    const current = getCurrentEdition()
    expect(current.isCurrent).toBe(true)
    expect(current.year).toBe(2026)
    expect(current.theme).toBe('Sacred Oath')
  })

  it('getCurrentEdition has a lineup', () => {
    const current = getCurrentEdition()
    expect(current.lineup.length).toBeGreaterThan(0)
  })

  it('loadEdition returns correct edition', async () => {
    const e2026 = await loadEdition(2026)
    expect(e2026.year).toBe(2026)
    expect(e2026.lineup.length).toBeGreaterThan(0)

    const e2025 = await loadEdition(2025)
    expect(e2025.year).toBe(2025)
    expect(e2025.lineup.length).toBeGreaterThan(0)
  })

  it('loadEdition caches results', async () => {
    const first = await loadEdition(2026)
    const second = await loadEdition(2026)
    expect(first).toBe(second)
  })

  it('loadEdition throws for unknown year', async () => {
    await expect(loadEdition(2099)).rejects.toThrow()
  })
})
