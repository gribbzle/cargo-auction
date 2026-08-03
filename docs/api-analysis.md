# API Analysis

## 1. Purpose

This document analyzes the provided `openapi.auctions.v0.json` contract and defines how the frontend should consume it. The OpenAPI document is the source of truth for API types, request/response shapes, enums, nullability, validation, and error handling.

## 2. API Overview

- OpenAPI version: `3.0.0`
- API title: `API для UL - Auctions`
- API version: `1.0.0`
- Base URL: `/api/v1/`

## 3. Endpoints

### `POST /auctions/list`

- Operation ID: `listAuctions`
- Summary: Список аукционов
- Description: Получение списка аукционов с заданными фильтрами

**Request body**
- `application/json` → `#/components/schemas/AuctionListRequest`

**Responses**

| Status | Description | Schema |
|---:|---|---|
| `200` | Успешный ответ | `#/components/schemas/AuctionListResponseBase` |
| `401` |  | `—` |
| `422` |  | `—` |
| `503` |  | `—` |

### `GET /auctions/{auctionUuid}`

- Operation ID: `getAuction`
- Summary: Данные аукциона
- Description: Получение подробных данных аукциона

| Name | In | Required | Type |
|---|---|---:|---|
| `auctionUuid` | `path` | yes | `string` |

**Responses**

| Status | Description | Schema |
|---:|---|---|
| `200` | Успешный ответ | `#/components/schemas/AuctionShowResponse` |
| `401` |  | `—` |
| `404` |  | `—` |
| `503` |  | `—` |

### `GET /auctions/{auctionUuid}/bets`

- Operation ID: `listBets`
- Summary: Список ставок аукциона
- Description: Запрос вернет список ставок, которые были сделаны в этом аукционе

| Name | In | Required | Type |
|---|---|---:|---|
| `auctionUuid` | `path` | yes | `string` |
| `all` | `query` | no | `boolean` |

**Responses**

| Status | Description | Schema |
|---:|---|---|
| `200` | Успешный ответ | `#/components/schemas/BetListResponse` |
| `401` |  | `—` |
| `404` |  | `—` |
| `503` |  | `—` |

### `POST /auctions/{auctionUuid}/bets`

- Operation ID: `setBet`
- Summary: Установить ставку
- Description: Установить ставку в аукционе

| Name | In | Required | Type |
|---|---|---:|---|
| `auctionUuid` | `path` | yes | `string` |

**Request body**
- `application/json` → `#/components/schemas/SetBetRequest`

**Responses**

| Status | Description | Schema |
|---:|---|---|
| `200` | Ставка принята — ответ проксируется от upstream | `—` |
| `401` |  | `—` |
| `404` |  | `—` |
| `422` |  | `—` |
| `503` |  | `—` |

## 4. Schemas

### `AdmittedOrganization`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `id` | no | `integer` | no |  |
| `inn` | no | `string` | no |  |
| `is_main` | no | `boolean` | no |  |
| `name` | no | `string` | no |  |
| `full_name` | no | `string` | no |  |
| `site` | no | `string` | yes |  |
| `subscriber_id` | no | `integer` | no |  |
| `subscriber_code` | no | `string` | no |  |
| `subscriber_role` | no | `string` | yes |  |
| `infobase_code` | no | `string` | no |  |
| `infobase_address` | no | `string` | yes |  |
| `nalog_key` | no | `string` | yes |  |
| `hide_me` | no | `boolean` | no |  |
| `current_vat_rate` | no | `string` | yes |  |

### `Assembly`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `num` | no | `string` | yes |  |
| `date` | no | `string` | yes |  |

### `AuctionListItem`

Главный Data-объект списка аукционов.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `main` | no | `#/components/schemas/AuctionListItemMain` | no |  |
| `organizer` | no | `#/components/schemas/AuctionListItemOrganizer` | no |  |
| `route` | no | `#/components/schemas/AuctionListItemRoute` | no |  |
| `cargo` | no | `#/components/schemas/AuctionListItemCargo` | no |  |
| `trading` | no | `#/components/schemas/AuctionListItemTrading` | no |  |
| `payment` | no | `#/components/schemas/AuctionListItemPayment` | no |  |

