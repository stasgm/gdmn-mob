import { IReference, INamedEntity, ICompany, IRefMetadata, IDocfMetadata, IReferences } from '@lib/types';
import { superAdmin } from '@lib/mock';

import { IApplDocument, IApplHead, IApplLine, IEmployee } from './types';

// DocumentTypes
const applType = { id: '147010699', name: 'appl' };

const documentTypes = [applType];

// appl statuses
const applStatuses: INamedEntity[] = [
  {
    id: '147000001',
    name: 'К рассмотрению',
  },
  {
    id: '147000002',
    name: 'Принято',
  },
  {
    id: '147000003',
    name: 'Отказано',
  },
];

// appl statuses reference
const refApplStatuses: IReference<INamedEntity> = {
  id: '148000001',
  name: 'Statuses',
  visible: false,
  description: 'Статусы заявок',
  data: applStatuses,
};

// company
const company: ICompany = { admin: superAdmin, id: '147100001', name: 'Белкалий - Агро' };

// Employees
const employees: IEmployee[] = [
  {
    id: '147012001',
    name: 'Акулич С.А.',
    firstName: 'Сергей',
    middleName: 'Анатольевич',
    lastName: 'Акулич',
    position: {
      id: '001',
      name: 'Директор',
    },
  },
  {
    id: '147012002',
    name: 'Булла М.В.',
    firstName: 'Михаил',
    middleName: 'Викторович',
    lastName: 'Булла',
    position: {
      id: '011',
      name: 'Энергетик',
    },
  },
  {
    id: '147012003',
    name: 'Самусевич А.Н.',
    firstName: 'Александр',
    middleName: ' Николаевич',
    lastName: 'Самусевич',
    position: {
      id: '006',
      name: 'Начальник отдела материально-тенического обеспечения',
    },
  },
  {
    id: '147012002',
    name: 'Реут В.В.',
    firstName: 'Валерий',
    middleName: 'Валентинович',
    lastName: 'Реут',
    position: {
      id: '004',
      name: 'Главный инженер"',
    },
  },
];

// Метаданные для справочника Сотрудники
const emplMetadata: IRefMetadata<IEmployee> = {
  id: {
    visible: false,
  },
  name: {
    sortOrder: 1,
    name: 'ФИО',
  },
  lastName: {
    sortOrder: 2,
    name: 'Фамилия',
  },
  firstName: {
    sortOrder: 3,
    name: 'Имя',
  },
  middleName: {
    sortOrder: 4,
    name: 'Отчество',
  },
  position: {
    sortOrder: 5,
    name: 'Должность',
  },
};

// appl emplyees reference
const refEmplyees: IReference<IEmployee> = {
  id: '148000002',
  name: 'Employees',
  description: 'Сотрудники',
  metadata: emplMetadata,
  data: employees,
};

// Ед. изм - штуки
const value: INamedEntity = {
  id: '999',
  name: 'шт.',
};

// Метаданные для документа заявки
const applDocMetadata: IDocfMetadata<IApplHead, IApplLine> = {
  head: {
    justification: {
      name: 'Основание',
      sortOrder: 1,
    },
    sysApplicant: {
      name: 'Системный заявитель',
      sortOrder: 2,
      type: 'ref',
      refName: 'employees',
    },
  },
};

