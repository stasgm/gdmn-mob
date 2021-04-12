import { IUserDto, IMessage, IDevice, IActivationCode, IDBCompany } from '@lib/types';

import { Database } from '../../utils/json-db';

const db = new Database('mob-app');

const users = db.collection<IUserDto>('user');
const codes = db.collection<IActivationCode>('activation-codes');
const companies = db.collection<IDBCompany>('companies');
const messages = db.collection<IMessage>('messages');
const devices = db.collection<IDevice>('devices');

export { users, codes, companies, messages, devices };
