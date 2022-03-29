import ApiBase from '@sdk/base'
import { ProductCreate, ProductSearch, ProductUpdate } from '../types/erli'

export default class ErliSDK extends ApiBase {
  constructor() {
    super({
      requestsRateLimit: 9000,
      baseUrl: global.config.erli.apiUrl,
      maxErrorCount: 5,
      sleepDurationOnError: {
        network: 10_000,
        rateLimit: 15_000,
        serviceUnavailable: 10_000,
      },
      repeatOnUnknownError: false,
    })

    this.isAuthorized = true
    this.authorizationHeaders = {
      Authorization: `Bearer ${global.config.erli.apiKey}`,
    }
  }

  async createProduct(externalId: string, productCreateRequest: ProductCreate) {
    await this.request({
      path: `/products/${externalId}`,
      method: 'POST',
      data: productCreateRequest,
    })
  }
  
  async searchProducts(productSearch: ProductSearch): Promise<Array<{ externalId: string; sku: string }>> {
    return this.request({ path: `/products/_search`, method: 'POST', data: productSearch })
  }

  async updateProduct(externalId: string, productUpdateRequest: ProductUpdate) {
    await this.request({
      path: `/products/${externalId}`,
      method: 'PATCH' as any,
      data: productUpdateRequest
    })
  }
}
