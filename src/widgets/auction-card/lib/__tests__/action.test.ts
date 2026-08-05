import { describe, it, expect } from 'vitest';
import { getActionButton } from '@/widgets/auction-card/lib/action';
import type { AuctionListItemTrading } from '@/shared/api/dto';

function makeTrading(overrides: Partial<AuctionListItemTrading> = {}): AuctionListItemTrading {
  return {
    status: 'Auction',
    status_mobile: 'NotParticipating',
    start_time: '',
    stop_time: '',
    bid_measurement_type: null,
    can_set_bet: false,
    allow_counter_bets: false,
    hide_points_address_and_contacts: false,
    direction: '',
    comment: '',
    is_bidder: false,
    is_available: false,
    is_accredited: false,
    is_favorite: false,
    price: null,
    your: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    is_last_bet_with_vat: false,
    ...overrides,
  };
}

describe('getActionButton', () => {
  const uuid = 'test-uuid-123';

  it('shows "Сделать ставку" when can_set_bet and no existing bet', () => {
    const trading = makeTrading({ can_set_bet: true, your: { bet: false, last_bet: null } });
    const action = getActionButton(trading, uuid);
    expect(action.label).toBe('Сделать ставку');
    expect(action.href).toBe('/auctions/test-uuid-123/place-bet');
    expect(action.disabled).toBeUndefined();
  });

  it('shows "Изменить ставку" when can_set_bet and has existing bet', () => {
    const trading = makeTrading({ can_set_bet: true, your: { bet: true, last_bet: 50000 } });
    const action = getActionButton(trading, uuid);
    expect(action.label).toBe('Изменить ставку');
    expect(action.href).toBe('/auctions/test-uuid-123/place-bet');
  });

  it('shows "Смотреть ставки" when is_bidder but cannot set bet', () => {
    const trading = makeTrading({ can_set_bet: false, is_bidder: true });
    const action = getActionButton(trading, uuid);
    expect(action.label).toBe('Смотреть ставки');
    expect(action.href).toBe('/auctions/test-uuid-123/bets');
  });

  it('shows disabled "Недоступно" when not can_set_bet and not is_bidder', () => {
    const trading = makeTrading({ can_set_bet: false, is_bidder: false });
    const action = getActionButton(trading, uuid);
    expect(action.label).toBe('Недоступно');
    expect(action.disabled).toBe(true);
    expect(action.href).toBeUndefined();
  });
});
