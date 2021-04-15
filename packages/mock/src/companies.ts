import { ICompany } from '@lib/client-types';
import { v4 as uuid } from 'uuid';

import { user } from '.';

const companies: ICompany[] = [
  { id: uuid(), name: 'Company 1', admin: user },
  { id: uuid(), name: 'Company 2', admin: user },
  { id: uuid(), name: 'Company 3', admin: user },
  { id: uuid(), name: 'Company 4', admin: user },
];

export default companies;
