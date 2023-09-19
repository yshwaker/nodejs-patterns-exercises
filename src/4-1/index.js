import { readFile, appendFile} from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function concatFiles (cb, dest, ...srcFiles) {
  if (srcFiles.length === 0) {
    return process.nextTick(cb)
  }

  function iterate(index) {
    if (index === srcFiles.length) {
      return cb()
    }
  
    readFile(srcFiles[index], 'utf8', (err, content) => {
      
  
      if (err) {
        return cb(err)
      }
      
      appendFile(dest, content, (err) => {
        if (err) {
          return cb(err)
        }
        iterate(index + 1)
      })
    })
  }

  iterate(0)
}

concatFiles((err) => {
  if (err) {
    return console.log(err)
  }
  console.log('done')
}, path.join(__dirname, 'dest.txt'), path.join(__dirname, 'fileA.txt'), path.join(__dirname, 'fileB.txt'))

