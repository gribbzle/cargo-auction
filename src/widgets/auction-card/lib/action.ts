import type { AuctionListItemTrading } from '@/shared/api/dto';

interface AuctionAction {
  label: string;
  href?: string;
  disabled?: boolean;
}

export function getActionButton(
  trading: AuctionListItemTrading,
  auctionUuid: string
): AuctionAction {
  if (trading.can_set_bet) {
    if (trading.your?.bet) {
      return { label: 'Изменить ставку', href: `/auctions/${auctionUuid}/place-bet` };
    }
    return { label: 'Сделать ставку', href: `/auctions/${auctionUuid}/place-bet` };
  }

  if (trading.is_bidder) {
    return { label: 'Смотреть ставки', href: `/auctions/${auctionUuid}/bets` };
  }

  return { label: 'Недоступно', disabled: true };
}
