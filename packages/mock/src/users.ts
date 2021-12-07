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
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
    password: '@123!',
  },
  {
    id: '123',
    externalId: '150449124',
    name: 'Шляхтичич C.',
    firstName: 'Станислав',
    surName: 'Шляхтичич',
    lastName: 'Сергеевич',
    phoneNumber: '+37529-11-111-11',
    creator: superAdmin,
    company: undefined,
    role: 'Admin',
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '345',
    externalId: '150449124',
    name: 'Корбан И.В.',
    firstName: 'Инна',
    surName: 'Корбан',
    lastName: 'Владимировна',
    phoneNumber: '+37529-33-333-33',
    creator: superAdmin,
    company: company1,
    role: 'Admin',
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '12',
    externalId: '150449124',
    name: 'Хозянин О.И.',
    firstName: 'Ольга',
    surName: 'Хозянин',
    lastName: 'Ивановна',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company1,
    role: 'User',
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '13',
    externalId: '150449124',
    name: 'Короткевич З.С.',
    firstName: 'Змицер',
    surName: 'Короткевич',
    lastName: 'Семенович',
    phoneNumber: '+37529-22-222-22',
    creator: superAdmin,
    company: company2,
    role: 'User',
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '14',
    externalId: '150449124',
    name: 'Костенко Ю.П.',
    firstName: 'Юлия',
    surName: 'Костенко',
    lastName: 'Петрова',
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
