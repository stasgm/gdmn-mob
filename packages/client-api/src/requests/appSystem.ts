import { v4 as uuid } from 'uuid';

import { IResponse, IAppSystem, NewAppSystem } from '@lib/types';

import { error, appSystem as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class AppSystem extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addAppSystem = async (appSystem: NewAppSystem) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ADD_APP_SYSTEM',
        appSystem: {
          ...appSystem,
          id: uuid(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddAppSystemResponse;
    }

    const res = await this.api.axios.post<IResponse<IAppSystem>>('/appSystems', appSystem);
    const resData = res.data;

    if (resData?.result) {
      return {
        type: 'ADD_APP_SYSTEM',
        appSystem: resData?.data,
      } as types.IAddAppSystemResponse;
    }

    return {
      type: 'ERROR',
      message: resData.error,
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err?.response?.data?.error || 'ошибка создания компании',
    //   } as error.INetworkError;
    // }
  };

  updateAppSystem = async (appSystem: Partial<IAppSystem>) => {
    // if (this.api.config.debug?.isMock) {

    try {
      const res = await this.api.axios.patch<IResponse<IAppSystem>>(`/appSystems/${appSystem.id}`, appSystem);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'UPDATE_APP_SYSTEM',
          appSystem: resData.data,
        } as types.IUpdateAppSystemResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка обновления подсистемы',
        //err?.response?.data?.error || 'ошибка обновления компании',
      } as error.INetworkError;
    }
  };

  removeAppSystem = async (appSystemId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_APP_SYSTEM',
      } as types.IRemoveAppSystemResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/appSystems/${appSystemId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_APP_SYSTEM',
        } as types.IRemoveAppSystemResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления компании',
        //err?.response?.data?.error || 'ошибка удаления компании',
      } as error.INetworkError;
    }
  };

  getAppSystem = async (appSystemId: string) => {
    // if (this.api.config.debug?.isMock) {
    // }

    try {
      const res = await this.api.axios.get<IResponse<IAppSystem>>(`/appSystems/${appSystemId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_APP_SYSTEM',
          appSystem: resData.data,
        } as types.IGetAppSystemResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о подсистеме',
        //err?.response?.data?.error || 'ошибка получения данных о компании',
      } as error.INetworkError;
    }
  };

  getAppSystems = async (params?: Record<string, string | number>) => {
    // if (this.api.config.debug?.isMock) {
    //   await sleep(this.api.config.debug?.mockDelay || 0);

    //   return {
    //     type: 'GET_APP_SYSTEMS',
    //     appSystems: mockAppSystems,
    //   } as types.IAppSystemQueryResponse;
    // }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IAppSystem[]>>(`/appSystems${paramText}`);
      ///${this.api.config.version}
      const resData = res.data;
      console.log('resData', resData);

      if (resData.result) {
        return {
          type: 'GET_APP_SYSTEMS',
          appSystems: resData.data,
        } as types.IGetAppSystemsResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о системах',
        //err?.response?.data?.error || 'ошибка получения данных о компаниях',
      } as error.INetworkError;
    }
  };
}

export default AppSystem;
