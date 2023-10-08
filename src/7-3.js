import http from 'http'

// revealing constructor pattern
class Queue {
  constructor(executor) {
    const queue = []
    const pendingQueue = []
    function enqueue(item) {     
      if(pendingQueue.length !== 0) {
        const pending = pendingQueue.shift()
        pending(item)
      } else {
        queue.push(item)
      }
    }

    // X this.queue.dequeue = () => {
    // assert(queue.dequeue === Queue.prototype.dequeue)
    Queue.prototype.dequeue = () => {
      return new Promise((resolve) => {
        if(queue.length !== 0) {
          resolve(queue.shift())
        } else {
          pendingQueue.push(resolve)
        }
      })
    }

    executor(enqueue)
  }
}

const queue = new Queue((enqueue) => {
  const server = http.createServer((req, res) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      enqueue(data)
      res.end()
    })
  })
  server.listen(3000, () => {
    console.log('server started')
  })
})


function loop() {
  queue.dequeue().then(data => {
    console.log(data)
    setTimeout(loop, 3000)
  })

}

loop()

// client side: create some post request
//curl -X POST -d "This is the string you want to send" http://localhost:3000
