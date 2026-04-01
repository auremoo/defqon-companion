import { describe, it, expect } from 'vitest'
import { colors } from '../data/colors'

describe('Colors data', () => {
  it('has 9 colors', () => {
    expect(colors).toHaveLength(9)
  })

  it('each color has required fields', () => {
    for (const color of colors) {
      expect(color.id).toBeTruthy()
      expect(color.name).toBeTruthy()
      expect(color.bpm).toBeTruthy()
      expect(color.hex).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(color.artists.length).toBeGreaterThan(0)
    }
  })

  it('has unique IDs', () => {
    const ids = colors.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique names', () => {
    const names = colors.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('each color has at least one music link', () => {
    for (const color of colors) {
      const hasLink = color.spotify || color.youtube || color.apple || color.deezer || color.soundcloud
      expect(hasLink).toBeTruthy()
    }
  })
})
