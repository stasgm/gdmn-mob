import { IReferences, IDocument } from '@lib/types';

import { BodyType, INamedEntity, StatusType } from './common';

export interface IHeadMessage {
  appSystem: string;
  company: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  dateTime: string;
}

export interface ICmdParams<T = any> {
  dateBegin: string;
  dateEnd: string;
  documentType: INamedEntity;
  data?: T;
}
export interface ICmd<T extends ICmdParams[] | Pick<ICmdParams, 'data'> = ICmdParams[]> {
  name: string;
  params?: T;
}

/* const cmd1: ICmd<ICmdParams[]> = {
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
};

const cmd2: ICmd<Pick<ICmdParams, 'data'>> = {
  name: 'GET_REF',
  params: { data: 'ddgdhfghf' },
};
 */
export interface IMessage<T = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences> {
  id: string;
  status: StatusType;
  head: IHeadMessage;
  body: {
    type: BodyType;
    payload: T;
  };
}

export type NewMessage<T = any> = {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
  status: StatusType;
  body: {
    type: BodyType;
    payload: T;
  };
};

export interface IDataMessage<T = any> {
  id: string;
  name: string;
  type: string;
  data: T;
}

export interface IMessageInfo {
  uid: string;
  date: Date;
}
