import { IReference, INamedEntity, IReferences } from '@lib/types';

import { IEmployee } from '../types';

import { emplMetadata, employees } from './employees';
import { applStatuses } from './statuses';

// DocumentTypes
const applDocType = [
  {
    id: '168063006',
    name: 'Заявки на закупку ТМЦ',
  },
];

// appl statuses reference
export const refApplDocTypes: IReference<INamedEntity> = {
  id: '148000001',
  name: 'false',
  visible: false,
  description: 'Типы документов',
  data: applDocType,
};

// appl statuses reference
export const refApplStatuses: IReference<INamedEntity> = {
  id: '148000002',
  name: 'Statuses',
  visible: false,
  description: 'Статусы заявок',
  data: applStatuses,
};

// appl emplyees reference
export const refEmplyees: IReference<IEmployee> = {
  id: '148000003',
  name: 'Employees',
  description: 'Сотрудники',
  metadata: emplMetadata,
  data: employees,
};

export const applRefs: IReferences = {
  [refApplStatuses.name]: refApplStatuses,
  [refEmplyees.name]: refEmplyees,
  [refApplDocTypes.name]: refApplDocTypes,
};
