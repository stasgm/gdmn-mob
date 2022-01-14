import { ICompany, IDocument, IMessage, INamedEntity, IReferences, ICmd, ICmdParams } from '@lib/types';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '15',
  name: 'ГОЦЕЛЮК Н. А.',
};

const companies: ICompany[] = [
  { id: '1', name: 'Company 11', admin: user1 },
  { id: '2', name: 'Company 22', admin: user2 },
  { id: '3', name: 'Company 1', admin: user2 },
  { id: '4', name: 'Company 2', admin: user2 },
  { id: '5', name: 'Company 3', admin: user1 },
  { id: '6', name: 'Company 4', admin: user2 },
];

type MessageType = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences;

export const messageRequest: IMessage<MessageType>[] = [
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
            lastName: { sortOrder: 2, name: 'Фамилия' },
            firstName: { sortOrder: 3, name: 'Имя' },
            middleName: { sortOrder: 4, name: 'Отчество' },
            position: { sortOrder: 5, name: 'Должность' },
          },
          data: [
            {
              id: '147093200',
              name: 'Иванова Дарья Викторовна',
              firstName: 'Дарья',
              middleName: 'Викторовна',
              lastName: 'Иванова',
              position: { id: '147527836', name: 'Главный бухгалтер' },
            },
            {
              id: '147093201',
              name: 'Антонов Алексей Витальевич',
              firstName: 'Алексей',
              middleName: 'Витальевич',
              lastName: 'Антонов',
              position: {
                id: '151231946',
                name: 'Ведущий инженер',
              },
            },
            {
              id: '147257062',
              name: 'Зайцев Николай Романович',
              firstName: 'Николай',
              middleName: 'Романович',
              lastName: 'Зайцев',
              position: { id: '148477406', name: 'Главный инженер' },
            },
            {
              id: '147527919',
              name: 'Маркова Вероника Николаевна',
              firstName: 'Вероника',
              middleName: 'Николаевна',
              lastName: 'Маркова',
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
            headCompany: { id: '147347293', name: 'ОАО "ПродуктМаг"' },
            dept: { id: '170271488', name: 'МТП ПродуктМаг' },
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
            headCompany: { id: '147347293', name: 'ОАО "ПродуктМаг"' },
            dept: { id: '151229051', name: 'Административный комплекс' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification: 'для общехозяйственных нужд управляющей компании Холдинга "ПродуктМаг"',
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
              name: 'ОАО "ПродуктМаг"-упр.ком.холдинга ПродуктМаг',
            },
            dept: { id: '147095763', name: 'СХЦ "ПродуктМаг""' },
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
            headCompany: { id: '147347293', name: 'ОАО "ПродуктМаг"' },
            dept: { id: '147095763', name: 'СХЦ "ПродуктМаг"' },
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
              name: 'ОАО "ПродуктМаг"-упр.ком.холдинга ОАО "ПродуктМаг"',
            },
            dept: { id: '147095763', name: 'ОАО "ПродуктМаг"' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification: 'Для специалистов, ведущего инженера, заведующего складом, диспетчеров.',
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
              name: 'ОАО "ПродуктМаг"-упр.ком.холдинга ОАО "ПродуктМаг"',
            },
            dept: { id: '147095763', name: 'ОАО "ПродуктМаг"' },
            purpose: {
              id: '168643228',
              name: 'Канцтовары, хозтовары, бланки строгой отчетности',
            },
            justification: 'Для специалистов, ведущего инженера, заведующего складом, диспетчеров.',
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

export const messageAgent: IMessage<MessageType>[] = [
  {
    id: '1f26fa10-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem: 'gdmn-sales-representative',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-09-17T11:26:37.617Z',
    },
    status: 'READY',
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        contact: {
          id: '1366948551',
          name: 'contact',
          visible: true,
          description: 'Контакты',
          data: [
            {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
              contractNumber: '53',
              contractDate: '2013-12-10',
              paycond: 'отсрочка 20 б/д_поручение',
              phoneNumber: '8-017-000-00-00, 000-00-00',
            },
            {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
              contractNumber: '573/18',
              contractDate: '2018-04-19',
              paycond: 'отсрочка 3 к/д_поручение',
              phoneNumber: '8-017-101-01-01',
            },
            {
              id: '1908473665',
              name: 'ООО "ПродуктМаг"',
              contractNumber: '309-СР',
              contractDate: '2020-01-24',
              paycond: 'отсрочка 45 к/д_ поручение',
              phoneNumber: '8-017-999-99-99, 99-99-99',
            },
          ],
        },
        good: {
          id: '1366948553',
          name: 'good',
          visible: true,
          description: 'Товары',
          metadata: {
            id: {
              sortOrder: 0,
              name: 'Идентификатор',
            },
            name: {
              sortOrder: 0,
              name: 'Наименование',
            },
            goodgroup: {
              sortOrder: 0,
              name: 'Группа ТМЦ',
            },
            alias: {
              sortOrder: 0,
              name: 'Алиас',
            },
            barcode: {
              sortOrder: 0,
              name: 'Баркод',
            },
            priceFsn: {
              sortOrder: 0,
              name: 'ФСН',
            },
            priceFso: {
              sortOrder: 0,
              name: 'ФСО',
            },
            priceFsnSklad: {
              sortOrder: 0,
              name: 'ФСН со склада',
            },
            priceFsoSklad: {
              sortOrder: 0,
              name: 'ФСО со склада',
            },
            valuename: {
              sortOrder: 0,
              name: 'Ед изм',
            },
            invWeight: {
              sortOrder: 0,
              name: 'Вес единицы',
            },
            vat: {
              sortOrder: 0,
              name: 'НДС',
            },
            scale: {
              sortOrder: 0,
              name: 'Кол-во в упаковке',
            },
          },
          data: [
            {
              id: '955211845',
              name: 'Колб. изд. "Колбаса Мортаделла"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403530',
              barcode: '4810173019169',
              priceFsn: 18.78,
              priceFso: 18.31,
              priceFsnSklad: 18.78,
              priceFsoSklad: 18.78,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '955211846',
              name: 'Колб. изд. "Колбаса Сливочная"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403531',
              barcode: '4810173019179',
              priceFsn: 18.56,
              priceFso: 18.12,
              priceFsnSklad: 18.56,
              priceFsoSklad: 18.56,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '955211847',
              name: 'Колб. изд. "Колбаса Столичная"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403532',
              barcode: '4810173019189',
              priceFsn: 18.32,
              priceFso: 18.02,
              priceFsnSklad: 18.32,
              priceFsoSklad: 18.32,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '1572500926',
              name: 'Ветчина вар.',
              goodgroup: { id: '690457773', name: '02. Ветчины' },
              alias: '4403505',
              barcode: '4810173018286',
              priceFsn: 4.37,
              priceFso: 4.26,
              priceFsnSklad: 4.37,
              priceFsoSklad: 4.37,
              valuename: 'Батон',
              invWeight: 0.45,
              vat: 10,
            },
            {
              id: '1572500927',
              name: 'Ветчина вар. Любительская',
              goodgroup: { id: '690457773', name: '02. Ветчины' },
              alias: '4403506',
              barcode: '4810173018186',
              priceFsn: 4.37,
              priceFso: 4.26,
              priceFsnSklad: 4.37,
              priceFsoSklad: 4.37,
              valuename: 'Батон',
              invWeight: 0.45,
              vat: 10,
            },
            {
              id: '857817085',
              name: 'Колбаса вареная докторская',
              goodgroup: { id: '690457770', name: '01. Колбасы вареные' },
              alias: '4403527',
              barcode: '4810163019107',
              priceFsn: 4.82,
              priceFso: 4.24,
              priceFsnSklad: 5.18,
              priceFsoSklad: 5.18,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '857817086',
              name: 'Колбаса вареная молочная',
              goodgroup: { id: '690457770', name: '01. Колбасы вареные' },
              alias: '4403528',
              barcode: '4810173019107',
              priceFsn: 4.72,
              priceFso: 4.14,
              priceFsnSklad: 5.08,
              priceFsoSklad: 5.08,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '147035338',
              name: 'Колбаски баварские',
              goodgroup: { id: '690457778', name: '05. Продукты, колбаски' },
              alias: '4403007',
              barcode: '4810173002368',
              priceFsn: 20.42,
              priceFso: 19.78,
              priceFsnSklad: 20.42,
              priceFsoSklad: 20.42,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '147035339',
              name: 'Колбаски балканские',
              goodgroup: { id: '690457778', name: '05. Продукты, колбаски' },
              alias: '4403008',
              barcode: '4810173002369',
              priceFsn: 20.27,
              priceFso: 19.78,
              priceFsnSklad: 20.27,
              priceFsoSklad: 20.27,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686297',
              name: 'Сосиски молочные',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403149',
              barcode: '4810173012249',
              priceFsn: 5.45,
              priceFso: 5.45,
              priceFsnSklad: 5.45,
              priceFsoSklad: 5.45,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686298',
              name: 'Сосиски докторские',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403139',
              barcode: '4810173012259',
              priceFsn: 5.35,
              priceFso: 5.35,
              priceFsnSklad: 5.35,
              priceFsoSklad: 5.35,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686299',
              name: 'Сосиски сливочные',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403129',
              barcode: '4810173012269',
              priceFsn: 5.85,
              priceFso: 5.85,
              priceFsnSklad: 5.85,
              priceFsoSklad: 5.85,
              valuename: 'кг',
              invWeight: 1,
              vat: 10,
            },
          ],
        },
        department: {
          id: '1366948555',
          name: 'department',
          visible: true,
          description: 'Оптовые склады',
          data: [
            { id: '356606359', name: 'адм. Строительный участок агрокомплекса' },
            { id: '357852112', name: 'адм. Сельскохозяйственное отделение' },
            { id: '357852115', name: 'Участок технического обслуживания' },
            { id: '357852117', name: 'Магазин-склад' },
            { id: '357852119', name: 'адм. Склад запасных частей' },
            { id: '182879040', name: 'адм. цех №1' },
            { id: '167337867', name: 'Участок по монтажу технологического оборудования' },
          ],
        },
        packageType: {
          id: '1366948557',
          name: 'packageType',
          visible: true,
          description: 'Типы упаковки',
          data: [
            { id: '273098056', name: '3' },
            { id: '273098057', name: '5' },
            { id: '273098058', name: '10' },
            { id: '514132623', name: 'Мал. батон' },
            { id: '514132624', name: 'Больш. батон' },
            { id: '615762858', name: 'Большой батон 5' },
            { id: '615762859', name: 'Большой батон 10' },
            { id: '1607786772', name: '500 гр.-700  гр.(10)' },
            { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            { id: '1617776619', name: 'Мал. батон 5' },
            { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            { id: '1617776621', name: 'Мал. батон 10' },
            { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            { id: '1760463491', name: '1 кг' },
            { id: '1811739170', name: '2 кг' },
            { id: '1811739176', name: '5 кг' },
          ],
        },
        goodGroup: {
          id: '1366948559',
          name: 'goodGroup',
          visible: true,
          description: 'Группы ТМЦ',
          data: [
            {
              id: '147034075',
              parent: '',
              name: '01. Цех по производству готовой продукции',
            },
            {
              id: '690457770',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '01. Колбасы вареные',
            },
            {
              id: '690457773',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '02. Ветчины',
            },
            {
              id: '955211845',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '03. Продукты, колбасы',
            },
            {
              id: '147014069',
              parent: '',
              name: '02. Готовая продукция',
            },
            {
              id: '690457771',
              parent: {
                id: '147014069',
                name: '02. Готовая продукция',
              },
              name: '04. Сосиски',
            },
            {
              id: '690457778',
              parent: {
                id: '147014069',
                name: '02. Готовая продукция',
              },
              name: '05. Продукты, колбаски',
            },
          ],
        },
        outlet: {
          id: '1366948561',
          name: 'outlet',
          visible: true,
          description: 'Магазины',
          data: [
            {
              id: '3121846445',
              name: 'Магазин "МаркетКомпани" № 1',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Лесная, 27',
              lon: 27.53348781,
              lat: 53.87221663,
            },
            {
              id: '1121464445',
              name: 'Магазин "МаркетКомпани" № 2',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Садовая, 15',
              lon: 27.6189887,
              lat: 53.92445003,
            },
            {
              id: '1367139123',
              name: 'Магазин "МаркетКомпани" № 3',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Центральная, 102',
              lon: 27.49557362,
              lat: 53.86911555,
            },
            {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Набережная, 42',
              lon: 27.45957146,
              lat: 53.89014778,
            },
            {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Луговая, 41 Б',
              lon: 27.62643789,
              lat: 53.93614876,
            },
            {
              id: '1854869537',
              name: 'Магазин "ЕдаЭксперт" № 3',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Полевая, 20/2',
              lon: 27.46942,
              lat: 53.91352574,
            },
            {
              id: '1673741713',
              name: 'Магазин "ЕдаЭксперт" № 4',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Солнечная, 7 Б',
              lon: 27.64203153,
              lat: 53.94083047,
            },
            {
              id: '1822992103',
              name: 'Магазин "ЕдаЭксперт" № 5',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Речная, 74',
              lon: 27.52604237,
              lat: 53.92429278,
            },
            {
              id: '1475086884',
              name: 'ООО "ПродуктМаг" Магазин " 1"',
              company: { id: '1908473665', name: 'ООО "ПродуктМаг"' },
              phoneNumber: '',
              address: 'г. Минск ул. Озерная, 18',
              lon: 27.65653043,
              lat: 53.92721826,
            },
          ],
        },
        packageGood: {
          id: '1366948563',
          name: 'packageGood',
          visible: true,
          description: 'Соответствие  товаров и упаковок',
          data: [
            {
              id: '184963314',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            },
            {
              id: '184963315',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            },
            {
              id: '184963317',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            },
            {
              id: '184963314',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            },
            {
              id: '184913315',
              good: { id: '807686298', name: 'Сосиски докторские' },
              package: { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            },
            {
              id: '184913316',
              good: { id: '807686298', name: 'Сосиски докторские' },
              package: { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            },
            {
              id: '184913317',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              package: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
            },
            {
              id: '184913318',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              package: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
            },
            {
              id: '185963314',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786773',
                name: '2 кг. - 3 кг.(5)',
              },
            },
            {
              id: '185963315',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786791',
                name: '2 кг. - 3 кг.(10)',
              },
            },
            {
              id: '185963317',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
            },
            {
              id: '185963314',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
            },
            {
              id: '1901774292',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
              },
              package: {
                id: '1760463491',
                name: '1 кг',
              },
            },
            {
              id: '1901774295',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
              },
              package: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: '1901774293',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
              },
              package: {
                id: '1760463491',
                name: '1 кг',
              },
            },
            {
              id: '1901774294',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
              },
              package: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: '205515518',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515519',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515511',
              good: {
                id: '955211846',
                name: 'Колб. изд. "Колбаса Сливочная"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515512',
              good: {
                id: '955211846',
                name: 'Колб. изд. "Колбаса Сливочная"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515514',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515515',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '1918111192',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '1918111195',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '1918111196',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: '1918111197',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
            {
              id: '1918111191',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '1918111193',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '1918111194',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: '1918111198',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
            {
              id: '502428160',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '502428161',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '205515524',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515525',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '502428160',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '502428161',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '205515524',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515525',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
          ],
        },
        documentType: {
          id: '1366948565',
          name: 'documentType',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              name: 'order',
              id: '147033366',
              description: '05. Заявка1 (организация)',
            },
            {
              name: 'return',
              id: '147854428',
              description: '02. Накладная на возврат готовой продукции',
            },
            {
              name: 'route',
              id: '1366949042',
              description: '01. Список маршрутов для агентов',
            },
          ],
        },
        debt: {
          id: '1366948567',
          name: 'debt',
          visible: true,
          description: 'Дебиторские задолженности',
          data: [
            {
              id: '1003948567',
              contact: {
                id: '147042924',
                name: 'ОАО "МаркетКомпани"',
              },
              ondate: '2021-11-24T10:31:35.138Z',
              saldo: 2345600,
              saldoDebt: 1745,
            },
            {
              id: '1002948567',
              contact: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              ondate: '2021-11-24T10:31:35.138Z',
              saldo: -16750,
              saldoDebt: 0,
            },
            {
              id: '1001948567',
              contact: {
                id: '1788296478',
                name: 'ООО "ПродуктМаг"',
              },
              ondate: '2021-11-24T10:31:35.138Z',
              saldo: 689571,
              saldoDebt: 12456,
            },
          ],
        },
        goodMatrix: {
          id: '147040781',
          name: 'goodMatrix',
          visible: true,
          description: 'Матрицы',
          metadata: {
            contactId: {
              sortOrder: 0,
              name: 'Организация',
              visible: false,
            },
            goodId: {
              sortOrder: 1,
              name: 'Идентификатор',
            },
            priceFsn: {
              sortOrder: 2,
              name: 'Цена ФСН',
            },
            priceFso: {
              sortOrder: 3,
              name: 'Цена ФСО',
            },
            priceFsnSklad: {
              sortOrder: 4,
              name: 'Цена ФСН склад',
            },
            priceFsoSklad: {
              sortOrder: 5,
              name: 'Цена ФСО склад',
            },
          },
          data: [
            {
              contactId: '147042924',
              onDate: '2021-12-07',
              data: [
                {
                  goodId: '955211845',
                  priceFsn: 18.78,
                  priceFso: 18.31,
                  priceFsnSklad: 18.78,
                  priceFsoSklad: 18.78,
                },
                {
                  goodId: '955211846',
                  priceFsn: 18.56,
                  priceFso: 18.12,
                  priceFsnSklad: 18.56,
                  priceFsoSklad: 18.56,
                },
              ],
            },
            {
              contactId: '1788296478',
              onDate: '2021-12-07T10:31:35.138Z',
              data: [
                {
                  goodId: '955211846',
                  priceFsn: 18.56,
                  priceFso: 18.12,
                  priceFsnSklad: 18.56,
                  priceFsoSklad: 18.56,
                },
                {
                  goodId: '807686297',
                  priceFsn: 5.45,
                  priceFso: 5.45,
                  priceFsnSklad: 5.45,
                  priceFsoSklad: 5.45,
                },
                {
                  goodId: '147035338',
                  priceFsn: 20.42,
                  priceFso: 18.02,
                  priceFsnSklad: 20.42,
                  priceFsoSklad: 20.42,
                },
                {
                  goodId: '807686299',
                  priceFsn: 5.85,
                  priceFso: 5.85,
                  priceFsnSklad: 5.85,
                  priceFsoSklad: 5.85,
                },
                {
                  goodId: '955211847',
                  priceFsn: 18.32,
                  priceFso: 18.02,
                  priceFsnSklad: 18.32,
                  priceFsoSklad: 18.32,
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: '1f511750-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem: 'gdmn-sales-representative',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-09-17T11:26:37.893Z',
    },
    status: 'READY',
    body: {
      type: 'DOCS',
      version: 1,
      payload: [
        {
          id: '1367139385',
          number: '1',
          documentDate: '2021-09-16',
          documentType: {
            id: '1366949042',
            name: 'route',
            description: '01. Список маршрутов для агентов',
          },
          status: 'DRAFT',
          head: {
            agent: {
              id: '875701130',
              name: 'Короткевич З.С.',
            },
          },
          lines: [
            {
              id: '1367136451',
              ordNumber: 1,
              visited: false,
              outlet: {
                id: '3121846445',
                name: 'Магазин "МаркетКомпани" № 1',
                address: 'г. Минск ул. Лесная , 27',
              },
            },
            {
              id: '1367136452',
              ordNumber: 2,
              visited: false,
              outlet: {
                id: '1367139123',
                name: 'Магазин "МаркетКомпани" № 3',
                address: 'г. Минск ул. Центральная, 102',
              },
            },
            {
              id: '1367136453',
              ordNumber: 3,
              visited: false,
              outlet: {
                id: '819293369',
                name: 'Магазин "ЕдаЭксперт" № 1',
                address: 'г. Минск ул. Набережная, 42',
              },
            },
            {
              id: '1367136454',
              ordNumber: 4,
              visited: false,
              outlet: {
                id: '1854869537',
                name: 'Магазин "ЕдаЭксперт" № 3',
                address: 'г. Минск ул. Полевая, 20/2',
              },
            },
            {
              id: '1367136455',
              ordNumber: 5,
              visited: false,
              outlet: {
                id: '1822992103',
                name: 'Магазин "ЕдаЭксперт" № 5',
                address: 'г. Минск ул. Речная, 74',
              },
            },
          ],
        },
        {
          id: '1367136392',
          number: '2',
          documentDate: '2021-09-17',
          documentType: {
            id: '1366949042',
            name: 'route',
            description: '01. Список маршрутов для агентов',
          },
          status: 'DRAFT',
          head: {
            agent: {
              id: '875701130',
              name: 'Короткевич З.С.',
            },
          },
          lines: [
            {
              id: '1367136451',
              ordNumber: 6,
              visited: false,
              outlet: {
                id: '1121464445',
                name: 'Магазин "МаркетКомпани" № 2',
                address: 'г. Минск ул. Садовая , 15',
              },
            },
            {
              id: '1673741713',
              ordNumber: 7,
              visited: false,
              outlet: {
                id: '498076351',
                name: 'Магазин "ЕдаЭксперт" № 2',
                address: 'г. Минск ул. Луговая, 41 Б',
              },
            },
            {
              id: '1367136453',
              ordNumber: 8,
              visited: false,
              outlet: {
                id: '1673741713',
                name: 'Магазин "ЕдаЭксперт" № 4',
                address: 'г. Минск ул. Солнечная, 7 Б',
              },
            },
            {
              id: '1367136454',
              ordNumber: 9,
              visited: false,
              outlet: {
                id: '1475086884',
                name: 'ООО "ПродуктМаг" Магазин " 1"',
                address: 'г. Минск ул. Озерная, 18',
              },
            },
          ],
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d2',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: '2021-11-24T10:31:35.138Z',
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: '2021-11-24T10:31:26.332Z',
            outlet: {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e89',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
                priceFsn: 4.82,
              },
              quantity: 2,
              packagekey: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e88',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
                priceFsn: 4.82,
              },
              quantity: 2,
              packagekey: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
          ],
          creationDate: '2021-11-24T10:31:35.138Z',
          editionDate: '2021-11-24T10:33:21.499Z',
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d3',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: '2021-11-24T10:31:35.138Z',
          status: 'READY',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: '2021-11-24T10:31:26.332Z',
            outlet: {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e87',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
                priceFsn: 4.37,
              },
              quantity: 2,
              packagekey: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e86',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
                priceFsn: 4.37,
              },
              quantity: 2,
              packagekey: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
          ],
          creationDate: '2021-11-24T10:31:35.138Z',
          editionDate: '2021-11-24T10:33:21.499Z',
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d5',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: '2021-11-24T10:31:35.138Z',
          status: 'SENT',
          head: {
            contact: {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
            },
            onDate: '2021-11-24T10:31:26.332Z',
            outlet: {
              id: '1121464445',
              name: 'Магазин "МаркетКомпани" № 2',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e85',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
                priceFsn: 20.42,
              },
              quantity: 2,
              packagekey: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e84',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
                priceFsn: 20.27,
              },
              quantity: 2,
              packagekey: {
                id: '1811739170',
                name: '2 кг',
              },
            },
          ],
          creationDate: '2021-11-24T10:31:35.138Z',
          editionDate: '2021-11-24T10:33:21.499Z',
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27da',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: '2021-11-24T14:02:55.886Z',
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            outlet: {
              id: '1854869537',
              name: 'Магазин "ЕдаЭксперт" № 3',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e83',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              quantity: 2,
              packagekey: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e82',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              quantity: 2,
              packagekey: {
                id: '1607786773',
                name: '2 кг. - 3 кг.(5)',
              },
            },
          ],
          creationDate: '2021-11-24T14:02:55.886Z',
          editionDate: '2021-11-24T14:03:29.490Z',
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27dd',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: '2021-11-24T14:02:55.886Z',
          status: 'READY',
          head: {
            contact: {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
            },
            outlet: {
              id: '1367139123',
              name: 'Магазин "МаркетКомпани" № 3',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e81',
              good: {
                id: '807686297',
                name: 'Сосиски молочные',
              },
              quantity: 2,
              packagekey: {
                id: '1607786791',
                name: '2 кг. - 3 кг.(10)',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e80',
              good: {
                id: '807686297',
                name: 'Сосиски молочные',
              },
              quantity: 2,
              packagekey: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
            },
          ],
          creationDate: '2021-11-24T14:02:55.886Z',
          editionDate: '2021-11-24T14:03:29.490Z',
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27db',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: '2021-11-24T14:02:55.886Z',
          status: 'SENT',
          head: {
            contact: {
              id: '1908473665',
              name: 'ООО "ПродуктМаг"',
            },
            outlet: {
              id: '1475086884',
              name: 'ООО "ПродуктМаг" Магазин № 1',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e79',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              quantity: 2,
              packagekey: {
                id: '1617776619',
                name: 'мал. батон 5',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e78',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              quantity: 2,
              packagekey: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e77',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              quantity: 2,
              packagekey: {
                id: '273098057',
                name: '5',
              },
            },
          ],
          creationDate: '2021-11-24T14:02:55.886Z',
          editionDate: '2021-11-24T14:03:29.490Z',
        },
      ] as any[],
    },
  },
  {
    id: '1f5cd720-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem: 'gdmn-sales-representative',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-09-17T11:26:37.970Z',
    },
    status: 'READY',
    body: {
      type: 'SETTINGS',
      version: 1,
      payload: [
        {
          depart: { id: '357852117', name: 'Магазин-склад' },
        },
      ] as any[],
    },
  },
];

