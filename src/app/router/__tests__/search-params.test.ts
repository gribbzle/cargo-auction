import { describe, it, expect } from 'vitest'
import { auctionListSearchSchema } from '@/app/router/search-params'

describe('auctionListSearchSchema', () => {
  it('parses empty object to defaults', () => {
    const result = auctionListSearchSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({})
    }
  })

  it('parses valid cargo_num', () => {
    const result = auctionListSearchSchema.safeParse({ cargo_num: 'ЗАЯВ-0001' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cargo_num).toBe('ЗАЯВ-0001')
    }
  })

  it('parses valid auc_type array', () => {
    const result = auctionListSearchSchema.safeParse({ auc_type: ['Request', 'Up'] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.auc_type).toEqual(['Request', 'Up'])
    }
  })

  it('parses valid status array', () => {
    const result = auctionListSearchSchema.safeParse({ status: ['Auction', 'WaitDeal'] })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toEqual(['Auction', 'WaitDeal'])
    }
  })

  it('parses city filters', () => {
    const result = auctionListSearchSchema.safeParse({
      load_city: 'Москва',
      unload_city: 'Санкт-Петербург',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.load_city).toBe('Москва')
      expect(result.data.unload_city).toBe('Санкт-Петербург')
    }
  })

  it('parses date range', () => {
    const result = auctionListSearchSchema.safeParse({
      load_date_from: '2025-01-01',
      load_date_to: '2025-12-31',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.load_date_from).toBe('2025-01-01')
      expect(result.data.load_date_to).toBe('2025-12-31')
    }
  })

  it('parses boolean flags', () => {
    const result = auctionListSearchSchema.safeParse({
      is_available: true,
      is_bidder: false,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_available).toBe(true)
      expect(result.data.is_bidder).toBe(false)
    }
  })

  it('parses price range', () => {
    const result = auctionListSearchSchema.safeParse({
      price_from: 1000,
      price_to: 50000,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price_from).toBe(1000)
      expect(result.data.price_to).toBe(50000)
    }
  })

  it('parses pagination', () => {
    const result = auctionListSearchSchema.safeParse({ page: 2, per_page: 50 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(2)
      expect(result.data.per_page).toBe(50)
    }
  })

  it('strips unknown fields', () => {
    const result = auctionListSearchSchema.safeParse({
      cargo_num: 'TEST',
      unknown_field: 'should be stripped',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('unknown_field')
    }
  })

  it('parses all filters combined', () => {
    const result = auctionListSearchSchema.safeParse({
      cargo_num: 'ЗАЯВ',
      auc_type: ['Request'],
      status: ['Auction'],
      load_city: 'Москва',
      unload_city: 'Казань',
      load_date_from: '2025-06-01',
      load_date_to: '2025-06-30',
      is_available: true,
      is_bidder: false,
      price_from: 5000,
      price_to: 100000,
      per_page: 10,
      page: 1,
    })
    expect(result.success).toBe(true)
  })
})
