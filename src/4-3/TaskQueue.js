import { EventEmitter } from 'events'

export class TaskQueue extends EventEmitter {
  constructor(concurrency = 3) {
    super()
    this.queue = []
    this.concurrency = concurrency
    this.running = 0
  }

  addTask(task) {
    this.queue.push(task)
    process.nextTick(() => this.next())
    return this
  }

  next() {
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit('empty')
    }
    while(this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      this.running ++
      
      task((err) => {
        if (err) {
          this.emit('error', err)
        }
        this.running--
        
        process.nextTick(() => this.next())
      })
    }
  }
}
