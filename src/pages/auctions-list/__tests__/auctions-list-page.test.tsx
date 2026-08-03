import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders, screen, waitFor } from '@/test-utils'
import { AuctionsListPage } from '@/pages/auctions-list/ui/auctions-list-page.component'
import { createRouter, createRoute, createRootRoute, createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { auctionsListRoute } from '@/app/router/router'

function createTestRouter() {
  const rootRoute = createRootRoute({
    component: () => <AuctionsListPage />,
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <AuctionsListPage />,
  })

  const listRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions',
    component: () => <AuctionsListPage />,
  })

  const routeTree = rootRoute.addChildren([indexRoute, listRoute])
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createMemoryHistory({ initialEntries: ['/auctions'] }),
  })
}

const mockAuctions = [
  {
    uuid: 'test-uuid-1',
    main: {
      id: 1,
      cargo_num: 'ЗАЯВ-0001',
      cargo_date: '2025-07-01T00:00:00Z',
      auc_type: 'Request' as const,
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
      load: { city: 'Москва', address: 'ул. Тест, 1', date: '2025-07-10T00:00:00Z', city_gc_id: 1, points_count: 1 },
      unload: { city: 'Казань', address: 'ул. Доставки, 1', date: '2025-07-12T00:00:00Z', city_gc_id: 3, points_count: 1 },
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
      status: 'Auction' as const,
      status_mobile: 'NotParticipating' as const,
      start_time: '2025-06-25T00:00:00Z',
      stop_time: '2025-07-15T00:00:00Z',
      bid_measurement_type: 'PerRoute' as const,
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
    payment: { form: 'Безналичный', currency_code: '643', consignor: '', consignee: '' },
  },
]

const handlers = [
  http.post('/api/v1/auctions/list', async () => {
    return HttpResponse.json({
      data: mockAuctions,
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: 20,
        to: 1,
        total: 1,
      },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('AuctionListPage integration', () => {
  it('renders auction cards after loading', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('ЗАЯВ-0001')).toBeInTheDocument()
    })
  })

  it('displays auction type badge', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Request')).toBeInTheDocument()
    })
  })

  it('displays route cities', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Москва')).toBeInTheDocument()
      expect(screen.getByText('Казань')).toBeInTheDocument()
    })
  })

  it('shows action button when can_set_bet', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Сделать ставку')).toBeInTheDocument()
    })
  })

  it('shows empty state when no auctions', async () => {
    server.use(
      http.post('/api/v1/auctions/list', async () => {
        return HttpResponse.json({
          data: [],
          meta: { current_page: 1, from: 0, last_page: 1, per_page: 20, to: 0, total: 0 },
        })
      }),
    )

    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
    })
  })
})
