import { BodyType, INamedEntity, StatusType } from './common';
import { IDocument, IDocumentType } from './document';
import { IReferences } from './references';

import { IUserSettings } from './models';

export interface IHeadMessage {
  appSystem: INamedEntity;
  company: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  dateTime: string;
  replyTo?: string;
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
  version?: string;
  head: IHeadMessage;
  body: {
    type: BodyType;
    version: number;
    payload: T;
  };
}

export function isIHeadMessage(obj: any): obj is IHeadMessage {
  return typeof obj === 'object';
}

export function isIMessage(obj: any): obj is IMessage {
  return obj['body']['version'] === 1 && isIHeadMessage(obj['head']);
}

export function isIResponseMessage(obj: any): obj is IMessage {
  return obj['body']['version'] === 1 && isIHeadMessage(obj['head']) && !!obj['head']['replyTo'];
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

//TODO: добавить более специфические условия проверки
export function isIDBHeadMessage(obj: any): obj is IDBHeadMessage {
  return typeof obj === 'object';
}

//TODO: добавить более специфические условия проверки
export function isIDBMessage(obj: any): obj is IDBMessage {
  return obj['body']['version'] === 1 && isIDBHeadMessage(obj['head']);
}

export interface IFileMessageInfo {
  id: string;
  producerId: string;
  consumerId: string;
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
