/* eslint-disable no-underscore-dangle */
import { readFile, writeFile, access } from 'fs/promises';
import { constants } from 'fs';

import { INamedEntity } from '@lib/types';

import { generateId } from '../helpers';

import { CollectionItem } from './CollectionItem';

// export type NamedDBEntities = Collection<Extract<ExtractTypes<DBType[keyof DBType]>, INamedEntity>>;
// export type NamedDBEntities = Collection<Extract<T, INamedEntity>>;

/**
 * Массив объектов, который хранится в JSON файле на диске.
 * Считывается один раз и находится в оперативной памяти.
 * После изменения пишется на диск.
 * @template T
 */
export class Collection<T extends CollectionItem> {
  private _fullFileName: string;
  private _data: T[];
  private _currWrite: Promise<void>;

  private static _setId<K extends CollectionItem>(obj: K): K {
    if (obj.id) {
      return obj;
    } else {
      return { ...obj, id: generateId() };
    }
  }

  constructor(path: string) {
    this._fullFileName = path;
    this._data = [];
    this._currWrite = Promise.resolve();
  }

  public get data(): T[] {
    return this._data;
  }

  /**
   * Считываем данные и помещаем их в объект в памяти.
   *
   * @validator функция, которая проверяет данные, соответствуют ли они нашей структуре.
   *            вызывает исключение, если нет.
   */
  public async readDataFromDisk(validator?: (data: any) => T[]): Promise<void> {
    await this._currWrite;
    try {
      await access(this._fullFileName, constants.R_OK | constants.W_OK);
      const data = await readFile(this._fullFileName, { encoding: 'utf8' });
      const parsed = JSON.parse(data);
      this._data = validator ? validator(parsed) : parsed;
    } catch {
      await this._save();
    }
  }

  /**
   * Inserts an object into the database without checking for existence.
   */
  public insert(obj: T): T {
    const tempObj = Collection._setId(obj);
    this._data.push(tempObj);
    this._save();
    return tempObj;
  }

  public findById(id: string): T | undefined {
    return this._data.find((item) => item.id === id);
  }

  /**
   * Update an item found by Id.
   * Will do nothing if an item provided does not have an `id` property.
   */
  public update(obj: T) {
    if (obj.id) {
      const foundIndex = this._data.findIndex((item) => item.id === obj.id);
      if (foundIndex >= 0) {
        this._data[foundIndex] = obj;
        this._save();
      }
    }
  }

  /**
   * Delete items by `id` or using a specified predicate.
   * Items for which the predicate returns true will be deleted.
   */
  public deleteById(id: string) {
    const foundId = this._data.findIndex((item) => item.id === id);
    if (foundId >= 0) {
      this._data.splice(foundId, 1);
      this._save();
    }
  }

  public getNamedItem(id: string): INamedEntity {
    const item = this.findById(id) as any;

    return item! && { id: item.id, name: typeof item === 'object' && 'name' in item ? item.name : '' };
  }

  public pendingWrite() {
    return this._currWrite;
  }

  private async _save(): Promise<void> {
    await this._currWrite;
    this._currWrite = writeFile(this._fullFileName, JSON.stringify(this._data), { encoding: 'utf8' });
  }
}
