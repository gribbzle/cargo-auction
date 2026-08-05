# Architecture Document

## 1. Project Overview

**Tech Stack:** React 18, TypeScript 5, TanStack Router, TanStack Query v5, Zustand, React Hook Form + Zod, MSW v2,
Vite, Docker, Vitest, Tailwind CSS **Architecture:** Feature-Sliced Design (FSD) — layers: `app`, `processes`, `pages`,
`widgets`, `features`, `entities`, `shared` **API Contract:** OpenAPI 3.0 (provided), DTO → ViewModel mapping at API
layer **State Strategy:** Server state → TanStack Query, UI state → Zustand, URL state → TanStack Router search params,
Form state → RHF

---

## 2. Layer Responsibilities (FSD)

| Layer       | Responsibility                                             | Public API Rule                            |
| ----------- | ---------------------------------------------------------- | ------------------------------------------ |
| `app`       | Providers, router, global styles, MSW worker init          | —                                          |
| `processes` | Cross-feature flows (auth, onboarding)                     | `index.ts` exports only                    |
| `pages`     | Route-level composition, URL search sync                   | No exports needed                          |
| `widgets`   | Self-contained UI blocks (filters, cards, tables)          | `index.ts` exports component + types       |
| `features`  | Business actions (place-bet, prefetch, filters-to-request) | `index.ts` exports hooks, actions, schemas |
| `entities`  | Business types, mappers, api, constants, ui primitives     | `index.ts` exports types, mappers, api, ui |
| `shared`    | Lib, UI kit, config, constants, helpers                    | `index.ts` exports everything              |

**Dependency Rule:** `app` → `processes` → `pages` → `widgets` → `features` → `entities` → `shared` (no reverse, no
same-layer imports)

---

## 3. Routing (TanStack Router)

| Route               | Path                               | Page                   | Search Params (Zod)       |
| ------------------- | ---------------------------------- | ---------------------- | ------------------------- |
| `auctions.list`     | `/auctions`                        | `pages/auctions-list`  | `AuctionListSearchSchema` |
| `auctions.detail`   | `/auctions/:auctionUuid`           | `pages/auction-detail` | —                         |
| `auctions.placeBet` | `/auctions/:auctionUuid/place-bet` | `pages/place-bet`      | —                         |
| `auctions.bets`     | `/auctions/:auctionUuid/bets`      | `pages/auction-bets`   | —                         |
| `root`              | `/`                                | Redirect → `/auctions` | —                         |

**Search Params Sync:** All filters → URL (shareable, browser history). Zod schema with safe defaults + `.catch()`
fallbacks.

---

## 4. API Layer (`entities/auction/api/`)

- **HTTP Client:** `Axios` instance (baseURL, credentials, timeout, interceptors)
- **Auth Strategy:** ТЗ не требует реальной аутентификации. MSW всегда возвращает авторизованные ответы (401 не
  генерируется моками намеренно). Axios response-interceptor перехватывает 401 от любого источника и показывает toast
  "Сессия истекла". Отдельной страницы логина нет.
- **Error Normalization:** `ProblemDetail` (RFC 7807), `ValidationError` (422 → fieldErrors map)
- **Request Builders:** `buildAuctionListRequest(searchParams)` → `AuctionListRequest`
- **Response Mappers:** `mapAuctionListItem(dto)` → `AuctionListItemViewModel`, `mapAuctionDetail(dto)` →
  `AuctionDetailViewModel`
- **Nullable Handling:** Explicit `null` → `undefined` in ViewModels, optional chaining in UI

---

## 5. TanStack Query Configuration

```ts
// queryClient defaults
{
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  retry: (count, error) => error instanceof ApiError && error.status >= 500 && count < 2,
  refetchOnWindowFocus: false,
}
```

**Query Keys:**

```ts
auctionKeys = {
  list: (params) => ['auctions', 'list', params] as const,
  detail: (uuid) => ['auctions', 'detail', uuid] as const,
  bets: (uuid) => ['auctions', 'bets', uuid] as const,
  tradingPrice: (uuid) => ['auctions', 'trading-price', uuid] as const,
};
```

**Invalidation Strategy:** After `placeBet` / `updateBet` →
`invalidateQueries({ queryKey: auctionKeys.detail(uuid) })` +
`invalidateQueries({ queryKey: auctionKeys.bets(uuid) })` + `invalidateQueries({ queryKey: auctionKeys.list() })`

**Prefetch:** `prefetchAuctionDetail(uuid)` on card hover (300ms debounce) + button focus.

