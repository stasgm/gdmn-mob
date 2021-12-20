import { IDBCompany } from '@lib/types';

const companies: IDBCompany[] = [
  { id: '789', name: 'Моя компания 1', adminId: '1' },
  { id: '654', name: 'Моя компания 2', adminId: 'user2' },
  { id: '777', name: 'Моя компания', adminId: 'user1' },
  { id: '12', name: 'Company 2', adminId: 'user2' },
  { id: '13', name: 'Company 3', adminId: 'user1' },
  { id: '44', name: 'Company 4', adminId: 'user2' },
];

const company = companies[0];
const company2 = companies[1];
const company3 = companies[2];

export { companies, company, company2, company3 };
