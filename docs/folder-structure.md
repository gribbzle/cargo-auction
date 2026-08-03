# Структура папок (FSD) — Полная версия с покрытием 100% ТЗ

> **Примечание:** Все компоненты именуются как `*.component.tsx` (требование ТЗ).
> Публичный API каждого слайса/сегмента экспортируется через `index.ts`.
> MSW и Docker находятся **за пределами `src/`**.

---

## Корневая структура

```text
project-root/
├── .github/                    # CI/CD workflows
├── .husky/                     # Git hooks (pre-commit, commit-msg)
├── docker/                     # Docker конфигурация (nginx, node)
├── mocks/                      # MSW handlers, store, seed data (ВНЕ src/)
│   ├── handlers/
│   ├── store/
│   └── seed/
├── public/                     # Статические ассеты
├── src/
│   ├── app/                    # App Layer (провайдеры, роутинг, стили)
│   ├── pages/                  # Pages Layer (страницы по маршрутам)
│   ├── widgets/                # Widgets Layer (композитные блоки)
│   ├── features/               # Features Layer (бизнес-действия пользователя)
│   ├── entities/               # Entities Layer (бизнес-сущности)
│   ├── shared/                 # Shared Layer (переиспользуемые примитивы)
│   └── main.tsx                # Entry point
├── tests/                      # Интеграционные/E2E тесты (ВНЕ src/)
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
└── AI_USAGE.md                 # ОБЯЗАТЕЛЬНО ПО ТЗ
```

---

## 1. App Layer (`src/app/`)

```text
src/app/
├── providers/
│   ├── query-provider.tsx          # TanStack Query Provider
│   ├── router-provider.tsx         # TanStack Router Provider
│   ├── store-provider.tsx          # Zustand Provider (UI state)
│   └── index.ts
├── router/
│   ├── routes/
│   │   ├── __root.tsx              # Root layout (header, footer, outlet)
│   │   ├── index.tsx               # "/" → redirect to /auctions
│   │   ├── auctions.tsx            # "/auctions" — список аукционов
│   │   ├── auctions.$auctionUuid.tsx          # "/auctions/:uuid" — детальная
│   │   ├── auctions.$auctionUuid.place-bet.tsx # "/auctions/:uuid/place-bet" — страница ставки (ОТДЕЛЬНАЯ СТРАНИЦА ПО ТЗ)
│   │   └── auctions.$auctionUuid.bets.tsx     # "/auctions/:uuid/bets" — история ставок
│   ├── route-tree.gen.ts           # Автогенерируется TanStack Router
│   └── index.ts
├── styles/
│   ├── globals.css                 # Глобальные стили, CSS переменные
│   ├── variables.css               # Дизайн-токены (colors, spacing, radii)
│   └── reset.css
├── app.tsx                         # Корневой компонент приложения
└── index.ts
```

---

## 2. Pages Layer (`src/pages/`)

Каждая страница — тонкий композитор виджетов + загрузка данных через TanStack Query.

