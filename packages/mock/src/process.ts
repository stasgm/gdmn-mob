import { IProcess } from '@lib/types';

import { company } from './companies';

const processes: IProcess[] = [
  {
    id: 'qw3673f0-45eb-11ec-va5c-b7494455c651',
    companyId: company.id,
    appSystem: 'gdmn-gd-movement',
    dateBegin: new Date(),
    files: [
      '3efb4340-af63-11ec-a229-7fa5c8e1feee.json',
      '3f0ef250-af63-11ec-a229-7fa5c8e1feee.json',
      '47a143a0-ac43-11ec-a4a9-0fa6355b9b44.json',
      '47a450e0-ac43-11ec-a4a9-0fa6355b9b44.json',
    ],
    status: 'READY_TO_COMMIT',
    processedFiles: {
      '3efb4340-af63-11ec-a229-7fa5c8e1feee.json': { status: 'READY' },
      '3f0ef250-af63-11ec-a229-7fa5c8e1feee.json': { status: 'SENT' },
      '47a143a0-ac43-11ec-a4a9-0fa6355b9b44.json': { status: 'READY' },
      '47a450e0-ac43-11ec-a4a9-0fa6355b9b44.json': { status: 'SENT' },
    },
    dateReadyToCommit: new Date(),
  },
];

const process = processes[0];

export { process, processes };
