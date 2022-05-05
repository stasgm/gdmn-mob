/* eslint-disable no-underscore-dangle */
import fs, { readdir, access } from 'fs/promises';

import { constants } from 'fs';

import path from 'path';

import { assoc } from 'ramda';
import { v1 as uuid } from 'uuid';

import { IFileMessageInfo } from '@lib/types';

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
    producer: match[2],
    consumer: match[3],
  };
};

export const params2messageFileName = ({ id, producer, consumer }: IFileMessageInfo) =>
  `${id}_from_${producer}_to_${consumer}.json`;

/**
 * @template T
 */
class CollectionMessage<T extends CollectionItem> {
  filter() {
    throw new Error('Method not implemented.');
  }

  private collectionPath: string;

  private static _initObject<K extends CollectionItem>(obj: K): K {
    return assoc('id', uuid(), obj) as K;
  }

  constructor(pathDb: string) {
    this.collectionPath = pathDb;
    // this._ensureStorage();
  }

  /**
   * Inserts an object into the file.
   */
  public async insert(obj: T, fileInfo: IFileMessageInfo): Promise<string> {
    const initObject = obj.id ? obj : CollectionMessage._initObject(obj);
    fileInfo.id = initObject.id as string;
    await this._save(initObject, fileInfo);
    return initObject.id as string;
  }
  /**
   * Returns every entry in the collection.
   */
  public async read(): Promise<Array<T>>;

  public async read(predicate: (item: IFileMessageInfo) => boolean): Promise<Array<T>>;

  public async read(predicate?: (item: IFileMessageInfo) => boolean): Promise<Array<T>> {
    const filesInfoArr: IFileMessageInfo[] | undefined = await this._readDir();
    if (!filesInfoArr) return [];
    const fileInfo = typeof predicate === 'undefined' ? filesInfoArr : filesInfoArr.filter(predicate);
    const pr = fileInfo.map(async (item) => {
      return await this._get(this._Obj2FullFileName(item));
    });
    return Promise.all(pr);
  }

  /**
   * Finds an item by id or using the specified predicate.
   */
  public async find(id: string): Promise<T>;

  public async find(predicate: (item: IFileMessageInfo) => boolean): Promise<T>;

  public async find(id: string | ((item: IFileMessageInfo) => boolean)): Promise<T> {
    const predicate = typeof id === 'function' ? id : (item: IFileMessageInfo) => item.id === id;
    try {
      const filesInfoArr = await this._readDir();
      try {
        const fileInfo = filesInfoArr.find(predicate);
        if (!fileInfo) {
          throw new DataNotFoundException('Сообщение не найдено');
        }
        return await this._get(this._Obj2FullFileName(fileInfo));
      } catch (err) {
        throw new DataNotFoundException(err as string);
      }
    } catch (err) {
      throw new DataNotFoundException(err as string);
    }
  }

  /**
   * Delete items by `id` or using a specified predicate.
   * Items for which the predicate returns true will be deleted.
   */
  public async delete(id: string): Promise<void>;

  public async delete(predicate: (item: IFileMessageInfo) => boolean): Promise<void>;

  public async delete(id: string | ((item: IFileMessageInfo) => boolean)) {
    const predicate = typeof id === 'function' ? id : (item: IFileMessageInfo) => item.id === id;
    try {
      const filesInfoArr = await this._readDir();
      try {
        const fileInfo = filesInfoArr.find(predicate);
        if (!fileInfo) {
          throw new DataNotFoundException('Сообщение не найдено');
        }
        return await this._delete(this._Obj2FullFileName(fileInfo));
      } catch (err) {
        throw new DataNotFoundException(err as string);
      }
    } catch (err) {
      throw new DataNotFoundException(err as string);
    }
  }

  public async deleteAll(): Promise<void[]> {
    const filesInfoArr = await this._readDir();
    const pr = filesInfoArr.map(async (item) => {
      await this._delete(this._Obj2FullFileName(item));
    });
    return Promise.all(pr);
  }

  public async setCollectionPath(newPath: string): Promise<void> {
    if (!this._checkFileExists(newPath)) await fs.mkdir(newPath, { recursive: true });
    this.collectionPath = newPath;
  }

  /* private async _ensureStorage() {
    const check: boolean = await this._checkFileExists(this.collectionPath);
    if (!check) await fs.mkdir(this.collectionPath, { recursive: true });
  }*/

  private _Obj2FullFileName(params: IFileMessageInfo): string {
    return path.join(this.collectionPath, params2messageFileName(params));
  }

  private async _get(fileName: string): Promise<T> {
    try {
      const data = await fs.readFile(fileName, { encoding: 'utf8' });
      return JSON.parse(data);
    } catch (err) {
      throw new DataNotFoundException(`Ошибка чтения данных в файле ${fileName} - ${err}`);
    }
  }

  private async _save(data: T, fileInfo: IFileMessageInfo): Promise<void> {
    const fileName = this._Obj2FullFileName(fileInfo);
    try {
      return fs.writeFile(fileName, JSON.stringify(data), { encoding: 'utf8' });
    } catch (err) {
      throw new DataNotFoundException(`Ошибка записи в файл ${err}`);
    }
  }

  private async _delete(fileName: string): Promise<void> {
    try {
      return fs.unlink(fileName);
    } catch (err) {
      throw new DataNotFoundException(`Ошибка удаления файла ${err}`);
    }
  }

  private async _readDir(): Promise<IFileMessageInfo[]> {
    try {
      return (await readdir(this.collectionPath)).map(messageFileName2params);
    } catch (err) {
      throw new DataNotFoundException(`Ошибка чтения папки ${this.collectionPath} - ${err}`);
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
