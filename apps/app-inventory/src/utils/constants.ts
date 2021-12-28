/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import { INavItem } from '@lib/mobile-navigation';
import { StatusType } from '@lib/types';
import { InventoryNavigator } from '../navigation/InventoryNavigator';

const statusColors = ['#E91E63', '#06567D', '#80B12C', '#FFA700'] as const;

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

export const metaData: any[] = [
  {
    Inventorys: {
      number: {
        id: '1',
        type: 'string',
        sortOrder: 1,
        description: 'Номер документа',
        clearInput: true,
        requeried: true,
        // onChangeText: 'onChangeText',
      },
      documentDate: {
        id: '2',
        type: 'date',
        sortOrder: 1,
        description: 'Дата',
        requeried: true,
      },
      department: {
        id: '3',
        type: 'ref',
        sortOrder: 1,
        description: 'Подразделение',
        refName: 'department',
        requeried: true,
      },
      comment: {
        id: '4',
        // name: 'comment',
        type: 'string',
        sortOrder: 2,
        description: 'Комментарий',
        clearInput: true,
        // onChangeText: 'onChangeText',
      },
    },
  },
  {
    Prihod: {
      number: {
        id: '1',
        type: 'string',
        sortOrder: 1,
        description: 'Номер документа',
        clearInput: true,
        requeried: true,
        // onChangeText: 'onChangeText',
      },
      documentDate: {
        id: '2',
        type: 'date',
        sortOrder: 1,
        description: 'Дата',
        requeried: true,
      },
      department: {
        id: '3',
        type: 'ref',
        sortOrder: 1,
        description: 'Подразделение',
        refName: 'department',
        requeried: true,
      },
      contragent: {
        id: '4',
        type: 'ref',
        sortOrder: 1,
        description: 'Контрагент',
        refName: 'contragent',
        requeried: true,
      },
      comment: {
        id: '5',
        // name: 'comment',
        type: 'string',
        sortOrder: 2,
        description: 'Комментарий',
        clearInput: true,
        // onChangeText: 'onChangeText',
      },
    },
  },
];

export const inv: any = [
  {
    name: 'Inventorys',
    title: 'Инвентаризации',
    icon: 'file-document-outline',
    head: {
      Inventorys: {
        number: {
          id: '1',
          type: 'string',
          sortOrder: 1,
          description: 'Номер документа',
          clearInput: true,
          requeried: true,
          // onChangeText: 'onChangeText',
        },
        documentDate: {
          id: '2',
          type: 'date',
          sortOrder: 1,
          description: 'Дата',
          requeried: true,
        },
        department: {
          id: '3',
          type: 'ref',
          sortOrder: 1,
          description: 'Подразделение',
          refName: 'department',
          requeried: true,
        },
        comment: {
          id: '4',
          // name: 'comment',
          type: 'string',
          sortOrder: 2,
          description: 'Комментарий',
          clearInput: true,
          // onChangeText: 'onChangeText',
        },
      },
    },
    // lines:
    component: InventoryNavigator,
  },
  {
    name: 'Prihod',
    title: 'Приход',
    icon: 'file-document-outline',
    head: {
      Prihod: {
        number: {
          id: '1',
          type: 'string',
          sortOrder: 1,
          description: 'Номер документа',
          clearInput: true,
          requeried: true,
          // onChangeText: 'onChangeText',
        },
        documentDate: {
          id: '2',
          type: 'date',
          sortOrder: 1,
          description: 'Дата',
          requeried: true,
        },
        department: {
          id: '3',
          type: 'ref',
          sortOrder: 1,
          description: 'Подразделение',
          refName: 'department',
          requeried: true,
        },
        contragent: {
          id: '4',
          type: 'ref',
          sortOrder: 1,
          description: 'Контрагент',
          refName: 'contragent',
          requeried: true,
        },
        comment: {
          id: '5',
          // name: 'comment',
          type: 'string',
          sortOrder: 2,
          description: 'Комментарий',
          clearInput: true,
          // onChangeText: 'onChangeText',
        },
      },
    },
    component: InventoryNavigator,
  },
];
