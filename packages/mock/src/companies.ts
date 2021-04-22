import { ICompany } from '@lib/types';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line import/no-cycle
import users from './users';

const companies: ICompany[] = [
  { id: uuid(), name: 'ОДО Золотые Программы', admin: { id: users[2].id, name: users[2].name } },
  { id: uuid(), name: 'ОДО Амперсант', admin: { id: users[0].id, name: users[0].name } },
  { id: uuid(), name: 'Company 1', admin: { id: users[1].id, name: users[1].name } },
  { id: uuid(), name: 'Company 2', admin: { id: users[0].id, name: users[0].name } },
  { id: uuid(), name: 'Company 3', admin: { id: users[1].id, name: users[1].name } },
  { id: uuid(), name: 'Company 4', admin: { id: users[1].id, name: users[1].name } },
];

export default companies;
