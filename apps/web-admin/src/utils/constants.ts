import { IFileFilter, IFilterObject } from '../types';

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

const fileFilterValues: IFilterObject = {
  companyId: { id: 'companyId', name: 'Компания', type: 'select', value: '', visible: true },
  appSystemId: { id: 'appSystemId', name: 'Подсистема', type: 'select', value: '', visible: true },
  folder: { id: 'folder', name: 'Папка', type: 'select', value: '', visible: true },
  // path: '',
  fileName: { id: 'fileNameId', name: 'Имя файла', type: 'text', value: '', visible: true },
  producerId: { id: 'producerId', name: 'Пользователь', type: 'select', value: '', visible: true },
  consumerId: { id: 'consumerId', name: 'Получатель', type: 'select', value: '', visible: true },
  deviceId: { id: 'deviceId', name: 'Устройство', type: 'select', value: '', visible: true },
  uid: { id: 'uid', name: 'Номер устройства', type: 'text', value: '', visible: true },
  dateFrom: { id: 'dateFrom', name: 'Дата начала', type: 'date', value: '', visible: true },
  dateTo: { id: 'dateTo', name: 'Дата окончания', type: 'date', value: '', visible: true },
  searchQuery: { id: 'searchQuery', name: 'Текст', type: 'text', value: '', visible: true, multi: true },
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
  dateFrom: '',
  dateTo: '',
  searchQuery: '',
};

export { deviceStates, adminPath, validPassword, fileFilterValues, fileFilterInitialValues };
