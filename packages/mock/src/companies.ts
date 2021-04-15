import { v4 as uuid } from 'uuid';

export default [
  { id: uuid(), name: 'Company 1', admin: { id: 'adminId', userName: 'Admin' } },
  { id: uuid(), name: 'Company 2', admin: { id: 'adminId', userName: 'Admin' } },
  { id: uuid(), name: 'Company 3', admin: { id: 'adminId', userName: 'Admin' } },
  { id: uuid(), name: 'Company 4', admin: { id: 'adminId', userName: 'Admin' } },
];
