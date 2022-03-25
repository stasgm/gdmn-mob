import { IMessage, IMessageInfo, INamedEntity, IResponse, NewMessage } from '@lib/types';

import { error, message as types } from '../types';
import { sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class Message extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  sendMessages = async (
    systemName: string,
    company: INamedEntity,
    consumer: INamedEntity,
    message: IMessage['body'],
  ) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SEND_MESSAGE',
        date: new Date(),
        uid: '11111',
      } as types.ISendMessageResponse;
    }

    try {
      const body: NewMessage = {
        head: { company, consumer, appSystem: systemName },
        status: 'READY',
        body: message,
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка отправки сообщения',
      } as error.INetworkError;
    }
  };

  getMessages = async ({ systemName, companyId }: { systemName: string; companyId: string }) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_MESSAGES',
        messageList: [],
      } as types.IGetMessagesResponse;
    }

    try {
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
        message: resData.error || 'ошибка получения данных',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения сообщения',
      } as error.INetworkError;
    }
  };

  removeMessage = async (messageId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_MESSAGE',
      } as types.IRemoveMessageResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/messages/${messageId}`);
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления сообщения',
      } as error.INetworkError;
    }
  };

  clear = async () => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'CLEAR_MESSAGES',
      } as types.IClearMessagesResponse;
    }

    try {
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления сообщений',
      } as error.INetworkError;
    }
  };

  /* subscribe = async (systemName: string, companyId: string) => {
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
  }; */
}

export default Message;
