import { IResponse, INoticeParams } from '@lib/types';

import { error, errorNotice as types } from '../types';
import { sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class ErrorNotice extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addErrorNotice = async (body: INoticeParams) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_NOTICE',
      } as types.IAddErrorNoticeResponse;
    }

    try {
      const res = await this.api.axios.post<IResponse<void>>('/users/mobileErrors', body);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'ADD_NOTICE',
        } as types.IAddErrorNoticeResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка отправки сообщения с ошибкой',
      } as error.INetworkError;
    }
  };
}
export default ErrorNotice;
