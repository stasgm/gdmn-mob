import { IMessage, IReferences, IDocument, ICmd } from '@lib/types';
import { company, user, user2 } from '@lib/mock';

import { applDocuments } from './documents';
import { applRefs } from './references';

export const applMessages: IMessage<ICmd | IDocument[] | IReferences>[] = [
  {
    id: '1',
    status: 'READY',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user,
      consumer: user2,
      dateTime: '2021-07-15T10:47:33.376Z',
    },
    body: {
      type: 'CMD',
      payload: {
        name: 'GET_APPL_DOCUMENTS',
        params: [
          {
            dateBegin: '2021-07-06',
            dateEnd: '2021-07-07',
          },
        ],
      },
    },
  },
  {
    id: '2',
    status: 'READY',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user2,
      consumer: user,
      dateTime: '2021-07-21T18:03:33.376Z',
    },
    body: {
      type: 'DOCS',
      payload: applDocuments,
    },
  },
  {
    id: '3',
    status: 'READY',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user2,
      consumer: user,
      dateTime: '2021-07-22T16:03:33.376Z',
    },
    body: {
      type: 'REFS',
      payload: applRefs,
    },
  },
];
