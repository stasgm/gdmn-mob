import { IMessage, IReferences, IDocument } from '@lib/types';
import { company, user, user2 } from '@lib/mock';

import { applDocuments, applRefs } from './mock';

export const applMessages: IMessage<string | IDocument[] | IReferences>[] = [
  {
    id: '1',
    status: 'recd',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user,
      consumer: user2,
      dateTime: '2021-07-15T10:47:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get documents',
    },
  },
  {
    id: '2',
    status: 'recd',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user2,
      consumer: user,
      dateTime: '2021-07-21T18:03:33.376Z',
    },
    body: {
      type: 'docs',
      payload: applDocuments,
    },
  },
  {
    id: '2',
    status: 'recd',
    head: {
      appSystem: 'gdmn-appl-request',
      company: company,
      producer: user2,
      consumer: user,
      dateTime: '2021-07-21T16:03:33.376Z',
    },
    body: {
      type: 'refs',
      payload: applRefs,
    },
  },
];
