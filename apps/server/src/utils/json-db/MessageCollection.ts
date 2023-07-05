/* eslint-disable no-underscore-dangle */
import fs, { readdir, access, stat } from 'fs/promises';

import { constants } from 'fs';

import path from 'path';

import { IFileMessageInfo, IAppSystemParams } from '@lib/types';

import { DataNotFoundException } from '../../exceptions/datanotfound.exception';

import { generateId } from '../helpers';

import config from '../../../config';

import { BYTES_PER_MB } from '../constants';

import { CollectionItem } from './CollectionItem';

const getRegExp = (isNewFormat: boolean): RegExp => {
  if (isNewFormat) return /(.+)_from_(.+)_to_(.+)_dev_(.+)__(.+)\.json/gi;
  return /(.+)_from_(.+)_to_(.+)_dev_(.+)\.json/gi;
};

/**
 *
 * @param fileName Имя файла без пути, но с расширением.
 * @returns
 */

export const messageFileName2params = (fileName: string): IFileMessageInfo => {
  const isNewFormat = fileName.includes('__');
  const re = getRegExp(isNewFormat);
  const match = re.exec(fileName);

  if (!match) {
    throw new Error(`Invalid message file name ${fileName}`);
  }

  return {
    id: match[1],
    producerId: match[2],
    consumerId: match[3],
    deviceId: match[4],
    commandType: isNewFormat ? match[5] : 'undefined',
  };
};

export const params2messageFileName = ({ id, producerId, consumerId, deviceId, commandType }: IFileMessageInfo) => {
  const commandtypestr = commandType !== 'undefined' ? `__${commandType}` : '';
  return `${id}_from_${producerId}_to_${consumerId}_dev_${deviceId}${commandtypestr}.json`;
};
/**
 * @template T
 */
class CollectionMessage<T extends CollectionItem> {
  private collectionPath: string;

  private static _setId<K extends CollectionItem>(obj: K): K {
    if (obj.id) {
      return obj;
    } else {
      return { ...obj, id: generateId() };
    }
  }

  constructor(pathDb: string) {
    this.collectionPath = pathDb;
  }

  public async getPath(folders: string[], fn = ''): Promise<string> {
    const folderPath = path.join(this.collectionPath, ...folders);
    await this._checkFileExists(folderPath);
    return path.join(folderPath, fn);
  }

  public async getPathSystem({ companyId, appSystemName }: IAppSystemParams) {
    return `db_${companyId}/${appSystemName}`;
  }

  public async getPathMessages(params: IAppSystemParams, fn = ''): Promise<string> {
    return await this.getPath([await this.getPathSystem(params), 'messages'], fn);
  }

  /**
   * Inserts an object into the file.
   */
  public async insert(obj: T, params: IAppSystemParams, fileInfo: IFileMessageInfo): Promise<string> {
    const initObject = obj.id ? obj : CollectionMessage._setId(obj);
    fileInfo.id = initObject.id as string;
    await this._save(initObject, params, fileInfo);
    return initObject.id as string;
  }
  /**
   * Returns every entry in the collection.
   */
  public async readByConsumerId(
    params: IAppSystemParams,
    consumerId: string,
    deviceId: string,
    maxDataVolume?: number,
    maxFiles?: number,
  ): Promise<Array<T>> {
    const filesInfoArr: IFileMessageInfo[] | undefined = await this._readDir(params, true);

    if (!filesInfoArr) return [];

    const fileInfo = filesInfoArr.filter((item) => item.consumerId === consumerId && item.deviceId === deviceId);

    const pr = fileInfo.map(async (item) => await this._get(await this._Obj2FullFileName(params, item)));

    const files = await Promise.all(pr);
    const sortedFiles = files.sort((a, b) => a.head.order - b.head.order);

    const limitDataVolume = maxDataVolume || config.MAX_DATA_VOLUME;
    const limitFiles = maxFiles || sortedFiles.length;

    let c = 0;
    let dataVolume = sortedFiles.length > 0 ? fileInfo.find((i) => i.id === sortedFiles[0].id)?.size || 0 : 0;

    for (; c < sortedFiles.length && c < limitFiles && dataVolume <= limitDataVolume; c++) {
      dataVolume += fileInfo.find((i) => i.id === sortedFiles[c].id)?.size || 0;
    }

    return sortedFiles.slice(0, c);
  }

