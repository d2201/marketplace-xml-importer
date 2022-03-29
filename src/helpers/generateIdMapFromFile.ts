import { parseFile } from 'fast-csv'

const generateIdMapFromFile = async (filePath: string): Promise<Map<string, string>> => {
  const idMap = new Map<string, string>()

  for await (const row of parseFile(filePath, { headers: ['offerId', 'sku'], delimiter: ';' })) {
    idMap.set(row.offerId, row.sku)
  }

  return idMap
}

export default generateIdMapFromFile