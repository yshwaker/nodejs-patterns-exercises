import { LoggingStrategy } from "./LoggingStrategy.js";
import { LoggingLevels } from "./Logger.js";

const METHODS = {
  [LoggingLevels.DEBUG]: console.debug,
  [LoggingLevels.INFO]: console.info,
  [LoggingLevels.WARN]: console.warn,
  [LoggingLevels.ERROR]: console.error, 
}

export class ConsoleStrategy extends LoggingStrategy {
  write(level, ...args) {
    METHODS[level](...args)
  }
}
