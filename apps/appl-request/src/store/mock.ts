import { IReference, INamedEntity, ICompany } from '@lib/types';
import { superAdmin } from '@lib/mock';

import { IApplDocument, IEmployee } from './types';

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

// Employees
const employees: IEmployee[] = [
  {
    id: '147012001',
    name: 'Акулич С.А.',
    firstName: 'Сергей',
    middleName: 'Анатольевич',
    lastName: 'Акулич',
    position: {
      id: '001',
      name: 'Директор',
    },
  },
  {
    id: '147012002',
    name: 'Булла М.В.',
    firstName: 'Михаил',
    middleName: 'Викторович',
    lastName: 'Булла',
    position: {
      id: '011',
      name: 'Энергетик"',
    },
  },
  {
    id: '147012003',
    name: 'Самусевич А.Н.',
    firstName: 'Александр',
    middleName: ' Николаевич',
    lastName: 'Самусевич',
    position: {
      id: '006',
      name: 'Начальник отдела материально-тенического обеспечения"',
    },
  },
  {
    id: '147012002',
    name: 'Реут В.В.',
    firstName: 'Валерий',
    middleName: 'Валентинович',
    lastName: 'Реут',
    position: {
      id: '004',
      name: 'Главный инженер"',
    },
  },
];

// appl emplyees reference
const refEmplyees: IReference<IEmployee> = {
  id: '148000002',
  name: 'Сотрудники',
  description: 'Сотрудники организации',
  data: employees,
};

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
      sysApplicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      applicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      specPreAgree: {
        id: employees[2].id,
        name: employees[2].name,
      },
      specAgreeEngin: {
        id: employees[3].id,
        name: employees[3].name,
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
  {
    id: '149000002',
    number: '101',
    documentDate: '2021-07-07',
    documentType: applType,
    status: 'DRAFT',
    head: {
      applStatus: applStatuses[0],
      purchaseType: {
        id: '102',
        name: 'Товар',
      },
      dept: {
        id: '201',
        name: 'СХЦ "Величковичи"',
      },
      purpose: {
        id: '301',
        name: 'Канцтовары',
      },
      justification: 'Покупка канцтоваров',
      sysApplicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      applicant: {
        id: employees[1].id,
        name: employees[1].name,
      },
      specPreAgree: {
        id: employees[2].id,
        name: employees[2].name,
      },
      specAgreeEngin: {
        id: employees[3].id,
        name: employees[3].name,
      },
      verificationDate: new Date('2021-07-03'),
    },
    lines: [
      {
        id: '702',
        orderNum: 1,
        goodName: 'Прошу закупить карандаши',
        quantity: 100,
      },
      {
        id: '703',
        orderNum: 2,
        goodName: 'Прошу закупить тетради',
        quantity: 150,
      },
      {
        id: '704',
        orderNum: 3,
        goodName: 'Прошу закупить столы',
        quantity: 10,
      },
      {
        id: '705',
        orderNum: 4,
        goodName: 'Прошу закупить книги',
        quantity: 50,
      },
    ],
  },
];
export { documentTypes, applType, applStatuses, refApplStatuses, employees, applDocuments, refEmplyees, company };
