# Development Plan

This document outlines the final step-by-step implementation plan for the auction platform, taking into account all previous analysis documents (phase-0-analysis.md, api-analysis.md, architecture.md, folder-structure.md, state-management.md, user-flows.md, component-inventory.md, ui-guidelines.md, docker.md) **and the compliance analysis against the test assignment requirements**.

## 1. Project Overview
The application is a modern React frontend with TypeScript that allows users to browse, search, and bid on auctions. It follows the Feature Sliced Design (FSD) methodology, uses TanStack Query for data fetching, Zustand for UI state management, and follows strict coding standards.

**Примечание по Docker:** Docker не упомянут в тестовом задании — это самостоятельное решение кандидата. ТЗ требует лишь "запускается локально". Docker обеспечивает воспроизводимое окружение и удобный onboarding, что будет задокументировано в README.

**⚠️ CRITICAL COMPLIANCE NOTES FROM TEST ASSIGNMENT ANALYSIS:**
- **Place Bet MUST be a separate page at `/auctions/:auctionUuid/place-bet`** (not a modal/tab on detail page)
- **Mandatory filters missing**: `cargo_num`, `is_available`, `is_bidder`, `auc_type`, city selectors for `load_city`/`unload_city`
- **Auction Card missing fields**: auction type badge, trading status, route, dates, cargo details, price per km, bid step, "my bet" flag, correct primary actions
- **Detail Page DTO flags**: must respect `can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`
- **Bets Page missing fields**: price with/without VAT, carrier, rank, winner flag, cancelled flag, cancel reason, empty state, hidden history state
- **Place Bet Form**: must validate against `min`/`max`/`step` from detail DTO, show hints for available price and step
- **Mock Cities Dictionary**: required for `load_city`/`unload_city` selectors
- **AI_USAGE.md**: mandatory deliverable documenting AI usage, decisions, risks, improvements

---

## 2. Implementation Phases

### Phase 1: Environment Setup & Project Initialization (1-2 days)
- Set up development environment with Docker Compose
- Configure Node.js version (20.x) and package manager (npm)
- Initialize project structure with FSD methodology
- Set up ESLint, Prettier, and TypeScript configuration
- Configure Git repository with Conventional Commits and branch strategy
- Create initial Dockerfiles and docker-compose.yml
- **Verify: `docker compose up --build` works with hot reload and source mounting**

### Phase 2: Core Architecture & State Management (3-4 days)
- Implement API client with Axios and interceptors
  - Response-interceptor: 401 → toast "Сессия истекла" (страницы логина нет, MSW всегда авторизован)
  - Response-interceptor: 503 → retry logic (2 попытки, exponential backoff)
- Set up TanStack Query provider with query clients
- Implement Zustand store for UI state management
- Configure routing with TanStack Router (including `/auctions/:auctionUuid/place-bet` route)
- Set up MSW for mock API responses during development
  - **Mutable store design with real state updates after mutations**
  - **Mock Cities Dictionary** (`/mocks/data/cities.ts`) for `load_city`/`unload_city` selectors
  - **Auction store structure**: `auctions[uuid].trading.{status_mobile, your, price}`, `bets[uuid][]`

### Phase 3: Core Features — Auction Listing (3-4 days)
- **AuctionCard Component** (widgets/auction-card) — **ALL mandatory fields from test assignment:**
  - Номер заявки
  - Тип аукциона: Request / Up / Down / FixPrice (badge)
  - Статус аукциона (badge)
  - Торговый статус пользователя: Leading / Losing / Winner / etc. (badge)
  - Маршрут: погрузка → выгрузка
  - Даты погрузки / разгрузки
  - Груз: название, вес, объём, тип кузова
  - Текущая цена, цена за км, шаг ставки
  - Флаг «моя ставка есть / нет»
  - Primary Action: «Сделать ставку» / «Изменить ставку» / «Смотреть ставки» / disabled (per trading state)
