import Logger from './Logger.js'
import { ConsoleStrategy } from './ConsoleStrategy.js'
import { FileStrategy } from './FileStrategy.js'


const ConsoleLogger = new Logger(new ConsoleStrategy())
const FileLogger = new Logger(new FileStrategy('log.txt'))

ConsoleLogger.info('this is a info msg')
ConsoleLogger.error('this is an error')


FileLogger.info('this is a info msg')
FileLogger.error('this is an error')