```text
src/pages/
├── auctions-list/
│   ├── ui/
│   │   ├── auctions-list-page.component.tsx
│   │   └── index.ts
│   ├── model/
│   │   ├── use-auctions-list-query.ts    # Хук загрузки списка с префетчингом
│   │   └── index.ts
│   └── index.ts
├── auction-detail/
│   ├── ui/
│   │   ├── auction-detail-page.component.tsx
│   │   └── index.ts
│   ├── model/
│   │   ├── use-auction-detail-query.ts
│   │   ├── use-auction-prefetch.ts       # Prefetch по intent/hover
│   │   └── index.ts
│   └── index.ts
├── place-bet/                        # НОВАЯ СТРАНИЦА ПО ТЗ
│   ├── ui/
│   │   ├── place-bet-page.component.tsx
│   │   └── index.ts
│   ├── model/
│   │   ├── use-place-bet-mutation.ts
│   │   ├── use-place-bet-form.ts       # RHF + Zod с динамическими min/max/step
│   │   └── index.ts
│   └── index.ts
├── auction-bets/
│   ├── ui/
│   │   ├── auction-bets-page.component.tsx
│   │   └── index.ts
│   ├── model/
│   │   ├── use-auction-bets-query.ts
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

---

## 3. Widgets Layer (`src/widgets/`)

Самостоятельные композитные блоки, которые можно переиспользовать на разных страницах.

### 3.1 Auction Filters (`widgets/auction-filters/`)

```text
src/widgets/auction-filters/
├── ui/
│   ├── auction-filters.component.tsx        # Основной контейнер фильтров
│   ├── filter-fields/                       # ПОЛЯ ФИЛЬТРОВ (ОБЯЗАТЕЛЬНЫЕ ПО ТЗ + ДОПОЛНИТЕЛЬНЫЕ)
│   │   ├── status-filter.component.tsx      # status / statuses (multi-select)
│   │   ├── cargo-num-filter.component.tsx   # cargo_num (text input) — НОВОЕ
│   │   ├── cargo-type-filter.component.tsx  # cargo_type (select)
│   │   ├── route-filter.component.tsx       # load_city + unload_city (CitySelector) — НОВОЕ
│   │   ├── price-range-filter.component.tsx # price_from / price_to
│   │   ├── date-range-filter.component.tsx  # load_date_from / load_date_to
│   │   ├── availability-filter.component.tsx # is_available (boolean select) — НОВОЕ
│   │   ├── bidder-filter.component.tsx      # is_bidder (boolean select) — НОВОЕ
│   │   ├── auction-type-filter.component.tsx # auc_type (multi-select) — НОВОЕ
│   │   ├── per-page-select.component.tsx    # per_page (select 10/20/50)
│   │   ├── reset-filters-button.component.tsx
│   │   └── index.ts
│   ├── filter-drawer.component.tsx          # Мобильная версия (drawer/sheet)
│   └── index.ts
├── model/
│   ├── use-auction-filters.ts               # Синхронизация с URL (search params)
│   ├── filters-schema.ts                    # Zod схема search params
│   ├── filters-to-request.ts                # Маппинг URL params → AuctionListRequest
│   └── index.ts
├── lib/
│   └── filter-helpers.ts
└── index.ts
```

### 3.2 Auction Card (`widgets/auction-card/`)

**Полный набор 11 групп полей из ТЗ:**

```text
src/widgets/auction-card/
├── ui/
│   ├── auction-card.component.tsx           # Контейнер карточки
│   ├── auction-card-header.component.tsx    # 1. Номер заявки + 2. Тип аукциона (Badge)
│   ├── auction-status-badge.component.tsx   # 3. Статус аукциона (enum → label/color)
│   ├── trading-status-badge.component.tsx   # 4. Торговый статус пользователя (enum → label/color)
│   ├── auction-route.component.tsx          # 5. Маршрут: load_city → unload_city (+ скрытие по hide_points_address_and_contacts)
│   ├── auction-dates.component.tsx          # 6. Даты погрузки/разгрузки
│   ├── auction-cargo.component.tsx          # 7. Груз: название, вес, объём, тип кузова
│   ├── auction-pricing.component.tsx        # 8. Текущая цена, цена за км, шаг ставки, валюта
│   ├── my-bet-indicator.component.tsx       # 9. Флаг «моя ставка есть/нет» + ваша ставка
│   ├── auction-actions.component.tsx        # 10. Primary action: Сделать/Изменить/Смотреть/Disabled
│   ├── auction-type-badge.component.tsx     # Badge для типа аукциона (Request/Up/Down/FixPrice)
│   ├── auction-card-skeleton.component.tsx  # Skeleton loader
│   └── index.ts
├── model/
│   ├── auction-card-vm.ts                   # ViewModel интерфейс карточки
│   ├── map-auction-to-card-vm.ts            # Маппер AuctionListItem → CardVM
│   ├── auction-type-labels.ts               # Enum → label/color mapping
│   ├── trading-status-labels.ts             # Enum → label/color mapping
│   ├── auction-status-labels.ts             # Enum → label/color mapping
│   └── index.ts
├── lib/
│   ├── format-price.ts
│   ├── format-date.ts
│   └── index.ts
└── index.ts
```

### 3.3 Auction Bets (`widgets/auction-bets/`)

```text
src/widgets/auction-bets/
├── ui/
│   ├── auction-bets.component.tsx           # Контейнер виджета ставок
│   ├── bets-table/
│   │   ├── bets-table.component.tsx         # Таблица/список ставок
│   │   ├── bet-row.component.tsx            # СТРОКА СТАВКИ — ВСЕ 8 ПОЛЕЙ ИЗ ТЗ:
│   │   │   # - place: место в рейтинге ставок
│   │   │   # - organization_name: перевозчик
│   │   │   # - price_with_vat: цена с НДС
│   │   │   # - price_no_vat: цена без НДС
│   │   │   # - is_win: признак победителя (badge/icon)
│   │   │   # - is_rejected: признак отклонённой ставки (badge/icon)
│   │   │   # - cancel_reason: причина отклонения (если есть)
│   │   │   # - created_at: время ставки
│   │   ├── bets-table-header.component.tsx
│   │   ├── bets-table-empty.component.tsx   # Empty state: «Ставок пока нет»
│   │   ├── bets-table-hidden.component.tsx  # State: hide_bets_history = true
│   │   └── index.ts
│   ├── bets-summary.component.tsx           # Сводка: количество участников, лидирующая ставка
│   └── index.ts
├── model/
│   ├── bet-row-vm.ts                        # ViewModel строки ставки
│   ├── map-bet-to-row-vm.ts                 # Маппер AuctionShowBid → BetRowVM
│   └── index.ts
└── index.ts
```

### 3.4 Place Bet Form (`widgets/place-bet-form/`)

```text
src/widgets/place-bet-form/
├── ui/
│   ├── place-bet-form.component.tsx         # Основная форма (RHF + Zod)
│   ├── bid-input.component.tsx              # Поле ввода ставки с валидацией min/max/step
│   ├── bid-hints.component.tsx              # ПОДСКАЗКИ: доступная цена, шаг ставки, min/max
│   ├── bid-measurement-info.component.tsx   # Информация: «ставка за рейс» / «за км»
│   ├── submit-button.component.tsx          # Кнопка с состоянием loading/disabled
│   ├── validation-errors.component.tsx      # Отображение ошибок 422 + клиентских
│   └── index.ts
├── model/
│   ├── place-bet-schemas.ts                 # Фабрика схемы: createPlaceBetSchema(tradingPrice)
│   │   # validate: min ≤ value ≤ max, value % step === 0
│   │   # transform: string → number (цены в копейках на беке)
│   ├── place-bet-form-vm.ts                 # ViewModel формы
│   ├── map-trading-to-form-vm.ts            # Маппер AuctionShowTradingPrice → FormVM
│   └── index.ts
├── lib/
│   ├── parse-price.ts                       # Парсинг ввода пользователя → число
│   ├── format-price-input.ts                # Форматирование для input (пробелы, валюта)
│   └── index.ts
└── index.ts
```

### 3.5 Auction Pagination (`widgets/auction-pagination/`)

```text
src/widgets/auction-pagination/
├── ui/
│   ├── auction-pagination.component.tsx
│   ├── page-size-select.component.tsx
│   └── index.ts
├── model/
│   ├── use-pagination.ts
│   └── index.ts
└── index.ts
```

---

## 4. Features Layer (`src/features/`)

Бизнес-действия пользователя, мутации, сложные хуки.

```text
src/features/
├── place-bet/                          # Действие «Сделать/Изменить ставку»
│   ├── api/
│   │   ├── place-bet.mutation.ts        # TanStack Mutation: POST /auctions/:uuid/bets
│   │   ├── update-bet.mutation.ts       # PATCH /auctions/:uuid/bets/:betUuid
│   │   └── index.ts
│   ├── model/
│   │   ├── place-bet-schema.ts          # Zod схема (дублирует widgets для изоляции)
│   │   └── index.ts
│   ├── ui/
│   │   └── index.ts
│   └── index.ts
├── prefetch-auction/                   # Prefetch детальной страницы
│   ├── model/
│   │   ├── use-prefetch-auction.ts      # Хук: onMouseEnter / onFocus карточки
│   │   ├── prefetch-intent.ts           # Логика intent detection (hover 300ms, focus)
│   │   └── index.ts
│   └── index.ts
├── auction-filters-url/                # Синхронизация фильтров с URL
│   ├── model/
│   │   ├── use-filters-url-sync.ts
│   │   ├── search-params-parser.ts      # Парсинг/валидация search params (Zod); безопасные fallback-значения
│   │   ├── request-builder.ts           # Построение AuctionListRequest из URL params
│   │   └── index.ts
│   └── index.ts
├── bets-polling/                       # Опционально: поллинг ставок в реальном времени
│   ├── model/
│   │   ├── use-bets-polling.ts
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

