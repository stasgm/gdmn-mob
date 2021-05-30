import { IReference, ICompany, IUser, INamedEntity } from '@lib/types';
import { superAdmin, user } from '@lib/mock';

import { IOrderDocument, IRouteDocument } from './types';

const orderType = { id: '1', name: 'order' };
const routeType = { id: '33', name: 'route' };

const documentTypeMock = [orderType, routeType];

//companys

const companies: ICompany[] = [{ id: '855', name: 'Бройлерная птицефабрика', admin: user }];

const company = companies[0];

//users
const users: IUser[] = [
  {
    id: '15',
    externalId: '147012274',
    name: 'ГОЦЕЛЮК Н. А.',
    firstName: 'НАТАЛЬЯ',
    lastName: 'ГОЦЕЛЮК',
    phoneNumber: '8-044-788-86-44',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
  {
    id: '16',
    externalId: '147022858',
    name: 'ПАВЛОВСКАЯ А. Н.',
    firstName: 'АЛЁНА',
    lastName: 'ПАВЛОВСКАЯ',
    phoneNumber: '8-02238-22-209',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
  {
    id: '17',
    externalId: '147022859',
    name: 'ЧЕРНЫШОВ Ю. А.',
    firstName: 'ЮРИЙ',
    lastName: 'ЧЕРНЫШОВ',
    phoneNumber: '+37529-7820427',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
];

const agent1 = users[0];
const agent2 = users[1];
const agent3 = users[2];

// Организации
const contactMock = [
  {
    id: '2',
    name: 'ЗАО "Раница"',
    externalId: '147012312',
    contractNumber: '20/20',
    contractDate: '01.12.2020',
    paycond: 'отсрочка 14 к/д_поручение',
    phoneNumber: '(29) 437-23-67',
  },
  {
    id: '4',
    name: 'Иностранное унитарное предприятие "БелВиллесден',
    externalId: '147022850',
    contractNumber: '405/12',
    contractDate: '01.12.2020',
    paycond: 'отсрочка 35 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '5',
    name: 'ООО "ГРИНрозница"',
    externalId: '147012270',
    contractNumber: '11/20',
    contractDate: '01.12.2020',
    paycond: 'отсрочка 15 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '6',
    name: 'ООО "Евроторг"',
    externalId: '147012306',
    contractNumber: '1/2001',
    contractDate: '01.12.2020',
    paycond: 'отсрочка 15 б/д_требование',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '7',
    name: 'ООО "ПРОСТОРИТЕЙЛ"',
    externalId: '147004044',
    contractNumber: '1/21',
    contractDate: '01.12.2020',
    paycond: 'отсрочка 50 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
];
const contact1 = { id: contactMock[0].id, name: contactMock[0].name };
const contact2 = { id: contactMock[1].id, name: contactMock[1].name };
const contact3 = { id: contactMock[2].id, name: contactMock[2].name };
const contact4 = { id: contactMock[3].id, name: contactMock[3].name };
const contact5 = { id: contactMock[4].id, name: contactMock[4].name };

const contactRefMock: IReference = {
  id: '47',
  name: 'Организации',
  data: contactMock,
};

// Магазины
const outletMock = [
  {
    id: '71',
    name: 'м-н центральный',
    externalId: '147012318',
    company: contact1,
    address: ' г. Орша , ул.Ленина, 63',
    phoneNumber: '(29) 115-23-19',
  },
  {
    id: '72',
    name: 'ЗАО "Раница"',
    externalId: '147012314',
    company: contact1,
    address: 'г. Орша ,  ул.Ленина, 63 ',
    phoneNumber: '(29) 522-28-24',
  },
  {
    id: '74',
    name: 'ЗАО "Раница"  - универсам Раница цех',
    externalId: '147012316',
    company: contact1,
    address: 'г. Орша , ул Могилевская,35',
    phoneNumber: '(29) 372-17-18',
  },
  {
    id: '75',
    name: 'ГИППО на Горецкого',
    externalId: '147022852',
    company: contact2,
    address: 'г. Минск , ул. Горецкого, 2',
    phoneNumber: '(29) 115-23-19',
  },
  {
    id: '76',
    name: 'ГИППО Игуменский тракт',
    externalId: '147022851',
    company: contact2,
    address: 'г. Минск , Игуменский тракт, 30',
    phoneNumber: '(29) 522-28-24',
  },
  {
    id: '78',
    name: 'ООО "ГРИНРозница" магазин "ГРИН"-АРЕНА, Минск, пр.Поб-лей,84',
    externalId: '147012302',
    company: contact3,
    address: 'г. Минск , пр.Победителей,84',
    phoneNumber: '(29) 372-17-18',
  },
  {
    id: '79',
    name: 'ООО "ГРИНрозница" Магазин "ГРИН-12" Чижовка',
    externalId: '147012300',
    company: contact3,
    address: 'г. Минск , ул. Уборевича, 176',
    phoneNumber: '(29) 115-23-19',
  },
  {
    id: '80',
    name: 'Магазин "Евроторг" № 6183',
    externalId: '147012308',
    company: contact4,
    address: 'г. Минск , ул. Асаналиева, 44',
    phoneNumber: '(29) 522-28-24',
  },
  {
    id: '81',
    name: 'Магазин "Евроторг" № 488 ул. Воронянского',
    externalId: '147022948',
    company: contact4,
    address: 'г. Минск , ул. Воронянского, 17',
    phoneNumber: '(29) 372-17-18',
  },
  {
    id: '82',
    name: 'ООО "ПРОСТОРИТЕЙЛ" ул. Каменногорская, 3',
    externalId: '147022849',
    company: contact5,
    address: 'г. Минск , ул. Каменногорская, 3',
    phoneNumber: '(29) 115-23-19',
  },
  {
    id: '83',
    name: 'ООО "ПРОСТОРИТЕЙЛ" пр-т Дзержинского, 126',
    externalId: '147004046',
    company: contact5,
    address: 'г. Минск , пр-т Дзержинского, 126',
    phoneNumber: '(29) 522-28-24',
  },
];

const outlet1 = { id: outletMock[0].id, name: outletMock[0].name };
const outlet2 = { id: outletMock[1].id, name: outletMock[1].name };
const outlet3 = { id: outletMock[2].id, name: outletMock[2].name };
const outlet4 = { id: outletMock[3].id, name: outletMock[3].name };
const outlet5 = { id: outletMock[4].id, name: outletMock[4].name };
const outlet6 = { id: outletMock[5].id, name: outletMock[5].name };
const outlet7 = { id: outletMock[6].id, name: outletMock[6].name };
const outlet8 = { id: outletMock[7].id, name: outletMock[7].name };
const outlet9 = { id: outletMock[8].id, name: outletMock[8].name };
const outlet10 = { id: outletMock[9].id, name: outletMock[9].name };
const outlet11 = { id: outletMock[10].id, name: outletMock[10].name };

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

const goodRefMock: IReference<INamedEntity> = {
  id: '50',
  name: 'Товары',
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
    status: 'SENT',
    head: {
      contact: contact2,
      outlet: outlet2,
      ondate: '28.04.2021',
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
    status: 'PROCESSED',
    head: {
      contact: contact3,
      outlet: outlet3,
      ondate: '27.04.2021',
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
    documentDate: '25.01.2021',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact4,
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
    number: '1',
    documentDate: '28.05.2021',
    documentType: routeType,
    status: 'DRAFT',
    head: {
      externalId: { id: '147019506' },
      agent: agent3,
    },
    lines: [
      {
        id: '460',
        externalId: { id: '147022971' },
        outlet: outlet11,
        ordNumber: 1,
        visited: true,
        result: undefined,
      },
      {
        id: '461',
        externalId: { id: '147022972' },
        outlet: outlet10,
        ordNumber: 2,
        visited: true,
        result: undefined,
      },
      {
        id: '462',
        externalId: { id: '147022973' },
        outlet: outlet9,
        ordNumber: 3,
        visited: true,
        result: undefined,
      },
      {
        id: '463',
        externalId: { id: '147022974' },
        outlet: outlet8,
        ordNumber: 4,
        visited: true,
        result: undefined,
      },
    ],
  },
  {
    id: '30506',
    number: '2',
    documentDate: '28.05.2021',
    documentType: routeType,
    status: 'DRAFT',
    head: {
      externalId: { id: '147022890' },
      agent: agent1,
    },
    lines: [
      {
        externalId: { id: '147022903' },
        id: '468',
        outlet: outlet2,
        ordNumber: 1,
        visited: true,
        result: undefined,
      },
      {
        externalId: { id: '147022904' },
        id: '468',
        outlet: outlet3,
        ordNumber: 2,
        visited: true,
        result: undefined,
      },
      {
        externalId: { id: '147022905' },
        id: '468',
        outlet: outlet1,
        ordNumber: 3,
        visited: true,
        result: undefined,
      },
    ],
  },
  {
    id: '30506',
    number: '3',
    documentDate: '28.05.2021',
    documentType: routeType,
    status: 'PROCESSED',
    head: {
      externalId: { id: '147022891' },
      agent: agent2,
    },
    lines: [
      {
        externalId: { id: '147022899' },
        id: '468',
        outlet: outlet4,
        ordNumber: 1,
        visited: true,
        result: undefined,
      },
      {
        externalId: { id: '147022900' },
        id: '468',
        outlet: outlet5,
        ordNumber: 2,
        visited: true,
        result: undefined,
      },
      {
        externalId: { id: '147022901' },
        id: '468',
        outlet: outlet7,
        ordNumber: 3,
        visited: true,
        result: undefined,
      },
      {
        externalId: { id: '147022902' },
        id: '468',
        outlet: outlet6,
        ordNumber: 4,
        visited: true,
        result: undefined,
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
  contact3,
  contact4,
  contact5,
  outletRefMock,
  outlet1,
  outlet2,
  outlet3,
  outlet4,
  outlet5,
  outlet6,
  outlet7,
  outlet8,
  outlet9,
  outlet10,
  outlet11,
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
  users,
  agent1,
  agent2,
  agent3,
  companies,
  company,
};
