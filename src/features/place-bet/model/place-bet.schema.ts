import { z } from 'zod/v4'
import type { AuctionShowTradingPrice } from '@/shared/api/dto'

export function createPlaceBetSchema(price: AuctionShowTradingPrice) {
  const minPrice = price.min ?? 0
  const maxPrice = price.max ?? Infinity
  const step = price.step ?? 1

  return z.object({
    price: z
      .number({ error: 'Введите число' })
      .min(minPrice, `Минимальная ставка: ${formatAmount(minPrice)}`)
      .max(maxPrice, `Максимальная ставка: ${formatAmount(maxPrice)}`)
      .refine(
        (val) => (step > 0 ? (val - minPrice) % step === 0 : true),
        `Шаг ставки: ${formatAmount(step)}`,
      ),
  })
}

export type PlaceBetForm = z.infer<ReturnType<typeof createPlaceBetSchema>>

function formatAmount(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`
}

export function getDefaultBetValue(price: AuctionShowTradingPrice): number {
  return price.min ?? price.current ?? 0
}

export function getQuickBetValue(
  preset: '90%' | '95%' | '100%' | 'min' | 'max',
  price: AuctionShowTradingPrice,
): number {
  const current = price.current ?? 0
  const min = price.min ?? 0
  const max = price.max ?? Infinity

  let raw: number
  switch (preset) {
    case '90%':
      raw = Math.floor(current * 0.9)
      break
    case '95%':
      raw = Math.floor(current * 0.95)
      break
    case '100%':
      raw = current
      break
    case 'min':
      raw = min
      break
    case 'max':
      raw = max
      break
  }

  const clamped = Math.max(min, Math.min(raw, max))
  const step = price.step ?? 1
  const aligned = step > 0
    ? Math.ceil((clamped - min) / step) * step + min
    : clamped

  return Math.min(aligned, max)
}

export function isQuickBetDisabled(
  preset: '90%' | '95%' | '100%' | 'min' | 'max',
  price: AuctionShowTradingPrice,
): boolean {
  const value = getQuickBetValue(preset, price)
  const min = price.min ?? 0
  const max = price.max ?? Infinity
  return value < min || value > max
}
