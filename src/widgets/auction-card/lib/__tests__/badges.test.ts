import { describe, it, expect } from 'vitest'
import {
  getAuctionTypeBadge,
  getStatusBadge,
  getTradingStatusBadge,
} from '@/widgets/auction-card/lib/badges'
import type { AuctionType, AuctionStatus, TradingStatus } from '@/shared/api/dto'

describe('getAuctionTypeBadge', () => {
  it('returns correct variant for Request', () => {
    expect(getAuctionTypeBadge('Request')).toBe('info')
  })

  it('returns correct variant for Up', () => {
    expect(getAuctionTypeBadge('Up')).toBe('purple')
  })

  it('returns correct variant for Down', () => {
    expect(getAuctionTypeBadge('Down')).toBe('warning')
  })

  it('returns correct variant for FixPrice', () => {
    expect(getAuctionTypeBadge('FixPrice')).toBe('success')
  })

  it('returns default for Unknown', () => {
    expect(getAuctionTypeBadge('Unknown')).toBe('default')
  })

  it('covers all AuctionType values', () => {
    const types: AuctionType[] = ['Request', 'Up', 'Down', 'FixPrice', 'Unknown']
    for (const type of types) {
      expect(getAuctionTypeBadge(type)).toBeDefined()
    }
  })
})

describe('getStatusBadge', () => {
  it('returns correct variant for Planning', () => {
    expect(getStatusBadge('Planning')).toBe('default')
  })

  it('returns correct variant for Auction', () => {
    expect(getStatusBadge('Auction')).toBe('info')
  })

  it('returns correct variant for DeterminateWinner', () => {
    expect(getStatusBadge('DeterminateWinner')).toBe('purple')
  })

  it('returns correct variant for WaitDeal', () => {
    expect(getStatusBadge('WaitDeal')).toBe('warning')
  })

  it('returns correct variant for InProgress', () => {
    expect(getStatusBadge('InProgress')).toBe('success')
  })

  it('returns correct variant for Finished', () => {
    expect(getStatusBadge('Finished')).toBe('default')
  })

  it('returns correct variant for Stopped', () => {
    expect(getStatusBadge('Stopped')).toBe('error')
  })

  it('returns correct variant for Canceled', () => {
    expect(getStatusBadge('Canceled')).toBe('error')
  })

  it('covers all AuctionStatus values', () => {
    const statuses: AuctionStatus[] = [
      'Planning', 'Auction', 'DeterminateWinner', 'WaitDeal',
      'InProgress', 'Finished', 'Stopped', 'Canceled', 'Unknown',
    ]
    for (const status of statuses) {
      expect(getStatusBadge(status)).toBeDefined()
    }
  })
})

describe('getTradingStatusBadge', () => {
  it('returns correct variant for Leading', () => {
    expect(getTradingStatusBadge('Leading')).toBe('success')
  })

  it('returns correct variant for Losing', () => {
    expect(getTradingStatusBadge('Losing')).toBe('warning')
  })

  it('returns correct variant for Winner', () => {
    expect(getTradingStatusBadge('Winner')).toBe('success')
  })

  it('returns correct variant for NotParticipating', () => {
    expect(getTradingStatusBadge('NotParticipating')).toBe('default')
  })

  it('covers all TradingStatus values', () => {
    const statuses: TradingStatus[] = [
      'NotParticipating', 'Leading', 'Losing', 'OnPending',
      'Confirmed', 'ChoosingWinner', 'Winner', 'Accepted', 'Unknown',
    ]
    for (const status of statuses) {
      expect(getTradingStatusBadge(status)).toBeDefined()
    }
  })
})
