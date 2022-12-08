import { IAppSystem, NewAppSystem } from '@lib/types';

import { appSystems as mockAppSystems } from '@lib/mock';

import { error, appSystem as types } from '../types';
import { generateId, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class AppSystem extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  addAppSystem = async (customRequest: CustomRequest, appSystem: NewAppSystem) => {
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

    const res = await customRequest<IAppSystem>({
      api: this.api.axios,
      method: 'POST',
      url: '/appSystems',
      data: appSystem,
    });

    if (res?.result) {
      return {
        type: 'ADD_APP_SYSTEM',
        appSystem: res.data,
      } as types.IAddAppSystemResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'подсистема не создана',
    } as error.IServerError;
  };

  updateAppSystem = async (customRequest: CustomRequest, appSystem: Partial<IAppSystem>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_APP_SYSTEM',
        appSystem: { ...appSystem, editionDate: new Date().toISOString() },
      } as types.IUpdateAppSystemResponse;
    }

    const res = await customRequest<IAppSystem>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/appSystems/${appSystem.id}`,
      data: appSystem,
    });

    if (res?.result) {
      return {
        type: 'UPDATE_APP_SYSTEM',
        appSystem: res.data,
      } as types.IUpdateAppSystemResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'подсистема не обновлена',
    } as error.IServerError;
  };

  removeAppSystem = async (customRequest: CustomRequest, appSystemId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_APP_SYSTEM',
      } as types.IRemoveAppSystemResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/appSystems/${appSystemId}`,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_APP_SYSTEM',
      } as types.IRemoveAppSystemResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'подсистема не удалена',
    } as error.IServerError;
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
      } as error.IServerError;
    }

    const res = await customRequest<IAppSystem>({
      api: this.api.axios,
      method: 'GET',
      url: `/appSystems/${appSystemId}`,
    });

    if (res?.result) {
      return {
        type: 'GET_APP_SYSTEM',
        appSystem: res.data,
      } as types.IGetAppSystemResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'данные о подсистеме не получены',
    } as error.IServerError;
  };

  getAppSystems = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_APP_SYSTEMS',
        appSystems: mockAppSystems,
      } as types.IGetAppSystemsResponse;
    }

    const res = await customRequest<IAppSystem[]>({ api: this.api.axios, method: 'GET', url: '/appSystems', params });

    if (res?.result) {
      return {
        type: 'GET_APP_SYSTEMS',
        appSystems: res.data,
      } as types.IGetAppSystemsResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'данные о подсистемах не получены',
    } as error.IServerError;
  };
}

export default AppSystem;
