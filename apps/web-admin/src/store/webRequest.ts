import { IRequestParams, robustRequest, CustomRequest } from '@lib/client-api';

export const webRequest =
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
        dispatch(actions.setErrorMessage('Не удается получить ответ от сервер'));
        break;

      case 'NO_CONNECTION': {
        //Если пришел ответ с ошибкой сети
        if (!navigator.onLine) {
          dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
        } else {
          dispatch(actions.setErrorMessage('Не удается получить ответ от сервера'));
        }
      }
    }

    return;
  };