---

## 5. Entities Layer (`src/entities/`)

Бизнес-сущности с их типами, мапперами, API.

### 5.1 Auction (`entities/auction/`)

```text
src/entities/auction/
├── api/
│   ├── auction-list.api.ts              # GET /auctions (list)
│   ├── auction-detail.api.ts            # GET /auctions/:uuid (detail)
│   ├── auction-bets.api.ts              # GET /auctions/:uuid/bets
│   ├── place-bet.api.ts                 # POST /auctions/:uuid/bets
│   ├── update-bet.api.ts                # PATCH /auctions/:uuid/bets/:betUuid
│   ├── mappers/
│   │   ├── auction-list.mapper.ts       # DTO → ViewModel (list)
│   │   ├── auction-detail.mapper.ts     # DTO → ViewModel (detail)
│   │   ├── bets.mapper.ts               # DTO → ViewModel (bets)
│   │   └── index.ts
│   ├── dto/
│   │   ├── auction-list.dto.ts          # Типы ответа списка (AuctionListResponse, AuctionListItem, AuctionListMeta)
│   │   ├── auction-detail.dto.ts        # Типы детальной (AuctionShow, AuctionShowTrading, AuctionShowTradingPrice, AuctionShowPayment, etc.)
│   │   ├── bets.dto.ts                  # AuctionShowBid, AuctionShowBidder, etc.
│   │   ├── request.dto.ts               # AuctionListRequest, PlaceBetRequest, UpdateBetRequest
│   │   └── index.ts
│   └── index.ts
├── model/
│   ├── types.ts                         # Внутренние типы сущности (ViewModels)
│   ├── constants.ts                     # Энамы + маппинги на UI (labels, colors, icons)
│   │   # AuctionType: REQUEST, UP, DOWN, FIX_PRICE
│   │   # AuctionStatus: DRAFT, PUBLISHED, ACTIVE, FINISHED, CANCELLED
│   │   # TradingStatusMobile: LEADING, LOSING, WINNER, NO_BET, etc.
│   │   # BidMeasurementType: PER_ROUTE, PER_KM
│   │   # CurrencyCode: 643(RUB), 840(USD), 978(EUR)
│   └── index.ts
├── ui/                                  # Примитивные UI компоненты сущности (badges, formatters)
│   ├── auction-type-badge.component.tsx
│   ├── auction-status-badge.component.tsx
│   ├── trading-status-badge.component.tsx
│   ├── currency-formatter.component.tsx
│   ├── price-per-km-formatter.component.tsx
│   └── index.ts
└── index.ts
```

