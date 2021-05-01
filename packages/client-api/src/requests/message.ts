import { AxiosInstance } from 'axios';
import { IMessage, IMessageInfo, INamedEntity, IResponse, NewMessage } from '@lib/types';
import { messages as mockMessages } from '@lib/mock';

import { error, message as types } from '../types';

import { sleep } from '../utils';

import { BaseApi } from './baseApi';

const isMock = process.env.MOCK || true;
const mockTimeout = 500;

class Message extends BaseApi {
  constructor(api: AxiosInstance, deviceId: string) {
    super(api, deviceId);
  }

  sendMessages = async (
    systemName: string,
    company: INamedEntity,
    consumer: INamedEntity,
    message: IMessage['body'],
  ) => {
    const body: NewMessage = {
      head: { company, consumer, appSystem: systemName },
      body: message,
    };

    const res = await this.api.post<IResponse<IMessageInfo>>('/messages', body);
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

  getMessages = async ({ companyId, systemId }: { systemId: string; companyId: string }) => {
    if (isMock) {
      await sleep(mockTimeout);

      return {
        type: 'GET_MESSAGES',
        messageList: mockMessages,
        // : { ...mockMessages, id: uuid() },
      } as types.IGetMessagesResponse;
    }

    const res = await this.api.get<IResponse<IMessage[]>>(`/messages/${companyId}/${systemId}`);
    const resData = res.data;

    if (resData.result) {
      return {
        type: 'GET_MESSAGES',
        messageList: resData.data,
      } as types.IGetMessagesResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error || 'Oops, Something Went Wrong',
    } as error.INetworkError;
  };

  removeMessage = async (companyId: string, uid: string) => {
    const res = await this.api.delete<IResponse<void>>(`/messages/${companyId}/${uid}`);
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
    const res = await this.api.delete<IResponse<void>>('/messages');
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
    const res = await this.api.get<IResponse<IMessage[]>>(`/messages/subscribe/${companyId}/${systemName}`);
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
    const res = await this.api.post<IResponse<IMessageInfo>>(`/messages/publish/${companyId}`, body);
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
