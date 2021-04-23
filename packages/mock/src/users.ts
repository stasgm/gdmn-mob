import { INamedEntity, IUser } from '@lib/types';
import { v4 as uuid } from 'uuid';

import { companies } from './companies';

const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const company: INamedEntity = {
  id: companies[0].id,
  name: companies[0].name,
};

const company2: INamedEntity = {
  id: companies[1].id,
  name: companies[1].name,
};

const users: IUser[] = [
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Stas',
    firstName: 'Станислав',
    lastName: 'Шляхтич',
    phoneNumber: '+37529-11-111-11',
    creator: superAdmin,
    companies: [],
    role: 'Admin',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Ina',
    firstName: 'Ina',
    lastName: 'Dzadzevich',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    companies: [company, company2],
    role: 'Admin',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Peppa',
    firstName: 'Peppa',
    lastName: 'Svinka',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [company],
    role: 'User',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Vatson',
    firstName: 'Vatson',
    lastName: 'Doctor',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [company],
    role: 'User',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Bob',
    firstName: 'Bob',
    lastName: 'Marley',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [company, company2],
    role: 'User',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
