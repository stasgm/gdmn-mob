import { appActions, authActions, useAppStore, useAuthThunkDispatch, useDispatch } from '@lib/store';
import { useCallback, useMemo } from 'react';
import api from '@lib/client-api';
import Constants from 'expo-constants';

import { mobileRequest } from './mobileRequest';
import { addError, getRootState, addRequestNotice } from './utils';
import { useCheckDeviceStatus } from './useCheckDeviceStatus';

export const useSendDeviceLog = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const store = useAppStore();
  const checkDeviceStatus = useCheckDeviceStatus();

  return useCallback(async () => {
    try {
      const { company, appSystem } = getRootState(store).auth;
      const { errorLog } = getRootState(store).app;
      const settings = getRootState(store).settings.data;
      const unsentErrors = errorLog.filter((err) => !err.isSent);

      if (unsentErrors.length === 0) {
        return;
      }

      if (!company || !appSystem) {
        throw new Error(`Не определены данные: компания ${company?.name}, подсистема ${appSystem?.name}`);
      }

      await checkDeviceStatus();

      addRequestNotice(dispatch, 'Отправка логов устройства');

      //TODO: Добавить логирование действий

      const addDeviceLogResponse = await api.deviceLog.addDeviceLog(
        appRequest,
        company.id,
        appSystem.id,
        unsentErrors,
        Constants.expoConfig?.version || '',
        settings,
      );

      if (addDeviceLogResponse.type === 'ADD_DEVICELOG') {
        dispatch(appActions.setSentErrors(unsentErrors.map((l) => l.id)));
      } else {
        throw new Error(`Данные по приложению не отправлены: ${addDeviceLogResponse.message}`);
      }
    } catch (error: any) {
      addError(
        dispatch,
        'useSendDeviceData:',
        typeof error.message === 'string' ? error.message : 'Ошибка отправки данных устройства',
        'useSendDeviceData',
        false,
      );
    } finally {
      // Чистим старые ошибки
      dispatch(appActions.clearErrors('old'));
    }
  }, [appRequest, checkDeviceStatus, dispatch, store]);
};
