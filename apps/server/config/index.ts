const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const getNumber = (value: any, defaultValue: number) =>
  value !== undefined && !isNaN(Number(value)) ? Number(value) : defaultValue;

export default {
  /** Порт для сервера */
  PORT: getNumber(process.env.PORT, 3655),
  /** Https порт для сервера */
  HTTPS_PORT: getNumber(process.env.HTTPS_PORT, 3654),
  /** Полный путь к папке для базы данных с json файлами */
  FILES_PATH: process.env.FILES_PATH || '/var/lib/gdmn-mob_db',
  /** Путь к папке для логов */
  LOG_PATH: process.env.LOG_PATH || './logs',
  /** Путь файла логирования ошибок относительно пути сервера*/
  LOG_ERROR_PATH: process.env.LOG_ERROR_PATH || './logs/error.log',
  /** Путь файла логирования запросов к серверу относительно пути сервера*/
  LOG_ACCESS_PATH: process.env.LOG_ACCESS_PATH || './logs/access.log',
  /** Путь файла, содержащий комбинированные логи, относительно пути сервера*/
  LOG_COMBINED_PATH: process.env.LOG_COMBINED_PATH || './logs/combined.log',
  /** Количество раундов хеширования*/
  SALT_ROUND: getNumber(process.env.SALT_ROUND, 10),
  /** Максимальное количество файлов при обработки сообщений в процессах */
  PROCESS_MAX_FILES: getNumber(process.env.PROCESS_MAX_FILES, 10),
  /** Максимальный объем файла при обработки сообщений в процесса, в мегабайтах */
  PROCESS_MAX_DATA_VOLUME: getNumber(process.env.PROCESS_MAX_DATA_VOLUME, 20),
  /** Период проверки процессов, в минутах */
  PROCESS_CHECK_PERIOD_IN_MIN: getNumber(process.env.PROCESS_CHECK_PERIOD_IN_MIN, 10),
  /** Количество дней действия кода активации */
  ACTIVE_CODE_DAYS: getNumber(process.env.ACTIVE_CODE_DAYS, 7),
  /**максимальное количество записей в журнале ошибок устройства*/
  DEVICE_LOG_MAX_LINES: getNumber(process.env.DEVICE_LOG_MAX_LINES, 1000),
  /** Период проверки файлов, в днях */
  FILES_CHECK_PERIOD_IN_DAYS: getNumber(process.env.FILES_CHECK_PERIOD_IN_DAYS, 7),
  /** Максимальный объем файла при обработки сообщений, в мегабайтах */
  MAX_DATA_VOLUME: getNumber(process.env.MAX_DATA_VOLUME, 100),
};
