import { IMessage, IMessageInfo, IResponse } from '@lib/types';

import { error, message as types } from '../types';

import { api } from '../config';

const sendMessages = async (systemName: string, companyId: string, consumer: string, message: IMessage['body']) => {
  const body = {
    head: { companyId, consumer, appSystem: systemName },
    message,
  };
  const res = await api.post<IResponse<IMessageInfo>>('/messages', body);
  const resData = res.data;
  if (resData.result) {
    return {
      type: 'SEND_MESSAGE',
      uid: resData.data?.uid,
      date: resData.data?.date,
    } as types.ISendMessageResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const getMessages = async (systemName: string, companyId: string) => {
  const res = await api.get<IResponse<IMessage[]>>(`/messages/${companyId}/${systemName}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'GET_MESSAGES',
      messageList: resData.data,
    } as types.IGetMessagesResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const removeMessage = async (companyId: string, uid: string) => {
  const res = await api.delete<IResponse<void>>(`/messages/${companyId}/${uid}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'REMOVE_MESSAGE',
    } as types.IRemoveMessageResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const clear = async () => {
  const res = await api.delete<IResponse<void>>('/messages');
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'CLEAR_MESSAGES',
    } as types.IClearMessagesResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const subscribe = async (systemName: string, companyId: string) => {
  const res = await api.get<IResponse<IMessage[]>>(`/messages/subscribe/${companyId}/${systemName}`);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'SUBSCRIBE',
      messageList: resData.data,
    } as types.ISubscribeResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

const publish = async (companyId: string, consumer: string, message: IMessage['body']) => {
  const body = { head: { companyId, consumer }, message };
  const res = await api.post<IResponse<IMessageInfo>>(`/messages/publish/${companyId}`, body);
  const resData = res.data;

  if (resData.result) {
    return {
      type: 'PUBLISH',
      uid: resData.data?.uid,
      date: resData.data?.date,
    } as types.IPublishResponse;
  }
  return {
    type: 'ERROR',
    message: resData.error,
  } as error.INetworkError;
};

export default {
  sendMessages,
  getMessages,
  removeMessage,
  clear,
  subscribe,
  publish,
};
