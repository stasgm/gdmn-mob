import { IEntity, INamedEntity, IUserDocument } from '@lib/types';

// import { companyRefMock, depRefMock, peopleRefMock } from './references';

const inventType = { id: '11', name: 'Инвентаризация' };
const newcostType = { id: '33', name: 'Переоценка' };

// const documentTypeMock = [inventType, newcostType];

const good1: INamedEntity = { id: '333', name: 'Молоко 1л.' };
const good2: INamedEntity = { id: '999', name: 'Сметана 25% 250 гр.' };

const dep1: INamedEntity = {
  id: '1',
  name: 'Склад',
};

interface DocHeader {
  department: INamedEntity;
}

interface DocLine extends IEntity {
  good: INamedEntity;
  quantity: number;
}

export const documentsMock: IUserDocument<DocHeader, DocLine[]>[] = [
  {
    id: '9',
    number: '225',
    documentDate: '2021-05-15T10:47:33.376Z',
    documentType: inventType,
    status: 'DRAFT',
    head: {
      department: dep1,
    },
    lines: [
      { id: '1', good: good1, quantity: 12.3 },
      { id: '2', good: good2, quantity: 2.21 },
    ],
  },
  {
    id: '9',
    number: '225',
    documentDate: '2021-05-12T10:40:33.376Z',
    documentType: newcostType,
    status: 'PROCESSED',
    head: {
      department: dep1,
    },
    lines: [
      { id: '1', good: good1, quantity: 10 },
      { id: '2', good: good2, quantity: 5 },
    ],
  },
];