### `AuctionListItemCargo`

Данные о грузе.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `name` | no | `string` | no |  |
| `weight` | no | `number` | no |  |
| `volume` | no | `number` | no |  |
| `body_type` | no | `string` | no |  |
| `truck_count` | no | `integer` | no |  |
| `is_cargo` | no | `boolean` | no |  |
| `is_international` | no | `boolean` | no |  |
| `containered` | no | `boolean` | no |  |
| `incoterms` | no | `string` | no |  |
| `conics` | no | `integer` | no |  |
| `belts` | no | `integer` | no |  |
| `adr` | no | `integer` | no |  |
| `coupling` | no | `boolean` | no |  |
| `air_pass` | no | `boolean` | no |  |
| `low_loader` | no | `boolean` | no |  |
| `additional_load` | no | `boolean` | no |  |
| `temp_from` | no | `integer` | no |  |
| `temp_to` | no | `integer` | no |  |
| `loading_types` | no | `#/components/schemas/AuctionListItemCargoLoadingType` | no |  |
| `docs` | no | `#/components/schemas/AuctionListItemCargoDocs` | no |  |
| `car` | no | `unknown` | yes |  |

### `AuctionListItemCargoCar`

Требования к ТС; null если не заданы

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `type` | no | `string` | no |  |
| `weight` | no | `number` | no |  |
| `volume` | no | `number` | no |  |
| `width` | no | `number` | no |  |
| `length` | no | `number` | no |  |
| `height` | no | `number` | no |  |

### `AuctionListItemCargoDocs`

Данные о грузе.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `tir` | no | `boolean` | no |  |
| `cmr` | no | `boolean` | no |  |
| `t1` | no | `boolean` | no |  |
| `med` | no | `boolean` | no |  |

### `AuctionListItemCargoLoadingType`

Данные о грузе.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `side` | no | `boolean` | no |  |
| `top` | no | `boolean` | no |  |
| `rear` | no | `boolean` | no |  |
| `full` | no | `boolean` | no |  |

### `AuctionListItemMain`

Основные данные аукциона.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `id` | no | `integer` | no |  |
| `cargo_num` | no | `string` | no |  |
| `cargo_date` | no | `string` | no |  |
| `auc_type` | no | `string` | no | Тип аукциона:  * **Request** — заявочный (1) * **Up** — на повышение (2) * **Down** — на понижение (3) * **FixPrice** — фиксированная цена (4) * **Unknown** — неизвестный тип  |
| `order_uid` | no | `string` | no |  |
| `created_at` | no | `string` | no |  |
| `priority_sort` | no | `integer` | no |  |
| `is_assembly` | no | `boolean` | no |  |
| `price_per_km` | no | `number` | yes |  |

### `AuctionListItemOrganizer`

Данные организатора.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `subscriber_id` | no | `integer` | no |  |
| `organization_id` | no | `integer` | no |  |
| `organization_name` | no | `string` | no |  |
| `organization_inn` | no | `string` | no |  |
| `organization_kpp` | no | `string` | no |  |
| `is_hide_organization` | no | `boolean` | no |  |

### `AuctionListItemPayment`

Информация об оплате.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `form` | no | `string` | no |  |
| `currency_code` | no | `string` | no | Код валюты (ISO 4217 numeric) |
| `consignor` | no | `string` | no |  |
| `consignee` | no | `string` | no |  |

### `AuctionListItemRoute`

Объединенный маршрут.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `load` | no | `#/components/schemas/AuctionListItemRoutePoint` | no |  |
| `unload` | no | `#/components/schemas/AuctionListItemRoutePoint` | no |  |

### `AuctionListItemRoutePoint`

