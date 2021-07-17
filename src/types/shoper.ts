export type Auction = {
  product_id: string
  real_auction_id: number
}

type StringNumber = `${number}`

export type ShoperPaginatedResult<T> = {
  count: StringNumber
  pages: number
  page: number
  list: T[]
}
