import fs from 'fs';
import path from 'path';
import os from 'os';

import Collection from './Collection';

import { CollectionItem } from './CollectionItem';

class Database {
  private dbPath: string;

  /**
   *
   * @param {string} name
   */
  constructor(dir: string, name: string) {
    this.dbPath = path.join(dir || os.userInfo().homedir, `/.${name}/`);
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!fs.existsSync(this.dbPath)) {
      try {
        fs.mkdirSync(this.dbPath);
      } catch (err) {
        console.log(err.name, err.message);
      }
    }
  }

  /**
   *
   * @param {string} name
   */
  collection<T extends CollectionItem>(name: string) {
    const collectionPath = path.join(this.dbPath, `${name}.json`);
    return new Collection<T>(collectionPath);
  }
}

export default Database;
