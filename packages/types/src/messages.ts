import { BodyType, CmdName, INamedEntity, StatusType } from './common';
import { IDocument, IDocumentType } from './document';
import { IReferences } from './references';

import { IAppSystemSettings, IUserSettings } from './models';

export interface IHeadMessage {
  appSystem: INamedEntity;
  company: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  dateTime: string;
  order: number;
  replyTo?: string;
  deviceId: string;
}

export interface ICmdParams {
  [paramName: string]: unknown;
}

export interface ICmd<T = ICmdParams | IRefCmd> {
  name: CmdName;
  params?: T;
}

export interface IRefCmd {
  refName: string;
  contactId?: string;
}

export type MessageType = ICmd | IDocument[] | IReferences | IUserSettings | IAppSystemSettings;

export interface IMessage<T = MessageType> {
  id: string;
  status: StatusType;
  errorMessage?: string;
  version?: string;
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
export interface IDBHeadMessage extends Omit<IHeadMessage, 'company' | 'producer' | 'consumer' | 'appSystem'> {
  appSystemId: string;
  companyId: string;
  producerId: string;
  consumerId: string;
}

export interface IDBMessage<T = MessageType> extends Omit<IMessage<T>, 'head'> {
  head: IDBHeadMessage;
}

export interface IFileMessageInfo {
  id: string;
  producerId: string;
  consumerId: string;
  deviceId: string;
}

export interface ICheckTransafer {
  state: boolean;
}

export interface IMessageParams {
  companyId: string;
  appSystemId: string;
}

export interface IAppSystemParams extends Omit<IMessageParams, 'appSystemId'> {
  appSystemName: string;
}
