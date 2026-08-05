import type { AuctionType, AuctionStatus, TradingStatus } from '@/shared/api/dto';

export function getAuctionTypeBadge(type: AuctionType) {
  const map: Record<AuctionType, 'info' | 'purple' | 'warning' | 'success' | 'default'> = {
    Request: 'info',
    Up: 'purple',
    Down: 'warning',
    FixPrice: 'success',
    Unknown: 'default',
  };
  return map[type];
}

export function getStatusBadge(status: AuctionStatus) {
  const map: Record<
    AuctionStatus,
    'info' | 'success' | 'warning' | 'error' | 'default' | 'purple'
  > = {
    Planning: 'default',
    Auction: 'info',
    DeterminateWinner: 'purple',
    WaitDeal: 'warning',
    InProgress: 'success',
    Finished: 'default',
    Stopped: 'error',
    Canceled: 'error',
    Unknown: 'default',
  };
  return map[status];
}

export function getTradingStatusBadge(status: TradingStatus) {
  const map: Record<
    TradingStatus,
    'success' | 'warning' | 'error' | 'info' | 'default' | 'purple'
  > = {
    NotParticipating: 'default',
    Leading: 'success',
    Losing: 'warning',
    OnPending: 'info',
    Confirmed: 'info',
    ChoosingWinner: 'purple',
    Winner: 'success',
    Accepted: 'success',
    Unknown: 'default',
  };
  return map[status];
}
