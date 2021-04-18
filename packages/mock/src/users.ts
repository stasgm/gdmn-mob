import { INamedEntity, IUser } from '@lib/types';
import { v4 as uuid } from 'uuid';

import companies from './companies';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
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
    companies: [companies[0]],
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
    companies: [companies[0]],
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
    companies: [companies[0]],
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
    companies: [companies[1]],
    role: 'User',
  },
];

export default users;
