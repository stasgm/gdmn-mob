import { INamedEntity, IDBUser } from '@lib/types';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const company1: INamedEntity = { id: '654', name: 'ОДО Амперсант' };
const company2: INamedEntity = { id: '789', name: 'ОДО Золотые Программы' };
const company3: INamedEntity = { id: '777', name: 'Бройлерная птицефабрика' };

const users: IDBUser[] = [
  {
    id: '15',
    externalId: '147012274',
    name: 'ГОЦЕЛЮК Н. А.',
    firstName: 'НАТАЛЬЯ',
    lastName: 'ГОЦЕЛЮК',
    phoneNumber: '8-044-788-86-44',
    password: '1',
    creatorId: '1',
    companies: ['3'],
    role: 'Admin',
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
    password: '2',
    creatorId: '1',
    companies: ['1'],
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
    companies: ['1'],
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
    companies: ['1'],
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
    companies: ['1'],
    role: 'User',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
