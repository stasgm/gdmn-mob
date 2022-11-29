import { IRequestParams, robustRequest, CustomRequest } from '@lib/client-api';

import { fetch } from '@react-native-community/netinfo';

export const mobileRequest =
  (dispatch: any, actions: any): CustomRequest =>
  async <T>(params: IRequestParams) => {
    const res = await robustRequest(params);
    switch (res.result) {
      case 'OK': {
        //Если пришел ответ, что не пройдена авторизация
        if (res.response.data.status === 401) {
          dispatch(actions.setErrorMessage('Не пройдена авторизация. Повторите вход в приложение'));
          dispatch(actions.logout());
          break;
        } else {
          return res.response.data as T;
        }
      }
      case 'TIMEOUT':
        dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
        break;

      case 'SERVER_ERROR': {
        //Если пришел ответ с ошибкой сети
        const state = await fetch();
        if (!state.isConnected) {
          dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
        } else {
          dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
        }
      }
    }

    return;
  };
