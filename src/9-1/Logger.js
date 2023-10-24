export const LoggingLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

export default class Logger {
  constructor(strategy) {
    this.strategy = strategy
  }

  debug(...args) {
    this.strategy.write(LoggingLevels.DEBUG, ...args)
  }

  info(...args) {
    this.strategy.write(LoggingLevels.INFO, ...args)
  }

  warn(...args) {
    this.strategy.write(LoggingLevels.WARN, ...args)
  }

  error(...args) {
    this.strategy.write(LoggingLevels.ERROR, ...args)
  }
}