- **AuctionList Component** with virtualized/infinite scroll
- **AuctionFilters Widget** (widgets/auction-filters) — **ALL mandatory filters:**
  - `cargo_num` — текстовый поиск по номеру заявки
  - `status` / `statuses` — мультиселект статусов
  - `auc_type` — селект типа аукциона (Request/Up/Down/FixPrice)
  - `load_city` — **City Selector (autocomplete) from mock dictionary**
  - `unload_city` — **City Selector (autocomplete) from mock dictionary**
  - `load_date_from` / `load_date_to` — диапазон дат
  - `is_available` — чекбокс/тумблер «Только доступные»
  - `is_bidder` — чекбокс/тумблер «Где я делал ставки»
  - `price_from` / `price_to` — числовой диапазон
  - `per_page` — селект количества на странице (10/20/50)
- URL state synchronization for all filters (TanStack Router + Zod search params validation with safe fallbacks)
- Prefetch auction detail on card hover/intent (features/prefetch-auction)

### Phase 3.5: Core Features — Place Bet Page (Separate Route) (2-3 days)
**⚠️ CRITICAL: This is a SEPARATE PAGE at `/auctions/:auctionUuid/place-bet`, NOT a modal on detail page**
- **Page**: `pages/place-bet/`
- **PlaceBidForm Feature** (features/place-bet):
  - React Hook Form + Zod validation
  - **Dynamic schema factory**: `createPlaceBetSchema(tradingPrice)` using `min`, `max`, `step` from `AuctionShowTradingPrice`
  - **Hints**: show available price, bid step, min/max boundaries
  - Client-side validation + server-side 422 error mapping to form fields
  - On success: invalidate auction detail + bets list queries, redirect back to detail
- **Prefetch**: detail page data prefetched on hover of "Place Bid" button on card/detail

### Phase 4: Core Features — Auction Detail & Bets (4-5 days)
- **AuctionDetail Page** (`pages/auction-detail/`)
  - **AuctionDetails Widget**: all fields from detail DTO
  - **Respect DTO flags** (conditional rendering):
    - `can_set_bet` → show/hide "Place Bet" button/link
    - `hide_bets_history` → show "История ставок скрыта" instead of BetsTable
    - `hide_points_address_and_contacts` → hide addresses/contacts in route points
    - `no_view_cargo_price` → hide cargo price fields
- **Bets Page/Widget** (`widgets/auction-bets/`)
  - **BetsSummary**: total participants, current leader, etc.
  - **BetsTable** with **ALL mandatory columns**:
    - Список ставок
    - Количество участников
    - Цена с НДС / без НДС
    - Перевозчик
    - Место в рейтинге
    - Признак победителя
    - Признак отменённой ставки
    - Причина отмены (если есть)
  - **Empty State**: «Ставок пока нет»
  - **Hidden History State**: when `hide_bets_history=true` show info message instead of table
- **Trading Status Badges**: `AuctionTypeBadge`, `AuctionStatusBadge`, `TradingStatusBadge` with full enum mappings (labels + colors)

### Phase 5: Advanced Features & Polish (4-5 days)
- **Search & Filter System Enhancements**
  - Debounced search input for `cargo_num`
  - `bid_measurement_type` (PerRoute/PerKm) display in card/detail
  - Currency formatter by `currency_code` (ISO 4217 numeric: 643=RUB, 840=USD, 978=EUR)
- **Responsive Design** (mobile-first)
  - Filters drawer on mobile
  - Stacked auction cards on mobile
  - Touch targets ≥ 48px
  - Test on 320px, 768px, 1440px breakpoints
- **Error Handling**
  - Global Error Boundary
  - 401 → redirect to login / token refresh
  - 503 → retry with exponential backoff + user notification
  - 422 → field-level form errors (already in PlaceBidForm)
- **Accessibility**: semantic HTML, ARIA labels, focus management, color contrast

