import { IReference } from '@lib/types';

const company1 = { id: '5', name: 'Евроопт' };
const company2 = { id: '6', name: 'Грин' };

const depMock = [
  {
    id: '1',
    name: 'Склад',
    company: company2,
  },
  {
    id: '2',
    name: 'Магазин',
    company: company1,
  },
];

const depRefMock: IReference = {
  id: '111',
  name: 'Подразделения',
  data: depMock,
};

const peopleMock = [
  {
    id: '3',
    name: 'Иванов И.И.',
    company: company2,
  },
  {
    id: '4',
    name: 'Петров П.П.',
    company: company1,
  },
];

const peopleRefMock: IReference = {
  id: '222',
  name: 'Люди',
  data: peopleMock,
};

const companyMock = [company1, company2];

const companyRefMock: IReference = {
  id: '333',
  name: 'Компании',
  data: companyMock,
};

export { depRefMock, peopleRefMock, companyRefMock };
