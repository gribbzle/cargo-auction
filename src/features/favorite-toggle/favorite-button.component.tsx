import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toggleFavorite } from '@/shared/api/auction-api'
import { auctionKeys } from '@/shared/lib/query-keys'

interface FavoriteButtonProps {
  auctionUuid: string
  isFavorite: boolean
}

export function FavoriteButton({ auctionUuid, isFavorite }: FavoriteButtonProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(auctionUuid),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: auctionKeys.detail(auctionUuid) })
      await queryClient.cancelQueries({ queryKey: auctionKeys.lists() })

      const prevDetail = queryClient.getQueryData(auctionKeys.detail(auctionUuid))
      const prevList = queryClient.getQueriesData({ queryKey: auctionKeys.lists() })

      queryClient.setQueryData(auctionKeys.detail(auctionUuid), (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const data = old as { trading: { is_favorite: boolean } }
        return { ...data, trading: { ...data.trading, is_favorite: !isFavorite } }
      })

      return { prevDetail, prevList }
    },
    onError: () => {
      toast.error('Не удалось обновить избранное')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionUuid) })
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() })
    },
  })

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      aria-pressed={isFavorite}
      className={`text-2xl transition-colors hover:scale-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded ${
        isFavorite ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'
      }`}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
