import { describe, it, expect } from 'vitest'
import { generateCodename } from '@/lib/generateCodename'

describe('generateCodename', () => {
  it('returns a non-empty string', () => {
    const result = generateCodename()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('output matches PascalCase pattern of three capitalised segments', () => {
    const result = generateCodename()
    expect(result).toMatch(/^([A-Z][a-z]+){3}$/)
  })

  it('produces more than one unique result across 50 calls', () => {
    const results = new Set(
      Array.from({ length: 50 }, () => generateCodename())
    )
    expect(results.size).toBeGreaterThan(1)
  })
})
