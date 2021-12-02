import { BodyType, INamedEntity, StatusType } from './common';
import { IDocument, IDocumentType } from './document';
import { IReferences } from './references';

import { IUserSettings } from './models';

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
  documentType?: IDocumentType;
  data?: T;
}

export interface ICmd<T extends ICmdParams[] | Pick<ICmdParams, 'data'> = ICmdParams[]> {
  name: string;
  params?: T;
}

export type MessageType = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences | IUserSettings;

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
export interface IMessage<
  T = ICmd<ICmdParams[] | Pick<ICmdParams, 'data'>> | IDocument[] | IReferences | IUserSettings,
> {
  id: string;
  status: StatusType;
  version?: number;
  head: IHeadMessage;
  body: {
    type: BodyType;
    version: number;
    payload: T;
  };
}

export type NewMessage = Omit<IMessage, 'head' | 'id'> & {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
};

// export type NewMessage<T = any> = {
//   head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
//   status: StatusType;
//   body: {
//     type: BodyType;
//     payload: T;
//   };
// };

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

// Messages
export interface IDBHeadMessage extends Omit<IHeadMessage, 'company' | 'producer' | 'consumer'> {
  // appSystem: string;
  companyId: string;
  producerId: string;
  consumerId: string;
  // dateTime: string;
}

export interface IDBMessage<T = any> extends Omit<IMessage<T>, 'head'> {
  head: IDBHeadMessage;
}
