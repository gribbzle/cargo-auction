export type AuctionType = 'Request' | 'Up' | 'Down' | 'FixPrice' | 'Unknown'

export type AuctionStatus =
  | 'Planning'
  | 'Auction'
  | 'DeterminateWinner'
  | 'WaitDeal'
  | 'InProgress'
  | 'Finished'
  | 'Stopped'
  | 'Canceled'
  | 'Unknown'

export type TradingStatus =
  | 'NotParticipating'
  | 'Leading'
  | 'Losing'
  | 'OnPending'
  | 'Confirmed'
  | 'ChoosingWinner'
  | 'Winner'
  | 'Accepted'
  | 'Unknown'

export type BidMeasurementType = 'PerRoute' | 'PerKm' | 'Unknown'

export type OperationType = 'Loading' | 'Unloading' | 'Unknown'

export type PaymentDelayType = 'CalendarDays' | 'WorkDays' | 'Unknown'

export interface AuctionListRequest {
  page?: number
  per_page?: number
  is_oldest?: boolean
  sort?: Record<string, string> | null
  status?: string[]
  mobile_statuses?: number[]
  statuses?: number[]
  cargo_num?: string
  weight_from?: number
  weight_to?: number
  volume_from?: number
  volume_to?: number
  body_types?: string[]
  form_type?: string | null
  is_international_shipment?: boolean
  load_city?: string
  load_gc_id?: number
  load_range?: number
  unload_city?: string
  unload_gc_id?: number
  unload_range?: number
  load_date_from?: string
  load_date_to?: string
  unload_date_from?: string
  unload_date_to?: string
  create_date_from?: string
  create_date_to?: string
  start_time_from?: string
  start_time_to?: string
  stop_time_from?: string
  stop_time_to?: string
  is_available?: boolean
  is_favorite?: boolean
  is_bidder?: boolean
  customer?: string
  customer_ids?: number[]
  contractor?: string | null
  auction_ids?: number[]
  replace_external_pads?: boolean | null
  current_price_from?: number | null
  current_price_to?: number | null
  price_per_km_from?: number | null
  price_per_km_to?: number | null
  auc_type?: string[]
}

export interface AuctionListItemMain {
  id: number
  cargo_num: string
  cargo_date: string
  auc_type: AuctionType
  order_uid: string
  created_at: string
  priority_sort: number
  is_assembly: boolean
  price_per_km: number | null
}

export interface AuctionListItemOrganizer {
  subscriber_id: number
  organization_id: number
  organization_name: string
  organization_inn: string
  organization_kpp: string
  is_hide_organization: boolean
}

export interface AuctionListItemRoutePoint {
  city: string
  address: string
  date: string
  city_gc_id: number
  points_count: number
}

export interface AuctionListItemRoute {
  load: AuctionListItemRoutePoint
  unload: AuctionListItemRoutePoint
}

export interface AuctionListItemCargoLoadingType {
  side: boolean
  top: boolean
  rear: boolean
  full: boolean
}

export interface AuctionListItemCargoDocs {
  tir: boolean
  cmr: boolean
  t1: boolean
  med: boolean
}

export interface AuctionListItemCargo {
  name: string
  weight: number
  volume: number
  body_type: string
  truck_count: number
  is_cargo: boolean
  is_international: boolean
  containered: boolean
  incoterms: string
  conics: number
  belts: number
  adr: number
  coupling: boolean
  air_pass: boolean
  low_loader: boolean
  additional_load: boolean
  temp_from: number
  temp_to: number
  loading_types: AuctionListItemCargoLoadingType
  docs: AuctionListItemCargoDocs
  car: unknown
}

export interface AuctionListItemTradingPrice {
  start: number
  current: number
  current_no_vat: number
}

export interface AuctionListItemTradingYour {
  bet: boolean
  last_bet: number | null
}

export interface AuctionListItemTrading {
  status: AuctionStatus
  status_mobile: TradingStatus
  start_time: string
  stop_time: string
  bid_measurement_type: BidMeasurementType | null
  can_set_bet: boolean
  allow_counter_bets: boolean
  hide_points_address_and_contacts: boolean
  direction: string
  comment: string
  is_bidder: boolean
  is_available: boolean
  is_accredited: boolean
  is_favorite: boolean
  price: AuctionListItemTradingPrice | null
  your: AuctionListItemTradingYour | null
  red_bet_with_vat: boolean
  red_bet_no_vat: boolean
  is_last_bet_with_vat: boolean
}

export interface AuctionListItemPayment {
  form: string
  currency_code: number
  consignor: string
  consignee: string
}

export interface AuctionListItem {
  uuid: string
  main: AuctionListItemMain
  organizer: AuctionListItemOrganizer
  route: AuctionListItemRoute
  cargo: AuctionListItemCargo
  trading: AuctionListItemTrading
  payment: AuctionListItemPayment
}

export interface AuctionListMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface AuctionListResponseBase {
  data: AuctionListItem[]
  meta: AuctionListMeta
}

export interface AuctionShowMain {
  id: number
  cargo_num: string
  cargo_date: string
  order_uid: string
  auc_type: AuctionType
  created_at: string
}

