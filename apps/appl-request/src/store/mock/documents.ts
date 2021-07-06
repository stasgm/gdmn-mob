import { IDocfMetadata } from '@lib/types';

import { IApplDocument, IApplHead, IApplLine } from '../types';

// Метаданные для документа заявки
export const applDocMetadata: IDocfMetadata<IApplHead, IApplLine> = {
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
export const applDocuments: IApplDocument[] = [
  {
    id: '172846156',
    number: '104',
    documentDate: '2021-06-07',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Текущий ремонт зерноуборочных комбайнов',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039555',
        name: '"Комбаин з/у КЗС-1218 -03 """"Палессе"""""',
      },
      faGoodNumber: '13316',
      cancelReason: 'Текущий ремонт ЧЕГО????',
    },
    lines: [
      {
        id: '172846487',
        orderNum: 1,
        goodName: '30.01.2199 Амортизатор маховика',
        quantity: 200,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174360229',
    number: '473',
    documentDate: '2021-06-07',
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
        'Просим Вас закупить данный компрессор на трактор который задействован на внесении минеральных удобрений.',
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
      faGoodNumber: '701442',
    },
    lines: [
      {
        id: '174361484',
        orderNum: 1,
        goodName: 'Компрессор Д-260 А29.05.000 БЗА',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173861356',
    number: '132',
    documentDate: '2021-06-12',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168355281',
        name: 'Электрика',
      },
      justification:
        'износ акамуляторов . снижение пусковых характеристик ниже 40% на мега 350 .кзс1218-10.амкадор-332.маз5337.камаз0765мбм .мтз 1221 .мтз82',
      sysApplicant: {
        id: '170271835',
        name: 'Беляев Александр Александрович',
      },
      applicant: {
        id: '170271835',
        name: 'Беляев Александр Александрович',
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
        id: '173861358',
        orderNum: 1,
        goodName: 'акамулятор 12в 135а/ч 1000а 635 052 100 ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '173861362',
        orderNum: 2,
        goodName: 'акамулятор 12в 190а/ч 1300а 6ст-190 vl(190а/ч)',
        quantity: 11,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174413306',
        orderNum: 3,
        goodName: 'акамулятор 12в 100а/ч 850а',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173862233',
    number: '136',
    documentDate: '2021-06-12',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Полный износ шины, стерт протектор, присутствуют порезы, инв№256222',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      specPreAgree: {
        id: '149062238',
        name: 'Мойсейков Алексей Александрович',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      cancelReason: 'Может 13,6 R20?',
    },
    lines: [
      {
        id: '173862235',
        orderNum: 1,
        goodName: 'Тракторная шина с камерой 13.6 R-20',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '173862236',
        orderNum: 2,
        goodName: 'Тракторная шина с камерой 16.9 R-38 ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173868596',
    number: '139',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'протерло лопатки -требуется замена',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      specPreAgree: {
        id: '149062238',
        name: 'Мойсейков Алексей Александрович',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '171495293',
        name: 'Прицепной разбрасыватель минеральных удобрений TWS 85,1 c AX',
      },
      faGoodNumber: '9210',
    },
    lines: [
      {
        id: '173868598',
        orderNum: 1,
        goodName: 'лопатка R3087139',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '173868599',
        orderNum: 2,
        goodName: 'лопатка R3087074',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174005406',
        orderNum: 3,
        goodName: 'R3087074-01',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174005611',
        orderNum: 4,
        goodName: 'R3087139-01',
        quantity: 2,
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
        orderNum: 1,
        goodName: 'Диагностика, ремонт и заправка кондиционера ',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Банка на 1л',
        quantity: 400,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '172472159',
        orderNum: 2,
        goodName: 'Электропривод для медогонки на 220В',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '172472160',
        orderNum: 3,
        goodName: 'Перчатки из натуральной кожи',
        quantity: 1,
        value: {
          id: '147007798',
          name: 'пара',
        },
      },
      {
        id: '172472161',
        orderNum: 4,
        goodName: 'Лицевая сетка пчеловода',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173949914',
    number: '138',
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
        id: '170272866',
        name: 'Машинно-тракторный парк_Лапанович',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'Требуется приезд специалиста для проведения То трактора МТЗ-1523 зав№ Y4R152301K1100849, двиг.№170353, инв.№702926',
      sysApplicant: {
        id: '170273143',
        name: 'Шут Валерий Юрьевич',
      },
      applicant: {
        id: '170273143',
        name: 'Шут Валерий Юрьевич',
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
        id: '173949961',
        orderNum: 1,
        goodName: 'Приезд специалиста + проведение ТО (2750 м/ч)',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '173950061',
        orderNum: 2,
        goodName: 'Материалы для проведения ТО (2750 м/ч)',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Вал карданый (705 мм) 54341-2201010-10',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174063438',
        orderNum: 2,
        goodName: 'Регулятор тормозных сил 4757100200',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174065622',
    number: '143',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Передняя навеска не поднимается и не копирует, бъет ошибку,Беларус-3522 ,инв№702945',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
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
        id: '174065627',
        orderNum: 1,
        goodName: 'Выезд специалиста и устранение неполадок на тракторе',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Диск сцепления 85-1601090',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174066030',
        orderNum: 2,
        goodName: 'Диск ведомый 85-1601130-01',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174066042',
        orderNum: 3,
        goodName: 'Отводка 50-1601180-А',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174075370',
    number: '144',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Подготовка машины для прохождения техосмотра ГАЗ-2705, ИНВ№1315995',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
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
        id: '174075373',
        orderNum: 1,
        goodName: 'Ролик направляющий 26194',
        quantity: 6,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075482',
        orderNum: 2,
        goodName: 'Кронштейн глушителя  (нового оброзца) К/Т, 039/69/3163',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075493',
        orderNum: 3,
        goodName: 'Фара правая нового оброзца (0301215)',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075496',
        orderNum: 4,
        goodName: 'Барабан тормозной задний 02070',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075501',
        orderNum: 5,
        goodName: 'Колодка тормозная задняя 02090',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075505',
        orderNum: 6,
        goodName: 'Трубка промежуточная 03250',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075545',
        orderNum: 7,
        goodName: 'Глушитель 01010',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075546',
        orderNum: 8,
        goodName: 'Трубка выхлопная 03170',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075774',
        orderNum: 9,
        goodName: 'Амортизатор глушителя 03163',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075777',
        orderNum: 10,
        goodName: 'Хомут глушителя 03031',
        quantity: 3,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174075783',
    number: '145',
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
        id: '170272157',
        name: 'Склад ГСМ',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Для измерения ГСМ',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
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
        id: '174075785',
        orderNum: 1,
        goodName: 'Ареометр АНТ-2 670-750 670-750 КГ/М',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075787',
        orderNum: 2,
        goodName: 'Ареометр АНТ-2 750-830 РФ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174075789',
        orderNum: 3,
        goodName: 'Ареометр АНТ-2 830-910 РФ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174087122',
    number: '129',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'обеспечение зерноуборочных комбайнов средствами безопасности ',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039555',
        name: '"Комбаин з/у КЗС-1218 -03 """"Палессе"""""',
      },
      faGoodNumber: '13316',
    },
    lines: [
      {
        id: '174087132',
        orderNum: 1,
        goodName: 'паралон (катушка)',
        quantity: 8,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174087135',
        orderNum: 2,
        goodName: 'клей для паралона №88 банка 0,5кг',
        quantity: 8,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174087144',
        orderNum: 3,
        goodName: 'пена монтажная с одноразовым нипелем-трубкой (70л)',
        quantity: 40,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174088522',
        orderNum: 4,
        goodName: 'ведро оцинкованное 12л ',
        quantity: 8,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174089117',
        orderNum: 5,
        goodName: 'кошма пожарная',
        quantity: 8,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174089120',
        orderNum: 6,
        goodName: 'шприц для смазки ',
        quantity: 20,
        value: {
          id: '171374175',
          name: 'шт',
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
        orderNum: 1,
        goodName: 'Насос Suntec 17 CCC 1002 4P',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096213',
        orderNum: 2,
        goodName: 'Манометр для насоса',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096316',
        orderNum: 3,
        goodName: 'Шланг топливный 1/2',
        quantity: 2,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174096468',
        orderNum: 4,
        goodName: 'Эл.Дв. АИР100L 5.5 кВт',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Цилиндр тормозной задний 3309-3501340',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108713',
        orderNum: 2,
        goodName: 'Трос 3307-3508181-02',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108730',
        orderNum: 3,
        goodName: 'Трос 3307-3508180-02',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108744',
        orderNum: 4,
        goodName: 'Колодка тормозная 3309-3502090',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108762',
        orderNum: 5,
        goodName: 'Фонарь 4802.3731000-03 ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108791',
        orderNum: 6,
        goodName: 'Бочёк омывателя с насосом 24 В',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174108815',
        orderNum: 7,
        goodName: 'Датчик ABS 0486001066',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109138',
        orderNum: 8,
        goodName: 'Втулка обжимная II16774',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109155',
        orderNum: 9,
        goodName: 'Фонарь габаритный жёлтый 4422.3731 ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109370',
        orderNum: 10,
        goodName: 'Фонарь полного габарита 112.06.47',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109577',
        orderNum: 11,
        goodName: 'Фонарь полного габарита левый 112.06.47-01',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109617',
        orderNum: 12,
        goodName: 'Фара головного света ФГ-122-БВ1',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109803',
        orderNum: 13,
        goodName: 'Фонарь передний 112.02.22',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174109854',
        orderNum: 14,
        goodName: 'Фонарь передний габаритный 441.3712',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110226',
        orderNum: 15,
        goodName: 'Лист № 1 рессоры в сборе 53А-2902015',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110274',
        orderNum: 16,
        goodName: 'Лист № 2 рессоры в сборе 53А-2902016',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110282',
        orderNum: 17,
        goodName: 'Стремянка 53А-2902408',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110283',
        orderNum: 18,
        goodName: 'Гайка стремянки 292873-П29  ',
        quantity: 8,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110305',
        orderNum: 19,
        goodName: 'Опора рессоры нижняя 52-2902432',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110477',
        orderNum: 20,
        goodName: 'Упор 53-2902433-А ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110510',
        orderNum: 21,
        goodName: 'Опора верхняя 52-2902431',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110526',
        orderNum: 22,
        goodName: 'Манжета 51-2402052-Б4 ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110533',
        orderNum: 23,
        goodName: 'Крестовина 130-2201025 ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110581',
        orderNum: 24,
        goodName: 'Крестовина 72-2203025 ',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174110616',
        orderNum: 25,
        goodName: 'Стартер 24 В',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174166468',
    number: '148',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'износ полозов, порваны тяги',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      specPreAgree: {
        id: '149062238',
        name: 'Мойсейков Алексей Александрович',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '171493059',
        name: 'Навесная комбинация EASYCUT B 870 CV+B009',
      },
      faGoodNumber: '9342',
    },
    lines: [
      {
        id: '174166473',
        orderNum: 1,
        goodName: 'Тяга верхняя 20 034 1840',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174166476',
        orderNum: 2,
        goodName: 'Полоз высокого реза 2535663',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174166484',
        orderNum: 3,
        goodName: 'Ключ для ножей 20 033 4581',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Техническое обслуживание при наработке 2500 м/ч',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174215657',
    number: '149',
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
        id: '170272156',
        name: 'МТП Заболоть Шух',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification:
        'трактор заводится но не едет, заблокирована гидравлика,постояно включен передний мост, компьютер показывает 49 ошибок',
      sysApplicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      applicant: {
        id: '170271857',
        name: 'Шух Алексей Николаевич',
      },
      specPreAgree: {
        id: '149062238',
        name: 'Мойсейков Алексей Александрович',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-21',
      faGood: {
        id: '171498428',
        name: 'Трактор Фендт 930',
      },
      faGoodNumber: '62',
    },
    lines: [
      {
        id: '174215659',
        orderNum: 1,
        goodName: 'Выезд специалиста для диагностирования и обнаружения неполадок, а так же для их устранения ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '172472163',
    number: '468',
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
        orderNum: 1,
        goodName: 'Счётчик на воду',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174230732',
    number: '130',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'текущий ремонт',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039951',
        name: 'Погрузчик АМКОДОР 352С-02 с ковшом',
      },
      faGoodNumber: '13351',
    },
    lines: [
      {
        id: '174230788',
        orderNum: 1,
        goodName: 'радиатор системы охлаждения',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
    ],
  },
  {
    id: '174231300',
    number: '131',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'погрузка прицепа Флигель в полевых условиях',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039951',
        name: 'Погрузчик АМКОДОР 352С-02 с ковшом',
      },
      faGoodNumber: '13351',
    },
    lines: [
      {
        id: '174231314',
        orderNum: 1,
        goodName: 'стрела 352л440100б',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174231347',
        orderNum: 2,
        goodName: 'тяга 352л4402000',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
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
        orderNum: 1,
        goodName: 'Сетка МПО 50.01.050',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174234995',
        orderNum: 2,
        goodName: 'Ремень В-1600',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235109',
        orderNum: 3,
        goodName: 'Ремень Б3550',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235123',
        orderNum: 4,
        goodName: 'Ремень В2500L',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235141',
        orderNum: 5,
        goodName: 'Ремень В2360L',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235156',
        orderNum: 6,
        goodName: 'Набор ключей ражковых 6-32мм',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174235163',
        orderNum: 7,
        goodName: 'Шприц плунжерный для смазки ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174235444',
    number: '133',
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
        id: '168354459',
        name: 'Спецодежда,СИЗ,ТБ',
      },
      dept: {
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168354459',
        name: 'Спецодежда,СИЗ,ТБ',
      },
      justification:
        'Просим вас закупить необходимые средства индивидуальной защиты для обеспечения работников общества. С логотипом только костюмы, сапоги резиновые (ПВХ)',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
      faGood: {
        id: '170036121',
        name: 'Склад запчастей п. Новополесский',
      },
      faGoodNumber: '31',
      cancelReason: 'костюмы с логотипом, без?бейсболка с логотипом, без?сапоги женские какие(кожанные, ПВХ)?',
    },
    lines: [
      {
        id: '174235956',
        orderNum: 1,
        goodName: 'Костюм х/б мужской',
        quantity: 126,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174236059',
        orderNum: 2,
        goodName: 'Перчатки с 2-х слойным покрытием',
        quantity: 1000,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174236384',
        orderNum: 3,
        goodName: 'Бейсболка',
        quantity: 100,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174236450',
        orderNum: 4,
        goodName: 'Сапоги женские',
        quantity: 20,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174236473',
        orderNum: 5,
        goodName: 'Паста моющая д/рук "Автомастер" 1/400гр',
        quantity: 500,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174241915',
    number: '152',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '174100596',
        name: 'МТП Пархоменко',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Проведения ТО-2750 двигателя, наработка-2735 м/ч. Беларус-1523 зав№Y4R152301K1100810',
      sysApplicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
      },
      applicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
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
        id: '174241917',
        orderNum: 1,
        goodName: 'Выезд специалиста для проведения ТО двигателя',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174241918',
        orderNum: 2,
        goodName: 'Проведения технического обслуживания двигателя',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174241919',
        orderNum: 3,
        goodName: 'Материалы для проведения ТО',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174241921',
    number: '153',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '174100596',
        name: 'МТП Пархоменко',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Прогорел глушитель, сварке не подлежит',
      sysApplicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
      },
      applicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
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
        id: '171498016',
        name: 'Трактор Беларус-82,1',
      },
      faGoodNumber: '9148',
    },
    lines: [
      {
        id: '174241923',
        orderNum: 1,
        goodName: 'Глушитель 60-1205015 длинный ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174241925',
    number: '154',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '174100596',
        name: 'МТП Пархоменко',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Для подготовки зерноуборочных комбайнов к сезону',
      sysApplicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
      },
      applicant: {
        id: '170271851',
        name: 'Пархоменко Евгений Витальевич',
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
        id: '174241927',
        orderNum: 1,
        goodName: 'Ремень 4562, 5-ручейный',
        quantity: 8,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '174336854',
    number: '159',
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
        id: '168353581',
        name: 'Механизация',
      },
      dept: {
        id: '170272868',
        name: 'Мастерская_Рябый',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Требуется закупка запасных частей для ремонта легковых автомобилей',
      sysApplicant: {
        id: '170273143',
        name: 'Шут Валерий Юрьевич',
      },
      applicant: {
        id: '170273143',
        name: 'Шут Валерий Юрьевич',
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
      note: 'Данные запчасти приобретались в течении месяца у ИП "Шпиленя Алексей Юрьевич"',
    },
    lines: [
      {
        id: '174347239',
        orderNum: 1,
        goodName: 'Жидкость гидравлическая ATF 1л',
        quantity: 4,
        value: {
          id: '3000006',
          name: 'л',
        },
      },
      {
        id: '174348035',
        orderNum: 2,
        goodName: 'Масло моторное Avista 5W-40 1л',
        quantity: 1,
        value: {
          id: '3000006',
          name: 'л',
        },
      },
      {
        id: '174349324',
        orderNum: 3,
        goodName: 'Барабан тормозной ВАЗ 21311 LADA',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349335',
        orderNum: 4,
        goodName: 'Вентилятор отопителя салона ВАЗ 21214',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349559',
        orderNum: 5,
        goodName: 'Фильтр маслянный УАЗ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349563',
        orderNum: 6,
        goodName: 'Масло моторное Favorit 10w-40 розлив',
        quantity: 8,
        value: {
          id: '3000006',
          name: 'л',
        },
      },
      {
        id: '174349570',
        orderNum: 7,
        goodName: 'Фильтр маслянный ОС105',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349572',
        orderNum: 8,
        goodName: 'Фильтр воздушный А1050',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349576',
        orderNum: 9,
        goodName: 'Фильтр салона PF2063',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349577',
        orderNum: 10,
        goodName: 'Масло моторное ENI 10w-40 4л',
        quantity: 2,
        value: {
          id: '3000006',
          name: 'л',
        },
      },
      {
        id: '174349583',
        orderNum: 11,
        goodName: 'Фильтр топливный KL75 Kneht',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349690',
        orderNum: 12,
        goodName: 'Газ балон Китай',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349693',
        orderNum: 13,
        goodName: 'Смазка WD-40 300мл.',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349699',
        orderNum: 14,
        goodName: 'Ковер салонный резина универсальный',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174349810',
        orderNum: 15,
        goodName: 'Рейка рулевая восстановленная Motorherz VW T4',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
  {
    id: '173133793',
    number: '155',
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
        id: '168354459',
        name: 'Спецодежда,СИЗ,ТБ',
      },
      dept: {
        id: '172377997',
        name: 'Отдел ТБ',
      },
      purpose: {
        id: '168354459',
        name: 'Спецодежда,СИЗ,ТБ',
      },
      justification:
        'дозаказ к заявке №125 от 09.06.2021 года, в связи с недостаточным количеством ранее заказанных полукомбенизонов и футболок.',
      sysApplicant: {
        id: '170271869',
        name: 'Винель Наталия Сергеевна',
      },
      applicant: {
        id: '170271869',
        name: 'Винель Наталия Сергеевна',
      },
      specPreAgree: {
        id: '147351467',
        name: 'Кузнецова Кристина Александровна',
      },
      specAgreeEngin: {
        id: '149876722',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: '2021-06-18',
      note: '88-94/170-176 - 2 шт\r\n88-94/182/188 - 2 шт\r\n96-100/170-167 - 2 шт\r\n96-100/182-188 - 2 шт\r\n104-108/172-176 - 2 шт\r\n104-108/182-188 - 2 шт\r\n112-116/172-176 - 2 шт\r\n112-118/182-188 - 2 шт\r\n120-124/182-188 - 2 шт\r\n',
    },
    lines: [
      {
        id: '173133795',
        orderNum: 1,
        goodName: 'полукомбенизон (синий)',
        quantity: 18,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '173133796',
        orderNum: 2,
        goodName: 'футболка (оранжевая или красная)',
        quantity: 18,
        value: {
          id: '171374175',
          name: 'шт',
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
        orderNum: 1,
        goodName: 'Масло Mobil Pegasus 610',
        quantity: 200,
        value: {
          id: '3000006',
          name: 'л',
        },
      },
    ],
  },
  {
    id: '174370714',
    number: '134',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'Обеспечение зерноуборочных комбайнов необходимыми запасными частями',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039079',
        name: '"Комбайн з/у КЗС-1218-03 """"ПалессеGS12"""""',
      },
      faGoodNumber: '13269',
    },
    lines: [
      {
        id: '174371314',
        orderNum: 1,
        goodName: 'подшипник 1680205',
        quantity: 20,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174371557',
        orderNum: 2,
        goodName: 'подшипник 1680206',
        quantity: 20,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174371567',
        orderNum: 3,
        goodName: 'подшипник 1680207',
        quantity: 20,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
    ],
  },
  {
    id: '174388271',
    number: '135',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'подготовка комбайнов к уборочной 2021',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039079',
        name: '"Комбайн з/у КЗС-1218-03 """"ПалессеGS12"""""',
      },
      faGoodNumber: '13269',
    },
    lines: [
      {
        id: '174388400',
        orderNum: 1,
        goodName: 'ремень С5000 с22х4942',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174388505',
        orderNum: 2,
        goodName: 'ремень 2НВ4812 ла4750',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174390631',
        orderNum: 3,
        goodName: 'ремнь 2НВ 3110 ла 3048',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174390736',
        orderNum: 4,
        goodName: 'ремень 2НВ3212 ла 3150',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174390744',
        orderNum: 5,
        goodName: 'ремень 5НВ 3812 ла',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174390751',
        orderNum: 6,
        goodName: 'ремень 3 НВ 4985 ла 3НВ-4920',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174391300',
        orderNum: 7,
        goodName: 'ремень 2НВ 2162ла 2100ли',
        quantity: 10,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174391319',
        orderNum: 8,
        goodName: 'ремень 68х24 2600 лд 2485 ли зубчатый',
        quantity: 4,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
    ],
  },
  {
    id: '174404552',
    number: '136',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'текущий ремонт. Дозавоз запчастей, не поступивших по тендеру.',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '170039079',
        name: '"Комбайн з/у КЗС-1218-03 """"ПалессеGS12"""""',
      },
      faGoodNumber: '13268',
    },
    lines: [
      {
        id: '174404560',
        orderNum: 1,
        goodName: 'Вал КЗК-120202602',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174404562',
        orderNum: 2,
        goodName: 'Цилиндр вариатора РСМ 10.09.01.010А',
        quantity: 2,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174404664',
        orderNum: 3,
        goodName: 'Глазок 14.20.152004',
        quantity: 50,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
    ],
  },
  {
    id: '174405146',
    number: '137',
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
        id: '169853581',
        name: 'СХЦ Новополесский-Агро',
      },
      purpose: {
        id: '168353581',
        name: 'Механизация',
      },
      justification: 'текущий ремонт',
      sysApplicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
      },
      applicant: {
        id: '169967847',
        name: 'Андрухович Александр Михайлович',
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
        id: '147812028',
        name: 'ПРИЦЕПНОЙ ВАЛКОВАТЕЛЬ SHWADER SWADRO 1400 963578',
      },
      faGoodNumber: '133724',
    },
    lines: [
      {
        id: '174405165',
        orderNum: 1,
        goodName: '1312410 крестовина 2400 ',
        quantity: 5,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174405170',
        orderNum: 2,
        goodName: '112145 крестовина 2500',
        quantity: 5,
        value: {
          id: '171374175',
          name: 'шт',
        },
      },
      {
        id: '174405171',
        orderNum: 3,
        goodName: 'вал карданный 9559313G',
        quantity: 1,
        value: {
          id: '171374175',
          name: 'шт',
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
        orderNum: 1,
        goodName: 'Подбарабанье 06633471',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405176',
        orderNum: 2,
        goodName: 'подбарабанье 06633411',
        quantity: 3,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405177',
        orderNum: 3,
        goodName: 'колпачёк 06176300',
        quantity: 50,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405178',
        orderNum: 4,
        goodName: 'винт 05025110',
        quantity: 50,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405179',
        orderNum: 5,
        goodName: 'шайба 02393880',
        quantity: 50,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405180',
        orderNum: 6,
        goodName: 'узел подшипниковый 06450070',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405181',
        orderNum: 7,
        goodName: 'звёздочка 06508690',
        quantity: 3,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405182',
        orderNum: 8,
        goodName: 'пол 06509510',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405183',
        orderNum: 9,
        goodName: 'планка 06508670',
        quantity: 3,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405184',
        orderNum: 10,
        goodName: 'защита 06508361',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405185',
        orderNum: 11,
        goodName: 'защита 06507950',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405186',
        orderNum: 12,
        goodName: 'защита 06508371',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405187',
        orderNum: 13,
        goodName: 'наполнитель 06507901',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405188',
        orderNum: 14,
        goodName: 'ремень вариатора 06098230',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405197',
        orderNum: 15,
        goodName: 'Подшипник SA 206',
        quantity: 6,
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
        orderNum: 1,
        goodName: 'вал КЗР 0202610Б-01',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405223',
        orderNum: 2,
        goodName: 'вал КЗК-10-0202630',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405225',
        orderNum: 3,
        goodName: 'делитель КЗР 1518100',
        quantity: 2,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405226',
        orderNum: 4,
        goodName: 'колпак КЗК-12-0102474',
        quantity: 96,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405227',
        orderNum: 5,
        goodName: 'болт М10х30 DIN 603',
        quantity: 96,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405228',
        orderNum: 6,
        goodName: 'диск фрикционный КЗР 0313003',
        quantity: 4,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
      {
        id: '174405229',
        orderNum: 7,
        goodName: 'контрпривод КЗК-12-0202500',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Обойма  86-1802015-Б',
        quantity: 1,
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
        orderNum: 1,
        goodName: 'Комплект прокладок двигателя ',
        quantity: 1,
        value: {
          id: '3000001',
          name: 'шт.',
        },
      },
    ],
  },
];

/*

// Ед. изм - штуки
const value: INamedEntity = {
  id: '999',
  name: 'шт.',
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
 */
