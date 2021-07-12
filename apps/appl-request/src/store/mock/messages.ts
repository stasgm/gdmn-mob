import { IMessage, IReferences, IDocument, ICmd, ICmdParams } from '@lib/types';
import { company, user, user2 } from '@lib/mock';

import { applDocuments } from './documents';
import { applRefs } from './references';

type MessageType = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences;

export const applMessages: IMessage<MessageType>[] = [
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
      /*  Для загрузки справочников : payload: { name: 'GET_REF', params: { data: ['Employees', 'Statuses'] } },
      ниже вид для загрузки документов. В них дата может быть чем то дополнительным, например, массов из дополнительных полей*/
      payload: {
        name: 'GET_DOCUMENTS',
        params: [
          {
            dateBegin: '2021-07-06',
            dateEnd: '2021-07-07',
            documentType: {
              id: '168063006',
              name: 'Заявки на закупку ТМЦ',
            },
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
