import type { AuctionListItem, AuctionShowResponse, BetItem } from '@/shared/api/dto';
import { CITIES_MOCK } from '@/entities/city/model/cities.mock';
import { faker } from '@/shared/lib/faker';

export interface AuctionSeed {
  uuid: string;
  data: AuctionListItem;
  detail: AuctionShowResponse;
  bets: BetItem[];
}

function generateUuid(): string {
  return crypto.randomUUID();
}

const cities = CITIES_MOCK;

const cargoTypes = ['Тент', 'Рефрижератор', 'Борт', 'Контейнер', 'Цистерна'];
const aucTypes: Array<'Request' | 'Up' | 'Down' | 'FixPrice'> = [
  'Request',
  'Up',
  'Down',
  'FixPrice',
];
const statuses: Array<
  | 'Planning'
  | 'Auction'
  | 'DeterminateWinner'
  | 'WaitDeal'
  | 'InProgress'
  | 'Finished'
  | 'Stopped'
  | 'Canceled'
> = [
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
];
const tradingStatuses: Array<'NotParticipating' | 'Leading' | 'Losing' | 'Winner' | 'Confirmed'> = [
  'NotParticipating',
  'Leading',
  'Losing',
  'Winner',
  'Confirmed',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAuctionListItem(index: number): AuctionListItem {
  const loadCity = randomItem(cities);
  const unloadCity = randomItem(cities.filter((c) => c.gc_id !== loadCity.gc_id));
  const aucType = randomItem(aucTypes);

  // Ensure first 8 auctions are active (can_set_bet = true) for demo purposes
  const isActiveAuction = index < 8;
  const status = isActiveAuction ? ('Auction' as const) : randomItem(statuses);
  const tradingStatus = isActiveAuction
    ? randomItem(['NotParticipating', 'Leading', 'Losing', 'OnPending'] as const)
    : randomItem(tradingStatuses);

  const currentPrice = randomInt(50000, 500000);

  // Generate start price based on auction type:
  // - Up/Down: start price is the initial (highest) price, current is lower
  // - FixPrice: start and current are the same (fixed price)
  // - Request: start price equals current price (no trading)
  const startPrice =
    aucType === 'FixPrice' || aucType === 'Request'
      ? currentPrice
      : currentPrice + randomInt(10000, 100000);

  return {
    uuid: '',
    main: {
      id: index + 1,
      cargo_num: `ЗАЯВ-${String(index + 1).padStart(4, '0')}`,
      cargo_date: new Date(Date.now() + randomInt(1, 30) * 86400000).toISOString(),
      auc_type: aucType,
      order_uid: generateUuid(),
      created_at: new Date(Date.now() - randomInt(1, 7) * 86400000).toISOString(),
      priority_sort: randomInt(1, 100),
      is_assembly: Math.random() > 0.8,
      price_per_km: randomInt(5, 50),
    },
    organizer: {
      subscriber_id: randomInt(1, 100),
      organization_id: randomInt(1, 50),
      organization_name: faker.company.name(),
      organization_inn: `${randomInt(7700000000, 7799999999)}`,
      organization_kpp: `${randomInt(770001000, 770099999)}`,
      is_hide_organization: false,
    },
    route: (() => {
      const loadDate = new Date(Date.now() + randomInt(1, 14) * 86400000);
      const unloadDate = new Date(loadDate.getTime() + randomInt(1, 7) * 86400000);
      return {
        load: {
          city: loadCity.name,
          address: faker.location.streetAddress(),
          date: loadDate.toISOString(),
          city_gc_id: loadCity.gc_id,
          points_count: 1,
        },
        unload: {
          city: unloadCity.name,
          address: faker.location.streetAddress(),
          date: unloadDate.toISOString(),
          city_gc_id: unloadCity.gc_id,
          points_count: 1,
        },
      };
    })(),
    cargo: {
      name: `Груз ${index + 1}`,
      weight: randomInt(1, 20),
      volume: randomInt(5, 50),
      body_type: randomItem(cargoTypes),
      truck_count: randomInt(1, 5),
      is_cargo: true,
      is_international: Math.random() > 0.7,
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
      status,
      status_mobile: tradingStatus,
      start_time: new Date(Date.now() - randomInt(1, 3) * 86400000).toISOString(),
      stop_time: new Date(Date.now() + randomInt(1, 7) * 86400000).toISOString(),
      bid_measurement_type: randomItem(['PerRoute', 'PerKm'] as const),
      can_set_bet: status === 'Auction' && tradingStatus !== 'Winner',
      allow_counter_bets: false,
      hide_points_address_and_contacts: Math.random() > 0.8,
      direction: '',
      comment: '',
      is_bidder: tradingStatus !== 'NotParticipating',
      is_available: status === 'Auction',
      is_accredited: true,
      is_favorite: Math.random() > 0.7,
      price: {
        start: startPrice,
        current: currentPrice,
        current_no_vat: Math.round(currentPrice * 0.8),
      },
      your:
        tradingStatus !== 'NotParticipating'
          ? { bet: true, last_bet: currentPrice + randomInt(-5000, 5000) }
          : null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: false,
    },
    payment: {
      form: 'Безналичный расчет',
      currency_code: 643,
      consignor: 'Грузоотправитель',
      consignee: 'Грузополучатель',
    },
  };
}

function generateAuctionDetail(item: AuctionListItem): AuctionShowResponse {
  const distance = randomInt(100, 3000);
  const currentPrice = item.trading.price?.current ?? 100000;

  return {
    main: {
      id: item.main.id,
      cargo_num: item.main.cargo_num,
      cargo_date: item.main.cargo_date,
      order_uid: item.main.order_uid,
      auc_type: item.main.auc_type,
      created_at: item.main.created_at,
    },
    organizer: {
      subscriber_id: item.organizer.subscriber_id,
      subscriber_code: 'SUB001',
      infobase_code: 'INF001',
      organization_name: item.organizer.organization_name,
      organization_inn: item.organizer.organization_inn,
      organization_kpp: item.organizer.organization_kpp,
      organization_id: item.organizer.organization_id,
    },
    contacts: [],
    cargo: {
      price: `${randomInt(1000000, 10000000)}`,
      currency: 643,
      is_international: item.cargo.is_international,
      distance,
      truck_count: item.cargo.truck_count,
      body_type: item.cargo.body_type,
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
      status: item.trading.status,
      status_mobile: item.trading.status_mobile,
      start_time: item.trading.start_time,
      stop_time: item.trading.stop_time,
      bid_measurement_type: item.trading.bid_measurement_type ?? 'PerRoute',
      can_set_bet: item.trading.can_set_bet,
      allow_counter_bets: false,
      hide_bets_history: Math.random() > 0.8,
      hide_places: false,
      no_view_cargo_price: Math.random() > 0.8,
      hide_points_address_and_contacts: item.trading.hide_points_address_and_contacts,
      is_bidder: item.trading.is_bidder,
      is_favorite: item.trading.is_favorite,
      is_last_bet_with_vat: null,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start: item.trading.price?.start ?? null,
        start_no_vat: null,
        current: currentPrice,
        current_no_vat: Math.round(currentPrice * 0.8),
        available: currentPrice + 1000,
        available_no_vat: Math.round((currentPrice + 1000) * 0.8),
        min: currentPrice - 5000,
        min_no_vat: Math.round((currentPrice - 5000) * 0.8),
        max: currentPrice + 50000,
        max_no_vat: Math.round((currentPrice + 50000) * 0.8),
        step: 1000,
        step_no_vat: 800,
        price_per_km: item.main.price_per_km ?? 0,
      },
      your: item.trading.your
        ? {
            bet: true,
            last_bet: item.trading.your.last_bet,
            last_bet_with_vat: item.trading.your.last_bet,
            win: item.trading.status_mobile === 'Winner',
          }
        : { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
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
      form: item.payment.form,
      delay: null,
      delay_type: null,
      currency_code: item.payment.currency_code,
      prepay: null,
    },
    assembly: { num: null, date: null },
    routes: [
      {
        row_num: 1,
        op_type: 'Loading',
        start_date: item.route.load.date,
        end_date: new Date(new Date(item.route.load.date).getTime() + 2 * 86400000).toISOString(),
        comment: null,
        contractor: faker.company.name(),
        contractor_inn: faker.string.numeric(10),
        location: {
          city_name: item.route.load.city,
          city_full_name: item.route.load.city,
          city_gc_id: item.route.load.city_gc_id,
          loading_address: faker.location.streetAddress(),
          lon: 0,
          lat: 0,
        },
        cargo: {
          name: '',
          package_name: '',
          weight: '',
          volume: '',
          length: '',
          width: '',
          height: '',
          oversized: false,
          package_amount: null,
        },
        contact: { name: faker.person.fullName(), phone: faker.phone.number() },
      },
      {
        row_num: 2,
        op_type: 'Unloading',
        start_date: item.route.unload.date,
        end_date: new Date(new Date(item.route.unload.date).getTime() + 2 * 86400000).toISOString(),
        comment: null,
        contractor: faker.company.name(),
        contractor_inn: faker.string.numeric(10),
        location: {
          city_name: item.route.unload.city,
          city_full_name: item.route.unload.city,
          city_gc_id: item.route.unload.city_gc_id,
          loading_address: faker.location.streetAddress(),
          lon: 0,
          lat: 0,
        },
        cargo: {
          name: '',
          package_name: '',
          weight: '',
          volume: '',
          length: '',
          width: '',
          height: '',
          oversized: false,
          package_amount: null,
        },
        contact: { name: faker.person.fullName(), phone: faker.phone.number() },
      },
    ],
    admitted_organizations: [],
    hide_bets_history: false,
  };
}

function generateBets(
  auctionId: number,
  count: number,
  userBet?: { price_with_vat: number; price_no_vat: number }
): BetItem[] {
  const otherBets: BetItem[] = Array.from({ length: count }, (_, i) => {
    const priceNoVat = randomInt(40000, 400000);
    const priceWithVat = Math.round(priceNoVat * 1.2);
    return {
      id: auctionId * 1000 + i + 1,
      created_at: new Date(Date.now() - randomInt(0, 48) * 3600000).toISOString(),
      auction_id: auctionId,
      subscriber_id: randomInt(1, 100),
      contact_name: faker.person.fullName(),
      contact_phone: faker.phone.number(),
      price_with_vat: priceWithVat,
      price_no_vat: priceNoVat,
      organization_id: randomInt(1, 50),
      organization_inn: `${randomInt(7700000000, 7799999999)}`,
      organization_name: faker.company.name(),
      transporter_comment: null,
      is_rejected: i === count - 1 && Math.random() > 0.7,
      is_counter: false,
      place: null,
      is_win: false,
      run_number: 0,
      cancel_reason: i === count - 1 && Math.random() > 0.7 ? 'Не прошёл отбор' : '',
      price_info: {
        price_with_vat: priceWithVat,
        price_no_vat: priceNoVat,
        payment_type: 'Безналичный',
        vat_rate: '20',
      },
    };
  });

  const bets = userBet
    ? [
        ...otherBets,
        {
          id: auctionId * 10000,
          created_at: new Date().toISOString(),
          auction_id: auctionId,
          subscriber_id: 1,
          contact_name: 'Текущий пользователь',
          contact_phone: '+7 (999) 123-45-67',
          price_with_vat: userBet.price_with_vat,
          price_no_vat: userBet.price_no_vat,
          organization_id: 1,
          organization_inn: '7700000001',
          organization_name: 'Моя организация',
          transporter_comment: null,
          is_rejected: false,
          is_counter: false,
          place: null,
          is_win: false,
          run_number: 0,
          cancel_reason: '',
          price_info: {
            price_with_vat: userBet.price_with_vat,
            price_no_vat: userBet.price_no_vat,
            payment_type: 'Безналичный',
            vat_rate: '20',
          },
        },
      ]
    : otherBets;

  bets
    .filter((b) => !b.is_rejected)
    .sort((a, b) => b.price_with_vat - a.price_with_vat)
    .forEach((b, i) => {
      b.place = i + 1;
      b.is_win = i === 0;
    });

  return bets;
}

export function generateSeedData(): AuctionSeed[] {
  const count = 25;
  const items = Array.from({ length: count }, (_, i) => {
    const item = generateAuctionListItem(i);
    const uuid = generateUuid();
    item.uuid = uuid;
    return { item, uuid };
  });

  return items.map(({ item, uuid }) => {
    const userBet =
      item.trading.your?.last_bet != null
        ? {
            price_with_vat: item.trading.your.last_bet,
            price_no_vat: Math.round(item.trading.your.last_bet * 0.8),
          }
        : undefined;

    return {
      uuid,
      data: item,
      detail: generateAuctionDetail(item),
      bets: generateBets(item.main.id, randomInt(0, 8), userBet),
    };
  });
}
