Promise.myAll = (promises) => {
  const result = []
  let fulfilled = 0

  return new Promise((resolve, reject) => {
    for(let i = 0; i < promises.length; i++) {
      promises[i].then(res => {
        result[i] = res
        if(++fulfilled === promises.length) {
          resolve(result)    
        }
      }).catch(err => {
        reject(err)
      })
    }  
  })
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}

function delayReject(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('err: ' + ms)
    }, ms)
  })
}

await Promise.myAll([delay(1000), delay(2000)]).then((res) => {
  console.log(res)
})

await Promise.myAll([delayReject(1000), delay(2000)]).then((res) => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
