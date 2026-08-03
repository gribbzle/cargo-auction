import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { auctionKeys } from '@/shared/lib/query-keys'
import { fetchAuctionBets, fetchAuctionDetail } from '@/shared/api/auction-api'
import { Badge, Button, Skeleton } from '@/shared/ui'
import { Breadcrumbs } from '@/shared/ui/layout'
import { formatCurrency } from '@/widgets/auction-card/lib/formatters'
import type { BetItem } from '@/shared/api/dto'

type SortField = 'price' | 'date' | 'place'
type SortDir = 'asc' | 'desc'

export function AuctionBetsPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bets' })
  const [sortField, setSortField] = useState<SortField>('place')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const { data: auction, isLoading: auctionLoading } = useQuery({
    queryKey: auctionKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
  })

  const { data: betsData, isLoading: betsLoading } = useQuery({
    queryKey: auctionKeys.bets(auctionUuid),
    queryFn: () => fetchAuctionBets(auctionUuid, true),
  })

  const isLoading = auctionLoading || betsLoading

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir(field === 'price' ? 'asc' : 'desc')
    }
  }

  const sortedBets = sortBets(betsData?.bets ?? [], sortField, sortDir)

  if (isLoading) {
    return <BetsSkeleton />
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Аукционы', to: '/auctions' },
          { label: auction?.main.cargo_num ?? auctionUuid, to: `/auctions/${auctionUuid}` },
          { label: 'Ставки' },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Ставки — {auction?.main.cargo_num}
        </h2>
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid }}>
          <Button variant="secondary" size="sm">← К аукциону</Button>
        </Link>
      </div>

      {sortedBets.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500" role="status">
          <div className="text-4xl mb-3" aria-hidden="true">📋</div>
          <p className="font-medium text-gray-700">Ставок пока нет</p>
          <p className="text-sm text-gray-400 mt-1">Будьте первым, кто сделает ставку</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[700px]">
            <button
              type="button"
              onClick={() => toggleSort('place')}
              aria-label={`Сортировать по месту ${sortField === 'place' ? (sortDir === 'asc' ? 'по убыванию' : 'по возрастанию') : ''}`}
              className="col-span-1 text-left hover:text-gray-700 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              Место {sortField === 'place' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <div className="col-span-3">Организация</div>
            <button
              type="button"
              onClick={() => toggleSort('price')}
              aria-label={`Сортировать по сумме ${sortField === 'price' ? (sortDir === 'asc' ? 'по убыванию' : 'по возрастанию') : ''}`}
              className="col-span-2 text-left hover:text-gray-700 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              Сумма {sortField === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
            <div className="col-span-2">Без НДС</div>
            <div className="col-span-2">Контакт</div>
            <button
              type="button"
              onClick={() => toggleSort('date')}
              aria-label={`Сортировать по дате ${sortField === 'date' ? (sortDir === 'asc' ? 'по убыванию' : 'по возрастанию') : ''}`}
              className="col-span-2 text-left hover:text-gray-700 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              Дата {sortField === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {/* Rows */}
          <div className="min-w-[700px]">
          {sortedBets.map((bet) => (
            <BetRow key={bet.id} bet={bet} />
          ))}
          </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BetRow({ bet }: { bet: BetItem }) {
  const isOwn = bet.subscriber_id === 1

  return (
    <div className={`grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 last:border-0 text-sm ${
      isOwn ? 'bg-amber-50' : bet.is_win ? 'bg-emerald-50' : bet.is_rejected ? 'bg-red-50' : ''
    }`}>
      <div className="col-span-1 font-medium text-gray-900">
        {bet.place != null ? `#${bet.place}` : '—'}
      </div>
      <div className="col-span-3">
        <span className="text-gray-900 block">{bet.organization_name}</span>
        <span className="text-gray-500 text-xs">ИНН {bet.organization_inn}</span>
      </div>
      <div className="col-span-2">
        <span className={`font-semibold ${bet.is_win ? 'text-emerald-700' : 'text-gray-900'}`}>
          {formatCurrency(bet.price_with_vat)}
        </span>
        {bet.is_win && <Badge variant="success" className="ml-2">Победитель</Badge>}
        {bet.is_rejected && <Badge variant="error" className="ml-2">Отклонена</Badge>}
      </div>
      <div className="col-span-2 text-gray-600">
        {formatCurrency(bet.price_no_vat)}
      </div>
      <div className="col-span-2">
        <span className="text-gray-900 block">{bet.contact_name}</span>
        <span className="text-gray-500 text-xs">{bet.contact_phone}</span>
      </div>
      <div className="col-span-2 text-gray-500 text-xs">
        {new Date(bet.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}

function sortBets(bets: BetItem[], field: SortField, dir: SortDir): BetItem[] {
  const sorted = [...bets].sort((a, b) => {
    switch (field) {
      case 'price':
        return a.price_with_vat - b.price_with_vat
      case 'date':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'place':
        return (a.place ?? Infinity) - (b.place ?? Infinity)
      default:
        return 0
    }
  })
  return dir === 'desc' ? sorted.reverse() : sorted
}

function BetsSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-64 mb-6" />
      <Skeleton className="h-8 w-80 mb-6" />
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <Skeleton className="h-10 w-full mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full mb-2" />
        ))}
      </div>
    </div>
  )
}
