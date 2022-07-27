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
    sortOrder: 3,
    description: 'Использовать сканер',
    data: true,
    type: 'boolean',
    visible: true,
    group: baseSettingGroup,
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
