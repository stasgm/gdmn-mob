import { baseSettingGroup } from '@lib/store';
import { Settings, StatusType } from '@lib/types';

import config from '../config';
import { ISellBill } from '../store/types';

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

const unknownGroup = { id: 'unknown', name: 'Другое' };

const appSettings: Settings = {
  isUseNetPrice: {
    id: '5',
    description: 'Использовать матрицы',
    data: true,
    type: 'boolean',
    sortOrder: 10,
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

const mockSellBills: ISellBill[] = [
  {
    ID: '1246759230',
    NUMBER: '1448516',
    CONTRACT: '53 от 2013-12-10',
    CONTRACTKEY: '165934057',
    DEPARTNAME: 'Магазин-склад',
    DEPARTKEY: '323658854',
    DOCUMENTDATE: new Date().toISOString(),
    QUANTITY: 4.9511,
    PRICE: 5.35,
  },
  {
    ID: '1215293118',
    NUMBER: '5376518',
    CONTRACT: '53 от 2013-12-10',
    CONTRACTKEY: '165934057',
    DEPARTKEY: '323658854',
    DEPARTNAME: 'Магазин-склад',
    DOCUMENTDATE: new Date().toISOString(),
    QUANTITY: 5.25,
    PRICE: 6.12,
  },
  {
    ID: '1308039951',
    NUMBER: '1453027',
    CONTRACT: '53 от 2013-12-10',
    CONTRACTKEY: '165934057',
    DEPARTNAME: 'Магазин-склад',
    DEPARTKEY: '323658854',
    DOCUMENTDATE: new Date().toISOString(),
    QUANTITY: 6.4,
    PRICE: 6.12,
  },
  {
    ID: '1334757495',
    NUMBER: '5947875',
    CONTRACT: '53 от 2013-12-10',
    CONTRACTKEY: '165934057',
    DEPARTNAME: 'Магазин-склад',
    DEPARTKEY: '323658854',
    DOCUMENTDATE: new Date().toISOString(),
    QUANTITY: 5.6,
    PRICE: 6.12,
  },
] as any;

export { getStatusColor, appSettings, mockSellBills, unknownGroup };
