import { INamedEntity, IUser } from '@lib/types';
import { v4 as uuid } from 'uuid';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const company1: INamedEntity = { id: '654', name: 'ОДО Амперсант' };
const company2: INamedEntity = { id: '789', name: 'ОДО Золотые Программы' };

const users: IUser[] = [
  {
    id: '123',
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
    id: '345',
    externalId: '150449124',
    name: 'Ina',
    firstName: 'Ina',
    lastName: 'Dzadzevich',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    companies: [company1],
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
    companies: [company1],
    role: 'User',
  },
  {
    id: uuid(),
    externalId: '150449124',
    name: 'Watson',
    firstName: 'Watson',
    lastName: 'Doctor',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    companies: [company2, company1],
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
    companies: [company2],
    role: 'User',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
