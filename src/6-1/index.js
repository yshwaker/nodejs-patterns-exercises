import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'
import { createReadStream, createWriteStream } from 'node:fs'
import { PassThrough, pipeline } from 'node:stream'
import { fileURLToPath } from 'url'
import path from 'path'
import { performance } from 'node:perf_hooks'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const streams = {
  brotli: createBrotliCompress,
  gzip: createGzip,
  deflate: createDeflate,
}

function checkPerformance(type, compressMethod) {
  let startTime
  let endTime
  let beforeSize = 0
  let afterSize = 0

  function startTimer() {
    const stream = new PassThrough()
    stream.once('data', () => {
      startTime = performance.now()
    })

    return stream
  }

  function endTimer() {
    const stream = new PassThrough()
    stream.once('finish', () => {
      endTime = performance.now()
    })

    return stream
  }

  function measureSize(isBefore) {
    const stream = new PassThrough()
    stream.on('data', (chunk) => {
      isBefore ? (beforeSize += chunk.length) : (afterSize += chunk.length)
    })

    return stream
  }

  function done(err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(
      `Compressing ${filename} with ${type} takes ${
        (endTime - startTime).toFixed(2)
      }ms, compression rate is ${((afterSize / beforeSize) * 100).toFixed(2)}%`
    )
  }

  const filename = process.argv[2]
  const inputStream = createReadStream(path.resolve(__dirname, filename))

  pipeline(
    inputStream,
    measureSize(true),
    startTimer(),
    compressMethod(),
    endTimer(),
    measureSize(false),
    done
  )
}

for (const type of ['brotli', 'gzip', 'deflate']) {
  checkPerformance(type, streams[type])
}
