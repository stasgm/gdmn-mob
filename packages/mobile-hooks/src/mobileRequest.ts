import { IRequestParams, robustRequest, CustomRequest } from '@lib/client-api';

import { fetch } from '@react-native-community/netinfo';

export const mobileRequest =
  (dispatch: any, actions: any): CustomRequest =>
  async (params: IRequestParams) => {
    dispatch(actions.setErrorMessage(''));
    const res = await robustRequest(params);

    switch (res.type) {
      case 'FAILURE': {
        //Если пришел ответ, что не пройдена авторизация
        if (res.status === 401) {
          dispatch(actions.setErrorMessage('Не пройдена авторизация пользователя. Повторите вход в приложение'));
          dispatch(actions.logout());
          return { ...res, type: 'UNAUTHORIZED' };
        }
        return res;
      }
      case 'SERVER_TIMEOUT':
        dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
        return res;

      case 'NO_CONNECTION': {
        //Если пришел ответ с ошибкой сети
        const state = await fetch();
        if (state.isConnected) {
          dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
          return { type: 'SERVER_TIMEOUT' };
        } else {
          dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
          return res;
        }
      }
    }

    return res;
  };
