import { IRequestParams, robustRequest, CustomRequest } from '@lib/client-api';

export const webRequest =
  (dispatch: any, actions: any): CustomRequest =>
  async (params: IRequestParams) => {
    dispatch(actions.setErrorMessage(''));
    const res = await robustRequest(params);
    // console.log('res params', params);
    window.localStorage.setItem('lastParams', params.params ? JSON.stringify(params.params) : '');

    switch (res.type) {
      case 'FAILURE': {
        //Если пришел ответ, что не пройдена авторизация
        if (res.status === 401) {
          dispatch(actions.setErrorMessage(res.error));
          dispatch(actions.logout());
          return { ...res, type: 'UNAUTHORIZED' };
        }
        return res;
      }
      case 'SERVER_TIMEOUT':
        dispatch(actions.setErrorMessage('Не удается получить ответ от сервера'));
        return res;

      case 'NO_CONNECTION': {
        //Если пришел ответ с ошибкой сети
        if (!navigator.onLine) {
          dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
          return { type: 'SERVER_TIMEOUT' };
        } else {
          dispatch(actions.setErrorMessage('Не удается получить ответ от сервера'));
          return res;
        }
      }
    }

    return res;
  };