### Phase 6: Testing & Quality Assurance (3-5 days)
**Unit Tests (Vitest) — MINIMUM COVERAGE FOR PURE LOGIC:**
- Search params parsing & Zod schemas (`features/auction-filters/model/`)
- Request builders (`shared/api/request-builders.ts`)
- ViewModel mappers DTO → UI (`entities/auction/model/mappers.ts`)
- Bet validation schema factory (`features/place-bet/model/place-bet.schemas.ts`)
- Enum → UI label/color mappers (`entities/auction/model/auction.constants.ts`)
- City selector filtering (`shared/lib/cities.ts`)

**Integration Tests (MSW + React Testing Library):**
- Auction list: filter → URL sync → API call → render cards
- Place Bet flow: open page → fill form (validation) → submit → success → redirect → data updated
- Detail page: DTO flags conditional rendering
- Bets page: empty state, hidden history, all columns render

**Coverage Thresholds**: 50%+ на файлах чистой логики (mappers, schemas, parsers). ТЗ требует "желательно минимальные тесты" — фокус на качестве покрытия четырёх типов логики, а не на цифре общего coverage.

### Phase 7: Documentation & Deployment (2-3 days)
- **AI_USAGE.md** — **MANDATORY DELIVERABLE** with:
  - Which parts were done with AI assistance
  - Which architectural decisions were made independently
  - Which AI suggestions were rejected and why
  - Which areas were verified extra carefully
  - Remaining risks and known limitations
  - What would be improved with one more day
- **README.md** — updated with:
  - What exactly was verified/tested
  - Which scenarios passed
  - Remaining limitations/known issues
  - How to run: `docker compose up --build`
- Configure CI/CD pipeline with GitHub Actions
- Set up production Docker image with Nginx
- Create deployment scripts for Vercel/Netlify (optional)
- Ensure all existing architecture documents are current

---

## 3. Dependencies & Milestones (Updated)

| Task | Priority | Estimated Time | Dependencies |
| :--- | :--- | :--- | :--- |
| Environment Setup & Docker | High | 1-2 days | None |
| Core API Integration + MSW Store + Mock Cities | High | 3-4 days | Environment Setup |
| State Management (TanStack Query + Zustand + Router) | High | 3-4 days | Core API Integration |
| Auction Listing + **Full Filters + Prefetch** | High | 3-4 days | State Management |
| **Place Bet Page (Separate Route)** | High | 2-3 days | Auction Listing, State Management |
| Auction Detail + **DTO Flags + Bets Page (Full Fields)** | High | 4-5 days | Auction Listing |
| Responsive Design & Accessibility | Medium | 2-3 days | All core features |
| Testing (Unit + Integration + E2E) | High | 3-5 days | All features |
| **AI_USAGE.md + README + Documentation** | High | 1-2 days | Testing |
| Deployment & CI/CD | Medium | 2-3 days | Documentation |

---

## 4. Critical Path

The critical path is:
**Environment Setup → Core API Integration + MSW Store + Mock Cities → State Management → Auction Listing + Full Filters → Place Bet Page (Separate Route) → Auction Detail + DTO Flags + Bets Page → Testing → AI_USAGE.md + Documentation**

Any delay in these steps will impact the entire timeline. Special attention should be paid to:
- **MSW mutable store with real state updates** (critical for bid flow testing)
- **Mock Cities Dictionary** (blocks filter implementation)
- **Place Bet as separate page** (architectural decision, not a modal)
- **All mandatory fields in AuctionCard, BetsTable, PlaceBidForm** (compliance with test assignment)
- **DTO flags conditional rendering** on detail page
- **Dynamic validation schema** for PlaceBidForm using `min/max/step`
- **AI_USAGE.md** (mandatory deliverable, not optional)

---

## 5. Risk Management (Updated)

