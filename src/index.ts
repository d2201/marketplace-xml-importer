import './loadConfig'
import { promisify } from 'util'
import ErliSDK from './sdk/Erli'
import getAllXMLItems from './xmlParser'
import mapXmlItemToProduct from './erli/mapXmlItemToProduct'
import logger from './logger'
import runConcurrently from './helpers/runConcurrently'

const sleep = promisify(setTimeout)

const uploadProductsToErli = async () => {
  const sdk = new ErliSDK()

  let count = 0

  await runConcurrently(getAllXMLItems(global.config.importer.filePath), 10, async (item) => {
    ++count

    await sdk.createProduct(item.externalid || item.id, mapXmlItemToProduct(item))
    logger.info(`inserted: ${item.name}`)

    if (count % 50 === 0) {
      logger.info(`Processed: ${count}`)
    }
  })

  await sleep(500)

  logger.info(`Finished importing ${count} products to Erli.`)
}

Promise.resolve().then(async () => {
  await uploadProductsToErli()
})
