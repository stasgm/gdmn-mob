import { Transfer, IResponse } from '@lib/types';

import { error, transfer as types } from '../types';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class CTransfer extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  setTransfer = async () => {
    try {
      const res = await this.api.axios.post<IResponse<Transfer>>('/transfer');
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'SET_TRANSFER',
          status: resData?.data,
        } as types.ISetTransferResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка процесса',
      } as error.INetworkError;
    }
  };

  getTransfer = async () => {
    try {
      const res = await this.api.axios.get<IResponse<Transfer>>('/transfer');
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_TRANSFER',
          status: resData?.data,
        } as types.IGetTransferResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка процесса',
      } as error.INetworkError;
    }
  };

  removeMessage = async (uid: string) => {
    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/transfer/${uid}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_TRANSFER',
        } as types.IRemoveTransferResponse;
      }
      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления процесса',
      } as error.INetworkError;
    }
  };
}

export default CTransfer;
