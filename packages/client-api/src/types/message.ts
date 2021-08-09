import { IMessage } from '@lib/types';

export interface IMessageQueryResponse {
  type: 'SEND_MESSAGE' | 'GET_MESSAGES' | 'REMOVE_MESSAGE' | 'CLEAR_MESSAGES' | 'SUBSCRIBE' | 'PUBLISH';
}
export interface ISendMessageResponse extends IMessageQueryResponse {
  type: 'SEND_MESSAGE';
  uid: string;
  date: Date;
}

export interface IGetMessagesResponse extends IMessageQueryResponse {
  type: 'GET_MESSAGES';
  messageList: IMessage[];
}

export interface IRemoveMessageResponse extends IMessageQueryResponse {
  type: 'REMOVE_MESSAGE';
}

export interface IClearMessagesResponse extends IMessageQueryResponse {
  type: 'CLEAR_MESSAGES';
}

// export interface ISubscribeResponse extends IMessageQueryResponse {
//   type: 'SUBSCRIBE';
//   messageList: IMessage[];
// }

// export interface IPublishResponse extends IMessageQueryResponse {
//   type: 'PUBLISH';
//   uid: string;
//   date: Date;
// }

export type MessageQueryResponse =
  | ISendMessageResponse
  | IGetMessagesResponse
  | IRemoveMessageResponse
  | IClearMessagesResponse;
// | ISubscribeResponse
// | IPublishResponse;
