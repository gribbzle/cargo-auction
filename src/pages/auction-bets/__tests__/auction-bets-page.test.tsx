import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders, screen, waitFor } from '@/test-utils'
import { AuctionBetsPage } from '@/pages/auction-bets/ui/auction-bets-page.component'
import { createRouter, createRoute, createRootRoute, createMemoryHistory, RouterProvider } from '@tanstack/react-router'

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
      start: 200000, start_no_vat: null, current: 150000, current_no_vat: 120000,
      available: 151000, available_no_vat: 120800, min: 145000, min_no_vat: 116000,
      max: 200000, max_no_vat: 160000, step: 1000, step_no_vat: 800, price_per_km: 25,
    },
    your: { bet: false, last_bet: null, last_bet_with_vat: null, win: false },
    settings: { prolong_after_bet: 5, winner_confirm: null, winner_counter_mode: null, transmission_time_in: null, coefficient: null },
  },
  payment: { condition: null, condition_predefined: null, form: 'Безналичный', delay: null, delay_type: null, currency_code: '643', prepay: null },
  assembly: { num: null, date: null },
  routes: [],
  admitted_organizations: [],
  hide_bets_history: false,
}

const mockBets = [
  {
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
    price_info: { price_with_vat: 150000, price_no_vat: 125000, payment_type: 'Безналичный', vat_rate: '20' },
  },
  {
    id: 2,
    created_at: '2025-06-28T11:00:00Z',
    auction_id: 1,
    subscriber_id: 2,
    contact_name: 'Петр Петров',
    contact_phone: '+7 (999) 987-65-43',
    price_with_vat: 160000,
    price_no_vat: 133333,
    organization_id: 2,
    organization_inn: '7700000002',
    organization_name: 'ООО "Перевозчик 2"',
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 2,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: { price_with_vat: 160000, price_no_vat: 133333, payment_type: 'Безналичный', vat_rate: '20' },
  },
]

const handlers = [
  http.get('/api/v1/auctions/:uuid', async ({ params }) => {
    if (params.uuid === 'test-uuid-1') {
      return HttpResponse.json(mockAuction)
    }
    return HttpResponse.json({ code: 'not_found', title: 'Not Found', message: 'Auction not found' }, { status: 404 })
  }),
  http.get('/api/v1/auctions/:uuid/bets', async ({ params }) => {
    if (params.uuid === 'test-uuid-1') {
      return HttpResponse.json({ bets: mockBets })
    }
    return HttpResponse.json({ bets: [] })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createTestRouter(uuid = 'test-uuid-1') {
  const rootRoute = createRootRoute({
    component: () => <AuctionBetsPage />,
  })

  const betsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid/bets',
    component: () => <AuctionBetsPage />,
  })

  const routeTree = rootRoute.addChildren([betsRoute])
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createMemoryHistory({ initialEntries: [`/auctions/${uuid}/bets`] }),
  })
}

describe('AuctionBetsPage integration', () => {
  it('renders bets table with data', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('ООО "Перевозчик 1"')).toBeInTheDocument()
      expect(screen.getByText('ООО "Перевозчик 2"')).toBeInTheDocument()
    })
  })

  it('displays winner badge', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Победитель')).toBeInTheDocument()
    })
  })

  it('shows sort buttons', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText(/Место/)).toBeInTheDocument()
      expect(screen.getByText(/Сумма/)).toBeInTheDocument()
      expect(screen.getByText(/Дата/)).toBeInTheDocument()
    })
  })

  it('shows empty state when no bets', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid/bets', async () => {
        return HttpResponse.json({ bets: [] })
      }),
    )

    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Ставок пока нет')).toBeInTheDocument()
    })
  })

  it('shows back link', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('← К аукциону')).toBeInTheDocument()
    })
  })

  it('shows empty state when hide_bets_history is true', async () => {
    server.use(
      http.get('/api/v1/auctions/:uuid', async ({ params }) => {
        if (params.uuid === 'test-uuid-1') {
          return HttpResponse.json({ ...mockAuction, hide_bets_history: true })
        }
        return HttpResponse.json({ code: 'not_found', title: 'Not Found', message: 'Auction not found' }, { status: 404 })
      }),
      http.get('/api/v1/auctions/:uuid/bets', async () => {
        return HttpResponse.json({ bets: [] })
      }),
    )

    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Ставок пока нет')).toBeInTheDocument()
    })
  })
})