Точка маршрута (загрузка/разгрузка).

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `city` | no | `string` | no |  |
| `address` | no | `string` | no |  |
| `date` | no | `string` | no |  |
| `city_gc_id` | no | `integer` | no |  |
| `points_count` | no | `integer` | no |  |

### `AuctionListItemTrading`

Данные торгов.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `status` | no | `string` | no | Статус аукциона:  * **Planning** — планирование (1) * **Auction** — торги идут (2) * **DeterminateWinner** — определение победителя (3) * **WaitDeal** — ожидание сделки (4) * **InProgress** — в работе (5) * **Finished** — завершён (6) * **Stopped** — остановлен (7) * **Canceled** — отменён (8) * **Unknown** — неизвестный статус  |
| `status_mobile` | no | `string` | no | Торговый статус пользователя в аукционе:  * **NotParticipating** — не участвует (1) * **Leading** — лидирует (2) * **Losing** — перебит (3) * **Winner** — победитель (4) * **Confirmed** — подтверждён (5) * **Unknown** — неизвестный статус  |
| `start_time` | no | `string` | no |  |
| `stop_time` | no | `string` | no |  |
| `bid_measurement_type` | no | `string` | yes | Единица измерения ставки:  * **PerRoute** — за рейс (0) * **PerKm** — за км (1) * **Unknown** — неизвестный тип  |
| `can_set_bet` | no | `boolean` | no |  |
| `allow_counter_bets` | no | `boolean` | no |  |
| `hide_points_address_and_contacts` | no | `boolean` | no |  |
| `direction` | no | `string` | no |  |
| `comment` | no | `string` | no |  |
| `is_bidder` | no | `boolean` | no |  |
| `is_available` | no | `boolean` | no |  |
| `is_accredited` | no | `boolean` | no |  |
| `is_favorite` | no | `boolean` | no |  |
| `price` | no | `unknown` | yes |  |
| `your` | no | `unknown` | yes |  |
| `red_bet_with_vat` | no | `boolean` | no |  |
| `red_bet_no_vat` | no | `boolean` | no |  |
| `is_last_bet_with_vat` | no | `boolean` | no |  |

### `AuctionListItemTradingPrice`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `start` | no | `number` | no |  |
| `current` | no | `number` | no |  |
| `current_no_vat` | no | `number` | no |  |

### `AuctionListItemTradingYour`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `bet` | no | `boolean` | no | Есть ли ставка от текущего пользователя |
| `last_bet` | no | `number` | yes | Последняя ставка пользователя |

### `AuctionListMeta`

Мета-данные пагинации внешнего сервиса.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `current_page` | no | `integer` | no |  |
| `from` | no | `integer` | no |  |
| `last_page` | no | `integer` | no |  |
| `per_page` | no | `integer` | no |  |
| `to` | no | `integer` | no |  |
| `total` | no | `integer` | no |  |

### `AuctionListRequest`

