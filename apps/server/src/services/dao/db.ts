import { IDBUser, IDBMessage, IDBDevice, IDBActivationCode, IDBCompany, INamedEntity } from '@lib/types';

import { Collection, Database } from '../../utils/json-db';

const db = new Database('mob-app');

const users = db.collection<IDBUser>('user');
const devices = db.collection<IDBDevice>('devices');
const companies = db.collection<IDBCompany>('companies');
const codes = db.collection<IDBActivationCode>('activation-codes');
const messages = db.collection<IDBMessage>('messages');

// export type NamedDBEntities = typeof users | typeof devices | typeof companies;

export const entities = { users, codes, companies, messages, devices };

type ExtractTypes<P> = P extends Collection<infer T> ? T : never;

export type NamedDBEntities = Collection<Extract<ExtractTypes<typeof entities[keyof typeof entities]>, INamedEntity>>;
