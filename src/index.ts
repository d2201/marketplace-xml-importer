import './loadConfig'
import { promisify } from 'util'
import ErliSDK from './sdk/Erli'
import getAllXMLItems from './xmlParser'
import mapXmlItemToProduct from './erli/mapXmlItemToProduct'
import logger from './logger'

const sleep = promisify(setTimeout)

const uploadProductsToErli = async () => {
  const sdk = new ErliSDK()

  let count = 0

  for await (const item of getAllXMLItems(global.config.importer.filePath)) {
    ++count
    await sdk.createProduct(item.id, mapXmlItemToProduct(item))

    if (count % 50 === 0) {
      logger.info(`Processed: ${count}`)
    }
  }

  await sleep(500)

  logger.info(`Finished importing ${count} products to Erli.`)
}

Promise.resolve().then(async () => {
  await uploadProductsToErli()
})
