import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { auctionKeys } from '@/shared/lib/query-keys'
import { fetchAuctionDetail } from '@/shared/api/auction-api'
import { Badge, Button, Skeleton } from '@/shared/ui'
import { Breadcrumbs } from '@/shared/ui/layout'
import { FavoriteButton } from '@/features/favorite-toggle'
import { formatCurrency, formatDate } from '@/widgets/auction-card/lib/formatters'
import { getAuctionTypeBadge, getStatusBadge, getTradingStatusBadge } from '@/widgets/auction-card/lib/badges'
import type { AuctionShowResponse, RoutePoint } from '@/shared/api/dto'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })

  const { data, isLoading, error } = useQuery({
    queryKey: auctionKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
  })

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error || !data) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Аукционы', to: '/auctions' }, { label: 'Ошибка' }]} />
        <div className="rounded-xl border border-red-200 bg-red-50 p-12 text-center" role="alert">
          <div className="text-4xl mb-3" aria-hidden="true">⚠️</div>
          <p className="text-red-700 font-medium">Ошибка загрузки аукциона</p>
          <p className="text-red-500 text-sm mt-1">Попробуйте обновить страницу</p>
          <Link to="/auctions">
            <Button variant="secondary" className="mt-4">← Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Аукционы', to: '/auctions' },
          { label: data.main.cargo_num },
        ]}
      />

      <Header data={data} uuid={auctionUuid} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main content — 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <RouteSection data={data} />
          <CargoSection data={data} />
          <TradingSection data={data} />
        </div>

        {/* Sidebar — 1 column */}
        <div className="space-y-6">
          <OrganizerCard data={data} />
          <PaymentCard data={data} />
          <Actions data={data} uuid={auctionUuid} />
        </div>
      </div>
    </div>
  )
}

function Header({ data, uuid }: { data: AuctionShowResponse; uuid: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <h2 className="text-xl font-semibold text-gray-900">{data.main.cargo_num}</h2>
      <Badge variant={getAuctionTypeBadge(data.main.auc_type)}>{data.main.auc_type}</Badge>
      <Badge variant={getStatusBadge(data.trading.status)}>{data.trading.status}</Badge>
      <Badge variant={getTradingStatusBadge(data.trading.status_mobile)}>
        {data.trading.status_mobile}
      </Badge>
      <FavoriteButton auctionUuid={uuid} isFavorite={data.trading.is_favorite} />
    </div>
  )
}

function RouteSection({ data }: { data: AuctionShowResponse }) {
  const { routes, trading } = data
  const hideContacts = trading.hide_points_address_and_contacts

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Маршрут</h3>

      {routes.length === 0 ? (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex-1">
            <span className="text-gray-500 text-xs block">Погрузка</span>
            <span className="font-medium text-gray-900">—</span>
          </div>
          <span className="text-gray-400 text-lg">→</span>
          <div className="flex-1">
            <span className="text-gray-500 text-xs block">Разгрузка</span>
            <span className="font-medium text-gray-900">—</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((point) => (
            <RoutePointCard key={point.row_num} point={point} hideContacts={hideContacts} />
          ))}
        </div>
      )}
    </section>
  )
}

