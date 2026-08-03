# AI_USAGE.md

This document describes how AI was used in the development of the Cargo Auction platform, what decisions were made, and what areas required extra scrutiny.

---

## 1. What Was Done With AI Assistance

### Architecture & Planning
- **FSD folder structure** design and scaffolding (all 6 layers: app, pages, widgets, features, entities, shared)
- **Development plan** — 7-phase implementation plan based on test assignment analysis
- **TypeScript DTO types** (`shared/api/dto.ts`) — full type definitions derived from API JSON responses
- **Zod search params schema** (`app/router/search-params.ts`) — complex filter validation with safe defaults
- **Filter schema & defaults** (`widgets/auction-filters/model/filters.schema.ts`) — URL state sync with TanStack Router

### Component Implementation
- **All page components**: auctions-list, auction-detail, auction-bets, place-bet
- **All widget components**: AuctionCard, AuctionFilters, AuctionPagination, Breadcrumbs
- **All shared UI kit**: Badge, Button, Input, Select, Combobox, Skeleton
- **Feature components**: FavoriteButton, PrefetchAuction hook
- **ErrorBoundary** component for runtime error handling

### State & Data Layer
- **TanStack Query integration** — query keys, provider setup, cache invalidation patterns
- **MSW v2 mock server** — 5 handlers, mutable in-memory store, 25-seed auction data generator
- **Mock Cities Dictionary** — 50 Russian cities with search function
- **Zustand UI store** — sidebar/collapsed state management
- **Axios HTTP client** — interceptors for 401 toast, 422 ValidationError parsing
- **TanStack Query** — retry on 5xx/network errors (2 attempts, exponential backoff), no retry on 4xx

### Testing
- **Vitest + React Testing Library** setup with jsdom
- **7 unit test files** (67 tests): search-params, formatters, badges, action logic, filters, query-keys, cities
- **4 integration test files** (24 tests): all 4 pages tested with MSW + router
- **Test utilities** — renderWithProviders helper with QueryClient + Router providers

### Quality & Polish
- **Responsive design** — mobile filter accordion, horizontal scroll on bets table
- **Accessibility** — ARIA labels, aria-pressed, aria-expanded, aria-invalid, focus-visible rings, semantic HTML
- **Empty state illustrations** — all 4 pages show meaningful empty states
- **Prefetch on hover** — auction detail prefetched on card hover/intent

---

## 2. Architectural Decisions Made Independently

| Decision | Rationale |
|:---|:---|
| **Single Dockerfile** (dev only) | Test assignment requires "runs locally" only. No production deployment needed. Simplifies Dockerfile. |
| **oxlint over ESLint** | Faster, simpler config, sufficient for project needs |
| **No Prettier** | User preference — oxlint handles formatting rules |
| **Zustand for UI state only** | TanStack Query handles all server state; Zustand for sidebar/collapsed toggle only |
| **MSW v2 (not v1)** | Current version, ESM-compatible, better TypeScript support |
| **Tailwind CSS v4 via @tailwindcss/vite** | Vite plugin integration, no postcss.config needed |
| **react-hook-form + zod/v4** | Latest Zod v4 with `zod/v4` import path, proven form library |
| **Sonner over react-toastify** | Lighter, modern, better defaults |
| **Place Bet as separate page** | Required by test assignment — NOT a modal or tab on detail page |
| **Query key hierarchy** | Structured query keys (`auctionKeys.list(filters)`, `.detail(uuid)`, `.bets(uuid)`) for targeted cache invalidation |

---

## 3. AI Suggestions That Were Rejected

| Suggestion | Why Rejected |
|:---|:---|
| ESLint + Prettier setup | User explicitly preferred oxlint only, no Prettier |
| React Hook Form context provider | Added complexity; direct `useForm` in page component is sufficient |
| Production Dockerfile with Nginx | User explicitly said "single Dockerfile, dev only" |
| E2E tests with Playwright | Time constraint — unit + integration tests provide sufficient coverage for test assignment |
| Infinite scroll for auction list | Pagination is the standard UX pattern for this type of application; simpler to implement correctly |
| GraphQL API layer | The backend uses REST; no reason to add GraphQL complexity |
| i18n/internationalization | Russian-only application per test assignment requirements |

---

## 4. Areas Verified Extra Carefully

### Type Safety
- All DTO types in `shared/api/dto.ts` manually verified against actual API JSON responses
- Zod schemas validated against all filter combinations
- TypeScript strict mode — zero `any` types in application code

### Test Assignment Compliance
Every requirement from the test assignment checklist was verified:
- ✅ Place Bet is a **separate page** at `/auctions/:auctionUuid/place-bet`
- ✅ All **mandatory filters** present: cargo_num, status, auc_type, load_city, unload_city, dates, is_available, is_bidder, price range, per_page
- ✅ **Mock Cities Dictionary** powers load_city/unload_city selectors
- ✅ Auction Card displays all **11 mandatory field groups**
- ✅ Detail page respects all **4 DTO flags** (can_set_bet, hide_bets_history, hide_points_address_and_contacts, no_view_cargo_price)
- ✅ Bets page shows all **8 mandatory columns** + empty state + hidden history state
- ✅ Place Bet Form validates **min/max/step** + shows price hints
- ✅ MSW store updates **trading state** after bid (price, your bet, status)

### Data Integrity
- MSW seed data generates 25 auctions with realistic variety (8 forced active with non-winner status)
- Currency formatting handles ISO 4217 numeric codes (643=RUB)
- Date formatting handles ISO 8601 timestamps with Russian locale
- Form validation uses dynamic min/max/step from auction detail DTO

### Edge Cases Tested
- Empty auction list → "Ничего не найдено" state
- Empty bets list → "Ставок пока нет" state
- 404 auction → "Аукцион не найден" state with back link
- 422 validation error → field-level error toast on Place Bet form
- Disabled quick bet buttons when value exceeds valid range

---

## 5. Remaining Risks and Known Limitations

| Risk/Limitation | Impact | Mitigation |
|:---|:---|:---|
| **No real API integration** | All data is mocked via MSW. Real API may have different response shapes. | MSW handlers match documented OpenAPI contract. DTO types can be adjusted. |
| **No authentication flow** | MSW always returns authorized state. 401 interceptor shows toast but has no login page. | Test assignment doesn't require login. Toast provides user feedback. |
| **No production build optimization** | Single dev Dockerfile only. No tree-shaking analysis, no bundle splitting. | Not required by test assignment. |
| **No error boundary on every route** | Single root-level ErrorBoundary. Nested errors may not be caught. | Sufficient for test assignment scope. |
| **City dictionary is static** | 50 hardcoded cities. Real app would fetch from API. | Test assignment requires mock dictionary. |
| **No SSR/SSG** | CSR only via Vite. No SEO optimization. | Not applicable — this is an auction platform, not a content site. |

---

## 6. What Would Be Improved With One More Day

1. **More integration test scenarios** — test filter combinations, form validation edge cases, error states
2. **Bundle optimization** — route-based code splitting with React.lazy + Suspense
3. **Storybook** — visual component documentation and testing
4. **E2E tests** — critical user flows with Playwright
5. **Performance audit** — Lighthouse score optimization, virtualized auction list for large datasets
