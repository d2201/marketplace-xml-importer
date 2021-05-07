export type XMLSchema = {
  source: string
  items: XMLItem[]
}

/**
 * @description
 * Can not do camelCase because sax emits it this way...
 */
export type XMLItem = {
  id: string
  name: string
  price: string
  stock: string
  description: SimpleOrArray<SimpleOrArray<DescriptionImageItem | DescriptionTextItem>>
  categoryid?: string
  attributes: SimpleOrArray<XMLAttribute>
  images: SimpleOrArray<string>
  delivery: { unit: 'hours' | 'days'; amount: string }
  externalid?: string
}

type DescriptionTextItem = {
  type: 'TEXT'
  content: string
}

type DescriptionImageItem = {
  type: 'IMAGE'
  url: string
}

export type XMLAttribute = {
  id: string
  rangevalue?: { from: string; to: string }
  values: SimpleOrArray<string>
  valuesids: SimpleOrArray<string>
}

/**
 * XML parser treats one element arrays as object!!
 */
export type SimpleOrArray<T> = Array<T> | T
