import { XMLVariantSet } from '../types/xml'
import { Attribute, VariantGroupRequest } from '../types/erli'
import packToArray from '../helpers/packToArray'
import logger from '../logger'

const mapVariantGroup = (
  variantSet: XMLVariantSet | undefined,
  attributes: Attribute[],
): VariantGroupRequest | undefined => {
  if (!variantSet) {
    return
  }
  const parameterIds: string[] = packToArray(variantSet.parameterids)

  const useThumbnail = variantSet.usethumbnail === 'true'

  if (!parameterIds.length && !useThumbnail) {
    return
  }

  const parameters: VariantGroupRequest['attributes'] = []

  if (useThumbnail) {
    parameters.push('thumbnail')
  }

  for (const parameterId of parameterIds) {
    const attribute = attributes.find((attr) => attr.id === parameterId)

    if (!attribute) {
      logger.error('Attribute not found in product')
      continue
    }

    parameters.push(attribute.index!)
  }

  return {
    id: variantSet.id,
    source: 'integration',
    attributes: parameters,
  }
}

export default mapVariantGroup