### 5.2 City (`entities/city/`) — **НОВАЯ СУЩНОСТЬ ПО ТЗ (мок-словарь городов)**

```text
src/entities/city/
├── api/
│   ├── cities.api.ts                    # В MSW: GET /mock/cities (или локальный импорт)
│   └── index.ts
├── model/
│   ├── types.ts                         # City { id: number; gc_id: number; name: string; region?: string }
│   ├── cities.mock.ts                   # МОК-МАССИВ: 50-100 городов (гк_ид, название)
│   ├── cities-index.ts                  # Индексы для быстрого поиска: byId, byGcId, byName
│   └── index.ts
├── ui/
│   ├── city-selector.component.tsx      # Combobox/Autocomplete: поиск по имени, выбор
│   ├── city-selector-field.component.tsx # Поле формы с label + selector
│   └── index.ts
└── index.ts
```

### 5.3 Bid (`entities/bid/`)

```text
src/entities/bid/
├── api/
│   └── index.ts
├── model/
│   ├── types.ts                         # BetViewModel, BetRowVM
│   └── index.ts
├── ui/
│   └── index.ts
└── index.ts
```

### 5.4 User (`entities/user/`)

```text
src/entities/user/
├── api/
│   └── index.ts
├── model/
│   ├── types.ts                         # CurrentUser, BidderInfo
│   └── index.ts
└── index.ts
```

