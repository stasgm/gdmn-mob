import { IListItem } from '@lib/mobile-types';
import { companies, user2 } from '@lib/mock';
import { IMessage, INamedEntity, MessageType, Settings, StatusType } from '@lib/types';

import { IGood } from '../store/app/types';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

export const ONE_SECOND_IN_MS = 1000;

export const contactTypes: IListItem[] = [
  { id: 'department', value: 'Подразделение' },
  { id: 'contact', value: 'Организация' },
  { id: 'employee', value: 'Сотрудник' },
];

export const docContactTypes: IListItem[] = [{ id: 'all', value: 'Все' }];

export const statusTypes: IListItem[] = [
  {
    id: 'all',
    value: 'Все',
  },
  {
    id: 'active',
    value: 'Активные',
  },
  {
    id: 'DRAFT',
    value: 'Черновик',
  },
  {
    id: 'READY',
    value: 'Готово',
  },
  {
    id: 'SENT',
    value: 'Отправлено',
  },
  {
    id: 'PROCESSED',
    value: 'Обработано',
  },
];

export const dataTypes: IListItem[] = [
  {
    id: 'new',
    value: 'Сначала новые',
  },
  {
    id: 'old',
    value: 'Сначала старые',
  },
];

export const getStatusColor = (status: StatusType) => {
  let statusColor: typeof statusColors[number];

  switch (status) {
    case 'DRAFT':
      statusColor = statusColors[0];
      break;

    case 'PROCESSED':
      statusColor = statusColors[1];
      break;

    case 'READY':
      statusColor = statusColors[2];
      break;

    case 'SENT':
      statusColor = statusColors[3];
      break;

    default:
      statusColor = statusColors[0];
      break;
  }

  return statusColor;
};

export const appSettings: Settings = {
  scannerUse: {
    id: '4',
    sortOrder: 4,
    description: 'Использовать сканер',
    data: true,
    type: 'boolean',
    visible: true,
    group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
  },
  weightCode: {
    id: '5',
    sortOrder: 5,
    description: 'Идентификатор весового товара',
    data: '22',
    type: 'string',
    visible: true,
    group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
  },
  countCode: {
    id: '6',
    sortOrder: 6,
    description: 'Количество символов для кода товара',
    data: 5,
    type: 'number',
    visible: true,
    group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
  },
  countWeight: {
    id: '7',
    sortOrder: 7,
    description: 'Количество символов для веса (в гр.)',
    data: 5,
    type: 'number',
    visible: true,
    group: { id: '2', name: 'Настройки весового товара', sortOrder: 2 },
  },
};

export const unknownGood: IGood = {
  id: 'unknown',
  alias: 'unknown',
  name: 'Неизвестный товар',
  goodGroup: { id: 'unknown', name: 'Неизвестная группа' },
};

