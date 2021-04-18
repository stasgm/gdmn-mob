import { IDBUser, IDBMessage, IDBDevice, IDBActivationCode, IDBCompany } from '@lib/types';

import { Database } from '../../utils/json-db';

const db = new Database('mob-app');

const users = db.collection<IDBUser>('user');
const codes = db.collection<IDBActivationCode>('activation-codes');
const companies = db.collection<IDBCompany>('companies');
const messages = db.collection<IDBMessage>('messages');
const devices = db.collection<IDBDevice>('devices');

export { users, codes, companies, messages, devices };
