import { createServer } from 'net'
import { createWriteStream } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


function demultiplexChannel(source) {
  let currentChannel = null
  let currentLength = null
  let filenameLength = null
  let filename = null
  const writeStreams = []
  source.on('readable', () => {
    let chunk
    if (currentChannel === null) {
      chunk = source.read(1)
      currentChannel = chunk && chunk.readUInt8(0)
    }

    if (!writeStreams[currentChannel]) {
      if (filenameLength === null) {
        chunk = source.read(2)
        filenameLength = chunk && chunk.readUint16BE(0)
        if (filenameLength === null) {
          return null
        }
      }
      chunk = source.read(filenameLength)
      if (chunk === null) {
        return null
      }
      filename = chunk.toString()
      
      const dir = path.join(__dirname, 'uploaded')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true})
      }
      writeStreams[currentChannel] = createWriteStream(path.join(__dirname, 'uploaded', filename))
    }

    if (currentLength === null) {
      chunk = source.read(4)
      currentLength = chunk && chunk.readUint32BE(0)
      if (currentLength === null) {
        return null
      }
    }

    // data chunk
    chunk = source.read(currentLength)
    if (chunk === null) {
      return null
    }

    console.log(`Received packet from: ${currentChannel}`)
    writeStreams[currentChannel].write(chunk)

    currentChannel = null
    currentLength = null
    filenameLength = null
    filename = null
  })
  .on('end', () => {
    writeStreams.forEach(stream => stream.end())
    console.log('Source channel closed')
  })
}

const server = createServer(socket => {
  demultiplexChannel(socket)
})

server.listen(3000, () => console.log('Server started'))
