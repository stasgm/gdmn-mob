import { IRequestParams, robustRequest, CustomRequest } from '@lib/client-api';

import { fetch } from '@react-native-community/netinfo';

export const mobileRequest =
  (dispatch: any, actions: any): CustomRequest =>
  async <T>(params: IRequestParams) => {
    dispatch(actions.setErrorMessage(''));
    const res = await robustRequest(params);

    switch (res.result) {
      case 'OK': {
        //Если пришел ответ, что не пройдена авторизация
        if (res.response.data.status === 401) {
          dispatch(actions.setErrorMessage('Не пройдена авторизация пользователя. Повторите вход в приложение'));
          dispatch(actions.logout());
        }
        return res.response.data as T;
      }
      case 'SERVER_ERROR': {
        return res.response.data;
      }
      case 'TIMEOUT':
        dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
        break;

      case 'NO_CONNECTION': {
        //Если пришел ответ с ошибкой сети
        const state = await fetch();
        if (state.isConnected) {
          dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
        } else {
          dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
        }
      }
    }

    return;
  };
