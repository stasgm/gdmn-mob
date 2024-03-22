/* eslint-disable no-await-in-loop */
import { access } from 'fs/promises';
import { ReadStream, WriteStream, constants, createReadStream, createWriteStream } from 'fs';

import { once } from 'events';

import { finished } from 'stream';

import { promisify } from 'util';

import { BYTES_PER_MB, defMaxFilesSize } from '../utils/constants';

export const checkFileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

export const readFileByChunks = async (
  fileName: string,
  isJson = false,
  start?: number,
  end?: number,
): Promise<string> => {
  let streamRead: ReadStream | undefined;
  const data: Buffer[] = [];
  let size = 0;
  let isFirstChunk = true;

  try {
    streamRead = createReadStream(fileName, { encoding: 'utf8', start, end });

    for await (const chunk of streamRead) {
      const chunkString = chunk.toString();
      data.push(chunkString);

      if (isJson && isFirstChunk && chunkString[0] !== '{' && chunkString[0] !== '[') {
        throw new Error('Неправильный формат файла');
      }
      isFirstChunk = false;

      size += Buffer.byteLength(chunkString) / BYTES_PER_MB;

      if (size > defMaxFilesSize) {
        throw new Error('Слишком большой размер файла');
      }
    }

    return data.join('');
  } finally {
    if (streamRead) {
      streamRead.destroy();
    }
  }
};

export const searchTextInFile = async (
  fileName: string,
  searchString: string,
  start?: number,
  end?: number,
): Promise<boolean> => {
  const check = await checkFileExists(fileName);
  if (!check) return false;

  let streamRead: ReadStream | undefined = undefined;

  try {
    streamRead = createReadStream(fileName, { encoding: 'utf8', start, end });
    let data = '';

    for await (const chunk of streamRead) {
      data += chunk;

      if (data.toLowerCase().includes(searchString.toLowerCase())) {
        return true;
      }
    }

    return false;
    // } catch (err) {
    //   throw new Error(`Ошибка поиска текста в файле ${fileName} - ${err} `);
  } finally {
    if (streamRead) {
      streamRead.destroy();
    }
  }
};

const finishedPromisify = promisify(finished);

/**
 * Запись текста в файл с использованием потока
 * @param filename
 * @param iterable
 * @param options
 */
export const writeFileByChunks = async (
  filename: string,
  iterable: string,
  options: any = { encoding: 'utf8', flag: 'a' },
): Promise<void> => {
  const writable: WriteStream = createWriteStream(filename, options);

  try {
    for await (const chunk of iterable) {
      if (!writable.write(chunk)) {
        await once(writable, 'drain');
      }
    }
    // } catch (error) {
    //   throw new Error(`Ошибка при записи файла ${filename} - ${error}`);
  } finally {
    writable.end();
    await finishedPromisify(writable);
  }
};
