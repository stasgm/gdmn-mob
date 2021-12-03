import { IDevice } from '@lib/types';

import { company2, company3 } from './companies';

const devices: IDevice[] = [
  {
    id: '1',
    name: 'MyPhone',
    state: 'ACTIVE',
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    company: company3,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '2',
    name: 'Android',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb503',
    company: company2,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '3',
    name: 'WEB',
    state: 'ACTIVE',
    uid: 'WEB',
    company: company3,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '4',
    name: 'Test 1',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb504',
    company: company3,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '5',
    name: 'Test 2',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb505',
    company: company2,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '6',
    name: 'Test 3',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb506',
    company: company3,
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
];

const device = devices[0];
const device2 = devices[1];

export { device, devices, device2 };