export interface AuctionShowOrganizer {
  subscriber_id: number
  subscriber_code: string
  infobase_code: string
  organization_name: string
  organization_inn: string
  organization_kpp: string
  organization_id: number
}

export interface AuctionShowCargo {
  price: string
  currency: number | null
  is_international: boolean
  distance: number | null
  truck_count: number
  body_type: string
  temp_from: number | null
  temp_to: number | null
  conics: number | null
  belts: number | null
  adr: number | null
  coupling: boolean | null
  air_pass: boolean | null
  low_loader: boolean | null
  additional_load: boolean | null
  containered: boolean
  container_type: string | null
  container_size: string | null
  loading_types: LoadingTypes
  docs: Docs
  car: CarRequirements | null
}

export interface AuctionShowTradingPrice {
  start: number | null
  start_no_vat: number | null
  current: number | null
  current_no_vat: number | null
  available: number | null
  available_no_vat: number | null
  min: number | null
  min_no_vat: number | null
  max: number | null
  max_no_vat: number | null
  step: number | null
  step_no_vat: number | null
  price_per_km: number
}

export interface AuctionShowTradingYour {
  bet: boolean
  last_bet: number | null
  last_bet_with_vat: number | null
  win: boolean
}

export interface AuctionShowTradingSettings {
  prolong_after_bet: number | null
  winner_confirm: number | null
  winner_counter_mode: number | null
  transmission_time_in: number | null
  coefficient: number | null
}

export interface AuctionShowTrading {
  status: AuctionStatus
  status_mobile: TradingStatus
  start_time: string
  stop_time: string
  bid_measurement_type: BidMeasurementType
  can_set_bet: boolean
  allow_counter_bets: boolean
  hide_bets_history: boolean
  hide_places: boolean
  no_view_cargo_price: boolean
  hide_points_address_and_contacts: boolean
  is_bidder: boolean
  is_favorite: boolean
  is_last_bet_with_vat: boolean | null
  red_bet_with_vat: boolean
  red_bet_no_vat: boolean
  send_deal_before_load: boolean
  chat_id: string | null
  price: AuctionShowTradingPrice
  your: AuctionShowTradingYour
  settings: AuctionShowTradingSettings
}

export interface AuctionShowPayment {
  condition: string | null
  condition_predefined: string | null
  form: string
  delay: number | null
  delay_type: PaymentDelayType | null
  currency_code: number
  prepay: string | null
}

export interface Contact {
  name: string | null
  phone: string | null
  work_phone: string | null
  uid: string | null
  email: string | null
}

export interface Assembly {
  num: string | null
  date: string | null
}

export interface RoutePointLocation {
  city_name: string
  city_full_name: string
  city_gc_id: number
  loading_address: string
  lon: number
  lat: number
}

export interface RoutePointCargo {
  name: string
  package_name: string
  weight: string
  volume: string
  length: string
  width: string
  height: string
  oversized: boolean
  package_amount: number | null
}

export interface RoutePointContact {
  name: string
  phone: string
}

export interface RoutePoint {
  row_num: number
  op_type: OperationType
  start_date: string
  end_date: string
  comment: string | null
  contractor: string
  contractor_inn: string
  location: RoutePointLocation
  cargo: RoutePointCargo
  contact: RoutePointContact
}

export interface AdmittedOrganization {
  id: number
  inn: string
  is_main: boolean
  name: string
  full_name: string
  site: string | null
  subscriber_id: number
  subscriber_code: string
  subscriber_role: string | null
  infobase_code: string
  infobase_address: string | null
  nalog_key: string | null
  hide_me: boolean
  current_vat_rate: string | null
}

export interface AuctionShowResponse {
  main: AuctionShowMain
  organizer: AuctionShowOrganizer
  contacts: Contact[]
  cargo: AuctionShowCargo
  trading: AuctionShowTrading
  payment: AuctionShowPayment
  assembly: Assembly
  routes: RoutePoint[]
  admitted_organizations: AdmittedOrganization[]
  hide_bets_history: boolean
}

export interface LoadingTypes {
  side: boolean
  top: boolean
  rear: boolean
  full: boolean
}

export interface Docs {
  tir: boolean
  cmr: boolean
  t1: boolean
  med: boolean
}

export interface CarRequirements {
  type: string
  weight: number | null
  volume: number | null
  width: number | null
  length: number | null
  height: number | null
}

export interface BetItemPriceInfo {
  price_with_vat: number | null
  price_no_vat: number | null
  payment_type: string | null
  vat_rate: string | null
}

export interface BetItem {
  id: number
  created_at: string
  auction_id: number
  subscriber_id: number
  contact_name: string
  contact_phone: string
  price_with_vat: number
  price_no_vat: number
  organization_id: number
  organization_inn: string
  organization_name: string
  transporter_comment: string | null
  is_rejected: boolean
  is_counter: boolean
  place: number | null
  is_win: boolean
  run_number: number
  cancel_reason: string
  price_info: BetItemPriceInfo
}

export interface BetListResponse {
  bets: BetItem[]
}

export interface SetBetRequest {
  price: number
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ProblemDetail {
  code: string
  title: string
  message: string
  trace_id?: string | null
}

export interface ValidationProblem extends ProblemDetail {
  code: 'validation_failed'
  errors: ValidationError[]
}
