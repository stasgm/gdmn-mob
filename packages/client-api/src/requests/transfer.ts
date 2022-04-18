import { Transfer, IResponse } from '@lib/types';

import { error, transfer as types } from '../types';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { sleep } from '../utils';

class CTransfer extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  setTransfer = async () => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'SET_TRANSFER',
        status: undefined,
      } as types.ISetTransferResponse;
    }

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
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_TRANSFER',
        status: undefined,
      } as types.IGetTransferResponse;
    }

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

  clearTransfer = async (uid: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'CLEAR_TRANSFER',
      } as types.IClearTransferResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/transfer/${uid}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'CLEAR_TRANSFER',
        } as types.IClearTransferResponse;
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
