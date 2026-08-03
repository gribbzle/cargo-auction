import type {
  AuctionListRequest,
  AuctionListResponseBase,
  AuctionShowResponse,
  BetListResponse,
  SetBetRequest,
} from './dto'
import { get, post } from './http-client'

export async function fetchAuctionList(
  params: AuctionListRequest,
): Promise<AuctionListResponseBase> {
  return post<AuctionListResponseBase>('/auctions/list', params)
}

export async function fetchAuctionDetail(
  auctionUuid: string,
): Promise<AuctionShowResponse> {
  return get<AuctionShowResponse>(`/auctions/${auctionUuid}`)
}

export async function fetchAuctionBets(
  auctionUuid: string,
  all = false,
): Promise<BetListResponse> {
  return get<BetListResponse>(`/auctions/${auctionUuid}/bets`, {
    params: { all },
  })
}

export async function setBet(
  auctionUuid: string,
  data: SetBetRequest,
): Promise<void> {
  return post<void>(`/auctions/${auctionUuid}/bets`, data)
}

export async function toggleFavorite(
  auctionUuid: string,
): Promise<{ is_favorite: boolean }> {
  return post<{ is_favorite: boolean }>(`/auctions/${auctionUuid}/favorite`)
}
