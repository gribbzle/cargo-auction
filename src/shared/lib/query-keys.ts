import type { AuctionListRequest } from '../api/dto';

export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (params: AuctionListRequest) => [...auctionKeys.lists(), params] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...auctionKeys.details(), uuid] as const,
  bets: (uuid: string) => [...auctionKeys.all, 'bets', uuid] as const,
  tradingPrice: (uuid: string) => [...auctionKeys.all, 'trading-price', uuid] as const,
};
