import { describe, it, expect } from 'vitest'
import { auctionKeys } from '@/shared/lib/query-keys'
import type { AuctionListRequest } from '@/shared/api/dto'

describe('auctionKeys', () => {
  it('has correct base key', () => {
    expect(auctionKeys.all).toEqual(['auctions'])
  })

  it('generates list key', () => {
    expect(auctionKeys.lists()).toEqual(['auctions', 'list'])
  })

  it('generates list key with params', () => {
    const params: AuctionListRequest = { cargo_num: 'TEST', page: 1 }
    expect(auctionKeys.list(params)).toEqual(['auctions', 'list', params])
  })

  it('generates detail key', () => {
    expect(auctionKeys.detail('uuid-123')).toEqual(['auctions', 'detail', 'uuid-123'])
  })

  it('generates bets key', () => {
    expect(auctionKeys.bets('uuid-123')).toEqual(['auctions', 'bets', 'uuid-123'])
  })

  it('generates tradingPrice key', () => {
    expect(auctionKeys.tradingPrice('uuid-123')).toEqual(['auctions', 'trading-price', 'uuid-123'])
  })

  it('produces stable references for same params', () => {
    const params: AuctionListRequest = { cargo_num: 'X' }
    const key1 = auctionKeys.list(params)
    const key2 = auctionKeys.list(params)
    expect(key1).toEqual(key2)
  })
})
