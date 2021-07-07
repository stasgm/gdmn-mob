import { BodyType, INamedEntity, StatusType } from './common';

export interface IHeadMessage {
  appSystem: string;
  company: INamedEntity;
  producer: INamedEntity;
  consumer: INamedEntity;
  dateTime: string;
}

export interface ICmd {
  name: string;
  params?: any;
}

export interface IMessage<T = any> {
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
