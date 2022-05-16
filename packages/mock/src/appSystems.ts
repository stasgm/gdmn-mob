import { IAppSystem } from '@lib/types';

const appSystems: IAppSystem[] = [
  {
    id: '1',
    name: 'gdmn-sales-representative',
  },
  {
    id: '2',
    name: 'gdmn-gd-movement',
  },
  {
    id: '3',
    name: 'gdmn-appl-request',
  },
];

const appSystem = appSystems[0];
const appSystem2 = appSystems[1];

export { appSystem, appSystem2, appSystems };
