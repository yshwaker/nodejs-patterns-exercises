import { EventEmitter } from 'events'
import { nextTick } from 'process'

function ticker(number, cb) {
  const instance = new EventEmitter()
  const now = Date.now()
  let count = 0

  if (number < 0) {
    nextTick(() => {
      const err = new Error('number must be positive')
      cb && cb(err)
      return instance.emit('error', err)
    })
    return instance
  }

  const tick = () => {
    const diff = Date.now() - now
    count ++
    if (diff % 5 === 0) {
      const err = new Error('timestamp is divisible by 5')
      cb && cb(err)
      instance.emit('error', err)
    }
    instance.emit('tick', `ticked ${count}, time passed in ms: ${diff}`)
    if (diff < number) {
      setTimeout(tick, 50)
    } else {
      cb && cb(null, count)
    }
  }

  nextTick(tick)

  return instance
}

ticker(1000, (err, count) => {
  if (err) {
    return
  }
  console.log(`count: ${count}`)
}).on('tick', (msg) => {
  console.log(msg)
}).on('error', (err) => {
  console.log('error:', err.message)
})
