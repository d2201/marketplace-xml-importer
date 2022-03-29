import { XMLItem } from '../types/xml'
import { ProductUpdate } from '../types/erli'
import mapToDescription from './mapToDescription'
import packToArray from '../helpers/packToArray'

const mapXmlItemToProduct = (
  item: XMLItem,
): ProductUpdate => {
  return {
    description: mapToDescription(item.description),
    images: packToArray(item.images).map(image => ({ url: image })),
    overrideFrozen: true,
    frozen: { description: true, images: true }
  }
}

export default mapXmlItemToProduct