---

## 6. Shared Layer (`src/shared/`)

Переиспользуемые примитивы, не зависящие от бизнес-логики.

```text
src/shared/
├── api/
│   ├── http-client.ts                   # Axios/Fetch wrapper с interceptors
│   ├── error-handler.ts                 # Нормализация ошибок: ProblemDetail, ValidationError
│   ├── problem-detail.ts                # Типы ProblemDetail (RFC 7807)
│   └── index.ts
├── ui/
│   ├── kit/                             # Базовые UI примитивы
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   ├── combobox/                    # Для CitySelector
│   │   ├── badge/
│   │   ├── table/
│   │   ├── drawer/                      # Мобильные фильтры
│   │   ├── skeleton/
│   │   ├── tooltip/
│   │   └── index.ts
│   ├── layout/
│   │   ├── header.component.tsx
│   │   ├── footer.component.tsx
│   │   ├── container.component.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── form-field.component.tsx     # Обёртка RHF: label, error, hint
│   │   ├── validation-messages.ts       # Стандартные сообщения ошибок
│   │   └── index.ts
│   └── index.ts
├── lib/
│   ├── validators.ts                    # Общие Zod валидаторы (uuid, price, date, etc.)
│   ├── formatters.ts                    # formatPrice, formatDate, formatNumber
│   ├── helpers.ts                       # classNames, debounce, omit, pick
│   ├── query-keys.ts                    # Фабрики query keys (auctions, detail, bets)
│   ├── url-helpers.ts                   # Парсинг/сериализация search params
│   └── index.ts
├── config/
│   ├── env.ts                           # Валидация env переменных (Zod)
│   ├── endpoints.ts                     # API endpoints константы
│   └── index.ts
├── types/
│   ├── common.ts                        # Общие типы: PaginatedResponse, ApiError, etc.
│   └── index.ts
└── index.ts
```

---

## 7. MSW Mocks (`mocks/`) — **ВНЕ `src/`**

```text
mocks/
├── handlers/
│   ├── auctions.list.ts                 # GET /auctions с фильтрацией, пагинацией, сортировкой
│   ├── auctions.detail.ts               # GET /auctions/:uuid
│   ├── auctions.bets.ts                 # GET /auctions/:uuid/bets
│   ├── auctions.place-bet.ts            # POST /auctions/:uuid/bets
│   ├── auctions.update-bet.ts           # PATCH /auctions/:uuid/bets/:betUuid
│   ├── cities.ts                        # GET /mock/cities (мок-словарь)
│   └── index.ts                         # Экспорт всех handlers
├── store/
│   ├── auctions.store.ts                # Мьютабельный стор аукционов
│   │   # auctions: Map<uuid, AuctionShow> — ПОЛНАЯ СТРУКТУРА DTO
│   │   # Методы: getList(params), getById(uuid), updateTradingState(uuid, patch), createBet(uuid, bet), updateBet(uuid, betUuid, patch)
│   ├── bets.store.ts                    # Мьютабельный стор ставок
│   │   # bets: Map<auctionUuid, AuctionShowBid[]> — обновляется при create/update
│   ├── cities.store.ts                  # Статический мок-массив городов (50-100 записей)
│   │   # cities: City[] — gc_id, name, region
│   └── index.ts
├── seed/
│   ├── auctions.seed.ts                 # Генерация 20-30 реалистичных аукционов
│   │   # С всеми trading полями: status_mobile, your, price, available, min, max, step
│   │   # С bids массивом: winner, cancelled, reason_cancelled, price_vat/no_vat
│   │   # С DTO флагами: can_set_bet, hide_bets_history, hide_points_address_and_contacts, no_view_cargo_price
│   ├── cities.seed.ts                   # Массив городов (Москва, СПб, Казани, Екатеринбург, Новосибирск, ...)
│   └── index.ts
├── utils/
│   ├── delay.ts                         # Имитация задержки сети (100-500ms)
│   ├── pagination.ts                    # Пагинация в памяти
│   ├── filtering.ts                     # Фильтрация в памяти по всем полям AuctionListRequest
│   └── index.ts
├── server.ts                            # setupServer(handlers)
├── browser.ts                           # worker.start() для браузера
└── index.ts
```

