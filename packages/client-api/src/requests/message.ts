import { IMessage, IMessageInfo, INamedEntity, NewMessage } from '@lib/types';

import { error, message as types } from '../types';
import { generateId, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class Message extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  sendMessages = async (
    customRequest: CustomRequest,
    appSystem: INamedEntity,
    company: INamedEntity,
    consumer: INamedEntity,
    message: IMessage['body'],
    order: number,
    deviceId: string,
  ) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SEND_MESSAGE',
        date: new Date(),
        uid: generateId(),
      } as types.ISendMessageResponse;
    }

    const body: NewMessage = {
      head: { company, consumer, appSystem, order, deviceId },
      status: 'READY',
      body: message,
    };

    const res = await customRequest<IMessageInfo>({
      api: this.api.axios,
      method: 'POST',
      url: '/messages',
      data: body,
    });

    if (res?.result) {
      return {
        type: 'SEND_MESSAGE',
        uid: res.data?.uid,
        date: res.data?.date,
      } as types.ISendMessageResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'сообщение не отправлено',
    } as error.IServerError;
  };

  getMessages = async (customRequest: CustomRequest, params: Record<string, string>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_MESSAGES',
        messageList: [],
      } as types.IGetMessagesResponse;
    }

    const res = await customRequest<IMessage[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/messages',
      params,
    });

    if (res?.result) {
      return {
        type: 'GET_MESSAGES',
        messageList: res.data,
      } as types.IGetMessagesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'сообщения не получены',
    } as error.IServerError;
  };

  removeMessage = async (customRequest: CustomRequest, messageId: string, params: Record<string, string>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_MESSAGE',
      } as types.IRemoveMessageResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/messages/${messageId}`,
      params,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_MESSAGE',
      } as types.IRemoveMessageResponse;
    }
    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'cooбщение не удалено',
    } as error.IServerError;
  };

  clear = async (customRequest: CustomRequest, params: Record<string, string>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'CLEAR_MESSAGES',
      } as types.IClearMessagesResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: '/messages',
      params,
    });

    if (res?.result) {
      return {
        type: 'CLEAR_MESSAGES',
      } as types.IClearMessagesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'сообщения не удалены',
    } as error.IServerError;
  };
}

export default Message;
