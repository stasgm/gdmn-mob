import { IDevice } from '@lib/types';

import { company, company2, company3 } from './companies';

const devices: IDevice[] = [
  {
    id: '1',
    name: 'iPhone',
    state: 'ACTIVE',
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    company: company,
  },
  {
    id: '2',
    name: 'Android',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb503',
    company: company2,
  },
  {
    id: '3',
    name: 'WEB',
    state: 'ACTIVE',
    uid: 'WEB',
    company: company3,
  },
];

const device = devices[0];
const device2 = devices[1];

export { device, devices, device2 };
