import { authActions } from '@lib/store';
import { IResponse } from '@lib/types';
import { AxiosError } from 'axios';
import { Dispatch } from 'react';

import { IRequestParams, robustRequest } from './robustRequest';

export type CustomRequest = <T>(params: IRequestParams) => Promise<IResponse<T> | undefined>;

export const customRequest =
  (dispatch: Dispatch<any>): CustomRequest =>
  async (params: IRequestParams) => {
    const res = await robustRequest(params);
    console.log('mobileRequest res ', res);

    // //Если пришел ответ с ошибкой сети
    // if (res.result === 'SERVER_ERROR' && res.response.error instanceof types.AxiosError) {
    //   const code = res.response.error.code;
    //   console.log('code', code);
    //   if (code === 'ECONNABORTED' || code === 'ERR_NETWORK') {
    //     return {
    //       ...res,
    //       result: code === 'ECONNABORTED' ? 'TIMEOUT' : 'NO_CONNECTION',
    //     };
    //   }
    // }
    console.log('mobileRequest', res);
    switch (res.result) {
      case 'OK': {
        //Если пришел ответ, что не пройдена авторизация
        if (res.response.status === 401) {
          dispatch(authActions.setErrorMessage('Не пройдена авторизация. Повторите вход в приложение'));
          dispatch(authActions.logout());
          break;
        } else {
          return res.response.data;
        }
      }
      case 'TIMEOUT':
        dispatch(authActions.setErrorMessage('Не удается получить ответ от сервера. Проверьте адрес сервера'));
        break;

      case 'SERVER_ERROR': {
        //Если пришел ответ с ошибкой сети
        if (res.response.data instanceof AxiosError) {
          const code = res.response.data.code;
          if (code === 'ECONNABORTED') {
            dispatch(authActions.setErrorMessage('Не удается получить ответ от сервера. Проверьте адрес сервера'));
            // return { result: 'TIMEOUT' } as IServerUnreacheableResult;
          } else if (code === 'ERR_NETWORK') {
            dispatch(authActions.setErrorMessage('Отсутствует соединение с интернетом'));
            // return { result: 'NO_CONNECTION' } as IServerUnreacheableResult;
          }
        }
      }
    }

    return;
  };