export const messageGdMovement: IMessage<MessageType>[] = [
  {
    id: '147293377',
    status: 'READY',
    head: {
      appSystem: 'gdmn-gd-movement',
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user2,
      dateTime: new Date().toISOString(),
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
              id: '147037014',
              name: 'prihod',
              description: 'Приход',
              isRemains: false,
              remainsField: 'toContact',
              fromDescription: 'Откуда',
              fromType: 'contact',
              fromRequired: true,
              toDescription: 'Куда',
              toType: 'department',
              toRequired: true,
            },
            {
              id: '187034606',
              name: 'inventory',
              description: 'Инвентаризация',
              isRemains: true,
              remainsField: 'toContact',
              fromDescription: '',
              fromType: '',
              fromRequired: false,
              toDescription: 'Место',
              toType: 'department',
              toRequired: true,
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
            alias: {
              sortOrder: 0,
              name: 'Алиас',
            },
            barcode: {
              sortOrder: 0,
              name: 'Штрих-код',
            },
            valueName: {
              sortOrder: 0,
              name: 'Ед изм',
            },
            inFrac: {
              sortOrder: 0,
              name: 'Вес единицы',
            },
            weightCode: {
              sortOrder: 0,
              name: 'Весовой товар',
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
              alias: '',
              barcode: '9789854480947',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '111159486',
              name: 'Тетрадь',
              alias: '',
              barcode: '3329687853219',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '111852486',
              name: 'Ручка шариковая',
              alias: '',
              barcode: '3329687853210',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '147067755',
              alias: '',
              barcode: '2000100029466',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Степлер',
            },
            {
              id: '147067788',
              alias: '',
              barcode: '2000100029906',
              valuename: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Дырокол',
            },
            {
              id: '147067789',
              alias: '',
              barcode: '2000100029467',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Бейдж',
            },
            {
              id: '147067790',
              alias: '',
              barcode: '2000100029468',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Штамп',
            },
            {
              id: '147067791',
              alias: '',
              barcode: '2000100029469',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Блокнот А5',
            },
            {
              id: '147067792',
              alias: '',
              barcode: '2000100029470',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Календарь',
            },
            {
              id: '147067793',
              alias: '',
              barcode: '2000100029471',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Подставка настольная',
            },
            {
              id: '147067794',
              alias: '',
              barcode: '2000100029472',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Корректирующая ручка',
            },
            {
              id: '147067795',
              alias: '',
              barcode: '2000100029473',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Текстовыделитель',
            },
            {
              id: '153359485',
              alias: '',
              barcode: '3549109954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Изделие колбасное',
            },
            {
              id: '153367898',
              alias: '',
              barcode: '9913000005221',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Рулет Европейский',
            },
            {
              id: '157381934',
              alias: '',
              barcode: '9913000005047',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Смесь сухая',
            },
            {
              id: '172067346',
              alias: '',
              barcode: '4811219038625',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Докторская',
            },
            {
              id: '185970902',
              alias: '',
              barcode: '3540029954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Дрожжи',
            },
            {
              id: '147066836',
              alias: '',
              barcode: '2175762871935',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Сливочная',
            },
            {
              id: '147066837',
              alias: '',
              barcode: '2281628751689',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаски Баварские',
            },
            {
              id: '147066838',
              alias: '',
              barcode: '4270623158462',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса для гриля',
            },
            {
              id: '147066839',
              alias: '',
              barcode: '2271193258841',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Арахис фасованный',
            },
            {
              id: '147066840',
              alias: '',
              barcode: '2306763298512',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Масло подсолнечное',
            },
            {
              id: '147067756',
              alias: '',
              barcode: '2000100029466',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Сахар',
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
        remains: {
          id: '187037529',
          name: 'remains',
          visible: false,
          description: 'Остатки ТМЦ',
          data: [
            {
              '176424776': [
                {
                  goodId: '111159486',
                  price: 13.13,
                  buyingPrice: 13,
                  q: 13.666,
                },
                {
                  goodId: '157381934',
                  price: 1.77,
                  buyingPrice: 1.28,
                  q: 11,
                },
                {
                  goodId: '111852486',
                  price: 13.5,
                  buyingPrice: 12.28,
                  q: 2,
                },
              ],
              '147030694': [
                {
                  goodId: '147067755',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '147067788',
                  price: 11.11,
                  buyingPrice: 12.28,
                  q: 10.988,
                },
                {
                  goodId: '111159486',
                  price: 13.13,
                  buyingPrice: 13,
                  q: 13.666,
                },
                {
                  goodId: '147067790',
                  price: 9.82,
                  buyingPrice: 9.28,
                  q: 2,
                },
                {
                  goodId: '147067791',
                  price: 1.77,
                  buyingPrice: 1.28,
                  q: 11,
                },
                {
                  goodId: '147067792',
                  price: 13.5,
                  buyingPrice: 12.28,
                  q: 2,
                },
              ],
              '147016473': [
                {
                  goodId: '153367898',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '153359485',
                  price: 19.01,
                  buyingPrice: 19.28,
                  q: 4.5,
                },
                {
                  goodId: '172067346',
                  price: 11.31,
                  buyingPrice: 12.58,
                  q: 5.75,
                },
                {
                  goodId: '147066838',
                  price: 14.65,
                  buyingPrice: 14.83,
                  q: 7.8,
                },
              ],
              '147030695': [
                {
                  goodId: '147066840',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '153359486',
                  price: 18.75,
                  buyingPrice: 18.28,
                  q: 7.8,
                },
                {
                  goodId: '172067346',
                  price: 9.9,
                  buyingPrice: 9.28,
                  q: 9.2,
                },
                {
                  goodId: '147067756',
                  price: 10.57,
                  buyingPrice: 10.28,
                  q: 7.652,
                },
              ],
              '147030696': [
                {
                  goodId: '153367898',
                  price: 19.01,
                  buyingPrice: 19.28,
                  q: 2.567,
                },
                {
                  goodId: '147066836',
                  price: 16.01,
                  buyingPrice: 16.28,
                  q: 5.4,
                },
                {
                  goodId: '147066838',
                  price: 17.01,
                  buyingPrice: 18.28,
                  q: 8.74,
                },
                {
                  goodId: '157381934',
                  price: 18.01,
                  buyingPrice: 19.28,
                  q: 9.2,
                },
              ],
              '147016471': [
                {
                  goodId: '147067793',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '147067794',
                  price: 14,
                  buyingPrice: 13.65,
                  q: 3,
                },
                {
                  goodId: '147067795',
                  price: 2.01,
                  buyingPrice: 2.28,
                  q: 4.55,
                },
              ],
              '147016507': [
                {
                  goodId: '147066836',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 6,
                },
                {
                  goodId: '147066837',
                  price: 13.5,
                  buyingPrice: 14.28,
                  q: 5.5,
                },
                {
                  goodId: '147066838',
                  price: 17.45,
                  buyingPrice: 17.8,
                  q: 3.7,
                },
                {
                  goodId: '172067346',
                  price: 9.01,
                  buyingPrice: 9.28,
                  q: 4.5,
                },
                {
                  goodId: '153359485',
                  price: 12.21,
                  buyingPrice: 12.28,
                  q: 12.56,
                },
              ],
              '147016513': [
                {
                  goodId: '147066839',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '185970902',
                  price: 11.6,
                  buyingPrice: 12.68,
                  q: 13.5,
                },
                {
                  goodId: '157381934',
                  price: 15.43,
                  buyingPrice: 15.68,
                  q: 5,
                },
              ],
              '147093200': [
                {
                  goodId: '147067795',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '147067792',
                  price: 11.01,
                  buyingPrice: 12.28,
                  q: 12.567,
                },
                {
                  goodId: '147067789',
                  price: 12.85,
                  buyingPrice: 12.65,
                  q: 5.45,
                },
                {
                  goodId: '111159486',
                  price: 6.95,
                  buyingPrice: 6.5,
                  q: 3,
                },
              ],
              '147093201': [
                {
                  goodId: '172067346',
                  price: 11.01,
                  buyingPrice: 12.1,
                  q: 2.567,
                },
                {
                  goodId: '147067756',
                  price: 21.01,
                  buyingPrice: 22.26,
                  q: 7.5,
                },
                {
                  goodId: '185970902',
                  price: 15.06,
                  buyingPrice: 15.25,
                  q: 5,
                },
                {
                  goodId: '153367898',
                  price: 5.03,
                  buyingPrice: 5.28,
                  q: 6.54,
                },
                {
                  goodId: '147066840',
                  price: 10.52,
                  buyingPrice: 10.08,
                  q: 4.33,
                },
              ],
              '147257062': [
                {
                  goodId: '111852486',
                  price: 11.01,
                  buyingPrice: 12.28,
                  q: 2.567,
                },
                {
                  goodId: '153359486',
                  price: 25.01,
                  buyingPrice: 24.28,
                  q: 2.567,
                },
                {
                  goodId: '147067755',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 5.56,
                },
                {
                  goodId: '147067788',
                  price: 35.48,
                  buyingPrice: 35.48,
                  q: 4,
                },
                {
                  goodId: '147067793',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
              ],
              '147527919': [
                {
                  goodId: '147066838',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '153359486',
                  price: 16.01,
                  buyingPrice: 16.28,
                  q: 7.91,
                },
                {
                  goodId: '147066840',
                  price: 14.74,
                  buyingPrice: 13.56,
                  q: 7.82,
                },
                {
                  goodId: '185970902',
                  price: 25.01,
                  buyingPrice: 24.28,
                  q: 10.56,
                },
              ],
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
];
