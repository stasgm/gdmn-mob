import { IListItem } from '@lib/mobile-types';
import { baseSettingGroup } from '@lib/store';
import { Settings, StatusType } from '@lib/types';

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

export const STATUS_LIST: IListItem[] = [
  { id: 'DRAFT', value: 'Черновик' },
  { id: 'READY', value: 'Готов' },
];

export const getStatusColor = (status: StatusType) => {
  let statusColor: (typeof statusColors)[number];

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

const goodGroup = { id: 'goodScan', name: 'Весовой товар', sortOrder: 2 };

export const appSettings: Settings = {
  scannerUse: {
    id: 'scannerUse',
    sortOrder: 3,
    description: 'Использовать сканер',
    data: true,
    type: 'boolean',
    visible: true,
    group: baseSettingGroup,
  },
  screenKeyboard: {
    id: 'screenKeyboard',
    sortOrder: 4,
    description: 'Экранная клавиатура',
    data: true,
    type: 'boolean',
    visible: true,
    group: baseSettingGroup,
  },
  quantityInput: {
    id: 'quantityInput',
    sortOrder: 5,
    description: 'Заполнять количество',
    data: false,
    type: 'boolean',
    visible: true,
    group: baseSettingGroup,
  },
  weightCode: {
    id: 'weightCode',
    sortOrder: 6,
    description: 'Идентификатор весового товара',
    data: '22',
    type: 'string',
    visible: true,
    group: goodGroup,
  },
  countCode: {
    id: 'countCode',
    sortOrder: 7,
    description: 'Кол-во символов кода товара',
    data: 5,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
  countWeight: {
    id: 'countWeight',
    sortOrder: 8,
    description: 'Кол-во символов веса (в гр.)',
    data: 5,
    type: 'number',
    visible: true,
    group: goodGroup,
  },
};

export const unknownGood: IGood = {
  id: 'unknown',
  alias: 'unknown',
  name: 'Неизвестный товар',
  goodGroup: { id: 'unknown', name: 'Неизвестная группа' },
};
