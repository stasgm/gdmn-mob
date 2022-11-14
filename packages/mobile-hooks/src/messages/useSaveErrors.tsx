import api from '@lib/client-api';
import { appActions, useDispatch, useSelector } from '@lib/store';
import { useEffect, useCallback } from 'react';

export const useSaveErrors = () => {
  const dispatch = useDispatch();
  const errorLog = useSelector((state) => state.app.errorLog);
  const { company, appSystem } = useSelector((state) => state.auth);

  const saveErrors = useCallback(async () => {
    // Неотправленные ошибки, если есть, передаем на сервер
    const sendingErrors = errorLog.filter((err) => err.isSent !== true);
    if (sendingErrors.length) {
      const addDeviceLogResponse = await api.deviceLog.addDeviceLog(company!.id, appSystem!.id, sendingErrors);
      if (addDeviceLogResponse.type !== 'ERROR') {
        //Устанавливаем признак 'Отправлен на сервер' переданным записям
        dispatch(appActions.setSentErrors(sendingErrors.map((l) => l.id)));
      }
      //Чистим старые ошибки
      dispatch(appActions.clearErrors('old'));
    }
  }, [errorLog, company, appSystem]);

  return { saveErrors };
};