| Risk | Impact | Probability | Mitigation |
| :--- | :--- | :--- | :--- |
| **Missing mandatory fields in UI** (card, bets, form) | Critical — fails test assignment | High | **Checklist-driven development**: each component has acceptance criteria from test assignment |
| **Place Bet implemented as modal not page** | Critical — fails test assignment | Medium | **Enforce in Phase 3.5**: separate `pages/place-bet/`, route in router, link from card/detail |
| **Mock Cities Dictionary incomplete** | High — blocks filters | Medium | Create `shared/lib/cities.ts` + `shared/ui/city-selector` in Phase 2 |
| **DTO flags not respected on detail** | High — fails test assignment | Medium | Explicit conditional rendering tasks in Phase 4 |
| **Bet validation without min/max/step** | High — fails test assignment | Medium | Schema factory `createPlaceBetSchema(tradingPrice)` in Phase 3.5 |
| **MSW store doesn't update trading state after bid** | High — breaks integration tests | Medium | Design store structure in Phase 2: `auctions[uuid].trading.{status_mobile, your, price}` |
| **AI_USAGE.md forgotten** | Medium — fails test assignment | Low | **Explicit task in Phase 7**, template prepared early |
| **Time estimation inaccuracies** | Medium | High | Break tasks into ≤1 day subtasks, daily check-ins |
| **API integration issues with backend** | Medium | Low | MSW mocks fully match OpenAPI contract |

---

## 6. Success Metrics (Updated)

- ✅ **100% of test assignment requirements implemented** (verified via checklist)
- ✅ **Place Bet accessible at `/auctions/:uuid/place-bet`** (direct link works)
- ✅ **All mandatory filters present and functional** (cargo_num, is_available, is_bidder, auc_type, cities)
- ✅ **Auction Card displays all 11 mandatory field groups**
- ✅ **Detail page respects all 4 DTO flags** (can_set_bet, hide_bets_history, hide_points_address_and_contacts, no_view_cargo_price)
- ✅ **Bets Page shows all 8 mandatory columns + empty state + hidden history state**
- ✅ **Place Bid Form validates min/max/step + shows hints**
- ✅ **Mock Cities Dictionary powers load_city/unload_city selectors**
- ✅ **AI_USAGE.md delivered** with all 6 required sections
- ✅ **README.md** documents verified scenarios and limitations
- ✅ **Docker**: `docker compose up --build` работает с hot reload (решение кандидата, задокументировано в README)
- ✅ **Naming convention**: all components `*.component.tsx`
- ✅ **Тесты на чистую логику**: search params parsing, request builder, VM-mappers, bet validation schema
- ✅ **Zero critical bugs** in test assignment flows

---

## 7. Definition of Done (Per Task)

A task is **Done** when:
1. Code implements all acceptance criteria from test assignment
2. Component follows naming convention (`*.component.tsx`)
3. FSD layer boundaries respected (no cross-layer imports)
4. Types from `shared/api/dto.ts` used, no `any`
5. MSW handler + store update implemented for any mutation
6. Unit test exists for pure logic (mappers, schemas, parsers, builders)
7. Integration test covers the user flow (MSW + RTL)
8. Responsive: works at 320px, 768px, 1440px
9. Accessible: semantic HTML, keyboard navigation, ARIA where needed
10. Documented in relevant architecture doc if new pattern introduced

---

## 8. Final Notes

This plan incorporates **all findings from the compliance analysis** against the test assignment. The key differences from the initial plan:

1. **Place Bet = Separate Page** (not modal) — explicit Phase 3.5
2. **Complete Filter Set** — 4 additional filters + City Selectors
3. **Complete Auction Card** — 11 field groups, correct actions per trading state
4. **Detail Page DTO Flags** — 4 conditional rendering requirements
5. **Complete Bets Page** — 8 columns, empty state, hidden history
6. **Place Bid Form Validation** — dynamic min/max/step + hints
7. **Mock Cities Dictionary** — new shared entity + UI component
8. **AI_USAGE.md** — mandatory Phase 7 deliverable
9. **Explicit MSW Store Structure** — designed upfront in Phase 2
10. **Checklist-driven verification** — every mandatory field traced to component

The implementation must follow the documented architecture, state management strategy, and coding standards strictly. **Daily verification against the test assignment checklist is recommended** to avoid scope drift. Regular code reviews and pair programming sessions are recommended to maintain quality throughout development.