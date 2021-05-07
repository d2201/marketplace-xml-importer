import ApiBase from '@sdk/base'
import { ProductCreate } from '../types/erli'
import logger from '../logger'

export default class ErliSDK extends ApiBase {
  constructor() {
    super({
      requestsRateLimit: 1000,
      baseUrl: global.config.erli.apiUrl,
      maxErrorCount: 5,
      sleepDurationOnError: {
        network: 10_000,
        rateLimit: 15_000,
        serviceUnavailable: 10_000,
      },
      repeatOnUnknownError: true,
    })

    this.isAuthorized = true
    this.authorizationHeaders = {
      Authorization: `Bearer ${global.config.erli.apiKey}`,
    }
  }

  async createProduct(externalId: string, productCreateRequest: ProductCreate) {
    try {
      await this.request({
        path: `/products/${externalId}`,
        method: 'POST',
        data: productCreateRequest,
      })
    } catch (e) {
      logger.error(JSON.stringify(e.response.data, undefined, 2))
    }
  }
}
