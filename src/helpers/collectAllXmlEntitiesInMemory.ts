import parseXml from '../xmlParser'
import runConcurrently from './runConcurrently'

const collectAllXmlEntitiesInMemory = async <T>(filePath: string): Promise<T[]> => {
  const items: T[] = []
  await runConcurrently(parseXml<T>('item', filePath), 20, async (item) => {
    items.push(item)
  })

  return items
}

export default collectAllXmlEntitiesInMemory
