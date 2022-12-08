// import { IResponse } from '@lib/types';
// import { AxiosError } from 'axios';
// import { Dispatch } from 'react';

// import { IRequestParams, robustRequest } from './robustRequest';

// export type CustomRequest = <T>(params: IRequestParams) => Promise<IResponse<T> | undefined>;

// export const customRequest =
//   <T>(dispatch: Dispatch<any>, actions: any): CustomRequest =>
//   async <T>(params: IRequestParams) => {
//     const res = await robustRequest(params);
//     console.log('mobileRequest res ', res);

//     // //Если пришел ответ с ошибкой сети
//     // if (res.result === 'SERVER_ERROR' && res.response.error instanceof types.AxiosError) {
//     //   const code = res.response.error.code;
//     //   console.log('code', code);
//     //   if (code === 'ECONNABORTED' || code === 'ERR_NETWORK') {
//     //     return {
//     //       ...res,
//     //       result: code === 'ECONNABORTED' ? 'TIMEOUT' : 'NO_CONNECTION',
//     //     };
//     //   }
//     // }
//     console.log('mobileRequest', res);
//     switch (res.result) {
//       case 'OK': {
//         //Если пришел ответ, что не пройдена авторизация
//         if (res.response.status === 401) {
//           dispatch(actions.setErrorMessage('Не пройдена авторизация. Повторите вход в приложение'));
//           dispatch(actions.logout());
//           break;
//         } else {
//           return res.response.data;
//         }
//       }
//       case 'TIMEOUT':
//         dispatch(actions.setErrorMessage('Не удается получить ответ от сервера. Проверьте настройки подключения'));
//         break;

//       case 'SERVER_ERROR': {
//         //Если пришел ответ с ошибкой сети
//         if (res.response.data instanceof AxiosError) {
//           const code = res.response.data.code;
//           if (code === 'ECONNABORTED') {
//             dispatch(actions.setErrorMessage('Не удается получить ответ от сервера.
//Проверьте настройки подключения'));
//             // return { result: 'TIMEOUT' } as IServerUnreacheableResult;
//           } else if (code === 'ERR_NETWORK') {
//             dispatch(actions.setErrorMessage('Отсутствует соединение с интернетом'));
//             // return { result: 'NO_CONNECTION' } as IServerUnreacheableResult;
//           }
//         }
//       }
//     }

//     return;
//   };
