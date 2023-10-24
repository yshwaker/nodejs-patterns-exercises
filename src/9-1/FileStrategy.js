import { LoggingStrategy } from "./LoggingStrategy.js";
import { LoggingLevels } from "./Logger.js";
import fs from 'node:fs/promises'

const NAME = {
  [LoggingLevels.DEBUG]: 'debug',
  [LoggingLevels.INFO]: 'info',
  [LoggingLevels.WARN]: 'warn',
  [LoggingLevels.ERROR]: 'error', 
}

export class FileStrategy extends LoggingStrategy {
  constructor(filename) {
    super()
    this.filename = filename
  }
  write(level, ...args) {
    fs.appendFile(this.filename, `${NAME[level]}: ${args.join(' ')}\n`).catch(err => {
      console.error(err)
    })
  }
}
