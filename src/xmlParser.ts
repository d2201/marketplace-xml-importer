import fs from 'fs'
import flow from 'xml-flow'
import AsyncQueue from './helpers/AsyncQueue'

export default async function* parseXml<T>(
  iterableTag: string,
  fileName: string,
): AsyncIterableIterator<T> {
  const xmlFileStream = fs.createReadStream(fileName)
  const asyncQueue = new AsyncQueue<T>()
  const stream = flow(xmlFileStream)

  stream.on(`tag:${iterableTag}`, (item) => {
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

export const readFileType = (file: string): Promise<'offer'> =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(file)
    const stream = flow(fileStream)

    stream.on('tag:type', (item) => {
      resolve(item.$cdata)
      fileStream.close()
    })
  })
