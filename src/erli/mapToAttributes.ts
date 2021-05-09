import { Attribute, RangeAttribute, DictionaryAttribute, StringAttribute } from '../types/erli'
import { XMLItem, XMLAttribute } from '../types/xml'
import packToArray from '../helpers/packToArray'
import { Maybe } from '../types'

const mapToAttributes = (attrs: XMLItem['attributes']): Attribute[] => {
  const attributes = packToArray(attrs)

  return attributes.map(
    (attribute, index) =>
      toRangeAttribute(attribute, index) ||
      toDictionaryAttribute(attribute, index) ||
      toStringAttribute(attribute, index),
  )
}

export default mapToAttributes

const toRangeAttribute = (attribute: XMLAttribute, index: number): Maybe<RangeAttribute> => {
  if (!attribute.rangevalue) {
    return
  }

  return {
    type: 'range',
    id: attribute.id,
    index,
    values: {
      from: +attribute.rangevalue.from,
      to: +attribute.rangevalue.to,
    },
    source: 'allegro',
  }
}

const toDictionaryAttribute = (
  attribute: XMLAttribute,
  index: number,
): Maybe<DictionaryAttribute> => {
  if (!attribute.valuesids || !attribute.valuesids.length) {
    return
  }

  return {
    type: 'dictionary',
    id: attribute.id,
    index,
    source: 'allegro',
    values: packToArray(attribute.valuesids).map((id) => ({ id })),
  }
}

const toStringAttribute = (attribute: XMLAttribute, index: number): StringAttribute => ({
  type: 'string',
  id: attribute.id,
  source: 'allegro',
  index,
  values: packToArray(attribute.values),
})
