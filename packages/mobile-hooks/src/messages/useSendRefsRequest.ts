import { useDispatch, useSelector, appActions, authActions, useAuthThunkDispatch } from '@lib/store';

import { IMessage } from '@lib/types';
import api from '@lib/client-api';

import { useCallback, useMemo } from 'react';

import { addError, addRequestNotice } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { useCheckDeviceStatus } from '../useCheckDeviceStatus';

import { getNextOrder, needRequest } from './helpers';

export const useSendRefsRequest = () => {
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
      //Если запрос такого типа не был отправлен или время запроса меньше текущего на час, то отправляем
      if (needRequest(syncRequests, 'GET_REF', currentDate)) {
        addRequestNotice(dispatch, 'Запрос на получение справочников');

        //Формируем запрос на получение справочников
        const messageGetRef: IMessage['body'] = {
          type: 'CMD',
          version: 1,
          payload: {
            name: 'GET_REF',
          },
        };

        //Отправляем запрос на получение справочников
        const sendMesRefResponse = await api.message.sendMessages(
          appRequest,
          appSystem,
          { id: company.id, name: company.name },
          user.erpUser,
          messageGetRef,
          getNextOrder(),
          config.deviceId,
        );

        if (sendMesRefResponse?.type !== 'SEND_MESSAGE') {
          throw new Error(`Запрос за справочниками не выполнен: ${sendMesRefResponse.message}`);
        } else if (sendMesRefResponse.type === 'SEND_MESSAGE') {
          //Добавляем запрос в список запросов, чтобы не отправлять его повторно
          dispatch(
            appActions.addSyncRequest({
              cmdName: 'GET_REF',
              date: currentDate,
            }),
          );
        }
      }
    } catch (error: any) {
      addError(
        dispatch,
        'useSendRefsRequest:',
        typeof error.message === 'string' ? error.message : 'Ошибка отправки запроса за справочниками',
        'useSendRefsRequest',
        false,
      );

      dispatch(appActions.setShowSyncInfo(true));
    } finally {
      dispatch(appActions.setLoading(false));
    }
  }, [appRequest, appSystem, checkDeviceStatus, company, config.deviceId, dispatch, syncRequests, user]);
};
