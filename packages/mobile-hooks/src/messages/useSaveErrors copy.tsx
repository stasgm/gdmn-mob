import api from '@lib/client-api';
import { appActions, authActions, useDispatch, useSelector } from '@lib/store';
import { IDeviceLog } from '@lib/types';
import { useCallback } from 'react';

import { mobileRequest } from '../mobileRequest';
import { generateId } from '../utils';

export const useSaveErrorsOld = () => {
  const dispatch = useDispatch();
  const errorLog = useSelector((state) => state.app.errorLog || []);
  const { company, appSystem } = useSelector((state) => state.auth);

  const saveErrors = useCallback(
    async (errs: IDeviceLog[]) => {
      // Неотправленные ошибки, если есть, передаем на сервер
      const sendingErrors = errorLog.filter((err) => err.isSent !== true);

      if (sendingErrors.length || errs.length) {
        const addDeviceLogResponse = await api.deviceLog.addDeviceLog(
          mobileRequest(dispatch, authActions),
          company!.id,
          appSystem!.id,
          sendingErrors.concat(errs),
        );
        if (addDeviceLogResponse.type === 'ADD_DEVICELOG') {
          //Сохраняем новые ошибки со статусом Отправлен
          dispatch(appActions.addErrors(errs.map((r) => ({ ...r, isSent: true }))));
          //Устанавливаем признак 'Отправлен на сервер' переданным записям
          dispatch(appActions.setSentErrors(sendingErrors.map((l) => l.id)));
        } else {
          errs.push({
            id: generateId(),
            name: 'useSaveErrors: addDeviceLog',
            date: new Date().toISOString(),
            message: `Ошибки не отправлены на сервер: ${addDeviceLogResponse.message}`,
          });
          //Сохраняем ошибки, отправим их в следующий раз
          dispatch(appActions.addErrors(errs));
        }
        //Чистим старые ошибки
        dispatch(appActions.clearErrors('old'));
      }
    },
    [errorLog, dispatch, company, appSystem],
  );

  return { saveErrors };
};
