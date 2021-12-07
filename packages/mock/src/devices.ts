import { IDevice } from '@lib/types';

import { company2, company3 } from './companies';

const devices: IDevice[] = [
  {
    id: '1',
    name: 'Phone',
    state: 'ACTIVE',
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    company: company3,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '2',
    name: 'Phone 1',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb503',
    company: company2,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '3',
    name: 'WEB',
    state: 'ACTIVE',
    uid: 'WEB',
    company: company3,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '4',
    name: 'Phone 2',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb504',
    company: company3,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '5',
    name: 'Phone 3',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb505',
    company: company2,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
  {
    id: '6',
    name: 'Phone 4',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb506',
    company: company3,
    creationDate: '2021-11-24T14:02:55.886Z',
    editionDate: '2021-11-24T14:02:55.886Z',
  },
];

const device = devices[0];
const device2 = devices[1];

export { device, devices, device2 };
