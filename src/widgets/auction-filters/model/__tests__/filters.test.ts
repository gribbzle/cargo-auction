import { describe, it, expect } from 'vitest';
import { auctionFiltersSchema } from '@/widgets/auction-filters/model/filters';

describe('auctionFiltersSchema', () => {
  it('parses empty object to all undefined', () => {
    const result = auctionFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cargo_num).toBeUndefined();
      expect(result.data.auc_type).toBeUndefined();
      expect(result.data.status).toBeUndefined();
      expect(result.data.load_city).toBeUndefined();
      expect(result.data.unload_city).toBeUndefined();
      expect(result.data.is_available).toBeUndefined();
      expect(result.data.is_bidder).toBeUndefined();
      expect(result.data.price_from).toBeUndefined();
      expect(result.data.price_to).toBeUndefined();
    }
  });

  it('parses all filter values', () => {
    const result = auctionFiltersSchema.safeParse({
      cargo_num: 'ЗАЯВ-001',
      auc_type: ['Request', 'Up'],
      status: ['Auction'],
      load_city: 'Москва',
      unload_city: 'Казань',
      load_date_from: '2025-01-01',
      load_date_to: '2025-12-31',
      is_available: true,
      is_bidder: false,
      price_from: 1000,
      price_to: 50000,
      per_page: 10,
      page: 2,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cargo_num).toBe('ЗАЯВ-001');
      expect(result.data.auc_type).toEqual(['Request', 'Up']);
      expect(result.data.status).toEqual(['Auction']);
      expect(result.data.load_city).toBe('Москва');
      expect(result.data.unload_city).toBe('Казань');
      expect(result.data.is_available).toBe(true);
      expect(result.data.is_bidder).toBe(false);
      expect(result.data.price_from).toBe(1000);
      expect(result.data.price_to).toBe(50000);
      expect(result.data.per_page).toBe(10);
      expect(result.data.page).toBe(2);
    }
  });
});
