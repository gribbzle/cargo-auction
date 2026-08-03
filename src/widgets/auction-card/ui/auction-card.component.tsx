import { useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import type { AuctionListItem } from '@/shared/api/dto'
import { Badge } from '@/shared/ui'
import { usePrefetchAuction } from '@/features/prefetch-auction'
import { FavoriteButton } from '@/features/favorite-toggle'
import { formatCurrency, formatWeight, formatVolume, formatDate } from '../lib/formatters'
import { getAuctionTypeBadge, getStatusBadge, getTradingStatusBadge } from '../lib/badges'
import { getActionButton } from '../lib/action'

interface AuctionCardProps {
  auction: AuctionListItem
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const { main, route, cargo, trading, organizer } = auction
  const action = getActionButton(trading, auction.uuid)
  const prefetchAuction = usePrefetchAuction()

  const handlePrefetch = useCallback(() => {
    prefetchAuction(auction.uuid)
  }, [prefetchAuction, auction.uuid])

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
    >
      {/* Header: cargo num + badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{main.cargo_num}</span>
          <Badge variant={getAuctionTypeBadge(main.auc_type)}>{main.auc_type}</Badge>
          <Badge variant={getStatusBadge(trading.status)}>{trading.status}</Badge>
          <Badge variant={getTradingStatusBadge(trading.status_mobile)}>
            {trading.status_mobile}
          </Badge>
        </div>
        <FavoriteButton auctionUuid={auction.uuid} isFavorite={trading.is_favorite} />
      </div>

      {/* Route: load → unload */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-900">{route.load.city}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium text-gray-900">{route.unload.city}</span>
        </div>
        <div className="mt-1 flex gap-4 text-xs text-gray-500">
          <span>Погрузка: {formatDate(route.load.date)}</span>
          <span>Разгрузка: {formatDate(route.unload.date)}</span>
        </div>
      </div>

      {/* Cargo info */}
      <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="text-gray-500 text-xs block">Груз</span>
          <span className="text-gray-900">{cargo.name}</span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block">Вес</span>
          <span className="text-gray-900">{formatWeight(cargo.weight)}</span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block">Объём</span>
          <span className="text-gray-900">{formatVolume(cargo.volume)}</span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block">Кузов</span>
          <span className="text-gray-900">{cargo.body_type}</span>
        </div>
      </div>

      {/* Price info */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        <div>
          <span className="text-gray-500 text-xs block">Текущая цена</span>
          <span className="font-semibold text-gray-900">
            {trading.price ? formatCurrency(trading.price.current) : '—'}
          </span>
        </div>
        {main.price_per_km != null && (
          <div>
            <span className="text-gray-500 text-xs block">Цена за км</span>
            <span className="text-gray-900">{formatCurrency(main.price_per_km)}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500 text-xs block">Моя ставка</span>
          <span className={trading.your?.bet ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
            {trading.your?.bet ? 'Есть' : 'Нет'}
          </span>
        </div>
      </div>

      {/* Action button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{organizer.organization_name}</span>
        {action.disabled ? (
          <span className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
            {action.label}
          </span>
        ) : action.href ? (
          <Link
            to={action.href}
            className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
