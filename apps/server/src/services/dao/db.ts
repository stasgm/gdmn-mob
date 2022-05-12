import { existsSync, mkdirSync } from 'fs';

import path from 'path';

import {
  IDBUser,
  IDBMessage,
  IDBDevice,
  IDBActivationCode,
  IDBCompany,
  INamedEntity,
  IDBDeviceBinding,
  DBAppSystem,
  IDBProcess,
} from '@lib/types';

import { Collection, Database, CollectionMessage } from '../../utils/json-db';

import { messageFolders } from '../../utils/constants';

export type DBType = {
  users: Collection<IDBUser>;
  codes: Collection<IDBActivationCode>;
  companies: Collection<IDBCompany>;
  messages: CollectionMessage<IDBMessage>;
  devices: Collection<IDBDevice>;
  deviceBindings: Collection<IDBDeviceBinding>;
  appSystems: Collection<DBAppSystem>;
  processes: Collection<IDBProcess>;
  dbPath: string;
  createFoldersForCompany: (company: IDBCompany) => void;
};

let database: DBType;

export const createDb = async (dir: string, name: string): Promise<DBType> => {
  const db = new Database(dir, name);
  const collections = {
    users: db.collection<IDBUser>('users'),
    devices: db.collection<IDBDevice>('devices'),
    companies: db.collection<IDBCompany>('companies'),
    codes: db.collection<IDBActivationCode>('activation-codes'),
    deviceBindings: db.collection<IDBDeviceBinding>('device-bindings'),
    appSystems: db.collection<DBAppSystem>('app-systems'),
    processes: db.collection<IDBProcess>('processes'),
  };

  await Promise.all(Object.values(collections).map((c) => c.readDataFromDisk()));

  // TODO: привести в соответствие с нашей откорректерованной коллекцией
  const messages = db.messageCollection<IDBMessage>();
  const dbPath = db.getDbPath();

  const createFoldersForCompany = (company: IDBCompany) => {
    const companyFolder = path.join(dbPath, `db_${company.id}`);
    mkDir(companyFolder);
    if (company.appSystemIds) {
      for (const appSystemId of company.appSystemIds) {
        const appSystemName = database.appSystems.findById(appSystemId)?.name;
        if (appSystemName) {
          mkDir(path.join(companyFolder, appSystemName));
          messageFolders.forEach((folder) => mkDir(path.join(companyFolder, appSystemName, folder)));
        }
      }
    }
  };

  for (const company of collections.companies.data) {
    createFoldersForCompany(company);
  }

  database = {
    ...collections,
    messages,
    dbPath,
    createFoldersForCompany,
  };

  return database;
};

type ExtractTypes<P> = P extends Collection<infer T> ? T : never;

export type NamedDBEntities = Collection<Extract<ExtractTypes<DBType[keyof DBType]>, INamedEntity>>;

export function getDb(): DBType {
  if (!database) {
    throw new Error('Database is not initialized');
  }
  return database;
}

const mkDir = (path: string) => {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
};
