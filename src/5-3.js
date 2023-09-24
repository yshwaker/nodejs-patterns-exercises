class TaskQueuePC {
  constructor(concurrency = 3) {
    this.consumerQueue = []
    this.taskQueue = []

    for (let i = 0; i < concurrency; i++) {
      this.consumer()
    }
  }

  consumer() {
    return new Promise((resolve, reject) => {
      ;(function internalLoop() {
        this.getNextTask()
          .then((task) => task())
          .then(() => {
            internalLoop()
          })
          .catch((err) => {
            reject(err)
          })
      })()
    })
  }

  async getNextTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }
      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })


const taskQueue = new TaskQueuePC(2)
const addTask = (time, order) => {
  return () => timeout(time).then(() => console.log(order))
}

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
