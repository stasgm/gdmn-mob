import { INamedEntity, IUser } from '@lib/types';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const company1: INamedEntity = { id: '654', name: 'ОДО Амперсант' };
const company2: INamedEntity = { id: '789', name: 'ОДО Золотые Программы' };
const company3: INamedEntity = { id: '777', name: 'Моя компания' };

const users: (IUser & { password?: string; verifyPassword?: string })[] = [
  {
    id: '15',
    externalId: '147012274',
    name: 'Короткевич З.',
    firstName: 'Змицер',
    lastName: 'Короткевич',
    phoneNumber: '8-044-788-86-44',
    creator: superAdmin,
    company: company3,
    role: 'User',
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
    creator: superAdmin,
    company: undefined,
    role: 'Admin',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '345',
    externalId: '150449124',
    name: 'Ina',
    firstName: 'Ina',
    lastName: 'Korban',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    company: company1,
    role: 'Admin',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '12',
    externalId: '150449124',
    name: 'Peppa',
    firstName: 'Peppa',
    lastName: 'Svinka',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company1,
    role: 'User',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '13',
    externalId: '150449124',
    name: 'Watson',
    firstName: 'Watson',
    lastName: 'Doctor',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company2,
    role: 'User',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '14',
    externalId: '150449124',
    name: 'Bob',
    firstName: 'Bob',
    lastName: 'Marley',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company2,
    role: 'User',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
