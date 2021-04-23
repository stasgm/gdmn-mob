import { IDevice, INamedEntity } from '@lib/types';
import { v4 as uuid } from 'uuid';

import { users } from './users';

const user: INamedEntity = {
  id: users[0].id,
  name: users[0].name,
};

const devices: IDevice[] = [
  {
    id: uuid(),
    name: 'iPhone',
    user,
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    state: 'ACTIVE',
  },
  {
    id: uuid(),
    name: 'Samsung',
    user,
    uid: 'ecc6ff20-899c-11eb-b406-85744eedb503',
    state: 'ACTIVE',
  },
];

const device = devices[0];

const device2 = devices[1];

export { devices, device, device2 };
