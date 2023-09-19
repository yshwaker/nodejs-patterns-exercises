import { readdir, stat } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

function listNestedFiles(dir, cb) {
  const nestedFiles = []
  readdir(dir, (err, files) => {
    if (err) {
      if (err.code !== 'ENOTDIR') {
        return cb(err)
      }
      // file
      return cb(null, [path.basename(dir)])
    }
    // dir
    let asyncWorks = 0
    for (const file of files) {
      asyncWorks++
      listNestedFiles(path.join(dir, file), (err, nextFiles) => {
        if (err) {
          return cb(err)
        }
        nestedFiles.push(...nextFiles)
        if (--asyncWorks === 0) {
          return cb(null, nestedFiles)
        }
      })
    }
  })
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

listNestedFiles(__dirname, (err, files) => {
  if (err) {
    return console.log(err)
  }
  console.log(files)
})
