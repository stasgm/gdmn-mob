import dev from './dev';
import prod from './prod';

const getNumber = (value: any, defaultValue: number) =>
  value !== undefined && !isNaN(Number(value)) ? Number(value) : defaultValue;

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config,
  /** Хост для сервера **/
  HOST: process.env.HOST || config.HOST,
  /** Порт для сервера */
  PORT: getNumber(process.env.PORT, config.PORT),
  /** Https порт для сервера */
  HTTPS_PORT: getNumber(process.env.HTTPS_PORT, config.HTTPS_PORT),
  /** Полный путь к папке для базы данных с json файлами */
  FILES_PATH: process.env.FILES_PATH || config.FILES_PATH,
};
