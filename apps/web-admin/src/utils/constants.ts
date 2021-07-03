import { DeviceState } from '@lib/types';

//const deviceStates = ['Не активно', 'Активно', 'Заблокировано'] as const;

// const getDeviceState = (state: DeviceState) => {
//   let stateDevice: typeof deviceStates[number];

//   switch (state) {
//     case 'NON-ACTIVATED':
//       stateDevice = deviceStates[0];
//       break;

//     case 'ACTIVE':
//       stateDevice = deviceStates[1];
//       break;

//     case 'BLOCKED':
//       stateDevice = deviceStates[2];
//       break;

//     default:
//       stateDevice = deviceStates[0];
//       break;
//   }

//   return stateDevice;
// };

const deviceStates = {
  'NON-ACTIVATED': 'Не активно',
  ACTIVE: 'Активно',
  BLOCKED: 'Заблокировано',
};

export { deviceStates };
