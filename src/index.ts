import './loadConfig'
import _ from 'lodash'
import ErliSDK from './sdk/Erli'
import parseXml from './xmlParser'
import mapXmlItemToProduct from './erli/mapXmlItemToProduct'
import logger from './logger'
import runConcurrently from './helpers/runConcurrently'
import groupFilesByType from './helpers/groupFilesByType'
import { XMLItem, XMLVariantSet, XMLShippingRate } from './types/xml'
import collectAllXmlEntitiesInMemory from './helpers/collectAllXmlEntitiesInMemory'
import ShoperSDK from './sdk/Shoper'

const uploadProductsToErli = async (
  filePath: string,
  variantSets: XMLVariantSet[],
  shippingRates: XMLShippingRate[],
) => {
  logger.info('Starting importing products to erli')
  const sdk = new ErliSDK()
  const shoperSdk = new ShoperSDK()

  let count = 0

  await runConcurrently(parseXml<XMLItem>('item', filePath), 10, async (item) => {
    ++count

    const auction = await shoperSdk.findAuctionByOfferId(item.id)

    if (!auction) {
      return
    }

    const productId = auction.product_id

    const mappedItem = mapXmlItemToProduct(item, variantSets, shippingRates)

    await sdk.updateProduct(productId, {
      externalAttributes: mappedItem.externalAttributes,
      externalCategories: mappedItem.externalCategories,
    })
    logger.info(`inserted: ${item.name}`)

    if (count % 50 === 0) {
      logger.info(`Processed: ${count}`)
    }
  })

  logger.info(`Finished importing ${count} products to Erli.`)
}

Promise.resolve().then(async () => {
  const byType = await groupFilesByType()

  const variantSets = await flatten<XMLVariantSet>(byType['variant-sets'])
  const shippingRates = await flatten<XMLShippingRate>(byType['shipping-rates'])

  for (const { file } of byType.offers) {
    await uploadProductsToErli(file, variantSets, shippingRates)
  }

  process.exit(0)
})

setInterval(() => undefined, 500)

const flatten = async <T>(arr: Array<{ file: string }>): Promise<T[]> => {
  const promises = arr.map(({ file }) => collectAllXmlEntitiesInMemory<T>(file))

  return _.flatten(await Promise.all(promises))
}
