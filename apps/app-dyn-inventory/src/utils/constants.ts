import { DocTypeMeta, IDocumentType, IDynDocumentType, IHead, Settings, StatusType } from '@lib/types';

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

export const docMetaData: any[] = [
  {
    Inventory: {
      number: {
        id: '1',
        type: 'string',
        sortOrder: 1,
        description: 'Номер документа',
        clearInput: true,
        required: true,
        // onChangeText: 'onChangeText',
      },
      documentDate: {
        id: '2',
        type: 'date',
        sortOrder: 1,
        description: 'Дата',
        required: true,
      },
      department: {
        id: '3',
        type: 'ref',
        sortOrder: 1,
        description: 'Подразделение',
        refName: 'department',
        required: true,
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
    AddWBill: {
      number: {
        id: '1',
        type: 'string',
        sortOrder: 1,
        description: 'Номер документа',
        clearInput: true,
        required: true,
        // onChangeText: 'onChangeText',
      },
      documentDate: {
        id: '2',
        type: 'date',
        sortOrder: 1,
        description: 'Дата',
        required: true,
      },
      department: {
        id: '3',
        type: 'ref',
        sortOrder: 1,
        description: 'Подразделение',
        refName: 'department',
        required: true,
      },
      contragent: {
        id: '4',
        type: 'ref',
        sortOrder: 1,
        description: 'Контрагент',
        refName: 'contact',
        required: true,
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

export const defaultHeadFields: DocTypeMeta<IHead> = {
  number: {
    type: 'string',
    sortOrder: 1,
    description: 'Номер документа',
    clearInput: true,
    required: true,
  },
  documentDate: {
    type: 'date',
    sortOrder: 2,
    description: 'Дата',
    required: true,
  },
  documentType: {
    type: 'ref',
    sortOrder: 3,
    description: 'Тип документа',
    required: true,
    visible: false,
  },
  status: {
    type: 'string',
    sortOrder: 0,
    description: 'Черновик',
    required: true,
    visible: false,
  },
};

export const documentTypes: IDynDocumentType[] = [
  {
    id: '1',
    name: 'inventory',
    description: 'Инвентаризации',
    icon: 'file-document-outline',
    metadata: {
      head: {
        // status: {
        //   type: 'string',
        //   sortOrder: 1,
        //   description: 'Статус',
        //   required: true,
        // },
        // number: {
        //   type: 'string',
        //   sortOrder: 1,
        //   description: 'Номер документа',
        //   clearInput: true,
        //   required: true,
        //   // onChangeText: 'onChangeText',
        // },
        // documentDate: {
        //   type: 'date',
        //   sortOrder: 1,
        //   description: 'Дата',
        //   required: true,
        // },
        department: {
          type: 'ref',
          sortOrder: 10,
          description: 'Подразделение',
          refName: 'department',
          required: true,
        },
        comment: {
          // name: 'comment',
          type: 'string',
          sortOrder: 11,
          description: 'Комментарий',
          clearInput: true,
          // onChangeText: 'onChangeText',
        },
      },
      // lines: {
      //   metadata: {
      //     good: {
      //       sortOrder: 0,
      //       name: 'Наименование',
      //     },
      //     price: {
      //       sortOrder: 0,
      //       name: 'Цена',
      //     },
      //     remains: {
      //       sortOrder: 0,
      //       name: 'Остаток',
      //     },
      //     EID: {
      //       sortOrder: 0,
      //       name: 'EID',
      //     },
      //     quantity: {
      //       sortOrder: 0,
      //       name: 'Количество',
      //     },
      //   },
      // },
      // component: InventoryNavigator,
    },
  },
  {
    id: '2',
    name: 'prihod',
    description: 'Приход',
    icon: 'file-document-outline',
    metadata: {
      head: {
        // number: {
        //   type: 'string',
        //   sortOrder: 1,
        //   description: 'Номер документа',
        //   clearInput: true,
        //   required: true,
        //   // onChangeText: 'onChangeText',
        // },
        // documentDate: {
        //   type: 'date',
        //   sortOrder: 1,
        //   description: 'Дата',
        //   required: true,
        // },
        department: {
          type: 'ref',
          sortOrder: 10,
          description: 'Подразделение',
          refName: 'department',
          required: true,
        },
        contragent: {
          type: 'ref',
          sortOrder: 11,
          description: 'Контрагент',
          refName: 'contact',
          required: true,
        },
        comment: {
          // name: 'comment',
          type: 'string',
          sortOrder: 12,
          description: 'Комментарий',
          clearInput: true,
          // onChangeText: 'onChangeText',
        },
        onDate: {
          type: 'date',
          sortOrder: 13,
          description: 'На дату',
          // required: true,
        },
        isCheck: {
          type: 'boolean',
          // sortOrder: 5,
          description: 'Тест',
          // required: true,
        },
      },
      // component: InventoryNavigator,
    },
  },
];