Фильтры и параметры пагинации списка аукционов

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `page` | no | `integer` | no | Запрашиваемая страница |
| `per_page` | no | `integer` | no | Количество элементов на странице |
| `is_oldest` | no | `boolean` | no | Порядок сортировки по дате: true = ASC, false / null = DESC |
| `sort` | no | `object` | yes | Сортировка по полям; ключ — имя поля, значение — направление |
| `status` | no | `array<string>` | no | Фильтр по торговому статусу пользователя (строковые значения)  Торговый статус пользователя в аукционе: * **NotParticipating** — не участвует (1) * **Leading** — лидирует (2) * **Losing** — перебит (3) * **Winner** — победитель (4) * **Confirmed** — подтверждён (5) * **Unknown** — неизвестный статус |
| `mobile_statuses` | no | `array<integer>` | no | Фильтр по торговому статусу пользователя (числовые значения) |
| `statuses` | no | `array<integer>` | no | Фильтр по статусу аукциона (числовые значения: 1–7) |
| `cargo_num` | no | `string` | no | Номер заявки |
| `weight_from` | no | `number` | no | Вес груза от (т) |
| `weight_to` | no | `number` | no | Вес груза до (т) |
| `volume_from` | no | `number` | no | Объём груза от (м³) |
| `volume_to` | no | `number` | no | Объём груза до (м³) |
| `body_types` | no | `array<string>` | no | Фильтр по типу кузова |
| `form_type` | no | `string` | yes | Тип формы |
| `is_international_shipment` | no | `boolean` | no | Только международные перевозки |
| `load_city` | no | `string` | no | Название города погрузки |
| `load_gc_id` | no | `integer` | no | GC ID города погрузки |
| `load_range` | no | `integer` | no | Радиус поиска от города погрузки (км) |
| `unload_city` | no | `string` | no | Название города выгрузки |
| `unload_gc_id` | no | `integer` | no | GC ID города выгрузки |
| `unload_range` | no | `integer` | no | Радиус поиска от города выгрузки (км) |
| `load_date_from` | no | `string` | no | Дата и время погрузки от (ISO 8601 со смещением) |
| `load_date_to` | no | `string` | no | Дата и время погрузки до (ISO 8601 со смещением) |
| `unload_date_from` | no | `string` | no | Дата выгрузки от (ISO 8601 со смещением) |
| `unload_date_to` | no | `string` | no | Дата выгрузки до (ISO 8601 со смещением) |
| `create_date_from` | no | `string` | no | Дата создания аукциона от (ISO 8601 со смещением) |
| `create_date_to` | no | `string` | no | Дата создания аукциона до (ISO 8601 со смещением) |
| `start_time_from` | no | `string` | no | Начало торгов от (ISO 8601 со смещением) |
| `start_time_to` | no | `string` | no | Начало торгов до (ISO 8601 со смещением) |
| `stop_time_from` | no | `string` | no | Окончание торгов от (ISO 8601 со смещением) |
| `stop_time_to` | no | `string` | no | Окончание торгов до (ISO 8601 со смещением) |
| `is_available` | no | `boolean` | no | Только доступные для ставки аукционы |
| `is_favorite` | no | `boolean` | no | Только избранные аукционы |
| `is_bidder` | no | `boolean` | no | Только аукционы, в которых пользователь участвовал |
| `customer` | no | `string` | no | Поиск по названию или ИНН заказчика |
| `customer_ids` | no | `array<integer>` | no | Фильтр по ID заказчиков |
| `contractor` | no | `string` | yes | Поиск по перевозчику |
| `auction_ids` | no | `array<integer>` | no | Фильтр по ID аукционов |
| `replace_external_pads` | no | `boolean` | yes | Заменять внешние площадки |
| `current_price_from` | no | `number` | yes | Цена от |
| `current_price_to` | no | `number` | yes | Цена до |
| `price_per_km_from` | no | `number` | yes | Цена за км от |
| `price_per_km_to` | no | `number` | yes | Цена за км до |
| `auc_type` | no | `array<string>` | no | Фильтр по типу аукциона  Тип аукциона: * **Request** — подтверждён (1) * **Up** — подтверждён (2) * **Down** — подтверждён (3) * **FixPrice** — подтверждён (4) * **Unknown** — неизвестный статус |

### `AuctionListResponseBase`

Корневой объект ответа списка аукционов с мета-данными.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `data` | no | `array<#/components/schemas/AuctionListItem>` | no | Коллекция аукционов |
| `meta` | no | `#/components/schemas/AuctionListMeta` | no |  |

