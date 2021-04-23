import { ICompany, INamedEntity } from '@lib/types';
import { v4 as uuid } from 'uuid';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '345',
  name: 'Ina',
};

const companies: ICompany[] = [
  { id: '789', name: 'ОДО Золотые Программы', admin: user1 },
  { id: '654', name: 'ОДО Амперсант', admin: user2 },
  { id: uuid(), name: 'Company 1', admin: user2 },
  { id: uuid(), name: 'Company 2', admin: user2 },
  { id: uuid(), name: 'Company 3', admin: user1 },
  { id: uuid(), name: 'Company 4', admin: user2 },
];

const company = companies[0];

const company2 = companies[1];

export { companies, company, company2 };
