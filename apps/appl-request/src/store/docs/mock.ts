import { IReference, IUser, INamedEntity, ICompany } from '@lib/types';
import { superAdmin } from '@lib/mock';

import { IApplDocument } from './types';

// DocumentTypes
const applType = { id: '147010699', name: 'appl' };

const documentTypes = [applType];

// appl statuses
const applStatuses: INamedEntity[] = [
  {
    id: '147000001',
    name: 'К рассмотрению',
  },
  {
    id: '147000002',
    name: 'Принято к исполнению',
  },
  {
    id: '147000003',
    name: 'Отказано',
  },
];

// appl statuses reference
const refApplStatuses: IReference<INamedEntity> = {
  id: '148000001',
  name: 'Статусы',
  description: 'Статусы заявок',
  data: applStatuses,
};

// company
const company: ICompany = { admin: superAdmin, id: '147100001', name: 'Белкалий - Агро' };

//users
const users: IUser[] = [
  {
    id: '147012274',
    name: 'Акулич С.А.',
    firstName: 'Сергей Анатольевич',
    lastName: 'Акулич',
    phoneNumber: '8-055-555-55-55',
    creator: superAdmin,
    companies: [company],
    role: 'Admin',
  },
];

// Документы Appl
const applDocuments: IApplDocument[] = [
  {
    id: '149000001',
    number: '100',
    documentDate: '2021-07-04',
    documentType: applType,
    status: 'DRAFT',
    head: {
      applStatus: applStatuses[0],
      purchaseType: {
        id: '101',
        name: 'Усуга',
      },
      dept: {
        id: '201',
        name: 'Электроцех',
      },
      purpose: {
        id: '301',
        name: 'Услуги',
      },
      justification: 'утилизация ртутосодержащих ламп',
      applicant: {
        id: '401',
        name: 'Булла Михаил Викторович',
      },
      specPreAgree: {
        id: '402',
        name: 'Самусевич Александр Николаевич',
      },
      specAgreeEngin: {
        id: '403',
        name: 'Реут Валерий Валентинович',
      },
      verificationDate: new Date('2021-07-02'),
    },
    lines: [
      {
        id: '701',
        orderNum: 1,
        goodName: 'Прошу найти организацию  для утилизации люминесцентных ламп',
        quantity: 368,
      },
    ],
  },
];
export { documentTypes, applType, applStatuses, refApplStatuses, users, applDocuments };