### `AuctionShowCargo`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `price` | no | `string` | no | Цена груза |
| `currency` | no | `integer` | yes |  |
| `is_international` | no | `boolean` | no |  |
| `distance` | no | `integer` | yes | Расстояние в км |
| `truck_count` | no | `integer` | no |  |
| `body_type` | no | `string` | no |  |
| `temp_from` | no | `number` | yes |  |
| `temp_to` | no | `number` | yes |  |
| `conics` | no | `integer` | yes |  |
| `belts` | no | `integer` | yes |  |
| `adr` | no | `integer` | yes |  |
| `coupling` | no | `boolean` | yes |  |
| `air_pass` | no | `boolean` | yes |  |
| `low_loader` | no | `boolean` | yes |  |
| `additional_load` | no | `boolean` | yes |  |
| `containered` | no | `boolean` | no |  |
| `container_type` | no | `string` | yes |  |
| `container_size` | no | `string` | yes |  |
| `loading_types` | no | `#/components/schemas/LoadingTypes` | no |  |
| `docs` | no | `#/components/schemas/Docs` | no |  |
| `car` | no | `#/components/schemas/CarRequirements` | no |  |

### `AuctionShowMain`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `id` | no | `integer` | no |  |
| `cargo_num` | no | `string` | no |  |
| `cargo_date` | no | `string` | no |  |
| `order_uid` | no | `string` | no |  |
| `auc_type` | no | `#/components/schemas/AuctionType` | no |  |
| `created_at` | no | `string` | no |  |

### `AuctionShowOrganizer`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `subscriber_id` | no | `integer` | no |  |
| `subscriber_code` | no | `string` | no |  |
| `infobase_code` | no | `string` | no |  |
| `organization_name` | no | `string` | no |  |
| `organization_inn` | no | `string` | no |  |
| `organization_kpp` | no | `string` | no |  |
| `organization_id` | no | `integer` | no |  |

### `AuctionShowPayment`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `condition` | no | `string` | yes |  |
| `condition_predefined` | no | `string` | yes |  |
| `form` | no | `string` | no |  |
| `delay` | no | `integer` | yes | Отсрочка платежа |
| `delay_type` | no | `#/components/schemas/PaymentDelayType` | no |  |
| `currency_code` | no | `string` | no | Код валюты (ISO 4217 numeric) |
| `prepay` | no | `string` | yes |  |

### `AuctionShowResponse`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `main` | yes | `#/components/schemas/AuctionShowMain` | no |  |
| `organizer` | yes | `#/components/schemas/AuctionShowOrganizer` | no |  |
| `contacts` | yes | `array<#/components/schemas/Contact>` | no | Контакты организатора (пустой массив если данных нет) |
| `cargo` | yes | `#/components/schemas/AuctionShowCargo` | no |  |
| `trading` | yes | `#/components/schemas/AuctionShowTrading` | no |  |
| `payment` | yes | `#/components/schemas/AuctionShowPayment` | no |  |
| `assembly` | yes | `#/components/schemas/Assembly` | no |  |
| `routes` | yes | `array<#/components/schemas/RoutePoint>` | no |  |
| `admitted_organizations` | yes | `array<#/components/schemas/AdmittedOrganization>` | no | Допущенные к торгам организации |
| `hide_bets_history` | no | `boolean` | no |  |

### `AuctionShowTrading`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `status` | no | `#/components/schemas/AuctionStatus` | no |  |
| `status_mobile` | no | `#/components/schemas/TradingStatus` | no |  |
| `start_time` | no | `string` | no |  |
| `stop_time` | no | `string` | no |  |
| `bid_measurement_type` | no | `#/components/schemas/BidMeasurementType` | no |  |
| `can_set_bet` | no | `boolean` | no |  |
| `allow_counter_bets` | no | `boolean` | no |  |
| `hide_bets_history` | no | `boolean` | no |  |
| `hide_places` | no | `boolean` | no |  |
| `no_view_cargo_price` | no | `boolean` | no |  |
| `hide_points_address_and_contacts` | no | `boolean` | no |  |
| `is_bidder` | no | `boolean` | no |  |
| `is_favorite` | no | `boolean` | no |  |
| `is_last_bet_with_vat` | no | `boolean` | yes |  |
| `red_bet_with_vat` | no | `boolean` | no |  |
| `red_bet_no_vat` | no | `boolean` | no |  |
| `send_deal_before_load` | no | `boolean` | no |  |
| `chat_id` | no | `string` | yes |  |
| `price` | no | `#/components/schemas/AuctionShowTradingPrice` | no |  |
| `your` | no | `#/components/schemas/AuctionShowTradingYour` | no |  |
| `settings` | no | `#/components/schemas/AuctionShowTradingSettings` | no |  |