export const messageInventory: IMessage<MessageType>[] = [
  {
    id: '147293383',
    status: 'READY',
    head: {
      appSystem: 'app-inventory',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user1,
      dateTime: '2021-12-01',
    },
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        goodGroup: {
          id: '187037519',
          name: 'goodGroup',
          visible: true,
          description: 'Группы ТМЦ',
          data: [
            {
              id: '147059221',
              name: 'КОЛБАСНЫЕ ИЗДЕЛИЯ',
            },
            {
              id: '147059282',
              name: 'Полукопченые колбасные изделия',
            },
            {
              id: '147059306',
              name: 'Нефондовые',
            },
            {
              id: '147059315',
              name: 'Варено-копченые колбасные изделия',
            },
            {
              id: '147059335',
              name: 'Сосиски',
            },
            {
              id: '147059375',
              name: 'Сардельки',
            },
            {
              id: '147059386',
              name: 'Копчености',
            },
            {
              id: '147059405',
              name: 'Вареные колбасные изделия',
            },
            {
              id: '147059415',
              name: 'Сыровяленые колбасные изделия',
            },
            {
              id: '147059436',
              name: 'Шпик',
            },
            {
              id: '147059439',
              name: 'Сырокопченые колбасные изделия',
            },
            {
              id: '147059461',
              name: 'ДЛЯ НАС',
            },
          ],
        },
        documentType: {
          id: '187037521',
          name: 'documentType',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              id: '147037014',
              name: 'prihod',
              description: '01. Накладная на получение товара',
            },
            {
              id: '178260365',
              name: 'scan',
              description: 'Прослеживаемость.Сканирования',
            },
            {
              id: '187034606',
              name: 'inventory',
              description: 'WS. Переучёт',
            },
          ],
        },
        good: {
          id: '187037523',
          name: 'good',
          visible: true,
          description: 'Справочник ТМЦ',
          data: [
            {
              id: 'unknown',
              name: 'Неизвестный товар',
              alias: '',
              barcode: '',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '153359486',
              name: 'Книга',
              alias: '',
              barcode: '9789854480947',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '111159486',
              name: 'Тетрадь',
              alias: '',
              barcode: '3329687853219',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '153359485',
              alias: '',
              barcode: '',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Изделие колбасное "Рулет Европейский с грибами и шпинатом" в',
            },
            {
              id: '153367898',
              alias: '',
              barcode: '9913000005221',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Рулет"Европейский с грибами и шпинатом"',
            },
            {
              id: '157381934',
              alias: '',
              barcode: '9913000005047',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Рулет ИСПАНСКИЙ С ОЛИВКАМИ вес .',
            },
            {
              id: '172067346',
              alias: '',
              barcode: '4811219038625',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса ЯРМОРОЧНАЯАРОМАТНАЯ НОВАЯ п/к 2с(газовая среда) РБ',
            },
            {
              id: '185970902',
              alias: '3540029',
              barcode: '',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса ЯРМАРОЧНАЯ ароматная новая п/к 2с кг',
            },
            {
              id: '147066836',
              alias: '',
              barcode: '00757',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса КУРОРТНАЯ ПЛЮС п/к 2с 1кг РБ',
            },
            {
              id: '147066837',
              alias: '',
              barcode: '02816',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаски К ПИВУ НОВЫЕ п/к 2с (газ. среда) 1кг РБ',
            },
            {
              id: '147066838',
              alias: '',
              barcode: '02706',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса ДЛЯ ГРИЛЯ МИКС п/к 2с 1кг РБ',
            },
            {
              id: '147066839',
              alias: '',
              barcode: '02711',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса КРЕСТЬЯНСКАЯ МИКС п/к 2с (газ. среда) 1кг РБ',
            },
            {
              id: '147066840',
              alias: '',
              barcode: '03067',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса ЯРМАРОЧНАЯ п/к 2с 1кг (газ.среда) РБ',
            },
            {
              id: '147067755',
              alias: '',
              barcode: '2000100029466',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Фарш  ОСОБЫЙ ГРАНД  зам.1кгфас. Беларусь',
            },
          ],
        },
        department: {
          id: '187037527',
          name: 'department',
          visible: true,
          description: 'Подразделение',
          data: [
            {
              id: '176424776',
              name: '"ПАЧАСТУНАК З ВАУКАВЫСКА" (г.Брест,ул.Пушкинская,1-63а)',
            },
            {
              id: '147030694',
              name: 'Склад_минск',
            },
            {
              id: '147016473',
              name: 'Отдел сбыта',
            },
            {
              id: '147030695',
              name: 'Склад_новополоцк',
            },
            {
              id: '147030696',
              name: 'Склад_Лида',
            },
          ],
        },
        contact: {
          id: '147023423',
          name: 'contact',
          visible: true,
          description: 'Контакты',
          data: [
            {
              id: '147016471',
              name: 'ООО "ГРИНрозница"',
              contractNumber: '11/20',
              contractDate: '2020-12-01',
              paycond: 'отсрочка 15 к/д_поручение',
              phoneNumber: '8-029-677-37-84,8-0162-46-21-66',
            },
            {
              id: '147016507',
              name: 'ООО "Евроторг"',
              contractNumber: '1/2001',
              contractDate: '2020-12-01',
              paycond: 'отсрочка 15 б/д_требование',
              phoneNumber: '',
            },
            {
              id: '147016513',
              name: 'ЗАО "Раница"',
              contractNumber: '20/20',
              contractDate: '2020-12-01',
              paycond: 'отсрочка 14 к/д_поручение',
              phoneNumber: '816-21-30,210-76-24',
            },
            {
              id: '147016523',
              name: 'ОДО "Атлас"',
              contractNumber: '34/20',
              contractDate: '2020-12-01',
              paycond: 'по факту поставки_поручение',
              phoneNumber: '8-0214-46-04-33',
            },
          ],
        },
        remain: {
          id: '187037529',
          name: 'remain',
          visible: true,
          description: 'Остатки ТМЦ',
          data: [
            {
              departmentId: '176424776',
              onDate: '2021-12-16',
              data: [
                {
                  goodId: '153359486',
                  price: 21.01,
                  q: 2.567,
                },
                {
                  goodId: '153359485',
                  price: 11.11,
                  q: 10.988,
                },
                {
                  goodId: '111159486',
                  price: 13.13,
                  q: 13.666,
                },
                {
                  goodId: '153367898',
                  price: 9.82,
                  q: 2,
                },
                {
                  goodId: '157381934',
                  price: 1.77,
                  q: 11,
                },
                {
                  goodId: '172067346',
                  price: 13.5,
                  q: 2,
                },
              ],
            },
          ],
        },
      },
    },
  },
];
