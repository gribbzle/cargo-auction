import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import { auctionKeys } from '@/shared/lib/query-keys'
import { fetchAuctionDetail, setBet } from '@/shared/api/auction-api'
import { ValidationError } from '@/shared/api/http-client'
import { Button, Input, Skeleton } from '@/shared/ui'
import { Breadcrumbs } from '@/shared/ui/layout'
import { Badge } from '@/shared/ui'
import { formatCurrency, formatDate } from '@/widgets/auction-card/lib/formatters'
import { getAuctionTypeBadge, getStatusBadge } from '@/widgets/auction-card/lib/badges'

export function PlaceBetPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/place-bet' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: auction, isLoading } = useQuery({
    queryKey: auctionKeys.detail(auctionUuid),
    queryFn: () => fetchAuctionDetail(auctionUuid),
  })

  const mutation = useMutation({
    mutationFn: (price: number) => setBet(auctionUuid, { price }),
    onSuccess: () => {
      toast.success('Ставка сделана!')
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionUuid) })
      queryClient.invalidateQueries({ queryKey: auctionKeys.bets(auctionUuid) })
      navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } })
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        const fieldError = error.errors.find((e) => e.field === 'price')
        if (fieldError) {
          toast.error(fieldError.message)
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Произошла ошибка при отправке ставки')
      }
    },
  })

  const price = auction?.trading.price
  const minPrice = price?.min ?? 0
  const maxPrice = price?.max ?? Infinity
  const step = price?.step ?? 1
  const currentPrice = price?.current ?? 0

  const schema = z.object({
    price: z
      .number({ error: 'Введите число' })
      .min(minPrice, `Минимальная ставка: ${formatCurrency(minPrice)}`)
      .max(maxPrice, `Максимальная ставка: ${formatCurrency(maxPrice)}`)
      .refine(
        (val) => step > 0 ? (val - minPrice) % step === 0 : true,
        `Шаг ставки: ${formatCurrency(step)}`,
      ),
  })

  type BetForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BetForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: minPrice || currentPrice,
    },
  })

  const watchPrice = watch('price')

  function onSubmit(data: BetForm) {
    mutation.mutate(data.price)
  }

  if (isLoading) {
    return <PlaceBetSkeleton />
  }

  if (!auction) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Аукционы', to: '/auctions' }, { label: 'Ошибка' }]} />
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700 font-medium">Аукцион не найден</p>
          <Link to="/auctions">
            <Button variant="secondary" className="mt-4">← Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { main, routes, trading } = auction
  const loadCity = routes[0]?.location.city_name ?? '—'
  const unloadCity = routes[routes.length - 1]?.location.city_name ?? '—'

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Аукционы', to: '/auctions' },
          { label: main.cargo_num, to: `/auctions/${auctionUuid}` },
          { label: 'Сделать ставку' },
        ]}
      />

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Сделать ставку</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form — 2 columns */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Auction summary */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-900">{main.cargo_num}</span>
                <Badge variant={getAuctionTypeBadge(main.auc_type)}>{main.auc_type}</Badge>
                <Badge variant={getStatusBadge(trading.status)}>{trading.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{loadCity}</span>
                <span className="text-gray-400">→</span>
                <span>{unloadCity}</span>
              </div>
            </div>

            {/* Price input */}
            <div className="mb-6">
              <Input
                label="Ваша ставка (₽)"
                type="number"
                step={step}
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
              />
              {watchPrice > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Допустимый диапазон: {formatCurrency(minPrice)} — {formatCurrency(maxPrice)}
                  {step > 0 && ` | Шаг: ${formatCurrency(step)}`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Отправка...' : 'Подтвердить ставку'}
              </Button>
              <Link to="/auctions/$auctionUuid" params={{ auctionUuid }}>
                <Button type="button" variant="secondary">Отмена</Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Sidebar — 1 column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Текущая информация</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs block">Текущая цена</span>
                <span className="font-semibold text-gray-900">
                  {price?.current != null ? formatCurrency(price.current) : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Стартовая цена</span>
                <span className="text-gray-900">
                  {price?.start != null ? formatCurrency(price.start) : '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Цена за км</span>
                <span className="text-gray-900">{formatCurrency(price?.price_per_km ?? 0)}</span>
              </div>
              {trading.your.bet && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-gray-500 text-xs block">Ваша текущая ставка</span>
                  <span className="font-semibold text-gray-900">
                    {trading.your.last_bet != null ? formatCurrency(trading.your.last_bet) : '—'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Время</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500 text-xs block">Начало</span>
                <span className="text-gray-900">{formatDate(trading.start_time)}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Окончание</span>
                <span className="text-gray-900">{formatDate(trading.stop_time)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceBetSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-64 mb-6" />
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-14 w-full mb-6" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