---

## 6. State Management

| Domain            | Tool            | Example                                                    |
| ----------------- | --------------- | ---------------------------------------------------------- |
| Server cache      | TanStack Query  | `useAuctionList(params)`, `useAuctionDetail(uuid)`         |
| UI modals/drawers | Zustand         | `useUiStore`: `filtersDrawerOpen`, `betModalOpen`          |
| URL filters       | TanStack Router | `useSearch({ from: '/auctions', select: ... })`            |
| Form values       | React Hook Form | `useForm<PlaceBetForm>({ resolver: zodResolver(schema) })` |

**No server data in Zustand.** No `localStorage` for filters (URL only).

---

## 7. MSW Architecture (`mocks/`)

- **Mutable Store:** `auctionsStore`, `betsStore`, `citiesStore` — plain JS objects/Maps, mutated by handlers
- **Handlers:** `mocks/handlers/auctions.ts`, `bets.ts`, `cities.ts` — read/write stores, return OpenAPI-compliant
  responses
- **Realistic Mutations:** `POST /bets` → creates bet in store, updates `auction.trading.price.current`,
  `auction.trading.your.bet`, `auction.trading.status_mobile`
- **Seed:** `mocks/seed/auctions.seed.ts` generates 50+ auctions with all DTO flags, trading states, bets history
- **Worker:** `mocks/worker.ts` — `setupWorker(...handlers)`, started in `app/providers.tsx` (dev only)

---

## 8. Forms (React Hook Form + Zod)

- **Client Schema:** Zod (required, min/max, regex, custom refinements)
- **Server Errors (422):** `mapValidationErrorToFieldErrors(apiError)` → `form.setError(field, { message })`
- **Dynamic Schema:** `createPlaceBetSchema(tradingPrice: AuctionShowTradingPrice)` — injects `min`, `max`, `step` at
  runtime
- **Submission:** `handleSubmit(async (data) => { await placeBetMutation.mutateAsync(data) })`

---

## 9. Detail Page — DTO Flags Handling

| Flag                               | UI Behaviour                                                         |
| ---------------------------------- | -------------------------------------------------------------------- |
| `can_set_bet`                      | Show/hide "Place Bet" button / navigate to place-bet page            |
| `hide_bets_history`                | Render `BetsTableHidden` instead of `BetsTable` on Bets page         |
| `hide_points_address_and_contacts` | Mask addresses/contacts in `AuctionRoute` component (show city only) |
| `no_view_cargo_price`              | Hide `AuctionPricing` (price, price_per_km, step) on card & detail   |

**Implementation:** `useAuctionDetail(uuid)` returns ViewModel with flags; components consume via
`flags.hidePointsAddressAndContacts` etc.

---

## 10. Prefetch Strategy (`features/prefetch-auction/`)

- **Trigger:** `onMouseEnter` on `AuctionCard` (300ms debounce) + `onFocus` on "Details" button
- **Scope:** Prefetch `detail` + `tradingPrice` queries
- **Deduplication:** TanStack Query handles duplicate prefetches automatically
- **Cancellation:** `onMouseLeave` → `queryClient.cancelQueries({ queryKey })` if not resolved

---

## 11. Docker & Dev Environment

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports: ['5173:5173']
    volumes: ['.:/app', '/app/node_modules']
    command: npm run dev
```

- `npm run dev` — Vite HMR + MSW worker
- `docker compose up --build` — single command start (requirement)

---

## 12. Testing Strategy

| Type               | Tool                  | Scope                                                                                                         |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| Unit (pure logic)  | Vitest                | `mappers`, `request-builders`, `schemas`, `search-params-parsing`, `place-bet-schema-factory`, `enum-mappers` |
| Integration (flow) | Vitest + MSW          | `filters → request → list render`, `place bet → invalidation → UI update`, `prefetch on hover`                |
| E2E (smoke)        | Playwright (optional) | `load list → open detail → place bet → see in bets`                                                           |

**Coverage Target:** 80%+ on pure logic (`entities/**/model`, `features/**/model`, `shared/lib`)

---

## 13. UI Guidelines (Tailwind)

- **Breakpoints:** `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Mobile Filters:** Drawer (slide-over), trigger button in header
- **Card Layout:** Grid `lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1`, gap 4
- **Table:** Horizontal scroll on mobile, sticky header
- **Colors:** Semantic tokens (`bg-status-active`, `text-trading-winning`, `border-input-error`)
- **Components:** `*.component.tsx` naming (requirement)

---

