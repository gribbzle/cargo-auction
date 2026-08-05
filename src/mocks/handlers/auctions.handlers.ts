import { http, HttpResponse, delay } from 'msw';
import { auctionStore } from '../store/auctions.store';
import type { AuctionListRequest, SetBetRequest } from '@/shared/api/dto';

const API_BASE = '/api/v1';

function filterAuctions(
  auctions: ReturnType<typeof auctionStore.getAll>,
  params: AuctionListRequest
) {
  let filtered = [...auctions];

  if (params.cargo_num) {
    const search = params.cargo_num.toLowerCase();
    filtered = filtered.filter((a) => a.data.main.cargo_num.toLowerCase().includes(search));
  }

  if (params.auc_type?.length) {
    filtered = filtered.filter((a) => params.auc_type!.includes(a.data.main.auc_type));
  }

  if (params.status?.length) {
    filtered = filtered.filter((a) => params.status!.includes(a.data.trading.status_mobile));
  }

  if (params.is_available !== undefined) {
    filtered = filtered.filter((a) => a.data.trading.is_available === params.is_available);
  }

  if (params.is_bidder !== undefined) {
    filtered = filtered.filter((a) => a.data.trading.is_bidder === params.is_bidder);
  }

  if (params.load_city) {
    const city = params.load_city.toLowerCase();
    filtered = filtered.filter((a) => a.data.route.load.city.toLowerCase().includes(city));
  }

  if (params.unload_city) {
    const city = params.unload_city.toLowerCase();
    filtered = filtered.filter((a) => a.data.route.unload.city.toLowerCase().includes(city));
  }

  if (params.current_price_from != null) {
    filtered = filtered.filter(
      (a) => (a.data.trading.price?.current ?? 0) >= params.current_price_from!
    );
  }

  if (params.current_price_to != null) {
    filtered = filtered.filter(
      (a) => (a.data.trading.price?.current ?? 0) <= params.current_price_to!
    );
  }

  return filtered;
}

export const handlers = [
  http.post(`${API_BASE}/auctions/list`, async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as AuctionListRequest;
    const allAuctions = auctionStore.getAll();
    const filtered = filterAuctions(allAuctions, body);

    const page = body.page ?? 1;
    const perPage = body.per_page ?? 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = filtered.slice(start, end);

    return HttpResponse.json({
      data: paginated.map((a) => ({ ...a.data, uuid: a.uuid })),
      meta: {
        current_page: page,
        from: start + 1,
        last_page: Math.ceil(filtered.length / perPage),
        per_page: perPage,
        to: Math.min(end, filtered.length),
        total: filtered.length,
      },
    });
  }),

  http.get(`${API_BASE}/auctions/:uuid`, async ({ params }) => {
    await delay(100);
    const uuid = params.uuid as string;
    const auction = auctionStore.get(uuid);

    if (!auction) {
      return HttpResponse.json(
        { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(auction.detail);
  }),

  http.get(`${API_BASE}/auctions/:uuid/bets`, async ({ params }) => {
    await delay(100);
    const uuid = params.uuid as string;
    const auction = auctionStore.get(uuid);

    if (!auction) {
      return HttpResponse.json(
        { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
        { status: 404 }
      );
    }

    if (auction.detail.hide_bets_history) {
      return HttpResponse.json({ bets: [] });
    }

    return HttpResponse.json({ bets: auction.bets });
  }),

  http.post(`${API_BASE}/auctions/:uuid/bets`, async ({ params, request }) => {
    await delay(200);
    const uuid = params.uuid as string;
    const body = (await request.json()) as SetBetRequest;
    const auction = auctionStore.get(uuid);

    if (!auction) {
      return HttpResponse.json(
        { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
        { status: 404 }
      );
    }

    if (!auction.detail.trading.can_set_bet) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Validation Failed',
          message: 'Cannot place bet',
          errors: [{ field: 'price', message: 'Ставки не принимаются', code: 'forbidden' }],
        },
        { status: 422 }
      );
    }

    const price = body.price;
    const { min, max, step } = auction.detail.trading.price;

    if (min != null && price < min) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Validation Failed',
          message: 'Price too low',
          errors: [{ field: 'price', message: `Минимальная ставка: ${min}`, code: 'too_small' }],
        },
        { status: 422 }
      );
    }

    if (max != null && price > max) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Validation Failed',
          message: 'Price too high',
          errors: [{ field: 'price', message: `Максимальная ставка: ${max}`, code: 'too_big' }],
        },
        { status: 422 }
      );
    }

    if (step != null && step > 0 && (price - (min ?? 0)) % step !== 0) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Validation Failed',
          message: 'Invalid step',
          errors: [{ field: 'price', message: `Шаг ставки: ${step}`, code: 'invalid_step' }],
        },
        { status: 422 }
      );
    }

    const newBet = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      auction_id: auction.detail.main.id,
      subscriber_id: 1,
      contact_name: 'Текущий пользователь',
      contact_phone: '+7 (999) 123-45-67',
      price_with_vat: price,
      price_no_vat: Math.round(price * 0.8),
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
        price_with_vat: price,
        price_no_vat: Math.round(price * 0.8),
        payment_type: 'Безналичный',
        vat_rate: '20',
      },
    };

    auctionStore.createBet(uuid, newBet);

    const bets = auction.bets;
    const maxPrice = Math.max(...bets.map((b) => b.price_with_vat));
    if (price === maxPrice) {
      auctionStore.updateTradingState(uuid, { status_mobile: 'Leading' });
    }

    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${API_BASE}/auctions/:uuid/favorite`, async ({ params }) => {
    await delay(50);
    const uuid = params.uuid as string;
    const auction = auctionStore.get(uuid);

    if (!auction) {
      return HttpResponse.json(
        { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
        { status: 404 }
      );
    }

    const newState = !auction.detail.trading.is_favorite;
    auctionStore.updateTradingState(uuid, { is_favorite: newState });
    auction.data.trading.is_favorite = newState;

    return HttpResponse.json({ is_favorite: newState });
  }),
];
