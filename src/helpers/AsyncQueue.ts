import ControlledPromise from './ControlledPromise'

export default class AsyncQueue<Item> {
  private queue: Item[] = []

  private promise = new ControlledPromise()

  private finished = false

  public push(item: Item) {
    this.queue.push(item)

    if (this.promise.state === 'pending') {
      this.promise.resolve()
    }
  }

  public get size(): number {
    return this.queue.length
  }

  public finish() {
    this.finished = true
    this.promise.resolve()
  }

  /**
   * Modifies the queue
   */
  public async fetch(): Promise<Item | undefined> {
    if (!this.finished) {
      await this.promise.promise
    }

    const item = this.queue.shift()

    if (!this.queue.length) {
      this.promise = new ControlledPromise()
    }

    return item
  }
}