## 14. Place Bet Page — Validation & Hints

**Schema Factory:**

```ts
export const createPlaceBetSchema = (trading: AuctionShowTradingPrice) =>
  z.object({
    amount: z
      .number()
      .min(trading.min, `Минимум ${formatCurrency(trading.min)}`)
      .max(trading.max, `Максимум ${formatCurrency(trading.max)}`)
      .refine((v) => (v - trading.min) % trading.step === 0, `Шаг ставки ${trading.step}`),
  });
```

**Hints Rendered:** "Доступная цена: X", "Шаг ставки: Y", "Мин/Макс: A / B"

---

## 15. MSW Store — Trading State Updates

On `POST /auctions/:uuid/bets`:

```ts
// betsStore.set(uuid, [...bets, newBet])
// auctionsStore.get(uuid).trading = {
  price: { current: newBet.amount, current_no_vat: ..., per_km: ... },
  your: { last_bet: newBet.amount, last_bet_with_vat: ..., bet: true, win: false },
  status_mobile: 'Leading', // or 'Winner', 'Losing' — из TradingStatus enum
  participants_count: bets.length,
}
```

---

## 16. Error Handling

| Error   | Handling                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------ |
| 400/422 | Form field errors (RHF `setError`), toast for non-field                                                |
| 401     | Axios response-interceptor → toast "Сессия истекла". Страницы логина нет, MSW авторизован по умолчанию |
| 403     | Toast "Недостаточно прав", disable action                                                              |
| 404     | NotFound page (TanStack Router `notFoundComponent`)                                                    |
| 500/503 | Retry (2x), then toast "Сервер недоступен", show retry button                                          |
| Network | Toast "Проверьте соединение", offline indicator                                                        |

---

## 17. Component Naming Convention

| Type               | Pattern                      | Example                              |
| ------------------ | ---------------------------- | ------------------------------------ |
| Page               | `*-page.tsx`                 | `auctions-list-page.tsx`             |
| Widget             | `*-widget.tsx`               | `auction-filters-widget.tsx`         |
| Feature            | `*-form.tsx`, `*-action.tsx` | `place-bet-form.tsx`                 |
| Entity UI          | `*-badge.tsx`, `*-row.tsx`   | `auction-status-badge.component.tsx` |
| Shared UI          | `*.component.tsx`            | `button.component.tsx`               |
| **All Components** | **`*.component.tsx`**        | **Requirement**                      |

---

## 18. Enum → UI Mapping

### 18.1 Auction Type (`AuctionType`)

| Enum Value | Label (RU)         | Label (EN)   | Badge Color                                                             | Icon           | Description                                  |
| ---------- | ------------------ | ------------ | ----------------------------------------------------------------------- | -------------- | -------------------------------------------- |
| `Request`  | Запрос цен         | Request      | `bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`         | `HelpCircle`   | Заказчик запрашивает цены у перевозчиков     |
| `Up`       | Аукцион вверх      | Up Auction   | `bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`         | `TrendingUp`   | Ставки растут, выигрывает максимальная       |
| `Down`     | Аукцион вниз       | Down Auction | `bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300` | `TrendingDown` | Ставки падают, выигрывает минимальная        |
| `FixPrice` | Фиксированная цена | Fixed Price  | `bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`     | `Tag`          | Цена фиксирована, первое согласие выигрывает |

**Usage:** `AuctionTypeBadge` component, `auctionTypeLabel(type)`, `auctionTypeColor(type)`

---

### 18.2 Auction Status (`AuctionStatus`)

Значения берутся строго из OpenAPI-схемы (`AuctionStatus` enum).

| Enum Value          | Label (RU)             | Label (EN)         | Badge Color                     | Icon          | Semantic Meaning                         |
| ------------------- | ---------------------- | ------------------ | ------------------------------- | ------------- | ---------------------------------------- |
| `Planning`          | Планирование           | Planning           | `bg-gray-100 text-gray-600`     | `Clock`       | Аукцион запланирован, торги не начались  |
| `Auction`           | Торги идут             | Active             | `bg-green-100 text-green-700`   | `Activity`    | Торги в процессе прямо сейчас            |
| `DeterminateWinner` | Определение победителя | Determining Winner | `bg-blue-100 text-blue-700`     | `Search`      | Торги завершены, выбирается победитель   |
| `WaitDeal`          | Ожидание сделки        | Awaiting Deal      | `bg-purple-100 text-purple-700` | `Hourglass`   | Победитель определён, ждём подтверждения |
| `InProgress`        | В работе               | In Progress        | `bg-indigo-100 text-indigo-700` | `Truck`       | Сделка подтверждена, груз в пути         |
| `Finished`          | Завершён               | Finished           | `bg-gray-100 text-gray-500`     | `Flag`        | Аукцион полностью завершён               |
| `Stopped`           | Остановлен             | Stopped            | `bg-orange-100 text-orange-700` | `PauseCircle` | Аукцион остановлен организатором         |
| `Canceled`          | Отменён                | Canceled           | `bg-red-100 text-red-700`       | `XCircle`     | Аукцион отменён                          |
| `Unknown`           | Неизвестно             | Unknown            | `bg-gray-100 text-gray-400`     | `HelpCircle`  | Статус не определён                      |