// Документы Appl
const applDocuments: IApplDocument[] = [
  {
    id: '149000001',
    number: '100',
    documentDate: '2021-07-04',
    documentType: applType,
    status: 'DRAFT',
    metadata: applDocMetadata,
    head: {
      applStatus: applStatuses[0],
      purchaseType: {
        id: '101',
        name: 'Усуга',
      },
      dept: {
        id: '201',
        name: 'Электроцех',
      },
      purpose: {
        id: '301',
        name: 'Услуги',
      },
      justification: 'утилизация ртутосодержащих ламп',
      sysApplicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      applicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      specPreAgree: {
        id: employees[2].id,
        name: employees[2].name,
      },
      specAgreeEngin: {
        id: employees[3].id,
        name: employees[3].name,
      },
      verificationDate: '2021-07-02',
    },
    lines: [
      {
        id: '701',
        orderNum: '1',
        goodName: 'Прошу найти организацию для утилизации люминесцентных ламп',
        quantity: '368',
        value,
      },
    ],
  },
  {
    id: '149000002',
    number: '101',
    documentDate: '2021-07-07',
    documentType: applType,
    status: 'DRAFT',
    head: {
      applStatus: applStatuses[0],
      purchaseType: {
        id: '102',
        name: 'Товар',
      },
      dept: {
        id: '201',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '301',
        name: 'Канцтовары',
      },
      justification: 'Покупка канцтоваров',
      sysApplicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      applicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      specPreAgree: {
        id: employees[2].id,
        name: employees[2].name,
      },
      specAgreeEngin: {
        id: employees[3].id,
        name: employees[3].name,
      },
      verificationDate: '2021-07-03',
    },
    lines: [
      {
        id: '702',
        orderNum: '1',
        goodName: 'Прошу закупить карандаши',
        quantity: '100',
        value,
      },
      {
        id: '703',
        orderNum: '2',
        goodName: 'Прошу закупить тетради',
        quantity: '150',
        value,
      },
      {
        id: '704',
        orderNum: '3',
        goodName: 'Прошу закупить столы',
        quantity: '10',
        value,
      },
      {
        id: '705',
        orderNum: '4',
        goodName: 'Прошу закупить учебники необходимые для повышения квалификации работников всех отделов',
        quantity: '50',
        value,
      },
    ],
  },
];

