import { describe, it, expect } from 'vitest';
import { buildAuctionListRequest } from '../request-builders';
import { DEFAULT_FILTERS } from '@/widgets/auction-filters/model/filters';

describe('buildAuctionListRequest', () => {
  it('returns default per_page and page for default filters', () => {
    const result = buildAuctionListRequest(DEFAULT_FILTERS);
    expect(result).toEqual({ per_page: 20, page: 1 });
  });

  it('maps cargo_num', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, cargo_num: 'ЗАЯВ-001' });
    expect(result.cargo_num).toBe('ЗАЯВ-001');
  });

  it('maps auc_type array', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, auc_type: ['Request', 'Up'] });
    expect(result.auc_type).toEqual(['Request', 'Up']);
  });

  it('maps status array', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, status: ['Auction', 'Finished'] });
    expect(result.status).toEqual(['Auction', 'Finished']);
  });

  it('maps load_city and load_gc_id', () => {
    const result = buildAuctionListRequest({
      ...DEFAULT_FILTERS,
      load_city: 'Москва',
      load_gc_id: 1,
    });
    expect(result.load_city).toBe('Москва');
    expect(result.load_gc_id).toBe(1);
  });

  it('maps unload_city and unload_gc_id', () => {
    const result = buildAuctionListRequest({
      ...DEFAULT_FILTERS,
      unload_city: 'Казань',
      unload_gc_id: 3,
    });
    expect(result.unload_city).toBe('Казань');
    expect(result.unload_gc_id).toBe(3);
  });

  it('maps date range filters', () => {
    const result = buildAuctionListRequest({
      ...DEFAULT_FILTERS,
      load_date_from: '2025-07-01',
      load_date_to: '2025-07-31',
    });
    expect(result.load_date_from).toBe('2025-07-01');
    expect(result.load_date_to).toBe('2025-07-31');
  });

  it('maps is_available boolean', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, is_available: true });
    expect(result.is_available).toBe(true);
  });

  it('maps is_bidder boolean', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, is_bidder: true });
    expect(result.is_bidder).toBe(true);
  });

  it('maps price range to current_price_from/to', () => {
    const result = buildAuctionListRequest({
      ...DEFAULT_FILTERS,
      price_from: 100000,
      price_to: 200000,
    });
    expect(result.current_price_from).toBe(100000);
    expect(result.current_price_to).toBe(200000);
  });

  it('maps per_page and page', () => {
    const result = buildAuctionListRequest({ ...DEFAULT_FILTERS, per_page: 50, page: 3 });
    expect(result.per_page).toBe(50);
    expect(result.page).toBe(3);
  });

  it('omits undefined values', () => {
    const result = buildAuctionListRequest({
      ...DEFAULT_FILTERS,
      cargo_num: 'test',
      per_page: undefined,
      page: undefined,
    });
    expect(result).toEqual({ cargo_num: 'test' });
  });

  it('maps all filters together', () => {
    const result = buildAuctionListRequest({
      cargo_num: 'ЗАЯВ',
      auc_type: ['Request'],
      status: ['Auction'],
      load_city: 'Москва',
      load_gc_id: 1,
      unload_city: 'Казань',
      unload_gc_id: 3,
      load_date_from: '2025-07-01',
      load_date_to: '2025-07-31',
      is_available: true,
      is_bidder: false,
      price_from: 100000,
      price_to: 300000,
      per_page: 10,
      page: 2,
    });
    expect(result).toEqual({
      cargo_num: 'ЗАЯВ',
      auc_type: ['Request'],
      status: ['Auction'],
      load_city: 'Москва',
      load_gc_id: 1,
      unload_city: 'Казань',
      unload_gc_id: 3,
      load_date_from: '2025-07-01',
      load_date_to: '2025-07-31',
      is_available: true,
      is_bidder: false,
      current_price_from: 100000,
      current_price_to: 300000,
      per_page: 10,
      page: 2,
    });
  });
});
