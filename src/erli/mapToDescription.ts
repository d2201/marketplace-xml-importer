import { ProductCreate } from '../types/erli'
import { XMLItem } from '../types/xml'
import packToArray from '../helpers/packToArray'

const mapToDescription = (desc: XMLItem['description']): Required<ProductCreate>['description'] => {
  const descriptionWithSections = packToArray(desc)

  return {
    sections: descriptionWithSections.map((section) => ({
      items: packToArray(section).map((item) => {
        if (item.type === 'IMAGE') {
          return item
        }

        const fixedContent = item.content.trim().replace(/>\s+</g, '><')

        return {
          type: 'TEXT',
          content: fixedContent,
        }
      }),
    })),
  }
}

export default mapToDescription
