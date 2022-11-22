import { IUserCredentials } from '@lib/types';

import api from '@lib/client-api';

import { webRequest } from '../store';

// import { error, auth as types } from '../types';
// import { sleep } from '../utils';
// import { BaseApi } from '../types/BaseApi';
// import { BaseRequest } from '../types/BaseRequest';
// import { RobustRequest, robustRequest } from '../robustRequest';

// class Auth extends BaseRequest {
//   constructor(api: BaseApi) {
//     super(api);
//   }

export const Auth = {
  // signup = async (userCredentials: IUserCredentials) => {
  // login: async (userCredentials: IUserCredentials) => api.auth.login(userCredentials, webRequest),
  // logout = async () => {
  //   if (this.api.config.debug?.isMock) {
  //     await sleep(this.api.config.debug?.mockDelay || 0);
  //     return {
  //       type: 'LOGOUT',
  //     } as types.ILogOutResponse;
  //   }
  //   try {
  //     const res = await this.api.axios.post<IResponse<undefined>>('/auth/logout');
  //     const resData = res.data;
  //     if (resData.result) {
  //       return {
  //         type: 'LOGOUT',
  //       } as types.ILogOutResponse;
  //     }
  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err instanceof TypeError ? err.message : 'ошибка выхода',
  //     } as error.INetworkError;
  //   }
  // };
  // getCurrentUser = async () => {
  //   try {
  //     const res = await this.api.axios.get<IResponse<IUser>>('/auth/user');
  //     const resData = res.data;
  //     if (resData.result) {
  //       return {
  //         type: 'GET_CURRENT_USER',
  //         user: resData.data,
  //       } as types.IUserResponse;
  //     }
  //     if (!resData.result) {
  //       return {
  //         type: 'USER_NOT_AUTHENTICATED',
  //       } as types.IUserNotAuthResponse;
  //     }
  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err instanceof TypeError ? err.message : 'ошибка получения данных о пользователе',
  //     } as error.INetworkError;
  //   }
  // };
  // verifyCode = async (code: string) => {
  //   try {
  //     const body = { code };
  //     const res = await this.api.axios.post<IResponse<string>>('/auth/device/code', body);
  //     const resData = res?.data;
  //     if (resData?.result) {
  //       return {
  //         type: 'VERIFY_CODE',
  //         uid: resData?.data,
  //       } as types.IVerifyCodeResponse;
  //     }
  //     return {
  //       type: 'ERROR',
  //       message: resData?.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err instanceof TypeError ? err.message : 'ошибка подключения',
  //     } as error.INetworkError;
  //   }
  // };
  // getDeviceStatus = async (uid: string) => {
  //   if (this.api.config.debug?.isMock) {
  //     await sleep(this.api.config.debug?.mockDelay || 0);
  //     return {
  //       type: 'GET_DEVICE_STATUS',
  //       status: 'ACTIVE',
  //     } as types.IDeviceStatusResponse; // активация устройства в mock
  //   }
  //   // try {
  //   const res = await robustRequest({ api: this.api, method: 'GET', url: `/auth/deviceStatus/${uid}` });
  //   // const res = await this.api.axios.get<IResponse<DeviceState>>(`/auth/deviceStatus/${uid}`);
  //   console.log('getDeviceStatus res', res);
  //   if (res.result === 'OK') {
  //     return {
  //       type: 'GET_DEVICE_STATUS',
  //       status: res.response.data?.data,
  //     } as types.IDeviceStatusResponse;
  //   }
  //   return {
  //     type: 'ERROR',
  //     message: res.result === 'INVALID_DATA' ||
  // res.result === 'ERROR' ? res.message : 'не получен статуса устройства',
  //   } as error.INetworkError;
  //   // } catch (err) {
  //   //   return {
  //   //     type: 'ERROR',
  //   //     message:
  //   //       err instanceof TypeError
  //   //         ? err.message
  //   //         : err instanceof AxiosError && err.code === 'ECONNABORTED'
  //   //         ? 'нет соединения с сервером'
  //   //         : 'ошибка получения статуса устройства',
  //   //   } as error.INetworkError;
  //   // }
  // };
};

export default Auth;
