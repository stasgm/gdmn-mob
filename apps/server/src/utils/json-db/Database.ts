import fs from 'fs';
import path from 'path';
import os from 'os';

import { Collection } from './Collection';
import CollectionMessage from './MessageCollection';

import { CollectionItem } from './CollectionItem';

class Database {
  private _dbPath: string;

  /**
   *
   * @param {string} name
   */
  constructor(dir: string, name: string) {
    this._dbPath = path.join(dir || os.userInfo().homedir, `/.${name}/`);
    this.ensureStorage();
  }

  get dbPath() {
    return this._dbPath;
  }

  private ensureStorage() {
    if (!fs.existsSync(this._dbPath)) {
      try {
        fs.mkdirSync(this._dbPath);
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'Ошибка ensureStorage');
      }
    }
  }

  /**
   *
   * @param {string} name
   */
  collection<T extends CollectionItem>(name: string) {
    const collectionPath = path.join(this._dbPath, `${name}.json`);
    return new Collection<T>(collectionPath);
  }

  messageCollection<T extends CollectionItem>() {
    const collectionPath = this._dbPath;
    return new CollectionMessage<T>(collectionPath);
  }

  getDbPath() {
    return this._dbPath;
  }
}

export default Database;
