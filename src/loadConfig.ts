import fs from 'fs'
import ini from 'ini'
import logger from './logger'

declare global {
  namespace NodeJS {
    interface Global {
      config: {
        erli: ErliConfig
        importer: ImporterConfig
      }
    }
  }
}

type ErliConfig = {
  apiUrl: string
  apiKey: string
}

type ImporterConfig = {
  filePath: string
}

try {
  const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'))
  global.config = config as any
} catch (e) {
  logger.error('You need to have config.ini file defined in your root folder.')
}

export {}
