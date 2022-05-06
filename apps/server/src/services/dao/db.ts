import { access, mkdir } from 'fs/promises';

import { constants } from 'fs';

import path from 'path';

import {
  IDBUser,
  IDBMessage,
  IDBDevice,
  IDBActivationCode,
  IDBCompany,
  INamedEntity,
  IDBDeviceBinding,
  SessionId,
  DBAppSystem,
  IDBProcess,
  IAppSystem,
} from '@lib/types';

import { v4 as uuid } from 'uuid';

import { Collection, Database, CollectionMessage } from '../../utils/json-db';

import { messageFolders } from '../../utils/constants';

export type dbtype = {
  users: Collection<IDBUser>;
  codes: Collection<IDBActivationCode>;
  companies: Collection<IDBCompany>;
  messages: CollectionMessage<IDBMessage>;
  devices: Collection<IDBDevice>;
  deviceBindings: Collection<IDBDeviceBinding>;
  sessionId: Collection<SessionId>;
  appSystems: Collection<DBAppSystem>;
  processes: Collection<IDBProcess>;
  dbPath: string;
};

let database: dbtype | null = null;

export const createDb = async (dir: string, name: string) => {
  const db = new Database(dir, name);
  const users = db.collection<IDBUser>('users');
  const devices = db.collection<IDBDevice>('devices');
  const companies = db.collection<IDBCompany>('companies');
  const codes = db.collection<IDBActivationCode>('activation-codes');
  const deviceBindings = db.collection<IDBDeviceBinding>('device-bindings');
  const sessionId = db.collection<SessionId>('session-id');
  const messages = db.messageCollection<IDBMessage>();
  const appSystems = db.collection<DBAppSystem>('app-systems');
  const processes = db.collection<IDBProcess>('processes');
  const dbPath = db.getDbPath();

  database = { users, codes, companies, devices, deviceBindings, sessionId, messages, appSystems, processes, dbPath };
  const dbArr = await sessionId.read();
  if (dbArr.length === 0) await sessionId.insert({ id: uuid() });

  /*
  Проверяем наличие компаний и соответсвующих папок для компаний и подсистем
  */
  const dbCompanies = await companies.read();
  const dbAppSystems = await appSystems.read();

  dbCompanies.forEach(async (company) => {
    await createFolders(dbPath, company, dbAppSystems);
  });

  return database;
};

type ExtractTypes<P> = P extends Collection<infer T> ? T : never;

export type NamedDBEntities = Collection<Extract<ExtractTypes<dbtype[keyof dbtype]>, INamedEntity>>;

export function getDb(): dbtype {
  if (!database) {
    throw new Error('Database is not initialized');
  }
  return database;
}

const checkFileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

const mkDir = async (path: string): Promise<void> => {
  const check: boolean = await checkFileExists(path);
  if (!check) await mkdir(path, { recursive: true });
};

export const createFolders = async (dbPath: string, company: IDBCompany, dbAppSystems: IAppSystem[]): Promise<void> => {
  const companyFolder = path.join(dbPath, `db_${company.id}`);
  await mkDir(companyFolder);
  if (company.appSystemIds) {
    company.appSystemIds.forEach(async (systemId) => {
      const system = dbAppSystems.find((i) => i.id === systemId);
      if (system?.name) {
        await mkDir(path.join(companyFolder, system.name));
        messageFolders.forEach(async (folder) => await mkDir(path.join(companyFolder, system.name, folder)));
      }
    });
  }
};
