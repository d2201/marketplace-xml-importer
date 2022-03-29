import './loadConfig'
import _ from 'lodash'
import ErliSDK from './sdk/Erli'
import parseXml from './xmlParser'
import mapXmlItemToProduct from './erli/mapXmlItemToProduct'
import logger from './logger'
import runConcurrently from './helpers/runConcurrently'
import groupFilesByType from './helpers/groupFilesByType'
import { XMLItem } from './types/xml'
import generateIdMapFromFile from './helpers/generateIdMapFromFile'

const uploadProductsToErli = async (
  filePath: string
) => {
  logger.info('Starting updating products in erli')
  const sdk = new ErliSDK()

  const idMap = await generateIdMapFromFile(global.config.importer.csvIdPath)
  
  let count = 0
  let totalCount = 0

  await runConcurrently(parseXml<XMLItem>('item', filePath), 10, async (item) => {
    ++totalCount
    const productId = idMap.get(item.id)

    if (!productId) {
      return 
    }
    ++count
    
    const [product] = await sdk.searchProducts({ fields: ['externalId', 'sku'], filter: { field: 'sku', operator: '=', value: productId } })
    
    await sdk.updateProduct(product.externalId, mapXmlItemToProduct(item))
    logger.info(`updated: ${item.name}`)

    if (count % 50 === 0) {
      logger.info(`Processed: ${count}`)
    }
  })

  logger.info(`Finished updating ${count}/${totalCount} products in Erli.`)
}

Promise.resolve().then(async () => {
  const byType = await groupFilesByType()

  for (const { file } of byType.offers) {
    await uploadProductsToErli(file)
  }

  process.exit(0)
})

setInterval(() => undefined, 500)
