import { IUser, IMessage, IDevice, IActivationCode, ICompany } from '@lib/types';

import { Database } from '../../utils/json-db';

const db = new Database('mob-app');

const users = db.collection<IUser>('user');
const codes = db.collection<IActivationCode>('activation-codes');
const companies = db.collection<ICompany>('companies');
const messages = db.collection<IMessage>('messages');
const devices = db.collection<IDevice>('devices');

export { users, codes, companies, messages, devices };
