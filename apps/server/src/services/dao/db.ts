import {
  IDBUser,
  IDBMessage,
  IDBDevice,
  IDBActivationCode,
  IDBCompany,
  INamedEntity,
  IDBDeviceBinding,
  IDBid,
  IDBProcess,
} from '@lib/types';

import { v4 as uuid } from 'uuid';

import { Collection, Database, CollectionMessage } from '../../utils/json-db';

export type dbtype = {
  users: Collection<IDBUser>;
  codes: Collection<IDBActivationCode>;
  companies: Collection<IDBCompany>;
  messages: CollectionMessage<IDBMessage>;
  devices: Collection<IDBDevice>;
  deviceBindings: Collection<IDBDeviceBinding>;
  dbid: Collection<IDBid>;
  processes: Collection<IDBProcess>;
};

let database: dbtype | null = null;

export const createDb = async (dir: string, name: string) => {
  const db = new Database(dir, name);

  const users = db.collection<IDBUser>('users');
  const devices = db.collection<IDBDevice>('devices');
  const companies = db.collection<IDBCompany>('companies');
  const codes = db.collection<IDBActivationCode>('activation-codes');
  const deviceBindings = db.collection<IDBDeviceBinding>('device-bindings');
  const dbid = db.collection<IDBid>('dbid');
  const messages = db.messageCollection<IDBMessage>('messages');
  const processes = db.collection<IDBProcess>('process');

  database = { users, codes, companies, messages, devices, deviceBindings, dbid, processes: processes };
  const dbArr = await dbid.read();
  if (dbArr.length === 0) await dbid.insert({ id: uuid() });

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
