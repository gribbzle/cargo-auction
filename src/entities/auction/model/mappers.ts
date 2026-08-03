import type {
  AuctionShowResponse,
  AuctionListItem,
  BetItem,
  RoutePoint,
} from '@/shared/api/dto'

export interface AuctionRouteSummary {
  loadCity: string
  unloadCity: string
  loadDate: string
  unloadDate: string
}

export interface AuctionPriceSummary {
  current: number | null
  start: number | null
  step: number | null
  min: number | null
  max: number | null
  pricePerKm: number
}

export interface AuctionCargoSummary {
  name: string
  bodyType: string
  weight: number
  volume: number
  truckCount: number
  isInternational: boolean
}

export interface AuctionDetailSummary {
  uuid: string
  cargoNum: string
  aucType: string
  status: string
  tradingStatus: string
  route: AuctionRouteSummary
  price: AuctionPriceSummary
  cargo: AuctionCargoSummary
  canSetBet: boolean
  isFavorite: boolean
  hasMyBet: boolean
}

export interface BetSummary {
  id: number
  organizationName: string
  organizationInn: string
  contactName: string
  contactPhone: string
  priceWithVat: number
  priceNoVat: number
  place: number | null
  isWinner: boolean
  isRejected: boolean
  cancelReason: string
  createdAt: string
}

export function mapRouteSummary(routes: RoutePoint[]): AuctionRouteSummary {
  const first = routes[0]
  const last = routes[routes.length - 1] ?? first

  return {
    loadCity: first?.location.city_name ?? '—',
    unloadCity: last?.location.city_name ?? '—',
    loadDate: first?.start_date ?? '',
    unloadDate: last?.end_date ?? '',
  }
}

export function mapAuctionDetailSummary(
  auction: AuctionShowResponse,
  uuid: string,
): AuctionDetailSummary {
  const route = mapRouteSummary(auction.routes)

  return {
    uuid,
    cargoNum: auction.main.cargo_num,
    aucType: auction.main.auc_type,
    status: auction.trading.status,
    tradingStatus: auction.trading.status_mobile,
    route,
    price: {
      current: auction.trading.price.current,
      start: auction.trading.price.start,
      step: auction.trading.price.step,
      min: auction.trading.price.min,
      max: auction.trading.price.max,
      pricePerKm: auction.trading.price.price_per_km,
    },
    cargo: {
      name: '',
      bodyType: auction.cargo.body_type,
      weight: 0,
      volume: 0,
      truckCount: auction.cargo.truck_count,
      isInternational: auction.cargo.is_international,
    },
    canSetBet: auction.trading.can_set_bet,
    isFavorite: auction.trading.is_favorite,
    hasMyBet: auction.trading.your.bet,
  }
}

export function mapListItemSummary(item: AuctionListItem) {
  return {
    uuid: item.uuid,
    cargoNum: item.main.cargo_num,
    aucType: item.main.auc_type,
    status: item.trading.status,
    tradingStatus: item.trading.status_mobile,
    loadCity: item.route.load.city,
    unloadCity: item.route.unload.city,
    currentPrice: item.trading.price?.current ?? null,
    canSetBet: item.trading.can_set_bet,
    hasMyBet: item.trading.your?.bet ?? false,
    isFavorite: item.trading.is_favorite,
  }
}

export function mapBetSummary(bet: BetItem): BetSummary {
  return {
    id: bet.id,
    organizationName: bet.organization_name,
    organizationInn: bet.organization_inn,
    contactName: bet.contact_name,
    contactPhone: bet.contact_phone,
    priceWithVat: bet.price_with_vat,
    priceNoVat: bet.price_no_vat,
    place: bet.place,
    isWinner: bet.is_win,
    isRejected: bet.is_rejected,
    cancelReason: bet.cancel_reason,
    createdAt: bet.created_at,
  }
}
