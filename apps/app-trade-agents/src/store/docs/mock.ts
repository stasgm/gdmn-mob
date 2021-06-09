import { IReference, ICompany, IUser, INamedEntity } from '@lib/types';
import { superAdmin, user } from '@lib/mock';

import { IDepartment, IOrderDocument, IPackage, IPackageGood, IReturnDocument, IRouteDocument } from './types';

const orderType = { id: '147010699', name: 'order' };
const routeType = { id: '147019291', name: 'route' };
const returnType = { id: '147019292', name: 'return' };

const documentTypeMock = [orderType, routeType, returnType];

//companys

const companies: ICompany[] = [{ id: '855', name: 'Бройлерная птицефабрика', admin: user }];

const company = companies[0];

//users
const users: IUser[] = [
  {
    id: '147012274',
    name: 'ГОЦЕЛЮК Н. А.',
    firstName: 'НАТАЛЬЯ',
    lastName: 'ГОЦЕЛЮК',
    phoneNumber: '8-044-788-86-44',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
  {
    id: '147022858',
    name: 'ПАВЛОВСКАЯ А. Н.',
    firstName: 'АЛЁНА',
    lastName: 'ПАВЛОВСКАЯ',
    phoneNumber: '8-02238-22-209',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
  {
    id: '147022859',
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
    id: '147012312',
    name: 'ЗАО "Раница"',
    contractNumber: '20/20',
    contractDate: '2020-06-04',
    paycond: 'отсрочка 14 к/д_поручение',
    phoneNumber: '(29) 437-23-67',
  },
  {
    id: '147022850',
    name: 'Иностранное унитарное предприятие "БелВиллесден',
    contractNumber: '405/12',
    contractDate: '2021-01-04',
    paycond: 'отсрочка 35 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '147012270',
    name: 'ООО "ГРИНрозница"',
    contractNumber: '11/20',
    contractDate: '2021-03-04',
    paycond: 'отсрочка 15 к/д_поручение',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '147012306',
    name: 'ООО "Евроторг"',
    contractNumber: '1/2001',
    contractDate: '2021-02-01',
    paycond: 'отсрочка 15 б/д_требование',
    phoneNumber: '(29) 522-23-18',
  },
  {
    id: '147004044',
    name: 'ООО "ПРОСТОРИТЕЙЛ"',
    contractNumber: '1/21',
    contractDate: '2021-01-01',
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
    id: '147012318',
    name: 'Магазин центральный',
    company: contact1,
    address: 'г.Орша, ул.Ленина, 63',
    phoneNumber: '8(29) 115-23-19',
    lat: 54.51786,
    lon: 30.434586,
  },
  {
    id: '147012314',
    name: 'ЗАО "Раница"',
    company: contact1,
    address: 'г.Орша, ул.Ленина, 176 ',
    phoneNumber: '8(29) 522-28-24',
    lat: 54.5334351,
    lon: 30.4409762,
  },
  {
    id: '147012316',
    name: 'ЗАО "Раница" - универсам Раница цех',
    company: contact1,
    address: 'г.Орша, ул Могилевская, 35',
    phoneNumber: '8(29) 372-17-18',
    lat: 54.500542,
    lon: 30.43622,
  },
  {
    id: '147022852',
    name: 'ГИППО на Горецкого',
    company: contact2,
    address: 'г.Минск, ул. Горецкого, 2',
    phoneNumber: '8(29) 115-23-19',
    lat: 53.876489,
    lon: 27.46603,
  },
  {
    id: '147022851',
    name: 'ГИППО Игуменский тракт',
    company: contact2,
    address: 'г.Минск, Игуменский тракт, 30',
    phoneNumber: '8(29) 522-28-24',
    lat: 53.840402,
    lon: 27.573128,
  },
  {
    id: '147012302',
    name: 'ООО "ГРИНРозница" магазин "ГРИН"-АРЕНА, Минск, пр.Поб-лей,84',
    company: contact3,
    address: 'г.Минск, пр.Победителей, 84',
    phoneNumber: '8(29) 372-17-18',
    lat: 53.938014,
    lon: 27.487857,
  },
  {
    id: '147012300',
    name: 'ООО "ГРИНрозница" Магазин "ГРИН-12" Чижовка',
    company: contact3,
    address: 'г. Минск , ул. Уборевича, 176',
    phoneNumber: '8(29) 115-23-19',
    lat: 53.835385,
    lon: 27.606179,
  },
  {
    id: '147012308',
    name: 'Магазин "Евроторг" № 6183',
    company: contact4,
    address: 'г.Минск, ул. Асаналиева, 44',
    phoneNumber: '8(29) 522-28-24',
    lat: 53.85118,
    lon: 27.544414,
  },
  {
    id: '147022948',
    name: 'Магазин "Евроторг" № 488 ул. Воронянского',
    company: contact4,
    address: 'г.Минск, ул. Воронянского, 17',
    phoneNumber: '(29) 372-17-18',
    lat: 53.87813,
    lon: 27.547373,
  },
  {
    id: '147022849',
    name: 'ООО "ПРОСТОРИТЕЙЛ" ул. Каменногорская, 3',
    company: contact5,
    address: 'г.Минск, ул. Каменногорская, 3',
    phoneNumber: '(29) 115-23-19',
    lat: 53.911127,
    lon: 27.415492,
  },
  {
    id: '147004046',
    name: 'ООО "ПРОСТОРИТЕЙЛ" пр-т Дзержинского, 126',
    company: contact5,
    address: 'г.Минск, пр-т Дзержинского, 126',
    phoneNumber: '8(29) 522-28-24',
    lat: 53.847422,
    lon: 27.471088,
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
  { id: '66', contact: contact1, ondate: '2021-06-04', saldo: 2345600, saldoDebt: 1745 },
  { id: '67', contact: contact2, ondate: '2021-06-02', saldo: -1670, saldoDebt: 0 },
];

const debtRefMock: IReference = {
  id: '49',
  name: 'Задолженности',
  data: debtMock,
};

// Группы товаров
const goodGroupMock = [
  { id: '147011905', name: '01. Цех по производству готовой продукции' },
  {
    id: '147011924',
    name: '35. Колбасы вареные ЦГП',
    externalId: '',
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
  },
  {
    id: '1470119264',
    name: '36. Сосиски ЦГП',
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
  },
  { id: '147012038', name: '02. Цех убоя и переработки №2' },
  {
    id: '147012040',
    name: '01. Тушки цыпл.бр 1 сорта цех убоя 2(охл. продукция)',
    parent: { id: '147012038', name: '02. Цех убоя и переработки №2' },
  },
  {
    id: '147012044',
    name: '02. Тушки цыпл.бр 1 сорта цех убоя 2 (зам. продукция)',
    parent: { id: '147012038', name: '02. Цех убоя и переработки №2' },
  },
  { id: '147012056', name: '03. Цех убоя и переработки №1' },
  {
    id: '147012058',
    name: '03. Тушки кур  цех убоя 1 (охл. продукция)',
    parent: { id: '147012056', name: '03. Цех убоя и переработки №1' },
  },
  {
    id: '147012062',
    name: '11. Разделка цех убоя 1 (углубленная)(заморозка)',
    parent: { id: '147012056', name: '03. Цех убоя и переработки №1' },
  },
];

const goodGroupRefMock: IReference = {
  id: '50',
  name: 'Группы товаров',
  data: goodGroupMock,
};

const goodGroup1 = { id: goodGroupMock[0].id, name: goodGroupMock[0].name };
const goodGroup2 = { id: goodGroupMock[1].id, name: goodGroupMock[1].name };
const goodGroup3 = { id: goodGroupMock[2].id, name: goodGroupMock[2].name };
const goodGroup4 = { id: goodGroupMock[3].id, name: goodGroupMock[3].name };
const goodGroup5 = { id: goodGroupMock[4].id, name: goodGroupMock[4].name };
const goodGroup6 = { id: goodGroupMock[5].id, name: goodGroupMock[5].name };
const goodGroup7 = { id: goodGroupMock[6].id, name: goodGroupMock[6].name };
const goodGroup8 = { id: goodGroupMock[7].id, name: goodGroupMock[7].name };
const goodGroup9 = { id: goodGroupMock[8].id, name: goodGroupMock[8].name };

// Товары
const goodMock = [
  {
    id: '147012192',
    name: 'Сосиски из м.п."Банзай" в/с групп.уп. газ.ср.',
    alias: '5087',
    barcode: '4810173017073',
    vat: 20,
    goodgroup: goodGroup2,
    valuename: 'кг',
    priceFso: 15.6,
    priceFsn: 15.9,
    priceFsoSklad: 15.6,
    priceFsnSklad: 15.9,
  },
  {
    id: '147012186',
    name: 'Колбаса вар. из м/пт "Сочная" б/с 0,45',
    alias: '5088',
    barcode: '4810173012931',
    vat: 10,
    goodgroup: goodGroup2,
    valuename: 'шт',
    invWeight: 0.45,
    priceFso: 3,
    priceFsn: 3.7,
    priceFsoSklad: 3,
    priceFsnSklad: 3.7,
  },
  {
    id: '147012224',
    name: 'Мясо птицы. Тушка цыпл. бр. потрошеная 1с (12кг) охл ',
    alias: '5089',
    barcode: '4810173011514',
    vat: 10,
    goodgroup: goodGroup4,
    valuename: 'кг',
    invWeight: 12,
    priceFso: 17.3,
    priceFsn: 17.9,
    priceFsoSklad: 17.3,
    priceFsnSklad: 17.9,
  },
  {
    id: '147012166',
    name: 'Тушка цып. бр. 1 сорта зам.',
    alias: '5090',
    barcode: '12346789',
    vat: 20,
    goodgroup: goodGroup5,
    valuename: 'кг',
    invWeight: 1,
    priceFso: 12.6,
    priceFsn: 12.9,
    priceFsoSklad: 12.6,
    priceFsnSklad: 12.9,
  },
  {
    id: '147012174',
    name: 'Мясо птицы. Тушка кур потрошеная 2с охл.',
    alias: '5091',
    barcode: '12346789',
    vat: 10,
    goodgroup: goodGroup7,
    valuename: 'кг',
    invWeight: 1,
    priceFso: 7.3,
    priceFsn: 7.9,
    priceFsoSklad: 7.3,
    priceFsnSklad: 7.9,
  },
  {
    id: '147012176',
    name: 'П-кт разд и обвал м.п. Мясо бескост. окороч. с кожей лот.зам',
    alias: '5092',
    barcode: '12346789',
    vat: 20,
    goodgroup: goodGroup8,
    valuename: 'кг',
    invWeight: 1,
    priceFso: 12.6,
    priceFsn: 12.9,
    priceFsoSklad: 12.6,
    priceFsnSklad: 12.9,
  },
];

const goodRefMock: IReference<INamedEntity> = {
  id: '51',
  name: 'Товары',
  data: goodMock,
};

const good1 = { id: goodMock[0].id, name: goodMock[0].name };
const good2 = { id: goodMock[1].id, name: goodMock[1].name };
const good3 = { id: goodMock[2].id, name: goodMock[2].name };
const good4 = { id: goodMock[3].id, name: goodMock[3].name };
const good5 = { id: goodMock[4].id, name: goodMock[4].name };
const good6 = { id: goodMock[5].id, name: goodMock[5].name };

// Матрица номенклатур с ценами

const netPriceMock = [
  { id: '44', contact: contact1, good: good4 },
  { id: '45', contact: contact1, good: good1, priceFso: 10.8, priceFsn: 10.9 },
  { id: '46', contact: contact1, good: good2, priceFso: 6.8, priceFsn: 6.9 },
  { id: '47', contact: contact2, good: good4, priceFso: 9, priceFsn: 9.9 },
  { id: '48', contact: contact2, good: good3, priceFso: 14, priceFsn: 14.7 },
];

const netPriceRefMock: IReference = {
  id: '55',
  name: 'Цены',
  data: netPriceMock,
};

// Упаковки
const packageMock: IPackage[] = [
  { id: '400901187', name: 'Мал. подл.' },
  { id: '400959429', name: 'Больш. подл.' },
  { id: '514132623', name: 'мал. батон' },
  { id: '615762858', name: 'большой батон 5' },
  { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
  { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
  { id: '1758284018', name: '1 кг, п/ёмк' },
  { id: '1758284020', name: '2 кг, п/ёмк' },
  { id: '1901754964', name: '1кг охл' },
  { id: '1901775186', name: '2 кг зам' },
  { id: '1901776044', name: '1кг зам' },
];

const packageRefMock: IReference<IPackage> = {
  id: '56',
  name: 'Упаковки',
  data: packageMock,
};

// Связка товары - упаковки
const packageGoodMock: IPackageGood[] = [
  { id: '147012137', good: good2, package: packageMock[2] },
  { id: '147012138', good: good2, package: packageMock[3] },
  { id: '147012139', good: good5, package: packageMock[4] },
  { id: '147012140', good: good5, package: packageMock[8] },
  { id: '147012141', good: good5, package: packageMock[7] },
  { id: '147012142', good: good1, package: packageMock[0] },
  { id: '147012143', good: good1, package: packageMock[1] },
  { id: '147012144', good: good3, package: packageMock[4] },
  { id: '147012145', good: good3, package: packageMock[5] },
  { id: '147012146', good: good3, package: packageMock[7] },
  { id: '147012147', good: good3, package: packageMock[6] },
  { id: '147012148', good: good4, package: packageMock[10] },
  { id: '147012149', good: good4, package: packageMock[9] },
  { id: '147012150', good: good6, package: packageMock[9] },
  { id: '147012151', good: good6, package: packageMock[10] },
];

const packageGoodRefMock: IReference<IPackageGood> = {
  id: '57',
  name: 'Упаковки-товары',
  data: packageGoodMock,
};

//  Документ Route
const routeMock: IRouteDocument[] = [
  {
    id: '147019506',
    number: '1',
    documentDate: '2021-06-04',
    documentType: routeType,
    status: 'DRAFT',
    head: {
      agent: agent1,
    },
    lines: [
      {
        id: '147022971',
        outlet: outlet11,
        ordNumber: 1,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022972',
        outlet: outlet10,
        ordNumber: 2,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022973',
        outlet: outlet9,
        ordNumber: 3,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022974',
        outlet: outlet8,
        ordNumber: 5,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022913',
        outlet: outlet4,
        ordNumber: 6,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022933',
        outlet: outlet5,
        ordNumber: 4,
        visited: true,
        // result: undefined,
      },
    ],
  },
  {
    id: '147022890',
    number: '2',
    documentDate: '2021-05-27',
    documentType: routeType,
    status: 'DRAFT',
    head: {
      agent: agent1,
    },
    lines: [
      {
        id: '147022903',
        outlet: outlet2,
        ordNumber: 1,
        visited: true,
        // result: undefined,
      },
      {
        id: '147022904',
        outlet: outlet3,
        ordNumber: 2,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022905',
        outlet: outlet1,
        ordNumber: 3,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022902',
        outlet: outlet4,
        ordNumber: 2,
        visited: true,
        // result: undefined,
      },
    ],
  },
  {
    id: '147022891',
    number: '3',
    documentDate: '2021-05-31',
    documentType: routeType,
    status: 'PROCESSED',
    head: {
      agent: agent1,
    },
    lines: [
      {
        id: '147022899',
        outlet: outlet4,
        ordNumber: 1,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022900',
        outlet: outlet5,
        ordNumber: 2,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022901',
        outlet: outlet7,
        ordNumber: 3,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022902',
        outlet: outlet6,
        ordNumber: 4,
        visited: true,
        //  result: undefined,
      },
      {
        id: '147022903',
        outlet: outlet8,
        ordNumber: 5,
        visited: true,
        //  result: undefined,
      },
    ],
  },
];

const route1 = { id: routeMock[0].id, name: routeMock[0].documentDate };

// Документ Order
const orderMock: IOrderDocument[] = [
  {
    id: '147023007',
    number: '225',
    documentDate: '2021-06-04',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact1,
      outlet: outlet1,
      ondate: '2021-06-07',
    },
    lines: [
      { id: '147023073', good: good3, quantity: 4 },
      { id: '147023074', good: good6, quantity: 2 },
    ],
  },
  {
    id: '147023008',
    number: '226',
    documentDate: '2021-05-31',
    documentType: orderType,
    status: 'SENT',
    head: {
      contact: contact1,
      outlet: outlet3,
      ondate: '2021-06-01',
    },
    lines: [
      { id: '147023076', good: good5, quantity: 23 },
      { id: '147023077', good: good1, quantity: 1 },
    ],
  },
  {
    id: '147023009',
    number: '227',
    documentDate: '2021-06-01',
    documentType: orderType,
    status: 'PROCESSED',
    head: {
      contact: contact1,
      outlet: outlet2,
      ondate: '2021-06-02',
    },
    lines: [
      { id: '147023078', good: good2, quantity: 45 },
      { id: '147023080', good: good4, quantity: 2 },
    ],
  },
  {
    id: '147023010',
    number: '228',
    documentDate: '2021-06-02',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: contact3,
      outlet: outlet6,
      ondate: '2021-06-03',
    },
    lines: [
      { id: '147023082', good: good4, quantity: 10 },
      { id: '147023083', good: good6, quantity: 5 },
    ],
  },
  {
    id: '147023011',
    number: '229',
    documentDate: '2021-06-04',
    documentType: orderType,
    status: 'DRAFT',
    head: {
      contact: outletMock[10].company,
      outlet: outlet11,
      road: route1,
      ondate: '2021-06-07',
    },
    lines: [],
  },
];

const departmetsMock: IDepartment[] = [
  { id: '147012303', name: 'Склад №1' },
  { id: '147012304', name: 'Склад №2' },
  { id: '147012305', name: 'Склад №3' },
];

const deprt1 = departmetsMock[0];
const deprt2 = departmetsMock[1];
const deprt3 = departmetsMock[2];

// Документ Return
const returnDocMock: IReturnDocument[] = [
  {
    id: '147023012',
    number: '230',
    documentDate: '2021-06-04',
    documentType: returnType,
    status: 'DRAFT',
    head: {
      contact: contact1,
      outlet: outlet2,
      depart: deprt1,
      reason: 'Брак',
    },
    lines: [
      { id: '147023073', good: good3, quantity: 4 },
      { id: '147023074', good: good6, quantity: 2 },
    ],
  },
  {
    id: '147023013',
    number: '231',
    documentDate: '2021-05-31',
    documentType: returnType,
    status: 'SENT',
    head: {
      contact: contact1,
      outlet: outlet4,
      depart: deprt2,
      reason: 'Брак',
    },
    lines: [
      { id: '147023076', good: good5, quantity: 23 },
      { id: '147023077', good: good1, quantity: 1 },
    ],
  },
  {
    id: '147023014',
    number: '232',
    documentDate: '2021-06-01',
    documentType: returnType,
    status: 'PROCESSED',
    head: {
      contact: contact1,
      outlet: outlet5,
      depart: deprt3,
      reason: 'Брак',
    },
    lines: [],
  },
];

export {
  documentTypeMock,
  routeMock,
  orderMock,
  returnDocMock,
  departmetsMock,
  deprt1,
  deprt2,
  deprt3,
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
  goodGroup4,
  goodGroup5,
  goodGroup6,
  goodGroup7,
  goodGroup8,
  goodGroup9,
  goodRefMock,
  good1,
  good2,
  good3,
  good4,
  good5,
  good6,
  netPriceRefMock,
  users,
  agent1,
  agent2,
  agent3,
  companies,
  company,
  packageRefMock,
  packageGoodRefMock,
};
