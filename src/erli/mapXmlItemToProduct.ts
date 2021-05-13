import { XMLItem, XMLVariantSet, XMLShippingRate } from '../types/xml'
import { ProductCreate } from '../types/erli'
import packToArray from '../helpers/packToArray'
import mapToDescription from './mapToDescription'
import mapToAttributes from './mapToAttributes'
import mapVariantGroup from './mapVariantGroup'
import extractEanFromAttributes from './extractEanFromAttributes'

const mapXmlItemToProduct = (
  item: XMLItem,
  variantSets: XMLVariantSet[],
  shippingRates: XMLShippingRate[],
): ProductCreate => {
  const attributes = mapToAttributes(item.attributes)

  const variantSet = variantSets.find((set) =>
    packToArray(set.productids).some((productId) => item.id === productId),
  )
  const priceListTag = item.shippingrateid
    ? shippingRates.find((rate) => rate.id === item.shippingrateid)
    : undefined

  return {
    name: item.name,
    images: packToArray(item.images).map((imageUrl) => ({ url: imageUrl })),
    price: Math.floor(+item.price * 100),
    stock: +item.stock,
    externalReferences: [`allegro:${item.id}`],
    dispatchTime: optimizeDelivery(item.delivery),
    packaging: { tags: [priceListTag?.name ?? '*'] },
    description: mapToDescription(item.description),
    externalAttributes: attributes,
    externalVariantGroup: mapVariantGroup(variantSet, attributes),
    externalCategories: item.categoryid
      ? [{ source: 'allegro', breadcrumb: [{ id: item.categoryid }] }]
      : undefined,
    ean: extractEanFromAttributes(item.attributes),
    sku: item.externalid?.slice(0, 50),
  }
}

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
