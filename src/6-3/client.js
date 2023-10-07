import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { connect } from 'net'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function multiplexChannels(sourcePaths, destination) {
  let openChannels = sourcePaths.length
  for (let i = 0; i < sourcePaths.length; i++) {
    const source = createReadStream(path.resolve(__dirname, sourcePaths[i]))
    let firstRead = true
    source
      .on('readable', function() {
        let chunk
        while ((chunk = this.read()) !== null) {
          let offset = 0
          const filename = Buffer.from(path.basename(sourcePaths[i]))
          const bufferLength =  firstRead ? 1 + 2 + filename.length + 4 + chunk.length : 1 + 4 + chunk.length
          const outBuff = Buffer.alloc(bufferLength)
          outBuff.writeUint8(i, offset++)
          if (firstRead) {
            firstRead = false
            outBuff.writeUint16BE(filename.length, offset)
            offset += 2
            filename.copy(outBuff, offset)
            offset += filename.length
          }
          outBuff.writeUint32BE(chunk.length, offset)
          offset += 4
          chunk.copy(outBuff, offset)
          console.log(`Sending packet to channel: ${i}`)
          destination.write(outBuff)
        }
      })
      .on('end', () => {
        console.log(`Closed channel: ${i}`)
        if (--openChannels === 0) {
          console.log('destination closed')
          destination.end()
        }
      })
      .on('error', err => {
        console.error(err)
      })
  }
}

const socket = connect(
  {
    host: process.argv[2],
    port: 3000,
  },
  () => {
    const sourcePaths = process.argv.slice(3)
    

    multiplexChannels(sourcePaths, socket)
  }
)