---

## 8. Docker (`docker/`, корень)

```text
docker/
├── nginx/
│   ├── nginx.conf
│   └── default.conf
├── node/
│   └── Dockerfile.node                 # Базовый образ для dev/prod
docker-compose.yml                      # services: app (node), nginx
Dockerfile                              # Multi-stage: builder → runner
```

---

## 9. Tests (`tests/`) — **ВНЕ `src/`**

```text
tests/
├── unit/
│   ├── lib/
│   │   ├── formatters.test.ts
│   │   ├── validators.test.ts
│   │   ├── url-helpers.test.ts
│   │   └── query-keys.test.ts
│   ├── mappers/
│   │   ├── auction-list.mapper.test.ts
│   │   ├── auction-detail.mapper.test.ts
│   │   └── bets.mapper.test.ts
│   ├── request-builders/
│   │   └── filters-to-request.test.ts
│   ├── schemas/
│   │   ├── filters-schema.test.ts
│   │   ├── place-bet-schema.test.ts     # Динамические min/max/step
│   │   └── search-params-schema.test.ts
│   └── search-params-parsing.test.ts
├── integration/
│   ├── auctions-list-flow.test.tsx      # Фильтры → URL → Request → Response → Cards
│   ├── place-bet-flow.test.tsx          # Form → Validation → Mutation → Optimistic Update
│   ├── prefetch-flow.test.tsx           # Hover → Prefetch → Cache Hit
│   └── bets-history-flow.test.tsx       # Bets page → hidden state → empty state
├── e2e/
│   └── critical-paths.test.ts           # Playwright: полные пользовательские сценарии
├── setup.ts                             # Vitest setup (MSW, cleanup, matchers)
└── README.md
```

---

## 10. Конфигурация и документация (корень)

```text
├── .env.example                          # Пример env переменных
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
├── README.md                             # ОБЯЗАТЕЛЬНО: что проверял, сценарии, ограничения
├── AI_USAGE.md                           # ОБЯЗАТЕЛЬНО ПО ТЗ
├── ARCHITECTURE_DECISIONS.md             # ADR записи (опционально)
└── CHANGELOG.md
```

---

## Правила именования (ENFORCED)

| Тип | Паттерн | Пример |
|-----|---------|--------|
| Компоненты | `*.component.tsx` | `auction-card.component.tsx` |
| Хуки | `use-*.ts` | `use-auctions-list-query.ts` |
| Утилиты | `*.ts` | `format-price.ts` |
| Типы/Интерфейсы | `*.ts` | `auction-card-vm.ts` |
| Константы/Энамы | `*.constants.ts` | `auction-type-labels.ts` |
| Схемы Zod | `*.schema.ts` | `filters-schema.ts` |
| Мапперы | `*.mapper.ts` | `auction-list.mapper.ts` |
| API функции | `*.api.ts` | `auction-list.api.ts` |
| Тесты | `*.test.ts` / `*.test.tsx` | `formatters.test.ts` |
| Страницы | `*.page.tsx` (в pages/) | `auctions-list-page.component.tsx` |
| Виджеты | `*.component.tsx` (в widgets/) | `auction-filters.component.tsx` |

