import { createRouter, createRoute, createRootRoute, redirect, Outlet, Link } from '@tanstack/react-router'
import { AuctionsListPage } from '@/pages/auctions-list/ui/auctions-list-page.component'
import { AuctionDetailPage } from '@/pages/auction-detail/ui/auction-detail-page.component'
import { PlaceBetPage } from '@/pages/place-bet/ui/place-bet-page.component'
import { AuctionBetsPage } from '@/pages/auction-bets/ui/auction-bets-page.component'
import { ErrorBoundary } from '@/shared/ui'
import { auctionListSearchSchema } from './search-params'

const rootRoute = createRootRoute({
  component: RootLayout,
})

// oxlint-disable-next-line react/only-export-components
function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Link to="/auctions" className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors">
            Cargo Auction
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6" role="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/auctions' })
  },
})

export const auctionsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions',
  validateSearch: (search: Record<string, unknown>) => {
    const result = auctionListSearchSchema.safeParse(search)
    if (!result.success) return {}
    return result.data
  },
  component: AuctionsListPage,
})

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  component: AuctionDetailPage,
})

const placeBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/place-bet',
  component: PlaceBetPage,
})

const auctionBetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bets',
  component: AuctionBetsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionsListRoute,
  auctionDetailRoute,
  placeBetRoute,
  auctionBetsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
