import {
  IDBUser,
  IDBMessage,
  IDBDevice,
  IDBActivationCode,
  IDBCompany,
  INamedEntity,
  IDBDeviceBinding,
} from '@lib/types';

import { Collection, Database } from '../../utils/json-db';

type dbtype = {
  users: Collection<IDBUser>;
  codes: Collection<IDBActivationCode>;
  companies: Collection<IDBCompany>;
  messages: Collection<IDBMessage>;
  devices: Collection<IDBDevice>;
  deviceBindings: Collection<IDBDeviceBinding>;
};

let database: dbtype | null = null;

export const createDb = (dir: string, name: string) => {
  const db = new Database(dir, name);

  const users = db.collection<IDBUser>('user');
  const devices = db.collection<IDBDevice>('devices');
  const companies = db.collection<IDBCompany>('companies');
  const codes = db.collection<IDBActivationCode>('activation-codes');
  const messages = db.collection<IDBMessage>('messages');
  const deviceBindings = db.collection<IDBDeviceBinding>('device-bindings');

  database = { users, codes, companies, messages, devices, deviceBindings };

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
