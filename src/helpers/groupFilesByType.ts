import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { readFileType } from '../xmlParser'

const groupFilesByType = async () => {
  const files = await fs.promises.readdir(global.config.importer.directory)

  const xmlFiles = files.filter((file) => file.endsWith('.xml'))

  const withTypes: Array<{ file: string; type: string }> = await Promise.all(
    xmlFiles.map(async (file) => {
      const filePath = path.join(global.config.importer.directory, file)

      const type = await readFileType(filePath)

      return {
        file: filePath,
        type,
      }
    }),
  )

  return _.groupBy(withTypes, 'type')
}

export default groupFilesByType
