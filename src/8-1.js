import ky from 'ky'

function createKyWithCache(httpClient) {
  const cache = new Map()
  return new Proxy(httpClient, {
    get: (target, property) => {
      if (property === 'get' || property === 'head') {
        return function(url, options) {
          const key = url + property
          if (cache.has(key)) {
            return cache.get(key)
          }

          const request = target[property](url, options)
          cache.set(key, request)
          return request
        }
      }

      return target[property]
    }
  })
}

const proxy = createKyWithCache(ky)

let prev = performance.now()
const result = await proxy.get('https://www.google.com/')
console.log('first fetch:', performance.now() - prev)

prev = performance.now()
const result2 = await proxy.get('https://www.google.com/')
console.log('second fetch:', performance.now() - prev)
console.log(result === result2)



