import { AuthLogOut, IMessage, IMessageInfo, IMessageParams, INamedEntity, IResponse, NewMessage } from '@lib/types';

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
    appSystem: INamedEntity,
    company: INamedEntity,
    consumer: INamedEntity,
    message: IMessage['body'],
    order: number,
    deviceId: string,
    authFunc?: AuthLogOut,
  ) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SEND_MESSAGE',
        date: new Date(),
        uid: generateId(),
      } as types.ISendMessageResponse;
    }

    try {
      const body: NewMessage = {
        head: { company, consumer, appSystem, order, deviceId },
        status: 'READY',
        body: message,
      };

      const res = await this.api.axios.post<IResponse<IMessageInfo>>('/messages', body);
      const resData = res.data;

      if (authFunc && resData.status === 401) {
        await authFunc();
      }

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

  getMessages = async (customRequest: CustomRequest, params: IMessageParams) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_MESSAGES',
        messageList: [],
      } as types.IGetMessagesResponse;
    }

    // try {
    //   const res = await this.api.axios.get<IResponse<IMessage[]>>(
    //     `/messages?companyId=${params.companyId}&appSystemId=${params.appSystemId}`,
    //   );
    //   const resData = res.data;

    //   if (authFunc && resData.status === 401) {
    //     await authFunc();
    //   }

    const res = await customRequest<IMessage[]>({
      api: this.api,
      method: 'GET',
      url: `/messages?companyId=${params.companyId}&appSystemId=${params.appSystemId}`,
    });

    if (res?.result) {
      return {
        type: 'GET_MESSAGES',
        messageList: res.data,
      } as types.IGetMessagesResponse;
    }

    return {
      type: 'ERROR',
      message: res?.error || 'сообщения не получены',
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err instanceof TypeError ? err.message : 'ошибка получения сообщения',
    //   } as error.INetworkError;
    // }
  };

  removeMessage = async (messageId: string, params: IMessageParams, authFunc?: AuthLogOut) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_MESSAGE',
      } as types.IRemoveMessageResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(
        `/messages/${messageId}?companyId=${params.companyId}&appSystemId=${params.appSystemId}`,
      );
      const resData = res.data;

      if (authFunc && resData.status === 401) {
        await authFunc();
      }

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

  clear = async (params: IMessageParams, authFunc?: AuthLogOut) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'CLEAR_MESSAGES',
      } as types.IClearMessagesResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(
        `/messages?companyId=${params.companyId}&appSystemId=${params.appSystemId}`,
      );
      const resData = res.data;

      if (authFunc && resData.status === 401) {
        await authFunc();
      }

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
}

export default Message;
