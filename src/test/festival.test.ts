import { describe, it, expect } from 'vitest'
import { festival, defaultChecklist } from '../data/festival'

describe('Festival data', () => {
  it('has correct year', () => {
    expect(festival.year).toBe(2026)
  })

  it('has valid dates', () => {
    const start = new Date(festival.startDate)
    const end = new Date(festival.endDate)
    expect(start.getTime()).toBeLessThan(end.getTime())
    expect(start.getFullYear()).toBe(2026)
  })

  it('has location', () => {
    expect(festival.location).toContain('Biddinghuizen')
  })

  it('has theme', () => {
    expect(festival.theme).toBe('Sacred Oath')
  })

  it('has schedule entries', () => {
    expect(festival.schedule.length).toBe(4)
  })

  it('is 18+', () => {
    expect(festival.ageRestriction).toBe('18+')
  })
})

describe('Default checklist', () => {
  it('has items', () => {
    expect(defaultChecklist.length).toBeGreaterThan(10)
  })

  it('each item has required fields', () => {
    for (const item of defaultChecklist) {
      expect(item.id).toBeTruthy()
      expect(item.label).toBeTruthy()
      expect(item.category).toMatch(/^(essentials|camping|comfort)$/)
      expect(item.checked).toBe(false)
    }
  })

  it('has unique IDs', () => {
    const ids = defaultChecklist.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has items in each category', () => {
    for (const cat of ['essentials', 'camping', 'comfort']) {
      const items = defaultChecklist.filter((i) => i.category === cat)
      expect(items.length).toBeGreaterThan(0)
    }
  })
})
