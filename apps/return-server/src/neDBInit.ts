import Datastore from 'nedb';

import { IUser } from './type';

import environment from './config/environment';
const db = new Datastore();
db.loadDatabase();

const user: IUser = {
  name: environment.USER_NAME,
  password: environment.USER_PASSWORD,
};

const users = [user];

export { db, users };
