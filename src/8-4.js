function createFSAdaptor(memory) {
  return {
    readFile(filename, options, callback) {
      if (typeof options === 'function') {
        callback = options
      }

      process.nextTick(() => {
        const content = memory.get(filename)
        if (content === undefined) {
          const err = new Error(`ENOENT, open ${filename}`)
          err.code = 'ENOENT'
          err.errno = 34
          err.path = filename
          return callback && callback(err)
        }

        callback && callback(null, content)
      })
    },
    writeFile(filename, contents, options, callback) {
      if (typeof options === 'function') {
        callback = options
      }

      process.nextTick(() => {
        const prevContent = memory.get(filename) ?? ''
        memory.set(filename, prevContent + contents)

        callback && callback(null, true)
      })
    }
  }
}

const map = new Map()

const fs = createFSAdaptor(map)

fs.writeFile('hello.txt', 'hello world', (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('finished writting')
})

fs.readFile('hello.txt', (err, contents) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('finished reading:', contents)
})

