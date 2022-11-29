import { IResponse, IAppSystem, NewAppSystem } from '@lib/types';

import { appSystems as mockAppSystems } from '@lib/mock';

import { error, appSystem as types } from '../types';
import { generateId, getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

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
          id: generateId(),
          editionDate: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
      } as types.IAddAppSystemResponse;
    }

    try {
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
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка создания подсистемы',
        // message: err?.response?.data?.error || 'ошибка создания подсистемы',
      } as error.INetworkError;
    }
  };

  updateAppSystem = async (appSystem: Partial<IAppSystem>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_APP_SYSTEM',
        appSystem: { ...appSystem, editionDate: new Date().toISOString() },
      } as types.IUpdateAppSystemResponse;
    }

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
        message: err instanceof TypeError ? err.message : 'ошибка удаления подсистемы',
      } as error.INetworkError;
    }
  };

  getAppSystem = async (customRequest: CustomRequest, appSystemId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      const appSystem = mockAppSystems.find((item) => item.id === appSystemId);

      if (appSystem) {
        return {
          type: 'GET_APP_SYSTEM',
          appSystem,
        } as types.IGetAppSystemResponse;
      }

      return {
        type: 'ERROR',
        message: 'подсистема не найдена',
      } as error.INetworkError;
    }
    // try {
    //   const res = await this.api.axios.get<IResponse<IAppSystem>>(`/appSystems/${appSystemId}`);
    //   const resData = res.data;
    const res = await customRequest<IAppSystem>({ api: this.api, method: 'GET', url: `/appSystems/${appSystemId}` });

    if (res?.result) {
      return {
        type: 'GET_APP_SYSTEM',
        appSystem: res.data,
      } as types.IGetAppSystemResponse;
    }

    return {
      type: 'ERROR',
      message: res?.error || 'данные о подсистеме не получены',
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err instanceof TypeError ? err.message : 'ошибка получения данных о подсистеме',
    //   } as error.INetworkError;
    // }
  };

  getAppSystems = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_APP_SYSTEMS',
        appSystems: mockAppSystems,
      } as types.IGetAppSystemsResponse;
    }

    // let paramText = params ? getParams(params) : '';

    // if (paramText > '') {
    //   paramText = `?${paramText}`;
    // }

    // try {
    //   const res = await this.api.axios.get<IResponse<IAppSystem[]>>(`/appSystems${paramText}`);
    //   ///${this.api.config.version}
    //   const resData = res.data;
    const res = await customRequest<IAppSystem[]>({ api: this.api, method: 'GET', url: '/appSystems', params });

    if (res?.result) {
      return {
        type: 'GET_APP_SYSTEMS',
        appSystems: res.data,
      } as types.IGetAppSystemsResponse;
    }

    return {
      type: 'ERROR',
      message: res?.error || 'данные о подсистемах не получены',
    } as error.INetworkError;
    // } catch (err) {
    //   return {
    //     type: 'ERROR',
    //     message: err instanceof TypeError ? err.message : 'ошибка получения данных о системах',
    //   } as error.INetworkError;
    // }
  };
}

export default AppSystem;
