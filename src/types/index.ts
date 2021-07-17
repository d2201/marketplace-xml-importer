export type Maybe<T> = T | undefined

declare global {
  interface Array<T> {
    item: (index: number) => T | undefined
  }
}

Array.prototype.item = function (index: number) {
  const idx = index >= 0 ? index : this.length - Math.abs(index)

  return this[idx]
}
