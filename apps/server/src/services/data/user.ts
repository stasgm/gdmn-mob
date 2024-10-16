import { INamedEntity, IDBUser } from '@lib/types';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const users: IDBUser[] = [
  {
    id: 'gdmn',
    name: 'gdmn',
    password: 'gdmn',
    company: null,
    creatorId: '',
    role: 'SuperAdmin',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '15',
    externalId: '147012274',
    name: 'Короткевич З.С.',
    lastName: 'Короткевич',
    firstName: 'Змицер',
    middleName: 'Семенович',
    phoneNumber: '8-044-788-86-44',
    creatorId: superAdmin.id,
    company: '777',
    role: 'Admin',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
    password: '@123!',
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
    erpUserId: '13',
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
    appSystemId: '1',
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
