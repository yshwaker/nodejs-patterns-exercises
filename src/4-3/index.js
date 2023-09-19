import { readFile, readdir } from 'fs'
import path from 'path'
import { TaskQueue } from './TaskQueue.js'

function recursiveFind(dir, keyword, cb) {
  const matchedFiles = []
  const findTaskQueue = new TaskQueue()

  findTaskQueue.addTask((done) => {
    findTask(dir, keyword, findTaskQueue, matchedFiles, done)
  })

  findTaskQueue.on('err', (err) => cb(err))
  findTaskQueue.on('empty', () => cb(matchedFiles))
}

function findTask(dir, keyword, queue, matchedFiles, cb) {
  readdir(dir, (err, files) => {
    if (err) {
      if (err.code !== 'ENOTDIR') {
        return cb(err)
      }

      return readFile(dir, 'utf8', (err, content) => {
        if (err) {
          return cb(err)
        }
        if (content.includes(keyword)) {
          matchedFiles.push(dir)
        }
        return cb()
      })
    }

    // dir
    for (const file of files) {
      queue.addTask((done) => {
        findTask(path.join(dir, file), keyword, queue, matchedFiles, done)
      })
    }
    
    return cb()
  })
}

recursiveFind('.', 'path', console.log)
