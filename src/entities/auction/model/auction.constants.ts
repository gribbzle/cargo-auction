import type { AuctionType, AuctionStatus, TradingStatus, BidMeasurementType } from '@/shared/api/dto'

export const AUCTION_TYPE_LABELS: Record<AuctionType, string> = {
  Request: 'Заявка',
  Up: 'Повышение',
  Down: 'Понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Неизвестно',
}

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  Planning: 'Планирование',
  Auction: 'Аукцион',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

export const TRADING_STATUS_LABELS: Record<TradingStatus, string> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Проигрываю',
  OnPending: 'Ожидание',
  Confirmed: 'Подтверждено',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принято',
  Unknown: 'Неизвестно',
}

export const BID_MEASUREMENT_LABELS: Record<BidMeasurementType, string> = {
  PerRoute: 'За маршрут',
  PerKm: 'За км',
  Unknown: '—',
}

export const TRADING_STATUS_COLORS: Record<TradingStatus, 'success' | 'warning' | 'error' | 'info' | 'default' | 'purple'> = {
  NotParticipating: 'default',
  Leading: 'success',
  Losing: 'warning',
  OnPending: 'info',
  Confirmed: 'info',
  ChoosingWinner: 'purple',
  Winner: 'success',
  Accepted: 'success',
  Unknown: 'default',
}

export function getAuctionTypeLabel(type: AuctionType): string {
  return AUCTION_TYPE_LABELS[type] ?? AUCTION_TYPE_LABELS.Unknown
}

export function getAuctionStatusLabel(status: AuctionStatus): string {
  return AUCTION_STATUS_LABELS[status] ?? AUCTION_STATUS_LABELS.Unknown
}

export function getTradingStatusLabel(status: TradingStatus): string {
  return TRADING_STATUS_LABELS[status] ?? TRADING_STATUS_LABELS.Unknown
}

export function getBidMeasurementLabel(type: BidMeasurementType): string {
  return BID_MEASUREMENT_LABELS[type] ?? BID_MEASUREMENT_LABELS.Unknown
}
