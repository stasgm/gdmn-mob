/* eslint-disable no-underscore-dangle */
import fs, { readdir, access } from 'fs/promises';

import { constants } from 'fs';

import path from 'path';

import { v1 as uuid } from 'uuid';

import { IFileMessageInfo, IAppSystemParams } from '@lib/types';

import { DataNotFoundException } from '../../exceptions/datanotfound.exception';

import { CollectionItem } from './CollectionItem';

/**
 *
 * @param fileName Имя файла без пути, но с расширением.
 * @returns
 */

export const messageFileName2params = (fileName: string): IFileMessageInfo => {
  const re = /(.+)_from_(.+)_to_(.+)\.json/gi;
  const match = re.exec(fileName);

  if (!match) {
    throw new Error(`Invalid message file name ${fileName}`);
  }

  return {
    id: match[1],
    producerId: match[2],
    consumerId: match[3],
  };
};

export const params2messageFileName = ({ id, producerId, consumerId }: IFileMessageInfo) =>
  `${id}_from_${producerId}_to_${consumerId}.json`;

/**
 * @template T
 */
class CollectionMessage<T extends CollectionItem> {
  private collectionPath: string;

  private static _setId<K extends CollectionItem>(obj: K): K {
    if (obj.id) {
      return obj;
    } else {
      return { ...obj, id: uuid() };
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
    return `DB_${companyId}/${appSystemName}`;
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
  public async readByConsumerId(params: IAppSystemParams, consumerId: string): Promise<Array<T>> {
    const filesInfoArr: IFileMessageInfo[] | undefined = await this._readDir(params);

    if (!filesInfoArr) return [];

    const fileInfo = filesInfoArr.filter((item) => item.consumerId === consumerId);

    const pr = fileInfo.map(async (item) => {
      return await this._get(await this._Obj2FullFileName(params, item));
    });

    return Promise.all(pr);
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

  private async _readDir(params: IAppSystemParams): Promise<IFileMessageInfo[]> {
    try {
      const filePath = await this.getPathMessages(params);
      return (await readdir(filePath)).map(messageFileName2params);
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
}

export default CollectionMessage;
