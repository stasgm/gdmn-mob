import { IDocument, IEntity, IHead, INamedEntity } from '@lib/types';

import { docTypeRefMock, good1, good2 } from './references';

// import { companyRefMock, depRefMock, peopleRefMock } from './references';

const dep1: INamedEntity = {
  id: '1',
  name: 'Склад',
};

interface DocHeader extends IHead {
  department: INamedEntity;
}

interface DocLine extends IEntity {
  good: INamedEntity;
  quantity: number;
}

export const documentsMock: IDocument<DocHeader, DocLine>[] = [
  {
    id: '9',
    number: '225',
    documentDate: '2021-05-15T10:47:33.376Z',
    documentType: docTypeRefMock.data[0],
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
    documentType: docTypeRefMock.data[1],
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
