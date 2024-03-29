import { useDispatch, useSelector, appActions, authActions, useAuthThunkDispatch } from '@lib/store';
import { ICmdParams, IMessage } from '@lib/types';
import api from '@lib/client-api';
import { useCallback, useMemo } from 'react';

import { mobileRequest } from '../mobileRequest';
import { addError, addRequestNotice } from '../utils';

import { useCheckDeviceStatus } from '../useCheckDeviceStatus';

import { getNextOrder, needRequest } from './helpers';

export const useSendOneRefRequest = (description: string, params: ICmdParams) => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const checkDeviceStatus = useCheckDeviceStatus();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const syncRequests = useSelector((state) => state.app.syncRequests);

  return useCallback(async () => {
    try {
      dispatch(appActions.setLoading(true));
      dispatch(appActions.clearRequestNotice());
      dispatch(appActions.clearErrorNotice());

      if (!user || !company || !appSystem || !user.erpUser || !config.deviceId) {
        throw new Error(
          `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}, id устройства ${config.deviceId}`,
        );
      }

      addRequestNotice(dispatch, 'Проверка статуса устройства');
      await checkDeviceStatus();

      const currentDate = new Date();

      //Если запрос за остатками не был отправлен или время запроса меньше текущего на час, то отправляем
      //Для других справочников отправляем всегда
      const isRemains = typeof params === 'object' && 'name' in params && params.name === 'remains';
      const needSendRequest = isRemains ? needRequest(syncRequests, 'GET_REMAINS', currentDate) : true;

      if (needSendRequest) {
        addRequestNotice(dispatch, `Запрос на получение справочника: ${description}`);

        //Формируем запрос на получение справочника
        const messageGetRef: IMessage['body'] = {
          type: 'CMD',
          version: 1,
          payload: {
            name: 'GET_ONE_REF',
            params,
          },
        };

        //Отправляем запрос на получение справочника
        const sendMesRefResponse = await api.message.sendMessages(
          appRequest,
          appSystem,
          { id: company.id, name: company.name },
          user.erpUser,
          messageGetRef,
          getNextOrder(),
          config.deviceId,
        );

        if (sendMesRefResponse.type !== 'SEND_MESSAGE') {
          throw new Error(`Запрос за справочником не выполнен: ${sendMesRefResponse.message}`);
        } else if (sendMesRefResponse.type === 'SEND_MESSAGE' && isRemains) {
          //Если запрос за остатками, то добавляем его в список запросов
          dispatch(
            appActions.addSyncRequest({
              cmdName: 'GET_REMAINS',
              date: currentDate,
            }),
          );
        }
      }
    } catch (error: any) {
      addError(
        dispatch,
        'useSendOneRefRequest:',
        typeof error.message === 'string' ? error.message : 'Ошибка отправки запроса за справочником',
        'useSendOneRefRequest',
        false,
      );

      dispatch(appActions.setShowSyncInfo(true));
    } finally {
      dispatch(appActions.setLoading(false));
    }
  }, [
    appRequest,
    appSystem,
    checkDeviceStatus,
    company,
    config.deviceId,
    description,
    dispatch,
    params,
    syncRequests,
    user,
  ]);
};
