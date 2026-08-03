import { useParams } from '@tanstack/react-router'

export function PlaceBetPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/place-bet' })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Сделать ставку</h2>
      <p className="text-gray-500">UUID: {auctionUuid}</p>
    </div>
  )
}
