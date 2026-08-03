import { describe, it, expect } from 'vitest'
import {
  createPlaceBetSchema,
  getDefaultBetValue,
  getQuickBetValue,
  isQuickBetDisabled,
} from '../place-bet.schema'
import type { AuctionShowTradingPrice } from '@/shared/api/dto'

const mockPrice: AuctionShowTradingPrice = {
  start: 200000,
  start_no_vat: 160000,
  current: 150000,
  current_no_vat: 120000,
  available: 151000,
  available_no_vat: 120800,
  min: 145000,
  min_no_vat: 116000,
  max: 200000,
  max_no_vat: 160000,
  step: 1000,
  step_no_vat: 800,
  price_per_km: 25,
}

describe('createPlaceBetSchema', () => {
  it('allows valid bet within range', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 150000 })
    expect(result.success).toBe(true)
  })

  it('rejects bet below min', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 144000 })
    expect(result.success).toBe(false)
  })

  it('rejects bet above max', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 201000 })
    expect(result.success).toBe(false)
  })

  it('rejects bet not aligned to step', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 150500 })
    expect(result.success).toBe(false)
  })

  it('allows exact min', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 145000 })
    expect(result.success).toBe(true)
  })

  it('allows exact max', () => {
    const schema = createPlaceBetSchema(mockPrice)
    const result = schema.safeParse({ price: 200000 })
    expect(result.success).toBe(true)
  })
})

describe('getDefaultBetValue', () => {
  it('returns min when available', () => {
    expect(getDefaultBetValue(mockPrice)).toBe(145000)
  })

  it('falls back to current when min is null', () => {
    expect(getDefaultBetValue({ ...mockPrice, min: null })).toBe(150000)
  })

  it('returns 0 when both are null', () => {
    expect(getDefaultBetValue({ ...mockPrice, min: null, current: null })).toBe(0)
  })
})

describe('getQuickBetValue', () => {
  it('calculates 90% of current, clamped to min', () => {
    const result = getQuickBetValue('90%', mockPrice)
    expect(result).toBe(145000)
  })

  it('calculates 95% of current, clamped to min', () => {
    const result = getQuickBetValue('95%', mockPrice)
    expect(result).toBe(145000)
  })

  it('returns 100% of current', () => {
    const result = getQuickBetValue('100%', mockPrice)
    expect(result).toBe(150000)
  })

  it('returns min', () => {
    const result = getQuickBetValue('min', mockPrice)
    expect(result).toBe(145000)
  })

  it('returns max', () => {
    const result = getQuickBetValue('max', mockPrice)
    expect(result).toBe(200000)
  })

  it('clamps to min', () => {
    const result = getQuickBetValue('90%', { ...mockPrice, current: 10000 })
    expect(result).toBe(145000)
  })

  it('aligns to step', () => {
    const result = getQuickBetValue('90%', { ...mockPrice, current: 146000 })
    expect((result - 145000) % 1000).toBe(0)
  })
})

describe('isQuickBetDisabled', () => {
  it('returns false for valid presets', () => {
    expect(isQuickBetDisabled('min', mockPrice)).toBe(false)
    expect(isQuickBetDisabled('max', mockPrice)).toBe(false)
  })
})