function RoutePointCard({ point, hideContacts }: { point: RoutePoint; hideContacts?: boolean }) {
  const isLoad = point.op_type === 'Loading'
  return (
    <div className={`rounded-lg border p-4 ${isLoad ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={isLoad ? 'success' : 'warning'}>
          {isLoad ? 'Погрузка' : 'Разгрузка'}
        </Badge>
        <span className="text-sm font-medium text-gray-900">
          {point.location.city_name}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500 text-xs block">Адрес</span>
          <span className="text-gray-900">{point.location.loading_address}</span>
        </div>
        <div>
          <span className="text-gray-500 text-xs block">Дата</span>
          <span className="text-gray-900">{formatDate(point.start_date)} — {formatDate(point.end_date)}</span>
        </div>
        {!hideContacts && (
          <>
            <div>
              <span className="text-gray-500 text-xs block">Контакт</span>
              <span className="text-gray-900">{point.contact.name}</span>
              <span className="text-gray-500 text-xs block">{point.contact.phone}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Подрядчик</span>
              <span className="text-gray-900">{point.contractor}</span>
            </div>
          </>
        )}
      </div>
      {point.cargo.name && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
          <span className="text-gray-500 text-xs block">Груз</span>
          <span className="text-gray-900">
            {point.cargo.name}, {point.cargo.weight} кг, {point.cargo.volume} м³
          </span>
        </div>
      )}
      {point.comment && (
        <div className="mt-2 text-xs text-gray-500 italic">{point.comment}</div>
      )}
    </div>
  )
}

function CargoSection({ data }: { data: AuctionShowResponse }) {
  const { cargo, trading } = data
  const hidePrice = trading.no_view_cargo_price

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Груз и требования</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {!hidePrice && <InfoField label="Стоимость груза" value={`${Number(cargo.price).toLocaleString('ru-RU')} ₽`} />}
        <InfoField label="Расстояние" value={cargo.distance ? `${cargo.distance} км` : '—'} />
        <InfoField label="Кол-во машин" value={String(cargo.truck_count)} />
        <InfoField label="Тип кузова" value={cargo.body_type} />
        <InfoField label="Температура" value={
          cargo.temp_from != null && cargo.temp_to != null
            ? `${cargo.temp_from}°C — ${cargo.temp_to}°C`
            : '—'
        } />
        <InfoField label="Тара" value={cargo.containered ? 'Контейнер' : 'Нет'} />
        <InfoField label="Коники" value={cargo.conics != null ? String(cargo.conics) : '—'} />
        <InfoField label="Ремни" value={cargo.belts != null ? String(cargo.belts) : '—'} />
        <InfoField label="ADR" value={cargo.adr != null ? String(cargo.adr) : '—'} />
      </div>

      {/* Loading types */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500 block mb-2">Типы загрузки</span>
        <div className="flex flex-wrap gap-2">
          <LoadingTypeFlag label="Боковая" active={cargo.loading_types.side} />
          <LoadingTypeFlag label="Верхняя" active={cargo.loading_types.top} />
          <LoadingTypeFlag label="Задняя" active={cargo.loading_types.rear} />
          <LoadingTypeFlag label="Полная" active={cargo.loading_types.full} />
        </div>
      </div>

      {/* Docs */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500 block mb-2">Документы</span>
        <div className="flex flex-wrap gap-2">
          <DocFlag label="TIR" active={cargo.docs.tir} />
          <DocFlag label="CMR" active={cargo.docs.cmr} />
          <DocFlag label="T1" active={cargo.docs.t1} />
          <DocFlag label="MED" active={cargo.docs.med} />
        </div>
      </div>

      {/* Flags */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        {cargo.coupling && <Badge variant="info">Сцепка</Badge>}
        {cargo.air_pass && <Badge variant="info">Воздушный тормоз</Badge>}
        {cargo.low_loader && <Badge variant="info">Низкорамный</Badge>}
        {cargo.additional_load && <Badge variant="info">Доп. погрузка</Badge>}
        {cargo.is_international && <Badge variant="purple">Международный</Badge>}
      </div>
    </section>
  )
}

function TradingSection({ data }: { data: AuctionShowResponse }) {
  const { trading } = data
  const { price } = trading

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Торговая информация</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <InfoField label="Тип измерения" value={
          trading.bid_measurement_type === 'PerRoute' ? 'За маршрут' :
          trading.bid_measurement_type === 'PerKm' ? 'За км' : '—'
        } />
        <InfoField label="Начало" value={formatDate(trading.start_time)} />
        <InfoField label="Окончание" value={formatDate(trading.stop_time)} />
        <InfoField label="Стартовая цена" value={price.start != null ? formatCurrency(price.start) : '—'} />
        <InfoField label="Текущая цена" value={price.current != null ? formatCurrency(price.current) : '—'} highlight />
        <InfoField label="Цена за км" value={formatCurrency(price.price_per_km)} />
        <InfoField label="Мин. ставка" value={price.min != null ? formatCurrency(price.min) : '—'} />
        <InfoField label="Макс. ставка" value={price.max != null ? formatCurrency(price.max) : '—'} />
        <InfoField label="Шаг ставки" value={price.step != null ? formatCurrency(price.step) : '—'} />
      </div>

      {/* Your bet */}
      {trading.your.bet && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Ваша ставка:</span>
            <span className="font-semibold text-gray-900">
              {trading.your.last_bet != null ? formatCurrency(trading.your.last_bet) : '—'}
            </span>
            {trading.your.win && <Badge variant="success">Победитель</Badge>}
          </div>
        </div>
      )}

      {/* Flags */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        {trading.allow_counter_bets && <Badge variant="info">Контр ставки</Badge>}
        {trading.red_bet_with_vat && <Badge variant="error">Красная ставка (с НДС)</Badge>}
        {trading.red_bet_no_vat && <Badge variant="error">Красная ставка (без НДС)</Badge>}
        {trading.send_deal_before_load && <Badge variant="warning">Сделка до погрузки</Badge>}
      </div>
    </section>
  )
}

function OrganizerCard({ data }: { data: AuctionShowResponse }) {
  const { organizer } = data

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Организатор</h3>
      <div className="space-y-2 text-sm">
        <InfoField label="Организация" value={organizer.organization_name} />
        <InfoField label="ИНН" value={organizer.organization_inn} />
        <InfoField label="КПП" value={organizer.organization_kpp} />
        <InfoField label="Код абонента" value={organizer.subscriber_code} />
      </div>
    </section>
  )
}

function PaymentCard({ data }: { data: AuctionShowResponse }) {
  const { payment } = data

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Условия оплаты</h3>
      <div className="space-y-2 text-sm">
        <InfoField label="Форма оплаты" value={payment.form} />
        <InfoField label="Валюта" value={payment.currency_code} />
        {payment.delay != null && (
          <InfoField label="Отсрочка" value={`${payment.delay} ${payment.delay_type === 'CalendarDays' ? 'календарных дней' : 'рабочих дней'}`} />
        )}
        {payment.prepay && <InfoField label="Предоплата" value={payment.prepay} />}
        {payment.condition && <InfoField label="Условие" value={payment.condition} />}
      </div>
    </section>
  )
}

function Actions({ data, uuid }: { data: AuctionShowResponse; uuid: string }) {
  const { trading } = data

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Действия</h3>
      <div className="space-y-2">
        {trading.can_set_bet ? (
          <Link to="/auctions/$auctionUuid/place-bet" params={{ auctionUuid: uuid }} className="block">
            <Button className="w-full">
              {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
            </Button>
          </Link>
        ) : (
          <Button disabled className="w-full">
            Ставки не принимаются
          </Button>
        )}
        {!trading.hide_bets_history && (
          <Link to="/auctions/$auctionUuid/bets" params={{ auctionUuid: uuid }} className="block">
            <Button variant="secondary" className="w-full">
              Смотреть ставки
            </Button>
          </Link>
        )}
      </div>
    </section>
  )
}

function InfoField({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <span className="text-gray-500 text-xs block">{label}</span>
      <span className={highlight ? 'font-semibold text-gray-900' : 'text-gray-900'}>{value}</span>
    </div>
  )
}

function LoadingTypeFlag({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400 line-through'
    }`}>
      {label}
    </span>
  )
}

function DocFlag({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-400'
    }`}>
      {label}
    </span>
  )
}

function DetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-64 mb-6" />
      <Skeleton className="h-8 w-96 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
