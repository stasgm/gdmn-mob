import { INamedEntity, IUser } from '@lib/types';

export const superAdmin: INamedEntity = {
  id: 'gdmn',
  name: 'gdmn',
};

const company1: INamedEntity = { id: '789', name: 'Моя компания 1' };
const company2: INamedEntity = { id: '654', name: 'Моя компания 2' };
const company3: INamedEntity = { id: '777', name: 'Моя компания' };

const users: (IUser & { password?: string; verifyPassword?: string })[] = [
  {
    id: '15',
    externalId: '147012274',
    name: 'Короткевич З.С.',
    lastName: 'Короткевич',
    firstName: 'Змицер',
    surName: 'Семенович',
    phoneNumber: '8-044-788-86-44',
    creator: superAdmin,
    company: company3,
    role: 'User',
    creationDate: '2021-11-24T13:02:55.886Z',
    editionDate: '2021-11-24T13:02:55.886Z',
    password: '@123!',
  },
  {
    id: '123',
    externalId: '150449124',
    name: 'Шляхтичич C.С.',
    firstName: 'Станислав',
    lastName: 'Шляхтич',
    surName: 'Сергеевич',
    phoneNumber: '+37529-11-111-11',
    creator: superAdmin,
    company: undefined,
    role: 'Admin',
    creationDate: '2021-11-24T11:02:55.886Z',
    editionDate: '2021-11-24T11:02:55.886Z',
  },
  {
    id: '345',
    externalId: '150449124',
    name: 'Корбан И.В.',
    firstName: 'Инна',
    lastName: 'Корбан',
    surName: 'Владимировна',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    company: company1,
    role: 'Admin',
    creationDate: '2021-11-24T14:01:55.886Z',
    editionDate: '2021-11-24T14:01:55.886Z',
  },
  {
    id: '12',
    externalId: '150449124',
    name: 'Хозянин О.И.',
    firstName: 'Ольга',
    lastName: 'Хозянин',
    surName: 'Ивановна',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company1,
    role: 'User',
    creationDate: '2021-11-24T14:02:55.881Z',
    editionDate: '2021-11-24T14:02:55.881Z',
  },
  {
    id: '14',
    externalId: '150449124',
    name: 'Костенко Ю.П.',
    firstName: 'Юлия',
    lastName: 'Костенко',
    surName: 'Петровна',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company2,
    role: 'User',
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
];

const user = users[0];
const user2 = users[1];

export { users, user, user2 };
