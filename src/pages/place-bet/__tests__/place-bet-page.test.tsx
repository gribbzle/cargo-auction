import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProviders, screen, waitFor, userEvent } from '@/test-utils'
import { PlaceBetPage } from '@/pages/place-bet/ui/place-bet-page.component'
import { createRouter, createRoute, createRootRoute, Outlet, createMemoryHistory, RouterProvider } from '@tanstack/react-router'

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
  payment: { condition: null, condition_predefined: null, form: 'Безналичный', delay: null, delay_type: null, currency_code: 643, prepay: null },
  assembly: { num: null, date: null },
  routes: [],
  admitted_organizations: [],
  hide_bets_history: false,
}

const handlers = [
  http.get('/api/v1/auctions/:uuid', async ({ params }) => {
    if (params.uuid === 'test-uuid-1') {
      return HttpResponse.json(mockAuction)
    }
    return HttpResponse.json({ code: 'not_found', title: 'Not Found', message: 'Auction not found' }, { status: 404 })
  }),
  http.post('/api/v1/auctions/:uuid/bets', async ({ request }) => {
    const body = await request.json() as { price?: number }
    const price = body?.price
    if (price != null && (price < 145000 || price > 200000)) {
      return HttpResponse.json({
        code: 'validation_failed',
        message: 'Validation failed',
        errors: [{ field: 'price', message: 'Минимальная ставка: 145 000 ₽', code: 'too_low' }],
      }, { status: 422 })
    }
    // Delay to allow test to catch pending state
    await new Promise(resolve => setTimeout(resolve, 100))
    return new HttpResponse(null, { status: 200 })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createTestRouter(uuid = 'test-uuid-1', initialPath?: string) {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  })

  const placeBetRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid/place-bet',
    component: () => <PlaceBetPage />,
  })

  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid',
    component: () => <div>Auction Detail</div>,
  })

  const routeTree = rootRoute.addChildren([placeBetRoute, detailRoute])
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createMemoryHistory({ initialEntries: [initialPath ?? `/auctions/${uuid}/place-bet`] }),
  })
}

describe('PlaceBetPage integration', () => {
  it('renders the form after loading', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Сделать ставку' })).toBeInTheDocument()
    })
  })

  it('displays price input field', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Ваша ставка/)).toBeInTheDocument()
    })
  })

  it('shows quick bet buttons', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Быстрая ставка')).toBeInTheDocument()
      expect(screen.getByText('Мин.')).toBeInTheDocument()
      expect(screen.getByText('Макс.')).toBeInTheDocument()
    })
  })

  it('shows sidebar with current price info', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Текущая информация')).toBeInTheDocument()
    })
  })

  it('shows breadcrumbs', async () => {
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
      expect(screen.getAllByText('ЗАЯВ-0001').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('submits bet and shows pending state', async () => {
    const user = userEvent.setup()
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Сделать ставку' })).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Ваша ставка/)
    await user.clear(input)
    await user.type(input, '150000')

    const submitButton = screen.getByRole('button', { name: 'Подтвердить ставку' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('shows validation error for out-of-range price', async () => {
    const user = userEvent.setup()
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Сделать ставку' })).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Ваша ставка/)
    await user.clear(input)
    await user.type(input, '50000')

    const submitButton = screen.getByRole('button', { name: 'Подтвердить ставку' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Минимальная ставка/)).toBeInTheDocument()
    })
  })

  it('sets min price via quick bet button', async () => {
    const user = userEvent.setup()
    const router = createTestRouter()
    renderWithProviders(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Сделать ставку' })).toBeInTheDocument()
    })

    const minButton = screen.getByText('Мин.')
    await user.click(minButton)

    const input = screen.getByTestId("price") as HTMLInputElement
    expect(input.value).toBe('145000')
  })
})
