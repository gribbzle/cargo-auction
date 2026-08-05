import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auctionKeys } from '@/shared/lib/query-keys';
import { fetchAuctionDetail } from '@/shared/api/auction-api';

export function usePrefetchAuction() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (uuid: string) => {
      queryClient.prefetchQuery({
        queryKey: auctionKeys.detail(uuid),
        queryFn: () => fetchAuctionDetail(uuid),
        staleTime: 30_000,
      });
    },
    [queryClient]
  );

  return prefetch;
}
