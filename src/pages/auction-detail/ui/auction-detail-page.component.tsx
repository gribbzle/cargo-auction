import { useParams } from '@tanstack/react-router'

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Детали аукциона</h2>
      <p className="text-gray-500">UUID: {auctionUuid}</p>
    </div>
  )
}
