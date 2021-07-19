import { IDBCompany, INamedEntity } from '@lib/types';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '345',
  name: 'Ina',
};

const companies: IDBCompany[] = [
  { id: '789', name: 'ОДО Золотые Программы', adminId: '1' },
  { id: '654', name: 'ОДО Амперсант', adminId: 'user2' },
  { id: '11', name: 'Бройлерная птицефабрика', adminId: 'user1' },
  { id: '12', name: 'Company 2', adminId: 'user2' },
  { id: '13', name: 'Company 3', adminId: 'user1' },
  { id: '44', name: 'Company 4', adminId: 'user2' },
];

const company = companies[0];
const company2 = companies[1];
const company3 = companies[2];

export { companies, company, company2, company3 };
