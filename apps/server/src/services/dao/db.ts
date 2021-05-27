import { IDBUser, IDBMessage, IDBDevice, IDBActivationCode, IDBCompany, INamedEntity } from '@lib/types';

import { Collection, Database } from '../../utils/json-db';

export const createDb = (dir: string, name: string) => {
  const db = new Database(dir, name);

  const users = db.collection<IDBUser>('user');
  const devices = db.collection<IDBDevice>('devices');
  const companies = db.collection<IDBCompany>('companies');
  const codes = db.collection<IDBActivationCode>('activation-codes');
  const messages = db.collection<IDBMessage>('messages');

  return { users, codes, companies, messages, devices };
};

type ExtractTypes<P> = P extends Collection<infer T> ? T : never;

export type dbtype = ReturnType<typeof createDb>;

export type NamedDBEntities = Collection<Extract<ExtractTypes<dbtype[keyof dbtype]>, INamedEntity>>;
