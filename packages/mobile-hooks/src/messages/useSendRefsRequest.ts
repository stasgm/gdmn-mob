import {
  useDispatch,
  useSelector,
  appActions,
  authActions,
  useAuthThunkDispatch,
  useAppStore,
  RootState,
} from '@lib/store';

import { IDeviceLogEntry, IMessage } from '@lib/types';
import api, { isConnectError } from '@lib/client-api';

import { useMemo } from 'react';

import { generateId } from '../utils';

import { mobileRequest } from '../mobileRequest';

import { getNextOrder, needRequest } from './helpers';
import { useSendDeviceLog } from './useSendDeviceLog';

export const useSendRefsRequest = () => {
  const dispatch = useDispatch();
  const authDispatch = useAuthThunkDispatch();
  const appRequest = useMemo(() => mobileRequest(authDispatch, authActions), [authDispatch]);
  const store = useAppStore();

  const { user, company, config, appSystem } = useSelector((state) => state.auth);
  const refVersion = 1;
  const deviceId = config.deviceId!;
  const saveErrors = useSendDeviceLog();

  const addRequestNotice = (message: string) => {
    dispatch(
      appActions.addRequestNotice({
        started: new Date(),
        message,
      }),
    );
  };

  const addError = (name: string, message: string, tempErrs: IDeviceLogEntry[]) => {
    const err = {
      id: generateId(),
      name,
      date: new Date().toISOString(),
      message,
    };
    dispatch(appActions.addErrorNotice(err));
    tempErrs.push(err);
  };

  return async () => {
    dispatch(appActions.setLoading(true));
    dispatch(appActions.clearRequestNotice());
    dispatch(appActions.clearErrorNotice());
    const tempErrs: IDeviceLogEntry[] = [];
    let connectError = false;

    if (!user || !company || !appSystem || !user.erpUser) {
      addError(
        'useSendRefsRequest',
        `Не определены данные: пользователь ${user?.name}, компания ${company?.name}, подсистема ${appSystem?.name}, пользователь ERP ${user?.erpUser?.name}`,
        tempErrs,
      );
    } else {
      addRequestNotice('Проверка статуса устройства');
      const statusRespone = await api.auth.getDeviceStatus(appRequest, deviceId);
      if (statusRespone.type !== 'GET_DEVICE_STATUS') {
        addError(
          'useSendRefsRequest: getDeviceStatus',
          `Статус устройства не получен. ${statusRespone.message}`,
          tempErrs,
        );
        connectError = isConnectError(statusRespone.type);
      } else {
        authDispatch(
          authActions.setConnectionStatus(statusRespone.status === 'ACTIVE' ? 'connected' : 'not-activated'),
        );
      }
      if (!tempErrs.length) {
        const state = store.getState() as RootState;
        const currentDate = new Date();
        const syncRequests = state.app.syncRequests || [];
        //Если запрос такого типа не был отправлен или время запроса меньше текущего на час, то отправляем
        if (needRequest(syncRequests, 'GET_REF', currentDate)) {
          addRequestNotice('Запрос на получение справочников');
          const messageCompany = { id: company.id, name: company.name };
          const consumer = user.erpUser;

          //Формируем запрос на получение справочников
          const messageGetRef: IMessage['body'] = {
            type: 'CMD',
            version: refVersion,
            payload: {
              name: 'GET_REF',
            },
          };

          //Отправляем запрос на получение справочников
          const sendMesRefResponse = await api.message.sendMessages(
            appRequest,
            appSystem,
            messageCompany,
            consumer,
            messageGetRef,
            getNextOrder(),
            deviceId,
          );

          if (sendMesRefResponse?.type !== 'SEND_MESSAGE') {
            addError('useSendRefsRequest: api.message.sendMessages', sendMesRefResponse.message, tempErrs);
          } else if (sendMesRefResponse.type === 'SEND_MESSAGE') {
            dispatch(
              appActions.addSyncRequest({
                cmdName: 'GET_REF',
                date: currentDate,
              }),
            );
          }
        }
      }
    }

    if (tempErrs.length) {
      dispatch(appActions.setShowSyncInfo(true));
    }

    if (!connectError) {
      saveErrors(tempErrs);
    } else if (tempErrs.length) {
      dispatch(appActions.addErrors(tempErrs));
    }

    dispatch(appActions.setLoading(false));
  };
};
