import ApiBase from '@sdk/base'
import { Maybe } from '../types'
import { Auction, ShoperPaginatedResult } from '../types/shoper'

const ONE_MINUTE = 1_000 * 60

export default class ShoperSDK extends ApiBase {
  constructor() {
    super({
      baseUrl: global.config.shoper.apiUrl,
      requestsRateLimit: 10_000,
      maxErrorCount: 3,
      repeatOnUnknownError: false,
      sleepDurationOnError: {
        network: 5_000,
        rateLimit: 30_000,
        serviceUnavailable: 10_000,
      },
    })
  }

  async authorize() {
    const data = await this.request<{ access_token: string }>({
      path: '/auth',
      method: 'POST',
      auth: { username: global.config.shoper.userName, password: global.config.shoper.password },
      requireAuthorization: false,
    })

    this.authorizationHeaders = { Authorization: `Bearer ${data.access_token}` }
    this.isAuthorized = true

    setTimeout(() => {
      this.isAuthorized = false
      this.authorizationHeaders = {}
    }, 30 * ONE_MINUTE).unref()
  }

  async findAuctionByOfferId(offerId: number | string): Promise<Maybe<Auction>> {
    const data = await this.request<ShoperPaginatedResult<Auction>>({
      path: `/auctions`,
      queryParams: { filters: JSON.stringify({ real_auction_id: `${offerId}` }) },
    })

    return data.list.item(0)
  }
}
