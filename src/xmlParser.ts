import fs from 'fs'
import flow from 'xml-flow'
import { XMLItem } from './types/xml'
import AsyncQueue from './helpers/AsyncQueue'

export default async function* getAllXMLItems(fileName: string): AsyncIterableIterator<XMLItem> {
  const xmlFileStream = fs.createReadStream(fileName)
  const asyncQueue = new AsyncQueue<XMLItem>()
  const stream = flow(xmlFileStream)

  stream.on('tag:item', (item) => {
    asyncQueue.push(item)
  })

  stream.on('end', () => {
    asyncQueue.finish()
  })

  let item = await asyncQueue.fetch()

  while (item) {
    yield item
    item = await asyncQueue.fetch()
  }
}
