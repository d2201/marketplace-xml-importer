import { SimpleOrArray } from '../types/xml'

const packToArray = <T>(value: SimpleOrArray<T>): Array<T> => {
  if (Array.isArray(value)) {
    return value
  }
  if (value !== undefined) {
    return [value]
  }
  return []
}

export default packToArray
