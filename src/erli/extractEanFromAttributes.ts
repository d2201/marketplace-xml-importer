import { XMLAttribute, SimpleOrArray } from '../types/xml'
import packToArray from '../helpers/packToArray'

const extractEanFromAttributes = (attributes: SimpleOrArray<XMLAttribute>): string | undefined => {
  const eanAttribute = packToArray(attributes).find((attr) => attr.id === '225693')

  return eanAttribute?.values ? `${eanAttribute.values}` : undefined
}

export default extractEanFromAttributes