### `AuctionShowTradingPrice`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `start` | no | `number` | yes |  |
| `start_no_vat` | no | `number` | yes |  |
| `current` | no | `number` | yes |  |
| `current_no_vat` | no | `number` | yes |  |
| `available` | no | `number` | yes |  |
| `available_no_vat` | no | `number` | yes |  |
| `min` | no | `number` | yes |  |
| `min_no_vat` | no | `number` | yes |  |
| `max` | no | `number` | yes |  |
| `max_no_vat` | no | `number` | yes |  |
| `step` | no | `number` | yes |  |
| `step_no_vat` | no | `number` | yes |  |
| `price_per_km` | no | `number` | no | current_price_no_vat / distance; 0 если distance = 0 |

### `AuctionShowTradingSettings`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `prolong_after_bet` | no | `integer` | yes | Продление аукциона после ставки (мин) |
| `winner_confirm` | no | `integer` | yes |  |
| `winner_counter_mode` | no | `integer` | yes |  |
| `transmission_time_in` | no | `integer` | yes | Время на передачу (ч) |
| `coefficient` | no | `integer` | yes |  |

### `AuctionShowTradingYour`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `bet` | no | `boolean` | no |  |
| `last_bet` | no | `number` | yes |  |
| `last_bet_with_vat` | no | `number` | yes |  |
| `win` | no | `boolean` | no |  |

### `AuctionStatus`

Статус аукциона:
- `Planning` — планирование (1)
- `Auction` — торги идут (2)
- `DeterminateWinner` — определение победителя (3)
- `WaitDeal` — ожидание сделки (4)
- `InProgress` — в работе (5)
- `Finished` — завершён (6)
- `Stopped` — остановлен (7)
- `Canceled` — отменён (8)
- `Unknown` — неизвестный статус

**Enum values**

- `Planning`
- `Auction`
- `DeterminateWinner`
- `WaitDeal`
- `InProgress`
- `Finished`
- `Stopped`
- `Canceled`
- `Unknown`

- Type: `string`

### `AuctionType`

Тип аукциона:
- `Request` — заявочный (1)
- `Up` — на повышение (2)
- `Down` — на понижение (3)
- `FixPrice` — фиксированная цена (4)
- `Unknown` — неизвестный тип

**Enum values**

- `Request`
- `Up`
- `Down`
- `FixPrice`
- `Unknown`

- Type: `string`

### `BetItem`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `id` | no | `integer` | no | ID ставки |
| `created_at` | no | `string` | no | Дата и время создания ставки |
| `auction_id` | no | `integer` | no | ID аукциона |
| `subscriber_id` | no | `integer` | no | ID подписчика (перевозчика) |
| `contact_name` | no | `string` | no | Имя контактного лица |
| `contact_phone` | no | `string` | no | Телефон контактного лица (пустая строка если не задан) |
| `price_with_vat` | no | `number` | no | Цена ставки с НДС |
| `price_no_vat` | no | `number` | no | Цена ставки без НДС |
| `organization_id` | no | `integer` | no | ID организации перевозчика |
| `organization_inn` | no | `string` | no | ИНН организации перевозчика |
| `organization_name` | no | `string` | no | Название организации перевозчика (пустая строка если не задано) |
| `transporter_comment` | no | `string` | yes |  |
| `is_rejected` | no | `boolean` | no | Ставка отклонена |
| `is_counter` | no | `boolean` | no | Ставка является встречной |
| `place` | no | `integer` | yes | Место в рейтинге ставок |
| `is_win` | no | `boolean` | no | Ставка является победившей |
| `run_number` | no | `integer` | no | Номер рейса (0 если не задан) |
| `cancel_reason` | no | `string` | no | Причина отмены ставки (пустая строка если не отменена) |
| `price_info` | no | `#/components/schemas/BetItemPriceInfo` | no |  |

