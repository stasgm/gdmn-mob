import { authActions, useAuthThunkDispatch, useSelector } from '@lib/store';
import { useCallback, useMemo } from 'react';
import api from '@lib/client-api';

import { mobileRequest } from './mobileRequest';

export const useCheckDeviceStatus = () => {
  const authDispatch = useAuthThunkDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);

  const { company, config, appSystem, connectionStatus } = useSelector((state) => state.auth);

  return useCallback(async () => {
    try {
      if (!company || !appSystem || !config.deviceId) {
        throw new Error(
          `Не определены данные: компания ${company?.name}, подсистема ${appSystem?.name}, id устройства ${config.deviceId}`,
        );
      }

      const statusRespone = await api.auth.getDeviceStatus(appRequest, config.deviceId);

      if (statusRespone.type !== 'GET_DEVICE_STATUS') {
        throw new Error(statusRespone.message);
      } else {
        const status = statusRespone.status === 'ACTIVE' ? 'connected' : 'not-activated';
        if (status !== connectionStatus) {
          authDispatch(authActions.setConnectionStatus(connectionStatus));
        }
      }
    } catch (error: any) {
      throw new Error(`Статус устройства не получен. ${typeof error.message === 'string' ? error.message : ''}`);
    }

    return true;
  }, [appRequest, appSystem, authDispatch, company, config.deviceId, connectionStatus]);
};
