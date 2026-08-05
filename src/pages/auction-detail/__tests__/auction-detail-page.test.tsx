import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithProviders, screen, waitFor } from '@/test-utils';
import { AuctionDetailPage } from '@/pages/auction-detail/ui/auction-detail-page.component';
import {
  createRouter,
  createRoute,
  createRootRoute,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router';

const mockAuction = {
  main: {
    id: 1,
    cargo_num: 'ЗАЯВ-0001',
    cargo_date: '2025-07-01T00:00:00Z',
    auc_type: 'Request' as const,
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
    status: 'Auction' as const,
    status_mobile: 'NotParticipating' as const,
    start_time: '2025-06-25T00:00:00Z',
    stop_time: '2025-07-15T00:00:00Z',
    bid_measurement_type: 'PerRoute' as const,
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
  routes: [
    {
      row_num: 1,
      op_type: 'Loading' as const,
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
      contact: { name: 'Иван Контакт', phone: '+7 (999) 123-45-67' },
    },
  ],
  admitted_organizations: [],
  hide_bets_history: false,
};

const handlers = [
  http.get('/api/v1/auctions/:uuid', async ({ params }) => {
    if (params.uuid === 'test-uuid-1') {
      return HttpResponse.json(mockAuction);
    }
    return HttpResponse.json(
      { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
      { status: 404 }
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createTestRouter(uuid = 'test-uuid-1') {
  const rootRoute = createRootRoute({
    component: () => <AuctionDetailPage />,
  });

  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid',
    component: () => <AuctionDetailPage />,
  });

  const routeTree = rootRoute.addChildren([detailRoute]);
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createMemoryHistory({ initialEntries: [`/auctions/${uuid}`] }),
  });
}

describe('AuctionDetailPage integration', () => {
  it('renders cargo number after loading', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ЗАЯВ-0001' })).toBeInTheDocument();
    });
  });

  it('shows auction type and status badges', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Request')).toBeInTheDocument();
      expect(screen.getByText('Auction')).toBeInTheDocument();
    });
  });

  it('shows route section', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Маршрут')).toBeInTheDocument();
      expect(screen.getByText('Москва')).toBeInTheDocument();
    });
  });

  it('shows cargo section', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Груз и требования')).toBeInTheDocument();
      expect(screen.getByText('Тент')).toBeInTheDocument();
    });
  });

  it('shows trading section with price', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Торговая информация')).toBeInTheDocument();
    });
  });

  it('shows organizer card', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Организатор')).toBeInTheDocument();
      expect(screen.getByText('ООО "Тест"')).toBeInTheDocument();
    });
  });

  it('shows payment card', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Условия оплаты')).toBeInTheDocument();
      expect(screen.getByText('Безналичный')).toBeInTheDocument();
    });
  });

  it('shows place bet button when can_set_bet', async () => {
    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Сделать ставку')).toBeInTheDocument();
    });
  });

  it('shows error state for non-existent auction', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async () => {
        return HttpResponse.json(
          { code: 'not_found', title: 'Not Found', message: 'Auction not found' },
          { status: 404 }
        );
      })
    );

    const router = createTestRouter('non-existent');
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Ошибка загрузки аукциона')).toBeInTheDocument();
    });
  });

  it('hides "Смотреть ставки" when hide_bets_history is true', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async () => {
        return HttpResponse.json({
          ...mockAuction,
          trading: { ...mockAuction.trading, hide_bets_history: true },
        });
      })
    );

    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'ЗАЯВ-0001' })).toBeInTheDocument();
    });

    expect(screen.queryByText('Смотреть ставки')).not.toBeInTheDocument();
  });

  it('shows "Ставки не принимаются" when can_set_bet is false', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async () => {
        return HttpResponse.json({
          ...mockAuction,
          trading: { ...mockAuction.trading, can_set_bet: false },
        });
      })
    );

    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Ставки не принимаются')).toBeInTheDocument();
    });

    expect(screen.queryByText('Сделать ставку')).not.toBeInTheDocument();
  });

  it('hides route contact info when hide_points_address_and_contacts is true', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async () => {
        return HttpResponse.json({
          ...mockAuction,
          trading: { ...mockAuction.trading, hide_points_address_and_contacts: true },
        });
      })
    );

    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Маршрут')).toBeInTheDocument();
    });

    expect(screen.queryByText('Иван Контакт')).not.toBeInTheDocument();
  });

  it('hides cargo price when no_view_cargo_price is true', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async () => {
        return HttpResponse.json({
          ...mockAuction,
          trading: { ...mockAuction.trading, no_view_cargo_price: true },
        });
      })
    );

    const router = createTestRouter();
    renderWithProviders(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Груз и требования')).toBeInTheDocument();
    });

    expect(screen.queryByText('1 000 000 ₽')).not.toBeInTheDocument();
  });
});
