import fs from 'fs'

export default async function runConcurrently<T>(
  queue: AsyncIterableIterator<T> | T[],
  threads: number,
  worker: (job: T) => Promise<void>,
): Promise<void> {
  const errorFile = fs.createWriteStream(`error_log_${Date.now()}.log`)

  let errorAppeared = false

  const promises = new Set<Promise<void>>()
  for await (const job of queue) {
    const promise = worker(job).catch((err) => {
      errorAppeared = true
      errorFile.write(`${JSON.stringify({ error: err, job })}\n`)
    })
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

  if (!errorAppeared) {
    await fs.promises.rm(errorFile.path)
  }
}