**Note:** `status_mobile` в trading — это **торговый статус пользователя**, не путать с `auction.status` (статус
аукциона).

---

### 18.3 Trading Status — User's Position (`TradingStatus`)

Значения берутся строго из OpenAPI-схемы (`TradingStatus` enum). Поле в DTO: `trading.status_mobile`.

| Enum Value         | Label (RU)       | Label (EN)        | Badge Color                     | Icon          | When Shown                         |
| ------------------ | ---------------- | ----------------- | ------------------------------- | ------------- | ---------------------------------- |
| `NotParticipating` | Не участвую      | Not Participating | `bg-gray-100 text-gray-500`     | `MinusCircle` | Пользователь не делал ставку       |
| `Leading`          | Лидирую          | Leading           | `bg-green-100 text-green-700`   | `Award`       | Моя ставка лучшая на данный момент |
| `Losing`           | Перебит          | Losing            | `bg-red-100 text-red-700`       | `ArrowDown`   | Есть ставка лучше моей             |
| `OnPending`        | На рассмотрении  | On Pending        | `bg-yellow-100 text-yellow-700` | `Hourglass`   | Ставка на рассмотрении             |
| `Confirmed`        | Подтверждён      | Confirmed         | `bg-blue-100 text-blue-700`     | `CheckCircle` | Победа подтверждена                |
| `ChoosingWinner`   | Выбор победителя | Choosing Winner   | `bg-purple-100 text-purple-700` | `Search`      | Организатор выбирает победителя    |
| `Winner`           | Победитель       | Winner            | `bg-yellow-100 text-yellow-700` | `Trophy`      | Аукцион завершён, я победитель     |
| `Accepted`         | Принят           | Accepted          | `bg-indigo-100 text-indigo-700` | `ThumbsUp`    | Результат принят                   |
| `Unknown`          | Неизвестно       | Unknown           | `bg-gray-100 text-gray-400`     | `HelpCircle`  | Статус не определён                |

**Mapping:** `trading.status_mobile` → `TradingStatusBadge` (used in `AuctionCard` + `AuctionDetailHeader`)

---

### 18.4 Bid Measurement Type (`BidMeasurementType`)

| Enum Value | Label (RU) | Label (EN) | Short Label | Usage                              |
| ---------- | ---------- | ---------- | ----------- | ---------------------------------- |
| `PerRoute` | За рейс    | Per Route  | "за рейс"   | Цена за весь маршрут, шаг в валюте |
| `PerKm`    | За км      | Per Km     | "за км"     | Цена за километр, шаг в валюте/км  |

**UI:** `AuctionPricing` shows badge `PerRoute`/`PerKm` next to price. `PlaceBidForm` hints: "Шаг ставки: 100 за рейс"
vs "Шаг ставки: 5 за км".

---

### 18.5 Bet Row Status (`BetItem` → Row Variants)

Условия приоритизируются сверху вниз. Поля берутся из OpenAPI-схемы `BetItem`.

| Condition                | Row Variant | Label          | Icon      | Style                             |
| ------------------------ | ----------- | -------------- | --------- | --------------------------------- |
| `is_win === true`        | `winner`    | **Победитель** | `Trophy`  | `bg-yellow-50`, bold font         |
| `is_rejected === true`   | `rejected`  | **Отклонена**  | `Ban`     | `bg-red-50`, strikethrough amount |
| `place === 1 && !is_win` | `leading`   | **Лидирует**   | `ArrowUp` | `bg-green-50`                     |
| default                  | `normal`    | —              | —         | default                           |

**Cancel Reason:** Если `is_rejected === true` → показывать `cancel_reason` в tooltip или раскрывающейся строке. Поле
`cancel_reason` — пустая строка если ставка не отклонена.

---

### 18.6 Currency Codes (`currency_code` — ISO 4217 Numeric)