### `BetItemPriceInfo`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `price_with_vat` | no | `number` | yes |  |
| `price_no_vat` | no | `number` | yes |  |
| `payment_type` | no | `string` | yes |  |
| `vat_rate` | no | `string` | yes |  |

### `BetListResponse`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `bets` | yes | `array<#/components/schemas/BetItem>` | no |  |

### `BidMeasurementType`

Единица измерения ставки:
- `PerRoute` — за рейс (0)
- `PerKm` — за км (1)
- `Unknown` — неизвестный тип

**Enum values**

- `PerRoute`
- `PerKm`
- `Unknown`

- Type: `string`

### `CarRequirements`

Требования к ТС; null если не заданы

- Type: `object`
- Nullable: `true`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `type` | no | `string` | no |  |
| `weight` | no | `number` | yes |  |
| `volume` | no | `number` | yes |  |
| `width` | no | `number` | yes |  |
| `length` | no | `number` | yes |  |
| `height` | no | `number` | yes |  |

### `Contact`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `name` | no | `string` | yes |  |
| `phone` | no | `string` | yes |  |
| `work_phone` | no | `string` | yes |  |
| `uid` | no | `string` | yes |  |
| `email` | no | `string` | yes |  |

### `Docs`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `tir` | no | `boolean` | no |  |
| `cmr` | no | `boolean` | no |  |
| `t1` | no | `boolean` | no |  |
| `med` | no | `boolean` | no |  |

### `LoadingTypes`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `side` | no | `boolean` | no |  |
| `top` | no | `boolean` | no |  |
| `rear` | no | `boolean` | no |  |
| `full` | no | `boolean` | no |  |

### `OperationType`

Тип операции маршрутной точки:
- `Loading` — погрузка (1)
- `Unloading` — выгрузка (2)
- `Unknown` — неизвестный тип

**Enum values**

- `Loading`
- `Unloading`
- `Unknown`

- Type: `string`

### `PaymentDelayType`

Тип отсрочки платежа:
- `CalendarDays` — календарные дни (1)
- `WorkDays` — рабочие дни (2)
- `Unknown` — неизвестный тип

**Enum values**

- `CalendarDays`
- `WorkDays`
- `Unknown`

- Type: `string`
- Nullable: `true`

### `ProblemDetail`

Единый формат ошибки API (см. error-response-guideline.md). HTTP-код — в статус-строке ответа, в теле не дублируется.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `code` | yes | `string` | no | Машиночитаемый код (snake_case), стабилен между релизами |
| `title` | yes | `string` | no | Короткое название типа ошибки |
| `message` | yes | `string` | no | Пояснение конкретного случая |
| `trace_id` | no | `string` | yes | Идентификатор запроса для корреляции с логами |

### `RoutePoint`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `row_num` | no | `integer` | no |  |
| `op_type` | no | `#/components/schemas/OperationType` | no |  |
| `start_date` | no | `string` | no |  |
| `end_date` | no | `string` | no |  |
| `comment` | no | `string` | yes |  |
| `contractor` | no | `string` | no |  |
| `contractor_inn` | no | `string` | no |  |
| `location` | no | `#/components/schemas/RoutePointLocation` | no |  |
| `cargo` | no | `#/components/schemas/RoutePointCargo` | no |  |
| `contact` | no | `#/components/schemas/RoutePointContact` | no |  |

### `RoutePointCargo`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `name` | no | `string` | no |  |
| `package_name` | no | `string` | no |  |
| `weight` | no | `string` | no | Вес в тоннах (строковое представление с 3 знаками) |
| `volume` | no | `string` | no | Объём в м³ (строковое представление с 3 знаками) |
| `length` | no | `string` | no |  |
| `width` | no | `string` | no |  |
| `height` | no | `string` | no |  |
| `oversized` | no | `boolean` | no |  |
| `package_amount` | no | `integer` | yes |  |

