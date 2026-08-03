import { describe, it, expect } from 'vitest'
import {
  getAuctionTypeLabel,
  getAuctionStatusLabel,
  getTradingStatusLabel,
  getBidMeasurementLabel,
  TRADING_STATUS_LABELS,
  TRADING_STATUS_COLORS,
} from '../auction.constants'

describe('getAuctionTypeLabel', () => {
  it('returns Russian label for Request', () => {
    expect(getAuctionTypeLabel('Request')).toBe('Заявка')
  })

  it('returns Russian label for Up', () => {
    expect(getAuctionTypeLabel('Up')).toBe('Повышение')
  })

  it('returns Russian label for Down', () => {
    expect(getAuctionTypeLabel('Down')).toBe('Понижение')
  })

  it('returns Russian label for FixPrice', () => {
    expect(getAuctionTypeLabel('FixPrice')).toBe('Фикс. цена')
  })

  it('returns Unknown for unknown type', () => {
    expect(getAuctionTypeLabel('Unknown')).toBe('Неизвестно')
  })
})

describe('getAuctionStatusLabel', () => {
  it('returns Russian label for Auction', () => {
    expect(getAuctionStatusLabel('Auction')).toBe('Аукцион')
  })

  it('returns Russian label for Finished', () => {
    expect(getAuctionStatusLabel('Finished')).toBe('Завершён')
  })

  it('returns Russian label for Planning', () => {
    expect(getAuctionStatusLabel('Planning')).toBe('Планирование')
  })

  it('returns Russian label for Canceled', () => {
    expect(getAuctionStatusLabel('Canceled')).toBe('Отменён')
  })

  it('returns Unknown for unknown status', () => {
    expect(getAuctionStatusLabel('Unknown')).toBe('Неизвестно')
  })
})

describe('getTradingStatusLabel', () => {
  it('returns Russian label for Leading', () => {
    expect(getTradingStatusLabel('Leading')).toBe('Лидирую')
  })

  it('returns Russian label for Losing', () => {
    expect(getTradingStatusLabel('Losing')).toBe('Проигрываю')
  })

  it('returns Russian label for Winner', () => {
    expect(getTradingStatusLabel('Winner')).toBe('Победитель')
  })

  it('returns Russian label for NotParticipating', () => {
    expect(getTradingStatusLabel('NotParticipating')).toBe('Не участвую')
  })

  it('returns Unknown for unknown status', () => {
    expect(getTradingStatusLabel('Unknown')).toBe('Неизвестно')
  })
})

describe('getBidMeasurementLabel', () => {
  it('returns label for PerRoute', () => {
    expect(getBidMeasurementLabel('PerRoute')).toBe('За маршрут')
  })

  it('returns label for PerKm', () => {
    expect(getBidMeasurementLabel('PerKm')).toBe('За км')
  })

  it('returns Unknown for unknown type', () => {
    expect(getBidMeasurementLabel('Unknown')).toBe('—')
  })
})

describe('TRADING_STATUS_COLORS', () => {
  it('has color for every status', () => {
    const keys = Object.keys(TRADING_STATUS_LABELS)
    keys.forEach((key) => {
      expect(TRADING_STATUS_COLORS).toHaveProperty(key)
    })
  })

  it('uses success for Leading', () => {
    expect(TRADING_STATUS_COLORS.Leading).toBe('success')
  })

  it('uses success for Winner', () => {
    expect(TRADING_STATUS_COLORS.Winner).toBe('success')
  })

  it('uses error for Losing', () => {
    expect(TRADING_STATUS_COLORS.Losing).toBe('warning')
  })
})
