import { IFileFilter, IFileFilterObject, ILogFileFilter, ILogFilterObject } from '../types';

const deviceStates = {
  'NON-REGISTERED': 'Не зарегистрировано',
  'NON-ACTIVATED': 'Не активно',
  ACTIVE: 'Активно',
  BLOCKED: 'Заблокировано',
};

const adminPath = '/admin';

const validPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/);

// const fileFiltersDescription = {
//   path: 'Путь',
//   folder: 'Папка',
//   fileName: 'Имя файла',
//   company: 'Компания',
//   appSystem: 'Подсистема',
//   producer: 'Пользователь',
//   consumer: 'Получатель',
//   device: 'Устройство',
//   uid: 'Идентификатор',
//   date: 'Дата',
// };

const fileFilterValues: IFileFilterObject = {
  companyId: { id: 'companyId', name: 'Компания', type: 'select', value: '', visible: true, data: [] },
  appSystemId: { id: 'appSystemId', name: 'Подсистема', type: 'select', value: '', visible: true, data: [] },
  folder: { id: 'folder', name: 'Папка', type: 'select', value: '', visible: true, data: [] },
  // path: '',
  fileName: { id: 'fileNameId', name: 'Имя файла', type: 'text', value: '', visible: true },
  producerId: { id: 'producerId', name: 'Пользователь', type: 'select', value: '', visible: true, data: [] },
  consumerId: { id: 'consumerId', name: 'Получатель', type: 'select', value: '', visible: true, data: [] },
  deviceId: { id: 'deviceId', name: 'Устройство', type: 'select', value: '', visible: true, data: [] },
  uid: { id: 'uid', name: 'Номер устройства', type: 'text', value: '', visible: true },
  // date: { id: 'date', name: 'Дата', type: 'date', value: '', visible: true },
  dateFrom: { id: 'dateFrom', name: 'Дата начала', type: 'date', value: '', visible: true },
  dateTo: { id: 'dateTo', name: 'Дата окончания', type: 'date', value: '', visible: true },
};

const logFilterValues: ILogFilterObject = {
  companyId: { id: 'companyId', name: 'Компания', type: 'select', value: '', visible: true, data: [] },
  appSystemId: { id: 'appSystemId', name: 'Подсистема', type: 'select', value: '', visible: true, data: [] },
  // path: '',
  producerId: { id: 'producerId', name: 'Пользователь', type: 'select', value: '', visible: true, data: [] },
  deviceId: { id: 'deviceId', name: 'Устройство', type: 'select', value: '', visible: true, data: [] },
  uid: { id: 'uid', name: 'Номер устройства', type: 'text', value: '', visible: true },
  // date: { id: 'date', name: 'Дата', type: 'date', value: '', visible: true },
  dateFrom: { id: 'dateFrom', name: 'Дата начала создания', type: 'date', value: '', visible: true },
  dateTo: { id: 'dateTo', name: 'Дата окончания создания', type: 'date', value: '', visible: true },
  mDateFrom: { id: 'mDateFrom', name: 'Дата начала редактирования', type: 'date', value: '', visible: true },
  mDateTo: { id: 'mDateTo', name: 'Дата окончания редактирования', type: 'date', value: '', visible: true },
};

const fileFilterInitialValues: IFileFilter = {
  folder: '',
  // path: '',
  // id: '',
  fileName: '',
  companyId: '',
  appSystemId: '',
  producerId: '',
  consumerId: '',
  deviceId: '',
  uid: '',
  // date: '',
  dateFrom: '',
  dateTo: '',
  path: '',
};

const logFilterInitialValues: ILogFileFilter = {
  companyId: '',
  appSystemId: '',
  producerId: '',
  deviceId: '',
  uid: '',
  // date: '',
  dateFrom: '',
  dateTo: '',
  mDateFrom: '',
  mDateTo: '',
};

export {
  deviceStates,
  adminPath,
  validPassword,
  fileFilterValues,
  logFilterValues,
  fileFilterInitialValues,
  logFilterInitialValues,
};
