import { IAppSystem } from '@lib/types';

const appSystems: IAppSystem[] = [
  {
    id: '1',
    name: 'gdmn-agent',
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

export { appSystem, appSystems };