### `RoutePointContact`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `name` | no | `string` | no |  |
| `phone` | no | `string` | no |  |

### `RoutePointLocation`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `city_name` | no | `string` | no |  |
| `city_full_name` | no | `string` | no |  |
| `city_gc_id` | no | `integer` | no |  |
| `loading_address` | no | `string` | no |  |
| `lon` | no | `number` | no |  |
| `lat` | no | `number` | no |  |

### `SetBetRequest`

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `price` | yes | `number` | no | Цена ставки (> 0) |

### `TradingStatus`

Торговый статус пользователя в аукционе:
- `NotParticipating` — не участвует (1)
- `Leading` — лидирует (2)
- `Losing` — перебит (3)
- `Winner` — победитель (4)
- `Confirmed` — подтверждён (5)
- `Unknown` — неизвестный статус

**Enum values**

- `NotParticipating`
- `Leading`
- `Losing`
- `OnPending`
- `Confirmed`
- `ChoosingWinner`
- `Winner`
- `Accepted`
- `Unknown`

- Type: `string`

### `ValidationError`

Ошибка по конкретному полю запроса

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `field` | yes | `string` | no | Путь к полю (snake_case, вложенные — через точку) |
| `message` | yes | `string` | no |  |
| `code` | no | `string` | yes | Машиночитаемый код нарушения |

### `ValidationProblem`

Ошибка валидации входных данных (422). Отличается от бизнес-ошибки кодом `validation_failed` и наличием `errors[]`.

- Type: `object`

| Property | Required | Type | Nullable | Description |
|---|---:|---|---:|---|
| `code` | yes | `string` | no |  |
| `title` | yes | `string` | no |  |
| `message` | yes | `string` | no |  |
| `trace_id` | no | `string` | yes |  |
| `errors` | yes | `array<#/components/schemas/ValidationError>` | no |  |

## 5. Frontend Mapping Rules

### API boundary

Keep OpenAPI DTOs at the API boundary. Map DTOs into application/view models only where presentation needs a different shape.

### Nullability

Do not collapse `null`, `undefined`, empty strings, zero, and `false` into one value. Preserve the contract semantics until the presentation layer explicitly decides how to display an absent value.

### Enums

Use generated or manually declared TypeScript literal unions that exactly match the OpenAPI enum values. UI labels should be separate from API values.

### Errors

Handle the contract's error responses through one normalized API error layer. Preserve `code`, `title`, `message`, and optional `trace_id`; map validation fields into React Hook Form where possible.

## 6. TanStack Query Mapping

| Operation | Query type | Suggested key |
|---|---|---|
| List auctions | Query | `['auctions', filters]` |
| Auction details | Query | `['auction', auctionUuid]` |
| Auction bets | Query | `['auction-bets', auctionUuid, options]` |
| Set bet | Mutation | `['set-bet', auctionUuid]` |

After a successful set-bet mutation, invalidate the auction list, auction details, and auction bets queries so the UI reflects the changed MSW state.

## 7. MSW Contract

MSW handlers must follow the same request and response structures as the OpenAPI contract. The mock store must be mutable so that a successful set-bet operation changes the relevant auction and bet state.

## 8. Verification Checklist

- [ ] Every endpoint is represented by a typed API function.
- [ ] Every request body matches OpenAPI.
- [ ] Every response is typed from OpenAPI.
- [ ] Enum values are not invented or renamed at the API boundary.
- [ ] Nullable fields remain nullable.
- [ ] Pagination uses server metadata.
- [ ] `401`, `404`, `422`, and `503` cases are handled where applicable.
- [ ] Validation errors can reach the form layer.
- [ ] MSW handlers mirror the contract.
- [ ] Successful mutations update mock state.
- [ ] Relevant TanStack Query caches are invalidated after mutation.

## 9. Next Step

The next design document is `architecture.md`, which will define the Feature-Sliced Design layers, dependency rules, API placement, query/mutation placement, MSW boundaries, and Docker-aware project structure.