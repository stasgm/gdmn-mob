import { INamedEntity, IReference } from '@lib/types';

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
  id: '10',
  name: 'Подразделения',
  data: depMock,
};

const peopleMock = [
  {
    id: '3',
    name: 'Короткевич З.С.',
    company: company2,
  },
  {
    id: '4',
    name: 'Петров П.П.',
    company: company1,
  },
];

const peopleRefMock: IReference = {
  id: '2',
  name: 'Люди',
  data: peopleMock,
};

const inventType = { id: '11', name: 'Инвентаризация' };
const newcostType = { id: '33', name: 'Переоценка' };

const companyMock = [company1, company2];

const companyRefMock: IReference<INamedEntity> = {
  id: '3',
  name: 'Компании',
  data: companyMock,
};

const docTypeRefMock: IReference<INamedEntity> = {
  id: '4',
  name: 'Типы документов',
  data: [inventType, newcostType],
};

export const good1: INamedEntity = { id: '333', name: 'Молоко 1л.' };
export const good2: INamedEntity = { id: '999', name: 'Сметана 25% 250 гр.' };

const goodsRefMock: IReference<INamedEntity> = {
  id: '1',
  name: 'Товары',
  data: [good1, good2],
};

export { depRefMock, peopleRefMock, companyRefMock, docTypeRefMock, goodsRefMock };