| Code  | Currency | Symbol | Format Example   | Locale  |
| ----- | -------- | ------ | ---------------- | ------- |
| `643` | RUB      | ₽      | `1 234 567 ₽`    | `ru-RU` |
| `840` | USD      | $      | `$1,234,567.00`  | `en-US` |
| `978` | EUR      | €      | `1 234 567,00 €` | `de-DE` |
| `398` | KZT      | ₸      | `1 234 567 ₸`    | `kk-KZ` |
| `972` | BYN      | Br     | `1 234 567 Br`   | `be-BY` |

**Formatter:** `formatCurrency(amount, currencyCode)` → uses `Intl.NumberFormat` with `currency` from code map.

---

### 18.7 Cargo Body Type (`BodyType` — from `cargo.body_type`)

| Enum Value       | Label (RU)            | Icon          | Typical Use                |
| ---------------- | --------------------- | ------------- | -------------------------- |
| `Tent`           | Тент                  | `Truck`       | Общий груз                 |
| `Refrigerator`   | Рефрижератор          | `Snowflake`   | Температурный режим        |
| `Isotherm`       | Изотерм               | `Thermometer` | Поддерживаемая температура |
| `Board`          | Борт                  | `Package`     | Строительные материалы     |
| `Container`      | Контейнер             | `Container`   | Морские контейнеры         |
| `Tank`           | Цистерна              | `Droplet`     | Жидкости/Газы              |
| `CarTransporter` | Автоперевозчик        | `Car`         | Легковые авто              |
| `Lowloader`      | Низкорамная платформа | `Tractor`     | Габаритная техника         |

**Usage:** `AuctionCargo` component shows badge with icon + label.

---

### 18.8 Loading Type (`LoadingType` — from `cargo.loading_type`)

| Enum Value | Label (RU) | Icon         |
| ---------- | ---------- | ------------ |
| `Top`      | Верхняя    | `ArrowUp`    |
| `Side`     | Боковая    | `ArrowRight` |
| `Rear`     | Задняя     | `ArrowDown`  |
| `Any`      | Любая      | `HelpCircle` |

---

### 18.9 Mapping Implementation (`entities/auction/model/auction.constants.ts`)

```ts
// Type-safe enum → UI mappers
// Ключи строго соответствуют AuctionType enum из OpenAPI-схемы
export const AUCTION_TYPE_UI: Record<AuctionType, UiEnumConfig> = {
  Request: { label: 'Запрос цен', color: 'gray', icon: HelpCircle },
  Up: { label: 'Аукцион вверх', color: 'blue', icon: TrendingUp },
  Down: { label: 'Аукцион вниз', color: 'orange', icon: TrendingDown },
  FixPrice: { label: 'Фиксированная цена', color: 'green', icon: Tag },
  Unknown: { label: 'Неизвестно', color: 'gray', icon: HelpCircle },
};

// Ключи строго соответствуют AuctionStatus enum из OpenAPI-схемы
export const AUCTION_STATUS_UI: Record<AuctionStatus, UiEnumConfig> = {
  Planning: { label: 'Планирование', color: 'gray', icon: Clock },
  Auction: { label: 'Торги идут', color: 'green', icon: Activity },
  DeterminateWinner: { label: 'Определение победителя', color: 'blue', icon: Search },
  WaitDeal: { label: 'Ожидание сделки', color: 'purple', icon: Hourglass },
  InProgress: { label: 'В работе', color: 'indigo', icon: Truck },
  Finished: { label: 'Завершён', color: 'gray', icon: Flag },
  Stopped: { label: 'Остановлен', color: 'orange', icon: PauseCircle },
  Canceled: { label: 'Отменён', color: 'red', icon: XCircle },
  Unknown: { label: 'Неизвестно', color: 'gray', icon: HelpCircle },
};

// Ключи строго соответствуют TradingStatus enum из OpenAPI-схемы
export const TRADING_STATUS_UI: Record<TradingStatus, UiEnumConfig> = {
  NotParticipating: { label: 'Не участвую', color: 'gray', icon: MinusCircle },
  Leading: { label: 'Лидирую', color: 'green', icon: Award },
  Losing: { label: 'Перебит', color: 'red', icon: ArrowDown },
  OnPending: { label: 'На рассмотрении', color: 'yellow', icon: Hourglass },
  Confirmed: { label: 'Подтверждён', color: 'blue', icon: CheckCircle },
  ChoosingWinner: { label: 'Выбор победителя', color: 'purple', icon: Search },
  Winner: { label: 'Победитель', color: 'yellow', icon: Trophy },
  Accepted: { label: 'Принят', color: 'indigo', icon: ThumbsUp },
  Unknown: { label: 'Неизвестно', color: 'gray', icon: HelpCircle },
};

// Helper
export const getEnumUi = <T extends string>(map: Record<T, UiEnumConfig>, value: T) =>
  map[value] ?? { label: value, color: 'gray', icon: HelpCircle };
```

