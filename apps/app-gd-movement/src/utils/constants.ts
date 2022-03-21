import { IListItem } from '@lib/mobile-types';
import { Status } from '@lib/mobile-ui';
import { Settings, StatusType } from '@lib/types';

import { IGood } from '../store/app/types';

import { IMovementDocument } from '../store/types';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

export const ONE_SECOND_IN_MS = 1000;

export const contactTypes: IListItem[] = [
  { id: 'department', value: 'Подразделение' },
  { id: 'contact', value: 'Организация' },
  { id: 'employee', value: 'Сотрудник' },
];

interface StatusTypes {
  name: string;
  status: Status;
}
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
    id: 'archive',
    value: 'Архив',
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
