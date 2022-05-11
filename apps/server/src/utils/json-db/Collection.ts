/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import { readFile } from 'fs/promises';

import { pipe, not } from 'ramda';
import { v1 as uuid } from 'uuid';

import { CollectionItem } from './CollectionItem';

/**
 * @template T
 */
class Collection<T extends CollectionItem> {
  filter() {
    throw new Error('Method not implemented.');
  }
  private _collectionPath: string;

  private static _initObject<K extends CollectionItem>(obj: K): K {
    return { ...obj, id: uuid() };
  }

  constructor(path: string) {
    this._collectionPath = path;
    this._ensureStorage();
  }

  get collectionPath() {
    return this._collectionPath;
  }

  /**
   * Inserts an object into the database without checking for existence.
   */
  public async insert(obj: T): Promise<string> {
    const db = await this._get();

    const initObject = obj.id ? obj : Collection._initObject(obj);

    db.push(initObject);
    await this._save(db);
    return initObject.id as string;
  }

  /**
   * Inserts an array of objects into the database without checking for existence.
   */
  public async insertMany(obj: Array<T>): Promise<Array<string>> {
    const db = await this._get();

    const initObjects = obj.map((item) => (item.id ? item : Collection._initObject(item)));
    const ids = obj.map((item) => item.id as string);

    db.push(...initObjects);
    await this._save(db);
    return ids;
  }

  /**
   * Returns every entry in the collection.
   */
  public async read(): Promise<Array<T>>;

  public async read(predicate: (item: T) => boolean): Promise<Array<T>>;

  public async read(predicate?: (item: T) => boolean): Promise<Array<T>> {
    if (typeof predicate === 'undefined') return this._get();
    return (await this._get()).filter(predicate);
  }

  /**
   * Finds an item by id or using the specified predicate.
   */
  public async find(id: string): Promise<T>;

  public async find(predicate: (item: T) => boolean): Promise<T>;

  public async find(id: string | ((item: T) => boolean)) {
    const predicate = typeof id === 'function' ? id : (item: T) => item.id === id;
    return (await this._get()).find(predicate);
  }

  public findSync(id: string) {
    return this._getSync().find((item) => item.id === id);
  }

  /**
   * Update an item. Will not update if the item does not have an `id` property
   */
  public async update(obj: T): Promise<void> {
    const db = await this._get();

    if (!obj.id) return;
    const newDb = db.map((val) => (val.id === obj.id ? obj : val));
    this._save(newDb);
  }

  /**
   * Delete items by `id` or using a specified predicate.
   * Items for which the predicate returns true will be deleted.
   */
  public async delete(id: string): Promise<void>;

  public async delete(predicate: (item: T) => boolean): Promise<void>;

  public async delete(id: string | ((item: T) => boolean)) {
    const predicate = typeof id === 'function' ? pipe(id, not) : (item: T) => item.id !== id;

    const db = await this._get();

    const deleted = db.filter(predicate);

    return this._save(deleted);
  }

  public async deleteAll(): Promise<void> {
    return this._save([]);
  }

  private _ensureStorage() {
    if (!fs.existsSync(this._collectionPath)) this._save([]);
  }

  private async _get(): Promise<Array<T>> {
    const data = await readFile(this._collectionPath, { encoding: 'utf8' });
    return JSON.parse(data);
  }

  private _getSync(): Array<T> {
    //FIXME: не обрабатываются ошибки с дисковыми операциями, парсингом и не проверяется тип.
    const data = fs.readFileSync(this._collectionPath, { encoding: 'utf8' });
    const result = JSON.parse(data);
    return result;
  }

  private _save(data: Array<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(this._collectionPath, JSON.stringify(data), { encoding: 'utf8' });
        return resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Collection;
