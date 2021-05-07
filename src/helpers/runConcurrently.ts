export default async function runConcurrently<T>(
  queue: AsyncIterableIterator<T> | T[],
  threads: number,
  worker: (job: T) => Promise<void>,
): Promise<void> {
  const promises = new Set<Promise<void>>()
  for await (const job of queue) {
    const promise = worker(job)
    promises.add(promise)
    promise.then(
      () => promises.delete(promise),
      () => undefined,
    )
    if (promises.size >= threads) {
      await Promise.race(promises)
    }
  }
  await Promise.all(promises)
}
