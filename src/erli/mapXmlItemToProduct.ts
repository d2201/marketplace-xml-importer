import { XMLItem } from '../types/xml'
import { ProductCreate } from '../types/erli'
import packToArray from '../helpers/packToArray'
import mapToDescription from './mapToDescription'
import mapToAttributes from './mapToAttributes'

const mapXmlItemToProduct = (item: XMLItem): ProductCreate => ({
  name: item.name,
  images: packToArray(item.images).map((imageUrl) => ({ url: imageUrl })),
  price: Math.floor(+item.price * 100),
  stock: +item.stock,
  externalReferences: [`allegro:${item.id}`],
  dispatchTime: optimizeDelivery(item.delivery),
  description: mapToDescription(item.description),
  externalAttributes: mapToAttributes(item.attributes),
  externalCategories: item.categoryid
    ? [{ source: 'allegro', breadcrumb: [{ id: item.categoryid }] }]
    : undefined,
})

export default mapXmlItemToProduct

const optimizeDelivery = (delivery: XMLItem['delivery']): ProductCreate['dispatchTime'] => {
  const amount = +delivery.amount
  if (delivery.unit === 'hours' && amount > 24) {
    return { unit: 'day', period: Math.ceil(amount / 24) }
  }
  if (delivery.unit === 'hours') {
    return { unit: 'hour', period: amount }
  }
  return { unit: 'day', period: amount }
}
