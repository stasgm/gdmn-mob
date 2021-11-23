import { ICompany, INamedEntity } from '@lib/types';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '345',
  name: 'Ina',
};

const companies: ICompany[] = [
  {
    id: '777',
    name: 'Моя компания',
    admin: user1,
    city: 'Мой город',
    creationDate: '2021.01.02',
    editionDate: '2021.01.02',
  },
  {
    id: '789',
    name: 'Моя компания 1',
    admin: user1,
    city: 'Город 1',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '654',
    name: 'Моя компания 2',
    admin: user2,
    city: 'Город 2',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  { id: '12', name: 'Company 2', admin: user2, creationDate: '2021.01.03', editionDate: '2021.01.03' },
  { id: '13', name: 'Company 3', admin: user1, creationDate: '2021.01.04', editionDate: '2021.01.04' },
  { id: '44', name: 'Company 4', admin: user2, creationDate: '2021.01.04', editionDate: '2021.01.04' },
];

const company = companies[0];
const company2 = companies[1];
const company3 = companies[2];

export { companies, company, company2, company3 };
