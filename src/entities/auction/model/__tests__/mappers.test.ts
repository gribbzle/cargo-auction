import { describe, it, expect } from 'vitest';
import {
  mapRouteSummary,
  mapAuctionDetailSummary,
  mapListItemSummary,
  mapBetSummary,
} from '../mappers';
import type { AuctionShowResponse, AuctionListItem, BetItem, RoutePoint } from '@/shared/api/dto';

const mockRoutePoint: RoutePoint = {
  row_num: 1,
  op_type: 'Loading',
  start_date: '2025-07-10T00:00:00Z',
  end_date: '2025-07-11T00:00:00Z',
  comment: null,
  contractor: 'Подрядчик 1',
  contractor_inn: '7700000002',
  location: {
    city_name: 'Москва',
    city_full_name: 'Москва',
    city_gc_id: 1,
    loading_address: 'ул. Тест, 1',
    lon: 37.6,
    lat: 55.75,
  },
  cargo: {
    name: 'Груз',
    package_name: '',
    weight: '5',
    volume: '20',
    length: '',
    width: '',
    height: '',
    oversized: false,
    package_amount: null,
  },
  contact: { name: 'Контакт', phone: '+7 (999) 123-45-67' },
};

const mockUnloadPoint: RoutePoint = {
  ...mockRoutePoint,
  row_num: 2,
  op_type: 'Unloading',
  location: {
    city_name: 'Казань',
    city_full_name: 'Казань',
    city_gc_id: 3,
    loading_address: 'ул. Доставки, 1',
    lon: 49.1,
    lat: 55.8,
  },
};

const mockAuctionDetail: AuctionShowResponse = {
  main: {
    id: 1,
    cargo_num: 'ЗАЯВ-0001',
    cargo_date: '2025-07-01T00:00:00Z',
    auc_type: 'Request',
    order_uid: 'uid-1',
    created_at: '2025-06-01T00:00:00Z',
  },
  organizer: {
    subscriber_id: 1,
    subscriber_code: 'SUB001',
    infobase_code: 'INF001',
    organization_name: 'ООО "Тест"',
    organization_inn: '7700000001',
    organization_kpp: '770001001',
    organization_id: 1,
  },
  contacts: [],
  cargo: {
    price: '1000000',
    currency: 643,
    is_international: false,
    distance: 500,
    truck_count: 1,
    body_type: 'Тент',
    temp_from: null,
    temp_to: null,
    conics: null,
    belts: null,
    adr: null,
    coupling: null,
    air_pass: null,
    low_loader: null,
    additional_load: null,
    containered: false,
    container_type: null,
    container_size: null,
    loading_types: { side: true, top: false, rear: true, full: false },
    docs: { tir: false, cmr: false, t1: false, med: false },
    car: null,
  },
  trading: {
    status: 'Auction',
    status_mobile: 'NotParticipating',
    start_time: '2025-06-25T00:00:00Z',
    stop_time: '2025-07-15T00:00:00Z',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: false,
    hide_bets_history: false,
    hide_places: false,
    no_view_cargo_price: false,
    hide_points_address_and_contacts: false,
    is_bidder: false,
    is_favorite: false,
    is_last_bet_with_vat: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    send_deal_before_load: false,
    chat_id: null,
    price: {
      start: 200000,
      start_no_vat: null,
      current: 150000,
      current_no_vat: 120000,
      available: 151000,
      available_no_vat: 120800,
      min: 145000,
      min_no_vat: 116000,
      max: 200000,
      max_no_vat: 160000,
      step: 1000,
      step_no_vat: 800,
      price_per_km: 25,
    },
    your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    settings: {
      prolong_after_bet: 5,
      winner_confirm: null,
      winner_counter_mode: null,
      transmission_time_in: null,
      coefficient: null,
    },
  },
  payment: {
    condition: null,
    condition_predefined: null,
    form: 'Безналичный',
    delay: null,
    delay_type: null,
    currency_code: 643,
    prepay: null,
  },
  assembly: { num: null, date: null },
  routes: [mockRoutePoint, mockUnloadPoint],
  admitted_organizations: [],
  hide_bets_history: false,
};

const mockListItem: AuctionListItem = {
  uuid: 'test-uuid-1',
  main: {
    id: 1,
    cargo_num: 'ЗАЯВ-0001',
    cargo_date: '2025-07-01T00:00:00Z',
    auc_type: 'Request',
    order_uid: 'uid-1',
    created_at: '2025-06-01T00:00:00Z',
    priority_sort: 1,
    is_assembly: false,
    price_per_km: 25,
  },
  organizer: {
    subscriber_id: 1,
    organization_id: 1,
    organization_name: 'ООО "Тест"',
    organization_inn: '7700000001',
    organization_kpp: '770001001',
    is_hide_organization: false,
  },
  route: {
    load: {
      city: 'Москва',
      address: 'ул. Тест, 1',
      date: '2025-07-10T00:00:00Z',
      city_gc_id: 1,
      points_count: 1,
    },
    unload: {
      city: 'Казань',
      address: 'ул. Доставки, 1',
      date: '2025-07-12T00:00:00Z',
      city_gc_id: 3,
      points_count: 1,
    },
  },
  cargo: {
    name: 'Груз тестовый',
    weight: 5,
    volume: 20,
    body_type: 'Тент',
    truck_count: 1,
    is_cargo: true,
    is_international: false,
    containered: false,
    incoterms: '',
    conics: 0,
    belts: 0,
    adr: 0,
    coupling: false,
    air_pass: false,
    low_loader: false,
    additional_load: false,
    temp_from: 0,
    temp_to: 0,
    loading_types: { side: true, top: false, rear: true, full: false },
    docs: { tir: false, cmr: false, t1: false, med: false },
    car: null,
  },
  trading: {
    status: 'Auction',
    status_mobile: 'NotParticipating',
    start_time: '2025-06-25T00:00:00Z',
    stop_time: '2025-07-15T00:00:00Z',
    bid_measurement_type: 'PerRoute',
    can_set_bet: true,
    allow_counter_bets: false,
    hide_points_address_and_contacts: false,
    direction: '',
    comment: '',
    is_bidder: false,
    is_available: true,
    is_accredited: true,
    is_favorite: false,
    price: { start: 200000, current: 150000, current_no_vat: 120000 },
    your: null,
    red_bet_with_vat: false,
    red_bet_no_vat: false,
    is_last_bet_with_vat: false,
  },
  payment: { form: 'Безналичный', currency_code: 643, consignor: '', consignee: '' },
};

