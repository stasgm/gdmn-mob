import { IReference } from '@lib/types';

import { IOrderDocument, IRouteDocument } from './types';

const orderType = { id: '1', name: 'Заявка1 (организация)' };
const routeType = { id: '33', name: 'route' };

const documentTypeMock = [orderType, routeType];

// Организации
const contactMock = [
  {
    id: '2',
    name: 'ОАО "Веста" г.Витебск',
    externalId: '16354637',
    contractNumber: '245/20',
    contractDate: '12.05.2020',
    paycond: 'отсрочка 14 к/д_поручение',
    phoneNumber: '(29) 437-23-67',
  },
  {
    id: '4',
    name: 'ЧУТПП "Батя" г.п.Ушачи',
    externalId: '1476843456',
    contractNumber: '423/19',
    contractDate: '15.02.2019',
    paycond: 'отсрочка 10 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
];
const contact1 = { id: contactMock[0].id, name: contactMock[0].name };
const contact2 = { id: contactMock[1].id, name: contactMock[1].name };

const contactRefMock: IReference = {
  id: '47',
  name: 'Организации',
  data: contactMock,
};

// Магазины
const outletMock = [
  {
    id: '5',
    name: 'ОАО "Веста" г.Витебск, магазин №82',
    externalId: '14745603',
    company: contact1,
    address: 'г. Витебск, ул. Семенова, 1',
    phoneNumber: '(29) 115-23-19',
  },
  {
    id: '6',
    name: 'ОАО "Веста" г. Витебск маг.№61 ул.К.Маркса,15',
    externalId: '147227894',
    company: contact1,
    address: 'г. Витебск, ул.К.Маркса, 15',
    phoneNumber: '(29) 522-28-24',
  },
  {
    id: '8',
    name: 'ЧУТПП "Батя" магазин "Батя" г.п.Ушачи',
    externalId: '147249054',
    company: contact1,
    address: 'г.п.Ушачи, ул. Таранова, 1',
    phoneNumber: '(29) 372-17-18',
  },
];

const outlet1 = { id: outletMock[0].id, name: outletMock[0].name };
const outlet2 = { id: outletMock[1].id, name: outletMock[1].name };
const outlet3 = { id: outletMock[2].id, name: outletMock[2].name };

const outletRefMock: IReference = {
  id: '48',
  name: 'Магазины',
  data: outletMock,
};

// Задолженности
const debtMock = [
  { id: '66', contact: contact1, ondate: '18.05.2021', saldo: 2345600, saldoDebt: 1745 },
  { id: '67', contact: contact2, ondate: '18.05.2021', saldo: -1670, saldoDebt: 0 },
];

const debtRefMock: IReference = {
  id: '49',
  name: 'Задолженности',
  data: debtMock,
};

// Группы товаров
const goodGroupMock = [
  { id: '8', name: 'Готовая продукция', externalId: '147249053' },
  { id: '67', name: 'Колбасные изделия', externalId: '1472490541', parent: { id: 8, name: 'Готовая продукция' } },
  { id: '69', name: 'Копченности', externalId: '147249054', parent: { id: 8, name: 'Готовая продукция' } },
];

const goodGroupRefMock: IReference = {
  id: '50',
  name: 'Группы товаров',
  data: goodGroupMock,
};

const goodGroup1 = { id: goodGroupMock[0].id, name: goodGroupMock[0].name };
const goodGroup2 = { id: goodGroupMock[1].id, name: goodGroupMock[1].name };
const goodGroup3 = { id: goodGroupMock[2].id, name: goodGroupMock[2].name };

// Товары
const goodMock = [
  {
    id: '34',
    name: 'Пр. из св. к/в Ребра "Селянские" (газ)',
    externalId: '1576094048',
    alias: '5087',
    barcode: '12346789',
    vat: 20,
    goodgroup: goodGroup3,
    valuename: 'кг',
    priceFso: 15.6,
    priceFsn: 15.9,
    priceFsoSklad: 15.6,
    priceFsnSklad: 15.9,
  },
  {
    id: '35',
    name: 'К-са вар. из м/птицы "Свислочская" в/с',
    externalId: '1576094049',
    alias: '5088',
    barcode: '12346789',
    vat: 10,
    goodgroup: goodGroup2,
    valuename: 'кг',
    priceFso: 10,
    priceFsn: 12,
    priceFsoSklad: 10,
    priceFsnSklad: 12,
  },
  {
    id: '15',
    name: 'С-ки вар. из м/птицы "Боярские" в/с (газ)',
    externalId: '1576094050',
    alias: '5089',
    barcode: '12346789',
    vat: 10,
    goodgroup: goodGroup2,
    valuename: 'кг',
    priceFso: 7.3,
    priceFsn: 7.9,
    priceFsoSklad: 7.3,
    priceFsnSklad: 7.9,
  },
  {
    id: '15',
    name: 'Пр. из св. к/в "Буженинка "Фаворит" (вакуум, трансп. уп)',
    externalId: '1576094051',
    alias: '5090',
    barcode: '12346789',
    vat: 20,
    goodgroup: goodGroup3,
    valuename: 'кг',
    priceFso: 12.6,
    priceFsn: 12.9,
    priceFsoSklad: 12.6,
    priceFsnSklad: 12.9,
  },
];

const goodRefMock: IReference = {
  id: '50',
  name: 'Группы товаров',
  data: goodMock,
};

const good1 = { id: goodMock[0].id, name: goodMock[0].name };
const good2 = { id: goodMock[1].id, name: goodMock[1].name };
const good3 = { id: goodMock[2].id, name: goodMock[2].name };
const good4 = { id: goodMock[3].id, name: goodMock[3].name };

// Матрица номенклатур с ценами

const netPriceMock = [
  { id: '44', contact: contact1, good: good4 },
  { id: '45', contact: contact1, good: good1, priceFso: 10.8, priceFsn: 10.9 },
  { id: '46', contact: contact1, good: good2, priceFso: 6.8, priceFsn: 6.9 },
  { id: '47', contact: contact2, good: good4, priceFso: 9, priceFsn: 9.9 },
  { id: '48', contact: contact2, good: good3, priceFso: 14, priceFsn: 14.7 },
];

const netPriceRefMock: IReference = {
  id: '50',
  name: 'Группы товаров',
  data: netPriceMock,
};

// Документ Order

const orderMock: IOrderDocument[] = [
  {
    id: '9',
    number: '225',
    documentDate: '25.04.2021',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact1,
      outlet: outlet1,
      ondate: '25.04.2021',
    },
    lines: [
      { id: '10', good: good1, quantity: 12 },
      { id: '11', good: good2, quantity: 10 },
    ],
  },
  {
    id: '12',
    number: '226',
    documentDate: '25.04.2021',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact1,
      outlet: outlet2,
      ondate: '25.04.2021',
    },
    lines: [
      { id: '13', good: good3, quantity: 3 },
      { id: '14', good: good4, quantity: 1.2 },
    ],
  },
  {
    id: '18',
    number: '227',
    documentDate: '25.04.2021',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact2,
      outlet: outlet3,
      ondate: '25.04.2021',
      depart: { id: '87', name: 'Склад-магазин Полоцк' },
    },
    lines: [
      { id: '19', good: good2, quantity: 7.3 },
      { id: '21', good: good3, quantity: 4 },
      { id: '23', good: good1, quantity: 12 },
    ],
  },
  {
    id: '25',
    number: '228',
    documentDate: '25.04.2021',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact1,
      outlet: outlet1,
      ondate: '25.04.2021',
    },
    lines: [
      { id: '26', good: good3, quantity: 8.32 },
      { id: '28', good: good4, quantity: 9 },
      { id: '30', good: good1, quantity: 45 },
    ],
  },
];

//  Документ Route
const routeMock: IRouteDocument[] = [
  {
    id: '30506',
    number: '34',
    documentDate: '9579457',
    documentType: routeType,
    status: 'DRAFT',
    head: {
      agent: {
        id: '111111',
        name: 'петров',
      },
    },
    lines: [
      {
        id: '468',
        outlet: outlet3,
        ordNumber: 3,
        visited: true,
        result: 'ORDER',
      },
    ],
  },
];

export {
  documentTypeMock,
  routeMock,
  orderMock,
  contactRefMock,
  contact1,
  contact2,
  outletRefMock,
  outlet1,
  outlet2,
  outlet3,
  debtRefMock,
  goodGroupRefMock,
  goodGroup1,
  goodGroup2,
  goodGroup3,
  goodRefMock,
  good1,
  good2,
  good3,
  good4,
  netPriceRefMock,
};
