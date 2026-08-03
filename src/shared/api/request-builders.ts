import type { AuctionListRequest } from './dto'
import type { AuctionFilters } from '@/widgets/auction-filters/model/filters'

export function buildAuctionListRequest(filters: AuctionFilters): AuctionListRequest {
  const request: AuctionListRequest = {}

  if (filters.cargo_num) request.cargo_num = filters.cargo_num
  if (filters.auc_type?.length) request.auc_type = filters.auc_type
  if (filters.status?.length) request.status = filters.status
  if (filters.load_city) request.load_city = filters.load_city
  if (filters.load_gc_id) request.load_gc_id = filters.load_gc_id
  if (filters.unload_city) request.unload_city = filters.unload_city
  if (filters.unload_gc_id) request.unload_gc_id = filters.unload_gc_id
  if (filters.load_date_from) request.load_date_from = filters.load_date_from
  if (filters.load_date_to) request.load_date_to = filters.load_date_to
  if (filters.is_available !== undefined) request.is_available = filters.is_available
  if (filters.is_bidder !== undefined) request.is_bidder = filters.is_bidder
  if (filters.price_from !== undefined) request.current_price_from = filters.price_from
  if (filters.price_to !== undefined) request.current_price_to = filters.price_to
  if (filters.per_page) request.per_page = filters.per_page
  if (filters.page) request.page = filters.page

  return request
}
