import { baseGroup } from '@lib/store/src/settings';
import { Settings, StatusType } from '@lib/types';

import config from '../config';

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

// const navItems: INavItem[] = [
//   /*   {
//     name: 'Dashboard',
//     title: 'Дашборд',
//     icon: 'view-dashboard-outline',
//     component: DashboardNavigator,
//   }, */
//   {
//     name: 'Routes',
//     title: 'Маршруты',
//     icon: 'routes',
//     component: RoutesNavigator,
//   },
//   {
//     name: 'Orders',
//     title: 'Заявки',
//     icon: 'clipboard-list-outline',
//     component: OrdersNavigator,
//   },
//   {
//     name: 'Returns',
//     title: 'Возвраты',
//     icon: 'file-restore',
//     component: ReturnsNavigator,
//   },
//   {
//     name: 'Map',
//     title: 'Карта',
//     icon: 'map-outline',
//     component: MapNavigator,
//   },
// ];

const backGroup = { id: '3', name: 'Настройки бэк-офиса', sortOrder: 3 };

const appSettings: Settings = {
  isUseNetPrice: {
    id: '5',
    description: 'Использовать матрицы',
    data: true,
    type: 'boolean',
    sortOrder: 10,
    visible: true,
    group: baseGroup,
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

export { getStatusColor, appSettings };
