import { ICompany, IDocument, INamedEntity, IReferences, IUserDocument } from '@lib/types';

import { companyRefMock, depRefMock, peopleRefMock } from './references';

// const user1: INamedEntity = {
//   id: '123',
//   name: 'Stas',
// };

// const user2: INamedEntity = {
//   id: '345',
//   name: 'Ina',
// };

// const user3: INamedEntity = {
//   id: '654',
//   name: 'Gedemin',
// };

// const companies: ICompany[] = [
//   { id: '789', name: 'ОДО Золотые Программы', admin: user1 },
//   { id: '654', name: 'ОДО Амперсант', admin: user2 },
//   { id: '34', name: 'Company 1', admin: user2 },
//   { id: '154', name: 'Company 2', admin: user2 },
//   { id: '644', name: 'Company 3', admin: user1 },
//   { id: '954', name: 'Company 4', admin: user2 },
// ];

const inventType = { id: '11', name: 'Инвентаризация' };
const newcostType = { id: '33', name: 'Переоценка' };

const documentTypeMock = [inventType, newcostType];

const good1: INamedEntity = { id: '333', name: 'Молоко 1л.' };
const good2: INamedEntity = { id: '999', name: 'Сметана 25% 250 гр.' };

export const documents: IUserDocument[] = [
  {
    id: '9',
    number: '225',
    documentDate: '25.04.2021',
    documentType: inventType,
    status: 'DRAFT',
    /*     lines: [
      { id: '10', good: good1, quantity: 12 },
      { id: '11', good: good2, quantity: 10 },
    ], */
  },
];