// Документы Appl
const applDocuments2: IApplDocument[] = [
  {
    id: '172472163',
    number: '468',
    documentDate: '2021-06-16',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    metadata: applDocMetadata,
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168643228',
        name: 'Канцтовары, хозтовары, бланки строгой отчетности',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168643228',
        name: 'Канцтовары, хозтовары, бланки строгой отчетности',
      },
      justification:
        'Необходим новый счётчик, так как старый вышел из строя. Счётчик будет установлен по адресу ул. Мира д. 65.',
      sysApplicant: {
        id: '153826318',
        name: 'Ахтареева Кристина Сергеевна',
      },
      applicant: {
        id: '153826318',
        name: 'Ахтареева Кристина Сергеевна',
      },
      specPreAgree: {
        id: '147351467',
        name: 'Кузнецова Кристина Александровна',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      note: 'любой модели, на холодную воду.',
      cancelReason: 'какой счетчик, модель?',
    },
    lines: [
      {
        id: '172472165',
        orderNum: '1',
        goodName: 'Счётчик на воду',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173868668',
    number: '431',
    documentDate: '2021-06-13',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим найти сервисную организацию и оплатить выезд специалистов для ремонта и заправки системы кондиционирования зерноуборочного комбайна.',
      sysApplicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      applicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151908779',
        name: 'КОМБАЙН ЗЕРНОУБОР ДОМИНАТОР 204 МЕГА',
      },
      faGoodNumber: '33',
    },
    lines: [
      {
        id: '173868670',
        orderNum: '1',
        goodName: 'Диагностика, ремонт и заправка кондиционера ',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174234425',
    number: '471',
    documentDate: '2021-06-16',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '171898951',
        name: 'Трудоёмкие процессы',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '171898951',
        name: 'Трудоёмкие процессы',
      },
      justification:
        'Просим Вас закупить данные запасные части для оперативного ремонта машины для первичной очистки МПО-50.',
      sysApplicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      applicant: {
        id: '147458312',
        name: 'Койко Владимир Павлович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
    },
    lines: [
      {
        id: '174234941',
        orderNum: '1',
        goodName: 'Сетка МПО 50.01.050',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174234995',
        orderNum: '2',
        goodName: 'Ремень В-1600',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235109',
        orderNum: '3',
        goodName: 'Ремень Б3550',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235123',
        orderNum: '4',
        goodName: 'Ремень В2500L',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235141',
        orderNum: '5',
        goodName: 'Ремень В2360L',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235156',
        orderNum: '6',
        goodName: 'Набор ключей ражковых 6-32мм',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235163',
        orderNum: '7',
        goodName: 'Шприц плунжерный для смазки ',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174063289',
    number: '450',
    documentDate: '2021-06-14',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас закупить данные запасные части для оперативного ремонта автомобиля который задействоан на с/х работах.',
      sysApplicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      applicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151914714',
        name: 'АВТОМОБИЛЬ МАЗ-650118 КОМП. 320-021',
      },
      faGoodNumber: '700205',
    },
    lines: [
      {
        id: '174063428',
        orderNum: '1',
        goodName: 'Вал карданый (705 мм) 54341-2201010-10',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174063438',
        orderNum: '2',
        goodName: 'Регулятор тормозных сил 4757100200',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174362818',
    number: '475',
    documentDate: '2021-06-17',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Просим закупить данное масло для проведения ТО двигателя Биогазовой установки.',
      sysApplicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      applicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
    },
    lines: [
      {
        id: '174362829',
        orderNum: '1',
        goodName: 'Масло Mobil Pegasus 610',
        quantity: '200',
        value: {
          id: '3000006',
          name: 'л',
        },
      },
    ],
  },
  {
    id: '174096070',
    number: '459',
    documentDate: '2021-06-15',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168355281',
        name: 'Электрика',
      },
      dept: {
        id: '151256383',
        name: 'Зерноток',
      },
      purpose: {
        id: '168355281',
        name: 'Электрика',
      },
      justification: 'Ремонт жидкосной горелки Riello P RBL P 200 T/G',
      sysApplicant: {
        id: '159258093',
        name: 'Булла Михаил Викторович',
      },
      applicant: {
        id: '159258093',
        name: 'Булла Михаил Викторович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      note: 'Выполнено',
    },
    lines: [
      {
        id: '174096210',
        orderNum: '1',
        goodName: 'Насос Suntec 17 CCC 1002 4P',
        quantity: '1',
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096213',
        orderNum: '2',
        goodName: 'Манометр для насоса',
        quantity: '1',
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096316',
        orderNum: '3',
        goodName: 'Шланг топливный 1/2',
        quantity: '2',
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096468',
        orderNum: '4',
        goodName: 'Эл.Дв. АИР100L 5.5 кВт',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '172472156',
    number: '447',
    documentDate: '2021-06-14',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168354197',
        name: 'Животноводство',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168354197',
        name: 'Животноводство',
      },
      justification: 'Для откачки и фосовки меда.',
      sysApplicant: {
        id: '153826318',
        name: 'Ахтареева Кристина Сергеевна',
      },
      applicant: {
        id: '147184842',
        name: 'Соколовский Валерий Николаевич',
      },
      specPreAgree: {
        id: '147351467',
        name: 'Кузнецова Кристина Александровна',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
    },
    lines: [
      {
        id: '172472158',
        orderNum: '1',
        goodName: 'Банка на 1л',
        quantity: '400',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '172472159',
        orderNum: '2',
        goodName: 'Электропривод для медогонки на 220В',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '172472160',
        orderNum: '3',
        goodName: 'Перчатки из натуральной кожи',
        quantity: '1',
        value: {
          id: '147007798',
          name: 'пара',
        },
      },
      {
        id: '172472161',
        orderNum: '4',
        goodName: 'Лицевая сетка пчеловода',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174405172',
    number: '478',
    documentDate: '2021-06-17',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим докупить данные запасные части для ремонта и подготовки зерноуборочного комбайна к сезону уборки зерновых культур.',
      sysApplicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      applicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      specPreAgree: {
        id: '149062238',
        name: 'Мойсейков Алексей Александрович',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-18',
      faGood: {
        id: '151908779',
        name: 'КОМБАЙН ЗЕРНОУБОР ДОМИНАТОР 204 МЕГА',
      },
      faGoodNumber: '33',
    },
    lines: [
      {
        id: '174405175',
        orderNum: '1',
        goodName: 'Подбарабанье 06633471',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405176',
        orderNum: '2',
        goodName: 'подбарабанье 06633411',
        quantity: '3',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405177',
        orderNum: '3',
        goodName: 'колпачёк 06176300',
        quantity: '50',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405178',
        orderNum: '4',
        goodName: 'винт 05025110',
        quantity: '50',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405179',
        orderNum: '5',
        goodName: 'шайба 02393880',
        quantity: '50',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405180',
        orderNum: '6',
        goodName: 'узел подшипниковый 06450070',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405181',
        orderNum: '7',
        goodName: 'звёздочка 06508690',
        quantity: '3',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405182',
        orderNum: '8',
        goodName: 'пол 06509510',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405183',
        orderNum: '9',
        goodName: 'планка 06508670',
        quantity: '3',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405184',
        orderNum: '10',
        goodName: 'защита 06508361',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405185',
        orderNum: '11',
        goodName: 'защита 06507950',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405186',
        orderNum: '12',
        goodName: 'защита 06508371',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405187',
        orderNum: '13',
        goodName: 'наполнитель 06507901',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405188',
        orderNum: '14',
        goodName: 'ремень вариатора 06098230',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405197',
        orderNum: '15',
        goodName: 'Подшипник SA 206',
        quantity: '6',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174405219',
    number: '480',
    documentDate: '2021-06-17',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим докупить данные запасные части для ремонтаи подготовки зерноуборочных комбайнов к сезону уборки зерновых культур. ',
      sysApplicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      applicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
    },
    lines: [
      {
        id: '174405222',
        orderNum: '1',
        goodName: 'вал КЗР 0202610Б-01',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405223',
        orderNum: '2',
        goodName: 'вал КЗК-10-0202630',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405225',
        orderNum: '3',
        goodName: 'делитель КЗР 1518100',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405226',
        orderNum: '4',
        goodName: 'колпак КЗК-12-0102474',
        quantity: '96',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405227',
        orderNum: '5',
        goodName: 'болт М10х30 DIN 603',
        quantity: '96',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405228',
        orderNum: '6',
        goodName: 'диск фрикционный КЗР 0313003',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405229',
        orderNum: '7',
        goodName: 'контрпривод КЗК-12-0202500',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174405237',
    number: '481',
    documentDate: '2021-06-17',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас закупить данную зап.часть для ремонта трактора задействованного на вывозке жидких органических удобрений.',
      sysApplicant: {
        id: '147257062',
        name: 'Щетко Леонид Васильевич',
      },
      applicant: {
        id: '147257062',
        name: 'Щетко Леонид Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151909336',
        name: 'ТРАКТОР БЕЛАРУС-1523',
      },
      faGoodNumber: '166',
    },
    lines: [
      {
        id: '174405239',
        orderNum: '1',
        goodName: 'Обойма  86-1802015-Б',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174405241',
    number: '482',
    documentDate: '2021-06-17',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас закупить данный комплект прокладок для ремонта автомобиля, который будет задействован на транспортных работах.',
      sysApplicant: {
        id: '147257062',
        name: 'Щетко Леонид Васильевич',
      },
      applicant: {
        id: '147257062',
        name: 'Щетко Леонид Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151917209',
        name: 'АВТОСАМОСВАЛ КАМАЗ-45143-013-15',
      },
      faGoodNumber: '700784',
      cancelReason: 'И ОН КОГДА НИБУДЬ ПОЕДЕТ?\r\n\r\nОДНО ЧТО ТЕХОСМОТР ПРОШЛИ.',
    },
    lines: [
      {
        id: '174405243',
        orderNum: '1',
        goodName: 'Комплект прокладок двигателя ',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174108663',
    number: '463',
    documentDate: '2021-06-15',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим закупить данные запасные части для ремонта и подготовки автотопливозаправщика к прохождению государственного технического сомотра.',
      sysApplicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      applicant: {
        id: '147093201',
        name: 'Кардель Дмитрий Эдвардович',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151930938',
        name: 'ТОПЛИВОЗАПРАВЩИК АТЗ-4,9 ДВУХСЕКЦ',
      },
      faGoodNumber: '702339',
    },
    lines: [
      {
        id: '174108700',
        orderNum: '1',
        goodName: 'Цилиндр тормозной задний 3309-3501340',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108713',
        orderNum: '2',
        goodName: 'Трос 3307-3508181-02',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108730',
        orderNum: '3',
        goodName: 'Трос 3307-3508180-02',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108744',
        orderNum: '4',
        goodName: 'Колодка тормозная 3309-3502090',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108762',
        orderNum: '5',
        goodName: 'Фонарь 4802.3731000-03 ',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108791',
        orderNum: '6',
        goodName: 'Бочёк омывателя с насосом 24 В',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108815',
        orderNum: '7',
        goodName: 'Датчик ABS 0486001066',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109138',
        orderNum: '8',
        goodName: 'Втулка обжимная II16774',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109155',
        orderNum: '9',
        goodName: 'Фонарь габаритный жёлтый 4422.3731 ',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109370',
        orderNum: '10',
        goodName: 'Фонарь полного габарита 112.06.47',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109577',
        orderNum: '11',
        goodName: 'Фонарь полного габарита левый 112.06.47-01',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109617',
        orderNum: '12',
        goodName: 'Фара головного света ФГ-122-БВ1',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109803',
        orderNum: '13',
        goodName: 'Фонарь передний 112.02.22',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109854',
        orderNum: '14',
        goodName: 'Фонарь передний габаритный 441.3712',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110226',
        orderNum: '15',
        goodName: 'Лист № 1 рессоры в сборе 53А-2902015',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110274',
        orderNum: '16',
        goodName: 'Лист № 2 рессоры в сборе 53А-2902016',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110282',
        orderNum: '17',
        goodName: 'Стремянка 53А-2902408',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110283',
        orderNum: '18',
        goodName: 'Гайка стремянки 292873-П29  ',
        quantity: '8',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110305',
        orderNum: '19',
        goodName: 'Опора рессоры нижняя 52-2902432',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110477',
        orderNum: '20',
        goodName: 'Упор 53-2902433-А ',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110510',
        orderNum: '21',
        goodName: 'Опора верхняя 52-2902431',
        quantity: '4',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110526',
        orderNum: '22',
        goodName: 'Манжета 51-2402052-Б4 ',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110533',
        orderNum: '23',
        goodName: 'Крестовина 130-2201025 ',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110581',
        orderNum: '24',
        goodName: 'Крестовина 72-2203025 ',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110616',
        orderNum: '25',
        goodName: 'Стартер 24 В',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174065971',
    number: '452',
    documentDate: '2021-06-14',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас закупить данные запасные части для оперативного ремонта трактора который задействован на кормлении КРС.',
      sysApplicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      applicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '151911169',
        name: 'ТРАКТОР БЕЛАРУС-1221.2',
      },
      faGoodNumber: '701443',
    },
    lines: [
      {
        id: '174065988',
        orderNum: '1',
        goodName: 'Диск сцепления 85-1601090',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174066030',
        orderNum: '2',
        goodName: 'Диск ведомый 85-1601130-01',
        quantity: '2',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174066042',
        orderNum: '3',
        goodName: 'Отводка 50-1601180-А',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174215653',
    number: '465',
    documentDate: '2021-06-15',
    documentType: {
      id: '168063006',
      name: 'Заявки на закупку ТМЦ',
    },
    status: 'DRAFT',
    head: {
      applStatus: {
        id: '168062979',
        name: 'Согласован инженерной службой',
      },
      purchaseType: {
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '147095763',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Просим Вас найти подрядную организацию оплатить материалы и услуги специалистов для проведения технического обслуживания при наработке 2500 м/ч трактора который задействован на косьбе. Заводской номер двигателя REH13546. ',
      sysApplicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      applicant: {
        id: '153741215',
        name: 'Игнашевич Сергей  Васильевич',
      },
      specPreAgree: {
        id: '151211855',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '156628271',
        name: 'Беларус-3522-10/921-39/131-46/461 зав.ном.',
      },
      faGoodNumber: '702970',
    },
    lines: [
      {
        id: '174215655',
        orderNum: '1',
        goodName: 'Техническое обслуживание при наработке 2500 м/ч',
        quantity: '1',
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
];

const applRefs: IReferences = {
  [refApplStatuses.name]: refApplStatuses,
  [refEmplyees.name]: refEmplyees,
};

export {
  documentTypes,
  applType,
  applStatuses,
  refApplStatuses,
  employees,
  applDocuments,
  applDocuments2,
  refEmplyees,
  company,
  applRefs,
};
