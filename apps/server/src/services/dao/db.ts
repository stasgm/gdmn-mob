import path from 'path';

import { v1 as uuid } from 'uuid';

import {
  IDBUser,
  IDBMessage,
  IDBDevice,
  IDBActivationCode,
  IDBCompany,
  IDBDeviceBinding,
  DBAppSystem,
  SessionId,
} from '@lib/types';

import { Collection, Database, CollectionMessage } from '../../utils/json-db';

import { messageFolders } from '../../utils/constants';

import { mkDir } from './utils';

export type DBType = {
  users: Collection<IDBUser>;
  codes: Collection<IDBActivationCode>;
  companies: Collection<IDBCompany>;
  messages: CollectionMessage<IDBMessage>;
  devices: Collection<IDBDevice>;
  deviceBindings: Collection<IDBDeviceBinding>;
  appSystems: Collection<DBAppSystem>;
  sessionId: Collection<SessionId>;
  dbPath: string;
  createFoldersForCompany: (company: IDBCompany) => void;
  pendingWrites: () => Promise<void[]>;
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
    sessionId: db.collection<SessionId>('session-id'),
  };

  // const dbArr = collections.sessionId.data;
  if (collections.sessionId.data.length === 0) {
    collections.sessionId.insert({ id: uuid() });
  }

  await Promise.all(Object.values(collections).map((c) => c.readDataFromDisk()));

  // TODO: привести в соответствие с нашей откорректерованной коллекцией
  const messages = db.messageCollection<IDBMessage>();
  const dbPath = db.getDbPath();

  const createFoldersForCompany = (company: IDBCompany) => {
    const companyFolder = path.join(dbPath, `db_${company.id}`);
    mkDir(companyFolder);
    if (company.appSystemIds) {
      for (const appSystemId of company.appSystemIds) {
        const appSystemName = collections.appSystems.findById(appSystemId)?.name;
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

  const pendingWrites = () => Promise.all(Object.values(collections).map((c) => c.pendingWrite()));

  database = {
    ...collections,
    messages,
    dbPath,
    createFoldersForCompany,
    pendingWrites,
  };

  return database;
};

export function getDb(): DBType {
  if (!database) {
    throw new Error('Database is not initialized');
  }
  return database;
}
