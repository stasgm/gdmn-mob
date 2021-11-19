import { ICompany, IDocument, IMessage, INamedEntity, IReferences, NewMessage, ICmd, ICmdParams } from '@lib/types';

import { company3 } from '..';

// import { companyRefMock, depRefMock, docTypeRefMock, peopleRefMock, goodsRefMock } from './references';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '15',
  name: 'ГОЦЕЛЮК Н. А.',
};

const user3: INamedEntity = {
  id: '654',
  name: 'Gedemin',
};

const companies: ICompany[] = [
  { id: '1', name: 'ОДО Золотые Программы', admin: user1 },
  { id: '2', name: 'ОДО Амперсант', admin: user2 },
  { id: '3', name: 'Company 1', admin: user2 },
  { id: '4', name: 'Company 2', admin: user2 },
  { id: '5', name: 'Company 3', admin: user1 },
  { id: '6', name: 'Company 4', admin: user2 },
];

type MessageType = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences;

export const messages: IMessage<MessageType>[] = [
  {
    id: 'a22b96a0-3672-11ec-829a-25e070955433',
    head: {
      appSystem: 'gdmn-appl-request',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-10-26T15:37:31.658Z',
    },
    status: 'READY',
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        Statuses: {
          id: '181073789',
          name: 'Statuses',
          visible: true,
          description: 'Статусы заявок',
          data: [
            { id: '168062972', name: 'Исполнен' },
            { id: '168062973', name: 'Принят к исполнению' },
            { id: '168062974', name: 'Отказано' },
            { id: '168062975', name: 'Доработан' },
            { id: '168062976', name: 'На доработке' },
            { id: '168062977', name: 'На доработку' },
            { id: '168062978', name: 'Утвержден' },
            { id: '168062980', name: 'Предварительно согласован' },
            { id: '168062979', name: 'Согласован инженерной службой' },
            { id: '168062981', name: 'На проверке' },
            { id: '168062982', name: 'Отправлен на проверку' },
          ],
        },
        Employees: {
          id: '181073791',
          name: 'Employees',
          visible: true,
          description: 'Сотрудники',
          metadata: {
            id: { sortOrder: 0, visible: false },
            name: { sortOrder: 1, name: 'ФИО' },
            firstName: { sortOrder: 2, name: 'Имя' },
            lastName: { sortOrder: 3, name: 'Отчество' },
            middleName: { sortOrder: 4, name: 'Фамилия' },
            position: { sortOrder: 5, name: 'Должность' },
          },
          data: [
            {
              id: '147093200',
              name: 'Иванова Дарья Викторовна',
              firstName: 'Дарья',
              lastName: 'Викторовна',
              middleName: 'Иванова',
              position: { id: '147527836', name: 'Главный бухгалтер' },
            },
            {
              id: '147093201',
              name: 'Антонов Алексей Витальевич',
              firstName: 'Алексей',
              lastName: 'Витальевич',
              middleName: 'Антонов',
              position: {
                id: '151231946',
                name: 'Ведущий инженер',
              },
            },
            {
              id: '147257062',
              name: 'Зайцев Николай Романович',
              firstName: 'Николай',
              lastName: 'Романович',
              middleName: 'Зайцев',
              position: { id: '148477406', name: 'Главный инженер' },
            },
            {
              id: '147527919',
              name: 'Маркова Вероника Николаевна',
              firstName: 'Вероника',
              lastName: 'Николаевна',
              middleName: 'Маркова',
              position: { id: '147527678', name: 'Заведующий складом' },
            },
          ],
        },
        DocTypes: {
          id: '181073793',
          name: 'DocTypes',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              id: '168063006',
              name: 'request',
              description: 'Заявки на закупку ТМЦ',
            },
          ],
        },
      },
    },
  },
  {
    id: 'a348c670-3672-11ec-829a-25e070955433',
    head: {
      appSystem: 'gdmn-appl-request',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-10-26T15:37:33.527Z',
    },
    status: 'READY',
    body: {
      type: 'DOCS',
      version: 1,
      payload: [
        {
          id: '180625193',
          number: '324',
          documentDate: '2021-08-24',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'DRAFT',
          head: {
            applStatus: {
              id: '168062979',
              name: 'Согласован инженерной службой',
            },
            purchaseType: { id: '168355982', name: 'Стройматериалы' },
            headCompany: { id: '147347293', name: 'ОАО "МатериалПродукт"' },
            dept: { id: '170271488', name: 'МТП МатериалПродукт' },
            purpose: { id: '168355982', name: 'Стройматериалы' },
            justification:
              'Данные тип Ремень 1250 и 1800(Б) требуются на установки, ремень 1180 (А) требуется на редуктор.',
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            specApprove: { id: '650002', name: 'Администратор' },
            verificationDate: '2021-08-24',
          },
          lines: [
            {
              id: '180625299',
              orderNum: 1,
              goodName: 'Ремень 1800 (Б)',
              quantity: 7,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '180625301',
              orderNum: 2,
              goodName: 'Ремень 1180 (А) ',
              quantity: 7,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '180625305',
              orderNum: 3,
              goodName: 'Ремень 1250',
              quantity: 7,
              value: { id: '3000001', name: 'шт.' },
            },
          ],
        },
        {
          id: '180822999',
          number: '837',
          documentDate: '2021-08-25',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'ARCHIVE',
          head: {
            applStatus: { id: '168062978', name: 'Утвержден' },
            purchaseType: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            headCompany: { id: '147347293', name: 'ОАО "МатериалПродукт"' },
            dept: { id: '151229051', name: 'Административный комплекс' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification: 'для общехозяйственных нужд управляющей компании Холдинга "МатериалПродукт"',
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            specApprove: { id: '650002', name: 'Администратор' },
            verificationDate: '2021-08-26',
          },
          lines: [
            {
              id: '180823007',
              orderNum: 1,
              goodName: 'Бумага А4 80 г/м',
              quantity: 50,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '180823008',
              orderNum: 2,
              goodName: 'Ластик Berlingo',
              quantity: 5,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '180823012',
              orderNum: 3,
              goodName: 'Папка-скоросшиватель пластик. А4, 180 мкм',
              quantity: 15,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '180823014',
              orderNum: 4,
              goodName: 'Элемент питания Krona',
              quantity: 1,
              value: { id: '3000001', name: 'шт.' },
            },
          ],
        },
        {
          id: '172472175',
          number: '474',
          documentDate: '2021-06-17',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'SENT',
          head: {
            applStatus: {
              id: '168062979',
              name: 'Согласован инженерной службой',
            },
            purchaseType: { id: '168354197', name: 'Отдел эксплуатации' },
            headCompany: {
              id: '147093196',
              name: 'ОАО "МатериалПродукт"-упр.ком.холдинга МатериалПродукт',
            },
            dept: { id: '147095763', name: 'СХЦ "МатериалПродукт""' },
            purpose: { id: '168354197', name: 'Отдел эксплуатации' },
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            verificationDate: '2021-08-20',
            note: 'Выполнено',
          },
          lines: [
            {
              id: '172472177',
              orderNum: 1,
              goodName: 'Труба стальная D32ММ',
              quantity: 640,
              value: { id: '147007792', name: 'м' },
            },
            {
              id: '172472178',
              orderNum: 2,
              goodName: 'Арматура гладкая D14мм',
              quantity: 50,
              value: { id: '147007792', name: 'м' },
            },
            {
              id: '172472181',
              orderNum: 3,
              goodName: 'Арматура гладкая D16мм',
              quantity: 100,
              value: { id: '147007792', name: 'м' },
            },
            {
              id: '172472182',
              orderNum: 4,
              goodName: 'Арматура гладкая D18мм',
              quantity: 50,
              value: { id: '147007792', name: 'м' },
            },
          ],
        },
        {
          id: '178210557',
          number: '745',
          documentDate: '2021-08-04',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'READY',
          head: {
            applStatus: {
              id: '168062979',
              name: 'Согласован инженерной службой',
            },
            purchaseType: { id: '168353581', name: 'Механизация' },
            headCompany: { id: '147347293', name: 'ОАО "МатериалПродукт"' },
            dept: { id: '147095763', name: 'СХЦ "МатериалПродукт"' },
            purpose: { id: '168353581', name: 'Механизация' },
            justification: 'Просим Вас закупить данные зап.части для ремонта автомобиля задействованного на КЗС.',
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            verificationDate: '2021-08-20',
            faGood: {
              id: '151911526',
              name: 'АВТОМОБИЛЬ МАЗ-457043-325',
            },
            faGoodNumber: '194256',
            note: 'Выполнено',
          },
          lines: [
            {
              id: '178210559',
              orderNum: 1,
              goodName: 'Трубки топливные  ВД   Д-245 (комплект), ( Моторпал)',
              quantity: 1,
              value: { id: '3000001', name: 'шт.' },
            },
          ],
        },
        {
          id: '178594244',
          number: '778',
          documentDate: '2021-08-11',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'DRAFT',
          head: {
            applStatus: { id: '168062980', name: 'Предварительно согласован' },
            purchaseType: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            headCompany: {
              id: '147093196',
              name: 'ОАО "МатериалПродукт"-упр.ком.холдинга ОАО "МатериалПродукт"',
            },
            dept: { id: '147095763', name: 'ОАО "МатериалПродукт"' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification:
              'Для специалистов МТФ-1, ОТК, ОТК-Вейно, ведущего инженера по ОТ, заведующего складом, диспетчеров.',
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            verificationDate: '2021-08-20',
            note: 'Канцелярия заказывается службами 1 раз в год. Бумага по необходимости.',
            cancelReason: 'НА КАКОЙ ПЕРИОД ДАННЫЙ ОБЪЁМ МАТЕРИАЛОВ?',
          },
          lines: [
            {
              id: '178594246',
              orderNum: 1,
              goodName: 'Бумага А4',
              quantity: 70,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594249',
              orderNum: 2,
              goodName: 'Зажим для бумаги 19 мм',
              quantity: 20,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594251',
              orderNum: 3,
              goodName: 'Зажим для бумаги 25 мм',
              quantity: 38,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594288',
              orderNum: 24,
              goodName: 'Зажим для бумаги 51 мм',
              quantity: 30,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594300',
              orderNum: 30,
              goodName: 'Папка-регистратор 75 мм',
              quantity: 20,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594306',
              orderNum: 32,
              goodName: 'Папка-планшет с зажимом',
              quantity: 3,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '178594307',
              orderNum: 33,
              goodName: 'Блок для заметок с липким краем',
              quantity: 3,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077375',
              orderNum: 38,
              goodName: 'Скоросшиватель "Дело"',
              quantity: 10,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077387',
              orderNum: 43,
              goodName: 'Обложка универсальная А4',
              quantity: 16,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077439',
              orderNum: 61,
              goodName: 'Папка-конверт',
              quantity: 10,
              value: { id: '3000001', name: 'шт.' },
            },
          ],
        },
        {
          id: '178594254',
          number: '758',
          documentDate: '2021-08-10',
          documentType: {
            id: '168063006',
            name: 'request',
            description: 'Заявки на закупку ТМЦ',
          },
          status: 'ARCHIVE',
          head: {
            applStatus: { id: '168062974', name: 'Отказано' },
            purchaseType: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            headCompany: {
              id: '147093196',
              name: 'ОАО "МатериалПродукт"-упр.ком.холдинга ОАО "МатериалПродукт"',
            },
            dept: { id: '147095763', name: 'ОАО "МатериалПродукт"' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification:
              'Для специалистов МТФ-1, ОТК, ОТК-Вейно, ведущего инженера по ОТ, заведующего складом, диспетчеров.',
            sysApplicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            applicant: {
              id: '147257056',
              name: 'Антонов Алексей Витальевич',
            },
            specPreAgree: {
              id: '147257062',
              name: 'Зайцев Николай Романович',
            },
            specAgreeEngin: {
              id: '147257062',
              name: 'Маркова Вероника Николаевна',
            },
            verificationDate: '2021-08-20',
          },
          lines: [
            {
              id: '179077399',
              orderNum: 46,
              goodName: 'Ножницы 18 см',
              quantity: 2,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077400',
              orderNum: 47,
              goodName: 'Фломастеры',
              quantity: 1,
              value: { id: '3000010', name: 'компл.' },
            },
            {
              id: '179077424',
              orderNum: 55,
              goodName: 'Штемпельная краска синяя',
              quantity: 2,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077408',
              orderNum: 49,
              goodName: 'Набор гелевых ручек',
              quantity: 4,
              value: { id: '147112002', name: 'набор' },
            },
            {
              id: '179077409',
              orderNum: 50,
              goodName: 'Тетрадь 48 л.',
              quantity: 4,
              value: { id: '3000001', name: 'шт.' },
            },
            {
              id: '179077430',
              orderNum: 58,
              goodName: 'Корректирующая лента',
              quantity: 4,
              value: { id: '3000001', name: 'шт.' },
            },
          ],
        },
      ] as any[],
    },
  },

  {
    id: 'a35103d0-3672-11ec-829a-25e070955433',
    head: {
      appSystem: 'gdmn-appl-request',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-10-26T15:37:33.581Z',
    },
    status: 'READY',
    body: { type: 'SETTINGS', version: 1, payload: {} },
  },
];