const mockBet: BetItem = {
  id: 1,
  created_at: '2025-06-28T10:00:00Z',
  auction_id: 1,
  subscriber_id: 1,
  contact_name: 'Иван Иванов',
  contact_phone: '+7 (999) 123-45-67',
  price_with_vat: 150000,
  price_no_vat: 125000,
  organization_id: 1,
  organization_inn: '7700000001',
  organization_name: 'ООО "Перевозчик 1"',
  transporter_comment: null,
  is_rejected: false,
  is_counter: false,
  place: 1,
  is_win: true,
  run_number: 0,
  cancel_reason: '',
  price_info: {
    price_with_vat: 150000,
    price_no_vat: 125000,
    payment_type: 'Безналичный',
    vat_rate: '20',
  },
};

describe('mapRouteSummary', () => {
  it('extracts load/unload cities from route points', () => {
    const result = mapRouteSummary([mockRoutePoint, mockUnloadPoint]);
    expect(result.loadCity).toBe('Москва');
    expect(result.unloadCity).toBe('Казань');
  });

  it('returns dash for empty routes', () => {
    const result = mapRouteSummary([]);
    expect(result.loadCity).toBe('—');
    expect(result.unloadCity).toBe('—');
  });

  it('uses single point for both load and unload when only one exists', () => {
    const result = mapRouteSummary([mockRoutePoint]);
    expect(result.loadCity).toBe('Москва');
    expect(result.unloadCity).toBe('Москва');
  });
});

describe('mapAuctionDetailSummary', () => {
  it('maps all fields correctly', () => {
    const result = mapAuctionDetailSummary(mockAuctionDetail, 'uuid-1');
    expect(result.uuid).toBe('uuid-1');
    expect(result.cargoNum).toBe('ЗАЯВ-0001');
    expect(result.aucType).toBe('Request');
    expect(result.status).toBe('Auction');
    expect(result.tradingStatus).toBe('NotParticipating');
    expect(result.canSetBet).toBe(true);
    expect(result.isFavorite).toBe(false);
    expect(result.hasMyBet).toBe(false);
  });

  it('maps route summary', () => {
    const result = mapAuctionDetailSummary(mockAuctionDetail, 'uuid-1');
    expect(result.route.loadCity).toBe('Москва');
    expect(result.route.unloadCity).toBe('Казань');
  });

  it('maps price summary', () => {
    const result = mapAuctionDetailSummary(mockAuctionDetail, 'uuid-1');
    expect(result.price.current).toBe(150000);
    expect(result.price.start).toBe(200000);
    expect(result.price.step).toBe(1000);
    expect(result.price.min).toBe(145000);
    expect(result.price.max).toBe(200000);
    expect(result.price.pricePerKm).toBe(25);
  });

  it('maps cargo summary', () => {
    const result = mapAuctionDetailSummary(mockAuctionDetail, 'uuid-1');
    expect(result.cargo.bodyType).toBe('Тент');
    expect(result.cargo.truckCount).toBe(1);
    expect(result.cargo.isInternational).toBe(false);
  });
});

describe('mapListItemSummary', () => {
  it('maps all fields correctly', () => {
    const result = mapListItemSummary(mockListItem);
    expect(result.uuid).toBe('test-uuid-1');
    expect(result.cargoNum).toBe('ЗАЯВ-0001');
    expect(result.aucType).toBe('Request');
    expect(result.status).toBe('Auction');
    expect(result.loadCity).toBe('Москва');
    expect(result.unloadCity).toBe('Казань');
    expect(result.currentPrice).toBe(150000);
    expect(result.canSetBet).toBe(true);
    expect(result.hasMyBet).toBe(false);
    expect(result.isFavorite).toBe(false);
  });
});

describe('mapBetSummary', () => {
  it('maps all fields correctly', () => {
    const result = mapBetSummary(mockBet);
    expect(result.id).toBe(1);
    expect(result.organizationName).toBe('ООО "Перевозчик 1"');
    expect(result.organizationInn).toBe('7700000001');
    expect(result.contactName).toBe('Иван Иванов');
    expect(result.contactPhone).toBe('+7 (999) 123-45-67');
    expect(result.priceWithVat).toBe(150000);
    expect(result.priceNoVat).toBe(125000);
    expect(result.place).toBe(1);
    expect(result.isWinner).toBe(true);
    expect(result.isRejected).toBe(false);
    expect(result.cancelReason).toBe('');
    expect(result.createdAt).toBe('2025-06-28T10:00:00Z');
  });
});
