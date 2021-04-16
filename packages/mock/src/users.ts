import { INamedEntity, IUser } from '@lib/types';
import { v4 as uuid } from 'uuid';

import companies from './companies';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const users: IUser[] = [
  {
    id: '1',
    externalId: '150449124',
    name: 'Stas',
    password: '1',
    firstName: 'Станислав',
    lastName: 'Шляхтич',
    phoneNumber: '+37529-11-111-11',
    creator: superAdmin,
    companies: [],
    role: 'Admin',
    activationCode: '123',
  },
  {
    id: '2',
    externalId: '150449124',
    name: 'Ina',
    password: '1',
    firstName: 'Ina',
    lastName: 'Dzadzevich',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    companies: [companies[0]],
    role: 'Admin',
    activationCode: '123',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Peppa',
    password: '1',
    firstName: 'Peppa',
    lastName: 'Svinka',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [companies[0]],
    role: 'User',
    activationCode: '123',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Vatson',
    password: '1',
    firstName: 'Vatson',
    lastName: 'Doctor',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [companies[0]],
    role: 'User',
    activationCode: '123',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Bob',
    password: '1',
    firstName: 'Bob',
    lastName: 'Marley',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [companies[1]],
    role: 'User',
    activationCode: '123',
  },
];

export default users;
