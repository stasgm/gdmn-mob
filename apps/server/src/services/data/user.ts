import { INamedEntity, IDBUser } from '@lib/types';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const users: IDBUser[] = [
  {
    id: '15',
    externalId: '147012274',
    name: 'Иванов И.И.',
    firstName: 'Иван',
    lastName: 'Иванович',
    phoneNumber: '8-044-788-86-44',
    creatorId: superAdmin.id,
    company: '777',
    role: 'Admin',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
    password: '@123!',
  },
  {
    id: '123',
    externalId: '150449124',
    name: 'Stas',
    firstName: 'Станислав',
    lastName: 'Шляхтич',
    phoneNumber: '+37529-11-111-11',
    password: '2',
    creatorId: '1',
    company: 'null',
    role: 'Admin',
  },
  {
    id: '345',
    externalId: '150449124',
    name: 'Ina',
    firstName: 'Ina',
    lastName: 'Dzadzevich',
    phoneNumber: '+37529-33-333-33',
    password: '2',
    creatorId: '1',
    company: '1',
    role: 'Admin',
  },
  {
    id: '12',
    externalId: '150449124',
    name: 'Peppa',
    firstName: 'Peppa',
    lastName: 'Svinka',
    phoneNumber: '+37529-22-222-22',
    password: '2',
    creatorId: '1',
    company: '1',
    role: 'User',
  },
  {
    id: '13',
    externalId: '150449124',
    name: 'Watson',
    firstName: 'Watson',
    lastName: 'Doctor',
    phoneNumber: '+37529-22-222-22',
    password: '2',
    creatorId: '1',
    company: '1',
    role: 'User',
  },
  {
    id: '14',
    externalId: '150449124',
    name: 'Bob',
    firstName: 'Bob',
    lastName: 'Marley',
    phoneNumber: '+37529-22-222-22',
    password: '2',
    creatorId: '1',
    company: '1',
    role: 'User',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
