import { IListItem } from '@lib/mobile-types';
import { baseSettingGroup } from '@lib/store/src/settings/reducer';
import { Settings, StatusType } from '@lib/types';

import { IGood } from '../store/app/types';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

export const ONE_SECOND_IN_MS = 1000;

export const contactTypes: IListItem[] = [
  { id: 'department', value: 'Подразделение' },
  { id: 'contact', value: 'Организация' },
  { id: 'employee', value: 'Сотрудник' },
];

export const docDepartTypes: IListItem[] = [{ id: 'all', value: 'Все' }];

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

export const dateTypes: IListItem[] = [
  {
    id: 'new',
    value: 'Сначала новые',
  },
  {
    id: 'old',
    value: 'Сначала старые',
  },
];

export const STATUS_LIST: IListItem[] = [
  { id: 'DRAFT', value: 'Черновик' },
  { id: 'READY', value: 'Готов' },
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

const goodGroup = { id: '2', name: 'Код товара', sortOrder: 2, description: 'Количество символов' };
const orderGroup = { id: '3', name: 'Код заявки', sortOrder: 3, description: 'Количество символов' };

export const appSettings: Settings = {
  scannerUse: {
    id: '4',
    sortOrder: 3,
    description: 'Использовать сканер',
    data: true,
    type: 'boolean',
    visible: true,
    group: baseSettingGroup,
  },
  countBarcodeLentgh: {
    id: '6',
    sortOrder: 6,
    description: 'Мин. длина штрих-кода',
    data: 28,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countWeight: {
    id: '7',
    sortOrder: 7,
    description: 'Вес товара, гр',
    data: 6,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countDay: {
    id: '8',
    sortOrder: 8,
    description: 'Дата (число)',
    data: 2,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countMonth: {
    id: '9',
    sortOrder: 9,
    description: 'Дата (месяц)',
    data: 2,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countYear: {
    id: '10',
    sortOrder: 10,
    description: 'Дата (год)',
    data: 2,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countCode: {
    id: '11',
    sortOrder: 11,
    description: 'Код товара',
    data: 4,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countQuantPack: {
    id: '12',
    sortOrder: 12,
    description: 'Номер взвешивания',
    data: 3,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countType: {
    id: '13',
    sortOrder: 13,
    description: 'Тип взвешивания',
    data: 1,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countNumReceived: {
    id: '14',
    sortOrder: 14,
    description: 'Номер партии',
    data: 6,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countOrderBarcodeLentgh: {
    id: '15',
    sortOrder: 15,
    description: 'Мин. длина штрих-кода',
    data: 15,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
  countCodeDepart: {
    id: '16',
    sortOrder: 16,
    description: 'Код подразделения',
    data: 3,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
  countOrderDay: {
    id: '17',
    sortOrder: 17,
    description: 'Дата (число)',
    data: 2,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
  countOrderMonth: {
    id: '18',
    sortOrder: 18,
    description: 'Дата (месяц)',
    data: 2,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
  countOrderYear: {
    id: '19',
    sortOrder: 19,
    description: 'Дата (год)',
    data: 4,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
  countID: {
    id: '20',
    sortOrder: 20,
    description: 'Идентификатор заявки',
    data: 11,
    type: 'number',
    visible: true,
    group: orderGroup,
  },
};

export const unknownGood: IGood = {
  id: 'unknown',
  name: 'Неизвестный товар',
  shcode: '',
};

export const tempType = {
  id: '187891695',
  name: 'temp',
  description: 'Отвес',
};

export const lineTypes: IListItem[] = [
  {
    id: 'order',
    value: 'заявлено',
  },
  {
    id: 'shipment',
    value: 'отвешено',
  },
];
