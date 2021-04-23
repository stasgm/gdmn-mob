import { IDevice, INamedEntity } from '@lib/types';
import { v4 as uuid } from 'uuid';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '345',
  name: 'Ina',
};

const devices: IDevice[] = [
  {
    id: uuid(),
    name: 'iPhone',
    state: 'ACTIVE',
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    user: user1,
  },
  {
    id: uuid(),
    name: 'Android',
    state: 'ACTIVE',
    uid: 'ecc6ff20-999c-11eb-b406-85744eedb503',
    user: user2,
  },
  {
    id: uuid(),
    name: 'WEB',
    state: 'ACTIVE',
    uid: 'WEB',
    user: user1,
  },
];

const device = devices[0];

export { device, devices };
