import { describe, it, expect } from 'vitest'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

describe('i18n translations', () => {
  const enKeys = flattenKeys(en)
  const frKeys = flattenKeys(fr)

  it('EN has translations', () => {
    expect(enKeys.length).toBeGreaterThan(50)
  })

  it('FR has translations', () => {
    expect(frKeys.length).toBeGreaterThan(50)
  })

  it('FR has all EN keys', () => {
    const missing = enKeys.filter((k) => !frKeys.includes(k))
    if (missing.length > 0) {
      console.warn('Missing FR translations:', missing)
    }
    expect(missing).toEqual([])
  })

  it('EN has all FR keys', () => {
    const extra = frKeys.filter((k) => !enKeys.includes(k))
    if (extra.length > 0) {
      console.warn('Extra FR keys not in EN:', extra)
    }
    expect(extra).toEqual([])
  })

  it('no empty translation values in EN', () => {
    for (const key of enKeys) {
      const parts = key.split('.')
      let value: unknown = en
      for (const part of parts) value = (value as Record<string, unknown>)[part]
      expect(value, `EN key "${key}" is empty`).toBeTruthy()
    }
  })

  it('no empty translation values in FR', () => {
    for (const key of frKeys) {
      const parts = key.split('.')
      let value: unknown = fr
      for (const part of parts) value = (value as Record<string, unknown>)[part]
      expect(value, `FR key "${key}" is empty`).toBeTruthy()
    }
  })
})
