import { Settings, StatusType } from '@lib/types';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

export const ONE_SECOND_IN_MS = 1000;

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

export const scanSettingGroup = { id: 'scan', name: 'Настройки весового товара', sortOrder: 2 };

export const appSettings: Settings = {
  scannerUse: {
    id: 'scannerUse',
    sortOrder: 4,
    description: 'Использовать сканер',
    data: true,
    type: 'boolean',
    visible: true,
    group: scanSettingGroup,
  },
  weightCode: {
    id: 'weightCode',
    sortOrder: 5,
    description: 'Идентификатор весового товара',
    data: '22',
    type: 'string',
    visible: true,
    group: scanSettingGroup,
  },
  countCode: {
    id: 'countCode',
    sortOrder: 6,
    description: 'Количество символов для кода товара',
    data: 5,
    type: 'number',
    visible: true,
    group: scanSettingGroup,
  },
  countWeight: {
    id: 'countWeight',
    sortOrder: 7,
    description: 'Количество символов для веса (в гр.)',
    data: 5,
    type: 'number',
    visible: true,
    group: scanSettingGroup,
  },
};
