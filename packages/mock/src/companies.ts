import { ICompany, INamedEntity } from '@lib/types';
import { v4 as uuid } from 'uuid';

export const admin: INamedEntity = {
  id: '1',
  name: 'Stas',
};

export const admin2: INamedEntity = {
  id: '1',
  name: 'Ina',
};

const companies: ICompany[] = [
  { id: uuid(), name: 'ОДО Золотые Программы', admin },
  { id: uuid(), name: 'ОДО Амперсант', admin: admin2 },
  { id: uuid(), name: 'Company 1', admin },
  { id: uuid(), name: 'Company 2', admin },
  { id: uuid(), name: 'Company 3', admin },
  { id: uuid(), name: 'Company 4', admin },
];

export default companies;
