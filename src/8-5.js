function createLazyBuffer(size) {
  let _buffer = null
  return new Proxy({}, {
    get(target, property) {
      if (_buffer) {
        // needs binding, otherwise internal method of buffer object will point to proxy causing errors
        return _buffer[property].bind(_buffer)
      }

      if (property === 'write') {
        return function(...args) {
          _buffer = Buffer.alloc(size)
          return _buffer[property](...args)
        }
      }

      throw new Error('The buffer should be written first')
    }
  })
}




const proxy = createLazyBuffer(1024)
try {
  console.log(proxy.length)
} catch(err) {
  console.error(err)
}
proxy.write('hello world', 0, 'utf8')

console.log(proxy.toString())
