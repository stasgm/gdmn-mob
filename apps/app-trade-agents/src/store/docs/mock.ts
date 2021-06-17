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
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
  },
  {
    id: '147011926',
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
  {
    id: '147012046',
    name: '08. Разделка цех убоя 2 (классическая)(заморозка)',
    parent: { id: '147012038', name: '02. Цех убоя и переработки №2' },
  },
  {
    id: '147012048',
    name: '09. Разделка цех убоя 2 (классическая) (охл. продукция)',
    parent: { id: '147012038', name: '02. Цех убоя и переработки №2' },
  },
  {
    id: '147012050',
    name: '10. Разделка цех убоя 2 (углубленная)(заморозка)',
    parent: { id: '147012038', name: '02. Цех убоя и переработки №2' },
  },
  {
    id: '147012064',
    name: '23. П/ф быстр.пригот. цех убоя 1 (зам. продукция)',
    parent: { id: '147012056', name: '03. Цех убоя и переработки №1' },
  },
  {
    id: '147012066',
    name: '25. П/ф в маринаде цех убоя 1 (зам. продукция)',
    parent: { id: '147012056', name: '03. Цех убоя и переработки №1' },
  },
  {
    id: '147012070',
    name: '31. Колбаски сырые цех убоя 1 (зам. продукция)',
    parent: { id: '147012056', name: '03. Цех убоя и переработки №1' },
  },
  {
    id: '147011928',
    name: '37. Сардельки ЦГП',
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
  },
  {
    id: '147011930',
    name: '38. Ветчины ЦГП',
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
  },
  {
    id: '147011932',
    name: '39. Рулеты  ЦГП',
    parent: { id: '147011905', name: '01. Цех по производству готовой продукции' },
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
    goodgroup: goodGroup5,
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
    goodgroup: goodGroup6,
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
    goodgroup: goodGroup8,
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
    goodgroup: goodGroup9,
    valuename: 'кг',
    invWeight: 1,
    priceFso: 12.6,
    priceFsn: 12.9,
    priceFsoSklad: 12.6,
    priceFsnSklad: 12.9,
  },
  {
    id: '147012234',
    name: 'П/ф "Цыплята-гриль по домашнему" (п/э пакет) зам.',
    goodgroup: goodGroupMock[12],
    alias: '',
    barcode: 4810173004950,
    priceFsn: 7.9,
    priceFso: 7.9,
    priceFsnSklad: 7.9,
    priceFsoSklad: 7.9,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012232',
    name: 'П/ф из м.п. "Гуляш с грибной приправой" (пол. емк.) зам.',
    goodgroup: goodGroupMock[12],
    alias: '',
    barcode: 4810173011965,
    priceFsn: 7.9,
    priceFso: 7.9,
    priceFsnSklad: 7.9,
    priceFsoSklad: 7.9,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012230',
    name: 'Мясо птицы.Тушка цыпл. бр. потр. 1/с(в п/эт пак)охл13 халяль',
    goodgroup: goodGroup5,
    alias: '',
    barcode: 4810173016526,
    priceFsn: 7.9,
    priceFso: 7.9,
    priceFsnSklad: 7.9,
    priceFsoSklad: 7.9,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012228',
    name: 'Мясо птицы. Тушка цыпл. бр. потрошеная 1с (13кг) охл',
    goodgroup: goodGroup5,
    alias: '',
    barcode: 4810173015994,
    priceFsn: 7.9,
    priceFso: 7.9,
    priceFsnSklad: 7.9,
    priceFsoSklad: 7.9,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012226',
    name: 'Мясо птицы. Тушка цыпл. бр. потр.1/с (в п/эт пак)охл халяль',
    goodgroup: goodGroup5,
    alias: '',
    barcode: 4810173007203,
    priceFsn: 7.9,
    priceFso: 7.9,
    priceFsnSklad: 7.9,
    priceFsoSklad: 7.9,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012222',
    name: 'Продукт из м.п. Рулет "Европейский люкс" к/в в/с 0,5(газ.ср)',
    goodgroup: goodGroupMock[17],
    alias: '',
    barcode: 4810173015086,
    priceFsn: 6.7,
    priceFso: 6.7,
    priceFsnSklad: 6.7,
    priceFsoSklad: 6.7,
    valuename: 'кг',
    invWeight: 0.5,
    vat: 20,
  },
  {
    id: '147012220',
    name: 'Продукт из м.п. Рулет "Южный" к/в 1с',
    goodgroup: goodGroupMock[17],
    alias: '',
    barcode: 4810173012122,
    priceFsn: 6.7,
    priceFso: 6.7,
    priceFsnSklad: 6.7,
    priceFsoSklad: 6.7,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012218',
    name: 'Рулет "Ароматный " к/в  в/с (групп.уп.газ.ср.)',
    goodgroup: goodGroupMock[17],
    alias: '',
    barcode: 4810173009207,
    priceFsn: 6.7,
    priceFso: 6.7,
    priceFsnSklad: 6.7,
    priceFsoSklad: 6.7,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012216',
    name: 'П-т из м.п.Рулет "Европейский люкс"ТМ"Очень" к/в в/с газ.ср.',
    goodgroup: goodGroupMock[17],
    alias: '',
    barcode: 4810173012382,
    priceFsn: 6.7,
    priceFso: 6.7,
    priceFsnSklad: 6.7,
    priceFsoSklad: 6.7,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012214',
    name: 'Изделие из м.п. "Ветчина для завтрака" варен. рубл. 0,55',
    goodgroup: goodGroupMock[16],
    alias: '',
    barcode: 4810173015734,
    priceFsn: 6.7,
    priceFso: 6.7,
    priceFsnSklad: 6.7,
    priceFsoSklad: 6.7,
    valuename: 'шт.',
    invWeight: 0.55,
    vat: 20,
  },
  {
    id: '147012212',
    name: 'Изделие из м.п. "Ветчина для завтрака" варен. рубл.',
    goodgroup: goodGroupMock[16],
    alias: '',
    barcode: 4810173015741,
    priceFsn: 8,
    priceFso: 8,
    priceFsnSklad: 8,
    priceFsoSklad: 8,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012210',
    name: 'Ветчина вар. руб. "Балерон" в/с',
    goodgroup: goodGroupMock[16],
    alias: '',
    barcode: 4810173009191,
    priceFsn: 11,
    priceFso: 11,
    priceFsnSklad: 11,
    priceFsoSklad: 11,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012208',
    name: 'Ветчина вар. руб. "Нежность люкс" 1/с',
    goodgroup: goodGroupMock[16],
    alias: '',
    barcode: 4810173006039,
    priceFsn: 12,
    priceFso: 12,
    priceFsnSklad: 12,
    priceFsoSklad: 12,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012206',
    name: 'Сардельки из м.п. "Купеческие люкс с сыром" в/с (групп.уп.)',
    goodgroup: goodGroupMock[15],
    alias: '',
    barcode: '',
    priceFsn: 9.54,
    priceFso: 9.54,
    priceFsnSklad: 9.54,
    priceFsoSklad: 9.54,
    valuename: 'кг',
    invWeight: 0.33,
    vat: 20,
  },
  {
    id: '147012204',
    name: 'Сардельки "Шпикачки обеденные" в/с (груп. уп. газ.ср.)',
    goodgroup: goodGroupMock[15],
    alias: '',
    barcode: 4810173013518,
    priceFsn: 3.56,
    priceFso: 3.56,
    priceFsnSklad: 3.56,
    priceFsoSklad: 3.56,
    valuename: 'кг',
    invWeight: 0.33,
    vat: 20,
  },
  {
    id: '147012202',
    name: 'Сардельки из м.п. "Бон аппетит" б/с',
    goodgroup: goodGroupMock[15],
    alias: '',
    barcode: 4810173012221,
    priceFsn: 5.92,
    priceFso: 5.92,
    priceFsnSklad: 5.92,
    priceFsoSklad: 5.92,
    valuename: 'кг',
    invWeight: 0.33,
    vat: 20,
  },
  {
    id: '147012200',
    name: 'Сардельки из м.п. "Купеческие люкс с сыром" в/с',
    goodgroup: goodGroupMock[15],
    alias: '',
    barcode: 4810173004554,
    priceFsn: 12.9,
    priceFso: 12.9,
    priceFsnSklad: 12.9,
    priceFsoSklad: 12.9,
    valuename: 'кг',
    invWeight: 0.33,
    vat: 20,
  },
  {
    id: '147012198',
    name: 'Сосиски из м.п. "Докторские Гостовские"в/с (груп.уп.газ.ср.)',
    goodgroup: goodGroup3,
    alias: '',
    barcode: 4810173014942,
    priceFsn: 9.54,
    priceFso: 9.54,
    priceFsnSklad: 9.54,
    priceFsoSklad: 9.54,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012196',
    name: 'Сосиски из м.п. "Переменка" в/с групп.уп.газ.ср.',
    goodgroup: goodGroup3,
    alias: '',
    barcode: 4810173017967,
    priceFsn: 9.54,
    priceFso: 9.54,
    priceFsnSklad: 9.54,
    priceFsoSklad: 9.54,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012194',
    name: 'Сосиски "Вкусные" в/с',
    goodgroup: goodGroup3,
    alias: '',
    barcode: 4810173009757,
    priceFsn: 8,
    priceFso: 8,
    priceFsnSklad: 8,
    priceFsoSklad: 8,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012190',
    name: 'Колбаса вар. из м.п. "Банзай" в/с',
    goodgroup: goodGroup2,
    alias: '',
    barcode: 4810173017097,
    priceFsn: 11,
    priceFso: 11,
    priceFsnSklad: 11,
    priceFsoSklad: 11,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012188',
    name: 'Колбаса вар. из. м.п. "Любительская от Ганны" в/с газ. ср.',
    goodgroup: goodGroup2,
    alias: '',
    barcode: 4810173015017,
    priceFsn: 9.54,
    priceFso: 9.54,
    priceFsnSklad: 9.54,
    priceFsoSklad: 9.54,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012182',
    name: 'П/ф мяс. рубл.форм. из м.п. Колбаски сырые "Вкусные" 530 зам',
    goodgroup: goodGroupMock[14],
    alias: '',
    barcode: '',
    priceFsn: 8,
    priceFso: 8,
    priceFsnSklad: 8,
    priceFsoSklad: 8,
    valuename: 'кг',
    invWeight: 0.63,
    vat: 20,
  },
  {
    id: '147012180',
    name: 'П/ф голень цыпл. бр. в маринаде "Для гриля" полим. емк. зам.',
    goodgroup: goodGroupMock[13],
    alias: '',
    barcode: '',
    priceFsn: 6.75,
    priceFso: 6.75,
    priceFsnSklad: 6.75,
    priceFsoSklad: 6.75,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012178',
    name: 'П/ф м/пт б/пр рулет "Домашнее лакомство" (полим.емк.) зам.',
    goodgroup: goodGroupMock[12],
    alias: '',
    barcode: '',
    priceFsn: 4.6,
    priceFso: 4.6,
    priceFsnSklad: 4.6,
    priceFsoSklad: 4.6,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012172',
    name: 'Продукт разделки и обвалки "Грудная кость ц/бр", (п/эт) зам',
    goodgroup: goodGroupMock[11],
    alias: '',
    barcode: '',
    priceFsn: 5.1,
    priceFso: 5.1,
    priceFsnSklad: 5.1,
    priceFsoSklad: 5.1,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012170',
    name: 'Мясо птицы. Филе цыпл. бр.',
    goodgroup: goodGroupMock[10],
    alias: '',
    barcode: '',
    priceFsn: 10.11,
    priceFso: 10.11,
    priceFsnSklad: 10.11,
    priceFsoSklad: 10.11,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012168',
    name: 'Мясо птицы. Задняя четвертина цыпл. бр. (п/эт 12) зам.',
    goodgroup: goodGroupMock[9],
    alias: '',
    barcode: '',
    priceFsn: 4,
    priceFso: 4,
    priceFsnSklad: 4,
    priceFsoSklad: 4,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012164',
    name: 'Тушка цып. бр. 1 сорта охл',
    goodgroup: goodGroup5,
    alias: '',
    barcode: '',
    priceFsn: 7.89,
    priceFso: 7.89,
    priceFsnSklad: 7.89,
    priceFsoSklad: 7.89,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012162',
    name: 'Продукт из м.п. Рулет "Витебский" к/в 1с (порц. вак. уп.)',
    goodgroup: goodGroupMock[17],
    alias: '',
    barcode: 4810173011415,
    priceFsn: 5.92,
    priceFso: 5.92,
    priceFsnSklad: 5.92,
    priceFsoSklad: 5.92,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012160',
    name: 'Ветчина вар. руб."Праздничная" в/с',
    goodgroup: goodGroupMock[16],
    alias: '',
    barcode: '',
    priceFsn: 12.56,
    priceFso: 12.56,
    priceFsnSklad: 12.56,
    priceFsoSklad: 12.56,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012158',
    name: 'Сардельки из м.п. "Банзай" в/с 0,33 (газ.ср.)',
    goodgroup: goodGroupMock[15],
    alias: '',
    barcode: '',
    priceFsn: 4.23,
    priceFso: 4.23,
    priceFsnSklad: 4.23,
    priceFsoSklad: 4.23,
    valuename: 'шт.',
    invWeight: 0.33,
    vat: 20,
  },
  {
    id: '147012156',
    name: 'Сосиски из м.п "Бюргерские пикантные с горчицей" 1 с.',
    goodgroup: goodGroup3,
    alias: '',
    barcode: '',
    priceFsn: 3.17,
    priceFso: 3.17,
    priceFsnSklad: 3.17,
    priceFsoSklad: 3.17,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012154',
    name: 'Колбаса вар. "Докторская экстра" в/с',
    goodgroup: goodGroup2,
    alias: '',
    barcode: 4810173004592,
    priceFsn: 5.21,
    priceFso: 5.21,
    priceFsnSklad: 5.21,
    priceFsoSklad: 5.21,
    valuename: 'кг',
    invWeight: 1,
    vat: 20,
  },
  {
    id: '147012184',
    name: 'Колбаса вар. из м. п. "Классика" в/с 0,55',
    goodgroup: goodGroup2,
    alias: '',
    barcode: 4810173012559,
    priceFsn: 5.4,
    priceFso: 5.4,
    priceFsnSklad: 5.4,
    priceFsoSklad: 5.4,
    valuename: 'шт.',
    invWeight: 0.55,
    vat: 20,
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
  { id: '147012078', name: '3' },
  { id: '147012080', name: '5' },
  { id: '147012082', name: '10' },
  { id: '147012084', name: 'Мал. подл.' },
  { id: '147012086', name: 'Больш. подл.' },
  { id: '147012088', name: 'мал. батон' },
  { id: '147012090', name: 'больш. батон' },
  { id: '147012092', name: 'большой батон 5' },
  { id: '147012094', name: 'большой батон 10' },
  { id: '147012096', name: 'Мягкая форма' },
  { id: '147012098', name: 'п/е' },
  { id: '147012100', name: 'Мягкая форма 1 кг' },
  { id: '147012102', name: 'Мягкая форма 2 кг' },
  { id: '147012104', name: '500 гр.-700  гр.(10)' },
  { id: '147012106', name: '2 кг. - 3 кг.(5)' },
  { id: '147012108', name: 'мал. батон 5' },
  { id: '147012110', name: '500 гр.-700  гр.(5)' },
  { id: '147012112', name: 'мал. батон 10' },
  { id: '147012114', name: '2 кг. - 3 кг.(10)' },
  { id: '147012116', name: '130 г' },
  { id: '147012118', name: '1 кг, п/ёмк, охл' },
  { id: '147012120', name: '2 кг, п/ёмк, охл' },
  { id: '147012122', name: '1 кг, п/ёмк' },
  { id: '147012124', name: '2 кг, п/ёмк' },
  { id: '147012126', name: '1кг' },
  { id: '147012128', name: '1,8 кг' },
  { id: '147012130', name: '2 кг' },
  { id: '147012132', name: '2 кг. - 3 кг. (5)' },
  { id: '147012134', name: '2 по 6' },
  { id: '147012136', name: '1кг охл' },
  { id: '147012138', name: '5 кг' },
  { id: '147012140', name: '2кг охл' },
  { id: '147012142', name: '2 кг зам' },
  { id: '147012144', name: '1кг зам' },
  { id: '147012146', name: '4 шт.' },
  { id: '147012148', name: '500 гр (10)' },
  { id: '147012150', name: 'доминос' },
  { id: '147012152', name: 'КШП' },
];

const packageRefMock: IReference<IPackage> = {
  id: '56',
  name: 'Упаковки',
  data: packageMock,
};

// Связка товары - упаковки
const packageGoodMock: IPackageGood[] = [
  {
    id: '147012236',
    good: goodMock[1],
    package: packageMock[5],
  },
  {
    id: '147012238',
    good: goodMock[1],
    package: packageMock[7],
  },
  {
    id: '147012240',
    good: goodMock[39],
    package: packageMock[8],
  },
  {
    id: '147012242',
    good: goodMock[38], //{ "id": "147012156", "name": "Сосиски из м.п "Бюргерские пикантные с горчицей" 1 с."},
    package: packageMock[0],
  },
  {
    id: '147012244',
    good: goodMock[38],
    package: packageMock[2], //{ id: '147012082', name: '10' },
  },
  {
    id: '147012246',
    good: goodMock[38],
    package: packageMock[14], //{ id: '147012106', name: '2 кг. - 3 кг.(5)' },
  },
  {
    id: '147012248',
    good: goodMock[35],
    package: packageMock[22],
  },
  {
    id: '147012250',
    good: goodMock[4],
    package: packageMock[29],
  },
  {
    id: '147012252',
    good: goodMock[4],
    package: packageMock[23],
  },
  {
    id: '147012254',
    good: goodMock[0],
    package: packageMock[23],
  },
  {
    id: '147012256',
    good: goodMock[0],
    package: packageMock[11],
  },
  {
    id: '147012258',
    good: goodMock[31],
    package: packageMock[22],
  },
  {
    id: '147012260',
    good: goodMock[31],
    package: packageMock[23],
  },
  {
    id: '147012262',
    good: goodMock[29],
    package: packageMock[25],
  },
  {
    id: '147012264',
    good: goodMock[4],
    package: packageMock[27],
  },
  {
    id: '147012264',
    good: goodMock[4],
    package: packageMock[27],
  },
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
    documentDate: '2021-06-30',
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
    documentDate: '2021-06-27',
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
    documentDate: '2021-06-14',
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

const departmetsMock: IDepartment[] = [
  { id: '147012303', name: 'Склад №1' },
  { id: '147012304', name: 'Склад №2' },
  { id: '147012305', name: 'Склад №3' },
];

const deprt1 = departmetsMock[0];
const deprt2 = departmetsMock[1];
const deprt3 = departmetsMock[2];

const departmentRefMock: IReference<INamedEntity> = {
  id: '666',
  name: 'Подразделения',
  data: departmetsMock,
};

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
      onDate: '2021-06-07',
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
      onDate: '2021-06-01',
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
      onDate: '2021-06-02',
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
      depart: deprt1,
      onDate: '2021-06-03',
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
      route: route1,
      onDate: '2021-06-07',
    },
    lines: [],
  },
];

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
      outlet: outlet3,
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
      outlet: outlet2,
      depart: deprt3,
      reason: 'Брак',
    },
    lines: [],
  },
];

export {
  documentTypeMock,
  orderType,
  returnType,
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
  departmentRefMock,
};
