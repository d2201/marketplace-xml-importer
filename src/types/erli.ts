export type ProductCreate = {
  name: string
  description?: { sections: Array<{ items: Array<TextSectionItem | ImageSectionItem> }> }
  ean?: string
  sku?: string
  externalReferences?: Array<string>
  importantFeatures?: Array<string>
  externalAttributes?: Array<Attribute>
  externalCategories?: Array<Category>
  externalVariantGroup?: VariantGroupRequest
  images: Array<{ url: string; isVariantImage?: boolean }>
  files?: Array<{ url: string }>
  price: number
  cataloguePrice?: number
  stock: number
  status?: 'active' | 'inactive'
  archived?: boolean
  dispatchTime: { unit: 'hour' | 'day' | 'month'; period: number }
  packaging?: { tags: Array<string>; weight: number }
  obligatoryIdentifier?: string
  voluntaryIdentifier?: string
  returnIdentifier?: string
  invoiceType?: 'vatInvoice' | 'vatInvoiceWithMarginScheme' | 'invoiceWithoutVat'
}

export type Attribute = NumberAttribute | RangeAttribute | DictionaryAttribute | StringAttribute

type TextSectionItem = {
  type: 'TEXT'
  content: string
}

type ImageSectionItem = {
  type: 'IMAGE'
  url: string
}

export type NumberAttribute = {
  id: number | string
  name?: string
  source?: Source
  type: 'number'
  index?: number
  values: Array<number>
  unit: string
}

export type RangeAttribute = {
  id: number | string
  name?: string
  source?: Source
  type: 'range'
  index?: number
  values: { from: number; to: number }
  unit?: string
}

export type DictionaryAttribute = {
  id: number | string
  name?: string
  source?: Source
  type: 'dictionary'
  values: Array<{ id: number | string; name?: string }>
}

export type StringAttribute = {
  id: number | string
  name?: string
  source?: Source
  type: 'string'
  index?: number
  values?: Array<string>
}

type Source = 'shop' | 'allegro' | 'marketplace'

type Category = {
  source?: Source
  breadcrumb: Array<{ id: number | string; name?: string }>
  index?: number
}

type VariantGroupRequest = {
  id: string
  source?: 'marketplace' | 'integration'
  attributes: Array<'thumbnail' | number>
}
