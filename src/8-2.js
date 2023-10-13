function createEnhancedConsole(console) {
  return new Proxy(console, {
    get(target, property) {
      if(['log', 'error', 'debug', 'info'].includes(property)) {
        return function(...args) {
          target[property](new Date(), ...args)
        }
      }
    }
  })
}

const enhanced = createEnhancedConsole(console)

console.log('hello')
enhanced.log('hello')
console.error('err')
enhanced.error('err')
