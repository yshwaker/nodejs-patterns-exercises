function mapAsync(iterable, callback, concurrency) {
  let running = 0
  const queue = []
  let i = 0

  function runTask(task) {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        return Promise.resolve(task()).then(resolve, reject)
      })
      process.nextTick(next.bind(this))
    })
  }

  async function next() {
    while(queue.length > 0 && running < concurrency) {
      running ++
      const task = queue.shift()
      await task()
      running --
      next()
    }
  }

  return Promise.all(iterable.map((v, i, arr) => runTask(() => callback(v, i, arr))))
}

const delay = (time, value) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(value)
      resolve(value)
    }, time)
  })

const arr = [0, 1000, 5000]
mapAsync(arr, (v, i) => delay(v, i), 2).then((res) => {
  console.log(res)
})
