import dev from './dev';
import prod from './prod';

const getNumber = (value: any, defaultValue: number) =>
  value !== undefined && !isNaN(Number(value)) ? Number(value) : defaultValue;

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config,
  /** Локальный хост для сервера **/
  LOCALHOST: process.env.LOCALHOST || config.LOCALHOST,
  /** Порт для сервера */
  PORT: getNumber(process.env.PORT, config.PORT),
  /** Https порт для сервера */
  HTTPS_PORT: getNumber(process.env.HTTPS_PORT, config.HTTPS_PORT),
  /** Полный путь к папке для базы данных с json файлами */
  FILES_PATH: process.env.FILES_PATH || config.FILES_PATH,
  /** Путь к папке для логов */
  LOG_PATH: process.env.LOG_PATH || config.LOG_PATH,
  /** Путь файла логирования ошибок относительно пути сервера*/
  LOG_ERROR_PATH: process.env.LOG_ERROR_PATH || config.LOG_ERROR_PATH,
  /** Путь файла логирования запросов к серверу относительно пути сервера*/
  LOG_ACCESS_PATH: process.env.LOG_ACCESS_PATH || config.LOG_ACCESS_PATH,
  /** Путь файла, содержащий комбинированные логи, относительно пути сервера*/
  LOG_COMBINED_PATH: process.env.LOG_COMBINED_PATH || config.LOG_COMBINED_PATH,
  /** Количество раундов хеширования*/
  SALT_ROUND: getNumber(process.env.SALT_ROUND, config.SALT_ROUND),
  /** Максимальное количество файлов при обработки сообщений в процессах */
  PROCESS_MAX_FILES: getNumber(process.env.PROCESS_MAX_FILES, config.PROCESS_MAX_FILES),
  /** Максимальный объем файла при обработки сообщений в процесса, в мегабайтах */
  PROCESS_MAX_DATA_VOLUME: getNumber(process.env.PROCESS_MAX_DATA_VOLUME, config.PROCESS_MAX_DATA_VOLUME),
  /** Период проверки процессов, в минутах */
  PROCESS_CHECK_PERIOD_IN_MIN: getNumber(process.env.PROCESS_CHECK_PERIOD_IN_MIN, config.PROCESS_CHECK_PERIOD_IN_MIN),
  /** Количество дней действия кода активации */
  ACTIVE_CODE_DAYS: getNumber(process.env.ACTIVE_CODE_DAYS, config.ACTIVE_CODE_DAYS),
  /** Период проверки файлов, в днях */
  FILES_CHECK_PERIOD_IN_DAYS: getNumber(process.env.FILES_CHECK_PERIOD_IN_DAYS, config.FILES_CHECK_PERIOD_IN_DAYS),
  /** Максимальный объем файла при обработки сообщений, в мегабайтах */
  MAX_DATA_VOLUME: getNumber(process.env.MAX_DATA_VOLUME, config.MAX_DATA_VOLUME),
  /** Максимальное количество строк в логе устройств */
  DEVICE_LOG_MAX_LINES: getNumber(process.env.DEVICE_LOG_MAX_LINES, config.DEVICE_LOG_MAX_LINES),
  /** Период хранения файлов, в днях */
  FILES_SAVING_PERIOD_IN_DAYS: getNumber(process.env.FILES_SAVING_PERIOD_IN_DAYS, config.FILES_SAVING_PERIOD_IN_DAYS),
};
