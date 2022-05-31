import { baseSettingGroup } from '@lib/store';
import { Settings, StatusType } from '@lib/types';

import config from '../config';

const ONE_SECOND_IN_MS = 1000;

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

const getStatusColor = (status: StatusType) => {
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

const backGroup = { id: '3', name: 'Настройки бэк-офиса', sortOrder: 3 };

const unknownGroup = { id: 'unknown', name: 'Другое' };

const appSettings: Settings = {
  isUseNetPrice: {
    id: '5',
    description: 'Использовать матрицы',
    data: true,
    type: 'boolean',
    sortOrder: 3,
    visible: true,
    group: baseSettingGroup,
  },
  serverName: {
    id: '6',
    sortOrder: 5,
    description: 'Адрес сервера',
    data: config.BACK_URL,
    type: 'string',
    visible: true,
    group: backGroup,
  },
  serverPort: {
    id: '7',
    description: 'Порт',
    data: config.BACK_PORT,
    type: 'number',
    sortOrder: 6,
    visible: true,
    group: backGroup,
  },
  returnDocTime: {
    id: '8',
    description: 'Время поиска накладных возврата, дн',
    data: 30,
    type: 'number',
    sortOrder: 7,
    visible: true,
    group: backGroup,
  },
};

export { getStatusColor, appSettings, ONE_SECOND_IN_MS, unknownGroup };
