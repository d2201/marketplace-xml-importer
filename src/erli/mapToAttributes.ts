import { Attribute, RangeAttribute, DictionaryAttribute, StringAttribute } from '../types/erli'
import { XMLItem, XMLAttribute } from '../types/xml'
import packToArray from '../helpers/packToArray'
import { Maybe } from '../types'

const mapToAttributes = (attrs: XMLItem['attributes']): Attribute[] => {
  const attributes = packToArray(attrs)

  return attributes.map(
    (attribute) =>
      toRangeAttribute(attribute) ||
      toDictionaryAttribute(attribute) ||
      toStringAttribute(attribute),
  )
}

export default mapToAttributes

const toRangeAttribute = (attribute: XMLAttribute): Maybe<RangeAttribute> => {
  if (!attribute.rangevalue) {
    return
  }

  return {
    type: 'range',
    id: attribute.id,
    values: {
      from: +attribute.rangevalue.from,
      to: +attribute.rangevalue.to,
    },
    source: 'allegro',
  }
}

const toDictionaryAttribute = (attribute: XMLAttribute): Maybe<DictionaryAttribute> => {
  if (!attribute.valuesids || !attribute.valuesids.length) {
    return
  }

  return {
    type: 'dictionary',
    id: attribute.id,
    source: 'allegro',
    values: packToArray(attribute.valuesids).map((id) => ({ id })),
  }
}

const toStringAttribute = (attribute: XMLAttribute): StringAttribute => ({
  type: 'string',
  id: attribute.id,
  source: 'allegro',
  values: packToArray(attribute.values),
})