**Badge Component Pattern:**

```tsx
// shared/ui/badge/enum-badge.component.tsx
export const EnumBadge = ({ config }: { config: UiEnumConfig }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
      `bg-${config.color}-100 text-${config.color}-700 dark:bg-${config.color}-900 dark:text-${config.color}-300`
    )}
  >
    <config.icon className="w-3 h-3" />
    {config.label}
  </span>
);
```

---

## 19. Acceptance Checklist (Traceability)

| TZ Requirement                                                                                                                    | Component / Feature                                          | Status |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Список аукционов с фильтрами                                                                                                      | `pages/auctions-list`, `widgets/auction-filters`             | ✅     |
| Фильтры: cargo_num, status, statuses, auc_type, load_city, unload_city, load_date_from/to, is_available, is_bidder, price_from/to | `widgets/auction-filters/ui/filter-fields/*` (11 components) | ✅     |
| Карточка аукциона: 11 групп полей                                                                                                 | `widgets/auction-card/ui/*` (11 sub-components)              | ✅     |
| Детальная страница + DTO флаги                                                                                                    | `pages/auction-detail`, `features/detail-flags`              | ✅     |
| Страница ставок: 8 колонок, empty, hidden                                                                                         | `pages/auction-bets`, `widgets/auction-bets`                 | ✅     |
| Страница ставки `/auctions/:uuid/place-bet`                                                                                       | `pages/place-bet`, `widgets/place-bet-form`                  | ✅     |
| Валидация min/max/step + подсказки                                                                                                | `features/place-bet/model/place-bet-schemas.ts`              | ✅     |
| MSW mutable store + trading state updates                                                                                         | `mocks/store/`, `mocks/handlers/bets.ts`                     | ✅     |
| Prefetch по hover/focus                                                                                                           | `features/prefetch-auction/`                                 | ✅     |
| Docker compose up --build                                                                                                         | `docker-compose.yml`, `Dockerfile`                           | ✅     |
| TanStack Router + URL sync                                                                                                        | `app/router/`                                                | ✅     |
| FSD архитектура                                                                                                                   | `src/` structure                                             | ✅     |
| `*.component.tsx` naming                                                                                                          | All components                                               | ✅     |
| AI_USAGE.md                                                                                                                       | `AI_USAGE.md` (Phase 7)                                      | ✅     |
| README с отчётом                                                                                                                  | `README.md` (Phase 7)                                        | ✅     |

---

## 20. Risks & Mitigations

| Risk                                                               | Probability | Impact | Mitigation                                                      |
| ------------------------------------------------------------------ | ----------- | ------ | --------------------------------------------------------------- |
| Place Bet реализуют как модалку, а не страницу                     | High        | High   | **Explicit route + page in plan**, code review check            |
| Города: не сделают мок-словарь + автокомплит                       | Medium      | High   | **entities/city/ в структуре**, seed с 50+ городами             |
| Фильтры: пропустят cargo_num / is_available / is_bidder / auc_type | High        | High   | **11 filter-fields компонентов в folder-structure**             |
| Карточка: не все 11 полей                                          | Medium      | High   | **11 под-компонентов, чек-лист в architecture.md**              |
| Ставки: не все 8 колонок + winner/cancelled states                 | Medium      | High   | **bet-row с вариантами, bets-table-hidden**                     |
| DTO флаги игнорируются на деталке                                  | Low         | High   | **Флаги в ViewModel, условный рендеринг в компонентах**         |
| Валидация ставки без min/max/step                                  | Medium      | High   | **Фабрика схемы createPlaceBetSchema(trading)**                 |
| Prefetch не работает / префетчит всё подряд                        | Low         | Medium | **Debounce 300ms, cancel на leave, только detail+tradingPrice** |
| MSW store не обновляет trading status после ставки                 | Medium      | High   | **Явный код в handlers/bets.ts, тест интеграционный**           |
| AI_USAGE.md забыли написать                                        | Low         | Medium | **Пункт в Phase 7, Definition of Done**                         |

---

_End of Architecture Document_
