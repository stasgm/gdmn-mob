import { IActivationCode } from '@lib/types';

const activationCodes: IActivationCode[] = [
  {
    code: '1111',
    device: { id: '1', name: 'iPhone' },
    id: '123',
    date: '2021-07-07T07:25:25.265Z',
  },

  {
    code: '1112',
    device: { id: '2', name: 'Android' },
    id: '103',
    date: '2021-07-07T07:25:25.265Z',
  },

  {
    code: '1113',
    device: { id: '4', name: 'Test 1' },
    id: '156',
    date: '2021-07-07T07:25:25.265Z',
  },

  {
    code: '1114',
    device: { id: '5', name: 'Test 2' },
    id: '178',
    date: '2021-07-07T07:25:25.265Z',
  },

  {
    code: '1115',
    device: { id: '6', name: 'Test 3' },
    id: '101',
    date: '2021-07-07T07:25:25.265Z',
  },
];

const activationCode = activationCodes[0];
const activationCode2 = activationCodes[1];

export { activationCode, activationCodes, activationCode2 };
