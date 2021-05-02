// import { AxiosInstance } from 'axios';
import { IMessage, IMessageInfo, IResponse } from '@lib/types';

import { error, message as types } from '../types';
import { BaseRequest } from '../requests/baseApi';
import { BaseApi } from '../types/types';

class Message extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  sendMessages = async (systemName: string, companyId: string, consumer: string, message: IMessage['body']) => {
    const body = {
      head: { companyId, consumer, appSystem: systemName },
      message,
    };
    const res = await this.api.axios.post<IResponse<IMessageInfo>>('/messages', body);
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

  getMessages = async (systemName: string, companyId: string) => {
    const res = await this.api.axios.get<IResponse<IMessage[]>>(`/messages/${companyId}/${systemName}`);
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

  removeMessage = async (companyId: string, uid: string) => {
    const res = await this.api.axios.delete<IResponse<void>>(`/messages/${companyId}/${uid}`);
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

  clear = async () => {
    const res = await this.api.axios.delete<IResponse<void>>('/messages');
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

  subscribe = async (systemName: string, companyId: string) => {
    const res = await this.api.axios.get<IResponse<IMessage[]>>(`/messages/subscribe/${companyId}/${systemName}`);
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

  publish = async (companyId: string, consumer: string, message: IMessage['body']) => {
    const body = { head: { companyId, consumer }, message };
    const res = await this.api.axios.post<IResponse<IMessageInfo>>(`/messages/publish/${companyId}`, body);
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
}

export default Message;
