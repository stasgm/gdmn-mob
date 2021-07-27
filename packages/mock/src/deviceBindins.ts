import { IDeviceBinding } from '@lib/types';

import { user, user2 } from './users';
import { device, device2 } from './devices';

const deviceBindings: IDeviceBinding[] = [
  {
    id: '1',
    user,
    device,
    state: 'ACTIVE',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
  {
    id: '2',
    user: user2,
    device: device2,
    state: 'ACTIVE',
    creationDate: '2021.01.01',
    editionDate: '2021.01.01',
  },
];

const deviceBinding = deviceBindings[0];
const deviceBinding2 = deviceBindings[1];

export { deviceBinding, deviceBindings, deviceBinding2 };