  /**
   * Finds an item by id or using the specified predicate.
   */
  public async findById(params: IAppSystemParams, id: string): Promise<T | undefined> {
    const filesInfoArr = await this._readDir(params);
    const fileInfo = filesInfoArr.find((item: IFileMessageInfo) => item.id === id);
    if (!fileInfo) {
      throw new DataNotFoundException('Сообщение не найдено');
    }
    return await this._get(await this._Obj2FullFileName(params, fileInfo));
  }

  /**
   * Delete items by `id` or using a specified predicate.
   * Items for which the predicate returns true will be deleted.
   */
  public async deleteById(params: IAppSystemParams, id: string): Promise<void> {
    const filesInfoArr = await this._readDir(params);
    const fileInfo = filesInfoArr.find((item: IFileMessageInfo) => item.id === id);
    if (!fileInfo) {
      throw new DataNotFoundException('Сообщение не найдено');
    }
    return await this._delete(await this._Obj2FullFileName(params, fileInfo));
  }

  public async deleteAll(params: IAppSystemParams): Promise<void[]> {
    const filesInfoArr = await this._readDir(params);
    const pr = filesInfoArr.map(async (item) => {
      await this._delete(await this._Obj2FullFileName(params, item));
    });
    return Promise.all(pr);
  }

  private async _Obj2FullFileName(params: IAppSystemParams, messageInfo: IFileMessageInfo): Promise<string> {
    const filePath = await this.getPathMessages(params);
    return path.join(filePath, params2messageFileName(messageInfo));
  }

  private async _get(fileName: string): Promise<any> {
    try {
      const data = await fs.readFile(fileName, { encoding: 'utf8' });
      return JSON.parse(data);
    } catch (err) {
      throw new Error(`Ошибка чтения данных в файле ${fileName} - ${err}`);
    }
  }

  private async _save(data: T, params: IAppSystemParams, fileInfo: IFileMessageInfo): Promise<void> {
    try {
      const fileName = await this._Obj2FullFileName(params, fileInfo);
      return fs.writeFile(fileName, JSON.stringify(data), { encoding: 'utf8' });
    } catch (err) {
      throw new Error(`Ошибка записи данных в файл - ${err}`);
    }
  }

  private async _delete(fileName: string): Promise<void> {
    return fs.unlink(fileName);
  }

  private async _readDir(params: IAppSystemParams, withSize = false): Promise<IFileMessageInfo[]> {
    try {
      const filePath = await this.getPathMessages(params);
      const fileNames = await readdir(filePath);

      const fileParams = [];
      for (const fileName of fileNames) {
        fileParams.push({
          ...messageFileName2params(fileName),
          // eslint-disable-next-line no-await-in-loop
          size: withSize ? await this._getFileSizeInMB(path.join(filePath, fileName)) : undefined,
        });
      }

      return fileParams;
    } catch (err) {
      throw new Error(`Ошибка чтения папки ${this.collectionPath} - ${err}`);
    }
  }

  private async _checkFileExists(path: string): Promise<boolean> {
    try {
      await access(path, constants.R_OK | constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  private async _getFileSizeInMB(fileName: string): Promise<number> {
    try {
      const fileStat = await stat(fileName);
      return fileStat.size / BYTES_PER_MB;
    } catch (err) {
      throw new Error(`Ошибка получения размера файла ${fileName} - ${err}`);
    }
  }
}

export default CollectionMessage;
