import path from 'path';

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

import { messageFolders, collectionNames } from '../../utils/constants';

import { generateId } from '../../utils/helpers';

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
    users: db.collection<IDBUser>(collectionNames.users),
    devices: db.collection<IDBDevice>(collectionNames.devices),
    companies: db.collection<IDBCompany>(collectionNames.companies),
    codes: db.collection<IDBActivationCode>(collectionNames.codes),
    deviceBindings: db.collection<IDBDeviceBinding>(collectionNames.deviceBindings),
    appSystems: db.collection<DBAppSystem>(collectionNames.appSystems),
    sessionId: db.collection<SessionId>(collectionNames.sessionId),
  };

  await Promise.all(Object.values(collections).map((c) => c.readDataFromDisk()));

  //При запуске сервера в первый раз формируем ид сессии
  if (collections.sessionId.data.length === 0) {
    collections.sessionId.insert({ id: generateId() });
  }

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
