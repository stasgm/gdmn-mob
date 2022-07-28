import { companies, user2, device } from '@lib/mock';
import { IAppSystem, IMessage, INamedEntity, MessageType } from '@lib/types';

export const appSystem: IAppSystem = {
  id: 'gdmn-fp-movement',
  name: 'gdmn-fp-movement',
};

export const messageFpMovement: IMessage<MessageType>[] = [
  {
    id: '147293377',
    status: 'READY',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user2,
      dateTime: new Date().toISOString(),
      order: 1,
      deviceId: device.id,
    },
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        documentType: {
          id: '187037521',
          name: 'documentType',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              id: '187034696',
              name: 'order',
              description: 'Заявка',
            },
            {
              id: '187034697',
              name: 'movement',
              description: 'Перемещение',
            },
            {
              id: '187034699',
              name: 'shipment',
              description: 'Реализация ГП',
              subtype: 'shipment',
            },
            {
              id: '1878916910',
              name: 'currShipment',
              description: 'Реализация ГП (валюта)',
              subtype: 'shipment',
            },
            {
              id: '1870346911',
              name: 'freeShipment',
              description: 'Отвес',
              subtype: 'shipment',
            },
          ],
        },
        documentSubtype: {
          id: '187037521',
          name: 'documentSubtype',
          visible: true,
          description: 'Типы перемещений',
          data: [
            {
              id: 'internalMovement',
              name: 'Внутренне перемещение',
            },
            {
              id: 'movement',
              name: 'Цех-перемещение',
            },
          ],
        },
        good: {
          id: '187037523',
          name: 'good',
          visible: true,
          description: 'Справочник ТМЦ',
          metadata: {
            id: {
              sortOrder: 0,
              name: 'Идентификатор',
            },
            name: {
              sortOrder: 0,
              name: 'Наименование',
            },
            shcode: {
              sortOrder: 0,
              name: 'Код',
            },
            barcode: {
              sortOrder: 0,
              name: 'Штрих-код',
            },
            valueName: {
              sortOrder: 0,
              name: 'Ед изм',
            },
            invWeight: {
              sortOrder: 0,
              name: 'Вес единицы',
            },
            scale: {
              sortOrder: 0,
              name: 'Кол-во в упаковке',
            },
          },
          data: [
            {
              id: 'unknown',
              name: 'Неизвестный товар',
              alias: '',
              barcode: 'unknown',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '153359486',
              name: 'Книга',
              alias: '86427',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              shcode: '1765',
            },
            // {
            //   id: '111159486',
            //   name: 'Тетрадь',
            //   alias: '36985',
            //   barcode: '3329687853219',
            //   valueName: 'шт',
            //   isFrac: 1,
            //   weightCode: '',
            // },
            // {
            //   id: '111159486',
            //   name: 'Тетрадь',
            //   alias: '36985',
            //   shcode: '2256',
            //   valueName: 'шт',
            // },
            {
              id: '857817085',
              name: 'Колбаса вареная докторская',
              alias: '36985',
              shcode: '2256',
              valueName: 'шт',
            },
            {
              id: '111852486',
              name: 'Ручка шариковая',
              alias: '76138',
              barcode: '00600028072213101142005',
              valueName: 'шт',
              isFrac: 1,
              shcode: '1142',
              weightCode: '',
            },
            {
              id: '147067755',
              alias: '95135',
              barcode: '2000100029466',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Степлер',
            },
            {
              id: '147067788',
              alias: '87613',
              barcode: '2000100029906',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Дырокол',
            },
            {
              id: '147067789',
              alias: '12585',
              barcode: '2000100029467',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Бейдж',
            },
            {
              id: '147067790',
              alias: '78512',
              barcode: '2000100029468',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Штамп',
            },
            {
              id: '147067791',
              alias: '12602',
              barcode: '2000100029469',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Блокнот А5',
            },
            {
              id: '147067792',
              alias: '48956',
              barcode: '2000100029470',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Календарь',
            },
            {
              id: '147067793',
              alias: '84962',
              barcode: '2000100029471',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Подставка настольная',
            },
            {
              id: '147067794',
              alias: '14652',
              barcode: '2000100029472',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Корректирующая ручка',
            },
            {
              id: '147067795',
              alias: '52622',
              barcode: '2000100029473',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Текстовыделитель',
            },
            {
              id: '153359485',
              alias: '24617',
              barcode: '3549109954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Изделие колбасное',
            },
            {
              id: '153367898',
              alias: '29167',
              barcode: '9913000005221',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Рулет Европейский',
            },
            {
              id: '157381934',
              alias: '49161',
              barcode: '9913000005047',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Смесь сухая',
            },
            {
              id: '172067346',
              alias: '72140',
              barcode: '4811219038625',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Докторская',
            },
            {
              id: '185970902',
              alias: '25156',
              barcode: '3540029954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Дрожжи',
            },
            {
              id: '147066836',
              alias: '32658',
              barcode: '2175762871935',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Сливочная',
            },
            {
              id: '147066837',
              alias: '46150',
              barcode: '2281628751689',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаски Баварские',
            },
            {
              id: '147066838',
              alias: '25623',
              barcode: '4270623158462',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса для гриля',
            },
            {
              id: '147066839',
              alias: '69510',
              barcode: '2271193258841',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Арахис фасованный',
            },
            {
              id: '147066840',
              alias: '36258',
              barcode: '2306763298512',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Масло подсолнечное',
            },
            {
              id: '147067756',
              alias: '26526',
              barcode: '2000100029466',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Сахар',
            },
          ],
        },
        depart: {
          id: '187037527',
          name: 'depart',
          visible: true,
          description: 'Подразделение',
          data: [
            {
              id: '176459265',
              name: 'Подразделение №0',
            },
            {
              id: '176424776',
              name: 'Подразделение №1',
            },
            {
              id: '147030694',
              name: 'Подразделение №2',
            },
            {
              id: '147016473',
              name: 'Подразделение №3',
            },
            {
              id: '147030695',
              name: 'Подразделение №4',
            },
            {
              id: '147030696',
              name: 'Подразделение №5',
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
              name: 'ОАО "МаркетКомпани"',
              phoneNumber: '8-017-000-00-00, 000-00-00',
            },
            {
              id: '147016507',
              name: 'ООО "ЕдаЭксперт"',
              phoneNumber: '8-017-101-01-01',
            },
            {
              id: '147016513',
              name: 'ООО "ПродуктМаг"',
              phoneNumber: '8-017-101-01-01',
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
              company: {
                id: '147042924',
                name: 'ОАО "МаркетКомпани"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Лесная, 27',
            },
            {
              id: '1121464445',
              name: 'Магазин "МаркетКомпани" № 2',
              company: {
                id: '147042924',
                name: 'ОАО "МаркетКомпани"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Садовая, 15',
            },
            {
              id: '1367139123',
              name: 'Магазин "МаркетКомпани" № 3',
              company: {
                id: '147042924',
                name: 'ОАО "МаркетКомпани"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Центральная, 102',
            },
            {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
              company: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Набережная, 42',
            },
            {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
              company: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Луговая, 41 Б',
            },
            {
              id: '1854869537',
              name: 'Магазин "ЕдаЭксперт" № 3',
              company: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Полевая, 20/2',
            },
            {
              id: '1673741713',
              name: 'Магазин "ЕдаЭксперт" № 4',
              company: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Солнечная, 7 Б',
            },
            {
              id: '1822992103',
              name: 'Магазин "ЕдаЭксперт" № 5',
              company: {
                id: '1788296478',
                name: 'ООО "ЕдаЭксперт"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Речная, 74',
            },
            {
              id: '1475086884',
              name: 'ООО "ПродуктМаг" Магазин № 1',
              company: {
                id: '1908473665',
                name: 'ООО "ПродуктМаг"',
              },
              phoneNumber: '',
              address: 'г. Минск ул. Озерная, 18',
            },
          ],
        },
        employee: {
          id: '181073791',
          name: 'employee',
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
      },
    },
  },
  {
    id: '1f511750-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user2,
      dateTime: '2021-09-17T11:26:37.893Z',
      order: 2,
      deviceId: device.id,
    },
    status: 'READY',
    body: {
      type: 'DOCS',
      version: 1,
      payload: [
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d2',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: new Date().toISOString(),
            outlet: {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
            barcode: '100620220032467496',
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e89',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
                priceFsn: 4.82,
              },
              weight: 2,
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
              weight: 2,
              packagekey: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d3',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: new Date().toISOString(),
            outlet: {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
            barcode: '260720220032471108',
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e87',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
                priceFsn: 4.37,
              },
              weight: 2,
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
              weight: 2,
              packagekey: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d5',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
            },
            onDate: new Date().toISOString(),
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
              weight: 2,
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
              weight: 2,
              packagekey: {
                id: '1811739170',
                name: '2 кг',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
      ] as any[],
    },
  },
  {
    id: '1f5cd720-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user2,
      dateTime: '2021-09-17T11:26:37.970Z',
      order: 3,
      deviceId: device.id,
    },
    status: 'READY',
    body: {
      type: 'SETTINGS',
      version: 1,
      payload: {
        depart: {
          description: 'Склад по умолчанию',
          visible: true,
          data: {
            id: '176459265',
            name: 'Подразделение №0',
          },
        },
      },
    },
  },
];
