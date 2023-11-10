import path from 'path';

import winston = require('winston');

import config from '../config';

import 'winston-daily-rotate-file';

const myMessage = winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);
const logErrorFileName = path.resolve(config.LOG_PATH, `./%DATE%-${path.basename(config.LOG_ERROR_PATH)}`);
const logECombinedFileName = path.resolve(config.LOG_PATH, `./%DATE%-${path.basename(config.LOG_COMBINED_PATH)}`);

const logger = winston.createLogger({
  exceptionHandlers: [
    new winston.transports.File({
      filename: `${config.LOG_ERROR_PATH}`,
    }),
  ],
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.align(),
    winston.format.timestamp(),
    myMessage,
  ),
  level: 'info',
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.DailyRotateFile({
      filename: logErrorFileName,
      level: 'error',
      maxSize: '20m',
      datePattern: 'YYYY-MM',
      maxFiles: 5,
    }),
    new winston.transports.DailyRotateFile({
      filename: logECombinedFileName,
      maxSize: '20m',
      datePattern: 'YYYY-MM',
      maxFiles: 1,
    }),
  ],
});

// If we're not in production then log to the `console` colorized
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.align(),
        winston.format.colorize(),
        winston.format.timestamp(),
        myMessage,
      ),
      handleExceptions: true,
      level: 'info',
    }),
  );
}

export default logger;
