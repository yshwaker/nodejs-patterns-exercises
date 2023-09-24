class TaskQueue {
  constructor(concurrency = 2) {
    this.queue = []
    this.running = 0
    this.concurrency = concurrency
  }

  runTask(task) {
    // return a promise, forwarding the result of task
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return task().then(resolve, reject)
      })
      process.nextTick(this.next.bind(this))
    })
  }

  async next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      this.running++

      try {
        await task()
      } finally {
        this.running--
        this.next()
      }
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })


const taskQueue = new TaskQueue(2)

taskQueue.runTask(() => timeout(1000)).then(() => {
  console.log(1)
})
taskQueue.runTask(() => timeout(500)).then(() => {
  console.log(2)
})
taskQueue.runTask(() => timeout(300)).then(() => {
  console.log(3)
})
taskQueue.runTask(() => timeout(400)).then(() => {
  console.log(4)
})

// 2 3 1 4
