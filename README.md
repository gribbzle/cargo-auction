# Cargo Auction

React frontend for a cargo auction platform. Users can browse auctions, filter by multiple criteria, view auction details, place bids, and track bid history.

## Tech Stack

- **React 19** + **TypeScript 7.0.2**
- **Vite 8** — build tool and dev server
- **TanStack Router** — client-side routing with URL search param state
- **TanStack Query** — server state management and caching
- **Zustand** — UI state (sidebar, collapsed panels)
- **Axios** — HTTP client with interceptors (401 toast, 422 ValidationError)
- **React Hook Form + Zod v4** — form validation with dynamic schemas
- **Tailwind CSS v4** — styling via `@tailwindcss/vite` plugin
- **Sonner** — toast notifications
- **MSW v2** — mock API server with mutable in-memory store
- **Vitest + React Testing Library** — unit and integration tests
- **oxlint** — linting

## Architecture

Feature Sliced Design (FSD) with 6 layers:

```
src/
├── app/          # Router, providers, global config
├── pages/        # Route page components (4 pages)
├── widgets/      # Composite UI blocks (AuctionCard, AuctionFilters, AuctionPagination)
├── features/     # User interactions (FavoriteButton, PrefetchAuction, PlaceBet)
├── entities/     # Business entities (City dictionary, Auction types)
└── shared/       # API client, UI kit, utilities, types
```

## Docker Setup

### Images

- **Dockerfile.prod** — production build (multi-stage, ~63MB, uses `serve`)
- **Dockerfile.dev** — development (includes dev dependencies, hot reload via Vite)

### Services (docker-compose.yml)

- `frontend` — production image on port 5173
- `frontend-dev` — development image with bind mounts (`./src`, `./public`) on port 5173

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run with Docker (Recommended)

**Development** (hot reload):
```bash
make dev
```

**Production**:
```bash
make prod
```

The app will be available at `http://localhost:5173`.

### Without Docker

```bash
npm install
npm run dev
```

### Makefile Commands

| Command | Description |
|:---|:---|
| `make dev` | Start development with hot reload |
| `make prod` | Build and run production image |
| `make build` | Build production Docker image (Dockerfile.prod) |
| `make build-dev` | Build development Docker image (Dockerfile.dev) |
| `make up` | Start all services |
| `make down` | Stop all services |
| `make logs` | View container logs |
| `make test` | Run tests in container |
| `make test-watch` | Run tests in watch mode |
| `make lint` | Run linter in container |
| `make typecheck` | TypeScript type checking in container |
| `make clean` | Stop containers, remove images, prune system |

### NPM Commands

| Command | Description |
|:---|:---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | Run oxlint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Pages

| Route | Description |
|:---|:---|
| `/auctions` | Auction listing with filters, pagination, URL state sync |
| `/auctions/:uuid` | Auction detail — route, cargo, trading info, organizer, payment |
| `/auctions/:uuid/bets` | Bid history table with sorting by place/price/date |
| `/auctions/:uuid/place-bet` | Place bid form with min/max/step validation and quick bet buttons |

## Features

### Auction Listing
- **Filters**: cargo number, status (multi-select), auction type, load/unload city (autocomplete from 50-city dictionary), date range, available only, my bids only, price range, results per page
- **URL state sync**: all filter values persisted in URL search params (validated with Zod)
- **Prefetch**: auction detail prefetched on card hover/intent
- **Responsive**: filter accordion on mobile, stacked cards

### Auction Detail
- Route points with load/unload cities, addresses, dates, contacts
- Cargo requirements (body type, weight, volume, temperature, ADR, loading types, documents)
- Trading info (status, current/start price, bid step, time range)
- Organizer card, payment conditions
- Conditional rendering based on DTO flags:
  - `can_set_bet` — show/hide "Place Bet" button
  - `hide_bets_history` — hide bid history section
  - `hide_points_address_and_contacts` — hide addresses/contacts
  - `no_view_cargo_price` — hide cargo price

### Place Bid
- React Hook Form + Zod validation with **dynamic min/max/step** from auction data
- Quick bet buttons: 90%, 95%, 100%, Min, Max (disabled when out of range)
- Server-side 422 error mapping to form fields
- Optimistic update: invalidates detail + bets queries, redirects on success

### Bid History
- Sortable table: place, price (with/without VAT), date, carrier
- Winner badge, cancelled bid indicator, cancel reason
- Empty state and hidden history state support

## Testing

**91 tests** across 11 test files:

| Category | Files | Tests |
|:---|:---|:---|
| Unit (pure logic) | 7 | 67 |
| Integration (MSW + RTL) | 4 | 24 |

### Unit Tests
- Search params schema validation
- Currency/date formatters
- Auction type/status/trading badge mappings
- Place bet action logic (determines button text/target)
- Filter schema defaults and URL sync
- Query key hierarchy
- City search function

### Integration Tests
- Auction list page: renders cards, shows filters, handles empty state
- Auction detail page: all sections render, badges, error state
- Auction bids page: table with data, sorting, empty state, back link
- Place bet page: form renders, price input, quick bet buttons, sidebar, breadcrumbs

### Running Tests

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

## Known Limitations

- **Mock data only** — all API responses are mocked via MSW; no real backend integration
- **No authentication** — MSW always returns authorized state; no login flow
- **No production Docker** — single dev Dockerfile with hot reload only
- **Static city dictionary** — 50 hardcoded Russian cities (would be API-driven in production)
- **CSR only** — no server-side rendering or static generation

## AI Usage

See [AI_USAGE.md](./AI_USAGE.md) for detailed documentation of AI-assisted development, architectural decisions, rejected suggestions, and remaining risks.
