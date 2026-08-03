import { useParams } from '@tanstack/react-router'

export function AuctionBetsPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bets' })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">История ставок</h2>
      <p className="text-gray-500">UUID: {auctionUuid}</p>
    </div>
  )
}
