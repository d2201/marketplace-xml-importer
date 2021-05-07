export default class ControlledPromise<T = void> {
  resolve!: (val: T) => void

  reject!: () => void

  promise: Promise<T>

  state: 'pending' | 'resolved' = 'pending'

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (val: T) => {
        this.state = 'resolved'

        resolve(val)
      }
      this.reject = reject
    })
  }
}
