import { EventEmitter } from 'events'
import { nextTick } from 'process'

function ticker(number, cb) {
  const instance = new EventEmitter()
  const now = performance.now()
  let count = 0

  if (number < 0) {
    nextTick(() => {
      const err = new Error('number must be positive')
      cb && cb(err)
      return instance.emit('error', err)
    })
    return instance
  }

  nextTick(() => instance.emit('tick', 'start ticking'))

  const tick = () => {
    count ++
    const diff = performance.now() - now
    if (diff < number) {
      instance.emit('tick', `ticked ${count}`)
      setTimeout(tick, 50)
    } else {
      cb && cb(null, count)
    }
  }

  setTimeout(tick, 50)

  return instance
}

ticker(454, (err, count) => {
  if (err) {
    return
  }
  console.log(`count: ${count}`)
}).on('tick', (msg) => {
  console.log(msg)
}).on('error', (err) => {
  console.log('error:', err.message)
})
