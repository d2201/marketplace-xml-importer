# Marketplace XML importer

Supported marketplaces:

- [x] Erli
- [ ] Allegro
- [ ] Amazon

## Requirements

- node `v14.15.1+`
- yarn `v1.21.1+`

## Usage

- Run `yarn` to install the packages
- Create `config.ini` based on `config.example.ini`
- Copy `.xml` file into root directory of this tool.
- Run `yarn build`
- Run `yarn start` 
- Import should start :)

## Changing default field to use as externalId

In `src/index.ts` there is usage of `sdk.createProduct` method - there we define which field from the XML file we want to use as externalId in Erli.

Fields you can use (definition in: `types/xml.ts`)
```ts
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
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0)