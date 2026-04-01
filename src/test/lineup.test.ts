import { describe, it, expect } from 'vitest'
import { lineup, days, stagesPerDay, stageColors } from '../data/lineup'

describe('Lineup data', () => {
  it('has sets', () => {
    expect(lineup.length).toBeGreaterThan(100)
  })

  it('each set has required fields', () => {
    for (const set of lineup) {
      expect(set.id).toBeTruthy()
      expect(set.artist).toBeTruthy()
      expect(set.stage).toBeTruthy()
      expect(set.day).toBeTruthy()
      expect(set.startTime).toMatch(/^\d{2}:\d{2}$/)
      expect(set.endTime).toMatch(/^\d{2}:\d{2}$/)
    }
  })

  it('has unique set IDs', () => {
    const ids = lineup.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('start time is before end time', () => {
    for (const set of lineup) {
      expect(set.startTime < set.endTime).toBe(true)
    }
  })

  it('has sets for all 4 days', () => {
    for (const day of days) {
      const daySets = lineup.filter((s) => s.day === day.key)
      expect(daySets.length).toBeGreaterThan(0)
    }
  })

  it('all stages in stagesPerDay have a color', () => {
    for (const day of days) {
      for (const stage of stagesPerDay[day.key]) {
        expect(stageColors[stage]).toBeTruthy()
      }
    }
  })

  it('all set stages exist in stageColors', () => {
    for (const set of lineup) {
      expect(stageColors[set.stage]).toBeTruthy()
    }
  })
})

describe('Days data', () => {
  it('has 4 days', () => {
    expect(days).toHaveLength(4)
  })

  it('days are in order', () => {
    expect(days[0].key).toBe('thursday')
    expect(days[1].key).toBe('friday')
    expect(days[2].key).toBe('saturday')
    expect(days[3].key).toBe('sunday')
  })
})
