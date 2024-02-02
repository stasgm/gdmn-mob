import api from '@lib/client-api';
import { appActions, authActions, useDispatch, useSelector } from '@lib/store';
import { IDeviceLog } from '@lib/types';
import { useCallback } from 'react';

import Constants from 'expo-constants';

import { mobileRequest } from '../mobileRequest';
import { generateId } from '../utils';

export const useSendDeviceLog = () => {
  const dispatch = useDispatch();
  const errorLog = useSelector((state) => state.app.errorLog || []);
  const { company, appSystem } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);

  return useCallback(
    async (errs: IDeviceLog[] = []) => {
      // Неотправленные ошибки, если есть, передаем на сервер
      const sendingErrors = errorLog.filter((err) => err.isSent !== true);

      if (errs.length) {
        sendingErrors.concat(errs);
      }
      const addDeviceLogResponse = await api.deviceLog.addDeviceLog(
        mobileRequest(dispatch, authActions),
        company!.id,
        appSystem!.id,
        sendingErrors,
        Constants.expoConfig?.version || '',
        settings,
      );
      if (addDeviceLogResponse.type === 'ADD_DEVICELOG') {
        if (sendingErrors.length) {
          if (errs.length) {
            //Сохраняем новые ошибки со статусом Отправлен
            dispatch(appActions.addErrors(errs.map((r) => ({ ...r, isSent: true }))));
          }
          //Устанавливаем признак 'Отправлен на сервер' переданным записям
          dispatch(appActions.setSentErrors(sendingErrors.map((l) => l.id)));
        }
      } else {
        errs.push({
          id: generateId(),
          name: 'useSendDeviceLog: addDeviceLog',
          date: new Date().toISOString(),
          message: `Данные по приложению не отправлены на сервер: ${addDeviceLogResponse.message}`,
        });
        //Сохраняем ошибки, отправим их в следующий раз
        dispatch(appActions.addErrors(errs));
      }
      //Чистим старые ошибки
      dispatch(appActions.clearErrors('old'));
    },
    [errorLog, dispatch, company, appSystem, settings],
  );
};