---

## Импорты — Public API Only

```typescript
// ✅ ПРАВИЛЬНО — через public API (index.ts)
import { AuctionCard } from '@/widgets/auction-card';
import { useAuctionsListQuery } from '@/pages/auctions-list';
import { formatPrice } from '@/shared/lib';

// ❌ ЗАПРЕЩЕНО — глубокие импорты
import { AuctionCard } from '@/widgets/auction-card/ui/auction-card.component';
import { mapAuctionToCardVM } from '@/widgets/auction-card/model/map-auction-to-card-vm';
```

---

## Слои — Правила зависимостей (FSD)

```
app
  ↓
pages
  ↓
widgets ←──→ features
  ↓           ↓
entities ←────┘
  ↓
shared
```

- **Стрелка вниз** = может импортировать
- **Стрелка вверх** = ЗАПРЕЩЕНО
- **Горизонтальные** (widgets ↔ features) = ТОЛЬКО через shared/entities, НЕ напрямую

---

## Чек-лист покрытия ТЗ (по компонентам)

| Требование ТЗ | Компонент / Файл | Статус |
|---------------|------------------|--------|
| Список аукционов с пагинацией | `pages/auctions-list`, `widgets/auction-pagination` | ✅ |
| Фильтры: cargo_num, status, statuses, auc_type, load_city, unload_city, load_date_from/to, is_available, is_bidder, price_from/to | `widgets/auction-filters/ui/filter-fields/` (11 компонентов) | ✅ |
| load_city / unload_city из мок-словаря | `entities/city/`, `city-selector-filter.component.tsx` | ✅ |
| Карточка: 11 групп полей | `widgets/auction-card/ui/` (11 под-компонентов) | ✅ |
| Детальная страница: DTO флаги (can_set_bet, hide_bets_history, hide_points_address_and_contacts, no_view_cargo_price) | `pages/auction-detail`, мапперы в `entities/auction/api/mappers/` | ✅ |
| Страница ставок: 8 колонок (place, organization_name, price_with_vat, price_no_vat, is_win, is_rejected, cancel_reason, created_at) + empty + hidden | `widgets/auction-bets/ui/bets-table/` | ✅ |
| Страница ставки (отдельная!): `/auctions/:uuid/place-bet` | `pages/place-bet/`, `widgets/place-bet-form/` | ✅ |
| Форма ставки: min/max/step валидация + подсказки | `widgets/place-bet-form/ui/bid-input`, `bid-hints`, `place-bet-schemas.ts` | ✅ |
| Prefetch по intent/hover | `features/prefetch-auction/` | ✅ |
| MSW: mutable store, обновление trading state + bets | `mocks/store/auctions.store.ts`, `bets.store.ts` | ✅ |
| Docker: `docker compose up --build`, hot reload | `docker-compose.yml`, `Dockerfile` | ✅ |
| Именование компонентов: `*.component.tsx` | Во всей структуре | ✅ |
| AI_USAGE.md | Корень проекта | ✅ |
| README с отчётом | Корень проекта | ✅ |
| Тесты: чистая логика + интеграционные | `tests/unit/`, `tests/integration/` | ✅ |

---

## Диаграмма маршрутов (TanStack Router)

```
/                                    → redirect → /auctions
/auctions                            → AuctionsListPage + AuctionFilters + AuctionCard[] + Pagination
/auctions/:auctionUuid               → AuctionDetailPage (условные секции по DTO флагам)
/auctions/:auctionUuid/place-bet     → PlaceBetPage (ОТДЕЛЬНАЯ СТРАНИЦА!)
/auctions/:auctionUuid/bets          → AuctionBetsPage (таблица + сводка + empty/hidden states)
```

---

*Версия: 2.0 — Полное покрытие Тестового Задания*  
*Дата обновления: после анализа соответствия ТЗ*