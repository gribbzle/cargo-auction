import type { AuctionSeed } from '../seed/auctions.seed'

interface AuctionStore {
  auctions: Map<string, AuctionSeed>
  get(uuid: string): AuctionSeed | undefined
  getAll(): AuctionSeed[]
  updateTradingState(uuid: string, patch: Partial<AuctionSeed['detail']['trading']>): void
  createBet(uuid: string, bet: AuctionSeed['bets'][0]): void
}

function createStore(): AuctionStore {
  const auctions = new Map<string, AuctionSeed>()

  return {
    auctions,
    get(uuid: string) {
      return auctions.get(uuid)
    },
    getAll() {
      return Array.from(auctions.values())
    },
    updateTradingState(uuid, patch) {
      const auction = auctions.get(uuid)
      if (auction) {
        Object.assign(auction.detail.trading, patch)
        const listItem = auction.data
        if (patch.status) listItem.trading.status = patch.status
        if (patch.status_mobile) listItem.trading.status_mobile = patch.status_mobile
        if (patch.price) {
          listItem.trading.price = {
            start: patch.price.start ?? listItem.trading.price?.start ?? 0,
            current: patch.price.current ?? listItem.trading.price?.current ?? 0,
            current_no_vat: patch.price.current_no_vat ?? listItem.trading.price?.current_no_vat ?? 0,
          }
        }
      }
    },
    createBet(uuid, bet) {
      const auction = auctions.get(uuid)
      if (auction) {
        auction.bets.push(bet)
        auction.detail.trading.price.current = bet.price_with_vat
        auction.detail.trading.price.current_no_vat = bet.price_no_vat
        auction.detail.trading.your = {
          bet: true,
          last_bet: bet.price_with_vat,
          last_bet_with_vat: bet.price_with_vat,
          win: false,
        }
        auction.data.trading.price = {
          start: auction.data.trading.price?.start ?? bet.price_with_vat,
          current: bet.price_with_vat,
          current_no_vat: bet.price_no_vat,
        }
        auction.data.trading.your = {
          bet: true,
          last_bet: bet.price_with_vat,
        }
      }
    },
  }
}

export const auctionStore = createStore()
