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

export interface IMessage<T = MessageType> {
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

export type NewProcessMessage = Omit<IMessage, 'head' | 'id'> & {
  id?: string;
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
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

// Messages
export interface IDBHeadMessage extends Omit<IHeadMessage, 'company' | 'producer' | 'consumer'> {
  // appSystem: string;
  companyId: string;
  producerId: string;
  consumerId: string;
  // dateTime: string;
}

export interface IDBMessage<T = MessageType> extends Omit<IMessage<T>, 'head'> {
  head: IDBHeadMessage;
}

export interface IFileMessageInfo {
  id: string;
  producer: string;
  consumer: string;
}

export interface ICheckTransafer {
  state: boolean;
}

export interface ITransfer {
  uid: string;
  uDate: string;
}

export type Transfer = ITransfer | undefined;

export type ITransferReq = {
  uid: string;
};
