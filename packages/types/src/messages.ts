import { BodyType, CmdName, INamedEntity, StatusType } from './common';
import { IDocument } from './document';
import { IReferences } from './references';

import { IUserSettings } from './models';

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

export type MessageType = ICmd | IDocument[] | IReferences | IUserSettings;

export type IMessage<T = MessageType> = ISimpleMessage<T> | IMultipartMessage;

export interface IMessageBody<T = MessageType> {
  type: BodyType;
  version: number;
  payload: T;
}

export interface ISimpleMessage<T = MessageType> {
  id: string;
  status: StatusType;
  errorMessage?: string;
  version?: string;
  head: IHeadMessage;
  body: IMessageBody<T>;
}

export interface IMultipartMessage extends ISimpleMessage {
  multipartId: string;
  multipartSeq: number;
  multipartEOF?: boolean;
}

export type SimpleNewMessage = Omit<ISimpleMessage, 'head' | 'id'> & {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
};

export type MultipartNewMessage = Omit<IMultipartMessage, 'head' | 'id'> & {
  head: Omit<IHeadMessage, 'producer' | 'dateTime'>;
};

export type NewMessage = SimpleNewMessage | MultipartNewMessage;

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

export type IDBMessage<T = MessageType> = IDBSimpleMessage<T> | IDBMultipartMessage;

export interface IDBSimpleMessage<T = MessageType> extends Omit<ISimpleMessage<T>, 'head'> {
  head: IDBHeadMessage;
}

export interface IDBMultipartMessage extends IDBSimpleMessage {
  multipartId: string;
  multipartSeq: number;
  multipartEOF?: boolean;
}

export interface IFileMessageInfo {
  id: string;
  producerId: string;
  consumerId: string;
  deviceId: string;
  commandType: string;
  size?: number;
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
