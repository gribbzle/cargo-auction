import { useCallback, useMemo } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { auctionsListRoute } from '@/app/router/router'
import { fetchAuctionList } from '@/shared/api/auction-api'
import { auctionKeys } from '@/shared/lib/query-keys'
import { AuctionCard } from '@/widgets/auction-card'
import { AuctionFiltersWidget } from '@/widgets/auction-filters'
import { AuctionPagination } from '@/widgets/auction-pagination'
import { Skeleton } from '@/shared/ui'
import type { AuctionFilters } from '@/widgets/auction-filters/model/filters'

export function AuctionsListPage() {
  const search = useSearch({ from: auctionsListRoute.id })
  const navigate = useNavigate({ from: '/auctions' })

  const filters: AuctionFilters = useMemo(
    () => ({
      cargo_num: search.cargo_num,
      auc_type: search.auc_type,
      status: search.status,
      load_city: search.load_city,
      unload_city: search.unload_city,
      load_date_from: search.load_date_from,
      load_date_to: search.load_date_to,
      is_available: search.is_available,
      is_bidder: search.is_bidder,
      price_from: search.price_from,
      price_to: search.price_to,
      per_page: search.per_page ?? 20,
      page: search.page ?? 1,
    }),
    [search],
  )

  const { data, isLoading } = useQuery({
    queryKey: auctionKeys.list(filters),
    queryFn: () =>
      fetchAuctionList({
        cargo_num: filters.cargo_num,
        auc_type: filters.auc_type,
        status: filters.status,
        load_city: filters.load_city,
        unload_city: filters.unload_city,
        load_date_from: filters.load_date_from,
        load_date_to: filters.load_date_to,
        is_available: filters.is_available,
        is_bidder: filters.is_bidder,
        current_price_from: filters.price_from,
        current_price_to: filters.price_to,
        per_page: filters.per_page,
        page: filters.page,
      }),
  })

  const handleFiltersChange = useCallback(
    (newFilters: AuctionFilters) => {
      const search: Record<string, unknown> = {}
      if (newFilters.cargo_num) search.cargo_num = newFilters.cargo_num
      if (newFilters.auc_type?.length) search.auc_type = newFilters.auc_type
      if (newFilters.status?.length) search.status = newFilters.status
      if (newFilters.load_city) search.load_city = newFilters.load_city
      if (newFilters.unload_city) search.unload_city = newFilters.unload_city
      if (newFilters.load_date_from) search.load_date_from = newFilters.load_date_from
      if (newFilters.load_date_to) search.load_date_to = newFilters.load_date_to
      if (newFilters.is_available) search.is_available = true
      if (newFilters.is_bidder) search.is_bidder = true
      if (newFilters.price_from) search.price_from = newFilters.price_from
      if (newFilters.price_to) search.price_to = newFilters.price_to
      if (newFilters.per_page && newFilters.per_page !== 20) search.per_page = newFilters.per_page
      if (newFilters.page && newFilters.page !== 1) search.page = newFilters.page
      navigate({ search, replace: true })
    },
    [navigate],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      handleFiltersChange({ ...filters, page })
    },
    [filters, handleFiltersChange],
  )

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Аукционы</h2>

      <AuctionFiltersWidget filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div role="status" aria-label="Загрузка аукционов">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
                <Skeleton className="h-5 w-48 mb-3" />
                <Skeleton className="h-4 w-72 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center" role="status">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="text-lg font-medium text-gray-700 mb-1">Ничего не найдено</p>
            <p className="text-sm text-gray-400">Попробуйте изменить параметры поиска или сбросить фильтры</p>
          </div>
        ) : (
          data?.data.map((auction) => (
            <AuctionCard key={auction.uuid} auction={auction} />
          ))
        )}
      </div>

      {data?.meta && <AuctionPagination meta={data.meta} onPageChange={handlePageChange} />}
    </div>
  )
}
